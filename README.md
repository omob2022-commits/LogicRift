# LogicRift

An Arabic-first requirements discovery frontend for software companies and their clients. The redesigned workspace uses a charcoal and muted copper palette, local IBM Plex Sans Arabic fonts, RTL layouts, and responsive company/client journeys.

## Run locally

Use Node.js **22.18+** (or Node 24) for the app and the TypeScript-backed Node tests.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
npm start
```

No API keys or database configuration are needed. The existing Next.js / React / TypeScript / Zustand stack is retained.

## Try the complete workflow

1. On the landing page, choose **استكشف مشروعًا تجريبيًا** to explore a seeded company/project, or **أنشئ مساحة الشركة** to create an empty company profile.
2. Create a project using the three-step form. In **الدعوات والمشاركون**, copy its generated code. Codes expire after seven days and can be revoked or rotated. The code admits one client profile per project in this demo; existing participants keep access to their interview when the entry code expires or is revoked. The sample project's initial code is `LR-DEMO2026`.
3. Choose **تبديل الملف / خروج**, create a **زبون** profile, and enter the code in **الانضمام لمشروع**. Use the **same browser and origin**, switching profiles in the same tab.
4. Answer the guided interview. A payment follow-up appears when payment is mentioned. Answers save as you type; uncertain questions can be deferred. Text is required for processing a voice answer because automatic transcription is not connected.
5. Review the original answers and submit them. Switch back to the company profile to review the resulting drafts, sources, acceptance criteria, and decisions.
6. Approve requirements, save an immutable requirements version, export approved requirements as CSV, or use **طباعة / PDF** and the browser's **Save as PDF** option.

## Screens

- Landing, company/client registration, local-profile sign-in, project-code entry.
- Searchable/filterable project dashboard with grid/list layouts; project creation wizard.
- Project overview, invitations/participants, interview transcript and analyst notes.
- Requirements review with source/history modal, acceptance criteria and statuses.
- Open/resolved decisions and meeting agenda.
- Report preview, approved CSV export, print/PDF layout, requirements snapshots.
- Project settings, profile information, usage guide and activity dialog.
- Client welcome, adaptive interview, answer review and submission confirmation.

Hash routes (`#/project/<id>/requirements`, etc.) support refresh and browser back/forward without server-side project data. Unknown routes and profile/project mismatches show recovery screens.

## Deliberate prototype boundaries

- This is **frontend only**. Profiles are local personas, **not authenticated accounts**. There are no passwords, email verification, server authorization, tenant isolation or cross-device sharing. The UI and store role checks support the demo journey, not a security boundary. Do not use confidential data.
- JSON data is stored under `logicrift-workspace-v1` in `localStorage`. Audio blobs are stored in IndexedDB (`logicrift-recordings`). Clearing browser data removes the demo data. Each project has one client interview in this demo; independent stakeholder sessions are future backend work.
- Requirement extraction is deterministic and visibly labelled as a simulation. It retains answer text/source, creates drafts and deferred decisions, and never approves anything automatically. It is not an LLM service and does not claim semantic contradiction detection.
- Recording uses `MediaRecorder`; **HTTPS or localhost**, browser support and microphone permission are required. Permission/availability failures leave text entry usable. Recordings stop at two minutes and can be played or deleted. No speech-to-text service is connected.
- Editing an approved requirement returns it to review. Saved versions preserve approved requirement contents; project descriptions and decision sections in reports show current data.
- CSV exports only approved requirements, handles quotes and protects spreadsheet formula cells. PDF is the browser print flow, not a server-generated download.
- Jira integration, real authentication, email invitations, cloud storage and model providers remain backend/integration work. Jira can still be used separately for the course workflow.

## Code map

- `src/components/workspace/WorkspaceApp.tsx`: route handling, role-aware shell, hydration.
- `Entry.tsx`, `Projects.tsx`, `Company.tsx`, `Interview.tsx`: page groups.
- `VoiceRecorder.tsx`, `ui.tsx`: recording lifecycle and shared accessible controls.
- `src/store/workspaceStore.ts`: persistent state and guarded frontend actions.
- `src/lib/workspace.ts`: types, invitation rules, interview branching, extraction, revisions and CSV.
- `src/lib/audio.ts`: IndexedDB recording persistence.
- `src/app/globals.css`: design tokens, components, responsive and print styling.

The original proof-of-concept components/store are retained for reference but are no longer mounted by the home page. No server functionality was replaced.

## Validation

```bash
npm test
npx tsc --noEmit
npm run build
```

The tests cover invitation failures, payment branching/progress, source preservation and extraction idempotency, reapproval after changes, and approved-only CSV output/escaping. See `docs/frontend-qa.md` for manual flow checks and verification limits.
