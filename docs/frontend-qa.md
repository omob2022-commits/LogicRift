# Frontend QA notes

Validated on Node 24 and Chrome in the local preview, 25 October 2026.

- Production build and TypeScript: successful.
- Unit checks: invitation status, conditional payment question and coverage, source retention and repeat extraction, reapproval after approved-content edits, approved-only CSV escaping: 5 passed.
- Desktop visual QA at 1363px: landing, project dashboard, requirements review, report.
- Mobile visual QA at 390px: project dashboard; two-column summary switches to stacked cards, project cards to a single column, and navigation to a menu button.
- Company flow: demo company -> new project (three steps) -> generated code -> revoke and reactivate -> project workspace.
- Client flow on same browser: new client profile -> invalid code error -> valid code -> save answer -> reload and resume -> payment follow-up -> defer payment -> review and correct answer -> submit -> confirmation.
- Company review: five source-backed draft rows from the submitted answers plus one deferred decision; analyst revised one draft, set an acceptance criterion, approved it, and saw it in report; snapshot `v1` appeared.
- Microphone API is unavailable on the preview's HTTP origin; the intended text fallback message appeared. Recording and playback require HTTPS or localhost and should be checked again there.
- PDF uses browser print layout. Production build and CSV transformation are verified; browser-specific print and file download confirmation were not exercised in this preview.

Prototype only: no backend authentication, cross-device code lookup, or real AI provider. The current browser's storage holds all demo records.
