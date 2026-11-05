/* =========================================================================
   Клиентское приложение «васаби.» — состояние, роутер, экраны
   ========================================================================= */

const ICONS = {
  utensils:'<path d="M4 3v6a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3"/><path d="M6 11v10"/><path d="M15 3c-1.5 1.5-2 3.2-2 5.2s.6 3.6 2 4.3V21"/><path d="M15 3v9.5"/>',
  bag:'<path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6"/>',
  user:'<circle cx="12" cy="8" r="3.5"/><path d="M4.8 20a7.4 7.4 0 0 1 14.4 0"/>',
  leaf:'<path d="M5 19c0-8 5-13 14-14 1 9-4 14-11 14H5z"/><path d="M4 20c2-4 5-7 9-9"/>',
  bike:'<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M12 17l-3-6h5l3 3"/><path d="M9 11 7.5 6.5h3"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  arrowRight:'<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>',
  arrowLeft:'<path d="M20 12H5"/><path d="M11 6l-6 6 6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  gift:'<rect x="3" y="8.5" width="18" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5"/><path d="M12 8.5V20"/><path d="M12 8.5S9.5 8.5 8.4 7A2.4 2.4 0 0 1 12 4.2 2.4 2.4 0 0 1 15.6 7C14.5 8.5 12 8.5 12 8.5z"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11.2v5.3"/><circle cx="12" cy="7.8" r="1" fill="currentColor" stroke="none"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4.2V8h-3.8"/>',
  trash:'<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6.5 7 7.5 20h9L17.5 7"/>',
  phone:'<path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6 3z"/>',
  pin:'<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  check:'<path d="M4 12.5l5 5L20 6.5"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  bell:'<path d="M18 15v-4a6 6 0 1 0-12 0v4l-1.5 3h15L18 15z"/><path d="M10 21h4"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M21.5 20H2.5"/>',
  tag:'<path d="M4 4h7l9 9-7 7-9-9V4z"/><circle cx="8.5" cy="8.5" r="1.4"/>',
  users:'<circle cx="9" cy="8.5" r="3"/><path d="M2.8 19a6.4 6.4 0 0 1 12.4 0"/><path d="M16 6.3a3 3 0 0 1 0 5.4"/><path d="M18.5 19a6 6 0 0 0-2-4.4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.7 5.7l1.7 1.7M16.6 16.6l1.7 1.7M18.3 5.7l-1.7 1.7M7.4 16.6l-1.7 1.7"/>',
  grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  printer:'<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 15h10v6H7z"/>',
  volume:'<path d="M4 9h3l4-4v14l-4-4H4z"/><path d="M15 9.2a4 4 0 0 1 0 5.6"/>',
  wallet:'<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.1" fill="currentColor" stroke="none"/>',
  card:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M6.5 15h4"/>',
  cash:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>',
  scooter:'<circle cx="5.5" cy="17" r="2.6"/><circle cx="18.5" cy="17" r="2.6"/><path d="M8 17h7l-3-8h3"/><path d="M9 6h4l2 4"/>',
  percent:'<path d="M6 18 18 6"/><circle cx="7.5" cy="7.5" r="2.2"/><circle cx="16.5" cy="16.5" r="2.2"/>',
  calendar:'<rect x="3.5" y="5" width="17" height="16" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9L12 3.5z"/>',
  map:'<path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z"/><path d="M9 4v13M15 6.5v13"/>',
  doc:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/>',
  edit:'<path d="M4 20h4L20 8l-4-4L4 16v4z"/>',
  qr:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/>',
  sliders:'<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  heart:'<path d="M12 20.3s-7.2-4.5-7.2-9.5a4.2 4.2 0 0 1 7.2-2.9 4.2 4.2 0 0 1 7.2 2.9c0 5-7.2 9.5-7.2 9.5z"/>',
  heartFill:'<path d="M12 20.3s-7.2-4.5-7.2-9.5a4.2 4.2 0 0 1 7.2-2.9 4.2 4.2 0 0 1 7.2 2.9c0 5-7.2 9.5-7.2 9.5z" fill="currentColor"/>',
  home:'<path d="M4 10.5 12 4l8 6.5V20H4v-9.5z"/>',
  office:'<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M4 12h16M10 12v2h4v-2"/>'
};
const icon = (n, cls='') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;

const $ = s => document.querySelector(s);
const NBSP = '\u00A0';
const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) + NBSP + '₽';
const plural = (n, one, few, many) => {
  const m = n % 100, k = n % 10;
  if (m > 4 && m < 20) return many;
  if (k === 1) return one;
  if (k >= 2 && k <= 4) return few;
  return many;
};

/* ------------------------------- состояние ------------------------------ */

const state = {
  screen: 'home',
  stack: [],
  cart: {},                 // key -> {key, dishId, qty, mods[]}
  orders: [],
  user: { name:'Сергей', email:'guest@example.com', phone:'+7 900 000-00-01', role:'Клиент', address:'Москва, ул. Ташкентская, 19' },
  favorites: ['d-phil'],    // id блюд в избранном
  addresses: [              // адресная книга гостя
    { id:'a1', label:'Дом',  address:'Москва, ул. Ташкентская, 19, кв. 42' },
    { id:'a2', label:'Офис', address:'Москва, Пресненская наб., 8, стр. 1' }
  ],
  addressId: 'a1',
  newAddress: '',
  cat: 'all',
  query: '',
  productId: null,
  productMods: [],
  promo: null,
  bonusUse: 0,
  payMethod: 'card',
  deliveryType: 'delivery',
  locationId: 'l1',
  address: 'Москва, ул. Ташкентская, 19, кв. 42',
  comment: '',
  timeMode: 'asap',         // 'asap' | 'slot'
  slot: null,               // {day:'today'|'tomorrow', time:'13:30'}
  currentOrderId: null,
  autoStatus: true,
  paying: false,
  authStep: 'phone',
  table: null,              // { no:'12', locId:'l1' } — заказ с QR-кода на столе
  qrCat: 'all',
  errors: {}
};

const SCREENS = {
  home:        { title:'Главная',        icon:'leaf',     tab:'menu',    cartbar:true  },
  catalog:     { title:'Каталог меню',   icon:'grid',     tab:'menu',    cartbar:true  },
  product:     { title:'Карточка блюда', icon:'utensils', tab:null,      cartbar:false },
  cart:        { title:'Корзина',        icon:'bag',      tab:'cart',    cartbar:false },
  checkout:    { title:'Оформление',     icon:'doc',      tab:null,      cartbar:false },
  payment:     { title:'Оплата',         icon:'wallet',   tab:null,      cartbar:false },
  status:      { title:'Статус заказа',  icon:'scooter',  tab:null,      cartbar:false },
  orders:      { title:'Мои заказы',     icon:'receipt',  tab:'orders',  cartbar:false },
  favorites:   { title:'Избранное',      icon:'heart',    tab:'menu',    cartbar:true  },
  profile:     { title:'Профиль',        icon:'user',     tab:'profile', cartbar:false },
  promos:      { title:'Акции и новости',icon:'tag',      tab:'profile', cartbar:false },
  restaurant:  { title:'О ресторане',    icon:'pin',      tab:null,      cartbar:false },
  qrmenu:      { title:'QR-меню стола',  icon:'qr',       tab:null,      cartbar:true  },
  onboarding:  { title:'Вход по SMS',    icon:'phone',    tab:null,      cartbar:false }
};
const TABS = [
  { id:'menu',    label:'Меню',    icon:'utensils', screen:'home' },
  { id:'cart',   label:'Корзина', icon:'bag',      screen:'cart' },
  { id:'orders', label:'Заказы',  icon:'receipt',  screen:'orders' },
  { id:'profile',label:'Профиль', icon:'user',     screen:'profile' }
];

const dishById = id => DISHES.find(d => d.id === id);
/* Карточка блюда открывается и из списка экранов, где блюдо не выбрано — берём первое доступное */
const defaultDish = () => DISHES.find(d => d.available !== false && d.popular) || DISHES.find(d => d.available !== false) || DISHES[0];
const lineKey = (dishId, mods) => dishId + '|' + mods.slice().sort().join(',');
const cartLines = () => Object.values(state.cart);
const cartCount = () => cartLines().reduce((s,l) => s + l.qty, 0);
const lineUnit = line => {
  const d = dishById(line.dishId);
  const mods = (d.modifiers || []).filter(m => line.mods.includes(m.id));
  return d.price + mods.reduce((s,m) => s + m.price, 0);
};
const cartSubtotal = () => cartLines().reduce((s,l) => s + l.qty * lineUnit(l), 0);

const dishAvailable = d => !!d && d.available !== false;
const isFav = id => state.favorites.includes(id);
const favDishes = () => state.favorites.map(dishById).filter(Boolean);
const minOrderLeft = () => Math.max(0, RULES.minOrder - cartSubtotal());

/* Допродажи: блюда, которые чаще всего берут вместе с уже выбранными */
function upsellIds(){
  const inCart = new Set(cartLines().map(l => l.dishId));
  const score = new Map();
  cartLines().forEach(l => {
    const d = dishById(l.dishId);
    (d.pairs || []).forEach(id => {
      if (inCart.has(id)) return;
      if (!dishAvailable(dishById(id))) return;
      score.set(id, (score.get(id) || 0) + 1);
    });
  });
  return [...score.entries()]
    .sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(e => e[0])
    .slice(0, 3);
}

/* Слоты времени: сегодня и завтра с шагом 30 минут, с учётом часов работы точки */
const hm = s => { const [h,m] = s.split(':').map(Number); return h*60 + m; };
const m2t = m => String(Math.floor(m/60)).padStart(2,'0') + ':' + String(m%60).padStart(2,'0');

function timeSlots(){
  const loc = LOCATIONS.find(l => l.id === state.locationId) || LOCATIONS[0];
  const open = hm(loc.open), close = hm(loc.close);
  const lead = state.deliveryType === 'pickup' ? RULES.leadPickup : RULES.leadDelivery;
  const now = new Date();
  const nowMin = now.getHours()*60 + now.getMinutes();
  const last = close - RULES.lastOrderSlot;

  const today = [];
  let start = Math.max(open, nowMin + lead);
  start = Math.ceil(start / RULES.slotStep) * RULES.slotStep;
  for (let m = start; m <= last; m += RULES.slotStep) today.push({ day:'today', time:m2t(m) });

  const tomorrow = [];
  for (let m = open; m <= last; m += RULES.slotStep) tomorrow.push({ day:'tomorrow', time:m2t(m) });

  return { today, tomorrow };
}
const slotLabel = s => s.day === 'today' ? 'Сегодня' : 'Завтра';
const slotFull = s => `${slotLabel(s)}, ${s.time}`;

function repeatOrder(o){
  if (!o) return;
  let added = 0, skipped = 0;
  o.items.forEach(i => {
    const d = dishById(i.dishId);
    if (!d || !dishAvailable(d)){ skipped++; return; }
    const key = lineKey(i.dishId, i.mods || []);
    state.cart[key] = state.cart[key] || { key, dishId:i.dishId, qty:0, mods:(i.mods||[]).slice() };
    state.cart[key].qty += i.qty;
    added++;
  });
  if (!added){ toast('Состав заказа сейчас недоступен'); return; }
  toast(skipped
    ? `Часть блюд недоступна — ${added} ${plural(added,'позиция','позиции','позиций')} в корзине`
    : 'Состав заказа перенесён в корзину');
  go('cart');
}

function totals(){
  const sub = cartSubtotal();
  const noDelivery = state.deliveryType === 'pickup' || state.deliveryType === 'table';
  let delivery = noDelivery ? 0 : (sub >= RULES.freeDeliveryFrom ? 0 : RULES.deliveryPrice);
  let discount = 0;
  const promo = PROMOS.find(p => p.code === state.promo && p.active && sub >= p.min);
  if (promo){
    if (promo.type === 'percent') discount = Math.round(sub * promo.value / 100);
    if (promo.type === 'fixed' && sub >= promo.min) discount = promo.value;
    if (promo.type === 'delivery') delivery = 0;
  }
  const base = Math.max(0, sub - discount);
  const bonusMax = Math.floor(base * RULES.bonusMaxPay / 100);
  const bonusUse = Math.min(state.bonusUse, bonusMax);
  return { sub, delivery, discount, bonusUse, bonusMax, total: Math.max(0, base + delivery - bonusUse) };
}

