/**
 * Shared D3 chart utilities for the Experimentation Learning Hub.
 *
 * Usage in a module:
 *   <script src="https://d3js.org/d3.v7.min.js"></script>
 *   <script src="../js/chart-utils.js"></script>
 *
 * Then call:
 *   const chart = createChart('#myDiv', { width: 720, height: 340 });
 *   // chart.svg, chart.g, chart.x, chart.y, chart.xAxis, chart.yAxis, chart.width, chart.height
 */

function createChart(selector, opts = {}) {
  const margin = opts.margin || { top: 15, right: 30, bottom: 45, left: 55 };
  const fullW = opts.width || 720;
  const fullH = opts.height || 340;
  const w = fullW - margin.left - margin.right;
  const h = fullH - margin.top - margin.bottom;

  const svg = d3.select(selector).append('svg')
    .attr('viewBox', `0 0 ${fullW} ${fullH}`)
    .style('width', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().range([0, w]);
  const y = d3.scaleLinear().range([h, 0]);

  const xAxisG = g.append('g').attr('class', 'axis').attr('transform', `translate(0,${h})`);
  const yAxisG = g.append('g').attr('class', 'axis');
  const yGridG = g.append('g').attr('class', 'grid');

  return { svg, g, x, y, xAxisG, yAxisG, yGridG, width: w, height: h, margin, fullW, fullH };
}

/** Add axis labels to a chart */
function addAxisLabels(chart, xLabel, yLabel) {
  chart.g.append('text')
    .attr('class', 'axis-label')
    .attr('x', chart.width / 2)
    .attr('y', chart.height + 38)
    .attr('text-anchor', 'middle')
    .text(xLabel);

  chart.g.append('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -chart.height / 2)
    .attr('y', -42)
    .attr('text-anchor', 'middle')
    .text(yLabel);
}

/** Update axes with transition */
function updateAxes(chart, xDomain, yDomain, opts = {}) {
  const t = d3.transition().duration(opts.duration || 200);
  const xTicks = opts.xTicks || 10;
  const yTicks = opts.yTicks || 5;
  const xFormat = opts.xFormat || d3.format(',');
  const yFormat = opts.yFormat || (d => d);

  chart.x.domain(xDomain);
  chart.y.domain(yDomain);

  chart.xAxisG.transition(t).call(d3.axisBottom(chart.x).ticks(xTicks).tickFormat(xFormat));
  chart.yAxisG.transition(t).call(d3.axisLeft(chart.y).ticks(yTicks).tickFormat(yFormat));
  chart.yGridG.transition(t).call(d3.axisLeft(chart.y).ticks(yTicks).tickSize(-chart.width).tickFormat(''));
}

/** Add hover crosshair + dot to a line chart. Returns { update(data) } to swap data for hover lookup. */
function addLineHover(chart, containerSelector, tooltipEl, opts = {}) {
  const color = opts.color || '#4F46E5';

  const overlay = chart.g.append('rect')
    .attr('width', chart.width).attr('height', chart.height)
    .attr('fill', 'none').attr('pointer-events', 'all');

  const hLine = chart.g.append('line')
    .attr('stroke', '#9ca3af').attr('stroke-dasharray', '4 3').style('opacity', 0);

  const hDot = chart.g.append('circle')
    .attr('r', 4).attr('fill', color).attr('stroke', '#fff').attr('stroke-width', 2).style('opacity', 0);

  let data = [];

  overlay.on('mousemove', function(event) {
    if (!data.length) return;
    const [mx] = d3.pointer(event);
    const xVal = chart.x.invert(mx);
    const idx = Math.max(0, Math.min(Math.round(xVal) - 1, data.length - 1));
    const d = data[idx];
    if (!d) return;

    hLine.attr('x1', chart.x(d.x)).attr('x2', chart.x(d.x)).attr('y1', 0).attr('y2', chart.height).style('opacity', 1);
    hDot.attr('cx', chart.x(d.x)).attr('cy', chart.y(d.y)).style('opacity', 1);

    const wrapRect = document.querySelector(containerSelector).getBoundingClientRect();
    const chartRect = document.querySelector(containerSelector + ' svg').getBoundingClientRect();
    tooltipEl.style.opacity = '1';
    tooltipEl.innerHTML = opts.formatTooltip ? opts.formatTooltip(d) : `x: ${d.x}, y: ${d.y.toFixed(1)}`;
    tooltipEl.style.left = (chartRect.left - wrapRect.left + chart.margin.left + chart.x(d.x) + 12) + 'px';
    tooltipEl.style.top = (chartRect.top - wrapRect.top + chart.margin.top + chart.y(d.y) - 30) + 'px';
  });

  overlay.on('mouseleave', () => {
    hLine.style('opacity', 0);
    hDot.style('opacity', 0);
    tooltipEl.style.opacity = '0';
  });

  return { update(newData) { data = newData; } };
}

/** Hold-to-repeat helper: calls fn on mousedown, then repeatedly every intervalMs while held */
function holdToRepeat(button, fn, intervalMs = 120) {
  let timer = null;
  button.addEventListener('mousedown', () => { fn(); timer = setInterval(fn, intervalMs); });
  button.addEventListener('mouseup', () => clearInterval(timer));
  button.addEventListener('mouseleave', () => clearInterval(timer));
}
