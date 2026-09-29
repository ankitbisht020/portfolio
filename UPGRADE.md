# Portfolio upgrade notes

## What changed
- SEO: real `<title>`, description and Open Graph tags generated from Firebase data (`app/page.jsx`).
- Speed: page is cached and re-reads Firebase every 60s (`revalidate = 60`); social icons no longer bundle all of Font Awesome (632 kB → 213 kB first load JS).
- New sections: Impact (animated stats + achievements), Terminal (interactive CLI).
- ⌘K / Ctrl+K command menu, reading progress bar, active nav highlighting.
- Projects: "All" filter, animated filtering, tilt on hover, tech chips, details modal, links visible on mobile.
- Ask AI chat widget + `app/api/ask/route.js` (hidden until configured).
- Recruiter-facing CTA replaces the "fork this template" banner.
- Contact: copy-email / mailto buttons, EmailJS keys via env vars, focus rings.

## Environment variables (Vercel → Settings → Environment Variables)
| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | yes | Already set. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | no | Defaults to ankitbisht9837@gmail.com |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | no | Falls back to the current value |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | recommended | Current fallback is EmailJS's *test* template |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | no | Falls back to the current value |
| `AI_API_KEY` + `AI_MODEL` | for Ask AI | Chat widget only appears when both are set |
| `AI_BASE_URL` | no | Any OpenAI-compatible API. Default `https://api.openai.com/v1`; Groq: `https://api.groq.com/openai/v1` |
| `AI_FALLBACK_API_KEY` + `AI_FALLBACK_MODEL` (+ `AI_FALLBACK_BASE_URL`) | no | Used only if the primary provider fails |

Redeploy after adding variables.

## Optional Firebase data
- `stats` (array): numbers for the Impact section, e.g. `{ "value": 35, "suffix": "%", "label": "Lower API latency" }`.
  Without it the section shows counts of projects, skills, companies and achievements.
- `projects[n].desc` (string or array of strings): shown in the project details modal.
