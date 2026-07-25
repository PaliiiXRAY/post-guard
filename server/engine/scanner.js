/**
 * Cryptographic Code Scanner for PostGuard
 * Scans source code strings using regex and lexical pattern matching
 * to discover cryptographic primitives, algorithms, key sizes, and configurations.
 * Supports Python, JavaScript, Java, Go, C/C++, and config files.
 */

const CRYPTO_PATTERNS = [
  // RSA
  { regex: /rsa\.generate[_-]?private[_-]?key\s*\(\s*(?:public_exponent\s*=\s*\d+\s*,\s*)?key_size\s*=\s*(\d+)/i, family: 'RSA', name: 'RSA-{0}', defaultKey: '2048', lang: 'python' },
  { regex: /RSA\.generate\s*\(\s*(\d+)/i, family: 'RSA', name: 'RSA-{0}', defaultKey: '2048', lang: 'python' },
  { regex: /from\s+(?:Crypto(?:dome)?\.PublicKey|cryptography\.hazmat\.primitives\.asymmetric)\s+import\s+rsa/i, family: 'RSA', name: 'RSA (Import Detected)', defaultKey: '2048', lang: 'python' },
  { regex: /KeyPairGenerator\.getInstance\s*\(\s*["']RSA["']\s*\)/i, family: 'RSA', name: 'RSA', defaultKey: '2048', lang: 'java' },
  { regex: /\.initialize\s*\(\s*(\d+)\s*\)/i, family: 'RSA', name: 'RSA-{0}', defaultKey: '2048', lang: 'java' },
  { regex: /crypto\.generateKeyPairSync\s*\(\s*["']rsa["']\s*,\s*\{[^}]*modulusLength\s*:\s*(\d+)/i, family: 'RSA', name: 'RSA-{0}', defaultKey: '2048', lang: 'javascript' },
  { regex: /rsa\.GenerateKey\s*\(\s*\w+\s*,\s*(\d+)\s*\)/i, family: 'RSA', name: 'RSA-{0}', defaultKey: '2048', lang: 'go' },
  { regex: /RSA_generate_key(?:_ex)?\s*\(\s*(\d+)/i, family: 'RSA', name: 'RSA-{0}', defaultKey: '2048', lang: 'c' },

  // ECC / Elliptic Curve
  { regex: /ec\.generate_private_key\s*\(\s*ec\.(SECP\w+)\s*\(\s*\)/i, family: 'ECC', name: 'ECC-{0}', defaultKey: '256', lang: 'python' },
  { regex: /from\s+cryptography\.hazmat\.primitives\.asymmetric\s+import\s+ec/i, family: 'ECC', name: 'ECC (Import Detected)', defaultKey: '256', lang: 'python' },
  { regex: /KeyPairGenerator\.getInstance\s*\(\s*["']EC["']\s*\)/i, family: 'ECC', name: 'ECDSA', defaultKey: '256', lang: 'java' },
  { regex: /crypto\.createECDH\s*\(\s*["'](secp\w+)["']\s*\)/i, family: 'ECC', name: 'ECDH-{0}', defaultKey: '256', lang: 'javascript' },
  { regex: /elliptic\.P(\d+)\s*\(\s*\)/i, family: 'ECC', name: 'ECC-P{0}', defaultKey: '256', lang: 'go' },

  // AES
  { regex: /algorithms\.AES\s*\(\s*\w+\s*\)/i, family: 'AES', name: 'AES', defaultKey: '256', lang: 'python' },
  { regex: /AES\.new\s*\(\s*\w+\s*,\s*AES\.MODE_(\w+)/i, family: 'AES', name: 'AES-{0}', defaultKey: '128', lang: 'python' },
  { regex: /Cipher\.getInstance\s*\(\s*["']AES\/(\w+)\/\w+["']\s*\)/i, family: 'AES', name: 'AES-{0}', defaultKey: '128', lang: 'java' },
  { regex: /crypto\.createCipher(?:iv)?\s*\(\s*["']aes-(\d+)-(\w+)["']/i, family: 'AES', name: 'AES-{0}-{1}', defaultKey: '256', lang: 'javascript' },
  { regex: /aes\.NewCipher\s*\(/i, family: 'AES', name: 'AES', defaultKey: '128', lang: 'go' },

  // 3DES / DES
  { regex: /algorithms\.TripleDES\s*\(/i, family: '3DES', name: 'Triple-DES (3DES)', defaultKey: '168', lang: 'python' },
  { regex: /DES3\.new\s*\(/i, family: '3DES', name: 'Triple-DES (3DES)', defaultKey: '168', lang: 'python' },
  { regex: /DES\.new\s*\(/i, family: 'DES', name: 'DES', defaultKey: '56', lang: 'python' },
  { regex: /Cipher\.getInstance\s*\(\s*["']DESede/i, family: '3DES', name: 'Triple-DES (3DES)', defaultKey: '168', lang: 'java' },
  { regex: /Cipher\.getInstance\s*\(\s*["']DES\//i, family: 'DES', name: 'DES', defaultKey: '56', lang: 'java' },

  // Hashes
  { regex: /hashlib\.md5\s*\(/i, family: 'HASH', name: 'MD5', defaultKey: 'N/A', lang: 'python' },
  { regex: /hashlib\.sha1\s*\(/i, family: 'HASH', name: 'SHA-1', defaultKey: 'N/A', lang: 'python' },
  { regex: /hashlib\.sha256\s*\(/i, family: 'HASH', name: 'SHA-256', defaultKey: 'N/A', lang: 'python' },
  { regex: /MessageDigest\.getInstance\s*\(\s*["']MD5["']\s*\)/i, family: 'HASH', name: 'MD5', defaultKey: 'N/A', lang: 'java' },
  { regex: /MessageDigest\.getInstance\s*\(\s*["']SHA-?1["']\s*\)/i, family: 'HASH', name: 'SHA-1', defaultKey: 'N/A', lang: 'java' },
  { regex: /MessageDigest\.getInstance\s*\(\s*["']SHA-?256["']\s*\)/i, family: 'HASH', name: 'SHA-256', defaultKey: 'N/A', lang: 'java' },
  { regex: /crypto\.createHash\s*\(\s*["']md5["']\s*\)/i, family: 'HASH', name: 'MD5', defaultKey: 'N/A', lang: 'javascript' },
  { regex: /crypto\.createHash\s*\(\s*["']sha1["']\s*\)/i, family: 'HASH', name: 'SHA-1', defaultKey: 'N/A', lang: 'javascript' },
  { regex: /crypto\.createHash\s*\(\s*["']sha256["']\s*\)/i, family: 'HASH', name: 'SHA-256', defaultKey: 'N/A', lang: 'javascript' },

  // Diffie-Hellman
  { regex: /dh\.generate_parameters\s*\(\s*generator\s*=\s*\d+\s*,\s*key_size\s*=\s*(\d+)/i, family: 'DH', name: 'DH-{0}', defaultKey: '2048', lang: 'python' },
  { regex: /DHParameterSpec\s*\(/i, family: 'DH', name: 'Diffie-Hellman', defaultKey: '2048', lang: 'java' },
  { regex: /crypto\.createDiffieHellman\s*\(\s*(\d+)/i, family: 'DH', name: 'DH-{0}', defaultKey: '2048', lang: 'javascript' },

  // TLS & Secrets
  { regex: /ssl\.PROTOCOL_TLSv1(?:_[12])?\b/i, family: 'TLS', name: 'TLS 1.0/1.1 (Deprecated)', defaultKey: 'N/A', lang: 'python' },
  { regex: /SSLv3/i, family: 'TLS', name: 'SSLv3 (Broken)', defaultKey: 'N/A', lang: 'any' },
  { regex: /TLSv1\.0/i, family: 'TLS', name: 'TLS 1.0 (Deprecated)', defaultKey: 'N/A', lang: 'any' },
  { regex: /-----BEGIN\s+RSA\s+PRIVATE\s+KEY-----/i, family: 'SECRET', name: 'Hardcoded RSA Private Key', defaultKey: 'N/A', lang: 'any' }
];

function scanCode(code, filename = 'snippet.py') {
  if (!code || typeof code !== 'string') return [];
  const lines = code.split('\n');
  const findings = [];
  const seen = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trim();
    if (!stripped || stripped.startsWith('#') || stripped.startsWith('//')) continue;

    for (const pat of CRYPTO_PATTERNS) {
      const match = line.match(pat.regex);
      if (match) {
        let algoName = pat.name;
        if (match[1]) algoName = algoName.replace('{0}', match[1]);
        if (match[2]) algoName = algoName.replace('{1}', match[2]);
        const keySize = match[1] || pat.defaultKey || 'N/A';
        const dedupKey = `${pat.family}:${algoName}:${i + 1}`;
        if (seen.has(dedupKey)) continue;
        seen.add(dedupKey);

        findings.push({
          id: `FND-${findings.length + 1}`,
          family: pat.family,
          algorithm: algoName,
          key_size: keySize,
          line: i + 1,
          code: stripped,
          file: filename,
          language: pat.lang
        });
      }
    }
  }

  return findings;
}

module.exports = { CRYPTO_PATTERNS, scanCode };
