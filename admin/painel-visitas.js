// painel-visitas.js
import { getAllVisitors } from '../js/cookiesjsvisitetracker.js';

const totalEl = document.getElementById('totalVisitors');
const avgEl = document.getElementById('avgTime');
const totalTimeEl = document.getElementById('totalTime');
const visitorListEl = document.getElementById('visitorList');
const ctx = document.getElementById('visitChart');

let chart;

async function loadAndRender() {
  const data = await getAllVisitors();
  const ids = Object.keys(data || {});
  totalEl.innerText = ids.length;

  let totalSec = 0;
  let fast = 0, normal = 0, long = 0;

  visitorListEl.innerHTML = '';

  ids.forEach(id => {
    const v = data[id] || {};
    const secs = Number(v.totalTime || 0);
    totalSec += secs;

    if (secs < 30) fast++;
    else if (secs < 120) normal++;
    else long++;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="max-width:220px;word-break:break-all">${id}</td>
      <td>${formatDate(v.acceptedAt)}</td>
      <td>${formatDate(v.lastVisit)}</td>
      <td>${secs}</td>
    `;
    visitorListEl.appendChild(tr);
  });

  totalTimeEl.innerText = totalSec + 's';
  avgEl.innerText = ids.length ? Math.round(totalSec / ids.length) + 's' : '0s';

  updateChart([fast, normal, long]);
}

function formatDate(t) {
  if (!t) return '-';
  try { return new Date(Number(t)).toLocaleString('pt-BR'); } catch (e) { return '-'; }
}

function updateChart(values) {
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Passou Rápido (<30s)', 'Normal (30s-2min)', 'Engajado (>2min)'],
      datasets: [{ data: values, backgroundColor: ['#f6c84c','#6d28d9','#3b82f6'] }]
    },
    options: { responsive: true }
  });
}

// inicializa
loadAndRender();

// opcional: atualizar periodicamente
setInterval(loadAndRender, 30 * 1000); // atualiza a cada 30s
