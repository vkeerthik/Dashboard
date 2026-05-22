/* ============ Cabot Dashboard — shared logic ============ */
const D = window.CABOT_DATA;
const NOW = new Date('2026-05-15'); // "today" for the prototype

/* ---------- helpers ---------- */
const byId = id => D.people.find(p => p.id === id);
const totalAlloc = p => p.allocations.reduce((s,a)=>s+a.pct,0);
const isAllocated = p => p.allocations.length > 0;
const isFreeNow = p => !isAllocated(p);
const projColor = name => {
  const map = {RXlive:'var(--rx,#2EB8E6)'};
  // assign a rotating palette deterministically
  const palette = ['#2EB8E6','#1fae9c','#6f7be0','#d68a1e','#1aa86b','#d94c4c','#5FCDF0','#9a6fe0','#e0a93a','#33b3a0','#4f8ad6','#c46bd0','#7bb85f'];
  const idx = D.projects.findIndex(p=>p.name===name);
  return palette[idx % palette.length];
};
const statusClass = s => 's-' + s;
const statusLabel = s => ({'on-track':'On Track','at-risk':'At Risk','delayed':'Delayed'}[s] || s);
const fmtMonth = ym => {
  const [y,m] = ym.split('-').map(Number);
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1] + ' ' + (''+y).slice(2);
};
const monthIndex = ym => { const [y,m]=ym.split('-').map(Number); return (y-2026)*12 + (m-1); }; // 0 = Jan 2026

/* company-level stats */
function companyStats() {
  const total = D.people.length;
  const allocated = D.people.filter(isAllocated).length;
  const free = total - allocated;
  const utils = D.people.filter(isAllocated).map(totalAlloc);
  const avgUtil = Math.round(utils.reduce((s,u)=>s+u,0) / (utils.length||1));
  const over = D.people.filter(p=>totalAlloc(p) > 100).length;
  const under = D.people.filter(p=>isAllocated(p) && totalAlloc(p) < 75).length;
  const byStatus = {'on-track':0,'at-risk':0,'delayed':0};
  D.projects.forEach(p=>byStatus[p.status]++);
  const freeingSoon = D.people.filter(p=>isAllocated(p) && p.available).length + free;
  return {total,allocated,free,avgUtil,over,under,byStatus,projects:D.projects.length,freeingSoon};
}

/* ---------- nav ---------- */
function renderNav(active) {
  const links = [['index.html','Overview'],['projects.html','Projects'],['resources.html','Resources']];
  return `<div class="nav"><div class="wrap"><div class="nav-inner">
    <a class="brand" href="index.html">
      <span class="brand-rule"></span>
      <span class="wordmark">CABOT</span>
      <span class="tag">RESOURCE DASHBOARD · ${D.meta.cycle} ${D.meta.asOf}</span>
    </a>
    <nav class="nav-links">
      ${links.map(([h,l])=>`<a href="${h}" class="${active===l?'active':''}">${l}</a>`).join('')}
    </nav>
  </div></div></div>`;
}
function mountNav(active){ document.getElementById('nav').outerHTML = renderNav(active); }

/* ---------- shared: status pill ---------- */
const pill = s => `<span class="status ${statusClass(s)}">${statusLabel(s)}</span>`;

/* ---------- shared: utilization color ---------- */
function utilColor(pct){ if(pct>100) return 'var(--red)'; if(pct<75) return 'var(--amber)'; return 'var(--green)'; }

/* ---------- shared: donut ---------- */
function donut(segments, centerTop, centerBot) {
  // segments: [{label,value,color}]
  const total = segments.reduce((s,x)=>s+x.value,0);
  let offset = 25; // start at top
  const circ = segments.map(seg=>{
    const frac = seg.value/total*100;
    const c = `<circle cx="21" cy="21" r="15.9" fill="none" stroke="${seg.color}" stroke-width="6"
      stroke-dasharray="${frac.toFixed(2)} ${(100-frac).toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"></circle>`;
    offset -= frac;
    return c;
  }).join('');
  return `<svg width="150" height="150" viewBox="0 0 42 42">
    <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--panel-2)" stroke-width="6"></circle>
    ${circ}
    <text x="21" y="20" text-anchor="middle" font-size="7" font-weight="700" fill="var(--ink)" font-family="Fraunces">${centerTop}</text>
    <text x="21" y="26" text-anchor="middle" font-size="3" fill="var(--ink-dim)" font-family="'Spline Sans'">${centerBot}</text>
  </svg>`;
}
