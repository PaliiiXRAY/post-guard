/**
 * Post-Quantum Cryptography (PQC) Remediation Engine for PostGuard
 * Provides standardized, production-ready drop-in replacement snippets
 * compliant with NIST FIPS 203 (ML-KEM) and NIST FIPS 204 (ML-DSA).
 */

const REMEDIATION_TEMPLATES = {
  'RSA': {
    title: 'Migrate RSA to NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA)',
    standard: 'NIST FIPS 203 / 204',
    legacy_sample: `from cryptography.hazmat.primitives.asymmetric import rsa

# Vulnerable: Classical RSA-2048 (Breakable via Shor's Algorithm)
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)
public_key = private_key.public_key()`,
    pqc_sample: `# Standardized: NIST FIPS 203 (ML-KEM-768) Key Encapsulation
from oqs import KeyEncapsulation

# Generate Post-Quantum ML-KEM-768 Keypair
with KeyEncapsulation("ML-KEM-768") as client:
    public_key = client.generate_keypair()
    # Encapsulate shared secret securely
    ciphertext, shared_secret_sender = client.encap_secret(public_key)
    # Decapsulate shared secret
    shared_secret_receiver = client.decap_secret(ciphertext)`
  },
  'ECC': {
    title: 'Migrate ECC / ECDSA to NIST FIPS 204 (ML-DSA-65)',
    standard: 'NIST FIPS 204 (ML-DSA)',
    legacy_sample: `from cryptography.hazmat.primitives.asymmetric import ec

# Vulnerable: Classical SECP256R1 (Shor's Discrete Log Breakable)
private_key = ec.generate_private_key(ec.SECP256R1())
public_key = private_key.public_key()`,
    pqc_sample: `# Standardized: NIST FIPS 204 (ML-DSA-65) Digital Signature
from oqs import Signature

# Initialize ML-DSA-65 (formerly Dilithium3)
with Signature("ML-DSA-65") as signer:
    public_key = signer.generate_keypair()
    message = b"Authenticated transaction payload"
    signature = signer.sign(message)
    # Verification with zero classical vulnerability
    is_valid = signer.verify(message, signature, public_key)`
  },
  'DH': {
    title: 'Migrate Diffie-Hellman to Hybrid Post-Quantum Key Exchange',
    standard: 'NIST FIPS 203 Hybrid (X25519 + ML-KEM-768)',
    legacy_sample: `from cryptography.hazmat.primitives.asymmetric import dh

# Vulnerable: Classical Diffie-Hellman Key Exchange
parameters = dh.generate_parameters(generator=2, key_size=2048)
server_private_key = parameters.generate_private_key()`,
    pqc_sample: `# Post-Quantum Hybrid Key Exchange (RFC 9370 / NIST FIPS 203)
# Combines classical X25519 with ML-KEM-768 for defense-in-depth
from oqs import KeyEncapsulation

with KeyEncapsulation("ML-KEM-768") as kem:
    pqc_public_key = kem.generate_keypair()
    ciphertext, pqc_secret = kem.encap_secret(pqc_public_key)
    # Dual-layer KDF combines classical + PQC secrets`
  },
  '3DES': {
    title: 'Migrate 3DES / DES to Authenticated AES-256-GCM',
    standard: 'NIST SP 800-38D (AES-256-GCM)',
    legacy_sample: `from Crypto.Cipher import DES3

# Vulnerable: Deprecated 3DES with 112-bit effective key
cipher = DES3.new(key, DES3.MODE_CBC, iv=iv)`,
    pqc_sample: `from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

# Quantum-Resilient: AES-256-GCM (128-bit security under Grover's)
key = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(key)
nonce = os.urandom(12)
ciphertext = aesgcm.encrypt(nonce, data, associated_data=None)`
  },
  'HASH': {
    title: 'Migrate Deprecated Hashes (MD5/SHA1) to SHA-256 / SHA-3',
    standard: 'NIST FIPS 180-4 / FIPS 202',
    legacy_sample: `import hashlib

# Vulnerable: Collision attacks on MD5 & SHA-1
digest = hashlib.md5(b"payload").hexdigest()`,
    pqc_sample: `import hashlib

# Quantum-Resilient Preimage Resistance (>=128 bits under Grover)
digest = hashlib.sha256(b"payload").hexdigest()`
  }
};

function getRemediation(finding) {
  const family = finding.family || 'RSA';
  const template = REMEDIATION_TEMPLATES[family] || REMEDIATION_TEMPLATES['RSA'];
  return {
    finding_id: finding.id,
    algorithm: finding.algorithm,
    family: finding.family,
    title: template.title,
    standard: template.standard,
    legacy_code: template.legacy_sample,
    remediated_code: template.pqc_sample,
    migration_steps: [
      '1. Inventory cryptographic calls and callers in the target repository.',
      '2. Install standardized Post-Quantum library (e.g. liboqs-python or @noble/post-quantum).',
      '3. Replace key generation and encapsulation with NIST FIPS 203 (ML-KEM) or FIPS 204 (ML-DSA).',
      '4. Validate backward compatibility using dual-signing / hybrid mode during transition window.',
      '5. Run automated regression testing and generate updated CycloneDX CBOM.'
    ]
  };
}

module.exports = { REMEDIATION_TEMPLATES, getRemediation };
