// Shared by every page. Each block checks that its markup is on the current page before running.
document.documentElement.classList.add('js');
const $ = (s) => document.querySelector(s);
const UP = 'https://growgreenweedcontrol.com/wp-content/uploads/';

// Service copy and frequencies come from the live site. services.html repeats this copy as static markup.
const problems = [
  { tab: 'Weeds taking over the grass', icon: 'ph-plant', freq: '8 treatments per year', title: 'Lawn Fertilization & Weed Control',
    text: 'Year-round treatments designed for Baton Rouge-area turf. We target weeds, support stronger roots, and provide seasonal nutrition.',
    img: '2022/09/zoysia.jpg', alt: 'Thick, weed-free zoysia lawn', more: 'More on the lawn program', slug: 'lawn-program' },
  { tab: 'Fire ant mounds', icon: 'ph-bug', freq: '2 treatments per year', title: 'Fire Ant Treatment',
    text: 'Scheduled treatments target visible mounds and hidden colonies to help reduce fire-ant activity throughout your lawn.',
    img: '2024/12/ant-mound.jpg', alt: 'Fire ant mound in a lawn', more: 'More on fire ant control', slug: 'fire-ants' },
  { tab: 'Weeds in the flower beds', icon: 'ph-flower-tulip', freq: 'Monthly service option', title: 'Flower Bed Weed Control',
    text: 'Pre-emergent and targeted weed control keeps landscape beds cleaner, with less time spent pulling weeds by hand.',
    img: '2024/12/flower-bed-stone-edging-and-mulch-installation.jpg', alt: 'Clean mulched flower bed with stone edging', more: 'More on bed weed control', slug: 'flower-beds' },
  { tab: 'Struggling trees or shrubs', icon: 'ph-tree', freq: '6-treatment program', title: 'Tree & Shrub Care',
    text: 'Scheduled nutrition, insect control, and disease treatments protect ornamental trees and shrubs through Louisiana seasons.',
    img: '2026/04/kyle-tree-shrub-care-baton-rouge-grow-green-weed-control-scaled.jpg', alt: 'Kyle from Grow Green treating a tree beside the service trailer', more: 'More on tree and shrub care', slug: 'trees-shrubs' },
  { tab: 'Hard, compacted soil', icon: 'ph-shovel', freq: 'Seasonal soil service', title: 'Core & Liquid Aeration',
    text: 'Improve water movement, root development, and soil conditions with core aeration or a targeted liquid soil treatment.',
    img: '2024/12/core-aeration.jpg', alt: 'Soil plug pulled by a core aerator', more: 'More on aeration', slug: 'aeration' },
  { tab: 'Mosquitoes, fleas, or ticks', icon: 'ph-shield-check', freq: 'Recurring options', title: 'Mosquito, Flea & Tick Control',
    text: 'Targeted outdoor treatments reduce mosquitoes, fleas, and ticks around the areas where your family spends time outside.',
    img: '2024/12/Mosquito-insect-feeding-on-human-culex-pipiens.jpg', alt: 'Mosquito on skin', more: 'More on outdoor pest control', slug: 'mosquitoes' },
];

function tablist(root, items, label, onSelect, start) {
  items.forEach((item, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.innerHTML = label(item, i);
    b.addEventListener('click', () => select(i, true));
    root.append(b);
  });
  function select(i, animate) {
    [...root.children].forEach((b, j) => b.setAttribute('aria-selected', j === i));
    onSelect(items[i], animate);
  }
  select(start, false);
}
function replay(el) { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); }

// Home: problem picker
if ($('#pickerTabs')) {
  let concern = '';
  tablist($('#pickerTabs'), problems, (p) => `<i class="ph-bold ${p.icon}"></i>${p.tab}`, (p, animate) => {
    $('#pkImg').src = UP + p.img; $('#pkImg').alt = p.alt;
    $('#pkFreq').textContent = p.freq; $('#pkTitle').textContent = p.title; $('#pkText').textContent = p.text;
    $('#pkMore').textContent = p.more; $('#pkMore').href = `services.html#${p.slug}`;
    if (animate) { concern = p.tab; replay($('#pickerPanel')); }
  }, 0);
  $('#pkQuote').addEventListener('click', () => { if (concern) $('#qSee').value = concern; });
}

