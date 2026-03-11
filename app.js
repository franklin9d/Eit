'use strict';

/* ══════════════════════════════════════════════
   موسوعة أكلات العالم — app.js
   صورة SVG فريدة لكل وجبة بدون تكرار
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

/* ══════════════════════════════════════════
   🎨 SVG FOOD IMAGE GENERATOR
   كل وجبة تحصل على صورة SVG فريدة تمامًا
   بناءً على اسمها + كود الدولة + رقم الوصفة
   ══════════════════════════════════════════ */

// 40 لوحة لون متنوعة
const PALETTES = [
  ['#ff6b6b','#ffd93d','#6bcb77'],   ['#4d96ff','#ff6b6b','#ffd93d'],
  ['#845ec2','#ff6f91','#ffc75f'],   ['#00c9a7','#4d96ff','#ffd93d'],
  ['#f9c74f','#f8961e','#f3722c'],   ['#90be6d','#43aa8b','#4d908e'],
  ['#c77dff','#7b2d8b','#ffd166'],   ['#ef233c','#d90429','#ffd166'],
  ['#06d6a0','#118ab2','#ffd166'],   ['#fb5607','#ff006e','#8338ec'],
  ['#2ec4b6','#e71d36','#ff9f1c'],   ['#7678ed','#f7b731','#3d405b'],
  ['#e63946','#a8dadc','#457b9d'],   ['#f72585','#7209b7','#3a0ca3'],
  ['#52b788','#40916c','#d8f3dc'],   ['#fca311','#e5e5e5','#14213d'],
  ['#ff595e','#ffca3a','#6a4c93'],   ['#1982c4','#8ac926','#ff595e'],
  ['#e9c46a','#f4a261','#e76f51'],   ['#264653','#2a9d8f','#e9c46a'],
  ['#d62828','#f77f00','#fcbf49'],   ['#003049','#d62828','#f77f00'],
  ['#606c38','#283618','#fefae0'],   ['#bc6c25','#dda15e','#fefae0'],
  ['#48cae4','#0096c7','#023e8a'],   ['#9b2226','#ae2012','#ee9b00'],
  ['#7b4f3a','#c4a882','#f0e6d3'],   ['#b5e48c','#52b69a','#168aad'],
  ['#ff9a3c','#ff6392','#b5ead7'],   ['#c9f0ff','#4cc9f0','#4361ee'],
  ['#da627d','#a53860','#450920'],   ['#5c4033','#8b6f47','#d4a574'],
  ['#1d3461','#1f6489','#56a3a6'],   ['#ff4d6d','#c9184a','#ff758f'],
  ['#6a0572','#ab83a1','#ffd6e0'],   ['#1b4332','#2d6a4f','#95d5b2'],
  ['#780000','#c1121f','#fdf0d5'],   ['#023047','#219ebc','#ffb703'],
  ['#10002b','#240046','#c77dff'],   ['#f1faee','#a8dadc','#457b9d'],
];

