/**
 * Injects the site navigation bar.
 * Call renderNav() at the top of each page's <body>.
 *
 * Modules list: add new entries here as modules are built.
 */

const MODULES = [
  { id: 'law-of-large-numbers', title: 'Law of Large Numbers', path: 'modules/law-of-large-numbers.html' },
  { id: 'hypothesis-testing', title: 'Hypothesis Testing', path: 'modules/hypothesis-testing.html' },
  { id: 'risk-reward-simulations', title: 'Risk & Reward', path: 'modules/risk-reward-simulations.html' },
  { id: 'observed-vs-true-lift', title: 'Observed vs True Lift', path: 'modules/observed-vs-true-lift.html' },
];

function renderNav(currentModuleId) {
  // Determine if we're in a subdirectory (modules/) or at root
  const isSubdir = window.location.pathname.includes('/modules/');
  const prefix = isSubdir ? '../' : '';

  const nav = document.createElement('nav');
  nav.className = 'site-nav';

  const brand = document.createElement('a');
  brand.href = prefix + 'index.html';
  brand.className = 'nav-brand';
  brand.textContent = 'Exp Learning Hub';
  nav.appendChild(brand);

  MODULES.forEach(mod => {
    const a = document.createElement('a');
    a.href = prefix + mod.path;
    a.className = 'nav-link' + (mod.id === currentModuleId ? ' active' : '');
    a.textContent = mod.title;
    nav.appendChild(a);
  });

  document.body.insertBefore(nav, document.body.firstChild);
}