// Home: treatment calendar
if ($('#rounds')) {
  // DRAFT agronomy copy: typical warm-season program. Have Dereck confirm each round before launch.
  const rounds = [
    { when: 'January to February', short: 'Jan-Feb', title: 'Winter weed cleanup', weeds: 'Post-emergent control for winter broadleaf weeds and a first pre-emergent barrier.', feed: 'Held back while turf is dormant.', watch: 'Bare or thin spots where weeds will move in.' },
    { when: 'March', short: 'Mar', title: 'Spring prevention', weeds: 'Pre-emergent to stop crabgrass and summer weeds before they sprout.', feed: 'Light feeding as the lawn wakes up.', watch: 'Late cold snaps and uneven green-up.' },
    { when: 'April to May', short: 'Apr-May', title: 'Green-up', weeds: 'Targeted control for whatever broke through.', feed: 'Balanced liquid fertilizer and micronutrients for color and density.', watch: 'Early fungus as nights warm up.' },
    { when: 'June', short: 'Jun', title: 'Early summer strength', weeds: 'Spot treatment for sedges and summer broadleaf weeds.', feed: 'Steady nutrition to build roots before peak heat.', watch: 'Chinch bugs and dry stress.' },
    { when: 'July to August', short: 'Jul-Aug', title: 'Heat-safe care', weeds: 'Careful spot control when temperatures allow.', feed: 'Nutrition that supports the lawn without pushing it in the heat.', watch: 'Insect damage and heat stress.' },
    { when: 'September', short: 'Sep', title: 'Late-summer recovery', weeds: 'Clean up summer weeds before they seed.', feed: 'Recovery feeding after the hottest months.', watch: 'Armyworms and turf disease.' },
    { when: 'October to November', short: 'Oct-Nov', title: 'Fall prevention', weeds: 'Pre-emergent to block winter weeds before they start.', feed: 'Root-focused nutrition heading into dormancy.', watch: 'Brown patch as the weather cools.' },
    { when: 'December', short: 'Dec', title: 'Winter protection', weeds: 'Control for cool-season weeds that slipped through.', feed: 'Minimal. The lawn is resting.', watch: 'Problem areas to plan for in spring.' },
  ];
  const monthToRound = [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7];
  const currentRound = monthToRound[new Date().getMonth()];
  // Months each visit spans, and how tall the turf stands that time of year (dormant in winter, peak in summer)
  const roundShape = [[2, 22], [1, 40], [2, 70], [1, 90], [2, 100], [1, 85], [2, 55], [1, 30]];
  const strip = $('#rounds');
  tablist(strip, rounds, (r, i) => `<span class="turf"><span class="grass" style="--h:${roundShape[i][1]}%"></span></span><span class="label">${r.short}</span>${i === currentRound ? '<span class="now">Happening now</span>' : ''}`, (r, animate) => {
    $('#rdWhen').textContent = r.when; $('#rdTitle').textContent = r.title;
    $('#rdWeeds').textContent = r.weeds; $('#rdFeed').textContent = r.feed; $('#rdWatch').textContent = r.watch;
    if (animate) replay($('#roundPanel'));
  }, currentRound);
  [...strip.children].forEach((b, i) => b.style.setProperty('--span', roundShape[i][0]));
  // On phones the strip scrolls sideways, so start it on the current visit
  strip.scrollLeft = strip.children[currentRound].offsetLeft - strip.offsetLeft - 24;
}

