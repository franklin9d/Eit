/* ===================================================
   موسوعة أكلات العالم - JavaScript الاحترافي
   World Food Encyclopedia - Professional JS
   =================================================== */

'use strict';

// ===== State Management =====
const state = {
  countries: [],
  filtered: [],
  selected: null,
  currentPage: 0,
  pageSize: 24,
  viewMode: 'grid',
  activeRegion: '',
  sortBy: 'name'
};

// ===== DOM Elements =====
const els = {
  preloader: document.getElementById('preloader'),
  navbar: document.getElementById('navbar'),
  searchInput: document.getElementById('searchInput'),
  searchClear: document.getElementById('searchClear'),
  regionFilter: document.getElementById('regionFilter'),
  sortSelect: document.getElementById('sortSelect'),
  countriesGrid: document.getElementById('countriesGrid'),
  resultsText: document.getElementById('resultsText'),
  countriesCount: document.getElementById('countriesCount'),
  recipesCount: document.getElementById('recipesCount'),
  navCountries: document.getElementById('navCountries'),
  navRecipes: document.getElementById('navRecipes'),
  randomBtn: document.getElementById('randomBtn'),
  heroRandomBtn: document.getElementById('heroRandomBtn'),
  heroExploreBtn: document.getElementById('heroExploreBtn'),
  themeBtn: document.getElementById('themeBtn'),
  themeIcon: document.getElementById('themeIcon'),
  modal: document.getElementById('countryModal'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  modalContent: document.getElementById('modalContent'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cardTpl: document.getElementById('countryCardTemplate'),
  gridViewBtn: document.getElementById('gridViewBtn'),
  listViewBtn: document.getElementById('listViewBtn'),
  loadMoreBtn: document.getElementById('loadMoreBtn'),
  loadMoreWrapper: document.getElementById('loadMoreWrapper'),
  regionsList: document.getElementById('regionsList'),
  popularList: document.getElementById('popularList'),
  particles: document.getElementById('particles'),
  toast: document.getElementById('toast'),
  toastMsg: document.getElementById('toastMsg')
};

// ===== Food Images Database =====
// Real food images from Unsplash and Pexels (free to use)
const foodImageMap = {
  // Rice dishes
  'rice': 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=600&q=80',
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'sushi': 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
  'fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80',
  'paella': 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&q=80',
  'risotto': 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80',

  // Pasta & Noodles
  'pasta': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80',
  'noodles': 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
  'ramen': 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&q=80',
  'pho': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
  'spaghetti': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',

  // Meat dishes
  'grilled meat': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  'kebab': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  'roast': 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=600&q=80',
  'steak': 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
  'chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80',
  'lamb': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',

  // Curry & Stew
  'curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
  'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
  'stew': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  'tagine': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',

  // Bread & Pastry
  'flatbread': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&q=80',
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  'pastry': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=600&q=80',
  'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
  'dumpling': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
  'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',

  // Seafood
  'fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80',
  'seafood': 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=600&q=80',
  'shrimp': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',

  // Salads & Vegetables
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'vegetable': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
  'couscous': 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600&q=80',

  // Desserts
  'dessert': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
  'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
  'baklava': 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&q=80',
  'ice cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80',
  'chocolate': 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80',
  'milk': 'https://images.unsplash.com/photo-1484723091739-30990cecd780?w=600&q=80',

  // Breakfast
  'breakfast': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
  'omelette': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
  'eggs': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',

  // Pizza & Burger
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',

  // Drinks
  'tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',

  // Regional dishes
  'tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
  'taco': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
  'enchiladas': 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=600&q=80',
  'burritos': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80',
  'falafel': 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=600&q=80',
  'hummus': 'https://images.unsplash.com/photo-1580023917899-a16f3d50a95f?w=600&q=80',
  'shawarma': 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=600&q=80',
  'mansaf': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'mandi': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'kabsa': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'machboos': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'injera': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
  'jollof': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  'poutine': 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&q=80',
  'pierogi': 'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=600&q=80',
  'borsch': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  'goulash': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  'moussaka': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',

  // Default food images per region
  'asia': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  'europe': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'africa': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
  'americas': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'oceania': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',

  // Default fallback
  'default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'
};

// Array of varied food images for random assignment
const foodImagePool = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80',
  'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
  'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=600&q=80',
  'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80',
  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
  'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=600&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&q=80',
  'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
  'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&q=80',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
  'https://images.unsplash.com/photo-1580023917899-a16f3d50a95f?w=600&q=80',
  'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=600&q=80',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80'
];

/**
 * Get food image URL based on recipe title and context
 */
function getFoodImage(recipe, country) {
  const titleEn = (recipe.title_en || '').toLowerCase();
  const titleAr = (recipe.title_ar || '');
  const region = (country.region || '').toLowerCase();

  // Try to match specific keywords
  const keywords = Object.keys(foodImageMap);
  for (const keyword of keywords) {
    if (titleEn.includes(keyword)) {
      return foodImageMap[keyword];
    }
  }

  // Try Arabic keywords
  const arKeywords = {
    'أرز': foodImageMap['rice'],
    'بيريياني': foodImageMap['biryani'],
    'كاري': foodImageMap['curry'],
    'عدس': foodImageMap['dal'],
    'كسكس': foodImageMap['couscous'],
    'سمك': foodImageMap['fish'],
    'دجاج': foodImageMap['chicken'],
    'لحم مشوي': foodImageMap['grilled meat'],
    'كباب': foodImageMap['kebab'],
    'خبز': foodImageMap['bread'],
    'معكرونة': foodImageMap['pasta'],
    'شوربة': foodImageMap['soup'],
    'حساء': foodImageMap['soup'],
    'سلطة': foodImageMap['salad'],
    'حلوى': foodImageMap['dessert'],
    'بيتزا': foodImageMap['pizza'],
    'بيض': foodImageMap['eggs'],
    'سمبوسك': foodImageMap['samosa'],
    'سوشي': foodImageMap['sushi'],
    'فلافل': foodImageMap['falafel'],
    'حمص': foodImageMap['hummus'],
    'شاورما': foodImageMap['shawarma'],
    'طاجين': foodImageMap['tagine'],
    'يخنة': foodImageMap['stew'],
    'رامن': foodImageMap['ramen'],
    'فو': foodImageMap['pho'],
    'شاي': foodImageMap['tea'],
    'قهوة': foodImageMap['coffee'],
    'كعكة': foodImageMap['cake'],
    'بقلاوة': foodImageMap['baklava'],
    'فطائر': foodImageMap['pastry'],
    'سلمون': foodImageMap['seafood'],
    'روبيان': foodImageMap['shrimp'],
  };

  for (const [key, val] of Object.entries(arKeywords)) {
    if (titleAr.includes(key)) return val;
  }

  // Regional fallback
  const regionMap = {
    'asia': foodImageMap['asia'],
    'europe': foodImageMap['europe'],
    'africa': foodImageMap['africa'],
    'americas': foodImageMap['americas'],
    'oceania': foodImageMap['oceania']
  };

  if (regionMap[region]) return regionMap[region];

  // Deterministic fallback based on recipe id
  const id = recipe.id || '';
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return foodImagePool[hash % foodImagePool.length];
}

// ===== Theme Management =====
function saveTheme(light) {
  document.body.classList.toggle('light', light);
  localStorage.setItem('worldFoodTheme', light ? 'light' : 'dark');
  els.themeIcon.textContent = light ? '☀️' : '🌙';
}

function loadTheme() {
  const saved = localStorage.getItem('worldFoodTheme');
  const isLight = saved === 'light';
  saveTheme(isLight);
}

// ===== Toast Notification =====
let toastTimer;
function showToast(msg, duration = 3000) {
  clearTimeout(toastTimer);
  els.toastMsg.textContent = msg;
  els.toast.classList.remove('hidden');
  toastTimer = setTimeout(() => {
    els.toast.classList.add('hidden');
  }, duration);
}

// ===== Particles =====
function createParticles() {
  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 80 + 20;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: radial-gradient(circle, ${['rgba(124,156,255,0.3)', 'rgba(89,216,197,0.3)', 'rgba(255,140,105,0.2)', 'rgba(199,125,255,0.2)'][Math.floor(Math.random() * 4)]}, transparent 70%);
      --duration: ${Math.random() * 20 + 15}s;
      --delay: ${Math.random() * -20}s;
    `;
    els.particles.appendChild(p);
  }
}

// ===== Counter Animation =====
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const startVal = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('ar-EG');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function startCounters() {
  document.querySelectorAll('.counter-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    if (target) animateCounter(el, target, 2200);
  });
}

// ===== Intersection Observer for animations =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.1 });

// ===== Build Sidebar =====
function buildSidebar() {
  // Regions
  const regionCounts = {};
  state.countries.forEach(c => {
    const r = c.region || 'Other';
    regionCounts[r] = (regionCounts[r] || 0) + 1;
  });

  els.regionsList.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'region-btn active';
  allBtn.innerHTML = `<span>🌐 كل المناطق</span><span class="region-count">${state.countries.length}</span>`;
  allBtn.addEventListener('click', () => {
    document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
    els.regionFilter.value = '';
    filterCountries();
  });
  els.regionsList.appendChild(allBtn);

  const regionEmojis = {
    'Asia': '🌏', 'Europe': '🌍', 'Africa': '🌍', 'Americas': '🌎',
    'Oceania': '🏝️', 'North America': '🌎', 'South America': '🌎',
    'Antarctic': '🧊', 'Other': '🗺️'
  };

  Object.entries(regionCounts).sort((a, b) => b[1] - a[1]).forEach(([region, count]) => {
    const btn = document.createElement('button');
    btn.className = 'region-btn';
    const emoji = regionEmojis[region] || '🗺️';
    btn.innerHTML = `<span>${emoji} ${region}</span><span class="region-count">${count}</span>`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      els.regionFilter.value = region;
      filterCountries();
    });
    els.regionsList.appendChild(btn);
  });

  // Popular countries (those with most recipes)
  const popular = [...state.countries]
    .sort((a, b) => b.recipes.length - a.recipes.length)
    .slice(0, 6);

  els.popularList.innerHTML = '';
  popular.forEach(country => {
    const item = document.createElement('div');
    item.className = 'popular-item';
    item.innerHTML = `
      <div class="popular-item-flag">${country.flag}</div>
      <div class="popular-item-info">
        <div class="popular-item-name">${country.name_ar}</div>
        <div class="popular-item-count">${country.recipes.length} وصفة</div>
      </div>
    `;
    item.addEventListener('click', () => openCountry(country.code));
    els.popularList.appendChild(item);
  });
}

// ===== Build Region Filter Options =====
function buildRegionOptions() {
  const regions = [...new Set(state.countries.map(c => c.region).filter(Boolean))].sort();
  regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    els.regionFilter.appendChild(option);
  });
}

// ===== Filter & Sort =====
function filterCountries() {
  const q = els.searchInput.value.trim().toLowerCase();
  const region = els.regionFilter.value;

  // Show/hide clear button
  els.searchClear.classList.toggle('visible', q.length > 0);

  state.filtered = state.countries.filter(c => {
    const text = `${c.name_ar} ${c.name_en} ${c.code} ${c.region} ${c.subregion} ${c.capital}`.toLowerCase();
    const okSearch = !q || text.includes(q) || c.recipes.some(r =>
      r.title_ar.toLowerCase().includes(q) || r.title_en.toLowerCase().includes(q)
    );
    const okRegion = !region || c.region === region;
    return okSearch && okRegion;
  });

  // Sort
  const sortBy = els.sortSelect.value;
  if (sortBy === 'recipes') {
    state.filtered.sort((a, b) => b.recipes.length - a.recipes.length);
  } else if (sortBy === 'region') {
    state.filtered.sort((a, b) => (a.region || '').localeCompare(b.region || ''));
  } else {
    state.filtered.sort((a, b) => a.name_ar.localeCompare(b.name_ar));
  }

  state.currentPage = 0;
  renderGrid(false);
}

// ===== Render Grid =====
function renderGrid(append = false) {
  if (!append) {
    els.countriesGrid.innerHTML = '';
  }

  const start = state.currentPage * state.pageSize;
  const end = start + state.pageSize;
  const page = state.filtered.slice(start, end);

  if (!append && state.filtered.length === 0) {
    els.countriesGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>لا توجد نتائج</h3>
        <p>حاول البحث بكلمة أخرى أو اختر منطقة مختلفة</p>
      </div>
    `;
    els.loadMoreWrapper.style.display = 'none';
    els.resultsText.textContent = 'لا توجد نتائج';
    return;
  }

  page.forEach((country, idx) => {
    const card = createCountryCard(country);
    card.style.animationDelay = `${(idx % state.pageSize) * 0.04}s`;
    els.countriesGrid.appendChild(card);
  });

  // Show/hide load more
  const hasMore = end < state.filtered.length;
  els.loadMoreWrapper.style.display = hasMore ? 'flex' : 'none';

  // Update results text
  const showing = Math.min(end, state.filtered.length);
  els.resultsText.innerHTML = `
    يعرض <strong>${showing.toLocaleString('ar-EG')}</strong> من أصل 
    <strong>${state.filtered.length.toLocaleString('ar-EG')}</strong> دولة
  `;
}

