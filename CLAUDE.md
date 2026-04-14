# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational toolkit for A/B testing concepts. Contains interactive Streamlit simulation apps and Jupyter notebooks that teach experimentation fundamentals: statistical power, false positive/negative rates, winner's curse, peeking, sample size calculation, and the law of large numbers.

## Running Apps

Each Streamlit app is standalone — run any of them directly:

```bash
streamlit run streamlit_apps/<app_name>.py
```

## Dependencies

No requirements file exists. Apps use: `streamlit`, `numpy`, `pandas`, `matplotlib`, `seaborn`, `plotly`, `statsmodels`, `scipy`.

## Architecture

The project has three components: a static GitHub Pages site (the primary learning interface), standalone Streamlit simulation apps, and Jupyter notebooks.

### GitHub Pages Site (`docs/`)

A vanilla HTML/CSS/JS static site served via GitHub Pages. No build step or framework — just plain files. Uses **D3.js v7** for all interactive visualizations (not Chart.js).

- `index.html` — Landing page with a card grid linking to each learning module (organized into Tier 1 Foundations, Tier 2 Core A/B Testing, Tier 3 Advanced Pitfalls, Tier 4 Strategy)
- `style.css` — Shared styles for all pages (includes stepper, toggle group, and preset button styles)
- `js/nav.js` — Shared navigation bar rendered on every page via `renderNav()`. Register new modules in the `MODULES` array.
- `js/chart-utils.js` — Shared D3 helper functions: `createChart()`, `addAxisLabels()`, `updateAxes()`, `addLineHover()`, `holdToRepeat()`
- `modules/` — One HTML file per learning module. Each module is self-contained with its own simulation logic, UI controls, and D3 visualizations inline. Current modules:
  - `law-of-large-numbers.html` — Coin flip simulator showing convergence
  - `hypothesis-testing.html` — Interactive null hypothesis testing with p-values
  - `observed-vs-true-lift.html` — Visualizes how observed experiment results sample from true underlying distributions
  - `risk-reward-simulations.html` — Portfolio-level A/B test strategy simulator (3-step flow: define true lift distribution → experiment design → yearly simulation). Uses 1-sided tests, industry presets with literature citations, and supports Normal/Laplace/Student's t distributions

To add a new module: create an HTML file in `modules/`, include D3 v7 CDN + `nav.js` + `chart-utils.js`, register in `nav.js` MODULES array, and add a card to `index.html`.

### Streamlit Apps (`streamlit_apps/`)

Legacy standalone simulation apps. Each file is self-contained with its own UI, simulation logic, and visualizations inline.

| App | Purpose |
|-----|---------|
| `aa_simulations_app.py` | Simulates A/A tests to demonstrate false positive rates under the null hypothesis |
| `ab_simulations_app.py` | Simulates A/B tests for both CVR and Sales/Visitor metrics, shows power and lift distributions |
| `winners_curse_app.py` | Demonstrates how underpowered tests inflate observed lift in statistically significant results |
| `uncertainty_app.py` | Variant of winners_curse — explores uncertainty with large sample sizes |
| `fpr_fnr_app.py` | Simulates false positive/negative rates and impact assessment across experiment portfolios |
| `runtime_and_ab_simulations_app.py` | Combines runtime/sample-size calculation with power simulation |
| `1_tail_vs_2_tail.py` | Sample size and runtime explorer comparing one-sided vs two-sided tests |
| `law_of_large_numbers_app_v1.py` | Visualizes CVR and lift convergence over time as sample accumulates |

### Notebooks (`docs_and_notebooks/`)

Jupyter notebooks covering peeking at A/B tests, underpowered experiments, and the winner's curse. The markdown file `AB test training material.md` is a comprehensive reference doc on A/B test design, analysis, and common pitfalls.

## Conventions

### GitHub Pages Modules
- All visualizations use **D3.js v7** with shared helpers from `chart-utils.js`. No other charting libraries.
- Simulation logic is pure inline JavaScript — no framework, no build step.
- UI pattern: sliders in `.controls` for parameters, buttons in `.chart-actions` for actions, `.metric-card` grids for live stats, `.chart-wrap` for D3 charts.
- Multi-step modules use a CSS-driven stepper (`.step-indicator` with `.step-dot` / `.step-connector`), progressive disclosure via `.sim-step.active`, and toggle groups (`.toggle-group` / `.toggle-btn`) for mode switching.
- Statistical functions (normalCDF, normalPPF, sample size formulas) are reimplemented inline in each module as needed.
- Color palette: indigo `#4F46E5` (primary), green `#059669` (positive/success), red `#EF4444` (negative/danger), gray `#6b7280` (neutral).

### Streamlit Apps (legacy)
- Simulations use `statsmodels.stats.proportion.proportions_ztest` for hypothesis testing on proportions and `scipy.stats.norm` for z-value calculations.
- Visualization mix: `matplotlib`/`seaborn` for static charts, `plotly` for interactive charts.
- Sidebar controls hold simulation parameters; main area shows results after clicking "Run Simulation".
- Statistical significance is stored as binary `stat_sig` (1/0) in simulation DataFrames.
- Lifts are relative: `(variant / control) - 1`.
