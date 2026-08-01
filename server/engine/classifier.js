/**
 * Quantum Threat Classifier for PostGuard
 * Classifies cryptographic primitives against quantum vulnerabilities
 * (Shor's Algorithm, Grover's Algorithm) and assigns NIST migration status.
 */

const THREAT_RULES = {
  'RSA': {
    threat_level: 'CRITICAL',
    shor_vulnerable: true,
    grover_vulnerable: false,
    nist_status: 'Quantum-Exposed (Breakable via Shor)',
    reason: 'Shor\'s algorithm solves integer factorization in polynomial time O((log N)^3), completely breaking RSA public-key encryption and digital signatures once a CRQC reaches ~4,000 logical qubits.',
    nist_replacement: 'NIST FIPS 203 (ML-KEM) for key establishment; NIST FIPS 204 (ML-DSA) for digital signatures.'
  },
  'ECC': {
    threat_level: 'CRITICAL',
    shor_vulnerable: true,
    grover_vulnerable: false,
    nist_status: 'Quantum-Exposed (Breakable via Shor)',
    reason: 'Shor\'s algorithm solves discrete logarithms over elliptic curve groups in polynomial time, completely breaking ECDSA, ECDH, and Ed25519.',
    nist_replacement: 'NIST FIPS 203 (ML-KEM-768) or NIST FIPS 204 (ML-DSA-65).'
  },
  'DH': {
    threat_level: 'CRITICAL',
    shor_vulnerable: true,
    grover_vulnerable: false,
    nist_status: 'Quantum-Exposed (Breakable via Shor)',
    reason: 'Finite field and elliptic curve Diffie-Hellman key exchanges are fully vulnerable to Shor\'s discrete logarithm solver.',
    nist_replacement: 'NIST FIPS 203 (ML-KEM-768/1024).'
  },
  'AES': {
    threat_level: 'SAFE',
    shor_vulnerable: false,
    grover_vulnerable: true,
    nist_status: 'Quantum-Resilient (with >=256-bit keys)',
    reason: 'Grover\'s algorithm provides a quadratic speedup for brute-force symmetric key search. AES-256 retains 128-bit quantum security margin, which is considered safe.',
    nist_replacement: 'Retain AES-256-GCM. If AES-128 or ECB mode is used, upgrade immediately to AES-256-GCM.'
  },
  '3DES': {
    threat_level: 'HIGH',
    shor_vulnerable: false,
    grover_vulnerable: true,
    nist_status: 'Deprecated (Classical + Quantum Insecure)',
    reason: 'Triple-DES has an effective 112-bit security key that Grover\'s algorithm reduces to 56 bits. NIST deprecated 3DES after 2023.',
    nist_replacement: 'Migrate to AES-256-GCM or ChaCha20-Poly1305.'
  },
  'DES': {
    threat_level: 'CRITICAL',
    shor_vulnerable: false,
    grover_vulnerable: true,
    nist_status: 'Broken (Insecure)',
    reason: '56-bit key length is trivially breakable on classical hardware and instant on quantum hardware.',
    nist_replacement: 'Migrate immediately to AES-256-GCM.'
  },
  'HASH': {
    threat_level: 'SAFE',
    shor_vulnerable: false,
    grover_vulnerable: true,
    nist_status: 'Variable by Function',
    reason: 'Preimage attacks on SHA-256/384/512 retain >=128 bits under Grover\'s algorithm. However, MD5 and SHA-1 have classical collision breaks and must be eliminated.',
    nist_replacement: 'Migrate MD5/SHA-1 to SHA-256, SHA-384, or SHA3-256.'
  },
  'TLS': {
    threat_level: 'HIGH',
    shor_vulnerable: true,
    grover_vulnerable: false,
    nist_status: 'Deprecated Protocol',
    reason: 'Legacy TLS versions utilize vulnerable key exchanges and cipher suites susceptible to downgrade and quantum intercept.',
    nist_replacement: 'Enforce TLS 1.3 with hybrid post-quantum key exchange (X25519 + ML-KEM-768).'
  },
  'SECRET': {
    threat_level: 'CRITICAL',
    shor_vulnerable: true,
    grover_vulnerable: false,
    nist_status: 'Hardcoded Credential',
    reason: 'Hardcoded private keys embedded in source repositories represent immediate credential compromise.',
    nist_replacement: 'Remove private keys from source code; store in Hardware Security Modules (HSM) or Secret Managers.'
  }
};

function classifyFinding(finding) {
  const family = finding.family || 'UNKNOWN';
  let rule = THREAT_RULES[family] || {
    threat_level: 'MEDIUM',
    shor_vulnerable: false,
    grover_vulnerable: false,
    nist_status: 'Unclassified',
    reason: 'Custom or unclassified cryptographic primitive.',
    nist_replacement: 'Review against NIST SP 800-131A Rev 2 guidelines.'
  };

  let threatLevel = rule.threat_level;
  let reason = rule.reason;
  let nistStatus = rule.nist_status;

  const algo = (finding.algorithm || '').toUpperCase();
  if (algo.includes('MD5') || algo.includes('SHA-1')) {
    threatLevel = 'HIGH';
    nistStatus = 'Broken (Classical Collision Break)';
    reason = 'Algorithm suffers from known practical collision attacks and must be replaced immediately with SHA-256 or SHA-3.';
  } else if (algo.includes('ECB')) {
    threatLevel = 'CRITICAL';
    nistStatus = 'Broken Mode (ECB Leaks Pattern)';
    reason = 'Electronic Codebook (ECB) mode does not provide semantic security and exposes plaintext structure.';
  } else if (algo.includes('1024') && family === 'RSA') {
    threatLevel = 'CRITICAL';
    reason = 'RSA-1024 is vulnerable even to classical nation-state factorization and must be retired immediately.';
  }

  return {
    ...finding,
    threat_level: threatLevel,
    shor_vulnerable: rule.shor_vulnerable,
    grover_vulnerable: rule.grover_vulnerable,
    nist_status: nistStatus,
    reason: reason,
    nist_replacement: rule.nist_replacement
  };
}

function calculateReadiness(classifiedFindings) {
  if (!classifiedFindings || classifiedFindings.length === 0) {
    return {
      score: 100,
      grade: 'A',
      posture: 'Quantum-Safe (No Legacy Crypto Detected)',
      counts: { total: 0, critical: 0, high: 0, safe: 0 }
    };
  }

  let critical = 0;
  let high = 0;
  let medium = 0;
  let safe = 0;

  for (const f of classifiedFindings) {
    if (f.threat_level === 'CRITICAL') critical++;
    else if (f.threat_level === 'HIGH') high++;
    else if (f.threat_level === 'MEDIUM') medium++;
    else safe++;
  }

  const total = classifiedFindings.length;
  const rawScore = Math.round(((safe * 100) + (medium * 50) + (high * 20)) / total);
  const score = Math.max(5, Math.min(100, rawScore));

  let grade = 'F';
  let posture = 'Critical Quantum Risk';

  if (score >= 85) { grade = 'A'; posture = 'Quantum-Resilient'; }
  else if (score >= 70) { grade = 'B'; posture = 'Moderate Posture (Action Recommended)'; }
  else if (score >= 50) { grade = 'C'; posture = 'Elevated Risk (Migration Required)'; }
  else if (score >= 30) { grade = 'D'; posture = 'High Quantum Exposure'; }
  else { grade = 'F'; posture = 'Immediate Danger (Active HNDL Threat)'; }

  return {
    score,
    grade,
    posture,
    counts: { total, critical, high, medium, safe }
  };
}

module.exports = { THREAT_RULES, classifyFinding, calculateReadiness };