// Quote form. Demo only: nothing is sent.
if ($('#quoteForm')) {
  $('#qSee').innerHTML = '<option value="">Not sure yet</option>' + problems.map((p) => `<option>${p.tab}</option>`).join('');
  const tests = {
    qAddr: (v) => v.trim().length > 4, qCity: (v) => v.trim().length > 1, qZip: (v) => /^\d{5}$/.test(v.trim()),
    qName: (v) => v.trim().length > 1, qPhone: (v) => v.replace(/\D/g, '').length === 10, qEmail: (v) => /^\S+@\S+\.\S+$/.test(v.trim()),
  };
  const check = (ids) => {
    let firstBad = null;
    ids.forEach((id) => {
      const el = $('#' + id), ok = tests[id](el.value);
      el.closest('.field').classList.toggle('bad', !ok);
      el.setAttribute('aria-invalid', !ok);
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  };
  Object.keys(tests).forEach((id) => $('#' + id).addEventListener('input', (e) => e.target.closest('.field').classList.remove('bad')));
  const step = (n) => {
    $('#step1').hidden = n !== 1; $('#step2').hidden = n !== 2;
    $('#bar2').classList.toggle('on', n === 2);
  };
  $('#toStep2').addEventListener('click', () => {
    if (!check(['qAddr', 'qCity', 'qZip'])) return;
    $('#step2Hint').textContent = `We'll measure ${$('#qAddr').value.trim()} and send your price.`;
    step(2); $('#qName').focus();
  });
  $('#toStep1').addEventListener('click', () => { step(1); $('#qAddr').focus(); });
  $('#quoteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if ($('#step2').hidden) return $('#toStep2').click();
    if (!check(['qName', 'qPhone', 'qEmail'])) return;
    $('#step2').hidden = true; $('.progress').hidden = true;
    $('#doneTitle').textContent = `Thanks, ${$('#qName').value.trim().split(' ')[0]}. We're on it.`;
    $('#doneText').textContent = `We're measuring ${$('#qAddr').value.trim()} now. Look for your estimate at ${$('#qEmail').value.trim()} within 24 hours.`;
    $('#done').hidden = false; $('#done').focus();
  });
  // A button that names a problem carries it into the form
  document.querySelectorAll('[data-concern]').forEach((a) => a.addEventListener('click', () => { $('#qSee').value = a.dataset.concern; }));
}

// Home: the hero address field hands off to the quote form
if ($('#heroForm')) {
  $('#heroForm').addEventListener('submit', (e) => {
    e.preventDefault();
    $('#qAddr').value = $('#heroAddr').value;
    $('#quote').scrollIntoView();
    ($('#qAddr').value.trim() ? $('#qCity') : $('#qAddr')).focus({ preventScroll: true });
  });
}

// About: six reels picked from facebook.com/growgreenweedcontrol/reels for range of topic. Titles are ours, not the post captions.
if ($('#reelRail')) {
  const reels = [
    ['1239352871509623', 'Why a local company matters'],
    ['1757309568846739', 'A treated lawn next to an untreated one'],
    ['1156254709905574', 'Why a brown lawn may just be dormant'],
    ['847916281708419', 'What those aeration plugs are for'],
    ['1629760418507201', 'Virginia buttonweed, and how it spreads'],
    ['4482407718682057', 'Summer lawn insects to watch for'],
  ];
  const rail = $('#reelRail');
  rail.innerHTML = reels.map(([id, title]) => {
    const href = encodeURIComponent(`https://www.facebook.com/reel/${id}/`);
    return `<figure class="reel-item"><div class="reel"><iframe loading="lazy" title="${title}" src="https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&width=267" width="267" height="476" scrolling="no" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div><figcaption>${title}</figcaption></figure>`;
  }).join('');
  const railStep = (dir) => rail.scrollBy({ left: dir * (267 + 16) * 3, behavior: 'smooth' });
  $('#reelPrev').addEventListener('click', () => railStep(-1));
  $('#reelNext').addEventListener('click', () => railStep(1));
}

// Service-area map: Leaflet over OpenStreetMap tiles, loaded only on pages that have the map.
// For production, pick a tile provider whose terms cover a commercial site.
if ($('#map')) {
  // [name, latitude, longitude, side the label sits on]
  const towns = [
    ['Zachary', 30.6485, -91.1565, 'right'],
    ['Central', 30.5544, -91.0368, 'left'],
    ['Baton Rouge', 30.4515, -91.1871, 'right'],
    ['Denham Springs', 30.4866, -90.9562, 'top'],
    ['Walker', 30.488, -90.8615, 'right'],
    ['Prairieville', 30.303, -90.972, 'left'],
    ['Dutchtown', 30.258, -90.993, 'left'],
    ['Geismar', 30.221, -91.008, 'left'],
    ['Gonzales', 30.2385, -90.9201, 'top'],
    ['St. Amant', 30.233, -90.852, 'right'],
    ['Sorrento', 30.183, -90.859, 'right'],
  ];
  // Mockup: a town link starts a quote for that town. In production, point these at the town pages.
  const pickTown = (name) => { $('#qCity').value = name; $('#quote').scrollIntoView(); };
  $('#townList').innerHTML = towns.map(([name]) => `<li><a href="#quote" data-city="${name}">${name}</a></li>`).join('');
  document.querySelectorAll('[data-city]').forEach((a) => a.addEventListener('click', () => { $('#qCity').value = a.dataset.city; }));

  const leaflet = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet';
  document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: `${leaflet}.css` }));
  const script = Object.assign(document.createElement('script'), { src: `${leaflet}.js` });
  script.onload = () => {
    const map = L.map('map', { scrollWheelZoom: false, zoomSnap: 0.25 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 14, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    towns.forEach(([name, lat, lon, side]) => {
      const office = name === 'St. Amant';
      const size = office ? 24 : 16;
      L.marker([lat, lon], {
        title: name, keyboard: true,
        icon: L.divIcon({ className: '', html: `<div class="pin${office ? ' office' : ''}"></div>`, iconSize: [size, size] }),
      }).addTo(map)
        .bindTooltip(office ? `${name} office` : name, { permanent: true, direction: side, offset: side === 'top' ? [0, -8] : [side === 'left' ? -10 : 10, 0], className: `pin-label${office ? ' office' : ''}` })
        .on('click', () => pickTown(name));
    });
    // Extra room on the right so the labels east of the last pins are not clipped
    map.fitBounds(towns.map(([, lat, lon]) => [lat, lon]), { paddingTopLeft: [44, 44], paddingBottomRight: [130, 44] });
  };
  document.head.append(script);
}

// Pages this mockup doesn't include (blog, portal, legal, job application) open the live site in a new tab
document.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });

// Mobile menu
const menuBtn = $('.menu-btn');
menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', $('#menu').classList.toggle('open')));
$('#menu').addEventListener('click', (e) => { if (e.target.closest('a')) { $('#menu').classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); } });

// Scroll reveal
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
