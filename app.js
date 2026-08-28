const sideEl = document.getElementById('side');
const listEl = document.getElementById('list');
const qEl = document.getElementById('q');
const metaEl = document.getElementById('meta');
const countEl = document.getElementById('count');
const hotEl = document.getElementById('hot');
const themeBtn = document.getElementById('theme');

let tools = [];
let cat = '免费';
const saved = localStorage.getItem('theme') || 'dark';
document.documentElement.dataset.theme = saved;
themeBtn.textContent = saved === 'dark' ? '浅色' : '深色';

themeBtn.onclick = () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  themeBtn.textContent = next === 'dark' ? '浅色' : '深色';
};

async function load() {
  const [data, meta, hot] = await Promise.all([
    fetch('data/tools.json').then(r => r.json()),
    fetch('data/meta.json').then(r => r.json()).catch(() => ({})),
    fetch('data/hot.json').then(r => r.json()).catch(() => [])
  ]);
  tools = data;
  metaEl.textContent = `更新 ${meta.updated || '—'} · ${tools.length} 款`;
  hotEl.innerHTML = hot.map((h, i) =>
    `<a href="${h.url}" target="_blank" rel="noopener"><span>${i + 1} · ${h.tag || '热点'}</span><b>${h.title}</b></a>`
  ).join('');
  renderSide();
  render();
}

function renderSide() {
  const cats = ['免费', '全部', ...[...new Set(tools.map(t => t.cat))]];
  sideEl.innerHTML = cats.map(c => `<button data-c="${c}" class="${c===cat?'on':''}">${c}</button>`).join('');
  sideEl.onclick = e => {
    const b = e.target.closest('button');
    if (!b) return;
    cat = b.dataset.c;
    renderSide();
    render();
  };
}

function render() {
  const q = (qEl.value || '').trim().toLowerCase();
  const rows = tools.filter(t => {
    const okCat = cat === '全部' || (cat === '免费' ? t.free : t.cat === cat);
    const blob = [t.name, t.desc, t.cat].join(' ').toLowerCase();
    return okCat && (!q || blob.includes(q));
  });
  countEl.textContent = `显示 ${rows.length} / ${tools.length}`;
  listEl.innerHTML = rows.map(t => `
    <a class="card" href="${t.url}" target="_blank" rel="noopener">
      <h3>${t.name}</h3>
      <p>${t.desc}</p>
      <span class="tag">${t.cat}${t.free ? ' · 免费' : ''}</span>
    </a>`).join('') || '<p class="count">没有匹配</p>';
}

qEl.addEventListener('input', render);
load();
