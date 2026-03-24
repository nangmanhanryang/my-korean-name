// ============================================================
// Korean syllable builder
// ============================================================
const CHO_IDX = { ㄱ:0, ㄴ:2, ㄷ:3, ㄹ:5, ㅁ:6, ㅂ:7, ㅅ:9, ㅇ:11, ㅈ:12, ㅊ:14, ㅋ:15, ㅌ:16, ㅍ:17, ㅎ:18 };
const JUNG_IDX = { ㅏ:0, ㅐ:1, ㅑ:2, ㅓ:4, ㅔ:5, ㅕ:6, ㅗ:8, ㅛ:12, ㅜ:13, ㅠ:17, ㅡ:18, ㅣ:20 };

function makeSyllable(cho, jung) {
  const c = CHO_IDX[cho];
  const v = JUNG_IDX[jung];
  if (c === undefined || v === undefined) return '아';
  return String.fromCharCode(0xAC00 + (c * 21 + v) * 28);
}

// ============================================================
// Language detection
// ============================================================
function detectLanguage(name) {
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(name) ? 'ja' : 'en';
}

// ============================================================
// Japanese kana → Korean syllable
// ============================================================
const KANA_TO_KO = {
  'あ':'아','い':'이','う':'우','え':'에','お':'오',
  'か':'가','き':'기','く':'구','け':'게','こ':'고',
  'さ':'사','し':'시','す':'수','せ':'세','そ':'소',
  'た':'타','ち':'치','つ':'츠','て':'테','と':'토',
  'な':'나','に':'니','ぬ':'누','ね':'네','の':'노',
  'は':'하','ひ':'히','ふ':'후','へ':'헤','ほ':'호',
  'ま':'마','み':'미','む':'무','め':'메','も':'모',
  'や':'야','ゆ':'유','よ':'요',
  'ら':'라','り':'리','る':'루','れ':'레','ろ':'로',
  'わ':'와','を':'오','ん':'은',
  'が':'가','ぎ':'기','ぐ':'구','げ':'게','ご':'고',
  'ざ':'자','じ':'지','ず':'주','ぜ':'제','ぞ':'조',
  'だ':'다','ぢ':'지','づ':'주','で':'데','ど':'도',
  'ば':'바','び':'비','ぶ':'부','べ':'베','ぼ':'보',
  'ぱ':'파','ぴ':'피','ぷ':'푸','ぺ':'페','ぽ':'포',
  'ア':'아','イ':'이','ウ':'우','エ':'에','オ':'오',
  'カ':'가','キ':'기','ク':'구','ケ':'게','コ':'고',
  'サ':'사','シ':'시','ス':'수','セ':'세','ソ':'소',
  'タ':'타','チ':'치','ツ':'츠','テ':'테','ト':'토',
  'ナ':'나','ニ':'니','ヌ':'누','ネ':'네','ノ':'노',
  'ハ':'하','ヒ':'히','フ':'후','ヘ':'헤','ホ':'호',
  'マ':'마','ミ':'미','ム':'무','メ':'메','モ':'모',
  'ヤ':'야','ユ':'유','ヨ':'요',
  'ラ':'라','リ':'리','ル':'루','レ':'레','ロ':'로',
  'ワ':'와','ヲ':'오','ン':'은',
  'ガ':'가','ギ':'기','グ':'구','ゲ':'게','ゴ':'고',
  'ザ':'자','ジ':'지','ズ':'주','ゼ':'제','ゾ':'조',
  'ダ':'다','ヂ':'지','ヅ':'주','デ':'데','ド':'도',
  'バ':'바','ビ':'비','ブ':'부','ベ':'베','ボ':'보',
  'パ':'파','ピ':'피','プ':'푸','ペ':'페','ポ':'포',
};

function getJapaneseFirstSyllable(name) {
  for (let i = 0; i < name.length; i++) {
    if (KANA_TO_KO[name[i]]) return KANA_TO_KO[name[i]];
  }
  return getEnglishFirstSyllable(name);
}

