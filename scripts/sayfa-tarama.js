// Tarayıcıda çalışır, sayfayı değiştirmez. Sonuçlar bulgu değil adaydır; yargı SKILL.md'de.
(() => {
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const cut = (s, n = 160) => { s = clean(s); return s.length > n ? s.slice(0, n) + '…' : s; };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && c.opacity !== '0';
  };
  const parseColor = (s) => {
    const m = (s || '').match(/[\d.]+/g);
    if (!m || m.length < 3) return null;
    return { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const c = parseColor(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0.5) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const contrast = (el) => {
    const fg = parseColor(getComputedStyle(el).color);
    if (!fg) return null;
    const a = lum(fg), b = lum(bgOf(el));
    return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(1);
  };
  const where = (el) => {
    const parts = [];
    for (let e = el; e && e !== document.body && parts.length < 3; e = e.parentElement) {
      parts.unshift(e.tagName.toLowerCase() + (e.id ? '#' + e.id : ''));
    }
    return parts.join(' > ');
  };
  const labelOf = (input) => {
    const l = input.labels && input.labels[0];
    if (l) return clean(l.innerText);
    return clean(input.getAttribute('aria-label') || (input.parentElement && input.parentElement.innerText) || input.name);
  };

  // Önceden seçili kutular. Görünmeyen özel kutular da sayılır, çünkü çoğu tasarım sistemi gerçek input'u gizler.
  const preselected = [...document.querySelectorAll('input[type=checkbox],input[type=radio],[role=checkbox][aria-checked=true],[role=switch][aria-checked=true]')]
    .filter((i) => i.checked || i.getAttribute('aria-checked') === 'true')
    .map((i) => ({ type: i.type || i.getAttribute('role'), label: cut(labelOf(i)), required: !!i.required, where: where(i) }));

  // Kabul ve ret ifadeleri yan yanaysa görsel farkını ölç.
  const ACCEPT = /kabul|onayl|izin ver|tümüne izin|accept|allow|agree|hemen başla|devam et|kodu al|indir|abone ol|satın al/i;
  const DECLINE = /reddet|hayır|şimdi değil|daha sonra|vazgeç|iptal|tercih|ayarlar|yönet|kapat|istemiyorum|decline|reject|no thanks|not now|later|manage/i;
  const clickable = [...document.querySelectorAll('button,a,[role=button],input[type=button],input[type=submit]')].filter(visible);
  const metrics = (el) => {
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    const bg = parseColor(c.backgroundColor);
    return { text: cut(el.innerText || el.value, 60), fontPx: parseFloat(c.fontSize), area: Math.round(r.width * r.height), contrast: contrast(el), filled: !!(bg && bg.a > 0.5) };
  };
  const choicePairs = [];
  const seen = new Set();
  clickable.forEach((el) => {
    const t = clean(el.innerText || el.value);
    if (!t || t.length > 60 || !DECLINE.test(t) || ACCEPT.test(t)) return;
    let box = el.parentElement;
    for (let depth = 0; box && depth < 4; depth++, box = box.parentElement) {
      const acc = [...box.querySelectorAll('button,a,[role=button]')].filter((x) => x !== el && visible(x) && ACCEPT.test(clean(x.innerText)) && clean(x.innerText).length <= 60);
      if (acc.length) {
        const key = t + '|' + clean(acc[0].innerText);
        if (!seen.has(key)) {
          seen.add(key);
          const a = metrics(acc[0]), d = metrics(el);
          choicePairs.push({ accept: a, decline: d, areaRatio: d.area ? +(a.area / d.area).toFixed(1) : null, where: where(box) });
        }
        break;
      }
    }
  });

  // Küçük ya da soluk koşul metinleri ve aday ifadeler, metin düğümü düzeyinde.
  const TERMS = /taahhüt|otomatik|yenilen|cayma|iptal|ücret|bedel|tahsil|faturan|sözleşme|kampanya|\d+\.?\s*ay(dan| sonra)|sonra(sında)?\s+\d|geçerli|hizmet bedeli|komisyon|auto-?renew|commitment|cancel/i;
  const PHRASES = [
    ['aciliyet', /son \d+ (saat|gün|dakika)|bugün bitiyor|acele et|kaçırma|sınırlı süre|süre doluyor|hurry|ends (today|soon)|limited time/i],
    ['kıtlık', /son \d+ (adet|paket|oda|koltuk|kişi)|kalan (\d+|adet|oda|koltuk|stok|paket|kontenjan)|tükeniyor|stokta|\bonly \d+ left/i],
    ['sosyal kanıt', /şu an \d|\d+[.,]?\d* kişi (izliyor|aldı|baktı|inceliyor|seçti|tercih)|en çok (tercih|satan)|en popüler|people (are )?(watching|viewing)|most popular/i],
    ['utandırma', /hayır,? .{3,60}(seviyorum|istemiyorum|sevmiyorum|umurumda)|no thanks,? i/i],
    ['korkutma', /kaybedeceksin|silinecek|kaybolacak|risk altında|you will lose|at risk/i],
    ['ücretsiz vaadi', /ücretsiz|bedava|free trial|\bfree\b/i]
  ];
  const finePrint = [], phrases = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seenText = new Set();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    const t = clean(n.nodeValue);
    if (!t || t.length < 3 || !el || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName) || seenText.has(t)) continue;
    seenText.add(t);
    const inClosed = !!el.closest('details:not([open])');
    if (!visible(el) && !inClosed) continue;
    const c = getComputedStyle(el);
    const px = parseFloat(c.fontSize), con = contrast(el);
    if (TERMS.test(t) && (px <= 12 || (con !== null && con < 3) || inClosed)) {
      finePrint.push({ text: cut(t, 220), fontPx: px, contrast: con, closed: inClosed, where: where(el) });
    }
    PHRASES.forEach(([kind, re]) => { if (re.test(t)) phrases.push({ kind, text: cut(t), where: where(el) }); });
  }

  // Değişen sayaç adayları: mm:ss biçimi.
  const timers = [...document.querySelectorAll('body *')]
    .filter((e) => e.children.length === 0 && /^\s*\d{1,2}:\d{2}(:\d{2})?\s*$/.test(e.textContent || '') && visible(e))
    .slice(0, 10).map((e) => ({ text: clean(e.textContent), context: cut(e.parentElement && e.parentElement.innerText, 100), where: where(e) }));

  // Açılması gereken alanlar.
  const closed = [
    ...[...document.querySelectorAll('details:not([open]) > summary')].map((e) => cut(e.innerText, 60)),
    ...[...document.querySelectorAll('[aria-expanded=false]')].filter(visible).map((e) => cut(e.innerText || e.getAttribute('aria-label'), 60)),
    ...clickable.filter((e) => /^(detaylar?|detaylı bilgi|devamını oku|daha fazla|tümünü gör|koşullar|details|read more|show more)$/i.test(clean(e.innerText))).map((e) => cut(e.innerText, 60))
  ].filter(Boolean);
  const tabs = [...document.querySelectorAll('[role=tab],[role=radio],label,button')]
    .filter((e) => visible(e) && /^\d+\s*(ay|yıl|hafta|month|year)s?$|^(aylık|yıllık|monthly|yearly)\*?$/i.test(clean(e.innerText)))
    .map((e) => clean(e.innerText));

  // Görünen pencere ve bantlar.
  const overlays = [...document.querySelectorAll('body *')].filter((e) => {
    const c = getComputedStyle(e);
    if (!(c.position === 'fixed' || e.getAttribute('role') === 'dialog' || e.tagName === 'DIALOG')) return false;
    if (!visible(e)) return false;
    const r = e.getBoundingClientRect();
    return r.width * r.height > 20000 && clean(e.innerText).length > 10;
  }).slice(0, 6).map((e) => ({
    text: cut(e.innerText, 200),
    buttons: [...e.querySelectorAll('button,a,[role=button]')].filter(visible).slice(0, 6).map(metrics),
    where: where(e)
  }));

  // Çıkış ve koşul sayfalarına giden linkler.
  const exitLinks = [...document.querySelectorAll('a[href]')]
    .filter((a) => /iptal|cayma|sözleşme|koşul|şart|gizlilik|aydınlatma|çerez|cookie|sss|sıkça|yardım|destek|help|faq|terms|privacy|cancel|\.pdf/i.test(clean(a.innerText) + ' ' + a.getAttribute('href')))
    .slice(0, 25).map((a) => ({ text: cut(a.innerText, 60), href: a.href }));

  return { url: location.href, title: document.title, preselected, choicePairs, finePrint: finePrint.slice(0, 30), phrases: phrases.slice(0, 30), timers, closed: [...new Set(closed)].slice(0, 30), tabs: [...new Set(tabs)], overlays, exitLinks };
})();