function nowRu(){
  const d = new Date();
  const m = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'][d.getMonth()];
  const time = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  return `${d.getDate()} ${m} в ${time}`;
}

function seedOrders(){
  state.orders = [
    { id:'o-seed', no:'bb5cc2', date:'27 октября в 15:11',
      items:[{ dishId:'d-phil', name:'Филадельфия', qty:1, price:590, mods:[] }],
      sub:590, delivery:199, discount:0, bonus:0, total:789,
      status:'new', deliveryType:'delivery', locationId:'l1', addressId:'a1', slot:null,
      address:'Ташкентская 198', comment:'', payment:'card', promo:null }
  ];
  state.currentOrderId = 'o-seed';
}

/* -------------------------------- роутер -------------------------------- */

function go(name, opts = {}){
  if (opts.dishId){
    /* модификаторы у блюд общие по id («острое», «авокадо»), поэтому при переходе
       на другое блюдо выбор сбрасываем — иначе доплата переезжает вместе с ним */
    if (opts.dishId !== state.productId) state.productMods = [];
    state.productId = opts.dishId;
  }
  if (opts.mods)  state.productMods = opts.mods;
  if (name === 'product' && !opts.dishId && !dishById(state.productId)) state.productId = defaultDish().id;
  if (opts.from !== false && state.screen !== name){
    state.stack.push({ screen: state.screen, scroll: $('#viewport').scrollTop });
  }
  state.screen = name;
  state.errors = {};
  if (name === 'payment') state.paying = false;
  render();
  if (opts.top) $('#viewport').scrollTop = 0;
}
function back(){
  const prev = state.stack.pop();
  state.screen = prev ? (prev.screen || prev) : 'home';
  state.errors = {};
  render();
  if (prev && typeof prev.scroll === 'number') $('#viewport').scrollTop = prev.scroll;
}

/* ----------------------------- QR-меню стола ----------------------------- */

/* Ссылка в QR-коде: при размещении на хостинге берётся реальный адрес страницы,
   локально (file://) — демо-домен из BRAND. */
function menuUrl(tableNo, locId){
  const base = /^https?:$/.test(location.protocol)
    ? location.origin + location.pathname
    : BRAND.menuHost;
  return `${base}#menu?table=${tableNo}&loc=${locId}`;
}

function tableFromHash(){
  const m = /^#menu\?table=([A-Za-z0-9-]+)&loc=([A-Za-z0-9-]+)/.exec(location.hash || '');
  if (!m) return null;
  const loc = LOCATIONS.find(l => l.id === m[2]) || LOCATIONS[0];
  return { no: m[1], locId: loc.id };
}

function openTableMenu(table){
  state.table = table;
  state.qrCat = 'all';
  state.deliveryType = 'table';
  state.payMethod = 'table';
  go('qrmenu', { top:true });
}
window.openTableMenu = openTableMenu;

/* ------------------------------ компоненты ------------------------------ */

function appHeader(){
  return `
  <header class="app-header">
    <div class="app-header-row">
      <button class="logo-btn" data-act="home" aria-label="Васаби — на главную">
        <span class="logo-mark">${icon('leaf')}</span>
        <span class="brand-text">
          <span class="wordmark">васаби<span class="dot">.</span></span>
          <span class="tagline">${BRAND.tagline}</span>
        </span>
      </button>
      <div class="hdr-right">
        <button class="fav-head" data-act="go" data-screen="favorites" aria-label="Избранное">
          ${icon(hasFavs() ? 'heartFill' : 'heart')}
          ${state.favorites.length ? `<span class="fav-count">${state.favorites.length}</span>` : ''}
        </button>
        <div class="bike">${icon('bike')}<span>${RULES.prepTime}</span></div>
      </div>
    </div>
  </header>`;
}
const hasFavs = () => state.favorites.length > 0;

const locById = id => LOCATIONS.find(l => l.id === id) || LOCATIONS[0];

function appBar(title, onBack = true){
  return `
  <div class="app-bar">
    ${onBack ? `<button class="back-btn" data-act="back" aria-label="Назад">${icon('arrowLeft')}</button>` : ''}
    <p class="ab-title">${title}</p>
  </div>`;
}

function dishCard(d, showBadge = true){
  const out = !dishAvailable(d);
  const fav = isFav(d.id);
  return `
  <article class="pcard ${out?'is-out':''}" data-act="open-dish" data-dish="${d.id}" tabindex="0" role="button" aria-label="${d.name}, ${fmt(d.price)}">
    <div class="pcard-img">
      <img src="${d.img}" alt="${d.name}" loading="lazy">
      ${(showBadge && d.badge && !out) ? `<span class="pcard-badge">${d.badge}</span>` : ''}
      ${out ? `<span class="pcard-out">Нет в наличии</span>` : ''}
      <button class="fav-btn ${fav?'is-on':''}" data-act="fav" data-dish="${d.id}"
        aria-label="${fav?'Убрать из избранного':'В избранное'}" aria-pressed="${fav}">${icon(fav?'heartFill':'heart')}</button>
    </div>
    <div class="pcard-body">
      <div class="pcard-name">${d.name}</div>
      <div class="pcard-meta">${d.unit}</div>
      <div class="pcard-desc">${d.desc}</div>
      <div class="pcard-foot">
        <span class="pcard-price">${out ? 'Закончилось' : fmt(d.price)}</span>
        ${out ? '' : `<button class="plus-btn" data-act="quick-add" data-dish="${d.id}" aria-label="Добавить ${d.name} в корзину">${icon('plus')}</button>`}
      </div>
    </div>
  </article>`;
}

function stepper(key, qty){
  return `
  <div class="stepper">
    <button data-act="qty-minus" data-key="${key}" aria-label="Уменьшить">${icon('minus')}</button>
    <span class="qty">${qty}</span>
    <button data-act="qty-plus" data-key="${key}" aria-label="Увеличить">${icon('plus')}</button>
  </div>`;
}

/* --------------------------------- экраны -------------------------------- */

/* Карусель акций на главной: лента строится из BANNERS, поэтому выключенная
   в админке акция исчезает отсюда сразу, без правки кода */
function promoRail(){
  const list = activeBanners();
  if (!list.length) return '';
  const slides = list.length + 1; // + плитка «Все акции»
  return `
  <section class="section">
    <div class="section-head">
      <h2 class="h2">Акции сегодня</h2>
      <div class="rail-tools">
        <button class="rail-btn" data-act="promo-prev" aria-label="Предыдущая акция">${icon('arrowLeft')}</button>
        <button class="rail-btn" data-act="promo-next" aria-label="Следующая акция">${icon('arrowRight')}</button>
      </div>
    </div>
    <div class="promo-rail" id="promoRail" role="group" aria-label="Акции ресторана">
      ${list.map(b => `
        <button class="promo-card" data-act="open-banner" data-banner="${b.id}">
          <span class="promo-img"><img src="${b.img}" alt=""><span class="promo-tag">${b.tag}</span></span>
          <span class="promo-title">${b.title}</span>
          <span class="promo-sub">${b.sub}</span>
          <span class="promo-cta">${b.cta}${icon('arrowRight')}</span>
        </button>`).join('')}
      <button class="promo-card promo-more" data-act="go" data-screen="promos">
        <span class="promo-more-in">
          ${icon('tag')}
          <span>Все акции<br><b>${slides - 1} активных</b></span>
          ${icon('arrowRight')}
        </span>
      </button>
    </div>
    ${slides > 1 ? `<div class="promo-dots" id="promoDots">${Array.from({length:slides}, (_,i) => `<i class="${i?'':'is-on'}"></i>`).join('')}</div>` : ''}
  </section>`;
}

function scrHome(){
  const set = dishById('d-set-w');
  const popular = DISHES.filter(d => d.popular && dishAvailable(d));
  const last = state.orders[0];
  return `
  ${appHeader()}
  <section class="section" style="padding-bottom:0;margin-bottom:14px">
    <label class="search" style="margin-bottom:0">
      ${icon('search')}
      <input type="search" placeholder="Найти любимые роллы" id="homeSearch" aria-label="Поиск по меню"
        autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search"
        value="${state.query}" data-act="search">
    </label>
  </section>
  <section class="section">
    <div class="hero">
      <img src="${set.img}" alt="">
      <div class="hero-shade"></div>
      <div class="hero-content">
        <div class="hero-eyebrow">СВЕЖЕЕ. КАЖДЫЙ ДЕНЬ.</div>
        <h1 class="hero-title">Хороший вечер начинается с роллов.</h1>
        <p class="hero-sub">Соберём ваш любимый сет. Осталось выбрать компанию.</p>
        <button class="hero-cta" data-act="open-dish" data-dish="${set.id}">
          <span>Васаби сет · ${fmt(set.price)}</span>${icon('arrowRight')}
        </button>
      </div>
      <div class="hero-note">${set.unit.replace(' · ',' / ')}</div>
    </div>
  </section>

  ${promoRail()}

  ${last ? `
  <section class="section" style="padding-top:0">
    <button class="repeat-card" data-act="repeat-last">
      <span class="repeat-ico">${icon('refresh')}</span>
      <span class="grow">
        <span class="repeat-title">Повторить заказ</span>
        <span class="repeat-sub">${last.items.map(i => `${i.name} × ${i.qty}`).join(', ')} · ${fmt(last.total)}</span>
      </span>
      <span class="repeat-cta">${icon('arrowRight')}</span>
    </button>
  </section>` : ''}

  <section class="section">
    <div class="feat-row">
      <div class="feat">${icon('leaf')}<span>Готовим после заказа</span></div>
      <div class="feat">${icon('bike')}<span>Доставка от ${fmt(RULES.deliveryPrice)}</span></div>
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div>
        <h2 class="h1">Наше меню</h2>
        <div class="muted small" style="margin-top:6px">Вкус, к которому возвращаются</div>
      </div>
      <button class="link-line" data-act="go" data-screen="catalog">Все ${DISHES.length} ${plural(DISHES.length,'блюдо','блюда','блюд')} ${icon('arrowRight')}</button>
    </div>
    ${popular.length ? `
    <div class="section-head" style="margin-top:18px">
      <h2 class="h2">Попробуйте любимое</h2>
      <span class="count">${popular.length} ${plural(popular.length,'блюдо','блюда','блюд')}</span>
    </div>
    <div class="dish-grid">${popular.map(d => dishCard(d)).join('')}</div>` : ''}
    <div class="cats-head">Категории</div>
    <div class="chips-wrap">
      <div class="chips" id="homeChips" role="group" aria-label="Категории меню — быстрый переход">
        ${CATEGORIES.filter(c => c.id !== 'all').map(c => `<button class="chip chip-nav" data-act="cat" data-cat="${c.id}">${c.name}${icon('arrowRight')}</button>`).join('')}
      </div>
    </div>
  </section>`;
}

function scrCatalog(){
  const list = filterDishes();
  return `
  ${appHeader()}
  <section class="section" style="padding-top:4px">
    <h1 class="h1">Наше меню</h1>
    <div class="muted small" style="margin-top:6px">Вкус, к которому возвращаются</div>
  </section>
  <section class="section" style="margin-bottom:0">
    <label class="search">
      ${icon('search')}
      <input type="search" placeholder="Найти любимые роллы" aria-label="Поиск по меню"
        autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search"
        value="${state.query}" data-act="search">
    </label>
    <div class="chips-wrap">
      <div class="chips" role="group" aria-label="Категории меню">
        ${CATEGORIES.map(c => `<button class="chip ${state.cat===c.id?'is-active':''}" data-act="cat" data-cat="${c.id}">${c.name}</button>`).join('')}
      </div>
    </div>
  </section>
  <section class="section" style="margin-top:20px">
    <div class="section-head">
      <h2 class="h2">${state.cat==='all'?'Все блюда':CATEGORIES.find(c=>c.id===state.cat).name}</h2>
      <span class="count">${list.length} ${plural(list.length,'блюдо','блюда','блюд')}</span>
    </div>
    ${list.length ? `<div class="dish-grid">${list.map(d => dishCard(d)).join('')}</div>`
      : `<div class="empty">Ничего не нашлось. Попробуйте другой запрос.</div>`}
  </section>`;
}

function filterDishes(){
  const q = state.query.trim().toLowerCase();
  return DISHES.filter(d => {
    const okCat = state.cat === 'all' || d.cat === state.cat;
    const okQ = !q || d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q);
    return okCat && okQ;
  });
}