// أشكال طعام SVG متنوعة (40 شكل مختلف)
function getFoodShape(idx, cx, cy, c1, c2, c3) {
  const shapes = [
    // 0 - وعاء بخار
    `<circle cx="${cx}" cy="${cy+10}" r="52" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-38}" rx="38" ry="12" fill="${c2}" opacity=".7"/>
     <path d="M${cx-20} ${cy-50} Q${cx-10} ${cy-70} ${cx} ${cy-50}" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/>
     <path d="M${cx} ${cy-50} Q${cx+10} ${cy-70} ${cx+20} ${cy-50}" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/>
     <ellipse cx="${cx}" cy="${cy+10}" rx="38" ry="18" fill="${c2}" opacity=".5"/>`,

    // 1 - طبق مزخرف
    `<circle cx="${cx}" cy="${cy}" r="60" fill="${c1}" opacity=".15"/>
     <circle cx="${cx}" cy="${cy}" r="48" fill="${c2}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="35" fill="${c1}" opacity=".6"/>
     <circle cx="${cx}" cy="${cy}" r="22" fill="${c3}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="10" fill="${c1}"/>`,

    // 2 - شواية لحم
    `<rect x="${cx-45}" y="${cy-15}" width="90" height="30" rx="8" fill="${c1}" opacity=".9"/>
     <rect x="${cx-35}" y="${cy-25}" width="12" height="50" rx="4" fill="${c2}"/>
     <rect x="${cx-10}" y="${cy-28}" width="12" height="55" rx="4" fill="${c2}"/>
     <rect x="${cx+15}" y="${cy-22}" width="12" height="48" rx="4" fill="${c2}"/>
     <ellipse cx="${cx}" cy="${cy+20}" rx="50" ry="8" fill="${c3}" opacity=".4"/>`,

    // 3 - كوب شاي/قهوة
    `<rect x="${cx-30}" y="${cy-30}" width="60" height="60" rx="10" fill="${c1}" opacity=".9"/>
     <path d="M${cx+30} ${cy-15} Q${cx+50} ${cy} ${cx+30} ${cy+15}" stroke="${c2}" stroke-width="4" fill="none"/>
     <ellipse cx="${cx}" cy="${cy-30}" rx="30" ry="8" fill="${c3}" opacity=".7"/>
     <path d="M${cx-15} ${cy-50} Q${cx} ${cy-65} ${cx+15} ${cy-50}" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/>`,

    // 4 - سلة خبز
    `<ellipse cx="${cx}" cy="${cy+20}" rx="55" ry="20" fill="${c3}" opacity=".6"/>
     <path d="M${cx-50} ${cy+20} Q${cx-50} ${cy-30} ${cx} ${cy-40} Q${cx+50} ${cy-30} ${cx+50} ${cy+20}" fill="${c1}" opacity=".9"/>
     <path d="M${cx-30} ${cy} Q${cx} ${cy-20} ${cx+30} ${cy}" stroke="${c2}" stroke-width="3" fill="none"/>
     <path d="M${cx-20} ${cy+10} Q${cx} ${cy-5} ${cx+20} ${cy+10}" stroke="${c2}" stroke-width="2" fill="none"/>`,

    // 5 - بيتزا
    `<circle cx="${cx}" cy="${cy}" r="55" fill="${c3}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="45" fill="${c1}" opacity=".9"/>
     <circle cx="${cx-15}" cy="${cy-10}" r="7" fill="${c2}"/>
     <circle cx="${cx+18}" cy="${cy-15}" r="6" fill="${c2}"/>
     <circle cx="${cx+5}" cy="${cy+18}" r="8" fill="${c2}"/>
     <circle cx="${cx-20}" cy="${cy+15}" r="5" fill="${c2}"/>
     <path d="M${cx} ${cy-55} L${cx+52} ${cy+28} L${cx-52} ${cy+28} Z" fill="none" stroke="${c3}" stroke-width="1.5" opacity=".5"/>`,

    // 6 - رامن/نودلز
    `<circle cx="${cx}" cy="${cy}" r="52" fill="${c1}" opacity=".9"/>
     <path d="M${cx-35} ${cy} Q${cx-20} ${cy-20} ${cx} ${cy} Q${cx+20} ${cy+20} ${cx+35} ${cy}" stroke="${c2}" stroke-width="4" fill="none"/>
     <path d="M${cx-35} ${cy+10} Q${cx-15} ${cy-15} ${cx+10} ${cy+5} Q${cx+25} ${cy+18} ${cx+35} ${cy+8}" stroke="${c3}" stroke-width="3" fill="none"/>
     <ellipse cx="${cx}" cy="${cy+35}" rx="40" ry="10" fill="${c2}" opacity=".5"/>`,

    // 7 - سمكة
    `<ellipse cx="${cx}" cy="${cy}" rx="55" ry="28" fill="${c1}" opacity=".9"/>
     <path d="M${cx+55} ${cy} L${cx+75} ${cy-20} L${cx+75} ${cy+20} Z" fill="${c1}" opacity=".9"/>
     <circle cx="${cx-25}" cy="${cy-5}" r="6" fill="${c2}"/>
     <path d="M${cx-10} ${cy-18} Q${cx+20} ${cy} ${cx-10} ${cy+18}" stroke="${c2}" stroke-width="2.5" fill="none"/>
     <path d="M${cx-30} ${cy-15} Q${cx} ${cy+5} ${cx-30} ${cy+15}" stroke="${c3}" stroke-width="2" fill="none"/>`,

    // 8 - برجر
    `<ellipse cx="${cx}" cy="${cy-25}" rx="48" ry="22" fill="${c1}" opacity=".9"/>
     <rect x="${cx-42}" y="${cy-12}" width="84" height="14" fill="${c3}" opacity=".9"/>
     <rect x="${cx-40}" y="${cy+2}" width="80" height="12" fill="${c2}" opacity=".8"/>
     <ellipse cx="${cx}" cy="${cy+20}" rx="44" ry="16" fill="${c1}" opacity=".8"/>`,

    // 9 - أرز في طنجرة
    `<ellipse cx="${cx}" cy="${cy+25}" rx="52" ry="18" fill="${c3}" opacity=".6"/>
     <rect x="${cx-48}" y="${cy-25}" width="96" height="50" rx="14" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-25}" rx="48" ry="14" fill="${c2}" opacity=".8"/>
     <circle cx="${cx-15}" cy="${cy-5}" r="7" fill="${c3}" opacity=".7"/>
     <circle cx="${cx+15}" cy="${cy+5}" r="6" fill="${c3}" opacity=".7"/>
     <circle cx="${cx}" cy="${cy-12}" r="8" fill="${c3}" opacity=".7"/>`,

    // 10 - سلطة في وعاء
    `<circle cx="${cx}" cy="${cy}" r="52" fill="${c1}" opacity=".9"/>
     <circle cx="${cx-20}" cy="${cy-15}" r="12" fill="${c2}" opacity=".85"/>
     <circle cx="${cx+18}" cy="${cy-10}" r="10" fill="${c3}" opacity=".85"/>
     <circle cx="${cx+5}" cy="${cy+18}" r="13" fill="${c2}" opacity=".75"/>
     <circle cx="${cx-18}" cy="${cy+12}" r="9" fill="${c3}" opacity=".8"/>
     <circle cx="${cx}" cy="${cy-5}" r="8" fill="white" opacity=".5"/>`,

    // 11 - كعك/حلويات
    `<rect x="${cx-40}" y="${cy+5}" width="80" height="30" rx="8" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy+5}" rx="40" ry="12" fill="${c2}" opacity=".9"/>
     <rect x="${cx-20}" y="${cy-25}" width="40" height="30" rx="8" fill="${c1}" opacity=".85"/>
     <ellipse cx="${cx}" cy="${cy-25}" rx="20" ry="8" fill="${c3}" opacity=".9"/>
     <line x1="${cx}" y1="${cy-40}" x2="${cx}" y2="${cy-55}" stroke="${c2}" stroke-width="3"/>
     <circle cx="${cx}" cy="${cy-57}" r="5" fill="${c3}"/>`,

    // 12 - فطيرة مثلثة
    `<polygon points="${cx},${cy-55} ${cx+55},${cy+35} ${cx-55},${cy+35}" fill="${c1}" opacity=".9"/>
     <polygon points="${cx},${cy-40} ${cx+40},${cy+28} ${cx-40},${cy+28}" fill="${c2}" opacity=".7"/>
     <circle cx="${cx}" cy="${cy-15}" r="8" fill="${c3}"/>
     <circle cx="${cx-18}" cy="${cy+12}" r="6" fill="${c3}"/>
     <circle cx="${cx+18}" cy="${cy+12}" r="6" fill="${c3}"/>`,

    // 13 - طاجين
    `<ellipse cx="${cx}" cy="${cy+25}" rx="55" ry="16" fill="${c3}" opacity=".7"/>
     <ellipse cx="${cx}" cy="${cy+5}" rx="52" ry="20" fill="${c1}" opacity=".9"/>
     <path d="M${cx-30} ${cy+5} Q${cx} ${cy-60} ${cx+30} ${cy+5}" fill="${c2}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy+5}" rx="30" ry="10" fill="${c1}" opacity=".5"/>`,

    // 14 - سوشي رول
    `<circle cx="${cx}" cy="${cy}" r="50" fill="${c3}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="36" fill="white" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="22" fill="${c1}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="10" fill="${c2}" opacity=".9"/>
     <rect x="${cx-2}" y="${cy-50}" width="4" height="100" fill="rgba(0,0,0,.08)" rx="2"/>
     <rect x="${cx-50}" y="${cy-2}" width="100" height="4" fill="rgba(0,0,0,.08)" rx="2"/>`,

    // 15 - أيس كريم
    `<polygon points="${cx},${cy+60} ${cx-28},${cy+10} ${cx+28},${cy+10}" fill="${c3}" opacity=".9"/>
     <rect x="${cx-28}" y="${cy-20}" width="56" height="32" rx="6" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-20}" rx="28" ry="18" fill="${c2}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-28}" rx="18" ry="12" fill="${c1}" opacity=".7"/>
     <circle cx="${cx-8}" cy="${cy-15}" r="5" fill="${c3}" opacity=".8"/>
     <circle cx="${cx+10}" cy="${cy-18}" r="4" fill="${c3}" opacity=".8"/>`,

    // 16 - شيش طاووق / أسياخ
    `<rect x="${cx-50}" y="${cy-5}" width="100" height="10" rx="5" fill="${c3}" opacity=".7"/>
     <circle cx="${cx-35}" cy="${cy}" r="12" fill="${c1}" opacity=".9"/>
     <circle cx="${cx-12}" cy="${cy}" r="11" fill="${c2}" opacity=".9"/>
     <circle cx="${cx+12}" cy="${cy}" r="12" fill="${c1}" opacity=".9"/>
     <circle cx="${cx+35}" cy="${cy}" r="11" fill="${c2}" opacity=".9"/>`,

    // 17 - خبز رقيق
    `<ellipse cx="${cx}" cy="${cy}" rx="60" ry="25" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy}" rx="48" ry="18" fill="${c2}" opacity=".6"/>
     <path d="M${cx-35} ${cy} Q${cx} ${cy-15} ${cx+35} ${cy}" stroke="${c3}" stroke-width="3" fill="none"/>
     <circle cx="${cx-20}" cy="${cy+5}" r="4" fill="${c3}" opacity=".6"/>
     <circle cx="${cx+20}" cy="${cy+5}" r="4" fill="${c3}" opacity=".6"/>`,

    // 18 - حساء
    `<ellipse cx="${cx}" cy="${cy+20}" rx="50" ry="16" fill="${c3}" opacity=".5"/>
     <circle cx="${cx}" cy="${cy}" r="50" fill="${c1}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="38" fill="${c2}" opacity=".7"/>
     <circle cx="${cx-15}" cy="${cy-8}" r="5" fill="${c1}" opacity=".8"/>
     <circle cx="${cx+12}" cy="${cy+5}" r="4" fill="${c1}" opacity=".8"/>
     <path d="M${cx-15} ${cy-35} Q${cx-5} ${cy-50} ${cx+5} ${cy-35}" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/>`,

    // 19 - كاري
    `<rect x="${cx-45}" y="${cy-30}" width="90" height="60" rx="16" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-30}" rx="45" ry="14" fill="${c2}" opacity=".8"/>
     <circle cx="${cx-20}" cy="${cy+5}" r="10" fill="${c3}" opacity=".8"/>
     <circle cx="${cx+20}" cy="${cy}" r="12" fill="${c3}" opacity=".75"/>
     <circle cx="${cx}" cy="${cy+15}" r="9" fill="${c3}" opacity=".8"/>`,

    // 20 - فلافل
    `<circle cx="${cx-25}" cy="${cy+10}" r="18" fill="${c1}" opacity=".9"/>
     <circle cx="${cx+25}" cy="${cy+10}" r="18" fill="${c1}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy-10}" r="20" fill="${c1}" opacity=".9"/>
     <circle cx="${cx-25}" cy="${cy+10}" r="10" fill="${c2}" opacity=".7"/>
     <circle cx="${cx+25}" cy="${cy+10}" r="10" fill="${c2}" opacity=".7"/>
     <circle cx="${cx}" cy="${cy-10}" r="12" fill="${c2}" opacity=".7"/>`,

    // 21 - تاكو
    `<path d="M${cx-55} ${cy+20} Q${cx} ${cy-50} ${cx+55} ${cy+20}" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy+20}" rx="55" ry="15" fill="${c3}" opacity=".7"/>
     <circle cx="${cx-20}" cy="${cy+5}" r="8" fill="${c2}" opacity=".8"/>
     <circle cx="${cx+20}" cy="${cy+5}" r="8" fill="${c2}" opacity=".8"/>
     <circle cx="${cx}" cy="${cy}" r="7" fill="${c3}" opacity=".8"/>`,

    // 22 - دمبلينج
    `<ellipse cx="${cx}" cy="${cy+5}" rx="50" ry="30" fill="${c1}" opacity=".9"/>
     <path d="M${cx-48} ${cy+5} Q${cx} ${cy-40} ${cx+48} ${cy+5}" fill="${c2}" opacity=".7"/>
     <path d="M${cx-30} ${cy-10} Q${cx} ${cy-25} ${cx+30} ${cy-10}" stroke="${c3}" stroke-width="3" fill="none"/>`,

    // 23 - كسكس
    `<ellipse cx="${cx}" cy="${cy+20}" rx="52" ry="18" fill="${c3}" opacity=".6"/>
     <ellipse cx="${cx}" cy="${cy}" rx="48" ry="38" fill="${c1}" opacity=".9"/>
     <circle cx="${cx-18}" cy="${cy-8}" r="6" fill="${c2}" opacity=".8"/>
     <circle cx="${cx+18}" cy="${cy-8}" r="6" fill="${c2}" opacity=".8"/>
     <circle cx="${cx}" cy="${cy+10}" r="7" fill="${c2}" opacity=".8"/>
     <circle cx="${cx-10}" cy="${cy+25}" r="5" fill="${c3}" opacity=".7"/>
     <circle cx="${cx+12}" cy="${cy+25}" r="5" fill="${c3}" opacity=".7"/>`,

    // 24 - مشاوي على الفحم
    `<rect x="${cx-52}" y="${cy+15}" width="104" height="12" rx="6" fill="${c3}" opacity=".8"/>
     <rect x="${cx-3}" y="${cy-40}" width="6" height="55" rx="3" fill="${c2}"/>
     <ellipse cx="${cx}" cy="${cy-42}" rx="22" ry="14" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-42}" rx="14" ry="8" fill="${c2}" opacity=".7"/>`,

    // 25 - باستا
    `<ellipse cx="${cx}" cy="${cy+10}" rx="50" ry="22" fill="${c1}" opacity=".9"/>
     <path d="M${cx-35} ${cy-10} Q${cx-20} ${cy+5} ${cx-5} ${cy-8} Q${cx+10} ${cy-20} ${cx+25} ${cy-5} Q${cx+38} ${cy+8} ${cx+35} ${cy-10}" stroke="${c2}" stroke-width="4" fill="none" stroke-linecap="round"/>
     <path d="M${cx-30} ${cy+5} Q${cx-15} ${cy-8} ${cx+5} ${cy+5} Q${cx+20} ${cy+15} ${cx+32} ${cy+2}" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/>`,

    // 26 - بيض مقلي
    `<ellipse cx="${cx}" cy="${cy}" rx="52" ry="38" fill="white" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="20" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx+8}" cy="${cy-8}" rx="8" ry="6" fill="white" opacity=".5"/>`,

    // 27 - شوكولاتة/حلوى
    `<rect x="${cx-50}" y="${cy-25}" width="100" height="50" rx="10" fill="${c1}" opacity=".9"/>
     <rect x="${cx-38}" y="${cy-13}" width="22" height="26" rx="4" fill="${c2}" opacity=".7"/>
     <rect x="${cx-12}" y="${cy-13}" width="22" height="26" rx="4" fill="${c2}" opacity=".7"/>
     <rect x="${cx+14}" y="${cy-13}" width="22" height="26" rx="4" fill="${c2}" opacity=".7"/>
     <line x1="${cx-38}" y1="${cy}" x2="${cx+36}" y2="${cy}" stroke="${c3}" stroke-width="1.5" opacity=".5"/>`,

    // 28 - بقلاوة
    `<polygon points="${cx},${cy-50} ${cx+50},${cy} ${cx},${cy+50} ${cx-50},${cy}" fill="${c1}" opacity=".9"/>
     <polygon points="${cx},${cy-32} ${cx+32},${cy} ${cx},${cy+32} ${cx-32},${cy}" fill="${c2}" opacity=".8"/>
     <polygon points="${cx},${cy-16} ${cx+16},${cy} ${cx},${cy+16} ${cx-16},${cy}" fill="${c3}" opacity=".9"/>`,

    // 29 - حلوى في قدر
    `<circle cx="${cx}" cy="${cy}" r="52" fill="${c1}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="40" fill="${c2}" opacity=".7"/>
     <path d="M${cx-25} ${cy-20} Q${cx} ${cy+30} ${cx+25} ${cy-20}" fill="${c3}" opacity=".8"/>
     <circle cx="${cx}" cy="${cy}" r="8" fill="${c1}"/>`,

    // 30 - مانسف / رز كبسة
    `<ellipse cx="${cx}" cy="${cy+20}" rx="58" ry="22" fill="${c3}" opacity=".7"/>
     <ellipse cx="${cx}" cy="${cy}" rx="55" ry="42" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-8}" rx="40" ry="28" fill="${c2}" opacity=".6"/>
     <circle cx="${cx-20}" cy="${cy-10}" r="8" fill="${c3}" opacity=".7"/>
     <circle cx="${cx+20}" cy="${cy-8}" r="9" fill="${c3}" opacity=".7"/>
     <circle cx="${cx}" cy="${cy+8}" r="7" fill="${c3}" opacity=".7"/>`,

    // 31 - موز / فواكه
    `<path d="M${cx-40} ${cy+20} Q${cx-30} ${cy-40} ${cx+10} ${cy-40} Q${cx+50} ${cy-40} ${cx+40} ${cy+20}" fill="${c1}" opacity=".9"/>
     <path d="M${cx-25} ${cy+15} Q${cx-18} ${cy-25} ${cx+5} ${cy-25} Q${cx+30} ${cy-25} ${cx+25} ${cy+15}" fill="${c2}" opacity=".7"/>
     <circle cx="${cx-10}" cy="${cy-30}" r="8" fill="${c3}"/>
     <circle cx="${cx+15}" cy="${cy+15}" r="10" fill="${c3}" opacity=".8"/>`,

    // 32 - صنية فرن
    `<rect x="${cx-55}" y="${cy-20}" width="110" height="45" rx="8" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-20}" rx="55" ry="14" fill="${c2}" opacity=".8"/>
     <circle cx="${cx-30}" cy="${cy+5}" r="10" fill="${c3}" opacity=".8"/>
     <circle cx="${cx}" cy="${cy+5}" r="10" fill="${c3}" opacity=".8"/>
     <circle cx="${cx+30}" cy="${cy+5}" r="10" fill="${c3}" opacity=".8"/>`,

    // 33 - شاورما
    `<rect x="${cx-15}" y="${cy-50}" width="30" height="100" rx="15" fill="${c1}" opacity=".9"/>
     <rect x="${cx-22}" y="${cy-30}" width="44" height="14" rx="4" fill="${c2}" opacity=".8"/>
     <rect x="${cx-20}" y="${cy-10}" width="40" height="13" rx="4" fill="${c3}" opacity=".8"/>
     <rect x="${cx-22}" y="${cy+8}" width="44" height="14" rx="4" fill="${c2}" opacity=".7"/>`,

    // 34 - عصير / مشروب
    `<rect x="${cx-25}" y="${cy-40}" width="50" height="80" rx="8" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx}" cy="${cy-40}" rx="25" ry="8" fill="${c2}" opacity=".8"/>
     <rect x="${cx-18}" y="${cy-35}" width="36" height="50" rx="5" fill="${c2}" opacity=".3"/>
     <rect x="${cx-5}" y="${cy-60}" width="10" height="22" rx="5" fill="${c3}"/>
     <circle cx="${cx-12}" cy="${cy-20}" r="5" fill="white" opacity=".4"/>`,

    // 35 - حمص
    `<ellipse cx="${cx}" cy="${cy+10}" rx="52" ry="30" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx-10}" cy="${cy}" rx="38" ry="22" fill="${c2}" opacity=".7"/>
     <circle cx="${cx+15}" cy="${cy+15}" r="8" fill="${c3}" opacity=".8"/>
     <path d="M${cx-20} ${cy-8} Q${cx} ${cy+18} ${cx+20} ${cy-5}" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/>`,

    // 36 - مقبلات متنوعة
    `<circle cx="${cx-25}" cy="${cy-18}" r="18" fill="${c1}" opacity=".9"/>
     <circle cx="${cx+25}" cy="${cy-18}" r="18" fill="${c2}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy+18}" r="20" fill="${c3}" opacity=".9"/>
     <circle cx="${cx-25}" cy="${cy-18}" r="9" fill="${c3}" opacity=".6"/>
     <circle cx="${cx+25}" cy="${cy-18}" r="9" fill="${c1}" opacity=".6"/>
     <circle cx="${cx}" cy="${cy+18}" r="10" fill="${c2}" opacity=".6"/>`,

    // 37 - فول / عدس
    `<ellipse cx="${cx}" cy="${cy}" rx="52" ry="38" fill="${c1}" opacity=".9"/>
     <ellipse cx="${cx-15}" cy="${cy-8}" rx="12" ry="8" fill="${c2}" opacity=".8"/>
     <ellipse cx="${cx+15}" cy="${cy-5}" rx="11" ry="7" fill="${c2}" opacity=".8"/>
     <ellipse cx="${cx-5}" cy="${cy+15}" rx="10" ry="7" fill="${c3}" opacity=".8"/>
     <ellipse cx="${cx+18}" cy="${cy+12}" rx="9" ry="6" fill="${c3}" opacity=".7"/>`,

    // 38 - مشروم / خضار
    `<path d="M${cx-45} ${cy} Q${cx-45} ${cy-60} ${cx} ${cy-60} Q${cx+45} ${cy-60} ${cx+45} ${cy} Z" fill="${c1}" opacity=".9"/>
     <rect x="${cx-12}" y="${cy}" width="24" height="35" rx="4" fill="${c2}" opacity=".9"/>
     <circle cx="${cx-25}" cy="${cy-20}" r="10" fill="${c3}" opacity=".6"/>
     <circle cx="${cx+25}" cy="${cy-20}" r="10" fill="${c3}" opacity=".6"/>`,

    // 39 - طبق ملكي
    `<circle cx="${cx}" cy="${cy}" r="55" fill="none" stroke="${c3}" stroke-width="3"/>
     <circle cx="${cx}" cy="${cy}" r="46" fill="${c1}" opacity=".9"/>
     <circle cx="${cx}" cy="${cy}" r="32" fill="${c2}" opacity=".7"/>
     <polygon points="${cx},${cy-25} ${cx+8},${cy-5} ${cx+28},${cy-5} ${cx+13},${cy+8} ${cx+18},${cy+28} ${cx},${cy+17} ${cx-18},${cy+28} ${cx-13},${cy+8} ${cx-28},${cy-5} ${cx-8},${cy-5}" fill="${c3}" opacity=".9"/>`,
  ];
  return shapes[idx % shapes.length];
}

