# Portfolio Design Features — Prompts + Ready-to-Use SVG Assets

Direction chosen: keep your current dark/light mono-editorial base, but layer in a **PCB/circuit-trace visual language** throughout (background texture, loader, dividers, icons) since it reinforces "hardware engineer" better than plain dots. Every SVG below is hand-written and free to use — no licensing concerns.

Run these in the same order they appear. Each is self-contained.

---

## 1. PCB circuit-trace background pattern (replaces/supplements the dot grid)

**Prompt:**
> Add a subtle repeating circuit-trace SVG pattern as a background layer, sitting behind content at very low opacity, in addition to (or instead of) the existing dot-grid `body::after`.
>
> 1. Save this file as `assets/pcb-pattern.svg`:
> ```svg
> <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
>   <g fill="none" stroke="currentColor" stroke-width="1.2">
>     <path d="M10 10 H70 V50 H130" />
>     <path d="M130 50 V110 H190" />
>     <path d="M10 90 H50 V150 H10" />
>     <path d="M90 190 V150 H150 V100" />
>     <path d="M150 20 V60" />
>     <circle cx="70" cy="50" r="3" fill="currentColor" stroke="none" />
>     <circle cx="130" cy="50" r="3" fill="currentColor" stroke="none" />
>     <circle cx="130" cy="110" r="3" fill="currentColor" stroke="none" />
>     <circle cx="50" cy="150" r="3" fill="currentColor" stroke="none" />
>     <circle cx="150" cy="100" r="3" fill="currentColor" stroke="none" />
>     <circle cx="150" cy="20" r="2.5" fill="currentColor" stroke="none" />
>     <rect x="26" y="26" width="10" height="10" />
>     <rect x="166" y="166" width="10" height="10" />
>   </g>
> </svg>
> ```
> 2. In `style.css`, replace or supplement the existing `body::after` dot-grid rule with:
> ```css
> body::before {
>   content: "";
>   position: fixed;
>   inset: 0;
>   z-index: -1;
>   background-image: url('assets/pcb-pattern.svg');
>   background-size: 200px 200px;
>   background-repeat: repeat;
>   color: var(--fg);
>   opacity: 0.04;
>   pointer-events: none;
> }
> [data-theme="dark"] body::before { opacity: 0.06; }
> ```
> Note: `color: currentColor` inside an `<img>`-referenced SVG won't inherit CSS — since this is loaded via `background-image: url()`, the SVG's `stroke="currentColor"` will render black/default, not your theme color. To make it theme-aware, either (a) inline the SVG directly in the CSS as a data-URI with a hardcoded color per theme, or (b) simpler: place the SVG as an actual `<svg>` element fixed-positioned in `index.html` instead of a CSS background-image, so `currentColor` picks up `color: var(--fg)` from a wrapping div. Use option (b):
> ```html
> <div id="pcb-bg" aria-hidden="true"></div>
> ```
> ```css
> #pcb-bg {
>   position: fixed;
>   inset: 0;
>   z-index: -1;
>   pointer-events: none;
>   color: var(--fg);
>   opacity: 0.045;
>   background-repeat: repeat;
>   background-size: 200px 200px;
> }
> ```
> ```js
> // In main.js, on load, fetch and inline the SVG as a background so currentColor works via a mask instead:
> fetch("assets/pcb-pattern.svg")
>   .then(r => r.text())
>   .then(svg => {
>     const encoded = encodeURIComponent(svg.replace(/currentColor/g, "black"));
>     document.getElementById("pcb-bg").style.maskImage = `url("data:image/svg+xml,${encoded}")`;
>     document.getElementById("pcb-bg").style.webkitMaskImage = `url("data:image/svg+xml,${encoded}")`;
>     document.getElementById("pcb-bg").style.maskRepeat = "repeat";
>     document.getElementById("pcb-bg").style.webkitMaskRepeat = "repeat";
>     document.getElementById("pcb-bg").style.maskSize = "200px 200px";
>     document.getElementById("pcb-bg").style.webkitMaskSize = "200px 200px";
>     document.getElementById("pcb-bg").style.background = "var(--fg)";
>   });
> ```
> Verify: a faint circuit-trace pattern is visible behind content in both light and dark themes, correctly tinted to match the theme's foreground color, and doesn't interfere with text readability.

---

## 2. Oscilloscope-style loader (replaces or complements the progress bar)

