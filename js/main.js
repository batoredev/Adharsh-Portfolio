/* Page behaviour: achievement folders, folder sheet, EEG wave, nav state, reveals. */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     Achievements, grouped into folders.
     Each item: t = title, m = meta line (optional).
     Add `link: "https://..."` to an item to make it clickable.
     ------------------------------------------------------------------ */
  const FOLDERS = [
    {
      id: 'awards', title: 'Competitions', tint: '#ffc46b', icon: 'trophy', trail: true,
      blurb: 'Quizzes, business events and olympiads.',
      groups: [
        { label: "IEC's Enterprise & Innovate 2026", items: [
          { t: 'Corporate Conundrum', m: 'First place' },
          { t: 'Auction', m: 'First place' },
          { t: 'Brand Race', m: 'Second place' },
          { t: 'Quiz', m: 'Second place' },
        ] },
        { label: 'Pharmacy', items: [
          { t: 'PharmaQuora Quiz', m: 'First place · 2026' },
          { t: 'PharmaQuora Legal Rx', m: 'Second place' },
          { t: 'Pharmacy Literacy Society Quiz', m: 'Runner-up · 2026' },
          { t: 'Pharmacy Week Quiz', m: 'Third place' },
          { t: 'ISPE Logo Mania', m: 'Third place (shared)' },
        ] },
        { label: 'School', items: [
          { t: 'Indian Navy Quiz', m: 'National finalist' },
          { t: 'NSEB & NSEA 2024', m: 'Qualified' },
          { t: 'National olympiads & heritage quizzes', m: 'Selected for Level II / III' },
        ] },
      ],
    },
    {
      id: 'leadership', title: 'Leadership', tint: '#8a7bff', icon: 'flag', trail: true,
      blurb: 'Roles across editorial boards, clubs and chapters.',
      groups: [
        { label: '2026 – 27', items: [
          { t: 'Joint Editor', m: 'EdBoard, MCOPS' },
          { t: 'Head of Writing', m: 'Manipal The Talk Network' },
          { t: 'Head of Graphics & Design', m: 'Hult Prize MAHE' },
          { t: 'Head of Graphics & Design', m: 'Rotaract Club of MAHE' },
        ] },
        { label: '2025 – 26', items: [
          { t: 'Recruited to four teams in first year', m: 'EdBoard · Hult Prize MAHE · MTTN (Writing) · ISPE (Networking)' },
        ] },
      ],
    },
    {
      id: 'certs', title: 'Certifications', tint: '#9fb4ff', icon: 'badge',
      blurb: 'Short courses in clinical practice and data science.',
      groups: [
        { label: '', items: [
          { t: 'Antimicrobial Stewardship: Improving Clinical Outcomes by Optimization of Antibiotic Practices', m: 'Stanford University School of Medicine' },
          { t: 'Data Science and AI', m: 'Indian Institute of Technology Madras · 8 weeks' },
          { t: 'Practical Biostatistics with R' },
        ] },
      ],
    },
  ];

  const ICONS = {
    flask: '<path d="M9 3h6M10 3v6.2L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9.2V3"/><path d="M7.4 15h9.2"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M16 5.5h3v1.5a3 3 0 0 1-3 3M8 5.5H5v1.5a3 3 0 0 0 3 3"/><path d="M12 13v3.5M8.5 20.5h7M9.5 16.5h5v4h-5z"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4.5h11.5l-2.2 4 2.2 4H5"/>',
    pen: '<path d="M4 20l4.2-1L19 8.2a2.1 2.1 0 0 0-3-3L5.2 15.8 4 20Z"/><path d="M14.5 6.8l2.8 2.8"/>',
    'pen-tool': '<path d="M12 3.5 18.5 10 15 18.5H9L5.5 10 12 3.5Z"/><circle cx="12" cy="11.5" r="1.8"/><path d="M12 3.5v6.2M9 21h6"/>',
    rocket: '<path d="M13.5 4.5c3.2-1.3 6-.9 6-.9s.4 2.8-.9 6l-5.6 5.6-5.1-5.1 5.6-5.6Z"/><path d="M7.9 10.1 4.5 11l-1 2.6 3.6.6M13.9 16.1l-.9 3.4-2.6 1-.6-3.6"/><circle cx="15.6" cy="8.4" r="1.4"/>',
    badge: '<circle cx="12" cy="9" r="5.2"/><path d="m9.2 13.6-1.2 7.4 4-2.1 4 2.1-1.2-7.4"/>',
    bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1v.1h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3Z"/>',
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (name) => `<svg viewBox="0 0 24 24">${ICONS[name] || ''}</svg>`;
  // Project folders (from js/work.js) come first; they supply their own count and body.
  FOLDERS.unshift(...(window.WORK_FOLDERS || []));
  const total = (f) => (f.count != null ? f.count : f.groups.reduce((n, g) => n + g.items.length, 0));
  const count = (f) => `${total(f)} ${f.unit || 'items'}`;

  /* ---------- Folder grid ---------- */
  const grid = document.getElementById('folders');
  if (grid) {
    grid.innerHTML = FOLDERS.map((f) => `
      <button class="folder reveal" type="button" data-folder="${f.id}" style="--tint:${f.tint}" aria-haspopup="dialog">
        <span class="folder-tab" aria-hidden="true"></span>
        <span class="folder-paper" aria-hidden="true"></span>
        <span class="folder-body">
          <span class="folder-top">
            <span class="folder-icon" aria-hidden="true">${svg(f.icon)}</span>
            <span class="folder-count">${count(f)}</span>
          </span>
          <span class="folder-title">${esc(f.title)}</span>
          <span class="folder-blurb">${esc(f.blurb)}</span>
        </span>
      </button>`).join('');
  }

  /* ---------- Folder sheet ---------- */
  const sheet = document.getElementById('sheet');
  const sheetIcon = document.getElementById('sheetIcon');
  const sheetTitle = document.getElementById('sheetTitle');
  const sheetCount = document.getElementById('sheetCount');
  const sheetBody = document.getElementById('sheetBody');
  let lastFocus = null;

  function itemHTML(it) {
    const title = it.link
      ? `<a class="it-t" href="${esc(it.link)}" target="_blank" rel="noopener">${esc(it.t)} ↗</a>`
      : `<span class="it-t">${esc(it.t)}</span>`;
    return `<li>${title}${it.m ? `<span class="it-m">${esc(it.m)}</span>` : ''}</li>`;
  }

  /* Generic sheet: used by the achievement folders and by the Work drawer (js/work.js).
     If the sheet is already open, the content swaps in place with a short transition. */
  let sheetTrail = null;
  function openSheet({ tint, iconHTML, kicker, title, bodyHTML, variant = '' }) {
    if (!sheet) return null;
    if (sheetTrail) { Trail.unmount(sheetTrail); sheetTrail = null; }
    const inner = sheet.querySelector('.sheet-inner');
    sheet.style.setProperty('--tint', tint);
    sheet.dataset.variant = variant;
    sheetIcon.innerHTML = iconHTML;
    sheetTitle.textContent = title;
    sheetCount.textContent = kicker;
    sheetBody.innerHTML = bodyHTML;
    if (sheet.open) {
      inner.classList.remove('swap');
      void inner.offsetWidth; // restart the swap animation
      inner.classList.add('swap');
    } else {
      inner.classList.remove('swap');
      lastFocus = document.activeElement;
      if (typeof sheet.showModal === 'function') sheet.showModal();
      else sheet.setAttribute('open', '');
    }
    inner.scrollTop = 0;
    return sheetBody;
  }

  function openFolder(id) {
    const f = FOLDERS.find((x) => x.id === id);
    if (!f) return;
    const body = openSheet({
      tint: f.tint,
      iconHTML: svg(f.icon),
      kicker: count(f),
      title: f.title,
      variant: f.bodyHTML ? 'project' : '',
      bodyHTML: f.bodyHTML ? f.bodyHTML() : f.trail ? trailHTML(f) : f.groups.map((g) => `
        <section class="sheet-group">
          ${g.label ? `<h4>${esc(g.label)}</h4>` : ''}
          <ul>${g.items.map(itemHTML).join('')}</ul>
        </section>`).join(''),
    });
    if (f.trail && body) sheetTrail = Trail.mount(body.querySelector('[data-trail]'), { scroller: sheet.querySelector('.sheet-inner'), at: 0.88 });
  }

  // A folder as a path: each group is a larger station, each entry a point after it.
  function trailHTML(f) {
    const rows = f.groups.flatMap((g) => [
      g.label ? `<li class="tr-group"><span class="tr-k">${esc(g.label)}</span></li>` : '',
      ...g.items.map((it) => `<li><span class="tr-h">${it.link ? `<a href="${esc(it.link)}" target="_blank" rel="noopener">${esc(it.t)} ↗</a>` : esc(it.t)}</span>${it.m ? `<span class="tr-role${/^(First|Winner)/.test(it.m) ? ' tr-win' : ''}">${esc(it.m)}</span>` : ''}</li>`),
    ]);
    return `<div class="trail sheet-trail" data-trail><ol class="trail-list">${rows.join('')}</ol></div>`;
  }

  function closeFolder() {
    if (!sheet) return;
    if (typeof sheet.close === 'function') sheet.close();
    else sheet.removeAttribute('open');
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-folder], [data-open-folder]');
    if (trigger) openFolder(trigger.dataset.folder || trigger.dataset.openFolder);
  });
  window.portfolioSheet = { open: openSheet, close: closeFolder };

  if (sheet) {
    document.getElementById('sheetClose').addEventListener('click', closeFolder);
    sheet.addEventListener('click', (e) => { if (e.target === sheet) closeFolder(); });
    sheet.addEventListener('close', () => {
      if (sheetTrail) { Trail.unmount(sheetTrail); sheetTrail = null; }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
  }

  /* ---------- EEG wave in the hero ---------- */
  const wave = document.getElementById('eegWave');
  const marker = document.getElementById('eegMarker');
  if (wave) {
    const W = 400, MID = 112, CURSOR = 262;
    const yAt = (x) => {
      const base = Math.sin(x * 0.045) * 16 + Math.sin(x * 0.11 + 1.1) * 7 + Math.sin(x * 0.27 + 2) * 2.5;
      // A sharp peak at the cursor: the 98.63% accuracy point sits at the top of the wave.
      const peak = Math.exp(-Math.pow((x - CURSOR) / 20, 2));
      return MID + base * (1 - peak) - peak * 46;
    };
    let d = '';
    for (let x = 0; x <= W; x += 4) d += `${x === 0 ? 'M' : 'L'}${x} ${yAt(x).toFixed(1)}`;
    wave.setAttribute('d', d);
    if (marker) {
      marker.style.left = `${(CURSOR / W) * 100}%`;
      marker.style.top = `${(yAt(CURSOR) / 220) * 100}%`;
    }
  }

  /* ---------- Trails: a wavy path drawn by scrolling ----------
     A [data-trail] holds an <ol class="trail-list">; every <li> is a point on the
     path. The path is drawn down to a reading line (a fraction of the scroll
     area: the page, or the folder sheet), easing toward it so it visibly draws in.
     Points switch on as the line passes them, and off again on the way back up.
     Page trails are mounted below; folder trails are mounted when a folder opens. */
  const Trail = (() => {
    const NS = 'http://www.w3.org/2000/svg';
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wideMQ = window.matchMedia('(min-width: 861px)');
    const live = new Set();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(() => relayout()) : null;
    let running = false;

    function layout(s) {
      const cs = getComputedStyle(s.el);
      const W = s.el.clientWidth, H = s.el.offsetHeight;
      const split = s.el.classList.contains('trail--split') && wideMQ.matches;
      const rail = split ? W / 2 : parseFloat(cs.getPropertyValue('--rail')) || 18;
      const amp = parseFloat(cs.getPropertyValue('--amp')) || 10;
      const nodeY = parseFloat(cs.getPropertyValue('--node-y')) || 9;
      // offsetTop (relative to the positioned .trail) ignores the reveal transform on hidden points.
      s.ys = s.items.map((li) => li.offsetTop + nodeY);

      // One cubic per gap between points; each bulges to the opposite side of the last.
      let d = `M${rail} 0`, py = 0;
      s.lens = s.ys.map((y, i) => {
        const dy = y - py, side = i % 2 ? -1 : 1, a = side * amp * Math.min(1, dy / 90);
        d += ` C${(rail + a).toFixed(1)} ${(py + dy * 0.3).toFixed(1)} ${(rail + a).toFixed(1)} ${(y - dy * 0.3).toFixed(1)} ${rail} ${y.toFixed(1)}`;
        py = y;
        s.ink.setAttribute('d', d);
        return s.ink.getTotalLength();
      });
      s.total = s.lens[s.lens.length - 1] || 0;
      s.svg.setAttribute('width', W);
      s.svg.setAttribute('height', H);
      s.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      s.track.setAttribute('d', d);
      s.ink.style.strokeDasharray = `${s.total} ${s.total}`;
      s.nodesG.innerHTML = s.ys.map((y, i) => {
        const big = s.items[i].classList.contains('tr-group');
        return `<circle class="trail-node${big ? ' trail-node--group' : ''}" cx="${rail}" cy="${y.toFixed(1)}" r="${big ? 6 : 4.5}"/>`;
      }).join('');
      s.nodes = [...s.nodesG.children];
    }

    // Where the reading line sits, in the trail's own coordinates.
    function target(s) {
      const box = s.scroller ? s.scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight };
      const t = box.top + box.height * s.at - s.el.getBoundingClientRect().top;
      const last = s.ys.length ? s.ys[s.ys.length - 1] : 0;
      // At the end of the scroll area, the last points can never reach the line: finish the path.
      const sc = s.scroller || document.scrollingElement;
      const atEnd = sc.scrollHeight - sc.clientHeight - sc.scrollTop < 4;
      const visible = s.el.getBoundingClientRect().top < box.top + box.height;
      if (atEnd && visible) return last + 1;
      return Math.max(-1, Math.min(last + 1, t));
    }

    function draw(s, line) {
      const { ys, lens, total } = s;
      let L = total;
      if (line <= 0) L = 0;
      else if (ys.length && line < ys[ys.length - 1]) {
        const i = ys.findIndex((y) => y > line);
        const y0 = i ? ys[i - 1] : 0, l0 = i ? lens[i - 1] : 0;
        L = l0 + (lens[i] - l0) * ((line - y0) / (ys[i] - y0 || 1));
      }
      s.ink.style.strokeDashoffset = (total - L).toFixed(1);
      const moving = L > 0 && L < total;
      s.head.classList.toggle('show', moving);
      if (moving) {
        const p = s.ink.getPointAtLength(L);
        s.head.setAttribute('cx', p.x.toFixed(1));
        s.head.setAttribute('cy', p.y.toFixed(1));
      }
      s.items.forEach((li, i) => {
        const on = line >= ys[i] - 2;
        li.classList.toggle('on', on);
        if (s.nodes[i]) s.nodes[i].classList.toggle('on', on);
      });
    }

    function tick() {
      let busy = false;
      live.forEach((s) => {
        const t = target(s);
        if (calm) s.cur = t;
        else {
          s.cur += (t - s.cur) * 0.14;
          if (Math.abs(t - s.cur) < 0.5) s.cur = t; else busy = true;
        }
        draw(s, s.cur);
      });
      running = busy;
      if (busy) requestAnimationFrame(tick);
    }
    function queue() { if (!running) { running = true; requestAnimationFrame(tick); } }
    function relayout() { live.forEach(layout); queue(); }

    function mount(el, { scroller = null, at = 0.72 } = {}) {
      if (!el) return null;
      const svgEl = document.createElementNS(NS, 'svg');
      svgEl.setAttribute('class', 'trail-svg');
      svgEl.setAttribute('aria-hidden', 'true');
      svgEl.setAttribute('focusable', 'false');
      svgEl.innerHTML = '<path class="trail-track"/><path class="trail-ink"/><g class="trail-nodes"></g><circle class="trail-head" r="3.5"/>';
      el.prepend(svgEl);
      const s = {
        el, scroller, at, cur: 0, svg: svgEl,
        track: svgEl.querySelector('.trail-track'), ink: svgEl.querySelector('.trail-ink'),
        nodesG: svgEl.querySelector('.trail-nodes'), head: svgEl.querySelector('.trail-head'),
        items: [...el.querySelectorAll('.trail-list > li')], ys: [], lens: [], total: 0, nodes: [],
      };
      live.add(s);
      layout(s);
      if (!calm) el.classList.add('is-live');
      if (ro) ro.observe(el);
      queue();
      return s;
    }
    function unmount(s) {
      if (!s) return;
      live.delete(s);
      if (ro) ro.unobserve(s.el);
    }

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', relayout, { passive: true });
    window.addEventListener('load', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    return { mount, unmount, queue };
  })();

  document.querySelectorAll('[data-trail]').forEach((el) => Trail.mount(el));

  // Folder sheets scroll on their own, so their trails follow the sheet's scroll.
  if (sheet) sheet.querySelector('.sheet-inner').addEventListener('scroll', Trail.queue, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 60}ms`; io.observe(el); });
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Active nav link ---------- */
  const links = [...document.querySelectorAll('.nav nav a')];
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.remove('active'));
        const a = byId.get(en.target.id);
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => navIO.observe(s));
  }

  /* ---------- Floating external links in the hero ---------- */
  const SOCIALS = [
    { name: 'Email', href: 'mailto:adharshkirtan5@gmail.com', color: '#ea4335',
      svg: '<path fill="#4285f4" d="M2 6.2v12.3A1.5 1.5 0 0 0 3.5 20h3v-9.3L2 7.4z"/><path fill="#34a853" d="M17.5 20h3a1.5 1.5 0 0 0 1.5-1.5V7.4l-4.5 3.3z"/><path fill="#ea4335" d="M6.5 10.7 12 14.8l5.5-4.1V5.6L12 9.7 6.5 5.6z"/><path fill="#fbbc04" d="M17.5 5.6v5.1L22 7.4V6.2c0-1.6-1.8-2.5-3-1.6z"/><path fill="#c5221f" d="M2 6.2v1.2l4.5 3.3V5.6L5 4.5C3.8 3.7 2 4.6 2 6.2z"/>' },
    { name: 'Medium', href: 'https://adharshkirtan.medium.com/', color: '#ffffff',
      svg: '<path fill="#f4f4f4" d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>' },
    { name: 'Substack', href: 'https://substack.com/@durscurtain', color: '#ff6719',
      svg: '<path fill="#ff6719" d="M22.54 8.24H1.46V5.41h21.08v2.83zM1.46 10.81V24L12 18.11 22.54 24V10.81H1.46zM22.54 0H1.46v2.84h21.08V0z"/>' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/adharshkirtan/', color: '#2f8cff',
      svg: '<rect x="2" y="2" width="20" height="20" rx="3.5" fill="#2f7fe0"/><path fill="#fff" d="M6.2 9.5h2.6V18H6.2zM7.5 5.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm3.1 3.9h2.5v1.2c.4-.7 1.3-1.4 2.7-1.4 2.7 0 3.2 1.8 3.2 4.1V18h-2.6v-4c0-1 0-2.2-1.4-2.2s-1.7 1.1-1.7 2.2v4h-2.7z"/>' },
    { name: 'Instagram', href: 'https://www.instagram.com/adhzrsh/', color: '#e1306c',
      svg: '<rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="url(#igGrad)" stroke-width="2.4"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#igGrad)" stroke-width="2.4"/><circle cx="17.3" cy="6.7" r="1.4" fill="url(#igGrad)"/>' },
    { name: 'GitHub', href: 'https://github.com/adharsh-github', color: '#ffffff',
      svg: '<path fill="#f4f4f4" d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3"/>' },
  ];

  const socials = document.getElementById('socials');
  if (socials) {
    const rand = (min, max) => min + Math.random() * (max - min);
    socials.innerHTML = SOCIALS.map((s) => {
      const external = s.href.startsWith('http');
      const glyph = `<svg class="soc-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${s.svg}</svg>`;
      // One clean row: every icon shares a baseline; only the float rhythm is randomised.
      const style = `--c:${s.color};--dur:${rand(4.5, 7.5).toFixed(2)}s;--delay:${rand(-7, 0).toFixed(2)}s`;
      return `<a class="soc" href="${esc(s.href)}" aria-label="${esc(s.name)}" style="${style}"${external ? ' target="_blank" rel="noopener"' : ''}>
          <span class="soc-icon">${glyph}</span>
          <span class="soc-reflect" aria-hidden="true">${glyph}</span>
          <span class="soc-label" aria-hidden="true">${esc(s.name)}</span>
        </a>`;
    }).join('');
  }

  /* ---------- Cursor light: a soft glow that follows the pointer, and glass cards that
     catch the light where the cursor sits. Mouse/trackpad only; never on touch. ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    const SPOT = '.panel, .intro, .folder-body, .nav, .stage';
    document.querySelectorAll(SPOT).forEach((el) => el.classList.add('spot'));

    let tx = innerWidth / 2, ty = innerHeight / 2, gx = tx, gy = ty, raf = 0, lit = null;
    const follow = () => {
      const k = calm ? 1 : 0.18;
      gx += (tx - gx) * k; gy += (ty - gy) * k;
      glow.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.4 ? requestAnimationFrame(follow) : 0;
    };
    const setLit = (el) => {
      if (el === lit) return;
      if (lit) lit.classList.remove('lit');
      lit = el;
      if (el) el.classList.add('lit');
    };

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('on');
      const el = e.target instanceof Element ? e.target.closest('.spot') : null;
      setLit(el);
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
        el.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
      }
      if (!raf) raf = requestAnimationFrame(follow);
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => { glow.classList.remove('on'); setLit(null); });
  }

  /* ---------- Background parallax: streaks drift at a fraction of scroll speed ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rootStyle = document.documentElement.style;
    let ticking = false;
    const update = () => { rootStyle.setProperty('--sy', (window.scrollY * 0.06).toFixed(1)); ticking = false; };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
