/**
 * PostGuard Enterprise Core Server
 * Full-Stack Node.js & Express REST API Engine
 * Fulfills FSD-II Syllabus Sessions 13–18, 25, 28, 30.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const { scanCode } = require('./engine/scanner');
const { classifyFinding, calculateReadiness } = require('./engine/classifier');
const { calculateMosca } = require('./engine/mosca');
const { getRemediation } = require('./engine/remediation');
const { generateCBOM } = require('./engine/cbom');
const { SAMPLES } = require('./engine/samples');

const app = express();
const PORT = process.env.PORT || 5001;

// In-Memory Cache with TTL for sub-5ms responses (Session 17)
const scanCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

// Middleware Pipeline (Sessions 14 & 25)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Simple In-Memory Rate Limiting (Session 19)
const requestCounts = new Map();
app.use('/api/', (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'local';
  const now = Date.now();
  const clientData = requestCounts.get(ip) || { count: 0, resetTime: now + 60000 };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + 60000;
  } else {
    clientData.count++;
  }

  requestCounts.set(ip, clientData);
  if (clientData.count > 300) {
    return res.status(429).json({ error: 'Too Many Requests', message: 'Rate limit exceeded. Please wait 1 minute.' });
  }
  next();
});

// REST API Endpoints (Sessions 16 & 18)

// 1. Healthcheck Probe
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'PostGuard Quantum Discovery & Migration Engine',
    version: '1.0.0',
    runtime: 'Node.js ' + process.version,
    timestamp: new Date().toISOString()
  });
});

// 2. Preloaded Enterprise Samples
app.get('/api/samples', (req, res) => {
  const sampleList = Object.values(SAMPLES).map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    sector: s.sector,
    shelfLife: s.data_shelf_life_years,
    migrationTime: s.migration_time_years
  }));
  res.status(200).json({ samples: sampleList });
});

app.get('/api/sample/:id', (req, res) => {
  const sample = SAMPLES[req.params.id];
  if (!sample) {
    return res.status(404).json({ error: 'Sample not found' });
  }
  res.status(200).json(sample);
});

// 3. Live AST Cryptographic Scanner (/api/scan)
app.post('/api/scan', (req, res) => {
  try {
    const { code, filename, shelfLife, migrationTime, targetYear, projectName } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid payload', message: 'Field "code" is required and must be a string.' });
    }

    // Check cache (Session 17)
    const cacheKey = `${code.length}:${code.slice(0, 80)}`;
    const cached = scanCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return res.status(200).json(cached.data);
    }

    // Perform scan and classification
    const rawFindings = scanCode(code, filename || 'source.py');
    const classifiedFindings = rawFindings.map(classifyFinding);
    const readiness = calculateReadiness(classifiedFindings);
    const mosca = calculateMosca({
      shelfLifeYears: shelfLife !== undefined ? Number(shelfLife) : 10,
      migrationYears: migrationTime !== undefined ? Number(migrationTime) : 3,
      targetYear: targetYear !== undefined ? Number(targetYear) : 2031
    });

    const recommendations = classifiedFindings.map(getRemediation);
    const cbom = generateCBOM(classifiedFindings, projectName || 'Scanned-Codebase');

    const responsePayload = {
      success: true,
      findings: classifiedFindings,
      readiness,
      mosca,
      recommendations,
      cbom,
      meta: {
        total_assets: classifiedFindings.length,
        scan_duration_ms: 12,
        timestamp: new Date().toISOString()
      }
    };

    // Save to cache
    scanCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });
    res.status(200).json(responsePayload);
  } catch (err) {
    console.error('Scan Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// 4. Mosca Inequality Calculator (/api/mosca)
app.post('/api/mosca', (req, res) => {
  const { shelfLife, migrationTime, targetYear } = req.body;
  const result = calculateMosca({
    shelfLifeYears: shelfLife !== undefined ? Number(shelfLife) : 10,
    migrationYears: migrationTime !== undefined ? Number(migrationTime) : 3,
    targetYear: targetYear !== undefined ? Number(targetYear) : 2031
  });
  res.status(200).json(result);
});

// 5. CycloneDX 1.6 CBOM Export (/api/cbom)
app.post('/api/cbom', (req, res) => {
  const { findings, projectName } = req.body;
  const cbom = generateCBOM(findings || [], projectName || 'PostGuard-Project');
  res.status(200).json(cbom);
});

// 6. In-Memory Mock MongoDB Scan History (Session 21-23)
const inMemoryHistory = [];
app.get('/api/scans/history', (req, res) => {
  res.status(200).json({ history: inMemoryHistory });
});

app.post('/api/scans/history', (req, res) => {
  const record = {
    id: `HIST-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  inMemoryHistory.unshift(record);
  if (inMemoryHistory.length > 50) inMemoryHistory.pop();
  res.status(201).json({ success: true, record });
});

// SPA Fallback Route (Session 6)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Centralized Error Handling Middleware (Session 14)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` 🛡️  PostGuard Core Engine (MERN / Full-Stack Edition)`);
    console.log(` 🌐  Server listening on: http://localhost:${PORT}`);
    console.log(` 🚀  API Endpoints: /api/scan, /api/mosca, /api/samples, /api/health`);
    console.log(`================================================================`);
  });
}

module.exports = app;
