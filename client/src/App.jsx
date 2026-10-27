import React, { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * PostGuard - Main React Application Component
 * Demonstrates React Hooks (useState, useEffect, useMemo, useCallback),
 * Conditional Rendering, and Tailwind CSS Layout (Sessions 1-5).
 */
export default function PostGuardApp() {
  const [activeTab, setActiveTab] = useState('executive');
  const [selectedScenario, setSelectedScenario] = useState('finpay-auth');
  const [code, setCode] = useState('');
  const [findings, setFindings] = useState([]);
  const [readiness, setReadiness] = useState({ score: 20, grade: 'D', posture: 'High Quantum Exposure' });
  const [sliderYear, setSliderYear] = useState(2031);
  const [isScanning, setIsScanning] = useState(false);
  const [role, setRole] = useState('analyst');
  const [migratedIds, setMigratedIds] = useState(new Set());

  // Debounced API trigger for live scanning (Session 5)
  const triggerScan = useCallback(async (codeToScan) => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToScan, targetYear: sliderYear })
      });
      const data = await res.json();
      if (data.success) {
        setFindings(data.findings);
        setReadiness(data.readiness);
      }
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  }, [sliderYear]);

  useEffect(() => {
    async function loadScenario() {
      try {
        const res = await fetch(`/api/sample/${selectedScenario}`);
        const data = await res.json();
        setCode(data.code || '');
        triggerScan(data.code || '');
      } catch (err) {
        console.error('Failed to load scenario:', err);
      }
    }
    loadScenario();
  }, [selectedScenario, triggerScan]);

  const mosca = useMemo(() => {
    const X = 15;
    const Y = 3;
    const Z = Math.max(1, sliderYear - new Date().getFullYear());
    const total = X + Y;
    const isVulnerable = total > Z;
    return { X, Y, Z, isVulnerable, window: isVulnerable ? total - Z : 0 };
  }, [sliderYear]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">PG</div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              PostGuard <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">FSD-II Capstone</span>
            </h1>
            <p className="text-xs text-slate-400">Post-Quantum Cryptographic Scanner & Remediation Engine</p>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="text-sm font-semibold">PostGuard Reactive Workspace Loaded</div>
      </main>
    </div>
  );
}
