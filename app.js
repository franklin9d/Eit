'use strict';

/* ══════════════════════════════════════════════
   موسوعة أكلات العالم — app.js v3.0
   صور SVG احترافية وفريدة لكل وجبة
   ══════════════════════════════════════════════ */

const S = {
  countries: [], filtered: [], page: 0, pageSize: 24, view: 'grid'
};

const $ = id => document.getElementById(id);

const EL = {
  preloader:    $('preloader'),
  navbar:       $('navbar'),
  searchInput:  $('searchInput'),
  searchClear:  $('searchClear'),
  regionFilter: $('regionFilter'),
  sortSelect:   $('sortSelect'),
  grid:         $('countriesGrid'),
  resultsText:  $('resultsText'),
  cCount:       $('countriesCount'),
  rCount:       $('recipesCount'),
  navC:         $('navC'),
  navR:         $('navR'),
  randomBtn:    $('randomBtn'),
  themeBtn:     $('themeBtn'),
  themeIco:     $('themeIco'),
  gridBtn:      $('gridBtn'),
  listBtn:      $('listBtn'),
  lmWrap:       $('loadMoreWrapper'),
  lmBtn:        $('loadMoreBtn'),
  regionList:   $('regionList'),
  popularList:  $('popularList'),
  modal:        $('modal'),
  modalBd:      $('modalBd'),
  modalContent: $('modalContent'),
  modalClose:   $('modalClose'),
  particles:    $('particles'),
  toast:        $('toast'),
  tpl:          $('tpl')
};

/* ══════════════════════════════════════════════
   🎨 PROFESSIONAL FOOD SVG GENERATOR
   كل وجبة تحصل على صورة فريدة وجميلة
   ══════════════════════════════════════════════ */

// 50 لوحة ألوان متنوعة واحترافية
const PALETTES = [
  { bg: ['#1a0533','#2d0d52'], main: '#c77dff', accent: '#ff6b9d', hi: '#ffd166' },
  { bg: ['#061a20','#0d3040'], main: '#42dfc8', accent: '#4d96ff', hi: '#ffd166' },
  { bg: ['#1a0a00','#3d1a00'], main: '#ff8c42', accent: '#ffd166', hi: '#ff6b6b' },
  { bg: ['#001a33','#002952'], main: '#4d96ff', accent: '#42dfc8', hi: '#c77dff' },
  { bg: ['#1a1a00','#333300'], main: '#e9c46a', accent: '#f4a261', hi: '#e76f51' },
  { bg: ['#1a0016','#330030'], main: '#f72585', accent: '#b5179e', hi: '#ffd166' },
  { bg: ['#001a0d','#00331a'], main: '#52b788', accent: '#40916c', hi: '#d8f3dc' },
  { bg: ['#1a0505','#330a0a'], main: '#ff6b6b', accent: '#ff4444', hi: '#ffd93d' },
  { bg: ['#0d001a','#1a0035'], main: '#7b2fff', accent: '#c77dff', hi: '#42dfc8' },
  { bg: ['#001a1a','#003333'], main: '#2ec4b6', accent: '#cbf3f0', hi: '#ff9f1c' },
  { bg: ['#1a0a05','#331505'], main: '#f4845f', accent: '#f77f00', hi: '#ffd166' },
  { bg: ['#050a1a','#0a1533'], main: '#7c9cff', accent: '#a78bfa', hi: '#34d399' },
  { bg: ['#1a0818','#330f30'], main: '#e879f9', accent: '#f0abfc', hi: '#fbbf24' },
  { bg: ['#0a1a05','#153305'], main: '#86efac', accent: '#4ade80', hi: '#fde68a' },
  { bg: ['#1a1205','#33220a'], main: '#fbbf24', accent: '#f59e0b', hi: '#ef4444' },
  { bg: ['#051a1a','#0a3333'], main: '#67e8f9', accent: '#22d3ee', hi: '#a78bfa' },
  { bg: ['#1a0510','#330a1e'], main: '#fb7185', accent: '#f43f5e', hi: '#fcd34d' },
  { bg: ['#061205','#0a2208'], main: '#6ee7b7', accent: '#10b981', hi: '#fbbf24' },
  { bg: ['#180d00','#301a00'], main: '#fdba74', accent: '#fb923c', hi: '#86efac' },
  { bg: ['#050318','#0a0630'], main: '#818cf8', accent: '#6366f1', hi: '#34d399' },
  { bg: ['#1a0808','#330f0f'], main: '#fca5a5', accent: '#ef4444', hi: '#fde047' },
  { bg: ['#041a0a','#083314'], main: '#34d399', accent: '#059669', hi: '#fbbf24' },
  { bg: ['#100a1a','#201530'], main: '#c4b5fd', accent: '#8b5cf6', hi: '#f472b6' },
  { bg: ['#1a0f00','#331e00'], main: '#fcd34d', accent: '#f59e0b', hi: '#f87171' },
  { bg: ['#001015','#001e28'], main: '#38bdf8', accent: '#0ea5e9', hi: '#a3e635' },
];

/**
 * Hash فريد لكل وصفة
 */
function hashSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

/**
 * رسم شكل طعام SVG جميل ومفصّل
 * كل وجبة تحصل على شكل مختلف بناءً على الـ seed
 */
