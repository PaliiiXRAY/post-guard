/**
 * CycloneDX Cryptographic Bill of Materials (CBOM) Generator for PostGuard
 * Generates standards-compliant CycloneDX 1.6 CBOM JSON.
 */

function generateCBOM(findings, projectName = 'Enterprise-App') {
  const timestamp = new Date().toISOString();
  const components = (findings || []).map((f, idx) => {
    const isAsymmetric = ['RSA', 'ECC', 'DH'].includes(f.family);
    const quantumLevel = isAsymmetric ? 0 : (f.algorithm.includes('256') ? 5 : 1);

    return {
      type: 'cryptographic-asset',
      name: f.algorithm,
      'bom-ref': `crypto-asset-${idx + 1}`,
      version: '1.0',
      description: `Cryptographic primitive discovered at line ${f.line} in ${f.file || 'source'}`,
      properties: [
        { name: 'cdx:crypto:algorithm', value: f.algorithm },
        { name: 'cdx:crypto:family', value: f.family },
        { name: 'cdx:crypto:key_length', value: String(f.key_size || 'N/A') },
        { name: 'cdx:crypto:nist_quantum_security_level', value: String(quantumLevel) },
        { name: 'cdx:crypto:shor_vulnerable', value: String(f.shor_vulnerable || isAsymmetric) },
        { name: 'cdx:crypto:threat_level', value: f.threat_level || 'HIGH' },
        { name: 'cdx:crypto:nist_status', value: f.nist_status || 'Quantum-Exposed' },
        { name: 'cdx:crypto:source_line', value: String(f.line) }
      ]
    };
  });

  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.6',
    serialNumber: `urn:uuid:postguard-cbom-${Date.now()}`,
    version: 1,
    metadata: {
      timestamp: timestamp,
      tools: [
        {
          vendor: 'PostGuard Security',
          name: 'PostGuard Cryptographic Discovery Engine',
          version: '1.0.0',
          description: 'Automated cryptographic asset scanner with quantum risk classification and CBOM generation.'
        }
      ],
      component: {
        type: 'application',
        name: projectName,
        version: '1.0.0'
      }
    },
    components: components
  };
}

module.exports = { generateCBOM };
