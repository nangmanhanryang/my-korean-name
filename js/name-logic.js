// ============================================================
// First syllable: curated pools by initial-sound category
// Each pool contains only syllables actually used in Korean names.
// ============================================================
const FIRST_POOLS = {
  vowel: ['아', '은', '예', '온', '유', '이'],
  b:     ['보', '별', '봄'],
  d:     ['다', '달', '도'],
  g:     ['가', '결', '기'],
  h:     ['하', '혜', '희'],
  j:     ['재', '지', '진'],
  k:     ['경', '기', '결'],
  l:     ['라', '리', '린'],
  m:     ['민', '미', '명'],
  n:     ['나', '남'],
  p:     ['빛', '보', '봄'],
  r:     ['라', '리', '린'],
  s:     ['서', '소', '솔'],
  t:     ['태', '탄'],
  w:     ['우', '원'],
  y:     ['유', '예', '연'],
  z:     ['지', '주'],
};

function getEnglishCategory(name) {
  const c = name.toLowerCase().replace(/[^a-z]/g, '')[0] || '';
  const map = {
    a:'vowel', e:'vowel', i:'vowel', o:'vowel', u:'vowel',
    b:'b', c:'k', d:'d', f:'h', g:'g', h:'h',
    j:'j', k:'k', l:'l', m:'m', n:'n', p:'p',
    q:'k', r:'r', s:'s', t:'t', v:'b', w:'w',
    x:'s', y:'y', z:'z',
  };
  return map[c] || 'vowel';
}

function getKanaCategory(name) {
  const ch = name[0] || '';
  if ('あいうえおアイウエオわをんワヲン'.includes(ch))                        return 'vowel';
  if ('かきくけこがぎぐげごカキクケコガギグゲゴ'.includes(ch))               return 'k';
  if ('さしすせそざじずぜぞサシスセソザジズゼゾ'.includes(ch))               return 's';
  if ('たちつてとだぢづでどタチツテトダヂヅデド'.includes(ch))               return 't';
  if ('なにぬねのナニヌネノ'.includes(ch))                                    return 'n';
  if ('はひふへほばびぶべぼぱぴぷぺぽハヒフヘホバビブベボパピプペポ'.includes(ch)) return 'h';
  if ('まみむめもマミムメモ'.includes(ch))                                    return 'm';
  if ('やゆよヤユヨ'.includes(ch))                                            return 'y';
  if ('らりるれろラリルレロ'.includes(ch))                                    return 'r';
  return 'vowel';
}

function getFirstSyllable(name, inputLang, seed) {
  const category = inputLang === 'ja' ? getKanaCategory(name) : getEnglishCategory(name);
  const pool = FIRST_POOLS[category] || FIRST_POOLS.vowel;
  return pool[seed % pool.length];
}

// ============================================================
// Language detection (input name)
// ============================================================
function detectLanguage(name) {
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(name) ? 'ja' : 'en';
}

// ============================================================
// Second syllable: 3 options per birth month
// Birth day is used to choose among them for variety.
// ============================================================
const MONTH_OPTIONS = [
  // January
  [
    { ko:'희', hanja:'熙', en:'radiant joy',              ja:'輝く喜び' },
    { ko:'빛', hanja:'光', en:'pure light',               ja:'純粋な光' },
    { ko:'한', hanja:'閒', en:'serene stillness',         ja:'穏やかな静けさ' },
  ],
  // February
  [
    { ko:'린', hanja:'隣', en:'warm and kind',            ja:'温かく優しい' },
    { ko:'연', hanja:'然', en:'naturally at ease',        ja:'自然体で穏やか' },
    { ko:'온', hanja:'溫', en:'gentle warmth',            ja:'穏やかな温もり' },
  ],
  // March
  [
    { ko:'화', hanja:'花', en:'blooming flower',          ja:'咲き誇る花' },
    { ko:'채', hanja:'彩', en:'colorful radiance',        ja:'色鮮やかな輝き' },
    { ko:'봄', hanja:'春', en:'spirit of spring',         ja:'春の精神' },
  ],
  // April
  [
    { ko:'춘', hanja:'春', en:'breath of spring',         ja:'春の息吹' },
    { ko:'솔', hanja:'率', en:'honest and true',          ja:'誠実で真っ直ぐ' },
    { ko:'예', hanja:'叡', en:'wise and bright',          ja:'賢く聡明' },
  ],
  // May
  [
    { ko:'윤', hanja:'潤', en:'lush and abundant',        ja:'豊かで潤いある' },
    { ko:'수', hanja:'秀', en:'outstanding grace',        ja:'卓越した優雅さ' },
    { ko:'결', hanja:'潔', en:'pure and clear',           ja:'清らかで澄んだ' },
  ],
  // June
  [
    { ko:'하', hanja:'夏', en:'summer warmth',            ja:'夏の温かさ' },
    { ko:'진', hanja:'眞', en:'true and sincere',         ja:'真摯で誠実' },
    { ko:'선', hanja:'宣', en:'radiant presence',         ja:'輝く存在感' },
  ],
  // July
  [
    { ko:'서', hanja:'曙', en:'dawn light',               ja:'夜明けの光' },
    { ko:'준', hanja:'俊', en:'talented and bright',      ja:'才能豊かで輝く' },
    { ko:'도', hanja:'道', en:'the right path',           ja:'正しい道' },
  ],
  // August
  [
    { ko:'아', hanja:'雅', en:'elegant grace',            ja:'優雅な気品' },
    { ko:'강', hanja:'剛', en:'inner strength',           ja:'内なる強さ' },
    { ko:'현', hanja:'賢', en:'wise and brilliant',       ja:'賢く輝く' },
  ],
  // September
  [
    { ko:'가', hanja:'佳', en:'beautiful inside and out', ja:'内外ともに美しい' },
    { ko:'민', hanja:'敏', en:'quick and perceptive',     ja:'素早く洞察力がある' },
    { ko:'나', hanja:'娜', en:'graceful and lovely',      ja:'優雅で愛らしい' },
  ],
  // October
  [
    { ko:'원', hanja:'源', en:'deep wellspring',          ja:'深い源泉' },
    { ko:'은', hanja:'恩', en:'grace and blessing',       ja:'恵みと祝福' },
    { ko:'지', hanja:'智', en:'wisdom and insight',       ja:'知恵と洞察力' },
  ],
  // November
  [
    { ko:'설', hanja:'雪', en:'clear as snow',            ja:'雪のように清らか' },
    { ko:'유', hanja:'悠', en:'calm and timeless',        ja:'穏やかで悠久' },
    { ko:'승', hanja:'昇', en:'rising above',             ja:'高みへと昇る' },
  ],
  // December
  [
    { ko:'동', hanja:'冬', en:'winter stillness',         ja:'冬の静けさ' },
    { ko:'성', hanja:'星', en:'bright as a star',         ja:'星のように輝く' },
    { ko:'영', hanja:'永', en:'everlasting spirit',       ja:'永遠の精神' },
  ],
];

