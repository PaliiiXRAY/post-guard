# 🛡️ PostGuard | Enterprise Post-Quantum Cryptographic Scanner & Migration Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-post--guard--ecdat.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://post-guard-ecdat.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-PaliiiXRAY%2Fpost--guard-181717?style=for-the-badge&logo=github)](https://github.com/PaliiiXRAY/post-guard)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20React%20%7C%20Tailwind-61dafb?style=for-the-badge&logo=react)](file:///./package.json)
[![Standards](https://img.shields.io/badge/Standards-NIST%20FIPS%20203%20%2F%20204-10b981?style=for-the-badge)](https://csrc.nist.gov/pubs/fips/203/final)
[![CBOM](https://img.shields.io/badge/Format-CycloneDX%201.6%20CBOM-cyan?style=for-the-badge)](https://cyclonedx.org)
[![Docker](https://img.shields.io/badge/Container-Docker%20Ready-2496ed?style=for-the-badge&logo=docker)](file:///./docker-compose.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

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

## 🏛️ End-to-End System Architecture

```mermaid
flowchart TD
    subgraph ClientTier["Client Tier (React 18 & Tailwind CSS)"]
        UI["Reactive Web Workspace"]
        subgraph Components["Modular UI Components"]
            HUD["Executive HUD & Posture Score"]
            Slider["Horizon Simulator (2026-2040)"]
            Clock["Live Threat Countdown Clock"]
            Donut["SVG Algorithm Family Donut"]
            Editor["Live Code Editor & AST Scanner"]
            Diff["IDE Side-by-Side Remediation"]
            Gantt["Migration Timeline & Gantt View"]
        end
        UI --> Components
    end

    subgraph NetworkTier["Edge & Gateway Tier"]
        Vercel["Vercel Edge Global CDN"]
        CORS["CORS & Request Normalizer"]
        RateLimit["In-Memory Rate Limiter (Session 19)"]
        Vercel --> CORS --> RateLimit
    end

    subgraph ServerTier["Backend Tier (Node.js & Express REST API)"]
        Router["Express REST Router"]
        Cache["In-Memory TTL Cache (<3ms Latency)"]
        
        subgraph CoreAPIs["API Pipeline Endpoints"]
            ScanAPI["POST /api/scan"]
            MoscaAPI["POST /api/mosca"]
            SampleAPI["GET /api/samples"]
            CbomAPI["POST /api/cbom"]
            HealthAPI["GET /api/health"]
        end
        
        Router --> Cache
        Router --> CoreAPIs
    end

    subgraph AnalysisEngine["Cryptographic Analysis & Threat Pipeline"]
        AST["Lexical Tokenizer & AST Scanner"]
        Classifier["Quantum Threat Classifier (Shor & Grover)"]
        MoscaEngine["Mosca Inequality Engine (X + Y > Z)"]
        Remediation["NIST FIPS 203/204 Remediation Engine"]
        CBOMGen["CycloneDX 1.6 CBOM Builder"]

        ScanAPI --> AST
        AST --> Classifier
        Classifier --> MoscaEngine
        Classifier --> Remediation
        Classifier --> CBOMGen
    end

    subgraph DataTier["Data, Compliance & Persistence Layer"]
        MongoDB[("MongoDB Atlas / Mongoose Schema")]
        CycloneDX["CycloneDX 1.6 CBOM (JSON)"]
        PDF["Executive Audit Report (PDF via jsPDF)"]
        
        CBOMGen --> CycloneDX
        Remediation --> PDF
        Router --> MongoDB
    end

    subgraph DevOpsTier["DevOps & Container Infrastructure"]
        Docker["Docker Multi-Stage Image"]
        Compose["docker-compose (Node.js + MongoDB)"]
        Serverless["Vercel Serverless Edge Runtime"]
    end

    Components -->|"Debounced HTTP Requests (350ms)"| Vercel
    RateLimit --> Router
    DevOpsTier -.->|"Hosts & Orchestrates"| ServerTier
```

### 🔄 Asynchronous Scan & Assessment Pipeline Flow

```mermaid
sequenceDiagram
    autonumber
    actor Officer as Security Officer / Student
    participant React as React Frontend (Workspace)
    participant Gateway as Express Gateway (Rate Limit & Cache)
    participant Scanner as AST Lexical Scanner
    participant Threat as Quantum Classifier
    participant Mosca as Mosca Calculator (X+Y>Z)
    participant CBOM as CycloneDX 1.6 Generator

    Officer->>React: Enters Source Code or Selects Scenario
    React->>React: Debounce Timer (350ms)
    React->>Gateway: POST /api/scan { code, targetYear: 2031 }
    Gateway->>Gateway: Check In-Memory TTL Cache
    alt Cache Hit
        Gateway-->>React: Return Cached Analysis (<3ms)
    else Cache Miss
        Gateway->>Scanner: Tokenize Code & Discover Primitives
        Scanner-->>Gateway: Discovered Primitives (RSA, ECC, AES, 3DES)
        Gateway->>Threat: Map to Shor's & Grover's Algorithms
        Threat-->>Gateway: Threat Levels (CRITICAL / HIGH / SAFE)
        Gateway->>Mosca: Compute Mosca Inequality (X+Y > Z)
        Mosca-->>Gateway: Urgency & Vulnerability Window
        Gateway->>CBOM: Generate CycloneDX 1.6 Cryptographic BOM
        CBOM-->>Gateway: Formatted CBOM JSON
        Gateway-->>React: 200 OK { findings, readiness, mosca, cbom }
    end
    React->>React: Re-render Executive HUD & Grade Circle
    React->>React: Update SVG Donut & Before/After Code Diff
    Officer->>React: 1-Click Export (CycloneDX CBOM / Audit PDF)
```

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

## 🔬 Cryptographic Compliance & Threat Modeling

PostGuard implements formal mathematical and regulatory frameworks to measure post-quantum migration urgency:

| Security Vector | Implementation Standard | Quantum Protection Mechanism |
| :--- | :--- | :--- |
| **Key Encapsulation (KEM)** | NIST FIPS 203 (ML-KEM-768/1024) | Replaces Shor-vulnerable RSA/DH with Module-Lattice-based cryptography |
| **Digital Signatures (DSA)** | NIST FIPS 204 (ML-DSA-65/87) | Replaces ECDSA/RSA signatures with lattice-based authentication |
| **Symmetric Ciphers** | NIST SP 800-38D (AES-256-GCM) | Provides 128-bit quantum security margin against Grover's algorithm |
| **Cryptographic Inventory** | CycloneDX 1.6 CBOM | Standardized JSON BOM with `cdx:crypto:*` properties for supply-chain audits |
| **Threat Window Theorem** | Mosca's Inequality ($X + Y > Z$) | Quantifies confidentiality shelf-life ($X$) + migration time ($Y$) vs CRQC arrival ($Z$) |
| **Automated Verification** | Continuous Test Pipeline | End-to-end regression testing across enterprise vulnerability patterns |

> **Note**: For academic curriculum mapping and comprehensive technical viva defense documentation, refer to [FSD_SYLLABUS_MAPPING.md](file:///./FSD_SYLLABUS_MAPPING.md).

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
