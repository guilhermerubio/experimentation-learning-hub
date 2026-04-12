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

There is no shared library or module structure. Each file in `streamlit_apps/` is a self-contained simulation app with its own UI, simulation logic, and visualizations inline.

### Streamlit Apps (`streamlit_apps/`)

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

- Simulations use `statsmodels.stats.proportion.proportions_ztest` for hypothesis testing on proportions and `scipy.stats.norm` for z-value calculations.
- Visualization mix: `matplotlib`/`seaborn` for static charts, `plotly` for interactive charts — both are used within the same app in some cases.
- Sidebar controls hold simulation parameters; main area shows results after clicking "Run Simulation".
- Statistical significance is stored as binary `stat_sig` (1/0) in simulation DataFrames.
- Lifts are relative: `(variant / control) - 1`.