// ===== Create Country Card =====
function createCountryCard(country) {
  const node = els.cardTpl.content.firstElementChild.cloneNode(true);

  // Flag
  node.querySelector('.card-flag-large').textContent = country.flag;
  node.querySelector('.card-flag-small').textContent = country.flag;

  // Names
  node.querySelector('.card-name-ar').textContent = country.name_ar;
  node.querySelector('.card-name-en').textContent = country.name_en;

  // Region
  node.querySelector('.card-region').innerHTML = `🗺️ ${country.region} ${country.subregion ? '• ' + country.subregion : ''}`;

  // Summary
  node.querySelector('.card-summary').textContent =
    country.summary_ar || `مطبخ ${country.name_ar} التقليدي`;

  // Meta tags
  const meta = node.querySelector('.card-meta');
  const tags = [
    { text: `🏛️ ${country.capital || 'غير محدد'}`, highlight: false },
    { text: `📖 ${country.recipes.length} وصفة`, highlight: true }
  ];
  tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = `meta-tag${tag.highlight ? ' highlight' : ''}`;
    span.textContent = tag.text;
    meta.appendChild(span);
  });

  // Recipe count button
  const openBtn = node.querySelector('.btn-open-recipes');
  openBtn.querySelector('.btn-count').textContent = country.recipes.length;

  // Click handlers
  const openFn = () => openCountry(country.code);
  openBtn.addEventListener('click', openFn);
  node.querySelector('.card-quick-view').addEventListener('click', openFn);

  return node;
}