function scrProduct(){
  const d = dishById(state.productId);
  if (!d) return `<div class="empty">Блюдо не найдено
    <button class="btn-outline" style="margin-top:14px" data-act="go" data-screen="catalog">Открыть меню</button>
  </div>`;
  const key = lineKey(d.id, state.productMods);
  const inCart = state.cart[key];
  const out = !dishAvailable(d);
  const fav = isFav(d.id);
  const unit = d.price + (d.modifiers || []).filter(m => state.productMods.includes(m.id)).reduce((s,m)=>s+m.price,0);
  const mods = (d.modifiers || []).map(m => `
    <div class="opt-row">
      <div>
        <div class="opt-name">${m.name}</div>
        <div class="opt-price">${m.price ? '+ ' + fmt(m.price) : 'бесплатно'}</div>
      </div>
      <button class="opt-toggle ${state.productMods.includes(m.id)?'is-on':''}" data-act="toggle-mod" data-mod="${m.id}" aria-label="${m.name}"></button>
    </div>`).join('');

  return `
  ${appBar('Из нашего меню')}
  <div class="pdp-hero">
    <img src="${d.img}" alt="${d.name}">
    ${d.badge && !out ? `<span class="pdp-badge">${d.badge}</span>` : ''}
    <button class="fav-btn pdp-fav ${fav?'is-on':''}" data-act="fav" data-dish="${d.id}"
      aria-label="${fav?'Убрать из избранного':'В избранное'}" aria-pressed="${fav}">${icon(fav?'heartFill':'heart')}</button>
  </div>
  <section class="section">
    <div class="eyebrow">ВАСАБИ / ${CATEGORIES.find(c=>c.id===d.cat).name.toUpperCase()}</div>
    <h1 class="h1" style="margin-top:10px">${d.name}</h1>
    <div class="pdp-meta">${d.unit.replace(' · ','  •  ')}</div>
    <p class="pdp-desc">${d.desc}</p>
    ${out ? `<div class="notice out-notice">${icon('info')}<span>Блюдо закончилось — ресторан снял его со стоп-листа. Вернитесь в меню или выберите похожее.</span></div>` : ''}
  </section>
  <section class="section">
    <div class="panel-olive info-panel">
      ${icon('leaf')}
      <div>
        <h2>Готовим специально для вас</h2>
        <p>${d.note || 'Только после заказа — свой соус, свежий имбирь и настоящий васаби.'}</p>
      </div>
    </div>
  </section>
  ${mods && !out ? `
  <section class="section">
    <div class="section-head"><h2 class="h2">Дополнительно</h2><span class="count">по желанию</span></div>
    <div class="card" style="padding:4px 18px">${mods}</div>
  </section>` : ''}
  <section class="section">
    <div class="section-head"><h2 class="h2">Состав и аллергены</h2></div>
    <div class="card">
      <p class="soft small">${d.composition || 'Состав уточняется у оператора.'}</p>
      <p class="muted small" style="margin-top:10px">Содержит: ${(d.allergens || []).length ? d.allergens.join(', ') : 'не выявлено аллергенов'}.</p>
      <p class="muted small" style="margin-top:8px">Если у вас есть аллергия, сообщите оператору до оплаты — блюдо могут отменить и полностью вернуть деньги.</p>
    </div>
  </section>
  <div class="pdp-bar">
    <div class="pdp-bar-row">
      <div>
        <div class="pdp-price-cap">За порцию</div>
        <div class="pdp-price">${fmt(unit)}</div>
      </div>
      ${inCart ? stepper(key, inCart.qty) : `<div class="pdp-price-cap">${d.unit}</div>`}
    </div>
    ${out
      ? `<button class="btn-outline pdp-bar-btn" data-act="go" data-screen="catalog"><span>Вернуться в меню</span>${icon('arrowRight')}</button>`
      : inCart
        ? `<button class="btn-lime" data-act="go" data-screen="cart"><span>Перейти в корзину</span>${icon('arrowRight')}</button>`
        : `<button class="btn-lime" data-act="add-product"><span>Добавить в корзину</span>${icon('arrowRight')}</button>`}
  </div>`;
}

function scrFavorites(){
  const list = favDishes();
  const avail = list.filter(dishAvailable);
  const total = avail.reduce((s,d) => s + d.price, 0);
  return `
  ${appHeader()}
  <section class="section" style="padding-top:4px">
    <h1 class="h1">Избранное</h1>
    <div class="muted small" style="margin-top:6px">${list.length} ${plural(list.length,'блюдо','блюда','блюд')} · сохраняются в вашем аккаунте</div>
  </section>
  ${!list.length ? `
  <section class="section">
    <div class="empty">
      <div style="margin-bottom:12px">${icon('heart')}</div>
      Пока пусто. Нажмите на сердечко в карточке блюда — и оно появится здесь.
      <div style="margin-top:18px"><button class="btn-lime" style="width:auto;margin:0 auto" data-act="go" data-screen="catalog"><span>Открыть меню</span>${icon('arrowRight')}</button></div>
    </div>
  </section>` : `
  <section class="section">
    <div class="dish-grid">${list.map(d => dishCard(d)).join('')}</div>
  </section>
  ${avail.length ? `
  <section class="section">
    <div class="panel-olive" style="display:flex;gap:14px;align-items:center">
      <div class="grow">
        <div style="font-weight:700;color:var(--lime)">Добавить всё в корзину</div>
        <div class="soft small" style="margin-top:3px">${avail.length} ${plural(avail.length,'блюдо','блюда','блюд')} · ${fmt(total)}</div>
      </div>
      <button class="btn-lime fav-all-btn" data-act="fav-add-all"><span>В корзину</span>${icon('arrowRight')}</button>
    </div>
  </section>` : ''}
  ${avail.length < list.length ? `
  <section class="section">
    <div class="notice warn-notice">${icon('info')}<span>Часть блюд сейчас нет в наличии — они отмечены в каталоге.</span></div>
  </section>` : ''}`}`;
}