// ============================================================
// English → Korean first syllable
// ============================================================
function getEnglishFirstSyllable(name) {
  const s = name.toLowerCase().replace(/[^a-z]/g, '');
  if (!s) return '아';

  let cho = 'ㅇ';
  let vowelStart = 0;

  const digraphs = { sh:'ㅅ', ch:'ㅊ', th:'ㄷ', ph:'ㅍ', wh:'ㅎ' };
  if (digraphs[s.slice(0, 2)]) {
    cho = digraphs[s.slice(0, 2)];
    vowelStart = 2;
  } else if (!'aeiou'.includes(s[0])) {
    const cmap = {
      b:'ㅂ', c:'ㄱ', d:'ㄷ', f:'ㅍ', g:'ㄱ', h:'ㅎ', j:'ㅈ', k:'ㄱ',
      l:'ㄹ', m:'ㅁ', n:'ㄴ', p:'ㅍ', q:'ㄱ', r:'ㄹ', s:'ㅅ', t:'ㅌ',
      v:'ㅂ', w:'ㅇ', x:'ㅅ', y:'ㅇ', z:'ㅈ'
    };
    cho = cmap[s[0]] || 'ㅇ';
    vowelStart = 1;
  }

  let vIdx = -1;
  for (let i = vowelStart; i < s.length; i++) {
    if ('aeiou'.includes(s[i])) { vIdx = i; break; }
  }
  if (vIdx === -1) return makeSyllable(cho, 'ㅏ');

  const v = s[vIdx];
  const n1 = s[vIdx + 1] || '';

  // Y + vowel → compound vowel
  if (s[0] === 'y' && vIdx === 1) {
    const yv = { a:'ㅑ', e:'ㅖ', i:'ㅣ', o:'ㅛ', u:'ㅠ' };
    return makeSyllable('ㅇ', yv[v] || 'ㅏ');
  }

  let jung = 'ㅏ';
  if (v === 'a') {
    if (n1 === 'y' || n1 === 'i') jung = 'ㅔ';
    else if (n1 === 'r') jung = 'ㅏ';
    else jung = 'ㅏ';
  } else if (v === 'e') {
    if (n1 === 'e' || n1 === 'a') jung = 'ㅣ';
    else if (n1 === 'r') jung = 'ㅓ';
    else jung = 'ㅔ';
  } else if (v === 'i') {
    jung = n1 === 'r' ? 'ㅓ' : 'ㅣ';
  } else if (v === 'o') {
    if (n1 === 'o' || n1 === 'u') jung = 'ㅜ';
    else if (n1 === 'r') jung = 'ㅓ';
    else jung = 'ㅗ';
  } else if (v === 'u') {
    jung = n1 === 'r' ? 'ㅓ' : 'ㅜ';
  }

  return makeSyllable(cho, jung);
}

// ============================================================
// Birth month → second character
// ============================================================
const MONTH_DATA = [
  { ko:'휘', hanja:'輝', en:'radiant light',       ja:'輝くような' },
  { ko:'린', hanja:'隣', en:'warm and kind',        ja:'温かく優しい' },
  { ko:'화', hanja:'花', en:'like a flower',        ja:'花のような' },
  { ko:'춘', hanja:'春', en:'spirit of spring',     ja:'春の精霊' },
  { ko:'윤', hanja:'潤', en:'lush and abundant',    ja:'豊かで潤いある' },
  { ko:'하', hanja:'夏', en:'summer passion',       ja:'夏の情熱' },
  { ko:'서', hanja:'曙', en:'dawn light',           ja:'夜明けの光' },
  { ko:'아', hanja:'雅', en:'elegant',              ja:'優雅な' },
  { ko:'가', hanja:'佳', en:'beautiful',            ja:'美しい' },
  { ko:'결', hanja:'潔', en:'pure and clear',       ja:'清純な' },
  { ko:'설', hanja:'雪', en:'clear as snow',        ja:'雪のように清い' },
  { ko:'동', hanja:'冬', en:'winter stillness',     ja:'冬の静けさ' },
];

function getSecondChar(month, excludeChar) {
  let data = MONTH_DATA[month - 1];
  if (data.ko === excludeChar) {
    const altMonth = month === 1 ? 12 : month - 1;
    data = MONTH_DATA[altMonth - 1];
  }
  return data;
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
  }
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
function generateKoreanName(inputName, birthDate) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const lang = detectLanguage(inputName);

  const firstSyl = lang === 'ja'
    ? getJapaneseFirstSyllable(inputName)
    : getEnglishFirstSyllable(inputName);

  const secondCharData = getSecondChar(month, firstSyl);
  const koreanName = firstSyl + secondCharData.ko;
  const pronunciation = formatPronunciation(romanize(koreanName));
  const season = getSeason(month);
  const personality = PERSONALITY[lang === 'ja' ? 'ja' : 'en'][season];

  const nameMeaning = lang === 'ja'
    ? `「${firstSyl}」はあなたの名前「${inputName}」の響きから生まれ、「${secondCharData.ko}」(${secondCharData.hanja})は${secondCharData.ja}という意味を持ちます。`
    : `"${firstSyl}" captures the sound of your name "${inputName}", and "${secondCharData.ko}" (${secondCharData.hanja}) means ${secondCharData.en}.`;

  return { koreanName, hanja: secondCharData.hanja, pronunciation, nameMeaning, personality, season, lang, inputName, birthDate };
}
