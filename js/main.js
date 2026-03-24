// ============================================================
// index.html — form submission
// ============================================================
const form = document.getElementById('nameForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('nameInput').value.trim();
    const birth = document.getElementById('birthInput').value;
    if (!name || !birth) return;
    window.location.href = `result.html?name=${encodeURIComponent(name)}&birth=${encodeURIComponent(birth)}`;
  });
}

// ============================================================
// result.html — read params and display
// ============================================================
if (document.getElementById('koreanName')) {
  const params = new URLSearchParams(window.location.search);
  const name  = params.get('name');
  const birth = params.get('birth');

  if (!name || !birth) {
    window.location.href = 'index.html';
  } else {
    try {
      displayResult(generateKoreanName(name, birth));
    } catch (e) {
      window.location.href = 'index.html';
    }
  }
}

function displayResult(r) {
  const isJa = r.lang === 'ja';

  const seasonLabels = {
    en: { spring:'Spring', summer:'Summer', autumn:'Autumn', winter:'Winter' },
    ja: { spring:'春', summer:'夏', autumn:'秋', winter:'冬' },
  };
  const seasonIcons = { spring:'🌸', summer:'☀️', autumn:'🍂', winter:'❄️' };

  set('koreanName',       r.koreanName);
  set('hanja',            r.hanja);
  set('pronunciation',    r.pronunciation);
  set('nameMeaning',      r.nameMeaning);
  set('personality',      r.personality);
  set('seasonBadge',      `${seasonIcons[r.season]} ${seasonLabels[isJa ? 'ja' : 'en'][r.season]}`);
  set('inputName',        isJa ? `${r.inputName} さんの韓国語名` : `Korean name for ${r.inputName}`);
  set('nameIntro',        isJa ? 'あなたの韓国語名は' : 'Your Korean name is');
  set('meaningLabel',     isJa ? '名前の意味' : 'Name Meaning');
  set('personalityLabel', isJa ? 'あなたの性格' : 'Your Character');
  set('shareLabel',       isJa ? 'シェア' : 'Share');
  set('copyBtn',          isJa ? 'リンクをコピー' : 'Copy Link');
  set('twitterBtn',       isJa ? 'Xでシェア' : 'Share on X');
  set('backLink',         isJa ? '← 別の名前を試す' : '← Try another name');

  document.title = `${r.koreanName} (${r.pronunciation}) | 나의 한국어 이름은`;

  setupShare(r);
}

function set(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setupShare(r) {
  const shareUrl = window.location.href;
  const isJa = r.lang === 'ja';

  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const copied   = isJa ? 'コピー済み ✓' : 'Copied ✓';
      const original = isJa ? 'リンクをコピー' : 'Copy Link';
      navigator.clipboard.writeText(shareUrl).then(() => {
        copyBtn.textContent = copied;
        setTimeout(() => { copyBtn.textContent = original; }, 2000);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = copied;
        setTimeout(() => { copyBtn.textContent = original; }, 2000);
      });
    });
  }

  const twitterBtn = document.getElementById('twitterBtn');
  if (twitterBtn) {
    const text = isJa
      ? `私の韓国語名は「${r.koreanName}」(${r.pronunciation})です！ あなたも試してみて！`
      : `My Korean name is "${r.koreanName}" (${r.pronunciation})! Find yours too!`;
    twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ')}&url=${encodeURIComponent(shareUrl)}`;
  }
}
