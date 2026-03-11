
const state = {
  countries: [],
  filtered: [],
  selected: null
};

const els = {
  searchInput: document.getElementById('searchInput'),
  regionFilter: document.getElementById('regionFilter'),
  countriesGrid: document.getElementById('countriesGrid'),
  resultsText: document.getElementById('resultsText'),
  countriesCount: document.getElementById('countriesCount'),
  recipesCount: document.getElementById('recipesCount'),
  randomBtn: document.getElementById('randomBtn'),
  themeBtn: document.getElementById('themeBtn'),
  modal: document.getElementById('countryModal'),
  modalContent: document.getElementById('modalContent'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cardTpl: document.getElementById('countryCardTemplate')
};

const saveTheme = (light) => {
  if (light) document.body.classList.add('light');
  else document.body.classList.remove('light');
  localStorage.setItem('worldFoodTheme', light ? 'light' : 'dark');
};

const loadTheme = () => saveTheme(localStorage.getItem('worldFoodTheme') === 'light');

function generateDishImage(recipe, country){
  const palette = [
    ['#ff8a65','#ffca28','#8bc34a'],
    ['#7c9cff','#59d8c5','#ffd166'],
    ['#f06292','#ba68c8','#4fc3f7'],
    ['#ff7043','#26c6da','#ffee58']
  ];
  const colors = palette[(recipe.title_en.length + country.code.charCodeAt(0)) % palette.length];
  const label = `${country.flag} ${recipe.title_ar}`;
  const sub = recipe.title_en;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0%" stop-color="${colors[0]}"/>
        <stop offset="50%" stop-color="${colors[1]}"/>
        <stop offset="100%" stop-color="${colors[2]}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="760" fill="#101826"/>
    <circle cx="210" cy="140" r="220" fill="url(#g)" opacity=".18"/>
    <circle cx="1000" cy="620" r="260" fill="url(#g)" opacity=".18"/>
    <rect x="90" y="70" width="1020" height="620" rx="42" fill="url(#g)" opacity=".16" stroke="rgba(255,255,255,.2)"/>
    <circle cx="600" cy="360" r="170" fill="rgba(255,255,255,.15)"/>
    <circle cx="600" cy="360" r="140" fill="rgba(255,255,255,.82)"/>
    <circle cx="600" cy="360" r="115" fill="rgba(255,255,255,.92)"/>
    <g opacity=".95">
      <ellipse cx="555" cy="330" rx="55" ry="30" fill="${colors[0]}"/>
      <ellipse cx="655" cy="332" rx="50" ry="26" fill="${colors[1]}"/>
      <ellipse cx="600" cy="390" rx="85" ry="42" fill="${colors[2]}"/>
      <circle cx="548" cy="325" r="10" fill="#fff7"/>
      <circle cx="652" cy="328" r="8" fill="#fff7"/>
      <circle cx="610" cy="388" r="9" fill="#fff7"/>
    </g>
    <text x="600" y="120" fill="white" font-size="44" text-anchor="middle" font-family="Segoe UI, Arial">${escapeXML(label)}</text>
    <text x="600" y="655" fill="white" font-size="34" text-anchor="middle" font-family="Segoe UI, Arial">${escapeXML(sub)}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function escapeXML(str){
  return String(str).replace(/[<>&'"]/g, (c)=>({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' }[c]));
}

function buildRegionOptions(){
  const regions = [...new Set(state.countries.map(c => c.region).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    els.regionFilter.appendChild(option);
  });
}

function renderGrid(){
  els.countriesGrid.innerHTML = '';
  state.filtered.forEach(country => {
    const node = els.cardTpl.content.firstElementChild.cloneNode(true);
    node.querySelector('.flag').textContent = country.flag;
    node.querySelector('.country-name').textContent = `${country.name_ar} / ${country.name_en}`;
    node.querySelector('.country-sub').textContent = `${country.region} • ${country.subregion}`;
    node.querySelector('.country-summary').textContent = country.summary_ar;
    const meta = node.querySelector('.country-meta');
    [
      `العاصمة: ${country.capital}`,
      `الوصفات: ${country.recipes.length}`,
      `الكود: ${country.code}`
    ].forEach(text => {
      const chip = document.createElement('span');
      chip.className = 'meta-chip';
      chip.textContent = text;
      meta.appendChild(chip);
    });
    node.querySelector('button').addEventListener('click', () => openCountry(country.code));
    els.countriesGrid.appendChild(node);
  });
  els.resultsText.textContent = `النتائج الحالية: ${state.filtered.length} من أصل ${state.countries.length}`;
  els.countriesCount.textContent = state.countries.length.toLocaleString('en-US');
  els.recipesCount.textContent = state.countries.reduce((n,c)=>n + c.recipes.length, 0).toLocaleString('en-US');
}

function filterCountries(){
  const q = els.searchInput.value.trim().toLowerCase();
  const region = els.regionFilter.value;
  state.filtered = state.countries.filter(c => {
    const text = `${c.name_ar} ${c.name_en} ${c.code} ${c.region} ${c.subregion}`.toLowerCase();
    const okSearch = !q || text.includes(q);
    const okRegion = !region || c.region === region;
    return okSearch && okRegion;
  });
  renderGrid();
}

function linkButton(text, href, className='btn ghost'){
  return `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
}

function openCountry(code){
  const country = state.countries.find(c => c.code === code);
  if (!country) return;
  state.selected = country;
  const recipes = country.recipes.map(recipe => `
    <article class="recipe-card">
      <img class="recipe-cover" src="${generateDishImage(recipe, country)}" alt="${country.name_ar} - ${recipe.title_ar}" loading="lazy" />
      <div class="recipe-body">
        <h4>${recipe.title_ar} <span class="muted">/ ${recipe.title_en}</span></h4>
        <p>${recipe.description_ar}</p>
        <div class="recipe-meta">
          <span class="meta-chip">الوقت: ${recipe.time_minutes} دقيقة</span>
          <span class="meta-chip">الصعوبة: ${recipe.difficulty}</span>
          <span class="meta-chip">الحصص: ${recipe.servings}</span>
        </div>
        <div class="two-col">
          <div class="list-box">
            <h5>المكوّنات</h5>
            <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
          </div>
          <div class="list-box">
            <h5>طريقة التحضير</h5>
            <ol>${recipe.steps.map(i => `<li>${i}</li>`).join('')}</ol>
          </div>
        </div>
        <div class="recipe-links">
          ${linkButton('فيديو على يوتيوب', recipe.links.youtube)}
          ${linkButton('بحث Google', recipe.links.google)}
          ${linkButton('بحث Wikipedia', recipe.links.wikipedia)}
        </div>
      </div>
    </article>
  `).join('');

  els.modalContent.innerHTML = `
    <header class="modal-header">
      <div class="flag-big">${country.flag}</div>
      <div>
        <h3>${country.name_ar} / ${country.name_en}</h3>
        <p class="country-description">${country.summary_ar}</p>
      </div>
      <div class="country-meta">
        <span class="meta-chip">العاصمة: ${country.capital}</span>
        <span class="meta-chip">الإقليم: ${country.region}</span>
        <span class="meta-chip">تحت الإقليم: ${country.subregion}</span>
        <span class="meta-chip">عدد الوصفات: ${country.recipes.length}</span>
      </div>
    </header>

    <div class="link-row">
      ${linkButton('بحث عام عن أكل الدولة', country.search_links.google, 'btn primary')}
      ${linkButton('يوتيوب أكلات الدولة', country.search_links.youtube)}
      ${linkButton('مقال/مرجع للدولة', country.search_links.wikipedia)}
    </div>

    <section class="recipe-grid">${recipes}</section>

    <p class="footer-note">هذه النسخة صُممت لتكون شاملة وسريعة للنشر. بعض الدول تحتوي أطباقًا مرتبطة مباشرة بمطبخها، وبعض الدول تحتوي أطباقًا ممثلة للإقليم الغذائي الأقرب لها حتى لا تبقى أي دولة بلا محتوى.</p>
  `;
  els.modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  els.modal.classList.add('hidden');
  document.body.style.overflow = '';
}

async function init(){
  loadTheme();
  const res = await fetch('./data/countries.json');
  state.countries = await res.json();
  state.filtered = [...state.countries];
  buildRegionOptions();
  renderGrid();

  els.searchInput.addEventListener('input', filterCountries);
  els.regionFilter.addEventListener('change', filterCountries);
  els.randomBtn.addEventListener('click', () => {
    const pool = state.filtered.length ? state.filtered : state.countries;
    const item = pool[Math.floor(Math.random() * pool.length)];
    openCountry(item.code);
  });
  els.themeBtn.addEventListener('click', () => {
    const isLight = !document.body.classList.contains('light');
    saveTheme(isLight);
  });
  els.closeModalBtn.addEventListener('click', closeModal);
  els.modal.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'true') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

init().catch(err => {
  els.resultsText.textContent = 'حدث خطأ أثناء تحميل البيانات. حاول تشغيل الموقع عبر خادم محلي أو على Vercel.';
  console.error(err);
});
