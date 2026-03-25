// ============================================================
// UI strings
// ============================================================
const UI_STRINGS = {
  en: {
    siteTitle:        'My Korean Name',
    subtitle:         'Discover your Korean name',
    nameLabel:        'Your Name',
    namePlaceholder:  'e.g. Sarah',
    birthLabel:       'Date of Birth',
    yearPlaceholder:  'Year',
    monthPlaceholder: 'Month',
    dayPlaceholder:   'Day',
    submitBtn:        'Find My Korean Name \u2192',
    nameIntro:        'Your Korean name is',
    meaningLabel:     'Name Meaning',
    personalityLabel: 'Your Character',
    shareLabel:       'Share',
    copyBtn:          'Copy Link',
    twitterBtn:       'Share on X',
    backLink:         '\u2190 Try another name',
    copied:           'Copied \u2713',
    inputNameLabel:   name => `Korean name for ${name}`,
    tweetText:        (name, pron) => `My Korean name is "${name}" (${pron})! Find yours too!`,
    seasonLabels:     { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' },
  },
  ja: {
    siteTitle:        '\u79c1\u306e\u97d3\u56fd\u8a9e\u540d\u306f',
    subtitle:         '\u97d3\u56fd\u8a9e\u306e\u540d\u524d\u3092\u898b\u3064\u3051\u3088\u3046',
    nameLabel:        '\u304a\u540d\u524d',
    namePlaceholder:  '\u3055\u304f\u3089',
    birthLabel:       '\u751f\u5e74\u6708\u65e5',
    yearPlaceholder:  '\u5e74',
    monthPlaceholder: '\u6708',
    dayPlaceholder:   '\u65e5',
    submitBtn:        '\u97d3\u56fd\u8a9e\u306e\u540d\u524d\u3092\u898b\u3064\u3051\u308b \u2192',
    nameIntro:        '\u3042\u306a\u305f\u306e\u97d3\u56fd\u8a9e\u540d\u306f',
    meaningLabel:     '\u540d\u524d\u306e\u610f\u5473',
    personalityLabel: '\u3042\u306a\u305f\u306e\u6027\u683c',
    shareLabel:       '\u30b7\u30a7\u30a2',
    copyBtn:          '\u30ea\u30f3\u30af\u3092\u30b3\u30d4\u30fc',
    twitterBtn:       'X\u3067\u30b7\u30a7\u30a2',
    backLink:         '\u2190 \u5225\u306e\u540d\u524d\u3092\u8a66\u3059',
    copied:           '\u30b3\u30d4\u30fc\u6e08\u307f \u2713',
    inputNameLabel:   name => `${name} \u3055\u3093\u306e\u97d3\u56fd\u8a9e\u540d`,
    tweetText:        (name, pron) => `\u79c1\u306e\u97d3\u56fd\u8a9e\u540d\u306f\u300c${name}\u300d(${pron})\u3067\u3059\uff01 \u3042\u306a\u305f\u3082\u8a66\u3057\u3066\u307f\u3066\uff01`,
    seasonLabels:     { spring: '\u6625', summer: '\u590f', autumn: '\u79cb', winter: '\u51ac' },
  },
};

// ============================================================
// Language detection
// ============================================================
function getNavLang() {
  return (navigator.language || '').startsWith('ja') ? 'ja' : 'en';
}

async function detectUILang() {
  // 1. URL param override — also used to pass lang from index → result
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang === 'ja' || urlLang === 'en') return urlLang;

  // 2. Try ipinfo.io (50k req/month free)
  try {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    const res   = await fetch('https://ipinfo.io/json', { signal: ctrl.signal });
    clearTimeout(timer);
    const { country } = await res.json();
    if (country) return country === 'JP' ? 'ja' : 'en';
  } catch {}

  // 3. Fallback: ipapi.co (1000 req/day free)
  try {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    const res   = await fetch('https://ipapi.co/json/', { signal: ctrl.signal });
    clearTimeout(timer);
    const { country_code } = await res.json();
    if (country_code) return country_code === 'JP' ? 'ja' : 'en';
  } catch {}

  // 4. Final fallback: browser language
  return getNavLang();
}

// Apply UI_STRINGS to elements with data-i18n / data-i18n-placeholder
function applyUIStrings(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('input[type="date"]').forEach(el => { el.lang = lang; });
  const s = UI_STRINGS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = s[el.dataset.i18n];
    if (typeof val === 'string') el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = s[el.dataset.i18nPlaceholder];
    if (typeof val === 'string') el.placeholder = val;
  });
}
