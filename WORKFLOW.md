# AI Development Workflow Comparison

## Round 1 — Vague Prompt

**Prompt:** “Hey so build me a client settings form for this project. Do it.”

**AI implementation time:** 12:29–12:34 (5 minutes)

Round 1 deliberately used a vague prompt with no field specification, architecture guidance, constraints, or verification requirements. The AI interpreted “client settings” broadly and produced a much larger feature than intended. The branch introduced 17 feature files and 3,437 insertions, including separate Billing, Workflow, Portal, Notes/Contracts, and Live Preview sections. `ClientSettings.css` alone contained 1,184 lines.

Manual review exposed several issues. Direct image URLs did not work reliably, the website field contained hardcoded `https://` text, refresh restored the initial dummy template, and Reset Form and refresh had confusingly different behaviors. There were also spacing problems. The most important issue was architectural: billing, revisions, workflow, portal settings, and legal information were treated as client-level data. These can vary between different projects belonging to the same client, making this a domain-modeling mistake.

## Round 2 — Precise Prompt

**AI implementation time:** 3:00–3:08 (8 minutes)

Round 2 used a fresh branch and a detailed specification covering scope, fields, validation, accessibility, persistence, edge cases, architecture, testing, and verification. The prompt explicitly restricted the feature to client identity and listed project-specific functionality as out of scope.

The resulting architecture was more focused. Instead of the broad `ClientSettings` structure, Round 2 introduced `ClientForm.jsx`, dedicated validation, constants, and automated test files. The `App.jsx` comparison also showed a major simplification: Round 1's file was 122 lines while Round 2's was reduced to 13 lines.

Round 2 also required verification rather than simply accepting the generated output. It produced 21 passing tests covering validation, logo handling, localStorage persistence, and reset behavior. Oxlint reported zero errors and zero warnings, and the production build succeeded.

## What I Learned

The main lesson is that AI output quality depends heavily on specification and verification. The vague prompt was faster to generate, but it created more assumptions, scope creep, and manual review work. The precise prompt took three additional minutes of AI implementation time, but produced a much more controlled feature and included automated verification.

The exercise also showed why human review remains necessary. Round 1 initially appeared comprehensive, but manual testing exposed functional problems and a significant domain-modeling mistake. Going forward, I will define domain boundaries, acceptance criteria, edge cases, accessibility requirements, and verification steps before asking AI to implement a feature.