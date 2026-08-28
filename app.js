const catsEl = document.getElementById('cats');
const listEl = document.getElementById('list');
const qEl = document.getElementById('q');
const metaEl = document.getElementById('meta');

let tools = [];
let cat = '全部';

async function load() {
  const [data, meta] = await Promise.all([
    fetch('data/tools.json').then(r => r.json()),
    fetch('data/meta.json').then(r => r.json()).catch(() => ({}))
  ]);
  tools = data;
  const date = meta.updated || '—';
  const pick = meta.today || '';
  metaEl.textContent = `更新 ${date}` + (pick ? ` · 今日推荐 ${pick}` : '');
  renderCats();
  render();
}

function renderCats() {
  const set = ['全部', ...new Set(tools.map(t => t.cat))];
  catsEl.innerHTML = set.map(c => `<button data-c="${c}" class="${c===cat?'on':''}">${c}</button>`).join('');
  catsEl.onclick = e => {
    const b = e.target.closest('button');
    if (!b) return;
    cat = b.dataset.c;
    renderCats();
    render();
  };
}

function render() {
  const q = (qEl.value || '').trim().toLowerCase();
  const rows = tools.filter(t => {
    const okCat = cat === '全部' || t.cat === cat;
    const okQ = !q || [t.name, t.desc, t.cat].join(' ').toLowerCase().includes(q);
    return okCat && okQ;
  });
  listEl.innerHTML = rows.map(t => `
    <a class="card" href="${t.url}" target="_blank" rel="noopener">
      <h3>${t.name}</h3>
      <p>${t.desc}</p>
      <span class="tag">${t.cat}${t.free ? ' · 可免费用' : ''}</span>
    </a>`).join('') || '<p class="meta">没有匹配</p>';
}

qEl.addEventListener('input', render);
load();
