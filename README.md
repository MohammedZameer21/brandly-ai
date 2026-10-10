# Brandly AI

Brandly AI helps students, professionals and founders connect a clear professional story to a realistic content plan. This hackathon MVP includes profile onboarding, brand identity drafts, editable content pillars, the ability to add ideas to a weekly plan, an editable/reschedulable calendar, a profile-readiness checklist, an explainable readiness score and deterministic brand-consistency checks.

## Run locally

Requirements: Node.js 20 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite. To create a production build or run the unit tests:

```sh
pnpm build
pnpm test
```

There are no required environment variables. No API key is used, and no AI provider or backend is connected. Generated identity text and post ideas are deterministic sample drafts, clearly labeled in the app. The sample persona is fictional.

## Product and users

The product turns skills, experience, goals and audience into positioning, profile copy, content themes and a practical schedule. It is designed for students seeking career opportunities, professionals building credibility and founders communicating expertise. The proposed free starter tier is illustrative, not a validated pricing offer.

## Technology

- React and TypeScript, built with Vite
- Lucide icons
- Browser local storage for the profile, weekly plan and checklist
- A transparent readiness-score rubric and deterministic consistency rules
- Vitest unit tests for scoring, calendar generation and consistency checks

Data is stored only in the current browser. There is no account, sync, external profile connection or social publishing integration.

## Demo

Click **Preview with a demo** on the landing page (or **Reload demo** in the workspace) to load the sample profile named Sai. The sample uses first-person brand copy, a Market executive role, freelancing and trading skills, the “TradeMeet 2025 Aspirer” achievement, and investors as the target audience. Influencer discovery is set to Yes. The profile has three hours per week available, so the calendar suggests three posts. All generated outputs are labeled as sample mode.

See [DEMO.md](./DEMO.md) for a four-minute presentation outline.

## Scoring and consistency rules

The internal readiness score totals five components, each worth up to 20 points:

- **Goal clarity:** 20 when a primary goal is present; otherwise 0.
- **Audience clarity:** 20 for a target description longer than eight characters, 12 for a shorter non-empty value, otherwise 0.
- **Value proposition:** 10 for role and skills, 5 more for at least three listed skills, and 5 more for experience.
- **Profile completeness:** 4 points each for name, role, skills, experience and bio.
- **Strategy alignment:** 10 for generated pillars, 5 for a weekly plan and 5 for stated availability.

The Brand Consistency Engine applies deterministic checks for goal-relevant evidence in the plan, founder/business relevance, repeated pillar use, a missing audience and an edited bio that omits that audience. Each detected issue reduces the consistency score by 14 points, with a floor of 55. These are heuristic checks, not a validated benchmark or infallible semantic review.

## Limitations and next steps

- No live LLM, secure server endpoint, API-output schema validation or AI retry handling is implemented. The product does not claim to use a proprietary or trained model.
- The outputs are deterministic first drafts. Review and edit them before use.
- The weekly plan is a local planning tool. It does not publish posts.
- There is no external profile audit, social analytics, authentication, cloud sync or payment processing.
- A production next step would be a small server-side LLM endpoint with validated structured output, provider timeouts and rate limits, followed by deeper tests of editable pillar workflows and persistence.
