/* Work: a personal archive.
     - Two featured projects (ADR reporting prototype, EEG / Approximate Entropy) in #workNotes
     - Modelling & experiments and Hypotheses & ideas, filed as folders (window.WORK_FOLDERS)
     - Things I've written: a horizontal strip in #writingNotes, just before Contact
   (Research & experience is a static trail further down the page.)
   The detail drawer reuses the sheet from main.js via window.portfolioSheet.
   Loaded before main.js so the shared reveal-on-scroll picks these elements up. */
(() => {
  'use strict';

  const root = document.getElementById('workNotes');
  if (!root) return;

  const LINKS = {
    medium: 'https://adharshkirtan.medium.com/',
    linkedin: 'https://www.linkedin.com/in/adharshkirtan/',
    gh: 'https://github.com/adharsh-github/',
  };

  /* ------------------------------------------------------------------
     1. Featured project
     ------------------------------------------------------------------ */
  const FEATURED = {
    id: 'adr', short: 'ADR reporting prototype', kicker: 'Featured project · 2026',
    tint: '#5fd6c0', icon: 'build', openLabel: 'Read about the prototype',
    title: 'Making adverse drug reaction reporting a little easier.',
    summary: 'An AI-assisted pharmacovigilance prototype that extracts information from prescriptions, guides users through adaptive questions and organises submissions through a shared reviewer dashboard.',
    labels: ['Pharmacovigilance', 'AI information extraction', 'Adaptive questioning', 'Reviewer dashboard'],
    status: 'Working prototype · demonstrated to faculty · under discussion with the PvPI team at KMC',
    origin: 'The idea came out of a MedSafe session where AI-assisted ADR reporting came up. I sketched a workflow and, with a collaborator, built a working prototype in about a week.',
    flow: [
      ['Read', 'Prescriptions and clinical documents come in'],
      ['Extract', 'AI pulls out the details a report needs'],
      ['Ask', 'Adaptive follow-up questions fill the gaps'],
      ['Verify', 'Extracted information is checked'],
      ['Review', 'Submissions land on a shared reviewer dashboard'],
    ],
    worked: [
      'Proposed the workflow: extract information from prescriptions and clinical documents, ask adaptive follow-up questions, then verify what was extracted.',
      'Built the prototype with a collaborator, including a shared dashboard for ADR reporting officials.',
      'Demonstrated it to faculty; it has been taken up for discussion with the PvPI team at KMC.',
    ],
    facts: [['Status', 'Working prototype'], ['Area', 'Pharmacovigilance'], ['Built', 'About a week, with a collaborator']],
  };

  /* ------------------------------------------------------------------
     2. Things I've written. Links and descriptions come from the actual
     articles (Medium feed). Photos: Wikimedia Commons, credited per tile.
     ------------------------------------------------------------------ */
  const C = (artist, license, page) => ({ artist, license, page });
  const WRITING = [
    { key: 'coherence', size: 'wide', cat: 'Philosophy', title: 'The Coherence We Crave',
      desc: 'On Olive Ridley turtles, the weight of complexity, and whether consciousness was worth the trouble.',
      href: 'https://adharshkirtan.medium.com/the-coherence-we-crave-fc566f26e03c',
      credit: C('Bethany McCarter', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Olive_Ridley_Sea_Turtle_Hatchlings.jpg') },
    { key: 'bhoot-kola', size: 'mid', cat: 'Culture', pos: '55% 30%', title: 'Bhoot Kola', platform: 'Medium · club publication',
      desc: 'A piece written around Bhoota Kola, the ritual performance tradition of coastal Karnataka.',
      href: LINKS.medium, linkLabel: 'Find it on Medium',
      credit: C('Vishwanatha Badikana', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Bhoota_Kola_Kallurti_Kola_at_Badikana_Sullia_Karnataka_India_17.jpg') },
    { key: 'two-objects', size: 'third', cat: 'Observation', pos: '50% 72%', title: 'two objects and some wind',
      desc: 'On a clothesline, a chair, and the two different ways I keep getting people wrong.',
      href: 'https://adharshkirtan.medium.com/two-objects-and-some-wind-edc2990267e1',
      credit: C('Maoileann', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Clothes_Line-1025976,_Dingle_Peninsula,_Co._Kerry,_Ireland.jpg') },
    { key: 'bananas', size: 'third', cat: 'Memoir', title: 'Bananas for the Cow, Stories for Me',
      desc: 'Childhood summers at my grandmother’s house, and the woman with the vegetable cart at the corner of the street.',
      href: 'https://adharshkirtan.medium.com/bananas-for-the-cow-stories-for-me-09a5898d2ef3',
      credit: C('Nagarjun', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Vendor_of_greens.jpg') },
    { key: 'ghost-songs', size: 'third', cat: 'Personal essay', title: 'The Ghost That Smells like Rubber Bands',
      desc: 'On playing the same songs on repeat until a song becomes a place, and what happens when you stop.',
      href: 'https://adharshkirtan.medium.com/the-ghost-that-smells-like-rubber-bands-ab04571abd1a',
      credit: C('Jacek Halicki', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:2023_Kaseta_VHS,_magnetofonowa_i_minikaseta.jpg') },
    { key: 'photons-neurons', size: 'mid', cat: 'Philosophy · Politics', title: 'What Photons and Neurons Know About Revolution?',
      desc: 'On revolution, reciprocal revision, and the systems that refuse to be answerable.',
      href: 'https://adharshkirtan.medium.com/what-photons-and-neurons-know-about-revolution-5767e6ae09b2',
      credit: C('Heiti Paves', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Varbuss.jpg') },
    { key: 'dravidian', size: 'wide', cat: 'Politics', pos: '50% 78%', title: 'The Dravidian Zero Point',
      desc: 'Why left and right change without parties moving. It started with a question at home during the 2026 Tamil Nadu Assembly elections.',
      href: 'https://adharshkirtan.medium.com/the-dravidian-zero-point-d83d26d4b879',
      credit: C('Jan Van Ryne (1712–60)', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Fort_St._George,_Chennai.jpg') },
    { key: 'destroy-universe', size: 'half', cat: 'Philosophy', title: 'Why Humans Exist to Destroy the Universe',
      desc: 'Religion, existentialism, absurdism and nihilism all look inward for meaning. This one starts from entropy instead.',
      href: 'https://adharshkirtan.medium.com/why-humans-exist-to-destroy-the-universe-318baee0d7ae',
      credit: C('NASA, ESA and the Hubble Heritage Team', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg') },
    { key: 'flags', size: 'half', cat: 'Essay', pos: '50% 22%', title: 'The Flags We Die For',
      desc: 'On looking up from the news, noticing how beautiful the world is, and asking what people are really dying for.',
      href: 'https://adharshkirtan.medium.com/the-flags-we-die-for-fafe43708966',
      credit: C('Winniepix', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:British_and_American_flags_fluttering_in_the_breeze_against_a_blue_sky_(49635566892).jpg') },
    { key: 'matrix', size: 'third', cat: 'Cultural critique', title: 'The Matrix of Human Illusions',
      desc: 'Late-night thoughts on the shared fictions we live inside: time, money, borders, and the myths we worship.',
      href: 'https://adharshkirtan.medium.com/the-matrix-of-human-illusions-time-money-borders-and-the-myths-we-worship-fb0f01b02e30',
      credit: C('Alvin Jewett Johnson (1866)', 'Public domain', 'https://commons.wikimedia.org/wiki/File:1866_Johnson_Chart_of_World_Time_Zones,_from_Washington_-_Geographicus_-_TimeZones-johnson-1866.jpg') },
    { key: 'imec', size: 'third', cat: 'Geopolitics', title: 'India’s Global Power Move You Probably Missed',
      desc: 'The India–Middle East–Europe Economic Corridor, and why it offers an alternative to the Suez route.',
      href: 'https://adharshkirtan.medium.com/indias-global-power-move-you-probably-missed-cd8d9b0da22f',
      credit: C('Andrew Thomas', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:%22CMA_CGM_WAGNER%22_IMO-_9280665_-_CONTAINER_SHIP_65247_tons,_Mumbai_-_India._(13906868747).jpg') },
    { key: 'petrichor', size: 'third', cat: 'Poem', title: 'Petrichor', platform: 'Medium · MTTN',
      desc: 'A poem written for NaPoWriMo, National Poetry Writing Month.',
      href: 'https://medium.com/@mttn/petrichor-1b529dad8982',
      credit: C('Wikimedia Commons contributor', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Toprak_Kokusu.jpg') },
  ];
  const ALSO_WRITTEN = [
    { t: 'Axiom of Happiness', src: 'Medium · MTTN', href: 'https://medium.com/@mttn/the-axiom-of-happiness-ab8ce0c1522e' },
    { t: 'Things We Pretend Don’t Shape Us', src: 'Medium · MTTN', href: 'https://medium.com/@mttn/things-we-pretend-dont-shape-us-but-do-4cb595a9644b' },
    { t: 'The Spice Paradox', src: 'Medium', href: LINKS.medium },
    { t: 'Lost Grains, Lost Independence', src: 'Medium', href: LINKS.medium },
    { t: 'Why Are We Powerful?', src: 'Medium', href: LINKS.medium },
    { t: 'The Hypocrisy of Faith', src: 'Medium', href: LINKS.medium },
    { t: 'The Woman at the Corner of the Street', src: 'Anthology · Beside Us Is A Co-Passenger (Paperoin)' },
    { t: 'Geometry of a Tumbled Glass', src: 'Anthology · Life in a Kaleidoscope (Paperoin)' },
  ];

  /* ------------------------------------------------------------------
     3. Hypotheses & ideas. Nature and status stated plainly.
     ------------------------------------------------------------------ */
  const IDEAS = [
    { nature: 'Hypothesis', status: 'Abstract drafted and shared with a professor for feedback. Not tested.',
      img: 'assets/ideas/xeno.jpg', credit: C('Wikimedia Commons', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Sow_and_five_piglets.jpg'),
      title: 'Evolutionary trade-offs in xenotransplantation donor populations',
      text: 'A class discussion on xenotransplantation left me with a question: what happens, over generations, to a donor population bred for compatibility? The hypothesis looks at how natural selection, reproductive fitness and physiological trade-offs could affect the long-term compatibility of donor organs, with a hypothetical “two-barn” framework to illustrate it.' },
    { nature: 'Exploration',
      img: 'assets/ideas/p4.jpg', credit: C('spotreporting', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/29792566@N08/5495492908'),
      title: 'Traditional medicine and P4 medicine',
      text: 'Exploring where traditional systems of medicine meet P4 medicine: predictive, preventive, personalised and participatory.' },
    { nature: 'Policy proposal', status: 'Framework proposed.',
      img: 'assets/ideas/rare.jpg', credit: C('Julien Harneis', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/16935515@N00/4811518231'),
      title: 'A multi-payer framework for rare-disease access in India',
      text: 'Why people with NF1, aHUS and PNH struggle to get treatment, and a sketch of a financing model in which public and private payers share the cost, with an eye on health-system design and equitable access.' },
  ];

  /* ------------------------------------------------------------------
     4. Modelling & experiments. Figures are the original plots from the
     R repositories; numbers are copied from their READMEs.
     ------------------------------------------------------------------ */
  const MODELS = [
    { id: 'diabetes', layout: 'plate-left', short: 'Diabetes risk factors',
      kicker: 'R · logistic regression · Pima Indians Diabetes Dataset',
      title: 'What drives diabetes risk, and how much can a simple model catch?',
      summary: 'Glucose, BMI and age in a logistic regression. Glucose came out as the strongest predictor. The model separates the groups reasonably well, but its sensitivity is only around 56%, so on its own it would miss too many cases to be a screening tool.',
      results: 'AUC ≈ 0.83 · accuracy ≈ 77% · sensitivity ≈ 56%',
      plates: [{ src: 'assets/work/diabetes-roc.png', w: 480, h: 480, cap: 'ROC curve' }],
      worked: [
        'Treated physiologically impossible zeros in glucose, BMI and blood pressure as missing values.',
        'Compared the groups and ran a Welch’s t-test on glucose (p < 0.001).',
        'Fitted a logistic regression on glucose, BMI and age and read it through odds ratios.',
        'Evaluated it with a confusion matrix and an ROC curve, and noted that moderate sensitivity limits it for screening.',
      ],
      links: [{ label: 'Code and plots on GitHub', href: `${LINKS.gh}diabetes-risk-analysis-r` }] },
    { id: 'ckd', layout: 'plates-right', short: 'CKD risk factors',
      kicker: 'R · binary & ordinal logistic regression · UCI CKD dataset (200 patients)',
      title: 'Which biomarkers mark chronic kidney disease, and which track how far it has gone?',
      summary: 'A follow-up to the diabetes work with a fuller pipeline: association tests, a binary model for CKD status and an ordinal model for stage. Haemoglobin was the strongest single classifier of CKD; blood urea dominated severity.',
      results: 'AUC 0.989 · accuracy 95.2% · sensitivity 96.6% · specificity 93.1% (threshold 0.50)',
      plates: [
        { src: 'assets/work/ckd-roc.png', w: 800, h: 700, cap: 'ROC curve' },
        { src: 'assets/work/ckd-threshold.png', w: 1500, h: 900, cap: 'Metrics across classification thresholds' },
      ],
      worked: [
        'Standardised missing-value codes and encoded the clinical variables as ordered factors.',
        'Tested associations with chi-square and Fisher’s exact tests (simulated p-values).',
        'Modelled CKD status with binary logistic regression and CKD stage with ordinal logistic regression (MASS::polr).',
        'Evaluated with ROC/AUC and a threshold sweep from 0.10 to 0.90 to show the sensitivity–specificity trade-off.',
        'Flagged the limits: complete separation in albumin, dropped observations in the ordinal model, and a small dataset.',
      ],
      links: [{ label: 'Code and plots on GitHub', href: `${LINKS.gh}chronic-kidney-disease-analysis.r` }] },
    { id: 'heart', layout: 'compact', short: 'Heart disease risk',
      kicker: 'R · logistic regression',
      title: 'A heart disease risk model',
      summary: 'Logistic regression on clinical parameters, read through odds ratios, with attention to where a screening threshold should sit between sensitivity and specificity.',
      results: 'AUC ≈ 0.83',
      worked: ['Built a logistic regression model in R on clinical parameters.', 'Interpreted odds ratios and analysed the sensitivity–specificity trade-off for screening thresholds.'],
      links: [{ label: 'Code on GitHub', href: `${LINKS.gh}heart_diseases` }] },
    { id: 'docking', layout: 'compact', short: 'Docking of gliptins',
      kicker: 'Molecular docking · with a collaborator',
      title: 'Molecular docking of gliptins',
      summary: 'A docking study of DPP-4 inhibitors, done with a collaborator and shared on LinkedIn.',
      steps: ['Gliptins (ligands)', 'DPP-4 (target)', 'Docking', 'Binding poses'],
      img: { src: 'assets/work/docking.jpg', w: 900, h: 956,
        alt: 'Ribbon model of a protein with a small-molecule inhibitor bound in its active site',
        cap: 'A serine-protease inhibitor complex (DPP-4’s enzyme family) · illustrative, not from this study',
        credit: C('Enzymlogic', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/101755654@N08/13329148744') },
      worked: ['A docking study of gliptins (DPP-4 inhibitors), done with a collaborator.', 'Shared on LinkedIn.'],
      links: [{ label: 'See the post on LinkedIn', href: LINKS.linkedin }] },
  ];

  /* Second featured project: the EEG / Approximate Entropy research. */
  const FEATURED_EEG = {
    id: 'eeg', short: 'Approximate Entropy on EEG', kicker: 'Featured research · Oct 2024 – May 2025',
    tint: '#6f9bff', openLabel: 'Read about the research',
    title: 'Putting a number on how regular a brain signal is.',
    summary: 'The analysis behind the seizure-detection paper. Approximate Entropy measures how predictable a signal is; seizures change that regularity, so the system watches EEG recordings for the change as it happens.',
    labels: ['Biomedical signals', 'Approximate Entropy', 'EEG', 'Real-time detection'],
    status: 'Co-authored paper · presented at ICCCNet 2024, Manchester Metropolitan University · published by Springer',
    results: '98.63% accuracy · 96.54% sensitivity · 97.85% specificity (as reported in the paper)',
    worked: [
      'Developed a real-time EEG-based seizure detection system using Approximate Entropy modelling.',
      'Explored what it could mean for catching neurological events early and for real-time monitoring.',
      'Co-authored the paper, presented at ICCCNet 2024 at Manchester Metropolitan University and published by Springer.',
    ],
  };

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const prng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // EEG channels with a rhythmic burst and a sliding Approximate Entropy window. An illustration, not data.
  function eegSVG() {
    const W = 1100, H = 260, rnd = prng(11), CH = 6, a = W * 0.56, b = W * 0.8;
    let out = `<rect class="ill-fill" x="${a}" y="8" width="${b - a}" height="${H - 16}" rx="10"/>`;
    for (let c = 0; c < CH; c++) {
      const y0 = 30 + c * ((H - 60) / (CH - 1)), ph = rnd() * 6.28;
      let d = '';
      for (let x = 0; x <= W; x += 3) {
        const env = x > a && x < b ? Math.sin((Math.PI * (x - a)) / (b - a)) : 0;
        const bg = Math.sin(x * 0.11 + ph) * 3 + Math.sin(x * 0.29 + ph * 1.7) * 2 + (rnd() - 0.5) * 3.5;
        const burst = env * (Math.sin(x * 0.21 + ph) * 12 + Math.sin(x * 0.63 + ph) * 4);
        d += `${x ? 'L' : 'M'}${x} ${(y0 + bg * (1 - env * 0.5) + burst).toFixed(1)}`;
      }
      out += `<path class="ill-line${c === 2 ? ' ill-accent' : ''}" d="${d}"/>`;
    }
    out += `<g class="apen" data-apen style="transform: translateX(${(a - 90).toFixed(0)}px)"><rect x="0" y="4" width="64" height="${H - 8}" rx="8"/><text class="ill-text" x="0" y="${H + 18}">ApEn window</text></g>`;
    return `<svg class="ill ill-eeg" viewBox="0 0 ${W} ${H + 26}" aria-hidden="true" focusable="false">${out}</svg>`;
  }

  const flowHTML = (steps, numbered) => `<ol class="flow${numbered ? ' flow--numbered' : ''}">${steps.map(([b, s], i) => `<li>${numbered ? `<i>${String(i + 1).padStart(2, '0')}</i>` : ''}<b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('')}</ol>`;
  const openBtn = (id, label) => `<button class="note-open" type="button" data-work-open="${id}">${esc(label)} <span aria-hidden="true">→</span></button>`;
  const photoHTML = (p) => `<figure class="mo-photo"><div class="mo-photo-frame"><img src="${p.src}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" loading="lazy"></div><figcaption><span>${esc(p.cap)}</span><a class="tile-credit" href="${esc(p.credit.page)}" target="_blank" rel="noopener">Image: ${esc(p.credit.artist)} · ${esc(p.credit.license)}</a></figcaption></figure>`;
  const plateHTML = (p) => `<figure class="plate"><div class="plate-paper"><img src="${p.src}" alt="${esc(p.cap)} from the R analysis" width="${p.w}" height="${p.h}" loading="lazy"></div><figcaption>${esc(p.cap)} · original plot from the R analysis</figcaption></figure>`;

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */
  const featured = (f) => `
    <section class="wblock feat feat--${f.id}" aria-labelledby="feat-${f.id}" data-work="${f.id}">
      <div class="feat-head reveal">
        <p class="feat-kicker">${esc(f.kicker)}</p>
        <h3 class="feat-title" id="feat-${f.id}">${esc(f.title)}</h3>
        <p class="feat-summary">${esc(f.summary)}</p>
        <p class="feat-labels">${f.labels.map(esc).join('<span aria-hidden="true"> / </span>')}</p>
        <div class="feat-foot">
          <p class="feat-status">${esc(f.status)}</p>
          ${f.results ? `<p class="mo-results">${esc(f.results)}</p>` : ''}
          ${openBtn(f.id, f.openLabel)}
        </div>
      </div>
      <div class="feat-figure reveal">${f.flow
        ? `${flowHTML(f.flow, true)}<p class="fig-cap">How the prototype works · diagram</p>`
        : `${eegSVG()}<p class="fig-cap">Illustration · not recorded data</p>`}</div>
    </section>`;

  const tile = (w) => {
    const platform = w.platform || 'Medium';
    const link = w.href
      ? `<a class="tile-link" href="${esc(w.href)}" target="_blank" rel="noopener">${esc(w.linkLabel || 'Read')} <span aria-hidden="true">↗</span></a>`
      : '';
    return `
      <article class="tile tile--${w.size === 'wide' || w.size === 'mid' ? 'wide' : 'std'}${w.href ? ' has-link' : ''}">
        <div class="tile-media"><div class="tile-zoom"><img src="assets/writing/${w.key}.jpg" alt="" loading="lazy" draggable="false"${w.pos ? ` style="object-position:${w.pos}"` : ''}></div></div>
        <div class="tile-body">
          <p class="tile-meta"><span>${esc(w.cat)}</span><span>${esc(platform)}</span></p>
          <h4 class="tile-title">${w.href ? `<a class="tile-stretch" href="${esc(w.href)}" target="_blank" rel="noopener">${esc(w.title)}</a>` : esc(w.title)}</h4>
          <p class="tile-desc">${esc(w.desc)}</p>
          <div class="tile-foot">${link}<a class="tile-credit" href="${esc(w.credit.page)}" target="_blank" rel="noopener">Photo: ${esc(w.credit.artist)} · ${esc(w.credit.license)}</a></div>
        </div>
      </article>`;
  };

  const writing = () => `
    <section class="wblock wr" aria-labelledby="wrTitle">
      <header class="wblock-head wr-head reveal">
        <div>
          <p class="eyebrow">Writing</p>
          <h3 class="wblock-title" id="wrTitle">Things I’ve written.</h3>
          <p class="wblock-note">Essays, observations, a poem, and the occasional detour into politics and philosophy.</p>
        </div>
        <div class="strip-ctrl">
          <button type="button" class="strip-btn" data-strip="-1" aria-label="Previous essays"><span aria-hidden="true">←</span></button>
          <button type="button" class="strip-btn" data-strip="1" aria-label="Next essays"><span aria-hidden="true">→</span></button>
        </div>
      </header>
      <div class="strip reveal" tabindex="0" role="region" aria-label="Essays. Scroll sideways, drag, or use the arrow buttons.">
        <div class="strip-track">${WRITING.map(tile).join('')}</div>
      </div>
      <div class="strip-progress" aria-hidden="true"><span></span></div>
      <div class="also reveal">
        <p class="also-label">Also written</p>
        <ul class="also-list">${ALSO_WRITTEN.map((x) => `<li>${x.href ? `<a href="${esc(x.href)}" target="_blank" rel="noopener">` : '<span class="also-item">'}<span class="also-t">${esc(x.t)}</span><span class="also-src">${esc(x.src)}</span>${x.href ? '</a>' : '</span>'}</li>`).join('')}</ul>
      </div>
    </section>`;

  /* Folder contents. Everything except the two featured projects is filed by
     theme in the folder grid (main.js renders the folders, these supply the
     inside). A project's "Read the notes" swaps the open folder for its drawer. */
  const linkHTML = (l) => `<a class="mo-link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`;
  const thumbOf = (m) => (m.img ? m.img.src : m.plates ? m.plates[0].src : '');

  const modelsFolder = () => `
    <p class="pf-note">The plots are the originals from the R analyses; the numbers come straight from each project’s write-up.</p>
    <ul class="pf-list">${MODELS.map((m) => `
      <li class="pf-item${thumbOf(m) ? '' : ' no-thumb'}">
        ${thumbOf(m) ? `<button class="pf-thumb pf-thumb--paper" type="button" data-work-open="${m.id}" aria-label="Open notes: ${esc(m.short)}"><img src="${thumbOf(m)}" alt="" loading="lazy"></button>` : ''}
        <div class="pf-main">
          <p class="mo-kicker">${esc(m.kicker)}</p>
          <h4 class="pf-title">${esc(m.title)}</h4>
          <p class="pf-text">${esc(m.summary)}</p>
          ${m.results ? `<p class="mo-results">${esc(m.results)}</p>` : ''}
          <div class="mo-actions">${openBtn(m.id, 'Read the notes')}${(m.links || []).map(linkHTML).join('')}</div>
        </div>
      </li>`).join('')}
    </ul>`;

  const ideasFolder = () => `
    <p class="pf-note">Ideas, not findings. None of these has been tested or published.</p>
    <ul class="pf-list">${IDEAS.map((x) => `
      <li class="pf-item">
        <span class="pf-thumb"><img src="${x.img}" alt="" loading="lazy"></span>
        <div class="pf-main">
          <p class="mo-kicker pf-nature">${esc(x.nature)}</p>
          <h4 class="pf-title">${esc(x.title)}</h4>
          <p class="pf-text">${esc(x.text)}</p>
          <p class="hy-foot">${x.status ? `<span class="hy-status">${esc(x.status)}</span>` : ''}<a class="tile-credit" href="${esc(x.credit.page)}" target="_blank" rel="noopener">Photo: ${esc(x.credit.artist)} · ${esc(x.credit.license)}</a></p>
        </div>
      </li>`).join('')}
    </ul>`;

  // Read by main.js, which puts these folders first in "Filed by theme".
  window.WORK_FOLDERS = [
    { id: 'models', title: 'Modelling & experiments', tint: '#6f9bff', icon: 'flask', unit: 'projects',
      blurb: 'Risk models in R and a docking study.', count: MODELS.length, bodyHTML: modelsFolder },
    { id: 'ideas', title: 'Hypotheses & ideas', tint: '#b58cff', icon: 'bulb', unit: 'ideas',
      blurb: 'Questions I’ve been turning over.', count: IDEAS.length, bodyHTML: ideasFolder },
  ];

  // Work itself now holds only the two featured projects: ADR, then the EEG research.
  root.innerHTML = featured(FEATURED) + featured(FEATURED_EEG) + `
    <p class="work-more reveal"><a href="#achievements">
      <span class="wm-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"/></svg></span>
      <span class="wm-text"><small>Keep exploring</small>More projects &amp; ideas, filed by theme</span>
      <span class="wm-arrow" aria-hidden="true">↓</span>
    </a></p>`;

  // Writing lives in its own section near the end of the page (#writingNotes, just before Contact).
  const wroot = document.getElementById('writingNotes') || root;
  if (wroot === root) root.insertAdjacentHTML('beforeend', writing());
  else wroot.innerHTML = writing();

  /* ------------------------------------------------------------------
     Writing strip: a compact horizontal gallery. Arrow buttons, drag,
     swipe and keyboard all scroll it; each photo drifts inside its frame
     as it moves across, which gives the parallax depth.
     ------------------------------------------------------------------ */
  const strip = wroot.querySelector('.strip');
  if (strip) {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const imgs = [...strip.querySelectorAll('.tile-zoom img')];
    const bar = wroot.querySelector('.strip-progress span');
    let ticking = false;

    const paint = () => {
      ticking = false;
      const view = strip.getBoundingClientRect();
      const mid = view.left + view.width / 2;
      if (!calm) {
        imgs.forEach((img) => {
          const r = img.parentElement.getBoundingClientRect();
          const d = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / view.width));
          img.style.transform = `translate3d(${(d * -9).toFixed(2)}%, 0, 0) scale(1.18)`;
        });
      }
      const max = strip.scrollWidth - strip.clientWidth;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? (0.08 + 0.92 * strip.scrollLeft / max).toFixed(3) : 1})`;
    };
    const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    strip.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    paint();

    wroot.querySelectorAll('[data-strip]').forEach((btn) => btn.addEventListener('click', () => {
      const tileW = strip.querySelector('.tile').getBoundingClientRect().width + 28;
      strip.scrollBy({ left: Number(btn.dataset.strip) * tileW * 2, behavior: calm ? 'auto' : 'smooth' });
    }));

    // Drag to scroll with a mouse; a drag never counts as a click on a tile.
    let drag = null;
    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: strip.scrollLeft, moved: false };
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) { drag.moved = true; strip.classList.add('is-dragging'); }
      if (drag.moved) strip.scrollLeft = drag.left - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      strip.classList.remove('is-dragging');
      if (moved) strip.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
    });
  }

  /* ------------------------------------------------------------------
     Drawer: featured project and modelling notes, with previous / next.
     ------------------------------------------------------------------ */
  const DRAWER = [FEATURED, FEATURED_EEG, ...MODELS];

  function drawerBody(w) {
    const i = DRAWER.indexOf(w);
    const prev = DRAWER[(i - 1 + DRAWER.length) % DRAWER.length];
    const next = DRAWER[(i + 1) % DRAWER.length];
    let fig = '';
    if (w.flow) fig = `<div class="pj-figure">${flowHTML(w.flow, true)}<p class="fig-cap">How the prototype works · diagram</p></div>`;
    else if (w.plates) fig = `<div class="pj-figure pj-figure--plates">${w.plates.map(plateHTML).join('')}</div>`;
    else if (w.id === 'eeg') fig = `<figure class="pj-figure">${eegSVG()}<figcaption>Illustration · not recorded data</figcaption></figure>`;
    else if (w.img) fig = `<div class="pj-figure pj-figure--photo">${photoHTML(w.img)}</div>`;
    const lede = w.origin ? `${w.summary} ${w.origin}` : w.summary;
    const list = `<section class="pj-block"><h4>What I worked on</h4><ul class="pj-list">${w.worked.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>`;
    const facts = [...(w.facts || []), ...(w.results ? [['Reported results', w.results, true]] : [])];
    const factsHTML = facts.length ? `<dl class="pj-facts">${facts.map(([k, v, mono]) => `<div><dt>${esc(k)}</dt><dd${mono ? ' class="mono"' : ''}>${esc(v)}</dd></div>`).join('')}</dl>` : '';
    const links = w.links ? `<p class="pj-links">${w.links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`).join('')}</p>` : '';
    const nav = `<nav class="pj-nav" aria-label="More work">
        <button type="button" data-work-nav="${prev.id}" data-dir="prev"><small>Previous</small>${esc(prev.short)}</button>
        <button type="button" data-work-nav="${next.id}" data-dir="next"><small>Next</small>${esc(next.short)}</button>
      </nav>`;
    const back = MODELS.includes(w) ? '<button class="pj-back" type="button" data-open-folder="models"><span aria-hidden="true">←</span> All modelling projects</button>' : '';
    return `<article class="pj">${back}${fig}<p class="pj-lede">${esc(lede)}</p>${list}${factsHTML}${links}${nav}</article>`;
  }

  const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6.2L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9.2V3"/><path d="M7.4 15h9.2"/></svg>';
  const ICON_BUILD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4a5 5 0 0 0-4.6 6.9L4 17.3V20h2.7l6.4-6.4A5 5 0 0 0 20 9l-3 1-2-2 1-3Z"/></svg>';

  function openWork(id, dir) {
    const w = DRAWER.find((x) => x.id === id);
    const sheet = window.portfolioSheet;
    if (!w || !sheet) return;
    const body = sheet.open({
      tint: w.tint || '#6f9bff',
      iconHTML: w.icon === 'build' ? ICON_BUILD : ICON,
      kicker: w.kicker,
      title: w.title,
      bodyHTML: drawerBody(w),
      variant: 'project',
    });
    if (!body) return;
    const fig = body.querySelector('.pj-figure');
    if (fig) requestAnimationFrame(() => requestAnimationFrame(() => fig.classList.add('drawn')));
    if (dir) {
      const btn = body.querySelector(`.pj-nav [data-dir="${dir}"]`);
      if (btn) btn.focus({ preventScroll: true });
    }
  }

  document.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-work-nav]');
    if (nav) { openWork(nav.dataset.workNav, nav.dataset.dir); return; }
    const opener = e.target.closest('[data-work-open]');
    if (opener) { openWork(opener.dataset.workOpen); return; }
    if (e.target.closest('a')) return; // links open normally
    const note = e.target.closest('[data-work]');
    if (note && root.contains(note) && e.target.closest('.plate, .mo-photo-frame, .feat-figure')) openWork(note.dataset.work);
  });

  /* The EEG band's analysis window follows the pointer along the trace. */
  root.addEventListener('pointermove', (e) => {
    const svg = e.target instanceof Element ? e.target.closest('.ill-eeg') : null;
    const win = svg && svg.querySelector('[data-apen]');
    if (!win) return;
    const r = svg.getBoundingClientRect();
    const vbW = svg.viewBox.baseVal.width;
    const x = ((e.clientX - r.left) / r.width) * vbW - 32;
    win.style.transform = `translateX(${Math.max(0, Math.min(vbW - 64, x)).toFixed(1)}px)`;
  });
})();