// ===== Get Difficulty Class =====
function getDifficultyClass(diff) {
  if (!diff) return 'easy';
  if (diff.includes('سهل') || diff.toLowerCase().includes('easy')) return 'easy';
  if (diff.includes('متوسط') || diff.toLowerCase().includes('medium')) return 'medium';
  return 'hard';
}

// ===== Open Country Modal =====
function openCountry(code) {
  const country = state.countries.find(c => c.code === code);
  if (!country) return;
  state.selected = country;

  const recipesHTML = country.recipes.map((recipe, idx) => {
    const imgUrl = getFoodImage(recipe, country);
    const diffClass = getDifficultyClass(recipe.difficulty);

    return `
    <article class="recipe-card" style="animation-delay: ${idx * 0.06}s">
      <div class="recipe-image-wrapper">
        <img 
          class="recipe-cover-img" 
          src="${imgUrl}" 
          alt="${recipe.title_ar}" 
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'"
        />
        <div class="recipe-img-overlay">
          <span class="recipe-difficulty-badge ${diffClass}">${recipe.difficulty || 'سهل'}</span>
          <span class="recipe-time-badge">⏱ ${recipe.time_minutes} د</span>
        </div>
      </div>
      <div class="recipe-body">
        <h4 class="recipe-title">${recipe.title_ar}</h4>
        <p class="recipe-title-en">${recipe.title_en}</p>
        <p class="recipe-desc">${recipe.description_ar}</p>
        <div class="recipe-quick-stats">
          <span class="quick-stat">⏱ ${recipe.time_minutes} دقيقة</span>
          <span class="quick-stat">👥 ${recipe.servings} حصص</span>
          <span class="quick-stat">📊 ${recipe.difficulty || 'سهل'}</span>
        </div>
        <div class="recipe-details">
          <div class="detail-box">
            <h5>🛒 المكوّنات</h5>
            <ul>
              ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
          <div class="detail-box">
            <h5>👨‍🍳 طريقة التحضير</h5>
            <ol>
              ${recipe.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </div>
        </div>
        <div class="recipe-links-row">
          <a class="recipe-link-btn" href="${recipe.links.youtube}" target="_blank" rel="noopener">
            ▶️ يوتيوب
          </a>
          <a class="recipe-link-btn" href="${recipe.links.google}" target="_blank" rel="noopener">
            🔍 بحث
          </a>
          <a class="recipe-link-btn" href="${recipe.links.wikipedia}" target="_blank" rel="noopener">
            📚 ويكيبيديا
          </a>
        </div>
      </div>
    </article>
    `;
  }).join('');

  els.modalContent.innerHTML = `
    <div class="modal-hero">
      <div class="modal-hero-bg">${country.flag}</div>
      <div class="modal-hero-content">
        <div class="modal-flag-box">${country.flag}</div>
        <div class="modal-header-info">
          <h2 class="modal-country-name">${country.name_ar}</h2>
          <p class="modal-country-sub">${country.name_en}</p>
          <div class="modal-tags">
            <span class="modal-tag primary">🏛️ ${country.capital || 'غير محدد'}</span>
            <span class="modal-tag">🌐 ${country.region}</span>
            ${country.subregion ? `<span class="modal-tag">📍 ${country.subregion}</span>` : ''}
            <span class="modal-tag primary">📖 ${country.recipes.length} وصفة</span>
          </div>
        </div>
      </div>
      <div class="modal-links">
        <a class="link-btn primary" href="${country.search_links.google}" target="_blank" rel="noopener">
          🔍 بحث عن أكلات ${country.name_ar}
        </a>
        <a class="link-btn" href="${country.search_links.youtube}" target="_blank" rel="noopener">
          ▶️ يوتيوب
        </a>
        <a class="link-btn" href="${country.search_links.wikipedia}" target="_blank" rel="noopener">
          📚 ويكيبيديا
        </a>
      </div>
    </div>

    <div class="modal-body">
      <h3 class="modal-section-title">
        <div class="section-icon">🍽️</div>
        أشهر الأطباق التقليدية
        <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 400; margin-right: auto">${country.recipes.length} وصفة</span>
      </h3>
      <section class="recipe-grid">
        ${recipesHTML}
      </section>
    </div>
  `;

  els.modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Scroll to top of modal
  setTimeout(() => {
    window.scrollTo({ top: 0 });
  }, 10);
}

