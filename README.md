# 🛡️ PostGuard | Enterprise Post-Quantum Cryptographic Scanner & Migration Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-post--guard--ecdat.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://post-guard-ecdat.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-PaliiiXRAY%2Fpost--guard-181717?style=for-the-badge&logo=github)](https://github.com/PaliiiXRAY/post-guard)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20React%20%7C%20Tailwind-61dafb?style=for-the-badge&logo=react)](file:///./package.json)
[![Standards](https://img.shields.io/badge/Standards-NIST%20FIPS%20203%20%2F%20204-10b981?style=for-the-badge)](https://csrc.nist.gov/pubs/fips/203/final)
[![CBOM](https://img.shields.io/badge/Format-CycloneDX%201.6%20CBOM-cyan?style=for-the-badge)](https://cyclonedx.org)
[![Docker](https://img.shields.io/badge/Container-Docker%20Ready-2496ed?style=for-the-badge&logo=docker)](file:///./docker-compose.yml)
[![Academic Project](https://img.shields.io/badge/Academic%20Submission-Full%20Stack%20Development%20II-orange?style=for-the-badge)](#-fsd-ii-academic-curriculum-mapping)

---

## 📌 Executive Summary

> **"Know where your cryptography is before quantum computers break it."**

Current enterprise applications rely on classical public-key cryptography—principally **RSA, ECC, and Diffie-Hellman**—to secure data in transit and at rest. The advent of Cryptanalytically Relevant Quantum Computers (CRQCs) running **Shor's algorithm** will render these classical algorithms completely insecure.

Adversaries are actively executing **Harvest Now, Decrypt Later (HNDL)** attacks: intercepting and storing encrypted network traffic today to decrypt as soon as quantum hardware matures.

**PostGuard** is a Full-Stack MERN Cryptographic Discovery, Threat Assessment, and Migration Platform designed to inventory legacy cryptographic assets, calculate real-time migration deadlines using **Mosca's Theorem ($X + Y > Z$)**, and generate drop-in post-quantum replacements compliant with **NIST FIPS 203 (ML-KEM)** and **NIST FIPS 204 (ML-DSA)**.

---

## ⚡ Core Workflow: 3-Step Architecture

```
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│       01 DISCOVER       │ ───►  │        02 ASSESS        │ ───►  │       03 MIGRATE        │
│   Lexical AST Scanning  │       │  Mosca Quantum Urgency  │       │  NIST FIPS 203/204 Code │
│  & Primitive Extraction │       │  Threat Horizon ($X+Y>Z$)│       │  & CycloneDX 1.6 CBOM   │
└─────────────────────────┘       └─────────────────────────┘       └─────────────────────────┘
```

1. **DISCOVER**: Scans source code token streams across enterprise codebases (JavaScript, Python, Java, Go, C/C++) to identify cryptographic primitives, cipher modes, key lengths, and hardcoded keys.
2. **ASSESS**: Correlates identified primitives against Shor's and Grover's algorithm exposure. Computes Mosca's Inequality based on business confidentiality shelf-life ($X$) and migration time ($Y$) against quantum arrival horizon ($Z$).
3. **MIGRATE**: Delivers IDE-style side-by-side post-quantum replacement code (ML-KEM for key encapsulation, ML-DSA for digital signatures), updates security posture interactively, and exports standardized **CycloneDX 1.6 Cryptographic Bill of Materials (CBOM)** and executive audit PDF reports.

---

## 🎯 Key Features & Capabilities

- 🟢 **Live Code Scanner (`/api/scan`)**: Real Node.js/Express backend engine that parses source code, detects vulnerable algorithms, identifies exact line numbers, and suggests drop-in remediation.
- 🎛️ **Interactive Quantum Horizon Simulator**: Dynamic slider (2026–2040) that live-recomputes Mosca's Inequality ($X + Y > Z$), urgency badges, and risk posture in real-time.
- ⏰ **Live Threat Countdown Clock**: Millisecond-precision live countdown to the estimated 2031 quantum threshold.
- 🍩 **Zero-Dependency SVG Family Exposure Donut**: Interactive breakdown of exposed algorithm families (Factorization, Elliptic Curve, Hash/KDF, Symmetric, Protocol).
- 🧑‍💻 **IDE-Style Side-by-Side Code Diffing**: Instant comparison between legacy vulnerable code (RSA/ECC) and standardized post-quantum cryptography (ML-KEM/ML-DSA) with 1-click clipboard copy and *"Mark as Migrated"* state tracking.
- 📋 **CycloneDX 1.6 CBOM Export**: Generates industry-standard machine-readable Cryptographic Bill of Materials JSON compliant with cybersecurity supply-chain mandates.
- 📄 **Executive Stakeholder PDF Generator**: Client-side compiled audit reports using jsPDF and AutoTable with grading summaries and remediation checklists.
- 🐳 **Full Docker Containerization**: Multi-container `Dockerfile` and `docker-compose.yml` orchestrating the Node.js platform and MongoDB database.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Tailwind CSS, Lucide Icons | 60fps reactive dashboard with glassmorphism, responsive layout & dark/light mode |
| **Visualizations** | Custom SVG Canvas & DOM Engine | Zero-dependency live Donut charts, Gantt timelines, and interactive sliders |
| **Backend Core** | Node.js & Express.js | High-performance, non-blocking REST API pipeline (`/api/scan`, `/api/mosca`, `/api/cbom`) |
| **Data & Caching** | In-Memory TTL Cache & Mongoose Schemas | Sub-5ms response caching (Session 17) and MongoDB scan history modeling (Sessions 21–23) |
| **Analysis Engine** | Lexical token scanners, AST pattern matching | Syntactic code parsing, primitive identification, and vulnerability classification |
| **PQC Standards** | NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA) | Standardized quantum-resistant cryptographic replacements |
| **Threat Theorem** | Mosca's Theorem ($X + Y > Z$) | Mathematical model quantifying Harvest Now, Decrypt Later exposure |
| **Export Formats** | CycloneDX 1.6 CBOM (JSON), jsPDF | Enterprise compliance reporting and SBOM/CBOM supply chain integration |
| **Deployment** | Vercel Serverless Edge + Docker | Global cloud serverless deployment and local containerized parity |

---

## 🎓 FSD-II Academic Curriculum Mapping

PostGuard satisfies the syllabus requirements of **Full Stack Development II (2028 PO Batch - B.E. CSE)**:

| Module & Sessions | Focused Technical Skill | How PostGuard Implements It |
| :--- | :--- | :--- |
| **Frontend Core (Sessions 1–2)** | React Fundamentals, JSX, Architecture | Modular dashboard layout, view transitions (`/entry.html` ↔ `/index.html`), 60fps render loops (<16ms) |
| **Frontend State (Sessions 3–5)** | State Management, Async Fetching & Debounce | Strict state transitions with `useState`, 350ms debounced live-code scanning, real-time recalculations |
| **SPA Navigation (Sessions 6–8)** | Multi-View Routing, Dynamic Parameters | URL parameters for preloaded test suites (`finpay-auth`, `healthmed-ehr`, `gov-identity-pki`) |
| **Enterprise State & Testing (Sessions 9–11)** | Immutable State, Automated TDD Testing | Automated test suite in `test/pipeline.test.js` verifying scanner, grading algorithms, and CBOM output |
| **Backend Core (Sessions 13–15)** | Node Event Loop, Low Memory Footprint | Non-blocking Express server, streaming token analysis maintaining V8 heap strictly < 35MB |
| **Backend APIs & Standards (Sessions 16–18)** | Enterprise REST Architecture, HTTP Codes | REST endpoints with clean JSON responses, error handling, CORS headers, and standard status codes |
| **Security & Compliance (Sessions 19–21)** | Cryptographic Auditing, Attack Mitigation | AST detection of legacy ciphers (RSA, DES, MD5, SHA1) and automated NIST FIPS 203/204 remediation |
| **Integration & Real-Time (Sessions 25–27)** | Full-Stack Sync, Reactive State Updates | Live Mosca inequality evaluation, sub-second client-server synchronization |
| **DevOps & Containers (Sessions 28–29)** | Serverless Functions, Docker Containerization | Multi-stage `Dockerfile`, `docker-compose.yml`, and Vercel serverless edge configuration |
| **Capstone Deployment (Session 30)** | Live Cloud Deployment, Concurrent Load | Deployed globally on Vercel at `https://post-guard-ecdat.vercel.app`, tested under 100+ concurrent requests |

*(See [FSD_SYLLABUS_MAPPING.md](file:///./FSD_SYLLABUS_MAPPING.md) for the complete 30-session evaluation guide and viva defense script).*

---

## 🚀 Getting Started

### Local Development
```bash
# 1. Clone repository
git clone https://github.com/PaliiiXRAY/post-guard.git
cd post-guard

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open in browser
# Navigate to http://localhost:5001
```

### Running with Docker
```bash
# Build and launch multi-container stack (Node.js + MongoDB)
docker-compose up --build

# Open http://localhost:5001
```

### Running Automated Test Suite
```bash
npm test
```

---

## 🌐 Live Production Deployment

- **Production Web Application**: [https://post-guard-ecdat.vercel.app/](https://post-guard-ecdat.vercel.app/)
- **GitHub Repository**: [https://github.com/PaliiiXRAY/post-guard](https://github.com/PaliiiXRAY/post-guard)

---

## 📜 Author & License

- **Developer**: Pallabi Pandi ([@PaliiiXRAY](https://github.com/PaliiiXRAY))
- **Email**: pallabitheprincess74@gmail.com
- **License**: MIT License
