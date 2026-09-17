# Nyay Mitra AI

> **"Understand Your Rights. Take the Right Step."**  
> AI-powered legal guidance for every citizen of India.

Nyay Mitra AI is a civic-tech web application built to empower common citizens in India by breaking down complex legal disputes into plain language, identifying applicable rights under verified statutes (India Code), suggesting practical next steps, scanning agreements for unfair clauses, and generating advocate-formatted legal demand notices downloadable as PDFs.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS (Custom civic-tech navy & subtle gold palette)
- **Database**: MySQL with Prisma ORM
- **AI Integration**: OpenAI GPT models with strict legal guardrails + built-in offline Demo Engine
- **Voice Input**: Browser Web Speech API (`webkitSpeechRecognition`)
- **Document Export**: jsPDF for advocate-style formal legal demand notices

---

## Main Pages
- `/` - **Landing Page**: Problem overview, 4-step workflow, and instant hackathon scenario clickers.
- `/chat` - **AI Consultation**: Voice & text input, 7-section structured legal guidance (A–G), and 1-click bridge to legal notices.
- `/notices` - **Legal Notice Generator**: Form & live advocate-formatted letter preview, in-place editor, copy, and PDF export.
- `/rights` - **Citizen Rights Directory**: Searchable directory covering Tenant, Employee, Consumer, Cyber, Women/POSH, Constitutional, and Financial rights.
- `/documents` - **Document Risk Scanner**: Uploads/pastes agreements with clause-by-clause risk detection and preloaded sample contracts.
- `/about` - **Mission & Responsible AI**: Ethical AI safeguards, non-lawyer disclaimers, and emergency helpline routing.

---

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment (`.env`)**:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/nyay_mitra"
   OPENAI_API_KEY=""  # Leave blank to use Demo Mode
   ```

3. **Prisma Setup**:
   ```bash
   npx prisma generate
   # If MySQL is running:
   npx prisma db push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).
