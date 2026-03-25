// ============================================================
// Dark / light mode toggle
// ============================================================
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const _savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(_savedTheme);

const _themeBtn = document.getElementById('themeToggle');
if (_themeBtn) {
  _themeBtn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// ============================================================
// index.html — date selects population
// ============================================================
function populateDateSelects(lang) {
  const yearSel  = document.getElementById('birthYear');
  const monthSel = document.getElementById('birthMonth');
  const daySel   = document.getElementById('birthDay');
  if (!yearSel) return;

  const s    = UI_STRINGS[lang];
  const yVal = yearSel.value;
  const mVal = monthSel.value;
  const dVal = daySel.value;

  const thisYear = new Date().getFullYear();
  yearSel.innerHTML  = `<option value="">${s.yearPlaceholder}</option>`;
  monthSel.innerHTML = `<option value="">${s.monthPlaceholder}</option>`;
  daySel.innerHTML   = `<option value="">${s.dayPlaceholder}</option>`;

  for (let y = thisYear; y >= 1940; y--) {
    yearSel.innerHTML += `<option value="${y}">${y}</option>`;
  }
  for (let m = 1; m <= 12; m++) {
    const v = String(m).padStart(2, '0');
    monthSel.innerHTML += `<option value="${v}">${m}</option>`;
  }
  for (let d = 1; d <= 31; d++) {
    const v = String(d).padStart(2, '0');
    daySel.innerHTML += `<option value="${v}">${d}</option>`;
  }

  yearSel.value  = yVal;
  monthSel.value = mVal;
  daySel.value   = dVal;
}

// ============================================================
// index.html — form submission (added immediately, no lang needed)
// ============================================================
const form = document.getElementById('nameForm');
if (form) {
  populateDateSelects(getNavLang());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('nameInput').value.trim();
    const year  = document.getElementById('birthYear').value;
    const month = document.getElementById('birthMonth').value;
    const day   = document.getElementById('birthDay').value;
    if (!name || !year || !month || !day) return;
    const birth = `${year}-${month}-${day}`;
    const lang  = window.LANG || 'en';
    window.location.href = `result.html?name=${encodeURIComponent(name)}&birth=${encodeURIComponent(birth)}&lang=${lang}`;
  });
}

// Apply UI strings immediately using browser language (avoids flash)
applyUIStrings(getNavLang());

// Then detect via IP and update
detectUILang().then(lang => {
  window.LANG = lang;
  applyUIStrings(lang);
  populateDateSelects(lang);
  document.title = UI_STRINGS[lang].siteTitle;

  // result.html — read params and render (waits for lang detection)
  if (document.getElementById('koreanName')) {
    const params = new URLSearchParams(window.location.search);
    const name   = params.get('name');
    const birth  = params.get('birth');

    if (!name || !birth) {
      window.location.href = 'index.html';
    } else {
      try {
        displayResult(generateKoreanName(name, birth, lang), lang);
      } catch (e) {
        window.location.href = 'index.html';
      }
    }
  }
});

// ============================================================
// result.html — render
// ============================================================
function displayResult(r, lang) {
  const s = UI_STRINGS[lang];
  const seasonIcon = { spring: '\uD83C\uDF38', summer: '\u2600\uFE0F', autumn: '\uD83C\uDF42', winter: '\u2744\uFE0F' };

  set('koreanName',       r.koreanName);
  set('hanja',            r.hanja);
  set('pronunciation',    r.pronunciation);
  set('nameMeaning',      r.nameMeaning);
  set('personality',      r.personality);
  set('seasonBadge',      `${seasonIcon[r.season]} ${s.seasonLabels[r.season]}`);
  set('inputName',        s.inputNameLabel(r.inputName));
  set('nameIntro',        s.nameIntro);
  set('meaningLabel',     s.meaningLabel);
  set('personalityLabel', s.personalityLabel);
  set('shareLabel',       s.shareLabel);
  set('copyBtn',          s.copyBtn);
  set('twitterBtn',       s.twitterBtn);
  set('backLink',         s.backLink);

  document.title = `${r.koreanName} (${r.pronunciation}) | ${s.siteTitle}`;

  setupShare(r, lang);
}

function set(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setupShare(r, lang) {
  const s        = UI_STRINGS[lang];
  const shareUrl = window.location.href;

  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        copyBtn.textContent = s.copied;
        setTimeout(() => { copyBtn.textContent = s.copyBtn; }, 2000);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = s.copied;
        setTimeout(() => { copyBtn.textContent = s.copyBtn; }, 2000);
      });
    });
  }

  const twitterBtn = document.getElementById('twitterBtn');
  if (twitterBtn) {
    const text = s.tweetText(r.koreanName, r.pronunciation);
    twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ')}&url=${encodeURIComponent(shareUrl)}`;
  }
}
