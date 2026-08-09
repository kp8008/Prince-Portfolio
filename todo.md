# Princefolio Rebuild TODO

- [x] Hero section (name, title, tagline, Contact Me button, social links)
- [x] About Me section (education, experience, focus cards)
- [x] Experience section (intern + TA entries)
- [x] Featured Projects section (Shop Hub, Quiz Management System)
- [x] Skills & Expertise section (technical, soft skills, languages)
- [x] Education section (B.Tech, 12th, 10th)
- [x] Contact/CTA section (Let's Work Together)
- [x] Footer with social links
- [x] contact_submissions table in drizzle/schema.ts + migration applied
- [x] Backend endpoint to store contact form submissions in DB
- [x] Email notification delivered to princekatariyaprince@gmail.com on each submission
- [x] Contact Me button opens popup modal form (Name, Email, Message + Send)
- [x] Send Email button opens popup modal form (same fields)
- [x] Success/error feedback after form submission
- [x] Preserve existing visual design of the original site
- [x] Vitest tests for contact submission flow
- [x] Screenshot verification of all sections
- [x] Modal uses exactly Name, Email, Message fields and "Send" button (Subject field removed)
- [x] Email delivery failure surfaced to user instead of silent success
- [x] End-to-end browser test: test submission stored in DB (row id 60004) and success toast shown
- [x] Gmail SMTP credentials validated via vitest (email.test.ts passes)
## Refinement round (compact + engaging UI)

- [x] Reduce oversized section height and whitespace (hero min-height reduced to 68vh, sections py-20 -> py-14, navbar 16 -> 14px)
- [x] Add subtle entrance animations (fade/slide-up on scroll via IntersectionObserver Reveal component) with stagger
- [x] Richer hero: dot grid pattern, floating gradient blurs, floating hero card with mini stats, availability badge, animated logo
- [x] Add hover effects on cards (lift + shadow) and project images (zoom)
- [x] Mini highlights row in hero card (Full-stack / Databases / Mentoring)
- [x] Navbar refinements: animated logo, hover color transitions, thinner bar
- [x] Visual verification via full-page screenshot (desktop)
- [x] Tests passing (7/7), checkpointed and delivered