**Prompt:**
> Add an animated sine-wave "signal lock" visual to the existing `#startup-loader`.
> 1. Inside `#startup-loader` in `index.html`, add this SVG above or below the existing progress bar:
> ```svg
> <svg id="scope-wave" width="240" height="60" viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg">
>   <line x1="0" y1="30" x2="240" y2="30" stroke="var(--line)" stroke-width="1" stroke-dasharray="2 3"/>
>   <path id="scope-path" d="M0 30 Q 15 5, 30 30 T 60 30 T 90 30 T 120 30 T 150 30 T 180 30 T 210 30 T 240 30"
>         fill="none" stroke="var(--accent)" stroke-width="2"/>
> </svg>
> ```
> 2. In `main.js`, inside the loader logic (wherever progress is updated, e.g. inside the existing loader interval/timeout callback), add:
> ```js
> const scopePath = document.getElementById("scope-path");
> function drawWave(progress) {
>   // amplitude grows from noisy/flat to a clean locked sine wave as progress -> 1
>   const amp = 4 + progress * 20;
>   const noise = (1 - progress) * 10;
>   let d = "M0 30";
>   for (let x = 0; x <= 240; x += 10) {
>     const y = 30 - Math.sin((x / 240) * Math.PI * 4) * amp + (Math.random() - 0.5) * noise;
>     d += ` L${x} ${y.toFixed(1)}`;
>   }
>   scopePath.setAttribute("d", d);
> }
> ```
> 3. Call `drawWave(currentProgress)` on every tick of your existing loader progress update (wherever the loader's percentage/width is currently being set), passing the same 0–1 progress value already driving the progress bar.
> Verify: during page load, a wavy/noisy line settles into a clean sine curve exactly as the loader reaches 100%, then the loader fades out as before.

---

## 3. "Now" section — what you're currently building/learning

**Prompt:**
> Add a compact "Now" block between the Hero and Featured Systems sections.
> ```html
> <section id="now" class="section-now">
>   <div class="now-inner">
>     <span class="now-dot" aria-hidden="true"></span>
>     <p><strong>Now:</strong> <span id="now-text">Building out embedded automation projects and studying control systems.</span></p>
>     <span class="now-updated">Updated Aug 2026</span>
>   </div>
> </section>
> ```
> ```css
> .section-now {
>   border-top: 1px solid var(--line);
>   border-bottom: 1px solid var(--line);
>   padding: 1.2rem 2rem;
> }
> .now-inner {
>   max-width: 60rem;
>   margin: 0 auto;
>   display: flex;
>   align-items: center;
>   gap: 0.75rem;
>   font-family: 'DM Mono', monospace;
>   font-size: 0.8rem;
>   flex-wrap: wrap;
> }
> .now-dot {
>   width: 8px; height: 8px; border-radius: 50%;
>   background: #3ecf5e;
>   box-shadow: 0 0 0 rgba(62,207,94,0.5);
>   animation: now-pulse 2s infinite;
> }
> @keyframes now-pulse {
>   0% { box-shadow: 0 0 0 0 rgba(62,207,94,0.5); }
>   70% { box-shadow: 0 0 0 8px rgba(62,207,94,0); }
>   100% { box-shadow: 0 0 0 0 rgba(62,207,94,0); }
> }
> .now-updated { margin-left: auto; color: var(--fg2); font-size: 0.7rem; }
> ```
> Just hand-edit `#now-text` and `.now-updated` text every few weeks — no backend needed.

---

## 4. Build log — short dated entries

**Prompt:**
> Add a "Log" section as a simple reverse-chronological list, styled like terminal commit entries.
> ```html
> <section id="log" class="section-full">
>   <h2 class="section-heading">// build log</h2>
>   <ul class="log-list">
>     <li class="log-entry">
>       <span class="log-date">2026-08-20</span>
>       <p>Rewired the line-follower's sensor array — turns out one photoresistor was just bad, not the code. Three hours I won't get back.</p>
>     </li>
>     <li class="log-entry">
>       <span class="log-date">2026-08-05</span>
>       <p>Started reading into PID tuning for the automation rig. Still fighting oscillation on sharp turns.</p>
>     </li>
>   </ul>
> </section>
> ```
> ```css
> .log-list { list-style: none; max-width: 42rem; margin: 2rem auto 0; display: flex; flex-direction: column; gap: 1.5rem; }
> .log-entry { border-left: 2px solid var(--line); padding-left: 1rem; }
> .log-date { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--accent); display: block; margin-bottom: 0.3rem; }
> ```
> Add a new `<li class="log-entry">` at the top whenever you want — newest first.

---

## 5. Skills radar/competency chart

**Prompt:**
> Replace or supplement the skill pills with a radar chart SVG for a quick visual read of strengths.
> ```svg
> <svg viewBox="0 0 300 300" width="280" height="280" xmlns="http://www.w3.org/2000/svg" id="radar-chart">
>   <g stroke="var(--line)" fill="none" stroke-width="1">
>     <polygon points="150,30 260,105 220,235 80,235 40,105" />
>     <polygon points="150,70 220,120 195,205 105,205 80,120" />
>     <polygon points="150,110 180,135 168,175 132,175 120,135" />
>     <line x1="150" y1="150" x2="150" y2="30" />
>     <line x1="150" y1="150" x2="260" y2="105" />
>     <line x1="150" y1="150" x2="220" y2="235" />
>     <line x1="150" y1="150" x2="80" y2="235" />
>     <line x1="150" y1="150" x2="40" y2="105" />
>   </g>
>   <polygon id="radar-fill" points="150,45 235,115 200,215 100,220 70,120"
>            fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="2"/>
>   <g font-family="DM Mono, monospace" font-size="11" fill="var(--fg)">
>     <text x="150" y="20" text-anchor="middle">Embedded C/C++</text>
>     <text x="270" y="105" text-anchor="start">Python</text>
>     <text x="225" y="255" text-anchor="middle">Automation</text>
>     <text x="75" y="255" text-anchor="middle">Web Dev</text>
>     <text x="30" y="105" text-anchor="end">Circuit Design</text>
>   </g>
> </svg>
> ```
> Adjust the `#radar-fill` polygon's five points inward/outward to reflect your actual self-rated strength on each of the five axes (further from center = stronger). Place this next to or below the existing skill-pills grid in the Skills section.

---

## 6. Custom 404 page — "signal lost"

**Prompt:**
> Create `404.html` (Firebase Hosting serves this automatically for unmatched routes if configured — add `"404": "/404.html"` or ensure `firebase.json` has a `"cleanUrls"`/error page rule, or just set it in Firebase Hosting settings).
> ```html
> <!DOCTYPE html>
> <html lang="en" data-theme="dark">
> <head>
>   <meta charset="UTF-8" />
>   <title>404 — Signal Lost</title>
>   <link rel="stylesheet" href="style.css" />
> </head>
> <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:1.5rem;text-align:center;">
>   <svg width="180" height="120" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
>     <g fill="none" stroke="var(--accent)" stroke-width="2">
>       <path d="M10 60 H60" />
>       <path d="M100 60 H170" stroke-dasharray="4 6" opacity="0.4" />
>       <circle cx="60" cy="60" r="4" fill="var(--accent)" stroke="none" />
>       <circle cx="100" cy="60" r="4" fill="none" stroke="var(--accent)" stroke-dasharray="2 2" />
>       <path d="M70 45 L90 75 M90 45 L70 75" stroke-width="2.5" />
>     </g>
>   </svg>
>   <h1 style="font-family:'DM Mono',monospace;font-size:1.3rem;">404 — Signal Lost</h1>
>   <p style="font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--fg2);max-width:26rem;">
>     The connection between here and there got interrupted. Check the trace, or head back home.
>   </p>
>   <a href="/" style="font-family:'DM Mono',monospace;font-size:0.8rem;border:1px solid var(--line);padding:0.6rem 1.2rem;border-radius:999px;text-decoration:none;color:var(--fg);">← Back to signal</a>
> </body>
> </html>
> ```
> The broken-wire SVG (dashed line + X marks at the gap) visually reinforces "disconnected circuit" instead of a generic sad-face graphic.

---

## 7. Konami-code easter egg (matches your existing console-log personality)

**Prompt:**
> In `main.js`, add near your other easter-egg code:
> ```js
> const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
> let konamiIndex = 0;
> document.addEventListener("keydown", (e) => {
>   konamiIndex = e.key === konami[konamiIndex] ? konamiIndex + 1 : 0;
>   if (konamiIndex === konami.length) {
>     konamiIndex = 0;
>     document.body.classList.toggle("lab-mode");
>   }
> });
> ```
> ```css
> body.lab-mode #pcb-bg { opacity: 0.15; animation: pcb-scan 4s linear infinite; }
> @keyframes pcb-scan { 0% { background-position: 0 0; } 100% { background-position: 200px 200px; } }
> body.lab-mode::before {
>   content: "LAB MODE ENGAGED";
>   position: fixed; top: 0.5rem; left: 50%; transform: translateX(-50%);
>   font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em;
>   color: var(--accent); z-index: 10020; pointer-events: none;
> }
> ```
> Verify: entering ↑↑↓↓←→←→BA on the keyboard toggles a visible "lab mode" state (animated background + banner). Purely cosmetic, zero functional risk.

---

## 8. Status dot in the nav

**Prompt:**
> Add a manually-updated status indicator next to your logo/name in the nav.
> ```html
> <span class="status-indicator" title="Current status">
>   <span class="status-dot"></span> Open to work
> </span>
> ```
> ```css
> .status-indicator {
>   display: inline-flex; align-items: center; gap: 0.4rem;
>   font-family: 'DM Mono', monospace; font-size: 0.65rem;
>   color: var(--fg2); margin-left: 0.75rem;
> }
> .status-dot {
>   width: 6px; height: 6px; border-radius: 50%; background: #3ecf5e;
> }
> ```
> Swap the text/color (`#3ecf5e` green = open, `#e0a93e` amber = busy, `#e05a5a` red = heads-down) whenever your availability changes.

---

## Suggested run order
1. Section 6 (404 page) — isolated, no risk to main site
2. Section 8 (status dot) — trivial
3. Section 3 (Now section) — trivial
4. Section 4 (build log) — trivial
5. Section 5 (radar chart) — visual only, test both themes
6. Section 7 (konami easter egg) — isolated, no risk
7. Section 1 (PCB background) — test carefully in both themes for readability/opacity
8. Section 2 (oscilloscope loader) — test loader timing isn't slowed down by the extra draw calls

After each, check both light/dark themes and mobile width (375px) before moving on.
