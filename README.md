# TrustGraph AI

**Enterprise-Grade 3D Immersive Supply Chain Knowledge Graph & Contagion Shockwave Simulation Platform for Indian MSMEs**

TrustGraph AI is an intelligence and risk mitigation command engine built to protect Indian MSMEs (Micro, Small, and Medium Enterprises) against multi-tier supplier defaults, delayed payments under the MSMED Act 2006, operational insolvencies, and ripple shocks across critical manufacturing supply corridors.


---
## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons, Three.js
- **Backend**: Node.js, Express, Google Gen AI SDK (`@google/genai`)
- **Database & Auth**: Firebase Auth (Google Provider & Email), Cloud Firestore
- **Grounding & APIs**: Google Search Grounding, Google Maps Grounding, Web Speech API

## 📊 Data Credibility & Regulatory Compliance Disclosure

To ensure complete regulatory integrity, legal compliance, and market credibility, TrustGraph AI strictly separates **Real-world Government Public Data** from **Algorithmically Simulated Operational Metrics**:

### 1. Real Public Government Data Sources (`dataSource: "real_registration"`)
The following fields are directly extracted and cross-referenced from verified public Indian statutory and government portals:
* **Udyam Registration Portal (Ministry of MSME / data.gov.in)**:
  * Official Enterprise Name
  * Udyam Registration Certificate Number (`UDYAM-XX-00-0000000`)
  * Enterprise Classification Category: **Micro**, **Small**, or **Medium**
  * District & State Industrial Cluster Location
  * 2-digit / 5-digit National Industrial Classification (**NIC**) Codes (e.g., NIC 2610 for Electronic Components, NIC 2100 for Pharmaceuticals)
* **Ministry of Corporate Affairs (MCA21 Portal)**:
  * Corporate Identity Number (**CIN**)
  * Company Legal Incorporation Date & Registration Status
* **GSTN Public Search**:
  * Formatted 15-character Goods & Services Tax Identification Number (**GSTIN**)

### 2. Algorithmically Simulated Risk Metrics (`dataSource: "simulated_metrics"`)
Because statutory registries (like Udyam and MCA) only maintain registration and classification metadata rather than confidential real-time banking telemetry, the following metrics are **explicitly generated via TrustGraph AI's forensic risk model**:
* **Trust Score (0–100)**: Multi-factor composite index evaluating capital concentration, geographical risk, and single-source dependency.
* **Payment Delay Averages**: Simulated historical settlement lag (e.g., `0 days avg`, `23 days avg`).
* **Delivery Fulfillment Reliability & Quality Acceptance Rates**: Simulated percentage scores indicating operational buffer resilience.
* **Open Grievance & Complaint Counts**: Modeled MSME SAMADHAAN dispute triggers.
* **Systemic Contagion Shockwaves**: Multi-tier cascading failure simulations computed via high-thinking reasoning engines.

*All UI cards and forensic audit reports prominently display the **`[Verified Udyam / MCA Entity]`** or **`[Simulated Risk Metric]`** badges to ensure full transparency.*

---

## 🚀 Key Features

* **3D Multi-Tier Knowledge Graph**: Interactive Three.js concentric orbit topology visualizing Tier-0 MSME Hubs, Tier-1 Direct Partners, Tier-2 Component Fabricators, and Tier-3 Raw Material Suppliers.
* **Contagion Shockwave Simulation**: Real-time propagation engine modeling production downtime days and monetary INR exposure.
* **Multi-Turn AI Copilot (Powered by Gemini)**:
  * Switching between `gemini-3.5-flash`, `gemini-3.1-pro-preview`, and `gemini-3.1-flash-lite`.
  * **Google Search Grounding** for live market, metal, and tariff alerts.
  * **Google Maps Grounding** for industrial cluster coordinates and port bottleneck verification.
  * **High-Thinking Deep Reasoner** (`ThinkingLevel.HIGH`) for complex systemic non-linear insolvency paths.
  * **Vision Document Scanner** for extracting GSTIN, invoice amounts, and compliance flags.
  * **Live Voice API** with real-time audio interaction and text-to-speech feedback.
* **Admin CSV Ingestion Pipeline**: Ingest district-wise MSME datasets with automated validation checks (GSTIN and Udyam regex format validation).
* **Firebase Authentication & Firestore**: Secure Google sign-in and real-time database persistence.

---

## 🛠️ Data Ingestion Pipeline

To import real-world MSME CSV datasets from data.gov.in via the command line:

```bash
# Execute the MSME ingestion script
node backend/scripts/importMsmeData.js path/to/udyam_dataset.csv
```

Or use the **Ingest Udyam CSV** button directly inside the **Supplier Grid** admin view.

# 🌐 TrustGraph AI
### 3D Immersive Supply Chain Knowledge Graph & Contagion Shockwave Simulator for MSMEs

**TrustGraph AI** is an intelligent supply network resilience and risk command platform designed to shield Indian Micro, Small, and Medium Enterprises (MSMEs) from multi-tier vendor failures, working capital contractions, and payment defaults under the MSMED Act 2006.

---

## 🌟 Key Highlights

- 🪐 **Interactive 3D Supply Chain Topology**: Concentric multi-tier orbit visualization (Tier-0 Hub to Tier-3 Raw Materials) built with **Three.js** and particle shockwaves.
- ⚡ **Contagion Cascade Simulator**: Real-time monetary exposure calculations (in ₹ INR Lakhs/Crores), production downtime estimates, and automated MSME SAMADHAAN legal recovery pathways.
- 🤖 **Multi-Model AI Copilot (Powered by Gemini)**:
  - Dynamic switching between `gemini-3.5-flash`, `gemini-3.1-pro-preview`, and `gemini-3.1-flash-lite`.
  - **Google Search Grounding** for real-time market indices, tariff changes, and raw material alerts.
  - **Google Maps Grounding** for industrial cluster coordinates and port bottleneck verification.
  - **High-Thinking Deep Reasoner** (`ThinkingLevel.HIGH`) for complex systemic insolvency analysis.
  - **Vision Document Scanner** extracting GSTIN, invoice amounts, and compliance data from purchase orders and audit certificates.
  - **Live Voice Interaction** with real-time speech recognition and text-to-speech audio readback.
- 📊 **Real-World MSME Ingestion Pipeline**: Ingest and validate official government datasets (Udyam Registration / MCA21) from **data.gov.in** with automated GSTIN/Udyam regex validation.
- 🔐 **Firebase Cloud Architecture**: Persistent Firestore database synchronization with Google Sign-In and role-based security rules.
- 🌌 **Cybernetic Visuals**: Built with **Tailwind CSS v4** animated Aurora gradient meshes and Web Audio API sensory cues.

---

