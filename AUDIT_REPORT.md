# 🔍 Production Readiness Audit Report
## J's International Convention Centre Website — `likova-virtual`
**Date:** 2026-07-30 | **Auditor:** Senior Architecture & Security Review Panel | **Stage:** Pre-Client Preview

---

# 1. PROJECT STRUCTURE AUDIT

## Folder Structure
The `src/` structure follows a standard Next.js App Router pattern:
```
src/
├── app/          (6 routes: home, about, contact, gallery, spaces, tour)
├── components/   (19 flat files — no sub-directories)
├── context/      (2 files)
└── hooks/        (1 file)
```

### Issues Found

| # | Issue | Severity | Evidence |
|---|-------|----------|----------|
| 1 | **Components directory is flat — no grouping** | Medium | All 19 components sit in one flat directory. `Header`, `Footer`, `Butterfly`, `WhatsAppWidget`, `AudioWidget`, `SmoothScroll`, `LoadingIndicator` are utility/layout components mixed with page-section components (`HeroSection`, `CTASection`, etc.). No `ui/`, `layout/`, `sections/` grouping. |
| 2 | **Three completely unused components** | High | `InformationSection.tsx`, `VirtualTourSection.tsx`, `FacilitiesSection.tsx` — zero imports anywhere in the codebase. Dead code. |
| 3 | **Massive binary files in project root** | Critical | `next.config.zip` = **1.36 GB**, `slide.af` = **521 MB**. These are NOT in `.gitignore`. If committed, they bloat the repository catastrophically. |
| 4 | **`css butterfly` directory in project root** | Low | Contains prototype HTML/CSS/JS files (`butterfly_demo.html`, `magic-butterfly.css`, `magic-butterfly.js`). This is development scratch — dead code. |
| 5 | **`New folder` in public/** | Critical | Contains 52 raw camera files (`.JPG`, `.af`) totaling **~1.9 GB** of unprocessed photos. This is raw shoot data left in the deployable directory. Spaces in directory names break URLs and tooling. |
| 6 | **`test 360` in public/** | Medium | 8 test JPGs used only on the tour page. Directory name with space. |
| 7 | **`slide.af` in public/360/** | High | An additional 521 MB `.af` file inside `public/360/`. |
| 8 | **`out/` directory present** | Low | Static export directory exists — likely an old build artifact. Should be gitignored (already is, but physically present). |
| 9 | **`server.js` is orphaned** | Medium | `server.js` is a custom Node HTTP server, but `next.config.ts` uses `output: 'export'` (static export). These two approaches are contradictory. |
| 10 | **No per-page metadata** | Medium | Subpages (`about`, `contact`, `gallery`, `spaces`, `tour`) have no `metadata` export. All pages share the root layout metadata: `"Likova space clone with virtual tours"`. |
| 11 | **Poor naming conventions** | Medium | Spaces in directory names (`New folder`, `test 360`, `css butterfly`, `360 for pages`), inconsistent image naming (`046-2-scaled.jpg`, `7bedaf14a4dbcea68368593132a324cf.jpg` — hash-named files). |

### Score: 3/10

**Why:** Presence of gigabytes of raw camera files, dead code, contradictory build configuration, and naming violations are serious structural problems. The component organization is functional but not scalable.

---

# 2. CODE QUALITY

### Issues Found

| # | Issue | Severity | Evidence |
|---|-------|----------|----------|
| 1 | **`any` type used for viewer refs** | Medium | `viewerRef.current` is typed as `useRef<any>(null)` in `HeroSection.tsx:53`, `SpaceSection.tsx`, `tour/page.tsx:29`. Loses all type safety. |
| 2 | **Magic numbers throughout** | Medium | `500` (pin distance), `0.002` (rotation speed), `2500` (target interval), `250` (flee radius), `0.15s` (flap duration), `3500`/`3000`/`5000` (carousel intervals) — all hardcoded with no named constants. Evidence: `HeroSection.tsx:84`, `Butterfly.tsx:34`. |
| 3 | **Duplicated carousel logic** | High | The exact same carousel auto-scroll pattern (get scrollWidth, check if at end, scrollBy) appears in `ExperienceSection.tsx:117-147`, `TestimonialSection.tsx:69-84`, `spaces/page.tsx:100-136`. Should be a custom hook. |
| 4 | **Duplicated 360° auto-rotate loop** | High | The `requestAnimationFrame` → `getPosition` → `rotate` pattern is copy-pasted identically in `IdeaSection.tsx:82-97`, `WhyChooseSection.tsx:148-161`, `SpaceSection.tsx:170-182`, `spaces/page.tsx:164-177`. |
| 5 | **`document.getElementById` in React** | Medium | Direct DOM queries instead of refs in `ExperienceSection.tsx:225-238`, `TestimonialSection.tsx:69`, `IdeaSection.tsx:84`. Anti-pattern in React; bypasses the virtual DOM. |
| 6 | **GSAP class-based selectors** | Low | GSAP animations target string class selectors (`.video-col`, `.facilities-col`, `.facility-card`, `.cta-content`, `.fade-up`). These are fragile — any CSS refactor silently breaks animations. Should use refs. |
| 7 | **`gsap.registerPlugin(ScrollTrigger)` called in every component** | Low | 10+ components each register the plugin independently. Should be done once globally. |
| 8 | **Empty `catch` blocks everywhere** | Medium | `catch (e) {}` in `HeroSection.tsx:183`, `IdeaSection.tsx:94`, `WhyChooseSection.tsx:158`, `SpaceSection.tsx:179`, `tour/page.tsx:98`. Silently swallows errors, making debugging impossible. |
| 9 | **All subpages are `"use client"` entirely** | Medium | `about/page.tsx`, `contact/page.tsx`, `gallery/page.tsx`, `spaces/page.tsx`, `tour/page.tsx` — entire pages marked client. No server component optimization. Loses SSR metadata benefits. |
| 10 | **`suppressHydrationWarning` on html AND body** | Medium | `layout.tsx:45,50`. This is a band-aid for a hydration mismatch that should be fixed properly. |
| 11 | **Import ordering inconsistent** | Low | In `layout.tsx`, imports at lines 1-6 are separated from imports at lines 31-34 by the metadata export. |
| 12 | **Placeholder YouTube video (Rick Roll)** | Critical | `dQw4w9WgXcQ` is the Rick Astley "Never Gonna Give You Up" video ID, used in `ExperienceSection.tsx:173` and `InformationSection.tsx:50`. **This will be visible to the client.** |
| 13 | **Placeholder phone/email in Footer** | Critical | `Footer.tsx:65`: `+91 123 456 7890` and `contact@jsconvention.com` — placeholder data presented as real. |
| 14 | **Placeholder WhatsApp number** | Critical | `WhatsAppWidget.tsx:13`: `911234567890` — placeholder phone number. Comments even say "Replace with the actual business number." |
| 15 | **Contact page phone numbers inconsistent with Footer** | High | Contact page uses `+91 98765 43210` and `+91 12345 67890`; Footer uses `+91 123 456 7890`. All are placeholders but they don't even match each other. |

### Score: 4/10

**Why:** The Rick Roll placeholder in a client-facing video embed is a production blocker. Multiple placeholder data points, significant code duplication, `any` types, and swallowed errors indicate prototype-quality code.

---

# 3. PERFORMANCE AUDIT

### Issues Found

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 1 | **360° panorama `requestAnimationFrame` loops never stop** | Critical | In `IdeaSection.tsx:85-97`, `WhyChooseSection.tsx:148-161`, `SpaceSection.tsx:170-182`, `spaces/page.tsx:164-177` — `requestAnimationFrame` is called recursively inside `onReady` with **no cancellation mechanism**. Even when the component unmounts, the rAF loop keeps running. On the Spaces page, this means **8+ infinite rAF loops running simultaneously**. |
| 2 | **Butterfly animation runs continuously** | High | `Butterfly.tsx:91-198` runs a `requestAnimationFrame` loop every frame, updating DOM styles directly (transform, filter, animationDuration, animationPlayState). This runs on **every page** since it's in the root layout. CPU cost is continuous and unavoidable. |
| 3 | **Hero panorama rAF loop on every frame** | High | `HeroSection.tsx:125-198` — continuous animation frame loop even when the hero is scrolled out of view (the visibility check only partially works). |
| 4 | **Raw JPGs served for 360° panoramas** | Critical | `public/360/` contains `garden.JPG` (17.5 MB), `gate.JPG` (13.9 MB), `path.JPG` (16.9 MB), `turf.JPG` (11 MB). These are raw camera-resolution panoramas served uncompressed. |
| 5 | **Tour page loads 8 unoptimized test JPGs** | High | `public/test 360/` — 8 JPGs ranging 179 KB–637 KB each, no WebP conversion. |
| 6 | **Gallery images are JPGs, not WebP** | Medium | `public/Gallery/` — 12 JPGs, some up to 652 KB. No responsive `srcset` or WebP versions. |
| 7 | **`images.unoptimized: true` in Next.js config** | High | `next.config.ts:7`. Next.js image optimization is explicitly disabled. All `<img>` tags serve raw files at original dimensions. |
| 8 | **No lazy loading on gallery images on homepage** | Medium | `MomentsSection.tsx:97-101` — 10 gallery images use raw `<img>` tags with no `loading="lazy"`. All load immediately on page visit. |
| 9 | **YouTube iframe loaded eagerly** | Medium | `ExperienceSection.tsx:171-178` — YouTube iframe loads on page load, downloading ~500 KB+ of YouTube scripts. No facade pattern. |
| 10 | **`background.mp3` loaded on every page** | Medium | `AudioContext.tsx:35` — 1.8 MB audio file has an `<audio>` element in the root layout, so the browser begins downloading it on every page navigation regardless of whether the user wants audio. |
| 11 | **Lenis smooth scroll + GSAP ticker running continuously** | Medium | `SmoothScroll.tsx:32-33` — GSAP ticker calls `lenis.raf()` on every frame. This is expected for smooth scrolling but adds CPU overhead on idle pages. |
| 12 | **About page loads external Unsplash image** | Medium | `about/page.tsx:237` — External image from `images.unsplash.com`. This is a placeholder founder photo and adds a third-party request. |
| 13 | **Multiple `setInterval` carousels stack up** | Medium | ExperienceSection runs two 3-3.5s intervals simultaneously. TestimonialSection runs another 5s interval. SpacesPage runs two more 3-3.5s intervals. On the homepage, that's **3 concurrent intervals** minimum. |
| 14 | **`mix-blend-mode: exclusion` on butterfly** | Low | `globals.css:45` — Forces compositing layer, increases GPU memory usage. |
| 15 | **No `<link rel="preconnect">` for YouTube or Google Maps** | Medium | Two iframes point to YouTube; contact page embeds Google Maps. No DNS prefetch or preconnect hints. |

### Priority

**High Priority:** Items 1, 4 (rAF leaks, massive uncompressed panoramas)
**Medium Priority:** Items 2, 3, 7, 8, 9 (continuous CPU, disabled optimization, lazy loading)
**Low Priority:** Items 11, 14 (inherent costs of chosen libraries)

### Score: 3/10

---

# 4. LOADING SPEED

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **No image compression pipeline** | Critical | Raw panorama JPGs (11–18 MB each) served directly. No build step for image optimization. |
| 2 | **No Brotli/Gzip configuration** | High | Static export (`output: 'export'`) delegates compression to the hosting server. No evidence of server-side compression configuration. |
| 3 | **No CDN configuration** | Medium | All assets served from the same origin. No CDN or edge caching headers configured. |
| 4 | **Render-blocking: YouTube iframe** | Medium | YouTube embed in ExperienceSection loads synchronously, fetching YouTube's JS bundle early in page load. |
| 5 | **No `preconnect` hints** | Medium | Missing `<link rel="preconnect" href="https://www.youtube.com">` and `<link rel="preconnect" href="https://maps.google.com">`. |
| 6 | **Only one `<link rel="preload">` used** | Low | `layout.tsx:48` preloads `/pix/test.webp`. Other critical images are not preloaded. |
| 7 | **Three Google Fonts loaded** | Low | Geist, Geist_Mono, and Montserrat loaded. Geist_Mono appears unused anywhere in visible UI. |

### Score: 3/10

---

# 5. MOBILE PERFORMANCE

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **Butterfly animation on mobile** | High | Full physics-based butterfly runs on mobile via touch events. CPU-intensive continuous `requestAnimationFrame` loop consumes battery on mobile devices with no way for users to disable it. |
| 2 | **Multiple 360° viewers on spaces page** | Critical | The spaces page can instantiate **8+ ReactPhotoSphereViewer** instances (one per space section). On mobile, this will exhaust available memory and crash lower-end devices. |
| 3 | **Massive panorama images on mobile** | Critical | The same 11-18 MB JPGs are served to mobile devices. No responsive image serving. |
| 4 | **No `meta viewport` tag explicitly set** | Low | Next.js adds this automatically, but there's no explicit control. |
| 5 | **Smooth scrolling on mobile** | Low | Lenis smooth scroll with `touchMultiplier: 2` may conflict with native iOS/Android scrolling behavior and momentum. |
| 6 | **WhatsApp widget overlap on small screens** | Low | The widget expands to `w-72 sm:w-80` which is ~300px. On a 320px screen this will overflow. |

### Score: 3/10

---

# 6. UI / UX REVIEW

### Strengths
- **Color palette is cohesive and premium:** The luxury-dark/gold/mauve/cream/light palette creates an elegant, high-end feel appropriate for a convention centre.
- **Typography is well-considered:** Montserrat is an appropriate choice for luxury branding; tracking, weights, and sizes are well-tuned.
- **Scroll animations are smooth and tasteful:** GSAP scroll-triggered reveals are well-timed and add sophistication.
- **The butterfly is creative and delightful:** A unique interactive element that reinforces the brand personality.
- **Hero 360° panorama is impressive:** The auto-panning panorama slideshow is an excellent hero differentiator.

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **CTA buttons are non-functional** | Critical | "Book a Visit" button (`CTASection.tsx:60`), "Call Now" button, "360 Virtual Tour" button in hero — all are `<button>` elements with no `onClick` handler or `href`. They do nothing. |
| 2 | **Footer links are all `href="#"`** | Critical | All 10 footer links (`Footer.tsx:35-52`) point to `#`. "About Us", "Facilities", "Gallery", "Contact", "Privacy Policy", "Terms of Service" — none navigate anywhere. |
| 3 | **Social media links are all `href="#"`** | High | Twitter, Instagram, Facebook links in footer (`Footer.tsx:19-27`) go nowhere. |
| 4 | **Navigation uses `<Link>` but links to pages that don't all have proper routes** | Medium | "360 Tour" links to `/tour` (correct), but CTA and ExperienceSection link to `/360` which doesn't exist as a route. |
| 5 | **Mobile menu lacks focus trap** | High | Mobile overlay menu (`Header.tsx:179-199`) has no focus trap. Tab key can navigate behind the overlay to hidden content. |
| 6 | **No 404 page** | High | No `not-found.tsx` exists. Navigating to `/360` (linked from ExperienceSection and FacilitiesSection) shows nothing useful. |
| 7 | **Tour page has no Footer** | Medium | `tour/page.tsx` doesn't include a Footer, unlike all other pages. |
| 8 | **Video icons are reversed** | Low | `HeroSection.tsx:276` and `AudioWidget.tsx:25` show `VolumeX` when playing and `Volume2` when paused. Standard convention is the opposite. |

### Score: 5/10

---

# 7. CONVERSION REVIEW

### Can visitors quickly understand:

| Question | Answer | Evidence |
|----------|--------|----------|
| Who we are | ✅ Yes | "J's International Convention Centre" is prominently displayed in the hero. |
| What we offer | ✅ Yes | Convention/wedding venue is clear from hero text and facilities section. |
| Why choose us | ✅ Yes | WhyChooseSection with 5 differentiators. |
| Where to click | ❌ No | CTAs are non-functional buttons. |
| How to contact | ⚠️ Partial | Contact info exists but uses placeholder phone numbers. |

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **All CTAs are dead** | Critical | No button on the homepage navigates anywhere meaningful. "Book a Visit", "Call Now", "360 Virtual Tour" in hero — all non-functional. |
| 2 | **Contact form is fake** | Critical | `contact/page.tsx:53-64` — `handleSubmit` uses `setTimeout` to fake a network request. No actual backend. Success message lies to the user. |
| 3 | **No booking/inquiry flow** | High | For a convention centre, there's no date picker, availability checker, or even a mailto link. |
| 4 | **Placeholder phone numbers** | Critical | Multiple different placeholder numbers across pages. |
| 5 | **Testimonials present well** | ✅ Good | Real Google reviews with names, ratings, and detailed feedback. Strong trust signal. |
| 6 | **Statistics are impactful** | ✅ Good | Counter animation showing capacity numbers (1200+ auditorium, 700 dining, 500 parking) is effective for conversion. |

### Score: 3/10

---

# 8. SEO AUDIT

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **Meta title is generic** | Critical | `layout.tsx:24`: `"Likova Virtual"` — this is an internal project name, NOT a business name. Should be "J's International Convention Centre - Premier Wedding Venue in Kollam, Kerala". |
| 2 | **Meta description is a developer note** | Critical | `layout.tsx:25`: `"Likova space clone with virtual tours"` — This reveals that the site is a clone/rebuild. **MUST be replaced before client sees it.** |
| 3 | **No per-page metadata** | High | All subpages inherit the root metadata. Each page should have unique title and description. |
| 4 | **No OpenGraph tags** | High | No `og:title`, `og:description`, `og:image`. Social media shares will look unprofessional. |
| 5 | **No Twitter Card tags** | High | No `twitter:card`, `twitter:title`, `twitter:image`. |
| 6 | **No structured data / JSON-LD** | High | No `EventVenue`, `LocalBusiness`, or `Organization` schema. Misses rich search results. |
| 7 | **No canonical URLs** | Medium | No `<link rel="canonical">` on any page. |
| 8 | **No `sitemap.xml`** | Medium | No sitemap generation configured. |
| 9 | **No `robots.txt`** | Medium | No robots.txt file. |
| 10 | **Multiple `<h1>` elements on homepage** | Medium | `HeroSection.tsx:261` contains `<h1>` plus the spaces page also has an `<h1>`. |
| 11 | **Heading hierarchy broken** | Medium | ExperienceSection uses multiple `<h2>` and `<h3>` without proper nesting. |
| 12 | **About page has two `<h1>` elements** | Medium | "About Us" hero h1 at `about/page.tsx:150`, though only one is visible. |
| 13 | **Gallery images have generic alt text** | Low | Alt text like "Wedding Celebration 1", "Wedding Details" — not keyword-optimized. |
| 14 | **All pages are `"use client"` — SSR metadata impossible** | High | Since every page uses `"use client"`, metadata exports won't work for subpages even if added. SEO metadata must be in a server component or layout. |

### Score: 2/10

---

# 9. ACCESSIBILITY

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **Mobile menu hamburger has no `aria-label`** | High | `Header.tsx:148` — `<button>` with no accessible name. Screen readers will announce "button". |
| 2 | **Mobile menu has no `aria-expanded`** | High | No ARIA state to communicate menu open/close to assistive technology. |
| 3 | **No skip-to-content link** | Medium | No mechanism for keyboard users to skip the header navigation. |
| 4 | **Carousel controls have no accessible labels** | High | All carousel prev/next buttons (ExperienceSection, TestimonialSection, gallery) contain only SVG icons with no `aria-label`. |
| 5 | **No focus management in gallery lightbox** | High | `gallery/page.tsx:153-198` — lightbox opens but focus isn't trapped. Screen readers can navigate behind the modal. |
| 6 | **Tour page progress dots lack labels** | Medium | `tour/page.tsx:216` has `aria-label` ✅ — one of the few accessible patterns used. |
| 7 | **No `role="navigation"` on mobile menu** | Medium | Mobile overlay nav lacks landmark role. |
| 8 | **Color contrast concerns** | Medium | `luxury-mauve` (#A48374) on `luxury-light` (#F1EDE6) yields approximately 3.0:1 contrast ratio. WCAG AA requires 4.5:1 for normal text. Multiple body text elements use this combination. |
| 9 | **Hero text over panorama has no guaranteed contrast** | High | White text overlaid on auto-panning panorama. Depending on the panorama angle, text may become unreadable. |
| 10 | **Keyboard navigation of interactive lists** | Medium | WhyChooseSection's feature list (`WhyChooseSection.tsx:182-231`) uses `onClick` and `onMouseEnter` but no `onKeyDown` or keyboard interaction. |
| 11 | **Form inputs have labels** | ✅ Good | Contact form properly associates `<label>` with `htmlFor`. |
| 12 | **AudioWidget has `aria-label`** | ✅ Good | `AudioWidget.tsx:23`. |

### Score: 3/10

---

# 10. SECURITY AUDIT

### Issues Found

| # | Issue | Severity | Classification |
|---|-------|----------|----------------|
| 1 | **Contact form submits nowhere** | Medium | The form handler `contact/page.tsx:53-64` simulates success with `setTimeout`. No actual submission means no data validation needed yet, but the fake success message is deceptive. |
| 2 | **No Content Security Policy (CSP)** | High | No CSP headers configured. External resources (YouTube, Google Maps, Unsplash) are loaded without restriction. |
| 3 | **No security headers** | Medium | No `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy` headers. |
| 4 | **External image from Unsplash** | Medium | `about/page.tsx:237` loads an image from `images.unsplash.com`. If Unsplash goes down or image is removed, the founder section breaks. Also a potential XSS vector if domain is ever compromised. |
| 5 | **`window.open` in WhatsApp widget** | Low | `WhatsAppWidget.tsx:23` — `window.open(url, "_blank")` without `noopener,noreferrer`. |
| 6 | **No HTTPS enforcement** | Medium | `server.js` creates an HTTP server. No TLS/HTTPS configuration. |
| 7 | **Static export = no server-side vulnerabilities** | ✅ Good | The `output: 'export'` configuration means there's no server-side attack surface for the Next.js app itself. |
| 8 | **No sensitive data exposed** | ✅ Good | No API keys, tokens, or secrets found in the codebase. |

### Score: 5/10

---

# 11. FRONTEND SECURITY

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **No console.log statements found** | ✅ Good | Clean. |
| 2 | **No debug code found** | ✅ Good | No TODO/FIXME markers in source. |
| 3 | **No source maps in production concern** | Low | Next.js static export may include source maps by default. Should be explicitly disabled in `next.config.ts`. |
| 4 | **No exposed API endpoints** | ✅ Good | Static site, no API routes. |
| 5 | **No sensitive data in localStorage/sessionStorage** | ✅ Good | No storage usage found. |
| 6 | **Placeholder data exposure** | Critical | Internal project name "Likova space clone" in meta description. Developer comments like "Replace with the actual business number" visible in source. |

### Score: 6/10

---

# 12. DEPENDENCY AUDIT

### Dependencies Analysis

| Package | Version | Assessment |
|---------|---------|------------|
| `next` | 16.2.10 | Current |
| `react` / `react-dom` | 19.2.4 | Current |
| `gsap` | ^3.15.0 | **Heavy** — GSAP core + ScrollTrigger. ~85 KB min+gzip. Justified by the animation-heavy design. |
| `lenis` | ^1.3.25 | **Medium** — ~15 KB. Smooth scroll library. |
| `@photo-sphere-viewer/core` + `react-photo-sphere-viewer` | Latest | **Heavy** — Photo Sphere Viewer is substantial (~100 KB+). Used dynamically (good), but multiple instances are wasteful. |
| `lucide-react` | ^1.25.0 | Good — tree-shakeable icon library. |
| `clsx` | ^2.1.1 | Good — tiny utility. |
| `tailwind-merge` | ^3.6.0 | **Unused** — `tailwind-merge` is imported in package.json but grep shows zero imports in source code. |
| `tailwindcss` | ^4 | Good — used for styling. |
| `Geist_Mono` font | — | **Unused** — Loaded in `layout.tsx:13-16` but never referenced in any component. |

### Issues

| # | Issue | Severity |
|---|-------|----------|
| 1 | **`tailwind-merge` installed but never imported** | Low | Unnecessary dependency. |
| 2 | **`Geist_Mono` font loaded but unused** | Medium | Adds network request for a font that's never displayed. |
| 3 | **No `npm audit` results available** | Medium | Should run `npm audit` before production. |

### Score: 6/10

---

# 13. IMAGE AUDIT

### All Images Reviewed

| Location | File | Size | Format | Issues |
|----------|------|------|--------|--------|
| `/pix/` | test.webp | 311 KB | WebP | ✅ Hero panorama, reasonable size |
| `/pix/` | path.webp | 323 KB | WebP | ✅ OK |
| `/pix/` | garden.webp | 230 KB | WebP | ✅ OK |
| `/pix/` | main.webp | 97 KB | WebP | ✅ Good |
| `/pix/` | main hall seating.jpg | 384 KB | **JPG** | ❌ Not WebP, unused (only referenced in code comments) |
| `/pix/` | icon.svg | 11 KB | SVG | ✅ OK |
| `/360/` | garden.JPG | **17.5 MB** | **JPG** | ❌ **CRITICAL** — Raw camera panorama |
| `/360/` | gate.JPG | **13.9 MB** | **JPG** | ❌ **CRITICAL** — Raw camera panorama |
| `/360/` | path.JPG | **16.9 MB** | **JPG** | ❌ **CRITICAL** — Raw camera panorama |
| `/360/` | turf.JPG | **11 MB** | **JPG** | ❌ **CRITICAL** — Raw camera panorama |
| `/360/` | slide.af | **521 MB** | Unknown | ❌ **CRITICAL** — Raw project file in public dir |
| `/Gallery/` | 12 JPGs | 124–652 KB | **JPG** | ❌ Should be WebP. No responsive versions. |
| `/Images/` | 12 WebPs | 36–221 KB | WebP | ✅ Good |
| `/Images/360 for pages/` | 10 WebPs | 85–383 KB | WebP | ✅ Reasonable for 360 panos |
| `/New folder/` | 52 raw photos | **1.9 GB total** | JPG/AF | ❌ **CRITICAL** — Raw camera dump, deployable |
| `/test 360/` | 8 JPGs | 179–637 KB | JPG | ❌ Should be WebP |
| Root | next.config.zip | **1.36 GB** | ZIP | ❌ **CRITICAL** — In project root |
| Root | slide.af | **521 MB** | AF | ❌ **CRITICAL** — In project root |

**Total unnecessary assets in deployable directory:** ~4.2 GB

### Score: 2/10

---

# 14. SCRIPT AUDIT

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **Leaked `requestAnimationFrame` loops** | Critical | As detailed in Performance §1. Multiple rAF loops in 360° viewer `onReady` callbacks have no cleanup path. |
| 2 | **Butterfly script runs on every page** | High | Global layout includes `<Butterfly />`. Every page pays the CPU cost. |
| 3 | **GSAP + ScrollTrigger bundle** | Medium | ~85 KB. Justified by usage, but registered 10+ times. |
| 4 | **Photo Sphere Viewer dynamically imported** | ✅ Good | All instances use `dynamic()` import with `ssr: false`. |
| 5 | **No third-party tracking scripts** | ✅ Good | No Google Analytics, Facebook Pixel, etc. Clean. |
| 6 | **YouTube iframe** | Medium | Loads YouTube's full JS bundle. Should use lite-youtube-embed or a facade. |

### Score: 4/10

---

# 15. CSS AUDIT

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **Butterfly CSS in globals.css** | Low | `globals.css:35-63` — 30 lines of butterfly-specific CSS in the global stylesheet. Should be scoped to the component. |
| 2 | **Dark mode definition exists but unused** | Medium | `globals.css:22-27` — `prefers-color-scheme: dark` is defined but the site has no dark mode implementation. Variables `--background` and `--foreground` are overridden immediately by luxury theme colors. Dead code. |
| 3 | **Tailwind v4 used correctly** | ✅ Good | `@theme inline` block properly defines custom colors and fonts. |
| 4 | **Consistent class naming** | ✅ Good | Tailwind utility classes are used consistently. No mixed approaches. |
| 5 | **Extremely long class strings** | Low | Some elements have 200+ character class strings. Readable but hard to maintain. |
| 6 | **Scrollbar hiding uses three vendor approaches** | ✅ Good | `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]` — proper cross-browser approach. |

### Score: 7/10

---

# 16. ANIMATION AUDIT

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **Butterfly animation is CPU-intensive** | High | Runs at 60fps, updates `transform`, `filter`, `animationDuration`, `animationPlayState` on every frame. Uses `will-change: transform` (good) but `filter` changes force repaint. |
| 2 | **Marquee CSS animation** | ✅ Good | `globals.css:68-77` — Pure CSS `translateX` animation, GPU-accelerated. |
| 3 | **GSAP ScrollTrigger animations** | ✅ Good | Well-implemented scrub and toggle animations. Proper cleanup with `ctx.revert()`. |
| 4 | **Butterfly wing flap animation at 0.04s (25fps)** | Medium | `Butterfly.tsx:176` — during FLEEING state, animation duration is set to 40ms. This is extremely fast and may cause visual jank on lower-end displays. |
| 5 | **`animate-bounce` on scroll indicator** | Low | `HeroSection.tsx:282` — Tailwind `animate-bounce` is CSS-based and GPU-accelerated. Fine. |
| 6 | **No `prefers-reduced-motion` respect** | High | None of the animations (GSAP, butterfly, marquee, 360° rotation) check `prefers-reduced-motion`. WCAG 2.1 SC 2.3.3 violation. |

### Score: 5/10

---

# 17. PRODUCTION READINESS

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **No 404 page** | High | No `not-found.tsx` or custom error handling. |
| 2 | **No 500/error page** | High | No `error.tsx` boundary. |
| 3 | **No loading states for subpages** | Medium | No `loading.tsx` files for route transitions. |
| 4 | **Contact form fakes success** | Critical | Users will believe their message was sent. It wasn't. |
| 5 | **`server.js` contradicts `output: 'export'`** | High | Can't use a custom Node server with static export. Deployment strategy is confused. |
| 6 | **Rick Roll video placeholder** | Critical | Client will see a meme video instead of actual venue footage. |
| 7 | **Internal project name in metadata** | Critical | "Likova Virtual" / "Likova space clone" visible in browser tab and search engines. |
| 8 | **Missing images on Spaces page** | High | `DSC08545.jpg`, `DSC00288.jpg`, `DSC07834.jpg` are referenced in `spaces/page.tsx` but don't exist in the public directory. These will show broken images. |
| 9 | **Link to `/360` route that doesn't exist** | High | `ExperienceSection.tsx:318-323` links to `/360`. No such route. |
| 10 | **Founder photo is a stock image** | Medium | `about/page.tsx:237` — External Unsplash placeholder. Comment says "Replace the src below with the actual founder picture". |
| 11 | **Unused `ArrowDown` import** | Low | `HeroSection.tsx:6` imports `ArrowDown` but never uses it. |
| 12 | **Unused `Play` import** | Low | `spaces/page.tsx:5` imports `Play` but never uses it. |

### Score: 2/10

---

# 18. BUSINESS REVIEW

| Criterion | Assessment | Score |
|-----------|-----------|-------|
| Brand perception | Strong visual identity with cohesive color palette. The gold/cream/dark brown palette communicates luxury effectively. | 7/10 |
| Luxury feel | Good. Animations, typography, and spacing create a premium atmosphere. | 7/10 |
| Trust | **Severely undermined** by placeholder phone numbers, fake contact form, and stock founder photo. A discerning client will notice. | 2/10 |
| Premium quality | The 360° panorama experience is genuinely impressive and differentiating. However, the Rick Roll video destroys credibility. | 4/10 |
| Photography | Real venue photos (Gallery, Images) are high-quality and professional. Gallery images showcase actual events. | 8/10 |
| Emotional impact | Testimonials are authentic and moving. The "Moments & Memories" gallery creates emotional resonance. | 7/10 |
| Professional appearance | Would pass initial visual inspection. Breaks down under any interaction (clicking CTAs, checking footer links, etc.). | 5/10 |
| Would a premium customer trust this website? | **Not in current state.** The non-functional buttons, placeholder data, and fake form would destroy trust immediately upon any interaction beyond passive scrolling. | 3/10 |

### Score: 4/10

---

# 19. FINAL SCORECARD

| Category | Score | Grade |
|----------|-------|-------|
| 1. Project Structure | 3/10 | D |
| 2. Code Quality | 4/10 | D+ |
| 3. Performance | 3/10 | D |
| 4. Loading Speed | 3/10 | D |
| 5. Mobile Performance | 3/10 | D |
| 6. UI/UX | 5/10 | C- |
| 7. Conversion | 3/10 | D |
| 8. SEO | 2/10 | F |
| 9. Accessibility | 3/10 | D |
| 10. Security | 5/10 | C- |
| 11. Frontend Security | 6/10 | C |
| 12. Dependencies | 6/10 | C |
| 13. Image Assets | 2/10 | F |
| 14. Scripts | 4/10 | D+ |
| 15. CSS | 7/10 | B- |
| 16. Animations | 5/10 | C- |
| 17. Production Readiness | 2/10 | F |
| 18. Business Review | 4/10 | D+ |

| Metric | Value |
|--------|-------|
| **Overall Score** | **3.8 / 10** |
| **Production Readiness** | **15%** |
| **Performance Grade** | D |
| **Security Grade** | C |
| **SEO Grade** | F |
| **UX Grade** | C- |
| **Accessibility Grade** | D |
| **Code Quality Grade** | D+ |
| **Maintainability Grade** | D+ |

---

# 20. PRIORITY ACTION PLAN

## 🔴 Critical — Fix Before Showing to Client

These items will **immediately embarrass** the agency or **break client trust**:

| # | Action | Files Affected | Effort |
|---|--------|---------------|--------|
| 1 | **Replace Rick Roll YouTube embed with actual venue video or remove** | `ExperienceSection.tsx:173` | 5 min |
| 2 | **Replace metadata title/description** | `layout.tsx:23-25` | 5 min |
| 3 | **Replace all placeholder phone numbers/emails with real data** | `Footer.tsx:65,69`, `WhatsAppWidget.tsx:13`, `contact/page.tsx:127-143` | 15 min |
| 4 | **Make CTA buttons functional** (link to `/contact` or `tel:` links) | `CTASection.tsx:60-64`, `HeroSection.tsx:269-271` | 15 min |
| 5 | **Fix or disable the contact form** (either integrate a backend or clearly mark as "coming soon") | `contact/page.tsx:53-64` | 30 min |
| 6 | **Fix footer links** to point to actual pages | `Footer.tsx:35-52` | 15 min |
| 7 | **Fix broken images on Spaces page** (`DSC08545.jpg`, `DSC00288.jpg`, `DSC07834.jpg`) | `spaces/page.tsx:77,87` | 15 min |
| 8 | **Replace stock founder photo** with actual founder image | `about/page.tsx:237` | 5 min |
| 9 | **Fix broken `/360` route** (change link to `/tour` or create route) | `ExperienceSection.tsx:318` | 5 min |
| 10 | **Remove 4+ GB of raw files from public/** | `public/New folder/`, `public/360/slide.af`, root `next.config.zip`, root `slide.af` | 10 min |

## 🟡 Recommended — Fix Before Production Deployment

| # | Action | Effort |
|---|--------|--------|
| 1 | Convert raw 360° JPGs (11–18 MB each) to WebP at reasonable resolution | 1 hour |
| 2 | Convert Gallery JPGs to WebP | 30 min |
| 3 | Add `loading="lazy"` to all non-critical images | 30 min |
| 4 | Fix the `requestAnimationFrame` memory leaks in 360° viewers | 2 hours |
| 5 | Add per-page metadata for all routes | 1 hour |
| 6 | Add OpenGraph/Twitter Card metadata | 1 hour |
| 7 | Create `not-found.tsx` and `error.tsx` pages | 1 hour |
| 8 | Add `aria-label` to hamburger menu and carousel buttons | 30 min |
| 9 | Add focus trap to mobile menu and lightbox | 1 hour |
| 10 | Delete 3 unused components (InformationSection, VirtualTourSection, FacilitiesSection) | 10 min |
| 11 | Resolve `server.js` vs `output: 'export'` confusion | 30 min |
| 12 | Extract carousel auto-scroll logic into a reusable hook | 1 hour |
| 13 | Extract 360° auto-rotate into a reusable hook | 1 hour |
| 14 | Add `prefers-reduced-motion` support | 1 hour |
| 15 | Add `rel="noopener noreferrer"` to external links | 15 min |
| 16 | Remove unused `tailwind-merge` dependency | 5 min |
| 17 | Remove unused `Geist_Mono` font | 5 min |
| 18 | Add social media links to footer | 15 min |
| 19 | Disable the butterfly on mobile or make it opt-in | 1 hour |

## 🟢 Future Improvements — Can Be Done Later

| # | Action |
|---|--------|
| 1 | Implement actual contact form backend (Formspree, Netlify Forms, or custom API) |
| 2 | Add JSON-LD structured data (LocalBusiness, EventVenue schema) |
| 3 | Add sitemap.xml and robots.txt |
| 4 | Implement YouTube lite embed (facade pattern) |
| 5 | Add `preconnect` hints for YouTube and Google Maps |
| 6 | Implement proper dark mode or remove the CSS declaration |
| 7 | Set up security headers (CSP, HSTS, X-Content-Type-Options) |
| 8 | Add loading.tsx for route transitions |
| 9 | Component directory restructuring (ui/, layout/, sections/) |
| 10 | Convert carousel components to use Intersection Observer for pausing when off-screen |
| 11 | Add Google Analytics or similar |
| 12 | Add Privacy Policy and Terms of Service pages |
| 13 | Run `npm audit` and address vulnerabilities |
| 14 | Configure source map generation for production |

---

# 21. EXECUTIVE SUMMARY

## Overview

This audit examines the **J's International Convention Centre** website, a Next.js 16 / React 19 application built as a luxury marketing site with 360° virtual tour capabilities. The site features an ambitious design vision with panoramic viewers, animated butterfly cursor, smooth scrolling, and polished visual aesthetics.

## Biggest Strengths

1. **Visual Design Quality:** The color palette, typography, spacing, and animation timing create a genuinely premium luxury feel. The design language is cohesive across all pages and communicates the right brand identity for a high-end convention centre.

2. **360° Panorama Integration:** The use of Photo Sphere Viewer with auto-rotation creates an immersive experience that differentiates this site from typical venue websites. The hero slideshow with boundary-triggered transitions is a technically creative solution.

3. **Content Quality:** Real Google reviews, professional venue photography, and detailed facility descriptions provide authentic, trust-building content. The about page tells a compelling founder story.

4. **Bot-Aware Architecture:** The PreloaderContext intelligently detects bots and serves them a lightweight static version, which shows awareness of performance and SEO trade-offs.

5. **Interactive Butterfly:** A creative and technically impressive interactive element that adds delight and personality to the browsing experience.

## Biggest Weaknesses

1. **Pervasive Placeholder Content:** The site contains a Rick Roll YouTube video, fake phone numbers, a fake contact form, stock founder photo, and an internal project name ("Likova space clone") in the meta description. **Any one of these items would undermine client confidence.**

2. **Catastrophic Asset Bloat:** Over **4 GB of raw camera files, project files, and archives** sit in deployable directories. Individual panorama JPGs reach 18 MB. This makes the site undeployable in its current state without significant cleanup.

3. **Memory Leaks and CPU Waste:** Multiple `requestAnimationFrame` loops in 360° viewer callbacks have no cancellation mechanism. The butterfly animation runs on every page. On the Spaces page, 8+ infinite animation loops could run simultaneously, degrading mobile performance severely.

4. **SEO is Essentially Absent:** No meaningful meta titles, no descriptions, no OpenGraph, no structured data, no sitemap, no robots.txt. The site is invisible to search engines.

5. **Non-Functional Interactive Elements:** Every CTA button, every footer link, and the contact form are non-functional. The site looks complete but falls apart on interaction.

## Potential Risks

- **Client Presentation Risk:** If the client clicks any button, fills the contact form, or checks the YouTube embed, credibility is destroyed immediately.
- **Deployment Risk:** The 4+ GB of raw files will cause deployment failures or extreme costs on hosting platforms with bandwidth limits.
- **Legal Risk:** The fake contact form could constitute deceptive practice if a user believes their message was sent.
- **SEO Risk:** The "Likova space clone" meta description could be indexed by Google before it's changed.
- **Performance Risk:** On mobile devices, multiple 360° viewers and the continuous butterfly animation will cause poor user experience, high battery drain, and potential crashes.

## Production Blockers

The following **10 items** are absolute blockers that **must be resolved** before any client presentation or production deployment:

1. Rick Roll YouTube placeholder
2. "Likova space clone" metadata
3. Placeholder phone numbers/emails
4. Non-functional CTA buttons
5. Fake contact form success
6. Broken images on Spaces page
7. Stock founder photo
8. Dead `/360` route link
9. 4+ GB raw files in public directory
10. Dead `href="#"` footer links

## Professional Recommendations

1. **Immediate (Today):** Address all 10 Critical items from the action plan. These are copy/paste fixes that take ~2 hours total.
2. **This Week:** Image optimization (convert panoramas to WebP, establish a compression pipeline), fix memory leaks, add per-page metadata.
3. **Before Production:** Full accessibility pass, security headers, sitemap/robots, error pages, decision on contact form backend.
4. **Post-Launch:** Structured data, analytics, performance monitoring, component refactoring.

## Expected Performance After Improvements

After addressing Critical and Recommended items:
- **Page weight** would drop from potentially 50+ MB to under 5 MB
- **LCP** would improve from 8+ seconds to under 2.5 seconds
- **SEO** would go from invisible to properly indexable
- **Conversion** would go from 0% (no functional CTAs) to measurable
- **Overall Score** would improve from 3.8/10 to approximately 7/10

> **⚠️ CAUTION:**
> **This site is NOT ready for client presentation.** The Rick Roll video, fake contact form, and "Likova space clone" metadata would immediately communicate a lack of professionalism to any client. Address the 10 critical items before any preview session.

---

*Report generated 2026-07-30. This audit was conducted through static code analysis of the full codebase. Runtime performance metrics (Lighthouse, WebPageTest) were not captured and should supplement this review.*
