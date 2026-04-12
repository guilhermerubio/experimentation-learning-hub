# Experimentation Learning Hub — Product Requirements Document

## 1. Vision & Problem Statement

### The Problem

A/B testing concepts are taught through static documents, formulas, and slide decks. Teams hear terms like "power", "p-value", and "MDE" but lack the visceral understanding of how these parameters interact and what happens when they're misconfigured. The result: underpowered tests get shipped, early peeking inflates false positives, and "statistically significant" wins get rolled out without understanding what the numbers actually mean.

### The Vision

Build an interactive learning hub where data and product teams develop deep intuition about experimentation through **simulation-driven learning**. Instead of reading that "underpowered tests inflate observed lifts," users drag a power slider to 50% and watch the exaggeration ratio climb in real time.

The hub serves two purposes:
1. **Educational resource** — A structured learning path from foundational statistics to advanced A/B testing pitfalls
2. **Shared vocabulary** — A canonical glossary and set of visual mental models that teams reference when designing, running, and interpreting experiments

### Reference Models

- **[MLU Explain](https://mlu-explain.github.io/)** — Visual-first articles with inline interactive visualizations. Tech: Svelte + D3.js. Each article is a self-contained visual essay.
- **[rpsychologist.com](https://rpsychologist.com/d3/nhst/)** — Slider-driven statistical visualizations with real-time updates. Tech: D3.js + jStat + Bootstrap. Deep focus on one concept per page.

Our hub combines both patterns: **short explanatory text supported by interactive visuals** (MLU Explain style) + **simulation areas for deeper exploration** (rpsychologist style).

---

## 2. Target Audience

| Persona | Needs | Current Gap |
|---------|-------|-------------|
| **Data Analysts** | Deep understanding of statistical mechanics; ability to design experiments correctly | Can run the tools but may lack intuition for parameter trade-offs |
| **Product Managers** | Enough understanding to ask the right questions and interpret results | Often rely on "is the p-value below 0.05?" without understanding what that means |
| **Engineers** | Understanding of what the experimentation platform is doing under the hood | May implement without understanding statistical implications |

**Primary persona:** An analyst or PM who has heard of p-values and power but lacks the intuition for how they interact and what goes wrong when experiments are misconfigured.

---

## 3. Design Principles

1. **Visual-first** — Every concept leads with an interactive visualization, not a formula. Formulas appear only as optional detail.
2. **Simulation-driven** — Users learn by manipulating parameters and observing outcomes. The sliders are the curriculum.
3. **Progressive complexity** — Foundational concepts build toward advanced pitfalls. Each module states its prerequisites.
4. **Self-contained modules** — Each page stands alone but links forward/backward in the learning path.
5. **Real-time reactivity** — No "Run Simulation" buttons for core visualizations. Slider changes produce instant visual feedback.
6. **Dual-mode learning** — Each module has both an "intuition builder" (analogy-driven) and a "simulation area" (parameter-driven exploration).
7. **A/B test grounded** — Generic statistical concepts are always connected back to concrete experimentation decisions.

---

## 4. Concept Curriculum

### Tier 1: Foundations

These modules build the statistical vocabulary needed before touching A/B testing.

#### Module 1: Random Sampling & the Law of Large Numbers

> *"Why your experiment's first few days of data are misleading"*

- **Key insight:** With small samples, observed metrics are noisy. As sample size grows, observed values converge to truth.
- **Intuition builder:** Flip a coin N times — watch the heads proportion wobble wildly at N=10 and stabilize by N=10,000.
- **Generic simulation:** Coin flip convergence. Slider controls number of flips. Live-updating line chart of cumulative proportion.
- **A/B test simulation:** CVR convergence over experiment days. Two lines (control + variant) wobble early and converge to true rates. Based on `law_of_large_numbers_app_v1.py`.
- **Key terms introduced:** Sample size, observed rate, true rate, variance, convergence
- **Analogies:** Reviewing a restaurant after one visit vs. fifty visits
- **Source material:** `law_of_large_numbers_app_v1.py`, training material §4 ("Regression to the mean")

#### Module 2: Hypothesis Testing Framework

> *"How A/B tests borrow from the courtroom"*

- **Key insight:** We start by assuming no effect (null hypothesis) and ask whether the data is surprising enough to reject that assumption. Like a courtroom: the defendant (null) is innocent until proven guilty.
- **Intuition builder:** The courtroom analogy interactive — present "evidence" (data points) and watch the jury's confidence shift.
- **Generic simulation:** Fair vs biased coin detector. Flip N coins, see the p-value update. Experience how sample size affects your ability to detect a biased coin.
- **A/B test simulation:** Set a true lift and sample size. Run one simulated test. See whether it reaches significance. Run it again — sometimes it does, sometimes it doesn't. This builds the intuition that a single test is one draw from a distribution.
- **Key terms introduced:** Null hypothesis, alternative hypothesis, p-value, significance level (alpha), rejecting the null
- **Analogies:** The judicial system — presumed innocent until proven guilty; strong evidence → guilty verdict; weak evidence → default to innocence
- **Source material:** Training material §Test Design ("Define the hypothesis"), §Common Mistakes #3 (judicial analogy)

#### Module 3: Confidence Intervals & Uncertainty

> *"A point estimate without an interval is a guess"*

- **Key insight:** The observed lift is a point estimate. The confidence interval tells you how precise that estimate is. A 95% CI means that across many experiments, ~95% of intervals would contain the true effect.
- **Intuition builder:** Shoot arrows at a target — the CI is like the scatter pattern. More shots (larger N) = tighter grouping.
- **Generic simulation:** Generate random samples from a distribution. Show the CI shrinking as N grows. Show 100 CIs — highlight the ~5 that miss the true value.
- **A/B test simulation:** Run a simulated experiment and display the CI around the observed lift. Slider for sample size — watch CI width change. Toggle between 80%, 90%, 95% confidence levels.
- **Key terms introduced:** Confidence interval, confidence level, point estimate, precision, uncertainty
- **Source material:** Training material §3 ("Uncertainty and confidence intervals"), §Test Results #3

#### Module 4: Statistical Power & Sample Size *(PoC Module)*

> *"The most important number you calculate before launching a test"*

- **Key insight:** Power is your ability to detect a real effect. Underpowered tests are worse than useless — they waste time and actively mislead when they do reach significance. Power, alpha, MDE, and sample size are locked in a 4-way relationship: fix three, and the fourth is determined.
- **Intuition builder:** Metal detector analogy — sensitivity (power) determines whether you detect the coin (effect). A weak detector only finds large objects (high MDE). Increasing sensitivity (power) requires better equipment (more sample).
- **Generic simulation:** Two overlapping normal distributions (null and alternative). Sliders for effect size, alpha, power, sample size. Shaded regions show alpha (false positive zone) and beta (false negative zone). "Solve for" selector — lock one parameter, auto-calculate it from the others.
- **A/B test simulation:** Input baseline CVR, MDE, daily traffic. Calculate required sample size and runtime. Toggle one-sided vs two-sided. See how the runtime chart changes across power levels and confidence levels.
- **Key terms introduced:** Power, Type I error (alpha), Type II error (beta), MDE, sample size, runtime, one-sided vs two-sided
- **Guided exploration:**
  1. *"Set power to 50%. You now have a coin-flip chance of detecting the effect. Notice how the beta region covers half the alternative distribution."*
  2. *"Double the MDE. Watch the distributions separate and power jump. Larger effects are easier to detect."*
  3. *"Switch from two-sided to one-sided. Notice how the same alpha buys you more power — but you can no longer detect effects in the opposite direction."*
- **Source material:** `runtime_and_ab_simulations_app.py`, `1_tail_vs_2_tail.py`, training material §3.2A-C

---

### Tier 2: Core A/B Testing

These modules apply the foundations to real experimentation scenarios.

#### Module 5: A/A Tests — Validating Your Setup

> *"Before you test anything, test nothing"*

- **Key insight:** An A/A test compares two identical groups. If your system is working correctly, you should see significance only ~alpha% of the time. If you see more, something is broken.
- **Intuition builder:** Quality control analogy — before using a measuring instrument, you test it by measuring the same object twice. If the readings differ, recalibrate.
- **Generic simulation:** Roll two identical dice N times. Count how often the difference looks "significant." The rate should match alpha.
- **A/B test simulation:** Run N A/A tests with configurable sample size and alpha. Show the distribution of observed lifts (centered at 0) and the false positive rate. Color-code the significant results. Based on `aa_simulations_app.py`.
- **Key terms introduced:** A/A test, false positive rate under the null, infrastructure validation
- **Source material:** `aa_simulations_app.py`

#### Module 6: A/B Test Simulation

> *"One test result is a sample of one"*

- **Key insight:** A single A/B test result is one draw from a distribution of possible outcomes. Running thousands of simulated tests reveals what "expected" looks like and how variable results can be.
- **Generic simulation:** Set a true effect and sample size. Run 10,000 simulated tests. Show the distribution of observed lifts, colored by significance. Show observed power vs. theoretical power.
- **A/B test simulation:** Support both CVR (proportions) and Sales/Visitor (continuous) metrics. Users set baseline, true lift, and sample size. Based on `ab_simulations_app.py`.
- **Key terms introduced:** Monte Carlo simulation, distribution of outcomes, observed power
- **Source material:** `ab_simulations_app.py`

#### Module 7: False Positive & False Negative Rates in Practice

> *"The experiments you ship that shouldn't have been, and the winners you killed"*

- **Key insight:** FPR and FNR are not abstract — they translate directly into business decisions. False positives = rolling out changes that don't actually help. False negatives = killing changes that would have worked. At a portfolio level, these rates determine the ROI of your experimentation program.
- **Generic simulation:** Configure a "portfolio" of experiments with a distribution of true effects. See how many are correctly detected (TP), falsely flagged (FP), missed (FN), and correctly dismissed (TN).
- **A/B test simulation:** Choose between "Naive" mode (fixed win rate + lift) and "Distribution" mode (true lifts drawn from a normal distribution). See the confusion matrix, FPR, power, and impact assessment (avg observed vs true lift of shipped experiments). Based on `fpr_fnr_app.py`.
- **Key terms introduced:** False positive rate, false negative rate, true positive, true negative, exaggeration ratio, portfolio impact
- **Source material:** `fpr_fnr_app.py`, training material §Common Mistakes

#### Module 8: One-Tailed vs Two-Tailed Tests

> *"What are you willing to miss?"*

- **Key insight:** The choice between one-tailed and two-tailed is not about predicting direction — it's about what decisions you want to make and what errors you want to prevent. A one-tailed test buys more power in one direction but is blind to effects in the other.
- **Generic simulation:** Side-by-side visualization of rejection regions for one-tailed vs two-tailed tests with the same alpha. Show how the power differs for the same effect size.
- **A/B test simulation:** Three decision scenarios from the training material: (1) Roll out false winners — one-sided misses negative effects; (2) Double down on winning experiment types; (3) Abandon losing experiment types. Each scenario shows the trade-off. Based on training material appendix.
- **Key terms introduced:** One-sided test, two-sided test, rejection region, directional hypothesis
- **Guided exploration:**
  1. *"Using a one-sided test at alpha=0.05, set a true lift of -5%. Notice you can never detect it."*
  2. *"Compare power: one-sided at 90% confidence vs two-sided at 80% confidence. They're equivalent for detecting positive effects."*
- **Source material:** `1_tail_vs_2_tail.py`, training material §Appendix (1-tail vs 2-tail)

---

### Tier 3: Advanced Pitfalls

These cover the failure modes that plague real experimentation programs.

#### Module 9: Winner's Curse

> *"Why your winning experiments probably aren't as good as they look"*

- **Key insight:** Among statistically significant results from underpowered tests, the average observed lift systematically overstates the true lift. This is selection bias: only the tests where noise happened to push the observed effect above the significance threshold get called "winners" — and that noise inflates the estimate.
- **Generic simulation:** Set a true effect and vary power. Show the exaggeration ratio (observed / true lift among significant results) as a function of power. At 80% power, exaggeration is moderate. At 50%, it's dramatic.
- **A/B test simulation:** Run 10,000 underpowered tests. Show the histogram of observed lifts. Highlight significant results and their mean — it's always above the true lift line. Based on `winners_curse_app.py`.
- **Key terms introduced:** Winner's curse, exaggeration ratio, selection bias, effect inflation
- **Source material:** `winners_curse_app.py`, `uncertainty_app.py`, notebook 03

#### Module 10: Peeking

> *"Every time you check your results early, you're raising your false positive rate"*

- **Key insight:** Each peek at interim results and potential early stopping inflates your cumulative false positive rate. A 5% alpha with daily peeks over 28 days can produce a ~25% FPR. The "sideways funnel" phenomenon — early results swing wildly before converging.
- **Generic simulation:** Animate the accumulation of data over time. Show p-value trajectory with each day's data. Show how many times the p-value dips below alpha transiently. Count cumulative false positive rate across many simulated experiments with repeated peeks.
- **A/B test simulation:** Configure an experiment with N days runtime. Choose peek frequency (daily, weekly, at end only). Run 1,000 simulated null experiments (true lift = 0). Show how FPR increases with more frequent peeks. Based on notebook 01.
- **Key terms introduced:** Peeking, early stopping, p-hacking, cumulative false positive rate, sideways funnel
- **Source material:** Notebook "01 - Peeking at AB Tests", training material §Peeking, §Common Mistakes #1

#### Module 11: Multiple Testing & Corrections

> *"Test enough things and you'll find something 'significant' by accident"*

- **Key insight:** Testing multiple variants or metrics without correction inflates the family-wise error rate. With 20 independent tests at alpha=0.05, there's a 64% chance of at least one false positive.
- **Generic simulation:** Run N independent tests with no true effect. Show how the probability of at least one false positive grows with N. Toggle Bonferroni correction on/off and see FPR return to alpha.
- **A/B test simulation:** Configure an experiment with multiple variants or multiple metrics. Show the unadjusted vs adjusted significance thresholds. Demonstrate Bonferroni and Benjamini-Hochberg corrections.
- **Key terms introduced:** Family-wise error rate, Bonferroni correction, Benjamini-Hochberg, multiple comparisons
- **Note:** This requires a new simulation — no existing Streamlit app covers this.

#### Module 12: Practical vs Statistical Significance

> *"Significant doesn't mean important"*

- **Key insight:** With enough data, any tiny effect becomes statistically significant. A 0.01% lift on conversion can be "significant" with millions of users — but is it worth the engineering cost to implement?
- **Generic simulation:** Fix a tiny true effect. Increase sample size until it becomes significant. Show that significance says nothing about whether the effect matters.
- **A/B test simulation:** Input implementation cost and revenue per conversion. Calculate whether a statistically significant lift is actually worth rolling out. Introduce MDE as a business threshold, not just a statistical one.
- **Key terms introduced:** Practical significance, minimum effect of interest, cost-benefit threshold
- **Source material:** Training material §5 ("Statistical Significance != Practical Significance")

---

### Tier 4: Operational Excellence (Future)

These cover advanced topics for mature experimentation programs.

#### Module 13: Sample Ratio Mismatch (SRM)

> *"The check engine light for your experiment"*

- **Key insight:** When the actual group distribution diverges from expectation (e.g., 40/60 instead of 50/50), randomization is compromised and all statistical conclusions are invalid.
- **Simulation:** Chi-squared test for SRM detection. Configure expected vs actual allocation. Show when SRM triggers.
- **Key terms introduced:** Sample ratio mismatch, randomization validation, chi-squared test
- **Source material:** Training material §Common Mistakes #5

#### Module 14: Sequential Testing & Early Stopping

> *"How to peek without paying the price"*

- **Key insight:** Sequential testing methods (group sequential, always-valid p-values) allow interim analyses without inflating FPR, at the cost of requiring larger total sample sizes.
- **Simulation:** Compare fixed-horizon vs group sequential designs. Show alpha spending functions and stopping boundaries.
- **Key terms introduced:** Sequential testing, alpha spending, stopping boundaries, always-valid p-values
- **Note:** New simulation needed.

#### Module 15: Bayesian A/B Testing

> *"A different way to think about evidence"*

- **Key insight:** Bayesian methods update a prior belief with observed data to produce a posterior distribution. Instead of "reject/fail to reject," you get "probability that B is better than A."
- **Simulation:** Beta-binomial conjugate model. Start with a prior, observe data, watch the posterior update. Compare with frequentist conclusion on the same data.
- **Key terms introduced:** Prior, posterior, Bayesian updating, probability of being best, credible interval
- **Note:** New simulation needed. No existing material.

---

## 5. Per-Module Template

Every module page follows this consistent structure:

### 5.1 Header
- Module number and title
- One-sentence hook (provocative or surprising)
- Prerequisites: links to prior modules
- Estimated interaction time: 5-15 minutes

### 5.2 Intuition Builder
- A concrete, non-statistical analogy or scenario
- A simple interactive element tied to the analogy (e.g., flip coins, shoot arrows at a target)
- Goal: create the "aha" moment before any formulas appear

### 5.3 Core Interactive Visualization
- Full-width, slider-driven simulation
- Real-time updating — no "Run" button
- Controls: sliders, toggles, dropdowns for key parameters
- Live-updating summary cards showing derived values
- This is where the existing Streamlit simulation logic gets ported with real-time reactivity

### 5.4 Guided Exploration
- 3-5 specific scenarios to try (e.g., "Set power to 50% and observe...")
- Each scenario has a collapsible answer/explanation
- Designed to surface non-obvious relationships between parameters

### 5.5 Connecting to A/B Testing
- How this concept manifests in real experimentation decisions
- Concrete examples from team experience or industry (the Amazon cart story, etc.)
- Links to related modules

### 5.6 Key Takeaways
- 3-5 bullet points summarizing the module
- Common misconceptions addressed (e.g., "False: p-value is the probability the result is true. True: p-value is the probability of seeing this data if there's no real effect.")

### 5.7 Glossary Sidebar
- Definitions for every technical term used on the page
- Linked to the master glossary

---

## 6. Glossary — Shared Terminology

Canonical definitions for terms used across modules. Each entry notes where it is first introduced.

| Term | Definition | Introduced |
|------|-----------|------------|
| **Alpha (Significance Level)** | The probability threshold below which a p-value is considered statistically significant. Common values: 0.05, 0.10. Controls false positive rate. | Module 2 |
| **Alternative Hypothesis (H1)** | The claim that there is a real effect or difference between groups. Accepted when the null is rejected. | Module 2 |
| **Baseline Rate** | The current conversion rate or metric value for the control group, before any treatment is applied. | Module 4 |
| **Beta (Type II Error Rate)** | The probability of failing to reject the null hypothesis when a real effect exists. Beta = 1 - Power. | Module 4 |
| **Confidence Interval (CI)** | A range of values that, across many repeated experiments, would contain the true effect a specified proportion of the time (e.g., 95%). Wider CI = more uncertainty. | Module 3 |
| **Confidence Level** | The complement of alpha (1 - alpha). A 95% confidence level means alpha = 0.05. | Module 3 |
| **Control Group** | The group in an experiment that receives no change (the baseline experience). | Module 2 |
| **Conversion Rate (CVR)** | The proportion of users who complete a target action (e.g., purchase, signup) out of total users exposed. | Module 1 |
| **Effect Size** | The magnitude of the difference between control and variant. Can be absolute (percentage points) or relative (% lift). | Module 4 |
| **Exaggeration Ratio** | The ratio of observed effect to true effect among statistically significant results. Values > 1 indicate effect inflation (winner's curse). | Module 9 |
| **False Negative (Type II Error)** | Concluding there is no effect when a real effect exists. A missed detection. | Module 4 |
| **False Negative Rate (FNR)** | The proportion of real effects that go undetected. FNR = beta = 1 - power. | Module 7 |
| **False Positive (Type I Error)** | Concluding there is an effect when none exists. A false alarm. | Module 2 |
| **False Positive Rate (FPR)** | The proportion of null results incorrectly flagged as significant. Controlled by alpha. | Module 5 |
| **Guardrail Metric** | A secondary metric monitored to ensure the experiment doesn't cause unintended harm (e.g., increased error rate, slower load time). | Module 7 |
| **Lift (Relative)** | The relative change from control to variant: (variant - control) / control. A 5% lift means the variant is 5% better than control. | Module 1 |
| **Minimum Detectable Effect (MDE)** | The smallest effect size the experiment is designed to detect with the specified power. Reflects business significance: "What's the smallest change worth detecting?" | Module 4 |
| **Monte Carlo Simulation** | A method of understanding outcomes by simulating thousands of random trials and observing the distribution of results. | Module 6 |
| **Null Hypothesis (H0)** | The default assumption that there is no effect or difference between groups. Rejected only when evidence is strong enough. | Module 2 |
| **Observed Power** | The actual proportion of simulated experiments that correctly detect a true effect. Should approximate the designed power. | Module 6 |
| **One-Sided Test** | A hypothesis test that only checks for an effect in one direction (e.g., variant > control). More power in that direction, blind to effects in the other. | Module 8 |
| **P-Value** | The probability of observing data as extreme as (or more extreme than) what was collected, assuming the null hypothesis is true. Low p-value = data is surprising under the null. | Module 2 |
| **Peeking** | Repeatedly checking experiment results before reaching the planned sample size. Inflates false positive rate without statistical correction. | Module 10 |
| **Power (1 - Beta)** | The probability of correctly detecting a real effect of a given size. Higher power = higher sensitivity. Typical targets: 80% or 90%. | Module 4 |
| **Primary Metric** | The main business metric the experiment is designed to move. Should be sensitive to the expected effect. | Module 2 |
| **Randomization** | The process of randomly assigning users to control or treatment groups to ensure unbiased comparison and enable causal inference. | Module 2 |
| **Runtime** | The number of days an experiment needs to run to collect the required sample size, given daily traffic and number of variants. | Module 4 |
| **Sample Ratio Mismatch (SRM)** | When the actual proportion of users in each group deviates from the expected ratio. Indicates a potential randomization issue. | Module 13 |
| **Sample Size** | The number of observations (users, sessions, etc.) needed per variant to achieve the desired statistical power for a given effect size and alpha. | Module 4 |
| **Sequential Testing** | A testing framework that allows valid interim analyses and early stopping without inflating the false positive rate. Uses adjusted significance boundaries. | Module 14 |
| **Statistical Significance** | A result is statistically significant when the p-value falls below the alpha threshold, suggesting the observed effect is unlikely under the null hypothesis. | Module 2 |
| **Treatment Group (Variant)** | The group in an experiment that receives the change being tested. | Module 2 |
| **True Lift** | The actual (unknown) effect of the treatment. In simulations, this is the ground truth we set. In real experiments, it's what we're trying to estimate. | Module 1 |
| **Two-Sided Test** | A hypothesis test that checks for effects in both directions (variant better OR worse than control). More conservative than one-sided. | Module 8 |
| **Type I Error** | See False Positive. | Module 2 |
| **Type II Error** | See False Negative. | Module 4 |
| **Winner's Curse** | The systematic overestimation of effect sizes among statistically significant results, especially in underpowered experiments. Caused by selection bias. | Module 9 |

---

## 7. Tech Stack & Architecture

**To be decided after PoC bake-off.** Three candidates are being evaluated:

| Stack | Visualization | Build System | Strengths |
|-------|---------------|-------------|-----------|
| Plain HTML + Plotly.js + jStat | Plotly.js | None (CDN) | Simplest setup, zero build step, direct mapping from existing Plotly charts |
| React + Plotly.js | Plotly.js via react-plotly.js | Vite | Component model, state management, ecosystem |
| Svelte + D3.js | D3.js (manual SVG) | Vite | Best visual ceiling, reactive by default, smallest bundle size, MLU Explain's approach |

**PoC evaluation criteria:** Visual quality, interactivity, build effort, scalability to 15 modules, deployment simplicity.

### Architecture Principles (stack-agnostic)

1. **Static site** — No backend. All computation happens in the browser. Deployable to GitHub Pages.
2. **Analytical distributions first** — Core visualizations render mathematical distributions (normal PDF/CDF via jStat), not Monte Carlo. This enables instant slider response.
3. **Monte Carlo as secondary** — Where simulated experiment distributions add pedagogical value (Modules 5-7, 9-10), run simulations in a Web Worker to avoid freezing the UI.
4. **Per-module isolation** — Each module's code is self-contained. No module depends on another module's runtime state.
5. **Shared statistical utilities** — Common calculations (sample size formula, z-test, effect size) are shared across modules.

---

## 8. Phased Roadmap

### Phase 0: PoC & Tech Decision
- Build Module 4 (Power & Sample Size) in all 3 candidate stacks
- Compare on visual quality, functionality, and build effort
- Select the stack for production
- **Exit criteria:** One version selected, team aligned on tech stack

### Phase 1: Foundation Modules
- Set up the chosen static site framework with landing page (card grid navigation)
- Build Modules 1-4 (Foundations tier)
- Establish visual design system: color palette, typography, layout, component patterns
- Write the shared glossary
- **Exit criteria:** 4-module site deployed, navigable, all simulations interactive

### Phase 2: Core A/B Testing Modules
- Build Modules 5-8 (Core tier)
- Implement Web Worker pattern for Monte Carlo simulations
- Add guided exploration sections with scenario-based questions
- **Exit criteria:** 8-module site covering foundational through intermediate concepts

### Phase 3: Advanced Pitfalls
- Build Modules 9-12 (Advanced tier)
- Module 11 (Multiple Testing) requires new simulation design
- Consider scrollytelling for Module 10 (Peeking) to animate data accumulation
- **Exit criteria:** 12-module complete learning path

### Phase 4: Operational Excellence & Polish
- Build Modules 13-15 (all require new simulations)
- Add quizzes/assessments at end of each tier
- Mobile responsiveness pass
- Accessibility audit
- **Exit criteria:** Full 15-module hub, mobile-friendly, accessible

---

## 9. Success Metrics

### Qualitative
- A new analyst can complete the learning path and correctly explain the trade-off between power and sample size
- PMs can articulate why peeking inflates false positive rates
- Team uses glossary terms consistently in experiment review meetings

### Quantitative (if deployed with analytics)
- Time on page per module (target: 5-15 min, indicating engagement not confusion)
- Simulation interaction rate (% of visitors who move at least one slider)
- Module completion rate (% who scroll to Key Takeaways)
- Return visits (users bookmarking specific modules as reference)

---

## Appendix: Existing Assets Inventory

### Streamlit Apps (`streamlit_apps/`)
| App | Concepts Covered | Target Module(s) |
|-----|-----------------|-----------------|
| `law_of_large_numbers_app_v1.py` | CVR convergence over time, sample size effects | Module 1 |
| `aa_simulations_app.py` | A/A test false positive rates | Module 5 |
| `ab_simulations_app.py` | A/B test power, lift distributions (CVR + continuous) | Module 6 |
| `winners_curse_app.py` | Effect inflation in underpowered tests | Module 9 |
| `uncertainty_app.py` | Winner's curse variant with large samples | Module 9 |
| `fpr_fnr_app.py` | FPR/FNR portfolio impact, true lift distributions | Module 7 |
| `runtime_and_ab_simulations_app.py` | Sample size, runtime, power simulation | Module 4 |
| `1_tail_vs_2_tail.py` | Sample size explorer, one-sided vs two-sided | Modules 4, 8 |

### Notebooks (`docs_and_notebooks/`)
| Notebook | Concepts Covered | Target Module(s) |
|----------|-----------------|-----------------|
| `01 - Peeking at AB Tests.ipynb` | Cumulative FPR from repeated peeking | Module 10 |
| `03 - Underpowered Experiments and the Winner's Curse.ipynb` | Exaggeration ratio vs power | Module 9 |
| `Winners_Curse.ipynb` | Individual test effect inflation | Module 9 |

### Training Material
| Document | Scope | Usage |
|----------|-------|-------|
| `AB test training material.md` (814 lines) | End-to-end A/B testing guide: design, analysis, common mistakes, advanced concepts | Explanatory text, analogies, quiz questions, and glossary definitions distributed across all modules |

---

## Appendix: Key Analogies from Training Material

These proven analogies should be reused in the corresponding modules:

| Analogy | Concept | Module |
|---------|---------|--------|
| **Coin flip fairness** | P-value — "if the coin is fair, how likely is 9/10 heads?" | Module 2 |
| **Courtroom / judicial system** | Hypothesis testing — presumed innocent, evidence evaluated, verdict reached | Module 2 |
| **Amazon shopping cart story** | Why we test — humans are bad at predicting what works | Module 2 |
| **Restaurant reviews** | Law of large numbers — one visit vs fifty visits | Module 1 |
| **Check engine light** | SRM — signals broken randomization | Module 13 |
| **Metal detector** | Power — sensitivity determines what you can find | Module 4 |
| **Sideways funnel** | Peeking — early results swing wildly before converging | Module 10 |
| **Twyman's law** | Surprising results — "too good to be true" likely is an error | Module 7 |

---

## Appendix: Further Study Resources

1. [Ronnie's CustomGPT on A/B Testing](https://chatgpt.com/g/g-ORjeu9AoG-a-b-testing-experiment-guide)
2. [Book] [Trustworthy Online Controlled Experiments](https://www.amazon.com/Trustworthy-Online-Controlled-Experiments-Practical/dp/1108724264)
3. [Podcast] [Lenny's Podcast: AB Testing with Ronnie Kohavi](https://www.youtube.com/watch?v=hEzpiDuYFoE)
4. [Interactive] [rpsychologist Statistical Visualizations](https://rpsychologist.com/viz)
5. [Interactive] [MLU Explain](https://mlu-explain.github.io/)
