/**
 * Preloaded Enterprise Codebase Samples for PostGuard
 * Simulates real-world codebases across FinTech, Healthcare, and Government PKI.
 */

const SAMPLES = {
  'finpay-auth': {
    id: 'finpay-auth',
    title: 'FinPay Core Banking API',
    description: 'Core banking payment gateway with legacy RSA-2048 key exchange, AES-128-ECB token encryption, and MD5 transaction checksums.',
    sector: 'Banking & Financial Services',
    data_shelf_life_years: 15,
    migration_time_years: 3,
    code: `import os
import hashlib
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP

# FinPay Transaction Authorization Engine
# Target: Production Payment Switch API (PCI-DSS Scope)

class PaymentGateway:
    def __init__(self):
        # VULNERABILITY 1: Legacy RSA-2048 key generation (Shor's breakable)
        self.key_pair = RSA.generate(2048)
        self.cipher_rsa = PKCS1_OAEP.new(self.key_pair)
        
        # VULNERABILITY 2: Hardcoded AES key using insecure ECB mode
        self.master_key = b"16ByteSecretKey!"
        self.ecb_cipher = AES.new(self.master_key, AES.MODE_ECB)

    def sign_transaction(self, tx_payload: bytes):
        # VULNERABILITY 3: Insecure MD5 hash for payment verification
        tx_hash = hashlib.md5(tx_payload).digest()
        signature = self.cipher_rsa.encrypt(tx_hash)
        return signature

    def encrypt_account_number(self, pan: str):
        # Pad to 16-byte boundary and encrypt in ECB mode
        padded = pan.ljust(32).encode("utf-8")
        return self.ecb_cipher.encrypt(padded)
`
  },
  'healthmed-ehr': {
    id: 'healthmed-ehr',
    title: 'HealthMed EHR Cloud Records',
    description: 'Electronic Health Record storage service using ECC SECP256R1 signatures and SHA-1 medical record digests.',
    sector: 'Healthcare & Life Sciences',
    data_shelf_life_years: 25,
    migration_time_years: 4,
    code: `from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
import hashlib

# HealthMed Electronic Health Records (HIPAA / GDPR Compliance)
# Critical 25-Year Patient Data Confidentiality Window

class MedicalRecordVault:
    def __init__(self):
        # VULNERABILITY 1: ECC SECP256R1 keypair (Shor's discrete log breakable)
        self.patient_signing_key = ec.generate_private_key(ec.SECP256R1())

    def sign_health_record(self, patient_data: bytes):
        # VULNERABILITY 2: Deprecated SHA-1 signature digest
        signature = self.patient_signing_key.sign(
            patient_data,
            ec.ECDSA(hashes.SHA1())
        )
        return signature

    def generate_patient_id(self, ssn: str):
        # VULNERABILITY 3: Legacy SHA1 patient record identifier
        return hashlib.sha1(ssn.encode()).hexdigest()
`
  },
  'gov-identity-pki': {
    id: 'gov-identity-pki',
    title: 'GovPass National Identity Registry',
    description: 'National identity and citizen authentication service using Diffie-Hellman parameter generation and Triple-DES credential storage.',
    sector: 'Government & National Security',
    data_shelf_life_years: 30,
    migration_time_years: 5,
    code: `from cryptography.hazmat.primitives.asymmetric import dh
from Crypto.Cipher import DES3
import hashlib

# GovPass National Citizen Authentication Registry
# High-Value Harvest Now, Decrypt Later (HNDL) National Target

class NationalIdentityService:
    def __init__(self):
        # VULNERABILITY 1: Classical Diffie-Hellman parameter generation (2048-bit)
        self.parameters = dh.generate_parameters(generator=2, key_size=2048)
        self.private_key = self.parameters.generate_private_key()
        
        # VULNERABILITY 2: Legacy Triple-DES for biometric template storage
        self.des_key = DES3.adjust_key_parity(b"0123456789abcdef01234567")
        self.biometric_cipher = DES3.new(self.des_key, DES3.MODE_CBC, iv=b"12345678")

    def hash_national_id(self, id_number: str):
        # VULNERABILITY 3: MD5 citizen record hashing
        return hashlib.md5(id_number.encode()).hexdigest()
`
  }
};

module.exports = { SAMPLES };
