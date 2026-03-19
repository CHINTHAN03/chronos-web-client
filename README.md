#  Chronos Engine

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![Gemini API](https://img.shields.io/badge/Gemini_AI-1A73E8?style=for-the-badge&logo=google&logoColor=white)](#)

> **Enterprise-Grade Developer Telemetry & AI Release Synthesis**
> 
> A decoupled, full-stack microservice ecosystem designed to track developer velocity, stash terminal operations, and leverage Neural LLMs to automatically synthesize SOC 2-compliant release artifacts.

<br/>

![Chronos Engine Release Pipeline Preview](/docs/hero-shot.png)

<br/>

---

##  System Architecture

Chronos is built on a strictly decoupled architecture, separating high-performance backend processing from the luxury client interface. 

* **Core API (`chronos-engine-core`):** A stateless Spring Boot Java application handling secure routing, JWT-based identity verification, and persistent telemetry ingestion.
* **Web Client (`chronos-web-client`):** A performance-optimized React SPA utilizing a custom Silicon Valley Brutalist design system (glassmorphism, pure black canvases, noise texturing, and micro-borders).
* **Neural Graph (AI Engine):** Native integration with the Gemini API to parse raw developer logs and generate deterministic, enterprise-grade release notes.

---

##  Core Modules

### 1.  Identity Gateway
Secure, token-based authentication node utilizing cryptographic credential verification to yield stateless JWT session tokens. Built with a hardware-accelerated UI featuring kinetic gradient meshes.

![Chronos Gateway Login](/docs/login-node.png)

### 2. Dev Telemetry & Command Vault
* **Daily Metrics:** Form-driven ingestion of completed modules, active infrastructure blockers, and upcoming sprint goals.
* **Command Vault:** Edge-storage stashing for complex terminal operations (`sudo`, `lsof`, `kill`, etc.) with one-click clipboard syncing for rapid deployment.

![Chronos Telemetry Dashboard](/docs/telemetry-vault.png)

### 3. AST Artifact Pipeline
* **Synthesis:** Feeds sprint telemetry into a configured LLM to generate highly readable, technically accurate Markdown release notes.
* **Compliance Parameters:** Ingests SOC 2 authorization requirements, JIRA ticket linking, and database migration flags.
* **Multi-Format Export:** Context-aware downloading of artifacts in standard Markdown, natively parsed HTML, or structured JSON for audit trails.

![Chronos Gateway Login](/docs/artifact-output.png)

---

##  Technical Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | Java 17, Spring Boot 3, Spring Security, JWT, Maven |
| **AI / NLP** | Google Gemini Pro API, Jackson Databind, Marked.js |

---

##  Local Deployment Protocol

### 1. Initialize the Core Backend

# Clone the API repository

# Configure environment variables (Create a .env file)
JWT_SECRET=your_cryptographic_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

# Boot the Spring application
./mvnw spring-boot:run


### 2. Initialize the Web Client
# Clone the client repository
git clone

# Install dependencies
npm install

# Boot the Vite development server
npm run dev


---

##  Design Philosophy

The Chronos UI aggressively moves away from bloated SaaS templates, embracing **Silicon Valley Brutalism**. By stripping away excessive padding, heavy drop shadows, and primary colors, the interface relies on high-contrast grayscale, hairline borders, and fluid typography. It is architected to feel less like a standard web page and more like a physical piece of engineering hardware.

---

*Architected and developed by Chinthan.* 