// ===== Close Modal =====
function closeModal() {
  els.modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ===== Update Stats =====
function updateStats() {
  const total = state.countries.length;
  const totalRecipes = state.countries.reduce((n, c) => n + c.recipes.length, 0);

  animateCounter(els.countriesCount, total, 1500);
  animateCounter(els.recipesCount, totalRecipes, 1800);
  els.navCountries.textContent = total.toLocaleString('ar-EG');
  els.navRecipes.textContent = totalRecipes.toLocaleString('ar-EG');
}

// ===== Init App =====
async function init() {
  try {
    // Create particles
    createParticles();

    // Load theme
    loadTheme();

    // Fetch data
    const res = await fetch('./data/countries.json');
    if (!res.ok) throw new Error('Failed to load data');
    state.countries = await res.json();
    state.filtered = [...state.countries];

    // Sort by name initially
    state.filtered.sort((a, b) => a.name_ar.localeCompare(b.name_ar));

    // Build UI
    buildRegionOptions();
    buildSidebar();
    updateStats();
    renderGrid(false);

    // Start hero counters after a delay
    setTimeout(startCounters, 800);

    // Hide preloader
    setTimeout(() => {
      els.preloader.classList.add('hidden');
    }, 1500);

    // ===== Event Listeners =====

    // Search
    let searchDebounce;
    els.searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(filterCountries, 200);
    });

    // Clear search
    els.searchClear.addEventListener('click', () => {
      els.searchInput.value = '';
      els.searchClear.classList.remove('visible');
      filterCountries();
      els.searchInput.focus();
    });

    // Filters
    els.regionFilter.addEventListener('change', filterCountries);
    els.sortSelect.addEventListener('change', filterCountries);

    // View toggle
    els.gridViewBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      els.countriesGrid.classList.remove('list-view');
      els.gridViewBtn.classList.add('active');
      els.listViewBtn.classList.remove('active');
    });

    els.listViewBtn.addEventListener('click', () => {
      state.viewMode = 'list';
      els.countriesGrid.classList.add('list-view');
      els.listViewBtn.classList.add('active');
      els.gridViewBtn.classList.remove('active');
    });

    // Load more
    els.loadMoreBtn.addEventListener('click', () => {
      els.loadMoreBtn.classList.add('loading');
      setTimeout(() => {
        state.currentPage++;
        renderGrid(true);
        els.loadMoreBtn.classList.remove('loading');
      }, 600);
    });

    // Random country
    const openRandom = () => {
      const pool = state.filtered.length ? state.filtered : state.countries;
      const item = pool[Math.floor(Math.random() * pool.length)];
      openCountry(item.code);
      showToast(`🎲 دولة عشوائية: ${item.name_ar}`);
    };
    els.randomBtn.addEventListener('click', openRandom);
    els.heroRandomBtn?.addEventListener('click', openRandom);

    // Hero explore button
    els.heroExploreBtn?.addEventListener('click', () => {
      document.getElementById('searchBarWrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Theme toggle
    els.themeBtn.addEventListener('click', () => {
      const isLight = !document.body.classList.contains('light');
      saveTheme(isLight);
      showToast(isLight ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي');
    });

    // Modal close
    els.closeModalBtn.addEventListener('click', closeModal);
    els.modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 50;
      els.navbar.classList.toggle('scrolled', scrolled);
    }, { passive: true });

    // Keyboard search shortcut
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        els.searchInput.focus();
        els.searchInput.select();
      }
    });

  } catch (err) {
    console.error('Init error:', err);
    els.resultsText.textContent = '❌ حدث خطأ أثناء تحميل البيانات. تأكد من تشغيل الموقع عبر خادم محلي أو على Vercel.';

    // Hide preloader even on error
    setTimeout(() => {
      els.preloader.classList.add('hidden');
    }, 1000);
  }
}

// ===== Start App =====
init();