function drawFoodArt(seed, cx, cy, pal) {
  const { main: c1, accent: c2, hi: c3 } = pal;
  const shapeType = seed % 20;

  switch (shapeType) {
    case 0: // طبق أرز مع إضافات
      return `
        <ellipse cx="${cx}" cy="${cy+28}" rx="70" ry="20" fill="${c2}" opacity=".35"/>
        <ellipse cx="${cx}" cy="${cy+20}" rx="68" ry="22" fill="${c1}" opacity=".15"/>
        <ellipse cx="${cx}" cy="${cy+10}" rx="60" ry="42" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy-5}" rx="44" ry="28" fill="${c2}" opacity=".55"/>
        <circle cx="${cx-18}" cy="${cy-8}" r="10" fill="${c3}" opacity=".85"/>
        <circle cx="${cx+18}" cy="${cy-5}" r="11" fill="${c3}" opacity=".8"/>
        <circle cx="${cx+2}" cy="${cy+10}" r="9" fill="${c3}" opacity=".75"/>
        <circle cx="${cx-28}" cy="${cy+5}" r="6" fill="${c1}" opacity=".6"/>
        <circle cx="${cx+28}" cy="${cy+8}" r="6" fill="${c1}" opacity=".6"/>`;

    case 1: // وعاء حساء بخار
      return `
        <ellipse cx="${cx}" cy="${cy+30}" rx="64" ry="18" fill="${c2}" opacity=".3"/>
        <path d="M${cx-60} ${cy+15} Q${cx-62} ${cy-10} ${cx} ${cy-15} Q${cx+62} ${cy-10} ${cx+60} ${cy+15} Q${cx+55} ${cy+30} ${cx} ${cy+32} Q${cx-55} ${cy+30} ${cx-60} ${cy+15}Z" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+15}" rx="56" ry="16" fill="${c2}" opacity=".5"/>
        <circle cx="${cx-15}" cy="${cy+8}" r="8" fill="${c3}" opacity=".8"/>
        <circle cx="${cx+15}" cy="${cy+5}" r="7" fill="${c3}" opacity=".8"/>
        <circle cx="${cx}" cy="${cy+15}" r="9" fill="${c3}" opacity=".7"/>
        <path d="M${cx-16} ${cy-28} Q${cx-10} ${cy-45} ${cx-6} ${cy-28}" stroke="${c3}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M${cx+6} ${cy-28} Q${cx+10} ${cy-45} ${cx+16} ${cy-28}" stroke="${c3}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

    case 2: // برجر طبقات
      return `
        <ellipse cx="${cx}" cy="${cy-28}" rx="52" ry="26" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy-26}" rx="42" ry="16" fill="${c3}" opacity=".4"/>
        <rect x="${cx-48}" y="${cy-14}" width="96" height="15" rx="3" fill="${c2}" opacity=".9"/>
        <rect x="${cx-46}" y="${cy+1}" width="92" height="13" rx="2" fill="${c3}" opacity=".75"/>
        <rect x="${cx-44}" y="${cy+14}" width="88" height="12" rx="2" fill="${c1}" opacity=".85"/>
        <ellipse cx="${cx}" cy="${cy+30}" rx="50" ry="20" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+30}" rx="38" ry="12" fill="${c2}" opacity=".35"/>`;

    case 3: // بيتزا دائرية
      return `
        <circle cx="${cx}" cy="${cy}" r="60" fill="${c2}" opacity=".9"/>
        <circle cx="${cx}" cy="${cy}" r="52" fill="${c1}" opacity=".9"/>
        <circle cx="${cx-16}" cy="${cy-12}" r="9" fill="${c2}"/>
        <circle cx="${cx+19}" cy="${cy-16}" r="8" fill="${c2}"/>
        <circle cx="${cx+8}" cy="${cy+18}" r="10" fill="${c2}"/>
        <circle cx="${cx-22}" cy="${cy+14}" r="7" fill="${c2}"/>
        <circle cx="${cx+28}" cy="${cy+8}" r="6" fill="${c3}"/>
        <circle cx="${cx-5}" cy="${cy-22}" r="7" fill="${c3}"/>
        <path d="M${cx} ${cy-60} L${cx+58} ${cy+30} L${cx-58} ${cy+30}Z" fill="none" stroke="${c3}" stroke-width="1.5" opacity=".4"/>
        <circle cx="${cx}" cy="${cy}" r="10" fill="${c2}" opacity=".6"/>`;

    case 4: // سوشي رول قطعة
      return `
        <ellipse cx="${cx}" cy="${cy+5}" rx="58" ry="38" fill="#1a0a00" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+5}" rx="46" ry="30" fill="white" opacity=".95"/>
        <ellipse cx="${cx}" cy="${cy+5}" rx="32" ry="20" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+5}" rx="16" ry="10" fill="${c2}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+5}" rx="6" ry="4" fill="${c3}" opacity=".9"/>
        <rect x="${cx-58}" y="${cy+5}" width="116" height="2" fill="rgba(255,255,255,.15)" rx="1"/>
        <rect x="${cx-2}" y="${cy-33}" width="4" height="76" fill="rgba(255,255,255,.08)" rx="2"/>`;

    case 5: // تاكو نصف دائرة
      return `
        <path d="M${cx-65} ${cy+25} Q${cx-65} ${cy-40} ${cx} ${cy-50} Q${cx+65} ${cy-40} ${cx+65} ${cy+25}Z" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+25}" rx="65" ry="16" fill="${c2}" opacity=".6"/>
        <circle cx="${cx-28}" cy="${cy+8}" r="10" fill="${c3}" opacity=".85"/>
        <circle cx="${cx+28}" cy="${cy+5}" r="10" fill="${c3}" opacity=".85"/>
        <circle cx="${cx}" cy="${cy-2}" r="11" fill="${c3}" opacity=".8"/>
        <circle cx="${cx-46}" cy="${cy+18}" r="7" fill="${c2}" opacity=".7"/>
        <circle cx="${cx+46}" cy="${cy+15}" r="7" fill="${c2}" opacity=".7"/>`;

    case 6: // طاجين مغربي
      return `
        <ellipse cx="${cx}" cy="${cy+32}" rx="62" ry="18" fill="${c2}" opacity=".4"/>
        <ellipse cx="${cx}" cy="${cy+20}" rx="60" ry="22" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+20}" rx="48" ry="15" fill="${c2}" opacity=".45"/>
        <path d="M${cx-38} ${cy+18} Q${cx-35} ${cy-30} ${cx} ${cy-55} Q${cx+35} ${cy-30} ${cx+38} ${cy+18}Z" fill="${c2}" opacity=".9"/>
        <path d="M${cx-25} ${cy+12} Q${cx-22} ${cy-18} ${cx} ${cy-38} Q${cx+22} ${cy-18} ${cx+25} ${cy+12}Z" fill="${c1}" opacity=".5"/>
        <circle cx="${cx}" cy="${cy-55}" r="6" fill="${c3}"/>`;

    case 7: // رامن وعاء
      return `
        <ellipse cx="${cx}" cy="${cy+25}" rx="62" ry="18" fill="${c2}" opacity=".35"/>
        <path d="M${cx-58} ${cy+10} Q${cx-60} ${cy-20} ${cx} ${cy-25} Q${cx+60} ${cy-20} ${cx+58} ${cy+10} Q${cx+55} ${cy+30} ${cx} ${cy+32} Q${cx-55} ${cy+30} ${cx-58} ${cy+10}Z" fill="${c1}" opacity=".9"/>
        <path d="M${cx-50} ${cy+5} Q${cx-30} ${cy-8} ${cx-10} ${cy+5} Q${cx+10} ${cy+15} ${cx+35} ${cy}" stroke="${c2}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M${cx-45} ${cy+12} Q${cx-20} ${cy-2} ${cx+5} ${cy+12} Q${cx+25} ${cy+22} ${cx+45} ${cy+10}" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="${cx+38}" cy="${cy-5}" r="10" fill="${c3}" opacity=".8"/>
        <circle cx="${cx-38}" cy="${cy+2}" r="8" fill="${c3}" opacity=".7"/>`;

    case 8: // حلويات/كيكة
      return `
        <rect x="${cx-50}" y="${cy+10}" width="100" height="32" rx="10" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+10}" rx="50" ry="14" fill="${c2}" opacity=".9"/>
        <rect x="${cx-36}" y="${cy-25}" width="72" height="37" rx="10" fill="${c1}" opacity=".85"/>
        <ellipse cx="${cx}" cy="${cy-25}" rx="36" ry="11" fill="${c3}" opacity=".9"/>
        <rect x="${cx-18}" y="${cy-52}" width="36" height="29" rx="8" fill="${c1}" opacity=".8"/>
        <ellipse cx="${cx}" cy="${cy-52}" rx="18" ry="8" fill="${c2}" opacity=".9"/>
        <line x1="${cx}" y1="${cy-65}" x2="${cx}" y2="${cy-78}" stroke="${c3}" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="${cx}" cy="${cy-80}" rx="6" ry="9" fill="${c3}"/>`;

    case 9: // كباب / مشوي
      return `
        <rect x="${cx-62}" y="${cy-6}" width="124" height="12" rx="6" fill="${c2}" opacity=".6"/>
        <circle cx="${cx-42}" cy="${cy}" r="14" fill="${c1}" opacity=".9"/>
        <circle cx="${cx-14}" cy="${cy}" r="13" fill="${c3}" opacity=".85"/>
        <circle cx="${cx+14}" cy="${cy}" r="14" fill="${c1}" opacity=".9"/>
        <circle cx="${cx+42}" cy="${cy}" r="13" fill="${c3}" opacity=".85"/>
        <circle cx="${cx-42}" cy="${cy}" r="7" fill="${c2}" opacity=".6"/>
        <circle cx="${cx-14}" cy="${cy}" r="6" fill="${c2}" opacity=".6"/>
        <circle cx="${cx+14}" cy="${cy}" r="7" fill="${c2}" opacity=".6"/>
        <circle cx="${cx+42}" cy="${cy}" r="6" fill="${c2}" opacity=".6"/>
        <ellipse cx="${cx}" cy="${cy+22}" rx="60" ry="10" fill="${c2}" opacity=".2"/>`;

    case 10: // سلطة في طبق
      return `
        <circle cx="${cx}" cy="${cy+5}" r="60" fill="${c1}" opacity=".12"/>
        <circle cx="${cx}" cy="${cy+5}" r="52" fill="${c2}" opacity=".9"/>
        <circle cx="${cx}" cy="${cy+5}" r="42" fill="${c1}" opacity=".7"/>
        <circle cx="${cx-18}" cy="${cy-10}" r="13" fill="#4ade80" opacity=".9"/>
        <circle cx="${cx+20}" cy="${cy-8}" r="11" fill="#ef4444" opacity=".9"/>
        <circle cx="${cx+5}" cy="${cy+18}" r="14" fill="#fde047" opacity=".85"/>
        <circle cx="${cx-20}" cy="${cy+14}" r="10" fill="#fb923c" opacity=".85"/>
        <circle cx="${cx+28}" cy="${cy+12}" r="9" fill="#86efac" opacity=".8"/>
        <circle cx="${cx-5}" cy="${cy-22}" r="8" fill="white" opacity=".6"/>`;

    case 11: // خبز تقليدي
      return `
        <ellipse cx="${cx}" cy="${cy+5}" rx="68" ry="36" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+5}" rx="56" ry="26" fill="${c2}" opacity=".4"/>
        <path d="M${cx-50} ${cy+2} Q${cx-30} ${cy-22} ${cx} ${cy-25} Q${cx+30} ${cy-22} ${cx+50} ${cy+2}" stroke="${c3}" stroke-width="3" fill="none" opacity=".7"/>
        <path d="M${cx-30} ${cy+12} Q${cx} ${cy} ${cx+30} ${cy+12}" stroke="${c3}" stroke-width="2.5" fill="none" opacity=".5"/>
        <circle cx="${cx-25}" cy="${cy+12}" r="5" fill="${c3}" opacity=".6"/>
        <circle cx="${cx+25}" cy="${cy+12}" r="5" fill="${c3}" opacity=".6"/>
        <circle cx="${cx}" cy="${cy+15}" r="4" fill="${c3}" opacity=".5"/>
        <ellipse cx="${cx}" cy="${cy+30}" rx="55" ry="12" fill="${c2}" opacity=".3"/>`;

    case 12: // أيس كريم
      return `
        <polygon points="${cx},${cy+68} ${cx-30},${cy+14} ${cx+30},${cy+14}" fill="${c2}" opacity=".9"/>
        <rect x="${cx-30}" y="${cy-20}" width="60" height="36" rx="6" fill="${c3}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy-20}" rx="30" ry="22" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy-28}" rx="20" ry="14" fill="${c2}" opacity=".6"/>
        <circle cx="${cx-10}" cy="${cy-15}" r="6" fill="${c3}" opacity=".7"/>
        <circle cx="${cx+12}" cy="${cy-18}" r="5" fill="${c3}" opacity=".7"/>
        <ellipse cx="${cx+8}" cy="${cy-25}" rx="4" ry="3" fill="white" opacity=".5"/>`;

    case 13: // كسكس
      return `
        <ellipse cx="${cx}" cy="${cy+25}" rx="62" ry="20" fill="${c2}" opacity=".4"/>
        <ellipse cx="${cx}" cy="${cy+8}" rx="58" ry="44" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy-5}" rx="44" ry="30" fill="${c2}" opacity=".5"/>
        <circle cx="${cx-20}" cy="${cy-8}" r="7" fill="${c3}" opacity=".85"/>
        <circle cx="${cx+20}" cy="${cy-6}" r="7" fill="${c3}" opacity=".85"/>
        <circle cx="${cx}" cy="${cy+8}" r="8" fill="${c3}" opacity=".8"/>
        <circle cx="${cx-35}" cy="${cy+5}" r="5" fill="${c3}" opacity=".65"/>
        <circle cx="${cx+35}" cy="${cy+7}" r="5" fill="${c3}" opacity=".65"/>
        <circle cx="${cx+10}" cy="${cy-22}" r="4" fill="${c3}" opacity=".6"/>`;

    case 14: // شوكولاتة
      return `
        <rect x="${cx-56}" y="${cx-30}" width="112" height="56" rx="12" fill="${c1}" opacity=".9"/>
        <rect x="${cx-56}" y="${cy-30}" width="112" height="56" rx="12" fill="${c1}" opacity=".9"/>
        <line x1="${cx-56}" y1="${cy-2}" x2="${cx+56}" y2="${cy-2}" stroke="${c2}" stroke-width="2" opacity=".5"/>
        <line x1="${cx-18}" y1="${cy-30}" x2="${cx-18}" y2="${cy+26}" stroke="${c2}" stroke-width="2" opacity=".5"/>
        <line x1="${cx+18}" y1="${cy-30}" x2="${cx+18}" y2="${cy+26}" stroke="${c2}" stroke-width="2" opacity=".5"/>
        <rect x="${cx-50}" y="${cy-24}" width="30" height="20" rx="5" fill="${c2}" opacity=".3"/>
        <rect x="${cx-16}" y="${cy-24}" width="32" height="20" rx="5" fill="${c3}" opacity=".3"/>
        <rect x="${cx+20}" y="${cy-24}" width="30" height="20" rx="5" fill="${c2}" opacity=".3"/>
        <rect x="${cx-50}" y="${cy+6}" width="30" height="18" rx="5" fill="${c3}" opacity=".3"/>
        <rect x="${cx-16}" y="${cy+6}" width="32" height="18" rx="5" fill="${c2}" opacity=".3"/>
        <rect x="${cx+20}" y="${cy+6}" width="30" height="18" rx="5" fill="${c3}" opacity=".3"/>`;

    case 15: // سمكة مشوية
      return `
        <ellipse cx="${cx-5}" cy="${cy}" rx="58" ry="30" fill="${c1}" opacity=".9"/>
        <path d="M${cx+53} ${cy} L${cx+75} ${cy-22} L${cx+82} ${cy} L${cx+75} ${cy+22}Z" fill="${c1}" opacity=".85"/>
        <circle cx="${cx-30}" cy="${cy-6}" r="8" fill="${c2}"/>
        <circle cx="${cx-33}" cy="${cy-8}" r="4" fill="white" opacity=".9"/>
        <path d="M${cx-12} ${cy-22} Q${cx+18} ${cy+2} ${cx-12} ${cy+22}" stroke="${c2}" stroke-width="2" fill="none"/>
        <path d="M${cx+8} ${cy-18} Q${cx+32} ${cy} ${cx+8} ${cy+18}" stroke="${c2}" stroke-width="2" fill="none"/>
        <ellipse cx="${cx}" cy="${cy+40}" rx="52" ry="10" fill="${c3}" opacity=".25"/>`;

    case 16: // فلافل كرات
      return `
        <circle cx="${cx}" cy="${cy-18}" r="22" fill="${c1}" opacity=".9"/>
        <circle cx="${cx-28}" cy="${cy+14}" r="20" fill="${c1}" opacity=".9"/>
        <circle cx="${cx+28}" cy="${cy+14}" r="20" fill="${c1}" opacity=".9"/>
        <circle cx="${cx}" cy="${cy-18}" r="13" fill="${c2}" opacity=".6"/>
        <circle cx="${cx-28}" cy="${cy+14}" r="12" fill="${c2}" opacity=".6"/>
        <circle cx="${cx+28}" cy="${cy+14}" r="12" fill="${c2}" opacity=".6"/>
        <circle cx="${cx}" cy="${cy-20}" r="5" fill="${c3}" opacity=".7"/>
        <circle cx="${cx-30}" cy="${cy+12}" r="5" fill="${c3}" opacity=".7"/>
        <circle cx="${cx+30}" cy="${cy+12}" r="5" fill="${c3}" opacity=".7"/>
        <ellipse cx="${cx}" cy="${cy+40}" rx="56" ry="10" fill="${c2}" opacity=".2"/>`;

    case 17: // باستا في طبق
      return `
        <circle cx="${cx}" cy="${cy+5}" r="56" fill="${c1}" opacity=".9"/>
        <circle cx="${cx}" cy="${cy+5}" r="44" fill="${c2}" opacity=".35"/>
        <path d="M${cx-38} ${cy-8} Q${cx-20} ${cy+12} ${cx-5} ${cy-5} Q${cx+12} ${cy-20} ${cx+28} ${cy-5} Q${cx+42} ${cy+8} ${cx+38} ${cy-8}" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M${cx-30} ${cy+8} Q${cx-14} ${cy-6} ${cx+8} ${cy+8} Q${cx+22} ${cy+18} ${cx+36} ${cy+5}" stroke="${c3}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M${cx-35} ${cy+20} Q${cx-15} ${cy+6} ${cx+10} ${cy+20}" stroke="${c2}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/>
        <circle cx="${cx}" cy="${cy-10}" r="9" fill="${c3}" opacity=".8"/>`;

    case 18: // حمص مع زيت
      return `
        <ellipse cx="${cx}" cy="${cy+15}" rx="62" ry="34" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx-8}" cy="${cy+8}" rx="46" ry="26" fill="${c2}" opacity=".6"/>
        <circle cx="${cx+20}" cy="${cy+18}" r="10" fill="${c3}" opacity=".8"/>
        <path d="M${cx-22} ${cy+2} Q${cx-5} ${cy+22} ${cx+18} ${cy+8}" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="${cx-18}" cy="${cy+25}" r="5" fill="${c1}" opacity=".9"/>
        <circle cx="${cx+35}" cy="${cy+22}" r="4" fill="${c1}" opacity=".9"/>
        <ellipse cx="${cx}" cy="${cy+38}" rx="50" ry="10" fill="${c2}" opacity=".25"/>`;

    default: // طبق ملكي زخرفي
      return `
        <circle cx="${cx}" cy="${cy}" r="62" fill="none" stroke="${c2}" stroke-width="3" opacity=".4"/>
        <circle cx="${cx}" cy="${cy}" r="54" fill="${c1}" opacity=".9"/>
        <circle cx="${cx}" cy="${cy}" r="40" fill="${c2}" opacity=".55"/>
        <circle cx="${cx}" cy="${cy}" r="28" fill="${c1}" opacity=".7"/>
        <polygon points="${cx},${cy-22} ${cx+7},${cy-7} ${cx+24},${cy-7} ${cx+11},${cy+4} ${cx+16},${cy+22} ${cx},${cy+13} ${cx-16},${cy+22} ${cx-11},${cy+4} ${cx-24},${cy-7} ${cx-7},${cy-7}" fill="${c3}" opacity=".9"/>
        <circle cx="${cx}" cy="${cy}" r="8" fill="${c2}"/>`;
  }
}

