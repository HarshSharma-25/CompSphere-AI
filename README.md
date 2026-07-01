# CA-OS: AI Practice ERP for Indian Chartered Accountant Firms

Welcome to **CA-OS** (AI Practice ERP), the unified enterprise-grade operating system designed for Indian CA, CS, and Corporate Law firms. The platform operates as a single interconnected ecosystem, integrating practice management, direct/indirect tax compliance, automated bookkeeping, real-time client collaboration, and an advanced AI intelligence layer.

---

## 🏢 Platform Overview & The 5 Product Layers

CA-OS organizes firm operations into 5 dedicated layers:

### 1. Practice Operating System
- **Module 1: Dashboard & Navigation**: High-fidelity operational counters, SLA tickers, and workspace switcher.
- **Module 2: AI Client Onboarding**: Automatic PAN/GSTIN lookups, document folder setups, and AI-drafted engagement letters.
- **Module 3: Document Portal**: Secure file upload vaults, auto-categorization, and OCR metadata parsing.
- **Module 4: Bookkeeping Automation**: Automated ledger mapping, bank reconciliation, and trial balance sync.
- **Module 13: Client Communication**: Multi-channel discussions (WhatsApp, Portal), client sign-offs, and automated billing.

### 2. Compliance Operating System
- **Module 5: GST**: Automated GSTR-2B vs. books reconciliation and Input Tax Credit (ITC) risk profiling.
- **Module 6: Income Tax & AIS**: Multi-source matching of AIS/TIS forms against trial balances and ITR preparation.
- **Module 7: Notices & Litigation**: Notice parsing, case law RAG matching, and automated response drafting.
- **Module 9: Payroll & Statutory Compliance**: Provident Fund, Employee State Insurance, and State Professional Tax calculators.
- **Module 10: Corporate Secretarial (MCA/ROC)**: Board resolution templates, general meeting minutes, and MCA e-form tracking.
- **Module 11: Compliance Calendar**: Unified statutory deadlines planner mapping to client groups and teams.

### 3. AI Intelligence Operating System
- **Module 12: CA Intelligence Engine**: Specialized AI agents for RAG case law search, ledger auto-classification, notice response writing, and NLP SQL reporting queries.

### 4. Security Operating System
- **Module 14: Security, Access & Administration**: Row-level database security, zero-knowledge folder vaults, DPDP consent tracking, and immutable audit logs.

### 5. Experience Operating System
- **Module 15: Settings & Configuration**: White-label firm layout, integration controls, and custom workflow setup.
- **Module 16: Reports & Export Hub**: Unified business intelligence aggregator, custom export formats (signed PDF, Excel), scheduled dispatches, and secure link expirations.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS design variables.
- **Database / ORM**: PostgreSQL, Prisma Client.
- **Backend Services**: Node.js / Express integration, MongoDB, Groq AI (Llama 3.1 8B), OCR (Tesseract.js).
- **Security**: Granular RBAC, Audit trails, Password hashing, AES-256 vault encryption.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- pnpm or npm

### Installation
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the local development server:
   ```bash
   pnpm dev
   ```
3. Build for production deployment:
   ```bash
   pnpm build
   ```

---

## 📄 Documentation Links
- **Master Specification**: [CA_OS_SPECIFICATION.md](file:///Users/harshsharma/Downloads/ca-ai-compliance-website/CA_OS_SPECIFICATION.md)
- **Database Schema**: [database_schema.sql](file:///Users/harshsharma/Downloads/ca-ai-compliance-website/database_schema.sql)
- **Prisma Schema**: [schema.prisma](file:///Users/harshsharma/Downloads/ca-ai-compliance-website/prisma/schema.prisma)