function scrCart(){
  const lines = cartLines();
  if (!lines.length){
    return `
    ${appHeader()}
    <section class="section" style="padding-top:26px">
      <h1 class="h1">Ваш вкусный выбор</h1>
      <div class="empty" style="margin-top:24px">
        <div style="margin-bottom:12px">${icon('bag')}</div>
        В корзине пока пусто.<br>Выберите что-нибудь из меню.
        <div style="margin-top:18px"><button class="btn-lime" style="width:auto;margin:0 auto" data-act="go" data-screen="catalog"><span>Открыть меню</span>${icon('arrowRight')}</button></div>
      </div>
    </section>`;
  }
  const t = totals();
  const left = minOrderLeft();
  const items = lines.map(l => {
    const d = dishById(l.dishId);
    const modNames = (d.modifiers || []).filter(m => l.mods.includes(m.id)).map(m => m.name).join(', ');
    return `
    <div class="cart-item">
      <img class="cart-thumb" src="${d.img}" alt="">
      <div class="grow">
        <div class="cart-item-name">${d.name}</div>
        <div class="cart-item-meta">${d.unit}</div>
        ${modNames ? `<div class="cart-item-meta">${modNames}</div>` : ''}
        <div class="cart-item-price">${fmt(lineUnit(l) * l.qty)}</div>
      </div>
      ${stepper(l.key, l.qty)}
    </div>`;
  }).join('');

  const ups = upsellIds();
  const upsellBlock = ups.length ? `
  <section class="section">
    <div class="section-head">
      <h2 class="h2">Добавьте к заказу</h2>
      <button class="link-line" data-act="upsell-add-all">Добавить всё</button>
    </div>
    <div class="upsell-row">
      ${ups.map(id => {
        const d = dishById(id);
        return `
        <div class="upsell-card">
          <img src="${d.img}" alt="${d.name}" loading="lazy">
          <div class="upsell-body">
            <div class="upsell-name">${d.name}</div>
            <div class="upsell-meta">${d.unit}</div>
            <div class="upsell-foot">
              <span class="upsell-price">${fmt(d.price)}</span>
              <button class="plus-btn sm" data-act="upsell-add" data-dish="${d.id}" aria-label="Добавить ${d.name} в корзину">${icon('plus')}</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </section>` : '';

  return `
  ${appHeader()}
  <section class="section" style="padding-top:4px">
    <h1 class="h1">Ваш вкусный выбор</h1>
  </section>
  <section class="section">
    <div class="panel-olive" style="display:flex;gap:14px;align-items:center">
      <span style="color:var(--lime);display:grid;place-items:center">${icon('bike')}</span>
      <div>
        <div style="font-weight:700;color:var(--lime)">Доставка за наш счёт</div>
        <div class="soft small" style="margin-top:3px">Привезём за ${RULES.prepTime}</div>
      </div>
    </div>
  </section>
  <section class="section stack gap-10">${items}</section>
  ${upsellBlock}
  ${left > 0 ? `
  <section class="section">
    <div class="notice warn-notice">${icon('info')}<span>До минимального заказа ${fmt(RULES.minOrder)} не хватает ${fmt(left)}. Минимум нужен, чтобы кухня приняла заказ в работу.</span></div>
  </section>` : ''}
  <section class="section">
    <div class="card">
      <h2 class="h2">Всё для вашего вечера</h2>
      <p class="muted small" style="margin-top:6px">Соевый соус, имбирь и васаби включены.</p>
      <div style="margin-top:12px">
        <div class="sum-row"><span>Блюда</span><span class="val">${fmt(t.sub)}</span></div>
        <div class="sum-row"><span>Доставка</span><span class="val ${t.delivery===0?'free-tag':''}">${t.delivery===0?'Бесплатно':fmt(t.delivery)}</span></div>
        ${t.discount ? `<div class="sum-row"><span>Промокод ${state.promo}</span><span class="val free-tag">−${fmt(t.discount)}</span></div>` : ''}
        <div class="sum-row is-total"><span class="lbl">Итого</span><span class="val">${fmt(t.total)}</span></div>
      </div>
    </div>
  </section>
  <div class="pdp-bar">
    <button class="btn-lime" data-act="go" data-screen="checkout"><span>Оформить доставку</span>${icon('arrowRight')}</button>
  </div>`;
}

function scrCheckout(){
  const t = totals();
  const table = state.deliveryType === 'table' && !!state.table;
  const pickup = state.deliveryType === 'pickup';
  const loc = LOCATIONS.find(l => l.id === state.locationId);
  return `
  ${appBar('Оформление заказа')}
  <section class="section">
    <div class="eyebrow">${table ? 'ЗАКАЗ ИЗ ЗАЛА' : 'ПОЧТИ У ВАС'}</div>
    <h1 class="h1" style="margin-top:10px">${table ? `Принесём к столу ${state.table.no}` : 'Куда привезти вкусный вечер?'}</h1>
  </section>
  <section class="section">
    <div class="notice">
      ${icon('info')}
      <span>${table
        ? 'Демо-заказ из QR-меню: сохраняется в тестовой очереди, попадает на кухню и на терминал официанта. Нет передачи в iiko.'
        : 'Демо-заказ сохраняется в Cloud и тестовой очереди сотрудников. Нет передачи в iiko или вызова доставки.'}</span>
    </div>
  </section>
  <section class="section">
    <div class="seg" style="margin-bottom:18px">
      ${state.table ? `<button class="${table?'is-active':''}" data-act="delivery-type" data-type="table">К столу</button>` : ''}
      <button class="${!pickup&&!table?'is-active':''}" data-act="delivery-type" data-type="delivery">Доставка</button>
      <button class="${pickup?'is-active':''}" data-act="delivery-type" data-type="pickup">Самовывоз</button>
    </div>
  </section>

  ${table ? `
  <section class="section">
    <div class="card">
      <div class="row between">
        <div class="pay-name">${icon('pin')} ${locById(state.table.locId).name}</div>
        <span class="a-pill lime">Стол ${state.table.no}</span>
      </div>
      <div class="order-addr" style="margin-top:10px">${locById(state.table.locId).address}</div>
      <p class="muted small" style="margin-top:10px">Готовность ${RULES.prepTable} после подтверждения заказа оператором.</p>
    </div>
    <div class="field" style="margin-top:16px">
      <label for="fComment">Пожелания к столу (необязательно)</label>
      <textarea id="fComment" data-act="f" data-field="comment" placeholder="Например: без имбиря, принести сразу, отдельная тарелка"
        autocapitalize="sentences" enterkeyhint="done">${state.comment}</textarea>
    </div>
  </section>` : pickup ? `
  <section class="section">
    <h2 class="h2" style="margin-bottom:12px">Точка самовывоза</h2>
    ${LOCATIONS.map(l => `
      <div class="pay-row ${state.locationId===l.id?'is-on':''}" data-act="pick-location" data-id="${l.id}" role="button" tabindex="0" aria-pressed="${state.locationId===l.id}" style="display:flex;gap:13px;align-items:center">
        <div class="pay-icon">${icon('pin')}</div>
        <div class="grow">
          <div class="pay-name">${l.name}</div>
          <div class="pay-note">${l.address} · ${l.hours}</div>
        </div>
        <span class="radio"></span>
      </div>`).join('')}
    <p class="muted small" style="margin-top:12px">Готовность заказа — ${RULES.leadPickup} минут после подтверждения.</p>
  </section>` : `
  <section class="section">
    <h2 class="h2" style="margin-bottom:14px">Ваши контакты</h2>
    <div class="field">
      <label for="fName">Имя</label>
      <input id="fName" data-act="f" data-field="name" value="${state.user.name}" placeholder="Как к вам обращаться"
        autocomplete="given-name" autocapitalize="words" enterkeyhint="next"
        ${state.errors.name ? 'aria-invalid="true" aria-describedby="err-fName"' : ''}>
      ${state.errors.name ? `<p class="err" id="err-fName" role="alert">${state.errors.name}</p>` : ''}
    </div>
    <div class="field">
      <label for="fPhone">Телефон</label>
      <input id="fPhone" type="tel" data-act="f" data-field="phone" value="${state.user.phone}" placeholder="+7 900 000-00-00"
        autocomplete="tel" inputmode="tel" enterkeyhint="next"
        ${state.errors.phone ? 'aria-invalid="true" aria-describedby="err-fPhone"' : ''}>
      ${state.errors.phone ? `<p class="err" id="err-fPhone" role="alert">${state.errors.phone}</p>` : ''}
      <p class="hint">Курьер позвонит только если не найдёт домофон.</p>
    </div>
  </section>
  <section class="section">
    <h2 class="h2" style="margin-bottom:14px">Адрес доставки</h2>
    ${addressBook()}
    <div class="field" style="margin-top:16px">
      <label for="fAddr">Улица, дом, квартира</label>
      <input id="fAddr" data-act="f" data-field="address" value="${state.address}" placeholder="Улица, дом, квартира"
        autocomplete="street-address" autocapitalize="words" enterkeyhint="next"
        ${state.errors.address ? 'aria-invalid="true" aria-describedby="err-fAddr"' : ''}>
      ${state.errors.address ? `<p class="err" id="err-fAddr" role="alert">${state.errors.address}</p>` : ''}
    </div>
    <div class="field">
      <label for="fComment">Комментарий (необязательно)</label>
      <textarea id="fComment" data-act="f" data-field="comment" placeholder="Подъезд, этаж, домофон, пожелания"
        autocapitalize="sentences" enterkeyhint="done">${state.comment}</textarea>
    </div>
  </section>`}

  ${table ? '' : `
  <section class="section">
    <h2 class="h2" style="margin-bottom:12px">${pickup ? 'Время самовывоза' : 'Время доставки'}</h2>
    <div class="seg">
      <button class="${state.timeMode==='asap'?'is-active':''}" data-act="time-mode" data-mode="asap">Как можно скорее</button>
      <button class="${state.timeMode==='slot'?'is-active':''}" data-act="time-mode" data-mode="slot">К определённому времени</button>
    </div>
    ${state.timeMode === 'slot'
      ? slotPicker()
      : `<p class="muted small" style="margin-top:12px">Привезём за ${RULES.prepTime} после подтверждения заказа.</p>`}
    ${state.errors.slot ? `<p class="err" role="alert">${state.errors.slot}</p>` : ''}
  </section>`}

  <section class="section">
    <h2 class="h2" style="margin-bottom:14px">Способ оплаты</h2>
    ${table ? payMethodRow('table','cash','Оплата у стола','Наличные, карта или СБП — официант принесёт терминал к столу') : ''}
    ${payMethodRow('card','card','Картой онлайн','Visa, Mastercard, МИР — ЮKassa')}
    ${payMethodRow('sbp','wallet','СБП','Оплата по QR-коду через приложение банка')}
    ${table ? '' : payMethodRow('apple','card','Apple Pay','Без ввода карты — подтверждение Face ID')}
    ${table ? '' : payMethodRow('cash','cash','Курьеру наличными','Оплата при получении заказа')}
  </section>

  <section class="section">
    <div class="card">
      <div class="sum-row"><span>Блюда</span><span class="val">${fmt(t.sub)}</span></div>
      <div class="sum-row"><span>Доставка</span><span class="val ${t.delivery===0?'free-tag':''}">${t.delivery===0?(table?'К столу бесплатно':'Бесплатно'):fmt(t.delivery)}</span></div>
      <div class="sum-row"><span>${table ? 'Стол' : 'Время'}</span><span class="val">${table ? state.table.no : (state.slot ? slotFull(state.slot) : 'Как можно скорее')}</span></div>
      <div class="sum-row is-total"><span class="lbl">К оплате</span><span class="val">${fmt(t.total)}</span></div>
      ${state.errors.minOrder ? `<p class="err" role="alert">${state.errors.minOrder}</p>` : ''}
    </div>
  </section>
  <div class="pdp-bar">
    <button class="btn-lime" data-act="checkout-next"><span>${table ? 'Отправить заказ к столу' : 'Перейти к оплате'}</span>${icon('arrowRight')}</button>
  </div>`;
}

function slotPicker(){
  const slots = timeSlots();
  const group = (list, label) => `
    <div class="slot-group">
      <div class="slot-day">${label}</div>
      ${list.length
        ? `<div class="slot-grid">${list.map(s => `
            <button class="slot ${state.slot && state.slot.day===s.day && state.slot.time===s.time ? 'is-on' : ''}"
              data-act="slot-pick" data-day="${s.day}" data-time="${s.time}">${s.time}</button>`).join('')}</div>`
        : `<div class="muted small">Свободных слотов на сегодня нет</div>`}
    </div>`;
  return `<div class="slot-wrap">${group(slots.today, 'Сегодня')}${group(slots.tomorrow, 'Завтра')}</div>
    <p class="hint">Кухня принимает заказы за ${RULES.leadDelivery} минут до выбранного времени. Слоты обновляются после подтверждения оператора.</p>`;
}

function addressBook(){
  return `
  <div class="addr-list">
    ${state.addresses.map(a => `
      <div class="addr-row ${state.addressId===a.id?'is-on':''}" data-act="addr-select" data-id="${a.id}" role="button" tabindex="0" aria-pressed="${state.addressId===a.id}">
        <div class="pay-icon">${icon(a.label === 'Дом' ? 'home' : 'office')}</div>
        <div class="grow">
          <div class="pay-name">${a.label}</div>
          <div class="pay-note">${a.address}</div>
        </div>
        ${state.addressId === a.id
          ? '<span class="radio"></span>'
          : `<button class="addr-del" data-act="addr-delete" data-id="${a.id}" aria-label="Удалить адрес ${a.label}">${icon('trash')}</button>`}
      </div>`).join('')}
  </div>
  <div class="field" style="margin-top:14px">
    <label for="fNewAddr">Новый адрес</label>
    <input id="fNewAddr" data-act="f" data-field="newAddress" value="${state.newAddress}" placeholder="Улица, дом, квартира"
      autocomplete="street-address" autocapitalize="words" enterkeyhint="done"
      ${state.errors.newAddress ? 'aria-invalid="true" aria-describedby="err-fNewAddr"' : ''}>
    ${state.errors.newAddress ? `<p class="err" id="err-fNewAddr" role="alert">${state.errors.newAddress}</p>` : ''}
  </div>
  <button class="btn-outline" data-act="addr-add">${icon('plus')} Добавить адрес</button>`;
}

function payMethodRow(id, ico, name, note){
  return `
  <div class="pay-row ${state.payMethod===id?'is-on':''}" data-act="pay-method" data-id="${id}" role="button" tabindex="0" aria-pressed="${state.payMethod===id}">
    <div class="pay-icon">${icon(ico)}</div>
    <div class="grow">
      <div class="pay-name">${name}</div>
      <div class="pay-note">${note}</div>
    </div>
    <span class="radio"></span>
  </div>`;
}

function scrPayment(){
  const t = totals();
  const promoOk = state.promo && PROMOS.some(p => p.code === state.promo);
  return `
  ${appBar('Оплата')}
  <section class="section">
    <div class="eyebrow">ШАГ 2 ИЗ 2</div>
    <h1 class="h1" style="margin-top:10px">Подтвердите заказ</h1>
  </section>
  <section class="section">
    <div class="card">
      ${cartLines().map(l => {
        const d = dishById(l.dishId);
        return `<div class="sum-row"><span>${d.name} × ${l.qty}</span><span class="val">${fmt(lineUnit(l)*l.qty)}</span></div>`;
      }).join('')}
      <div class="sum-row"><span>Доставка</span><span class="val ${t.delivery===0?'free-tag':''}">${t.delivery===0?(state.deliveryType==='table'?'К столу бесплатно':'Бесплатно'):fmt(t.delivery)}</span></div>
      <div class="sum-row"><span>${state.deliveryType==='table' ? 'Стол' : 'Время'}</span><span class="val">${state.deliveryType==='table' ? state.table.no : (state.slot ? slotFull(state.slot) : 'Как можно скорее')}</span></div>
      ${t.discount ? `<div class="sum-row"><span>Промокод ${state.promo}</span><span class="val free-tag">−${fmt(t.discount)}</span></div>` : ''}
      ${t.bonusUse ? `<div class="sum-row"><span>Бонусы «Васаби»</span><span class="val free-tag">−${fmt(t.bonusUse)}</span></div>` : ''}
      <div class="sum-row is-total"><span class="lbl">К оплате</span><span class="val">${fmt(t.total)}</span></div>
    </div>
  </section>

  <section class="section">
    <h2 class="h2" style="margin-bottom:12px">Промокод</h2>
    <div class="row gap-10">
      <div class="grow"><input class="input-plain" data-act="f" data-field="promoInput" value="${state.promoInput || ''}" placeholder="WASABI10"
        aria-label="Промокод" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done"
        ${state.promoMsg ? 'aria-describedby="promoMsg"' : ''}></div>
      <button class="btn-outline" data-act="apply-promo">Применить</button>
    </div>
    ${state.promoMsg ? `<p class="${promoOk?'ok':'err'}" id="promoMsg"${promoOk?'':' role="alert"'}>${state.promoMsg}</p>` : ''}
    <p class="muted small" style="margin-top:10px">Действующие: ${activePromos().map(p => `${p.code} (${p.label}${p.min ? ', от ' + fmt(p.min) : ''})`).join(', ')}.</p>
  </section>

  <section class="section">
    <div class="section-head"><h2 class="h2">Бонусы «Васаби»</h2><span class="count">баланс 0 ${NBSP}баллов</span></div>
    <div class="card">
      <p class="small soft">Программа лояльности iiko: баланс недоступен — нет подключения к iiko. Начисления и списания не выполняются.</p>
      <div class="bonus-bar"><i style="width:0%"></i></div>
      <div class="bonus-val"><span>Доступно к списанию:</span><b>${fmt(t.bonusMax)}</b><span>(${RULES.bonusMaxPay}% от суммы)</span></div>
    </div>
  </section>

  <section class="section">
    <div class="notice">${icon('info')}<span>Оплата проходит через защищённый шлюз ЮKassa. Данные карты не хранятся на нашей стороне — используется токен.</span></div>
  </section>

  <div class="pdp-bar">
    <button class="btn-lime" data-act="pay" ${state.paying?'disabled':''}>
      <span>${state.paying ? 'Обрабатываем платёж…' : 'Оплатить ' + fmt(t.total)}</span>
      ${state.paying ? icon('refresh') : icon('arrowRight')}
    </button>
  </div>`;
}

function scrStatus(){
  const order = state.orders.find(o => o.id === state.currentOrderId) || state.orders[0];
  if (!order) return `<div class="empty">Нет активного заказа</div>`;
  if (DEAD_STATUSES.includes(order.status)) return scrStatusRejected(order);
  const idx = flowFor(order).findIndex(s => s.key === order.status);
  const cur = idx < 0 ? 0 : idx;
  const isTable = order.deliveryType === 'table';
  const loc = LOCATIONS[0];
  const eta = order.slot ? slotFull(order.slot) : 'сегодня';
  return `
  ${appBar('Статус заказа')}
  <section class="section">
    <div class="status-hero">
      <div class="eyebrow">ЗАКАЗ №${order.no}${isTable ? ' · СТОЛ ' + order.tableNo : ''}</div>
      <h1 class="h1" style="margin-top:10px">${flowFor(order)[cur].title}</h1>
      <p class="soft" style="margin-top:8px;font-size:15px">${
        order.status==='done' ? (isTable ? 'Подано к столу. Приятного аппетита!' : 'Заказ доставлен. Приятного аппетита!')
        : isTable ? `Принесём к столу через ${RULES.prepTable}`
        : (order.slot ? `Приедем ${eta}` : 'Приедем за 45–60 минут после приготовления')}</p>
      ${order.status!=='done' ? `<div class="eta-chip">${icon('clock')} ${order.slot ? 'К ' + eta : (isTable ? 'Через ' + RULES.prepTable : 'Ожидаемо к 16:10')}</div>` : ''}
    </div>
  </section>

  <section class="section">
    <div class="card">
      <div class="tl">
        ${flowFor(order).map((s,i) => `
          <div class="tl-item ${i<cur?'is-done':''} ${i===cur?'is-now':''}">
            <span class="tl-dot">${i<cur?icon('check'):''}</span>
            <div class="tl-title">${s.title}</div>
            <div class="tl-sub">${i<=cur ? s.sub + ' · ' + s.time : 'ожидается'}</div>
          </div>`).join('')}
      </div>
    </div>
  </section>

  ${order.status==='courier' || order.status==='way' ? `
  <section class="section">
    <div class="card">
      <div class="row between">
        <div class="row gap-10">
          <div class="pay-icon">${icon('scooter')}</div>
          <div>
            <div class="pay-name">Иван, велокурьер</div>
            <div class="pay-note">${loc.name} → ${order.address}</div>
          </div>
        </div>
        <button class="btn-outline" data-act="toast" data-msg="Прототип: карта курьера появится после подключения трекинга">Карта</button>
      </div>
    </div>
  </section>` : ''}

  <section class="section">
    <div class="card">
      <h2 class="h2">Состав заказа</h2>
      <div style="margin-top:10px">
        ${order.items.map(i => `<div class="sum-row"><span>${i.name} × ${i.qty}</span><span class="val">${fmt(i.price*i.qty)}</span></div>`).join('')}
        <div class="sum-row"><span>${isTable ? 'Обслуживание за столом' : 'Доставка'}</span><span class="val ${order.delivery===0?'free-tag':''}">${order.delivery===0?'Бесплатно':fmt(order.delivery)}</span></div>
        <div class="sum-row is-total"><span class="lbl">Итого</span><span class="val">${fmt(order.total)}</span></div>
      </div>
    </div>
  </section>

  ${order.status === 'new' ? `
  <section class="section">
    <button class="btn-outline wide-danger" data-act="cancel-order" data-id="${order.id}">${icon('x')} Отменить заказ</button>
    <p class="muted small" style="margin-top:8px;text-align:center">Пока заказ не приняли в работу — отмена без комиссии.</p>
  </section>` : ''}

  <section class="section">
    <div class="row gap-10">
      <button class="btn-outline grow" data-act="advance-status" style="border-radius:999px;padding:13px 16px">Следующий статус</button>
      <button class="btn-outline grow" data-act="go" data-screen="orders" style="border-radius:999px;padding:13px 16px">Все заказы</button>
    </div>
  </section>`;
}

function scrStatusRejected(order){
  const cancelled = order.status === 'cancelled';
  return `
  ${appBar('Статус заказа')}
  <section class="section">
    <div class="reject-hero ${cancelled ? 'is-cancel' : 'is-reject'}">
      <span class="reject-ico">${icon(cancelled ? 'x' : 'info')}</span>
      <div class="eyebrow">ЗАКАЗ №${order.no}</div>
      <h1 class="h1" style="margin-top:10px">${cancelled ? 'Заказ отменён' : 'Ресторан отказал в заказе'}</h1>
      <p class="soft" style="margin-top:10px;font-size:14.5px">${order.rejectReason || (cancelled ? 'Вы отменили заказ до того, как его приняли в работу.' : 'Ресторан не смог принять заказ в работу.')}</p>
    </div>
  </section>

  <section class="section">
    <div class="card">
      <h2 class="h2">Что с деньгами</h2>
      <p class="soft small" style="margin-top:8px">${cancelled
        ? 'Оплата не списывалась. Если средства заблокированы, они разблокируются автоматически в течение 1–3 рабочих дней.'
        : 'Оплата не списывалась. Если средства заблокированы, они разблокируются автоматически в течение 1–3 рабочих дней.'}</p>
      <div class="sum-row is-total"><span class="lbl">Возврат</span><span class="val">${fmt(order.total)}</span></div>
      <p class="muted small" style="margin-top:8px">Если возврат не пришёл за 3 дня — напишите в поддержку, разберём заказ вручную.</p>
    </div>
  </section>

  <section class="section">
    <div class="card">
      <h2 class="h2">Состав заказа</h2>
      <div style="margin-top:10px">
        ${order.items.map(i => `<div class="sum-row"><span>${i.name} × ${i.qty}</span><span class="val">${fmt(i.price*i.qty)}</span></div>`).join('')}
        <div class="sum-row is-total"><span class="lbl">Итого</span><span class="val">${fmt(order.total)}</span></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="row gap-10">
      <button class="btn-lime grow" data-act="repeat-order" data-id="${order.id}"><span>Повторить заказ</span>${icon('arrowRight')}</button>
      <button class="btn-outline grow" data-act="go" data-screen="catalog" style="border-radius:999px;padding:13px 16px">В меню</button>
    </div>
  </section>`;
}

function scrOrders(){
  const orders = state.orders;
  return `
  ${appHeader()}
  <section class="section" style="padding-top:4px">
    <h1 class="h1">Ваши заказы</h1>
  </section>
  <section class="section">
    <div class="panel-olive">
      <div class="eyebrow">ВАСАБИ / ВАШИ ВЕЧЕРА</div>
      <div style="font-size:24px;font-weight:700;margin-top:10px">${orders.length} в истории</div>
      <p class="soft small" style="margin-top:6px">До 200 последних заказов вашего аккаунта · Cloud</p>
    </div>
  </section>
  <section class="section">
    <div class="notice">${icon('info')}<span>Это демонстрационные заказы: доступны в вашем аккаунте и тестовой очереди сотрудников. Заказ не передаётся в iiko, оплата и реальная доставка не выполняются.</span></div>
  </section>
  <section class="section" style="text-align:center">
    <button class="link-line" data-act="refresh-orders">${icon('refresh')} Обновить историю</button>
  </section>
  <section class="section">
    ${orders.length ? orders.map(o => `
      <article class="order-card">
        <div class="order-top">
          <span class="order-no">№${o.no}</span>
          <span class="order-total">${fmt(o.total)}</span>
        </div>
        <div class="order-date">${o.date}</div>
        <span class="status-badge">${icon('bag')} ${statusLabel(o)}</span>
        <div class="order-line">${o.items.map(i => `${i.name} × ${i.qty}`).join(', ')}</div>
        <div class="order-addr">${icon(o.deliveryType === 'table' ? 'utensils' : 'pin')} ${o.address}</div>
        <div class="order-addr">${icon('clock')} ${o.slot ? slotFull(o.slot) : (o.deliveryType === 'table' ? `К столу ${o.tableNo} — ${RULES.prepTable}` : (o.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка как можно скорее'))}</div>
        <div class="row gap-10" style="margin-top:14px">
          <button class="btn-outline" data-act="open-order" data-id="${o.id}">Подробнее</button>
          <button class="btn-outline" data-act="repeat-order" data-id="${o.id}">Повторить заказ</button>
        </div>
      </article>`).join('') : `<div class="empty">Заказов пока нет</div>`}
  </section>`;
}

function scrProfile(){
  return `
  ${appHeader()}
  <section class="section" style="padding-top:4px">
    <h1 class="h1">Личный кабинет</h1>
  </section>
  <section class="section">
    <div class="profile-hero">
      <span class="leaf">${icon('leaf')}</span>
      <div class="eyebrow">ВАСАБИ / СВОИ ЛЮДИ</div>
      <div class="profile-name">${state.user.name}</div>
      <div class="profile-mail">${state.user.email}</div>
      <div class="profile-role">${icon('user')} ${state.user.role}</div>
    </div>
  </section>
  <section class="section">
    <div class="card">
      <div class="row between">
        <h2 class="h2">Бонусы «Васаби»</h2>
        <span style="color:var(--lime)">${icon('gift')}</span>
      </div>
      <p class="muted small" style="margin-top:4px">Программа лояльности iiko</p>
      <div class="bonus-bar"><i style="width:2%"></i></div>
      <div class="bonus-val"><span>0</span><span>баллов</span></div>
      <p class="muted small" style="margin-top:12px">Баланс недоступен: нет подключения к iiko. Начисления и списания не выполняются.</p>
      <div style="border-top:1px solid var(--line-soft);margin-top:14px;padding-top:14px">
        <p class="muted small">${icon('clock')} История баллов появится после подключения к iiko.</p>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="card">
      <div class="row between">
        <div>
          <h2 class="h2">История заказов</h2>
          <p class="muted small" style="margin-top:4px">${state.orders.length} в истории (до 200 последних) · Cloud</p>
        </div>
        <span style="color:var(--lime)">${icon('receipt')}</span>
      </div>
      <button class="link-line" data-act="go" data-screen="orders" style="margin-top:10px">${icon('arrowRight')} Посмотреть заказы</button>
    </div>
  </section>
  <section class="section">
    <div class="card">
      <div class="row between">
        <div>
          <h2 class="h2">Избранное</h2>
          <p class="muted small" style="margin-top:4px">${state.favorites.length} ${plural(state.favorites.length,'блюдо','блюда','блюд')} · повторный заказ в один тап</p>
        </div>
        <span style="color:var(--lime)">${icon('heart')}</span>
      </div>
      <button class="link-line" data-act="go" data-screen="favorites" style="margin-top:10px">${icon('arrowRight')} Открыть избранное</button>
    </div>
  </section>
  <section class="section">
    <h2 class="h2" style="margin-bottom:14px">Адресная книга</h2>
    ${addressBook()}
  </section>
  <section class="section">
    <h2 class="h2" style="margin-bottom:14px">Контакты для доставки</h2>
    <div class="field">
      <label for="pName">Имя</label>
      <input id="pName" data-act="f" data-field="name" value="${state.user.name}"
        autocomplete="given-name" autocapitalize="words" enterkeyhint="next">
    </div>
    <div class="field">
      <label for="pPhone">Телефон (без подтверждения)</label>
      <input id="pPhone" data-act="f" data-field="phone" value="${state.user.phone}"
        type="tel" autocomplete="tel" inputmode="tel" enterkeyhint="next">
      <p class="hint">Номер используется только как контакт, не для входа.</p>
    </div>
    <div class="field">
      <label for="pAddr">Адрес доставки по умолчанию</label>
      <textarea id="pAddr" data-act="f" data-field="address" autocomplete="street-address"
        autocapitalize="words" enterkeyhint="done">${state.user.address}</textarea>
    </div>
    <button class="btn-lime" data-act="save-contacts"><span>Сохранить контакты</span>${icon('arrowRight')}</button>
  </section>
  <section class="section">
    <h2 class="h2" style="margin-bottom:12px">Доступ сотрудника</h2>
    <div class="card">
      <p class="small soft">Войти в панель ресторана, чтобы принимать заказы, управлять меню и бонусами.</p>
      <button class="btn-outline" style="margin-top:14px" data-act="mode" data-mode="admin">Открыть админ-панель</button>
    </div>
  </section>
  <section class="section">
    <div class="row gap-10">
      <button class="btn-outline grow" data-act="go" data-screen="restaurant" style="border-radius:999px;padding:13px 16px">${icon('pin')} О ресторане</button>
      <button class="btn-outline grow" data-act="go" data-screen="promos" style="border-radius:999px;padding:13px 16px">${icon('tag')} Акции</button>
    </div>
  </section>`;
}

function scrPromos(){
  const banners = activeBanners();
  const promos = activePromos();
  return `
  ${appBar('Акции и новости')}
  <section class="section">
    <div class="eyebrow">ВАСАБИ / АКЦИИ</div>
    <h1 class="h1" style="margin-top:10px">Свежие поводы заказать</h1>
    <div class="muted small" style="margin-top:6px">${banners.length} ${plural(banners.length,'акция','акции','акций')} · ${promos.length} ${plural(promos.length,'промокод','промокода','промокодов')}</div>
  </section>
  ${banners.map(b => `
    <section class="section">
      <div class="card promo-full" data-act="open-banner" data-banner="${b.id}">
        <img src="${b.img}" alt="">
        <div class="promo-full-body">
          <span class="promo-tag promo-tag-in">${b.tag}</span>
          <h2 class="h2">${b.title}</h2>
          <p class="muted small" style="margin-top:6px">${b.sub}</p>
          <button class="promo-cta" type="button" data-act="open-banner" data-banner="${b.id}">${b.cta}${icon('arrowRight')}</button>
        </div>
      </div>
    </section>`).join('')}
  <section class="section">
    <h2 class="h2" style="margin-bottom:12px">Промокоды</h2>
    ${promos.map(p => `
      <div class="card" style="margin-bottom:10px;display:flex;align-items:center;gap:14px">
        <div class="pay-icon">${icon('tag')}</div>
        <div class="grow">
          <div class="pay-name">${p.code}</div>
          <div class="pay-note">${p.label}</div>
        </div>
        <button class="btn-outline" data-act="copy-promo" data-code="${p.code}">Применить</button>
      </div>`).join('')}
  </section>`;
}

function scrRestaurant(){
  return `
  ${appBar('О ресторане')}
  <section class="section">
    <div class="eyebrow">ВАСАБИ / МЕСТА</div>
    <h1 class="h1" style="margin-top:10px">Три адреса в городе</h1>
    <p class="soft" style="margin-top:10px;font-size:14.5px">${BRAND.tagline}. Готовим после заказа и доставляем горячим.</p>
  </section>
  ${LOCATIONS.map(l => `
    <section class="section">
      <div class="card">
        <div class="row between">
          <div class="pay-name">${l.name}</div>
          <span class="a-pill lime">${icon('clock')} ${l.hours}</span>
        </div>
        <div class="order-addr" style="margin-top:10px">${icon('pin')} ${l.address}</div>
        <div class="muted small" style="margin-top:8px">${l.delivery}</div>
      </div>
    </section>`).join('')}
  <section class="section">
    <div class="card">
      <div class="row gap-10" style="margin-bottom:12px">${icon('phone')} <b>${BRAND.phone}</b></div>
      <p class="muted small">Поддержка работает ежедневно с 10:00 до 23:00. Среднее время ответа — 2 минуты.</p>
    </div>
  </section>
  <section class="section">
    <div class="card" style="text-align:center">
      <div class="pay-icon" style="margin:0 auto 12px">${icon('qr')}</div>
      <h2 class="h2">QR-меню в зале</h2>
      <p class="muted small" style="margin-top:6px">Отдельный канал заказа с QR-кода на столе: без регистрации и скидка 5% на бонусный счёт.</p>
      <button class="btn-outline" style="margin-top:14px" data-act="open-qr-menu"><span>Открыть QR-меню</span>${icon('arrowRight')}</button>
    </div>
  </section>`;
}

/* --------------------------- QR-меню на столе --------------------------- */

function scrQrMenu(){
  const table = state.table || { no:'12', locId:'l1' };
  const loc = locById(table.locId);
  const list = DISHES.filter(d => (state.qrCat === 'all' || d.cat === state.qrCat) && dishAvailable(d));
  return `
  ${appBar('QR-меню')}
  <section class="section" style="padding-top:4px">
    <div class="table-card">
      <div class="row between">
        <div>
          <div class="eyebrow">ВЫ ЗАКАЗАЛИ В ЗАЛЕ</div>
          <h1 class="h1" style="margin-top:8px">Стол ${table.no}</h1>
          <div class="muted small" style="margin-top:6px">${loc.address} · ${loc.hours}</div>
        </div>
        <div class="table-mark">${icon('qr')}</div>
      </div>
      <div class="table-facts">
        <span class="a-pill lime">${icon('check')} Без регистрации</span>
        <span class="a-pill">${icon('clock')} ${RULES.prepTable}</span>
        <span class="a-pill">${icon('wallet')} Оплата у стола</span>
      </div>
    </div>
  </section>
  <section class="section" style="margin-bottom:0">
    <div class="chips-wrap">
      <div class="chips" role="group" aria-label="Категории меню в зале">
        ${CATEGORIES.map(c => `<button class="chip ${state.qrCat===c.id?'is-active':''}" data-act="qr-cat" data-cat="${c.id}">${c.name}</button>`).join('')}
      </div>
    </div>
  </section>
  <section class="section" style="margin-top:18px">
    <div class="section-head">
      <h2 class="h2">${state.qrCat==='all'?'Всё меню':CATEGORIES.find(c=>c.id===state.qrCat).name}</h2>
      <span class="count">${list.length} ${plural(list.length,'блюдо','блюда','блюд')}</span>
    </div>
    ${list.length ? `<div class="dish-grid">${list.map(d => dishCard(d)).join('')}</div>`
      : `<div class="empty">В этой категории пока нет блюд. Выберите другую.</div>`}
  </section>
  <section class="section">
    <div class="notice">${icon('info')}<span>Меню обновляется с тем же стоп-листом, что и у зала: снятое с продажи блюдо исчезает сразу. Официант принесёт заказ и счёт к столу.</span></div>
  </section>`;
}

function scrOnboarding(){
  if (state.authStep === 'phone'){
    return `
    <section class="section" style="padding-top:44px">
      <div class="row gap-10">
        <span class="logo-mark">${icon('leaf')}</span>
        <div class="wordmark">васаби<span class="dot">.</span></div>
      </div>
      <h1 class="h1" style="margin-top:32px">Вкусный вечер начинается здесь</h1>
      <p class="soft" style="margin-top:12px;font-size:15px">Войдите по номеру телефона — SMS-код придёт за секунду.</p>
    </section>
    <section class="section" style="margin-top:26px">
      <div class="field">
        <label for="authPhone">Номер телефона</label>
        <input id="authPhone" type="tel" placeholder="+7 900 000-00-00" value="${state.user.phone}"
          autocomplete="tel" inputmode="tel" enterkeyhint="next">
      </div>
      <button class="btn-lime" data-act="auth-phone"><span>Получить код</span>${icon('arrowRight')}</button>
    </section>
    <section class="section">
      <div class="card">
        <p class="small soft">Регистрируясь, вы соглашаетесь с обработкой персональных данных (152-ФЗ) и получаете push-уведомления о статусе заказа.</p>
      </div>
    </section>`;
  }
  return `
  ${appBar('Подтверждение')}
  <section class="section" style="padding-top:18px">
    <div class="eyebrow">КОД ИЗ SMS</div>
    <h1 class="h1" style="margin-top:10px">Введите код</h1>
    <p class="soft" style="margin-top:10px;font-size:14.5px">Отправили код на ${state.user.phone}</p>
  </section>
  <section class="section">
    <div class="code-input">
      <input maxlength="1" value="1" inputmode="numeric" autocomplete="one-time-code" aria-label="Цифра 1"><input maxlength="1" value="2" inputmode="numeric" autocomplete="off" aria-label="Цифра 2"><input maxlength="1" value="3" inputmode="numeric" autocomplete="off" aria-label="Цифра 3"><input maxlength="1" value="4" inputmode="numeric" autocomplete="off" aria-label="Цифра 4">
    </div>
    <button class="btn-lime" style="margin-top:20px" data-act="auth-code"><span>Войти</span>${icon('arrowRight')}</button>
    <button class="btn-outline" style="margin-top:14px;width:100%" data-act="auth-resend">Отправить код ещё раз</button>
  </section>`;
}

/* ------------------------------- отрисовка ------------------------------ */

let statusTimer = null;
let lastScreen = null;

/* Перерисовка заменяет весь HTML экрана, и фокус теряется: запоминаем элемент
   по его data-act (или id) и позиции, а потом возвращаем фокус на то же место.
   Поля ввода не трогаем — иначе на телефоне снова всплывает клавиатура. */
function captureFocus(){
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return null;
  const act = el.dataset && el.dataset.act;
  const sel = act ? `[data-act="${act}"]` : (el.id ? '#' + el.id : null);
  if (!sel) return null;
  const i = [...document.querySelectorAll(sel)].indexOf(el);
  return i < 0 ? null : {sel, i};
}

function restoreFocus(key){
  if (!key) return;
  const el = [...document.querySelectorAll(key.sel)][key.i];
  if (el) el.focus({preventScroll:true});
}
window.restoreFocus = restoreFocus;
window.captureFocus = captureFocus;

/* после неудачной проверки фокус должен встать на первое проблемное поле:
   без этого клавиатура и скринридер остаются в начале экрана, а ошибку не найти */
function focusFirstError(){
  const el = document.querySelector('#viewport [aria-invalid="true"]');
  if (!el) return;
  el.focus({preventScroll: true});
  el.scrollIntoView({block: 'center'});
}

function render(){
  const vp = $('#viewport');
  const scr = state.screen;
  const map = {
    home: scrHome, catalog: scrCatalog, product: scrProduct, cart: scrCart,
    checkout: scrCheckout, payment: scrPayment, status: scrStatus,
    orders: scrOrders, favorites: scrFavorites, profile: scrProfile,
    promos: scrPromos, restaurant: scrRestaurant, qrmenu: scrQrMenu,
    onboarding: scrOnboarding
  };

  // позиция прокрутки сохраняется при перерисовке того же экрана
  const keepScroll = lastScreen === scr ? vp.scrollTop : 0;
  const keepWinY = window.scrollY;
  const active = document.activeElement;
  const fkey = captureFocus();
  if (active && active !== document.body && vp.contains(active)) active.blur();

  vp.innerHTML = (map[scr] || scrHome)();
  vp.scrollTop = keepScroll;
  restoreFocus(fkey);

  // нижняя навигация
  const meta = SCREENS[scr] || SCREENS.home;
  vp.setAttribute('role','region');
  vp.setAttribute('aria-label', 'Экран: ' + meta.title);
  $('#tabbar').innerHTML = meta.tab ? TABS.map(t => {
    const badge = t.id === 'cart' ? cartCount() : 0;
    const badgeLabel = t.id === 'cart' && badge ? ', в корзине ' + badge : '';
    return `<button class="tab ${meta.tab===t.id?'is-active':''}" data-act="tab" data-tab="${t.id}"
      aria-label="${t.label}${badgeLabel}"
      ${meta.tab===t.id ? 'aria-current="page"' : ''}>
      ${t.id==='cart' && badge ? `<span class="tab-badge" aria-hidden="true">${badge}</span>` : ''}
      ${icon(t.icon)}<span>${t.label}</span>
    </button>`;
  }).join('') : '';

  // полоса корзины
  const showBar = meta.cartbar && cartCount() > 0;
  $('#cartbarSlot').innerHTML = showBar ? `
    <div class="cartbar">
      <button class="cartbar-inner" data-act="go" data-screen="cart">
        <span class="cb-left">${icon('bag')} Корзина · ${cartCount()}</span>
        <span class="cb-right">${fmt(totals().total)} <span class="cb-arrow">→</span></span>
      </button>
    </div>` : '';

  renderInspector();
  lastScreen = scr;
  if (window.scrollY !== keepWinY) window.scrollTo(0, keepWinY);
  scheduleStatus();
}

function scheduleStatus(){
  clearInterval(statusTimer);
  if (state.screen !== 'status' || !state.autoStatus) return;
  const order = state.orders.find(o => o.id === state.currentOrderId);
  if (!order || order.status === 'done' || DEAD_STATUSES.includes(order.status)) return;
  statusTimer = setInterval(() => advanceStatus(), 6000);
}

function advanceStatus(){
  const order = state.orders.find(o => o.id === state.currentOrderId);
  if (!order || DEAD_STATUSES.includes(order.status)) return;
  const flow = flowFor(order);
  const idx = flow.findIndex(s => s.key === order.status);
  if (idx < 0 || idx >= flow.length - 1) return;
  order.status = flow[idx + 1].key;
  toast('Статус заказа: ' + flow[idx + 1].title);
  render();
}

/* Что уже умеет прототип — список для владельца, поэтому он разделён на
   приложение гостя и админку и держит список в одном файле с тем, что есть на самом деле */
const FEATURE_GROUPS = [
  { title:'Приложение гостя', items:[
    'Главная: поиск сверху, hero, карусель акций, «Повторить заказ», лента любимого',
    'Каталог: все блюда, фильтр по категориям, поиск по всему меню',
    'Карточка блюда: фото, состав, честные аллергены, модификаторы с доплатой',
    'Избранное: сердечко в карточке, добавление всех блюд в корзину',
    'Корзина: степперы, минимальный заказ, допродажи к заказу',
    'Оформление: доставка / самовывоз, адресная книга, слоты времени, способ оплаты',
    'Оплата: подтверждение заказа, промокод и бонусы, карта / СБП / Apple Pay / наличные',
    'Статус заказа: таймлайн, отмена, экран отказа с возвратом',
    'Мои заказы: история заказов и их статусы',
    'Стоп-лист: блюдо пропадает из меню гостя сразу',
    'Акции: карусель на главной, тап = промокод или блюдо',
    'QR-меню на столе: заказ к столу без регистрации, оплата у стола',
    'Профиль: бонусы, контакты, адресная книга, история заказов, доступ сотрудника',
    'Вход по SMS: экран с кодом есть, но гость попадает на него только из списка экранов'
  ]},
  { title:'Админ-панель', items:[
    'Меню: создание и правка блюда, своё фото с телефона, стоп-лист',
    '«На главной»: какие блюда попадают в ленту любимого (до 6)',
    'Маркетинг: промокоды, карусель акций, порядок и включение, push-рассылка',
    'Заказы: приём, статусы, отклонение с причиной',
    'Клиенты: начисление бонусов, удаление, импорт базы из старой CRM',
    'QR-меню: ссылки на столы, PNG для печати, листы A4',
    'Аналитика: выручка, средний чек, доставка против самовывоза, выгрузка CSV и Excel',
    'Настройки: доставка, минимальный заказ, время приготовления, точки, роли',
    'Мобильный вид: широкие таблицы превращаются в карточки, кнопки — под палец'
  ]}
];

function renderInspector(){
  $('#screenList').innerHTML = Object.entries(SCREENS).map(([k,v]) => `
    <button class="insp-item ${state.screen===k?'is-active':''}" data-act="go" data-screen="${k}">
      <span class="k">${icon(v.icon)} ${v.title}</span>
      ${state.screen===k ? icon('check') : ''}
    </button>`).join('');
  const t = totals();
  $('#inspState').innerHTML = `
    <dt>Позиций в корзине</dt><dd>${cartCount()}</dd>
    <dt>Сумма корзины</dt><dd>${fmt(t.total)}</dd>
    <dt>Заказов</dt><dd>${state.orders.length}</dd>
    <dt>Промокод</dt><dd>${state.promo || '—'}</dd>
    <dt>Экран</dt><dd>${SCREENS[state.screen].title}</dd>
    <dt>Размер рамки</dt><dd id="sizeReadout">—</dd>`;
  $('#inspFeatures').innerHTML = FEATURE_GROUPS.map(g => `
    <li class="insp-group">${g.title}</li>
    ${g.items.map(f => `<li>${f}</li>`).join('')}
  `).join('');
  fitDevice();
}

/* --------------------------------- тосты --------------------------------- */

let toastTimer = null;
function toast(msg){
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2400);
}

/* ------------------------------- действия -------------------------------- */

/* Тап по карточке акции с промокодом и кнопка «Применить» на экране акций делают одно */
function applyPromoCode(code){
  const p = PROMOS.find(x => x.code === code);
  if (!p || !p.active){ toast('Промокод ' + code + ' отключён'); return; }
  state.promoInput = p.code;
  if (cartSubtotal() < p.min){
    state.promo = null;
    state.promoMsg = `Промокод ${p.code} действует от ${fmt(p.min)}`;
  } else {
    state.promo = p.code;
    state.promoMsg = `Промокод ${p.code} применён`;
  }
  toast(state.promoMsg);
  go('cart');
}

/* Точки карусели = левая видимая карточка: свайп, стрелки и колёсико дают один и тот же отклик */
function syncPromoDots(rail){
  const dots = $('#promoDots');
  if (!dots) return;
  const x = rail.getBoundingClientRect().left;
  let i = 0;
  [...rail.children].forEach((el, idx) => { if (el.getBoundingClientRect().left - x <= 2) i = idx; });
  [...dots.children].forEach((d, idx) => d.classList.toggle('is-on', idx === i));
}

function scrollRail(dir){
  const rail = $('#promoRail');
  if (!rail || rail.children.length < 2) return;
  const step = rail.children[0].offsetWidth + (parseFloat(getComputedStyle(rail).columnGap) || 0);
  const max = rail.scrollWidth - rail.clientWidth;
  rail.scrollTo({ left: Math.max(0, Math.min(max, rail.scrollLeft + dir * step)), behavior:'smooth' });
}

const ACTIONS = {
  back: () => back(),
  go: (el) => go(el.dataset.screen),
  home: () => {
    state.table = null;
    if (state.deliveryType === 'table'){ state.deliveryType = 'delivery'; state.payMethod = 'card'; }
    state.stack.length = 0;
    go('home', { top:true, from:false });
  },
  'open-qr-menu': () => openTableMenu({ no:'12', locId:'l1' }),
  'qr-cat': (el) => { state.qrCat = el.dataset.cat; render(); },
  tab: (el) => {
    const t = TABS.find(x => x.id === el.dataset.tab);
    go(t.screen, { top:true });
  },
  mode: (el) => switchMode(el.dataset.mode),
  'open-dish': (el) => go('product', { dishId: el.dataset.dish }),
  'quick-add': (el) => {
    const d = dishById(el.dataset.dish);
    if (!d || !dishAvailable(d)){ toast('Блюдо сейчас недоступно'); return; }
    const key = lineKey(d.id, []);
    state.cart[key] = state.cart[key] || { key, dishId:d.id, qty:0, mods:[] };
    state.cart[key].qty++;
    toast(d.name + ' — в корзине');
    render();
  },
  'add-product': () => {
    const d = dishById(state.productId);
    if (!d || !dishAvailable(d)){ toast('Блюдо сейчас недоступно'); return; }
    const key = lineKey(d.id, state.productMods);
    state.cart[key] = state.cart[key] || { key, dishId:d.id, qty:0, mods:state.productMods.slice() };
    state.cart[key].qty++;
    toast(d.name + ' — в корзине');
    render();
  },
  fav: (el) => {
    const id = el.dataset.dish;
    const i = state.favorites.indexOf(id);
    if (i < 0) state.favorites.push(id); else state.favorites.splice(i,1);
    toast(i < 0 ? 'Добавлено в избранное' : 'Убрано из избранного');
    render();
  },
  'fav-add-all': () => {
    const avail = favDishes().filter(dishAvailable);
    if (!avail.length){ toast('Нет доступных блюд'); return; }
    avail.forEach(d => {
      const key = lineKey(d.id, []);
      state.cart[key] = state.cart[key] || { key, dishId:d.id, qty:0, mods:[] };
      state.cart[key].qty++;
    });
    toast('Избранное перенесено в корзину');
    go('cart');
  },
  'upsell-add': (el) => {
    const d = dishById(el.dataset.dish);
    if (!d || !dishAvailable(d)){ toast('Блюдо сейчас недоступно'); return; }
    const key = lineKey(d.id, []);
    state.cart[key] = state.cart[key] || { key, dishId:d.id, qty:0, mods:[] };
    state.cart[key].qty++;
    toast(d.name + ' — в корзине');
    render();
  },
  'upsell-add-all': () => {
    const ids = upsellIds();
    if (!ids.length) return;
    ids.forEach(id => {
      const key = lineKey(id, []);
      state.cart[key] = state.cart[key] || { key, dishId:id, qty:0, mods:[] };
      state.cart[key].qty++;
    });
    toast(ids.length + ' ' + plural(ids.length,'блюдо','блюда','блюд') + ' в корзине');
    render();
  },
  'toggle-mod': (el) => {
    const id = el.dataset.mod;
    const i = state.productMods.indexOf(id);
    if (i < 0) state.productMods.push(id); else state.productMods.splice(i,1);
    render();
  },
  'qty-plus': (el) => {
    const l = state.cart[el.dataset.key];
    if (l){ l.qty++; render(); }
  },
  'qty-minus': (el) => {
    const l = state.cart[el.dataset.key];
    if (!l) return;
    l.qty--;
    if (l.qty <= 0) delete state.cart[el.dataset.key];
    render();
  },
  cat: (el) => {
    state.cat = el.dataset.cat;
    /* на главной чипсы — ярлыки: там показана только лента любимого,
       фильтр без перехода имел бы смысл, если бы там лежал весь список */
    if (state.screen !== 'catalog') go('catalog');
    else render();
  },
  'delivery-type': (el) => {
    state.deliveryType = el.dataset.type;
    state.slot = null;
    if (state.deliveryType === 'table') state.payMethod = 'table';
    else if (state.payMethod === 'table') state.payMethod = 'card';
    render();
  },
  'pick-location': (el) => { state.locationId = el.dataset.id; state.slot = null; render(); },
  'pay-method': (el) => { state.payMethod = el.dataset.id; render(); },
  'time-mode': (el) => {
    state.timeMode = el.dataset.mode;
    delete state.errors.slot;
    if (state.timeMode === 'asap'){ state.slot = null; }
    else if (!state.slot){
      const s = timeSlots();
      const first = s.today[0] || s.tomorrow[0];
      state.slot = first ? { day:first.day, time:first.time } : null;
    }
    render();
  },
  'slot-pick': (el) => {
    state.slot = { day:el.dataset.day, time:el.dataset.time };
    delete state.errors.slot;
    render();
  },
  'addr-select': (el) => {
    const a = state.addresses.find(x => x.id === el.dataset.id);
    if (!a) return;
    state.addressId = a.id;
    state.address = a.address;
    render();
  },
  'addr-add': () => {
    const v = (state.newAddress || '').trim();
    if (!v){ state.errors.newAddress = 'Введите адрес'; render(); focusFirstError(); return; }
    const id = 'a' + Date.now();
    state.addresses.push({ id, label:'Адрес ' + (state.addresses.length + 1), address:v });
    state.addressId = id;
    state.address = v;
    state.newAddress = '';
    delete state.errors.newAddress;
    toast('Адрес сохранён');
    render();
  },
  'addr-delete': (el) => {
    state.addresses = state.addresses.filter(a => a.id !== el.dataset.id);
    if (state.addressId === el.dataset.id){
      const first = state.addresses[0];
      state.addressId = first ? first.id : null;
      state.address = first ? first.address : '';
    }
    toast('Адрес удалён');
    render();
  },
  'checkout-next': () => {
    const errs = {};
    const table = state.deliveryType === 'table' && !!state.table;
    if (cartSubtotal() < RULES.minOrder) errs.minOrder = `Минимальный заказ — ${fmt(RULES.minOrder)}. Добавьте ещё ${fmt(minOrderLeft())}`;
    if (state.deliveryType === 'delivery'){
      if (!state.user.name.trim()) errs.name = 'Укажите имя';
      if (!/^\+?\d{10,15}$/.test(state.user.phone.replace(/\D/g,'').replace(/^8/,'7'))) errs.phone = 'Проверьте номер телефона';
      if (!state.address.trim()) errs.address = 'Укажите адрес';
    }
    if (!table && state.timeMode === 'slot' && !state.slot) errs.slot = 'Выберите время доставки';
    state.errors = errs;
    if (Object.keys(errs).length){ render(); focusFirstError(); toast('Проверьте заполненные поля'); return; }
    go('payment');
  },
  'apply-promo': () => {
    const code = (state.promoInput || '').trim().toUpperCase();
    const p = PROMOS.find(x => x.code === code);
    if (!p){ state.promoMsg = 'Промокод не найден'; state.promo = null; }
    else if (!p.active){ state.promoMsg = 'Промокод отключён рестораном'; state.promo = null; }
    else if (cartSubtotal() < p.min){ state.promoMsg = `Промокод действует от ${fmt(p.min)}`; state.promo = null; }
    else { state.promo = p.code; state.promoMsg = `Промокод ${p.code} применён`; }
    render();
  },
  'copy-promo': (el) => applyPromoCode(el.dataset.code),
  'open-banner': (el) => {
    const b = BANNERS.find(x => x.id === el.dataset.banner);
    if (!b) return;
    if (b.kind === 'promo') applyPromoCode(b.code);
    else if (b.kind === 'dish') go('product', { dishId: b.dish });
    else go(b.screen, { top:true });
  },
  'promo-prev': () => scrollRail(-1),
  'promo-next': () => scrollRail(1),
  pay: () => {
    if (state.paying) return;
    state.paying = true;
    render();
    setTimeout(() => {
      const t = totals();
      const order = {
        id:'o'+Date.now(), no: Math.random().toString(36).slice(2,8), date: nowRu(),
        items: cartLines().map(l => ({ dishId:l.dishId, name:dishById(l.dishId).name, qty:l.qty, price:lineUnit(l), mods:l.mods })),
        sub:t.sub, delivery:t.delivery, discount:t.discount, bonus:t.bonusUse, total:t.total,
        status:'new',
        deliveryType: state.deliveryType,
        locationId: state.deliveryType === 'table' ? state.table.locId : state.locationId,
        tableNo: state.deliveryType === 'table' ? state.table.no : null,
        addressId: state.addressId,
        slot: state.timeMode === 'slot' ? state.slot : null,
        address: state.deliveryType === 'table'
          ? `Стол ${state.table.no} · ${locById(state.table.locId).name}`
          : state.deliveryType === 'pickup' ? LOCATIONS.find(l=>l.id===state.locationId).address : state.address,
        comment: state.comment, payment: state.payMethod, promo: state.promo
      };
      state.orders.unshift(order);
      state.currentOrderId = order.id;
      state.cart = {};
      state.promo = null; state.promoInput = ''; state.promoMsg = ''; state.bonusUse = 0;
      state.paying = false;
      toast('Оплата прошла. Заказ принят!');
      go('status');
    }, 1400);
  },
  'open-order': (el) => {
    state.currentOrderId = el.dataset.id;
    go('status');
  },
  'repeat-order': (el) => repeatOrder(state.orders.find(x => x.id === el.dataset.id)),
  'repeat-last': () => repeatOrder(state.orders[0]),
  'cancel-order': (el) => {
    const o = state.orders.find(x => x.id === el.dataset.id);
    if (!o) return;
    if (o.status !== 'new'){ toast('Заказ уже принят в работу — отменить нельзя'); return; }
    o.status = 'cancelled';
    o.rejectReason = 'Вы отменили заказ до того, как его приняли в работу.';
    state.autoStatus = false;
    toast('Заказ отменён');
    render();
  },
  'refresh-orders': () => { toast('История обновлена'); render(); },
  'save-contacts': () => { toast('Контакты сохранены'); render(); },
  'advance-status': () => { state.autoStatus = false; advanceStatus(); },
  'auth-phone': () => { state.authStep = 'code'; render(); },
  'auth-code': () => { state.authStep = 'phone'; toast('Вы вошли в аккаунт'); go('home'); },
  'auth-resend': () => toast('Код отправлен повторно'),
  toast: (el) => toast(el.dataset.msg),
  reset: () => {
    state.cart = {}; state.orders = []; state.promo = null; state.bonusUse = 0;
    state.productMods = []; state.autoStatus = true; state.authStep = 'phone';
    state.favorites = ['d-phil'];
    state.addresses = [
      { id:'a1', label:'Дом',  address:'Москва, ул. Ташкентская, 19, кв. 42' },
      { id:'a2', label:'Офис', address:'Москва, Пресненская наб., 8, стр. 1' }
    ];
    state.addressId = 'a1';
    state.newAddress = '';
    state.timeMode = 'asap';
    state.slot = null;
    state.table = null;
    state.qrCat = 'all';
    state.deliveryType = 'delivery';
    state.payMethod = 'card';
    seedOrders();
    state.currentOrderId = 'o-seed';
    toast('Демо-данные сброшены');
    go('home');
  }
};

/* ------------------------- ввод с клавиатуры ---------------------------- */

function onInput(el){
  const f = el.dataset.field;
  if (!f) return;
  if (f === 'name') state.user.name = el.value;
  if (f === 'phone') state.user.phone = el.value;
  if (f === 'address'){ state.address = el.value; state.user.address = el.value; }
  if (f === 'comment') state.comment = el.value;
  if (f === 'promoInput') state.promoInput = el.value;
  if (f === 'newAddress') state.newAddress = el.value;
}

/* ------------------------------ обработчики ------------------------------ */

document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (act === 'search' || act === 'f') return;
  if (ACTIONS[act]){ ev.preventDefault(); ACTIONS[act](el); }
});

/* scroll не всплывает, поэтому слушатель висит на document в фазе перехвата */
document.addEventListener('scroll', ev => {
  if (ev.target && ev.target.id === 'promoRail') syncPromoDots(ev.target);
}, true);

document.addEventListener('input', ev => {
  const el = ev.target;
  if (el.dataset && el.dataset.act === 'search'){
    state.query = el.value;
    /* поиск ищется по всему меню: иначе leftover-категория спрятала бы
       половину блюд без всяких следов в интерфейсе */
    if (el.value.trim()) state.cat = 'all';
    if (state.screen === 'home') go('catalog');
    else if (state.screen === 'catalog') render();
    const inp = document.querySelector('#viewport input[data-act="search"]');
    if (inp){ inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    return;
  }
  onInput(el);
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Enter' && ev.target.dataset && ev.target.dataset.act === 'search'){
    /* список фильтруется по мере ввода, так что Enter ничего не меняет */
    ev.preventDefault();
    return;
  }
  /* нативные button/a/input сами превращают Enter и пробел в клик,
     а самодельные кнопки (div со data-act) без этого недоступны с клавиатуры */
  const el = ev.target.closest ? ev.target.closest('[data-act],[role=button]') : null;
  if (!el || el !== ev.target) return;
  if (/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
  if (ev.key === 'Enter' || ev.key === ' '){
    ev.preventDefault();
    el.click();
  }
});

/* --------------------------------- старт -------------------------------- */

function switchMode(mode){
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('is-active', b.dataset.mode === mode));
  document.body.dataset.mode = mode;
  $('#clientStage').hidden = mode !== 'client';
  $('#adminStage').hidden = mode !== 'admin';
  if (mode === 'admin' && window.renderAdmin) window.renderAdmin();
  window.scrollTo(0, 0);
  if (mode === 'client') fitDevice();
}
window.switchMode = switchMode;

document.querySelectorAll('.mode-btn').forEach(b => b.addEventListener('click', () => switchMode(b.dataset.mode)));

/* разрешения сняты с массовых устройств 2024–2026: гость видит ровно тот экран, что у него в руке */
const SIZE_PRESETS = {
  phone:   { w:393,  h:852  },
  max:     { w:430,  h:932  },
  pixel:   { w:412,  h:892  },
  compact: { w:360,  h:780  },
  small:   { w:375,  h:667  },
  tablet:  { w:768,  h:1024 },
  wide:    { w:1024, h:768  }
};

function intendedDeviceWidth(){
  const mode = document.body.dataset.device;
  if (mode === 'full') return 1180;
  if (mode === 'custom') return parseInt($('#sizeW').value, 10) || 393;
  return (SIZE_PRESETS[mode] || SIZE_PRESETS.phone).w;
}

function updateSizeClass(){
  document.body.dataset.sizeClass = intendedDeviceWidth() >= 600 ? 'lg' : 'sm';
  fitDevice();
}

/* Ниже 90% текст становится нечитаемым, а кнопки — мимо пальца: лучше листать страницу */
const FIT_MIN = 0.9;

/* Рамка не сплющивается: масштабируется целиком, но не ниже FIT_MIN.
   Если даже так не влезает по высоте — прилипание отключается и страница листается.
   offsetWidth при zoom остаётся исходным размером макета, поэтому им и считаем */
function fitDevice(){
  const wrap = $('.device-wrap'), d = $('.device');
  if (!wrap || !d) return;
  /* на настоящем телефоне муляж корпуса только мешает: приложение отдаём под весь экран */
  const bare = innerWidth <= 560;
  document.body.dataset.shell = bare ? 'bare' : 'fit';
  const w = d.offsetWidth, h = d.offsetHeight;
  if (!w || !h) return;   // клиентская сцена сейчас скрыта (админка) — масштаба не считаем
  const out = $('#sizeReadout');
  /* размеры экрана приложения, а не рамки: корпус в 10 px по краям в счёт не идёт */
  const s = $('.device-screen');
  const size = s ? s.offsetWidth + ' × ' + s.offsetHeight : '—';
  if (bare){
    document.body.style.setProperty('--fit-scale', '1');
    document.body.dataset.deviceFits = 'yes';
    if (out) out.textContent = size + ' · весь экран';
    return;
  }
  const bar = parseInt(getComputedStyle(document.body).getPropertyValue('--topbar-h'), 10) || 67;
  /* у пресета «во весь экран» ширина уже взята из окна: без неё масштаб устойчивее */
  const fitsWidth = document.body.dataset.device === 'full' ? 1 : (wrap.clientWidth - 4) / w;
  const fitsHeight = (innerHeight - bar - 44) / h;
  const scale = Math.min(Math.min(1, fitsWidth), Math.max(FIT_MIN, Math.min(1, fitsHeight)));
  document.body.style.setProperty('--fit-scale', scale.toFixed(4));
  const scrolls = h * scale > innerHeight - bar - 24;
  document.body.dataset.deviceFits = scrolls ? 'no' : 'yes';
  if (out) {
    out.textContent = size + (scale < .995 ? ' · ' + Math.round(scale * 100) + '% окна' : '')
      + (scrolls ? ' · низ экрана ниже, листать' : '');
  }
}

function applyDeviceSize(mode){
  if (mode === 'custom'){
    const w = Math.min(1600, Math.max(320, parseInt($('#sizeW').value, 10) || 393));
    const h = Math.min(1400, Math.max(480, parseInt($('#sizeH').value, 10) || 852));
    document.body.style.setProperty('--custom-w', w + 'px');
    document.body.style.setProperty('--custom-h', h + 'px');
  }
  document.body.dataset.device = mode;
  const sel = $('#deviceSize');
  if (sel) sel.value = mode;
  const custom = $('#sizeCustom');
  if (custom) custom.hidden = mode !== 'custom';
  updateSizeClass();
}
window.applyDeviceSize = applyDeviceSize;

const sizeSelect = $('#deviceSize');
if (sizeSelect){
  sizeSelect.addEventListener('change', () => {
    const mode = sizeSelect.value;
    if (mode === 'custom'){
      const s = $('.device-screen');
      $('#sizeW').value = s.offsetWidth;
      $('#sizeH').value = s.offsetHeight;
    }
    applyDeviceSize(mode);
  });
}
['sizeW','sizeH'].forEach(id => {
  const el = $('#' + id);
  if (el) el.addEventListener('input', () => applyDeviceSize('custom'));
});
/* Шапка на узком окне переносится в две строки, поэтому прилипание телефона
   и инспектора считается от её живой высоты, а не от постоянной числа */
const topbarEl = $('.topbar');
function syncTopbarHeight(){
  if (!topbarEl) return;
  document.body.style.setProperty('--topbar-h', Math.round(topbarEl.offsetHeight) + 'px');
  fitDevice();
}
if (topbarEl && window.ResizeObserver){
  /* border-box: шапка меняется и когда растёт только её padding, а не содержимое */
  try { new ResizeObserver(syncTopbarHeight).observe(topbarEl, { box: 'border-box' }); }
  catch (e) { new ResizeObserver(syncTopbarHeight).observe(topbarEl); }
}
window.addEventListener('resize', () => { syncTopbarHeight(); updateSizeClass(); });
applyDeviceSize(document.body.dataset.device || 'phone');
syncTopbarHeight();

seedOrders();
const hashTable = tableFromHash();
if (hashTable){
  state.table = hashTable;
  state.screen = 'qrmenu';
  state.deliveryType = 'table';
  state.payMethod = 'table';
}
render();

/* Ссылка со стола могла смениться уже в открытой вкладке — реагируем сразу */
window.addEventListener('hashchange', () => {
  const t = tableFromHash();
  if (t) openTableMenu(t);
});
