# NLP Knowledge Artifact Repository — Week 1

A structured, static-site repository of learning artifacts covering Week 1 NLP concepts: text preprocessing, feature engineering, language representation, and language models. Built as a plain HTML/CSS site so it can be published directly with **GitHub Pages** — no build step required.

## Contents

| File | Section |
|---|---|
| `index.html` | Home / repository map |
| `concept-cards.html` | Section A — 21 one-page concept cards |
| `comparisons.html` | Section B — 5 comparative-analysis tables |
| `workflows.html` | Section C — 3 workflow diagrams (SVG) |
| `applications.html` | Section D — 5 real-world applications |
| `research.html` | Section E — research & industry insights, open-source framework, sources |
| `sustainability.html` | NLP & Sustainable Development (300–500 words) |
| `assets/style.css` | Shared design system |
| `assets/diagrams/*.svg` | Workflow diagram source files |

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `nlp-week1-repository`).
2. Upload all files in this folder, preserving the `assets/` structure, to the repository root (or push via `git`).
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save. GitHub will publish the site at `https://<your-username>.github.io/<repository-name>/` within a few minutes.
6. Add the two group members as collaborators (**Settings → Collaborators**) so both can edit and commit.

No build tools, frameworks, or `node_modules` are required — every page is plain HTML/CSS that GitHub Pages serves as-is.

## Editing content

Each concept card, comparison table, and application block is plain HTML in its page — search for the relevant heading (e.g. `PRE-05` for Stemming) and edit the text directly. The visual design (colors, fonts, spacing) lives entirely in `assets/style.css`.

## Academic Integrity Declaration

- This repository's structure, initial drafts of the concept-card text, comparison tables, workflow-diagram content, and section copy were produced with **AI assistance** (Claude, by Anthropic) at the direction of the group, based on the assignment brief.
- The group is responsible for reviewing every factual claim, correcting or expanding any section, and adding citations for any additional external sources consulted beyond those listed in `research.html`.
- Section E (`research.html`) lists the external sources consulted for the research and industry-insights content; do not remove that list, and add any further sources you consult.
- This repository was prepared by **Piyush Bedekar** and **Avadhut Gore**. Before submission, add a line for each member describing which sections they reviewed, wrote, or verified (e.g. "Piyush Bedekar reviewed Sections A–B; Avadhut Gore reviewed Sections C–E"), per your course's AI-use policy.

## Assignment coverage checklist

- [x] Section A — Concept Cards (21 cards across all 4 topic groups)
- [x] Section B — Comparative Analysis (5 tables: mechanism, complexity, strengths, weaknesses, applications)
- [x] Section C — Workflow Diagrams (preprocessing pipeline, feature engineering pipeline, text-to-vector process)
- [x] Section D — Real-World Applications (5 applications, each with concepts / why / benefits)
- [x] Section E — Research & Industry Insights (2 research developments, 2 industrial applications, 1 open-source framework)
- [x] Sustainability & Societal Impact section (300–500 words)