/**
 * توليد خلفية SVG احترافية
 */
function makeBg(seed, pal) {
  const { bg: [col1, col2] } = pal;
  const W = 480, H = 320;
  const r1x = 80 + (seed % 120);
  const r1y = 50 + ((seed >> 3) % 80);
  const r2x = 320 + ((seed >> 5) % 120);
  const r2y = 220 + ((seed >> 7) % 80);
  const c1 = pal.main;
  const c2 = pal.accent;
  return `<defs>
    <linearGradient id="gbg${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${col1}"/>
      <stop offset="100%" stop-color="${col2}"/>
    </linearGradient>
    <filter id="gblur${seed}"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="gblur2${seed}"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#gbg${seed})"/>
  <circle cx="${r1x}" cy="${r1y}" r="130" fill="${c1}" opacity=".12" filter="url(#gblur${seed})"/>
  <circle cx="${r2x}" cy="${r2y}" r="110" fill="${c2}" opacity=".1" filter="url(#gblur${seed})"/>
  <circle cx="${W/2}" cy="${H/2}" r="90" fill="${pal.hi}" opacity=".06" filter="url(#gblur2${seed})"/>`;
}

/**
 * توليد صورة SVG كاملة لكل وجبة
 */
function generateFoodSVG(recipe, countryCode, recipeIndex) {
  const W = 480, H = 320;
  const key = (recipe.id || '') + countryCode + recipeIndex;
  const seed = hashSeed(key + (recipe.title_en || ''));
  const palIdx = seed % PALETTES.length;
  const pal = PALETTES[palIdx];

  const bg = makeBg(seed, pal);
  const cx = W / 2;
  const cy = H / 2 - 18;
  const art = drawFoodArt(seed, cx, cy, pal);

  // حساب نص العنوان (اقتصاره إن كان طويلاً)
  const labelAr = (recipe.title_ar || '').slice(0, 24);
  const labelEn = (recipe.title_en || '').slice(0, 28);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${bg}

  <!-- Food Art -->
  <g transform="translate(0,0)">${art}</g>

  <!-- Bottom bar -->
  <rect x="0" y="${H-64}" width="${W}" height="64" fill="rgba(0,0,0,0.7)"/>
  <rect x="0" y="${H-64}" width="${W}" height="1" fill="${pal.main}" opacity="0.5"/>

  <!-- Texts -->
  <text x="${W/2}" y="${H-38}" fill="white" font-size="17" font-weight="700"
    text-anchor="middle" font-family="Tajawal,Segoe UI,Arial"
    dominant-baseline="middle">${escXML(labelAr)}</text>
  <text x="${W/2}" y="${H-16}" fill="${pal.accent}" font-size="11.5"
    text-anchor="middle" font-family="Segoe UI,Arial"
    dominant-baseline="middle" opacity="0.85">${escXML(labelEn)}</text>

  <!-- Top-right badge -->
  <rect x="${W-70}" y="10" width="58" height="22" rx="11" fill="${pal.main}" opacity="0.2"/>
  <rect x="${W-70}" y="10" width="58" height="22" rx="11" fill="none" stroke="${pal.main}" stroke-width="1" opacity="0.4"/>
  <text x="${W-41}" y="21" fill="${pal.hi}" font-size="9.5" font-weight="600"
    text-anchor="middle" font-family="Segoe UI,Arial" dominant-baseline="middle">${escXML(countryCode)}</text>
</svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function escXML(s) {
  return String(s || '').replace(/[<>&'"]/g, c =>
    ({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' }[c]));
}

/* ══════════════════════════════════════════════
   Theme
   ══════════════════════════════════════════════ */
function setTheme(light) {
  document.body.classList.toggle('light', light);
  EL.themeIco.textContent = light ? '☀️' : '🌙';
  localStorage.setItem('wfTheme', light ? 'light' : 'dark');
}
function loadTheme() { setTheme(localStorage.getItem('wfTheme') === 'light'); }

/* ══════════════════════════════════════════════
   Toast
   ══════════════════════════════════════════════ */
let _tTimer;
function toast(msg, ms = 2800) {
  clearTimeout(_tTimer);
  EL.toast.textContent = msg;
  EL.toast.classList.remove('hidden');
  _tTimer = setTimeout(() => EL.toast.classList.add('hidden'), ms);
}

/* ══════════════════════════════════════════════
   Particles
   ══════════════════════════════════════════════ */
function spawnParticles() {
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'ptcl';
    const sz = Math.random() * 80 + 24;
    const colors = [
      'rgba(124,156,255,.12)', 'rgba(66,223,200,.10)',
      'rgba(255,140,105,.08)', 'rgba(199,125,255,.10)'
    ];
    p.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background: radial-gradient(circle, ${colors[i%4]}, transparent 70%);
      --dur:${Math.random()*20+14}s;
      --dly:${Math.random()*-20}s;`;
    EL.particles.appendChild(p);
  }
}

/* ══════════════════════════════════════════════
   Counter animation
   ══════════════════════════════════════════════ */
function animCount(el, target, dur = 1500) {
  const start = performance.now();
  (function frame(now) {
    const t = Math.min((now - start) / dur, 1);
    const v = Math.round(target * (1 - Math.pow(1 - t, 3)));
    el.textContent = v.toLocaleString('ar-EG');
    if (t < 1) requestAnimationFrame(frame);
  })(start);
}

/* ══════════════════════════════════════════════
   Build Sidebar
   ══════════════════════════════════════════════ */
function buildSidebar() {
  const rc = {};
  S.countries.forEach(c => {
    rc[c.region || 'Other'] = (rc[c.region || 'Other'] || 0) + 1;
  });

  EL.regionList.innerHTML = '';
  const mkRBtn = (label, val, count) => {
    const b = document.createElement('button');
    b.className = 'rbtn' + (val === '' ? ' on' : '');
    b.innerHTML = `<span>${label}</span><span class="rbtn-count">${count}</span>`;
    b.addEventListener('click', () => {
      document.querySelectorAll('.rbtn').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      EL.regionFilter.value = val;
      filterAndRender();
    });
    return b;
  };
  EL.regionList.appendChild(mkRBtn('🌐 كل المناطق', '', S.countries.length));

  const regionEmoji = {
    Asia: '🌏', Europe: '🌍', Africa: '🌍',
    Americas: '🌎', Oceania: '🏝️',
    'North America': '🌎', 'South America': '🌎'
  };
  Object.entries(rc).sort((a, b) => b[1] - a[1]).forEach(([r, n]) => {
    EL.regionList.appendChild(mkRBtn(`${regionEmoji[r] || '🗺️'} ${r}`, r, n));
  });

  // Popular
  const pop = [...S.countries].sort((a, b) => b.recipes.length - a.recipes.length).slice(0, 6);
  EL.popularList.innerHTML = '';
  pop.forEach(c => {
    const d = document.createElement('div');
    d.className = 'pop-item';
    d.innerHTML = `
      <div class="pop-flag">${c.flag}</div>
      <div class="pop-info">
        <div class="pop-name">${c.name_ar}</div>
        <div class="pop-cnt">${c.recipes.length} وصفة</div>
      </div>`;
    d.addEventListener('click', () => openModal(c.code));
    EL.popularList.appendChild(d);
  });
}

/* ══════════════════════════════════════════════
   Build Region Filter Options
   ══════════════════════════════════════════════ */
function buildRegionOptions() {
  const regions = [...new Set(S.countries.map(c => c.region).filter(Boolean))].sort();
  regions.forEach(r => {
    const o = document.createElement('option');
    o.value = r; o.textContent = r;
    EL.regionFilter.appendChild(o);
  });
}

/* ══════════════════════════════════════════════
   Filter & Sort
   ══════════════════════════════════════════════ */
function filterAndRender() {
  const q      = EL.searchInput.value.trim().toLowerCase();
  const region = EL.regionFilter.value;
  const sort   = EL.sortSelect.value;

  EL.searchClear.classList.toggle('show', q.length > 0);

  S.filtered = S.countries.filter(c => {
    const txt = `${c.name_ar} ${c.name_en} ${c.code} ${c.region} ${c.capital}`.toLowerCase();
    const ok1 = !q || txt.includes(q) ||
      c.recipes.some(r => r.title_ar.toLowerCase().includes(q) || r.title_en.toLowerCase().includes(q));
    const ok2 = !region || c.region === region;
    return ok1 && ok2;
  });

  if (sort === 'recipes') {
    S.filtered.sort((a, b) => b.recipes.length - a.recipes.length);
  } else if (sort === 'region') {
    S.filtered.sort((a, b) => (a.region || '').localeCompare(b.region || ''));
  } else {
    S.filtered.sort((a, b) => a.name_ar.localeCompare(b.name_ar));
  }

  S.page = 0;
  renderGrid(false);
}

/* ══════════════════════════════════════════════
   Render Grid
   ══════════════════════════════════════════════ */
function renderGrid(append) {
  if (!append) EL.grid.innerHTML = '';

  const start = S.page * S.pageSize;
  const end   = start + S.pageSize;
  const slice = S.filtered.slice(start, end);

  if (!append && S.filtered.length === 0) {
    EL.grid.innerHTML = `<div class="no-results">
      <div class="no-results-ico">🔍</div>
      <h3>لا توجد نتائج</h3>
      <p>حاول البحث بكلمة مختلفة</p>
    </div>`;
    EL.lmWrap.style.display = 'none';
    EL.resultsText.innerHTML = 'لا توجد نتائج';
    return;
  }

  slice.forEach((c, i) => {
    const card = buildCard(c);
    card.style.animationDelay = `${(i % S.pageSize) * 0.03}s`;
    EL.grid.appendChild(card);
  });

  const shown = Math.min(end, S.filtered.length);
  EL.resultsText.innerHTML =
    `يعرض <strong>${shown.toLocaleString('ar-EG')}</strong> من <strong>${S.filtered.length.toLocaleString('ar-EG')}</strong> دولة`;
  EL.lmWrap.style.display = end < S.filtered.length ? 'flex' : 'none';
}

/* ══════════════════════════════════════════════
   Build Card
   ══════════════════════════════════════════════ */
function buildCard(c) {
  const n = EL.tpl.content.firstElementChild.cloneNode(true);
  n.querySelector('.ccard-flag-bg').textContent = c.flag;
  n.querySelector('.ccard-flag-sm').textContent = c.flag;
  n.querySelector('.ccard-name').textContent = c.name_ar;
  n.querySelector('.ccard-name-en').textContent = c.name_en;
  n.querySelector('.ccard-region').textContent = `🗺️ ${c.region}${c.subregion ? ' • ' + c.subregion : ''}`;
  n.querySelector('.ccard-summary').textContent = c.summary_ar || `مطبخ ${c.name_ar}`;

  const tags = n.querySelector('.ccard-tags');
  [`🏛️ ${c.capital || '—'}`, `📖 ${c.recipes.length} وصفة`].forEach((t, i) => {
    const s = document.createElement('span');
    s.className = 'tag' + (i === 1 ? ' hi' : '');
    s.textContent = t;
    tags.appendChild(s);
  });

  n.querySelector('.ccard-btn-cnt').textContent = c.recipes.length;

  const open = () => openModal(c.code);
  n.querySelector('.ccard-btn').addEventListener('click', open);
  n.querySelector('.ccard-open-btn').addEventListener('click', open);
  return n;
}

/* ══════════════════════════════════════════════
   Difficulty helper
   ══════════════════════════════════════════════ */
function diffClass(d) {
  if (!d) return 'easy';
  if (d.includes('سهل')) return 'easy';
  if (d.includes('متوسط')) return 'med';
  return 'hard';
}

/* ══════════════════════════════════════════════
   Open Country Modal
   ══════════════════════════════════════════════ */
function openModal(code) {
  const c = S.countries.find(x => x.code === code);
  if (!c) return;

  const recipesHTML = c.recipes.map((r, idx) => {
    const imgSrc = generateFoodSVG(r, c.code, idx);
    const dc = diffClass(r.difficulty);
    return `
    <div class="rcard" style="animation-delay:${idx * 0.05}s">
      <div class="rcard-img">
        <img class="rcard-cover" src="${imgSrc}" alt="${escXML(r.title_ar)}" loading="lazy"/>
        <div class="rcard-badges">
          <span class="diff-badge ${dc}">${r.difficulty || 'سهل'}</span>
          <span class="time-badge">⏱ ${r.time_minutes} د</span>
        </div>
      </div>
      <div class="rcard-body">
        <div class="rcard-title">${escXML(r.title_ar)}</div>
        <div class="rcard-title-en">${escXML(r.title_en)}</div>
        <div class="rcard-desc">${escXML(r.description_ar)}</div>
        <div class="rcard-stats">
          <span class="rstat">⏱ ${r.time_minutes} دقيقة</span>
          <span class="rstat">👥 ${r.servings} حصص</span>
          <span class="rstat">📊 ${r.difficulty || 'سهل'}</span>
        </div>
        <div class="rcard-cols">
          <div class="rcol">
            <h5>🛒 المكوّنات</h5>
            <ul>${r.ingredients.map(i => `<li>${escXML(i)}</li>`).join('')}</ul>
          </div>
          <div class="rcol">
            <h5>👨‍🍳 التحضير</h5>
            <ol>${r.steps.map(s => `<li>${escXML(s)}</li>`).join('')}</ol>
          </div>
        </div>
        <div class="rcard-links">
          <a class="rlink" href="${r.links.youtube}" target="_blank" rel="noopener">▶️ يوتيوب</a>
          <a class="rlink" href="${r.links.google}" target="_blank" rel="noopener">🔍 بحث</a>
          <a class="rlink" href="${r.links.wikipedia}" target="_blank" rel="noopener">📚 ويكي</a>
        </div>
      </div>
    </div>`;
  }).join('');

  EL.modalContent.innerHTML = `
    <div class="mhero">
      <div class="mhero-bg">${c.flag}</div>
      <div class="mhero-row">
        <div class="mhero-flag">${c.flag}</div>
        <div class="mhero-info">
          <div class="mhero-name">${c.name_ar}</div>
          <div class="mhero-sub">${c.name_en}</div>
          <div class="mhero-tags">
            <span class="mtag prim">🏛️ ${c.capital || '—'}</span>
            <span class="mtag">🌐 ${c.region}</span>
            ${c.subregion ? `<span class="mtag">📍 ${c.subregion}</span>` : ''}
            <span class="mtag prim">📖 ${c.recipes.length} وصفة</span>
          </div>
        </div>
      </div>
      <div class="mhero-links">
        <a class="mlink prim" href="${c.search_links.google}" target="_blank" rel="noopener">🔍 أكلات ${c.name_ar}</a>
        <a class="mlink" href="${c.search_links.youtube}" target="_blank" rel="noopener">▶️ يوتيوب</a>
        <a class="mlink" href="${c.search_links.wikipedia}" target="_blank" rel="noopener">📚 ويكيبيديا</a>
      </div>
    </div>
    <div class="mbody">
      <div class="msec-title">
        <div class="msec-ico">🍽️</div>
        الوصفات التقليدية
        <span class="msec-cnt">${c.recipes.length} وصفة</span>
      </div>
      <div class="recipe-grid">${recipesHTML}</div>
    </div>`;

  EL.modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  EL.modal.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */
async function init() {
  try {
    spawnParticles();
    loadTheme();

    const res = await fetch('./data/countries.json');
    if (!res.ok) throw new Error('fetch failed');
    S.countries = await res.json();
    S.filtered  = [...S.countries].sort((a, b) => a.name_ar.localeCompare(b.name_ar));

    buildRegionOptions();
    buildSidebar();

    // Update stats
    const total   = S.countries.length;
    const recipes = S.countries.reduce((n, c) => n + c.recipes.length, 0);
    animCount(EL.cCount, total);
    animCount(EL.rCount, recipes, 1800);
    EL.navC.textContent = total.toLocaleString('ar-EG');
    EL.navR.textContent = recipes.toLocaleString('ar-EG');

    renderGrid(false);

    // Hide preloader
    setTimeout(() => EL.preloader.classList.add('out'), 1500);

    /* ── Events ── */
    let _st;
    EL.searchInput.addEventListener('input', () => {
      clearTimeout(_st);
      _st = setTimeout(filterAndRender, 200);
    });
    EL.searchClear.addEventListener('click', () => {
      EL.searchInput.value = '';
      EL.searchClear.classList.remove('show');
      filterAndRender();
    });
    EL.regionFilter.addEventListener('change', filterAndRender);
    EL.sortSelect.addEventListener('change', filterAndRender);

    EL.gridBtn.addEventListener('click', () => {
      S.view = 'grid';
      EL.grid.classList.remove('list-view');
      EL.gridBtn.classList.add('on');
      EL.listBtn.classList.remove('on');
    });
    EL.listBtn.addEventListener('click', () => {
      S.view = 'list';
      EL.grid.classList.add('list-view');
      EL.listBtn.classList.add('on');
      EL.gridBtn.classList.remove('on');
    });

    EL.lmBtn.addEventListener('click', () => {
      EL.lmBtn.classList.add('loading');
      setTimeout(() => {
        S.page++;
        renderGrid(true);
        EL.lmBtn.classList.remove('loading');
      }, 500);
    });

    const doRandom = () => {
      const pool = S.filtered.length ? S.filtered : S.countries;
      const item = pool[Math.floor(Math.random() * pool.length)];
      openModal(item.code);
      toast(`🎲 ${item.name_ar}`);
    };
    EL.randomBtn.addEventListener('click', doRandom);

    EL.themeBtn.addEventListener('click', () => {
      const isLight = !document.body.classList.contains('light');
      setTheme(isLight);
      toast(isLight ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي');
    });

    EL.modalClose.addEventListener('click', closeModal);
    EL.modalBd.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        EL.searchInput.focus();
      }
    });

    window.addEventListener('scroll', () => {
      EL.navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

  } catch (err) {
    console.error(err);
    EL.resultsText.textContent = '❌ تعذّر تحميل البيانات';
    EL.preloader.classList.add('out');
  }
}

init();
