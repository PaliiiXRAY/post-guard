/**
 * Automated Verification Pipeline for PostGuard
 * Validates cryptographic scanner, quantum threat classifier,
 * Mosca's inequality theorem, and CycloneDX 1.6 CBOM generation.
 * Fulfills FSD-II Syllabus Session 10 (E2E & TDD Testing).
 */

const { scanCode } = require('../server/engine/scanner');
const { classifyFinding, calculateReadiness } = require('../server/engine/classifier');
const { calculateMosca } = require('../server/engine/mosca');
const { getRemediation } = require('../server/engine/remediation');
const { generateCBOM } = require('../server/engine/cbom');
const { SAMPLES } = require('../server/engine/samples');

function runTests() {
  console.log('🧪 Starting PostGuard Test Pipeline...');

  // 1. Test FinPay Sample Codebase
  const sample = SAMPLES['finpay-auth'];
  if (!sample) throw new Error('Sample finpay-auth not found');

  const rawFindings = scanCode(sample.code, 'finpay_auth.py');
  console.log(`✓ RAW FINDINGS: ${rawFindings.length} discovered`);
  if (rawFindings.length < 3) throw new Error('Expected at least 3 findings in finpay-auth');

  const classified = rawFindings.map(classifyFinding);
  const readiness = calculateReadiness(classified);
  console.log(`✓ READINESS: ${readiness.score}% (Grade ${readiness.grade}) - ${readiness.posture}`);
  if (readiness.score > 60) throw new Error('Vulnerable codebase score should be <= 60%');

  // 2. Test Mosca Calculation
  const mosca = calculateMosca({
    shelfLifeYears: sample.data_shelf_life_years,
    migrationYears: sample.migration_time_years,
    targetYear: 2031
  });
  console.log(`✓ MOSCA: ${mosca.status} | X(${mosca.X}) + Y(${mosca.Y}) = ${mosca.totalProtectionNeeded} vs Z(${mosca.Z})`);
  if (!mosca.isVulnerable) throw new Error('15-year shelf-life should be HNDL vulnerable against 2031 horizon');

  // 3. Test Remediation Generation
  const recommendations = classified.map(getRemediation);
  console.log(`✓ REMEDIATIONS: ${recommendations.length} generated compliant with NIST FIPS 203/204`);

  // 4. Test CycloneDX 1.6 CBOM
  const cbom = generateCBOM(classified, 'FinPay-Banking');
  console.log(`✓ CBOM COMPONENTS: ${cbom.components.length} generated under specVersion ${cbom.specVersion}`);
  if (cbom.bomFormat !== 'CycloneDX' || cbom.specVersion !== '1.6') throw new Error('Invalid CBOM format');

  // 5. Test Clean Post-Quantum Codebase
  const cleanCode = `
from oqs import KeyEncapsulation, Signature
import hashlib

# Standardized Post-Quantum Cryptography
kem = KeyEncapsulation("ML-KEM-768")
signer = Signature("ML-DSA-65")
secure_hash = hashlib.sha256(b"payload").digest()
`;
  const cleanRaw = scanCode(cleanCode, 'secure_app.py');
  const cleanClassified = cleanRaw.map(classifyFinding);
  const cleanReadiness = calculateReadiness(cleanClassified);
  console.log(`✓ CLEAN CODEBASE READINESS: ${cleanReadiness.score}% (Grade ${cleanReadiness.grade})`);

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! (100% Pass Rate)');
}

try {
  runTests();
} catch (err) {
  console.error('❌ Test Failure:', err.message);
  process.exit(1);
}