function getSecondChar(month, firstSyl, seed) {
  const options = MONTH_OPTIONS[month - 1];
  let idx = seed % options.length;
  // Avoid collision with first syllable
  for (let i = 0; i < options.length; i++) {
    if (options[idx].ko !== firstSyl) break;
    idx = (idx + 1) % options.length;
  }
  return options[idx];
}

// ============================================================
// Season → personality
// ============================================================
const PERSONALITY = {
  en: {
    spring: "Born in spring, you carry the energy of new beginnings. Curious, warm-hearted, and full of hope — like cherry blossoms breaking into bloom.",
    summer: "Born in summer, you radiate passion and vitality. Bold, expressive, and impossible to ignore. You light up every room you enter.",
    autumn: "Born in autumn, you have a depth and quiet wisdom beyond your years. Thoughtful, artistic, and deeply perceptive of the world around you.",
    winter: "Born in winter, you hold a rare and quiet strength. Calm, resilient, and a steady source of warmth to everyone close to you.",
  },
  ja: {
    spring: "春に生まれたあなたは、新しい始まりのエネルギーを持っています。好奇心旺盛で温かく、桜の花のように希望に満ちた存在です。",
    summer: "夏に生まれたあなたは、情熱と活力にあふれています。大胆で表現豊かで、どこにいても目を引く存在感があります。",
    autumn: "秋に生まれたあなたは、年齢を超えた深みと静かな知恵を持っています。思慮深く芸術的で、世界を鋭く見つめる目を持っています。",
    winter: "冬に生まれたあなたは、稀有な静かな強さを持っています。穏やかで粘り強く、近くにいる人みんなに安定した温かさを与えます。",
  },
};

function getSeason(month) {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// ============================================================
// Romanization
// ============================================================
const CHO_R  = ['g','kk','n','d','tt','r','m','b','bb','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG_R = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG_R = ['','k','kk','ks','n','nj','nh','t','l','lk','lm','lb','ls','lt','lp','lh','m','p','ps','t','ss','ng','t','t','k','t','p','t'];

function romanizeSyllable(ch) {
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return ch;
  const jong = code % 28;
  const jung = Math.floor(code / 28) % 21;
  const cho  = Math.floor(code / 28 / 21);
  return CHO_R[cho] + JUNG_R[jung] + JONG_R[jong];
}

function romanize(name) {
  return name.split('').map(ch => {
    const code = ch.charCodeAt(0);
    return (code >= 0xAC00 && code <= 0xD7A3) ? romanizeSyllable(ch) : ch;
  }).join('-');
}

function formatPronunciation(romanized) {
  return romanized.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('-');
}

// ============================================================
// Main: generate Korean name
// ============================================================
function generateKoreanName(inputName, birthDate, uiLang = 'en') {
  const [year, month, day] = birthDate.split('-').map(Number);
  const inputLang = detectLanguage(inputName);

  // Deterministic seed: sum of char codes + birth day
  const nameSeed = inputName.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const seed = nameSeed + day;

  const firstSyl      = getFirstSyllable(inputName, inputLang, seed);
  const secondCharData = getSecondChar(month, firstSyl, seed);
  const koreanName    = firstSyl + secondCharData.ko;
  const pronunciation = formatPronunciation(romanize(koreanName));
  const season        = getSeason(month);
  const personality   = PERSONALITY[uiLang][season];

  const nameMeaning = uiLang === 'ja'
    ? `「${firstSyl}」はあなたの名前「${inputName}」から生まれ、「${secondCharData.ko}」(${secondCharData.hanja})は${secondCharData.ja}という意味を持ちます。`
    : `"${firstSyl}" is inspired by your name "${inputName}", and "${secondCharData.ko}" (${secondCharData.hanja}) means ${secondCharData.en}.`;

  return { koreanName, hanja: secondCharData.hanja, pronunciation, nameMeaning, personality, season, inputName, birthDate };
}
