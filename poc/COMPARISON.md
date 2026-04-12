# PoC Tech Stack Comparison

Three implementations of the same coin toss / Law of Large Numbers simulator.

**Open each to compare side-by-side:**
- Version A: `plotly_vanilla/index.html`
- Version B: `react_plotly/index.html`
- Version C: `svelte_d3/index.html`

---

## Feature Parity

All three versions implement:
- Number of tosses slider (10–10,000) with real-time re-simulation
- Coin bias slider (0.01–0.99)
- Re-simulate button (same params, new random seed)
- Three metric cards (Total Heads, Observed %, True Probability)
- Cumulative % heads line chart with 50% reference line
- Explanatory text + A/B testing takeaway
- Identical visual design (colors, typography, layout)

---

## Comparison

| Dimension | A: Vanilla + Plotly.js | B: React + Plotly.js | C: D3.js (manual SVG) |
|-----------|----------------------|---------------------|----------------------|
| **Files** | `index.html` + `style.css` | `index.html` (single file) | `index.html` (single file) |
| **Lines of code** | 324 (148 + 176) | 251 | 390 |
| **JS framework** | None (vanilla) | React 18 via CDN | None (vanilla) |
| **Chart library** | Plotly.js (~3.5MB) | Plotly.js (~3.5MB) | D3.js (~280KB) |
| **Build step** | None | None (Babel in-browser) | None |
| **CDN deps** | 1 (Plotly) | 3 (React, ReactDOM, Babel) | 1 (D3) |

### Visual Quality

| | A | B | C |
|---|---|---|---|
| Chart appearance | Plotly defaults — clean but generic | Same as A (same library) | Custom SVG — full control over every pixel |
| Transitions | Plotly's built-in (smooth) | Same as A | D3 transitions (smooth, 300ms) |
| Hover tooltips | Plotly built-in (full-featured) | Same as A | Custom tooltip + crosshair + dot (more polished) |
| Closest to rpsychologist | No | No | **Yes** — same SVG approach |

### Functionality / Interactivity

| | A | B | C |
|---|---|---|---|
| Real-time slider response | Instant | Instant | Instant |
| Chart update on slider | `Plotly.react()` | `Plotly.react()` via useEffect | D3 data join + transition |
| Hover interaction | Plotly default hover mode | Same | Custom crosshair + dot tracking nearest point |
| Extensibility for new features | Add more Plotly traces | Add React components | Full SVG control — annotations, animations, drag handles |

### Build Effort

| | A | B | C |
|---|---|---|---|
| Complexity | Lowest — plain JS, event listeners | Medium — React concepts (state, effects, refs) for a simple app | Highest — manual axes, scales, paths, hover logic |
| Learning curve | Minimal | Requires React knowledge | Requires D3 knowledge (scales, selections, data joins) |
| Time to build (estimated) | ~30 min | ~45 min | ~90 min |
| Debugging | Browser DevTools only | React DevTools helpful | SVG inspection in DevTools |

### Scalability (adding more modules)

| | A | B | C |
|---|---|---|---|
| Code reuse | Copy-paste, manual shared CSS | Component extraction (MetricCard, Chart reusable) | D3 chart functions can be abstracted into a utility |
| State management | Global variables | React state — scales cleanly | Global variables (would need framework for complex state) |
| Multi-page site | Separate HTML files, shared CSS | Add React Router or separate pages | Separate HTML files, shared D3 utilities |
| Best with build tool | Optional | Strongly recommended (Vite + React) | Strongly recommended (Vite + Svelte wrapping D3) |

### Deployment

All three are static HTML files — open locally or deploy to GitHub Pages with zero configuration.

---

## Recommendation Matrix

| If your priority is... | Choose |
|------------------------|--------|
| Fastest to build, simplest to maintain | **A: Vanilla + Plotly.js** |
| Component structure for many modules | **B: React + Plotly.js** (with Vite build) |
| Visual ceiling & custom interactions | **C: D3.js** (ideally wrapped in Svelte) |
| Closest to MLU Explain / rpsychologist | **C: D3.js + Svelte** |
| Best balance of effort vs quality | **A for MVP, migrate to C for production** |

### Suggested Path

1. **Phase 0–1 (MVP, first 4 modules):** Use **Version A** approach (vanilla JS + Plotly.js). Ship fast, validate content and learning path with the team.
2. **Phase 2+ (production quality):** Migrate to **Svelte + D3.js** (Version C with a proper build tool). The visual ceiling and interaction quality of D3 is noticeably higher, and Svelte's reactivity model eliminates the manual event listener wiring.