/**
 * توليد صورة SVG فريدة لكل وجبة
 * تعتمد على: اسم الوجبة + رقمها + كود الدولة
 */
function generateFoodSVG(recipe, countryCode, recipeIndex) {
  const W = 600, H = 380;

  // hash فريد لكل وجبة
  const seed = recipe.id
    ? recipe.id.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xfffff, 0)
    : (countryCode.charCodeAt(0) * 1000 + recipeIndex * 97 + recipe.title_en.length * 13);

  const palIdx   = seed % PALETTES.length;
  const shapeIdx = (seed >> 3) % 40;
  const bgAngle  = (seed % 360);
  const [c1, c2, c3] = PALETTES[palIdx];

  // bg gradient direction
  const gx2 = Math.round(50 + 50 * Math.cos((bgAngle * Math.PI) / 180));
  const gy2 = Math.round(50 + 50 * Math.sin((bgAngle * Math.PI) / 180));

  // decoration circles
  const dc1x = 80 + (seed % 100);
  const dc1y = 60 + ((seed >> 4) % 80);
  const dc2x = 480 + ((seed >> 6) % 80);
  const dc2y = 280 + ((seed >> 8) % 60);

  // text
  const label = recipe.title_ar || '';
  const subLabel = recipe.title_en || '';

  const shape = getFoodShape(shapeIdx, 300, 185, c1, c2, c3);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg${seed}" x1="0%" y1="0%" x2="${gx2}%" y2="${gy2}%">
      <stop offset="0%" stop-color="${c1}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity=".14"/>
    </linearGradient>
    <radialGradient id="glow${seed}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c1}" stop-opacity=".18"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <filter id="blur${seed}"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0a1020"/>
  <rect width="${W}" height="${H}" fill="url(#bg${seed})"/>

  <!-- Glow blobs -->
  <circle cx="${dc1x}" cy="${dc1y}" r="120" fill="${c1}" opacity=".12" filter="url(#blur${seed})"/>
  <circle cx="${dc2x}" cy="${dc2y}" r="100" fill="${c2}" opacity=".10" filter="url(#blur${seed})"/>

  <!-- Grid lines -->
  <line x1="0" y1="60" x2="${W}" y2="60" stroke="rgba(255,255,255,.04)" stroke-width="1"/>
  <line x1="0" y1="320" x2="${W}" y2="320" stroke="rgba(255,255,255,.04)" stroke-width="1"/>
  <line x1="150" y1="0" x2="150" y2="${H}" stroke="rgba(255,255,255,.03)" stroke-width="1"/>
  <line x1="450" y1="0" x2="450" y2="${H}" stroke="rgba(255,255,255,.03)" stroke-width="1"/>

  <!-- Food Shape -->
  <g>${shape}</g>

  <!-- Title bar -->
  <rect x="0" y="${H-72}" width="${W}" height="72" fill="rgba(5,9,22,.75)"/>
  <rect x="0" y="${H-72}" width="${W}" height="1" fill="${c1}" opacity=".4"/>

  <!-- Text -->
  <text x="${W/2}" y="${H-42}" fill="white" font-size="20" font-weight="700"
    text-anchor="middle" font-family="Tajawal,Segoe UI,Arial"
    dominant-baseline="middle">${escXML(label)}</text>
  <text x="${W/2}" y="${H-18}" fill="${c2}" font-size="13"
    text-anchor="middle" font-family="Segoe UI,Arial"
    dominant-baseline="middle">${escXML(subLabel)}</text>

  <!-- Corner accent -->
  <circle cx="24" cy="24" r="14" fill="${c1}" opacity=".2"/>
  <circle cx="24" cy="24" r="7" fill="${c1}" opacity=".5"/>
</svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function escXML(s) {
  return String(s || '').replace(/[<>&'"]/g, c =>
    ({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' }[c]));
}

/* ══════════════════════════════════════════
   Theme
   ══════════════════════════════════════════ */
function setTheme(light) {
  document.body.classList.toggle('light', light);
  EL.themeIco.textContent = light ? '☀️' : '🌙';
  localStorage.setItem('wfTheme', light ? 'light' : 'dark');
}
function loadTheme() { setTheme(localStorage.getItem('wfTheme') === 'light'); }

/* ══════════════════════════════════════════
   Toast
   ══════════════════════════════════════════ */
let _tTimer;
function toast(msg, ms = 2800) {
  clearTimeout(_tTimer);
  EL.toast.textContent = msg;
  EL.toast.classList.remove('hidden');
  _tTimer = setTimeout(() => EL.toast.classList.add('hidden'), ms);
}

/* ══════════════════════════════════════════
   Particles
   ══════════════════════════════════════════ */
function spawnParticles() {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'ptcl';
    const sz = Math.random() * 70 + 20;
    const colors = ['rgba(124,156,255,.15)','rgba(66,223,200,.13)','rgba(255,140,105,.1)','rgba(199,125,255,.12)'];
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;
      background:radial-gradient(circle,${colors[i%4]},transparent 70%);
      --dur:${Math.random()*18+12}s;--dly:${Math.random()*-18}s;`;
    EL.particles.appendChild(p);
  }
}

/* ══════════════════════════════════════════
   Counter animation
   ══════════════════════════════════════════ */
function animCount(el, target, dur = 1400) {
  const start = performance.now();
  (function frame(now) {
    const t = Math.min((now - start) / dur, 1);
    const v = Math.round(target * (1 - Math.pow(1 - t, 3)));
    el.textContent = v.toLocaleString('ar-EG');
    if (t < 1) requestAnimationFrame(frame);
  })(start);
}

/* ══════════════════════════════════════════
   Build Sidebar
   ══════════════════════════════════════════ */
function buildSidebar() {
  // region counts
  const rc = {};
  S.countries.forEach(c => { rc[c.region || 'Other'] = (rc[c.region || 'Other'] || 0) + 1; });

  // "All" button
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

  const regionEmoji = { Asia:'🌏', Europe:'🌍', Africa:'🌍', Americas:'🌎', Oceania:'🏝️', 'North America':'🌎', 'South America':'🌎' };
  Object.entries(rc).sort((a,b) => b[1]-a[1]).forEach(([r,n]) => {
    EL.regionList.appendChild(mkRBtn(`${regionEmoji[r]||'🗺️'} ${r}`, r, n));
  });

  // popular
  const pop = [...S.countries].sort((a,b) => b.recipes.length - a.recipes.length).slice(0,6);
  EL.popularList.innerHTML = '';
  pop.forEach(c => {
    const d = document.createElement('div');
    d.className = 'pop-item';
    d.innerHTML = `<div class="pop-flag">${c.flag}</div>
      <div class="pop-info">
        <div class="pop-name">${c.name_ar}</div>
        <div class="pop-cnt">${c.recipes.length} وصفة</div>
      </div>`;
    d.addEventListener('click', () => openModal(c.code));
    EL.popularList.appendChild(d);
  });
}

/* ══════════════════════════════════════════
   Build region filter options
   ══════════════════════════════════════════ */
function buildRegionOptions() {
  const regions = [...new Set(S.countries.map(c => c.region).filter(Boolean))].sort();
  regions.forEach(r => {
    const o = document.createElement('option');
    o.value = r; o.textContent = r;
    EL.regionFilter.appendChild(o);
  });
}

/* ══════════════════════════════════════════
   Filter & Sort
   ══════════════════════════════════════════ */
function filterAndRender() {
  const q      = EL.searchInput.value.trim().toLowerCase();
  const region = EL.regionFilter.value;
  const sort   = EL.sortSelect.value;

  EL.searchClear.classList.toggle('show', q.length > 0);

  S.filtered = S.countries.filter(c => {
    const txt = `${c.name_ar} ${c.name_en} ${c.code} ${c.region} ${c.capital}`.toLowerCase();
    const ok1 = !q || txt.includes(q) || c.recipes.some(r =>
      r.title_ar.toLowerCase().includes(q) || r.title_en.toLowerCase().includes(q));
    const ok2 = !region || c.region === region;
    return ok1 && ok2;
  });

  if (sort === 'recipes') S.filtered.sort((a,b) => b.recipes.length - a.recipes.length);
  else if (sort === 'region') S.filtered.sort((a,b) => (a.region||'').localeCompare(b.region||''));
  else S.filtered.sort((a,b) => a.name_ar.localeCompare(b.name_ar));

  S.page = 0;
  renderGrid(false);
}

/* ══════════════════════════════════════════
   Render Grid
   ══════════════════════════════════════════ */
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

/* ══════════════════════════════════════════
   Build Card
   ══════════════════════════════════════════ */
function buildCard(c) {
  const n = EL.tpl.content.firstElementChild.cloneNode(true);
  n.querySelector('.ccard-flag-bg').textContent = c.flag;
  n.querySelector('.ccard-flag-sm').textContent = c.flag;
  n.querySelector('.ccard-name').textContent = c.name_ar;
  n.querySelector('.ccard-name-en').textContent = c.name_en;
  n.querySelector('.ccard-region').textContent = `🗺️ ${c.region}${c.subregion ? ' • '+c.subregion : ''}`;
  n.querySelector('.ccard-summary').textContent = c.summary_ar || `مطبخ ${c.name_ar}`;

  const tags = n.querySelector('.ccard-tags');
  [`🏛️ ${c.capital||'—'}`, `📖 ${c.recipes.length} وصفة`].forEach((t, i) => {
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

/* ══════════════════════════════════════════
   Difficulty helper
   ══════════════════════════════════════════ */
function diffClass(d) {
  if (!d) return 'easy';
  if (d.includes('سهل')) return 'easy';
  if (d.includes('متوسط')) return 'med';
  return 'hard';
}

/* ══════════════════════════════════════════
   Open Country Modal
   ══════════════════════════════════════════ */
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
          <span class="diff-badge ${dc}">${r.difficulty||'سهل'}</span>
          <span class="time-badge">⏱ ${r.time_minutes} د</span>
        </div>
      </div>
      <div class="rcard-body">
        <div class="rcard-title">${r.title_ar}</div>
        <div class="rcard-title-en">${r.title_en}</div>
        <div class="rcard-desc">${r.description_ar}</div>
        <div class="rcard-stats">
          <span class="rstat">⏱ ${r.time_minutes} دقيقة</span>
          <span class="rstat">👥 ${r.servings} حصص</span>
          <span class="rstat">📊 ${r.difficulty||'سهل'}</span>
        </div>
        <div class="rcard-cols">
          <div class="rcol">
            <h5>🛒 المكوّنات</h5>
            <ul>${r.ingredients.map(i=>`<li>${escXML(i)}</li>`).join('')}</ul>
          </div>
          <div class="rcol">
            <h5>👨‍🍳 التحضير</h5>
            <ol>${r.steps.map(s=>`<li>${escXML(s)}</li>`).join('')}</ol>
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
            <span class="mtag prim">🏛️ ${c.capital||'—'}</span>
            <span class="mtag">🌐 ${c.region}</span>
            ${c.subregion?`<span class="mtag">📍 ${c.subregion}</span>`:''}
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

/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */
async function init() {
  try {
    spawnParticles();
    loadTheme();

    const res = await fetch('./data/countries.json');
    if (!res.ok) throw new Error('fetch failed');
    S.countries = await res.json();
    S.filtered  = [...S.countries].sort((a,b) => a.name_ar.localeCompare(b.name_ar));

    buildRegionOptions();
    buildSidebar();

    // update stats
    const total   = S.countries.length;
    const recipes = S.countries.reduce((n,c) => n + c.recipes.length, 0);
    animCount(EL.cCount, total);
    animCount(EL.rCount, recipes, 1800);
    EL.navC.textContent = total.toLocaleString('ar-EG');
    EL.navR.textContent = recipes.toLocaleString('ar-EG');

    renderGrid(false);

    // hide preloader
    setTimeout(() => EL.preloader.classList.add('out'), 1400);

    /* ── Events ── */
    let _st;
    EL.searchInput.addEventListener('input', () => { clearTimeout(_st); _st = setTimeout(filterAndRender, 180); });
    EL.searchClear.addEventListener('click', () => {
      EL.searchInput.value = ''; EL.searchClear.classList.remove('show'); filterAndRender();
    });
    EL.regionFilter.addEventListener('change', filterAndRender);
    EL.sortSelect.addEventListener('change', filterAndRender);

    EL.gridBtn.addEventListener('click', () => {
      S.view = 'grid'; EL.grid.classList.remove('list-view');
      EL.gridBtn.classList.add('on'); EL.listBtn.classList.remove('on');
    });
    EL.listBtn.addEventListener('click', () => {
      S.view = 'list'; EL.grid.classList.add('list-view');
      EL.listBtn.classList.add('on'); EL.gridBtn.classList.remove('on');
    });

    EL.lmBtn.addEventListener('click', () => {
      EL.lmBtn.classList.add('loading');
      setTimeout(() => { S.page++; renderGrid(true); EL.lmBtn.classList.remove('loading'); }, 500);
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
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); EL.searchInput.focus(); }
    });

    window.addEventListener('scroll', () => {
      EL.navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

  } catch (err) {
    console.error(err);
    EL.resultsText.textContent = '❌ تعذّر تحميل البيانات — شغّل الموقع عبر خادم محلي أو Vercel';
    EL.preloader.classList.add('out');
  }
}

init();
