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
  staffId: 's1',
  autoStatus: true,
  paying: false,
  authStep: 'phone',
  authPhone: '+7 900 000-00-01',  // номер, который гость вводит при входе
  authCode: '1234',               // демо-код «из SMS»: реальных SMS нет
  authCodeInput: '1234',
  authErr: '',                    // ошибка на шаге с номером
  authCodeErr: '',                // ошибка на шаге с кодом
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
const dishPrice = d => Math.round(d.price * (100 - Math.min(90, Math.max(0, Number(d.salePercent) || 0))) / 100);
const lineUnit = line => {
  const d = dishById(line.dishId);
  const mods = (d.modifiers || []).filter(m => line.mods.includes(m.id));
  return dishPrice(d) + mods.reduce((s,m) => s + m.price, 0);
};
const cartSubtotal = () => cartLines().reduce((s,l) => s + l.qty * lineUnit(l), 0);

const dishAvailable = d => !!d && d.available !== false;
const isFav = id => state.favorites.includes(id);
const favDishes = () => state.favorites.map(dishById).filter(Boolean);
const minOrderLeft = () => Math.max(0, RULES.minOrder - cartSubtotal());

const bonusClient = phone => ADMIN_CLIENTS.find(c => normPhone(c.phone) === normPhone(phone));
const currentBonusClient = () => bonusClient(state.user.phone);

/* Оборот гостя — сумма выполненных заказов. По ней считается уровень.
   Гость, переехавший из CRM, ещё не заказывал в прототипе: у него берём
   сумму из карточки. */
function clientTurnover(phone){
  const digits = normPhone(phone);
  if (!digits) return 0;
  const mine = state.orders.filter(o => o.phone && normPhone(o.phone) === digits && o.status === 'done');
  if (mine.length) return mine.reduce((s,o) => s + Math.max(0, Number(o.total)||0), 0);
  const client = bonusClient(phone);
  return client ? Math.max(0, Number(client.sum)||0) : 0;
}

/* Уровень текущего гостя: сам уровень, надбавка и сколько до следующего */
const userTurnover = () => clientTurnover(state.user.phone);
const userLevel = () => {
  const turnover = userTurnover();
  return {
    turnover,
    level: bonusLevelFor(turnover),
    name: bonusLevelName(turnover),
    add: bonusLevelAdd(turnover),
    next: bonusNextLevel(turnover)
  };
};

/* Срок списания: начисленные баллы живут bonusExpiryMonths месяцев.
   Лоты — каждое начисление отдельно: при списании берутся те, что сгорят раньше,
   а по истечении срока лот вычитается из баланса один раз */
const bonusExpiryMonths = () => Math.max(0, Number(RULES.bonusExpiryMonths) || 0);
function bonusExpiryAt(from = new Date()){
  const months = bonusExpiryMonths();
  if (!months) return 0;
  const d = new Date(from.getTime());
  d.setMonth(d.getMonth() + months);
  return d.getTime();
}
const bonusDateText = ts => ts
  ? new Date(ts).toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric' })
  : '';

function ensureBonusLots(client){
  if (!client) return [];
  if (!client.lots){
    client.lots = [];
    const legacy = Number(client.bonus) || 0;
    if (legacy > 0) client.lots.push({ amount:legacy, expiresAt:bonusExpiryAt(), used:0 });
  }
  return client.lots;
}

/* Баллы с истёкшим сроком уходят с баланса и попадают в историю */
function burnExpiredBonus(client){
  const lots = ensureBonusLots(client);
  const now = Date.now();
  let burned = 0;
  lots.forEach(lot => {
    if (lot.burned || !lot.expiresAt || lot.expiresAt >= now) return;
    const left = Math.max(0, lot.amount - (lot.used || 0));
    if (!left) return;
    lot.burned = true;
    burned += left;
  });
  if (!burned) return 0;
  client.bonus = Math.max(0, (Number(client.bonus)||0) - burned);
  client.history = client.history || [];
  client.history.unshift({ amount:-burned, title:'Срок списания истёк', orderNo:'', date:nowRu() });
  return burned;
}

function bonusBalance(){
  const client = currentBonusClient();
  if (!client) return 0;
  burnExpiredBonus(client);
  return Math.max(0, Number(client.bonus) || 0);
}
const bonusHistory = () => currentBonusClient()?.history || [];

/* Списание забирает баллы из тех лотов, которые сгорят раньше */
function spendBonusLots(client, amount){
  const lots = ensureBonusLots(client).filter(l => !l.burned)
    .sort((a,b) => (a.expiresAt || Infinity) - (b.expiresAt || Infinity));
  let left = amount;
  for(const lot of lots){
    if (left <= 0) break;
    const rest = Math.max(0, lot.amount - (lot.used || 0));
    const take = Math.min(rest, left);
    lot.used = (lot.used || 0) + take;
    left -= take;
  }
}

function addBonusEntry(client, amount, title, order){
  if (!client || !amount) return;
  const value = Math.round(amount);
  ensureBonusLots(client);
  client.bonus = Math.max(0, (Number(client.bonus)||0) + value);
  const expiresAt = value > 0 ? bonusExpiryAt() : 0;
  if (value > 0) client.lots.push({ amount:value, expiresAt, used:0 });
  else spendBonusLots(client, -value);
  client.history = client.history || [];
  client.history.unshift({ amount:value, title, orderNo:order?.no || '', date:nowRu(), expiresAt });
}

function redeemOrderBonus(order){
  if (!order || order.bonusRedeemed || !(order.bonus > 0)) return;
  const client = bonusClient(order.phone);
  if (!client) return;
  addBonusEntry(client, -Math.min(order.bonus, client.bonus), 'Оплата заказа', order);
  order.bonusRedeemed = true;
}

function refundOrderBonus(order){
  if (!order || !order.bonusRedeemed || order.bonusRefunded) return;
  addBonusEntry(bonusClient(order.phone), order.bonus, 'Возврат за отмену заказа', order);
  order.bonusRefunded = true;
}

function accrueOrderBonus(order){
  if (!order || order.bonusCredited || !(order.bonusEarn > 0)) return;
  addBonusEntry(bonusClient(order.phone), order.bonusEarn, 'Кэшбэк за заказ', order);
  order.bonusCredited = true;
}

function setOrderStatus(order, status){
  if (!order) return;
  order.status = status;
  if (status === 'done') accrueOrderBonus(order);
  if (DEAD_STATUSES.includes(status)) refundOrderBonus(order);
}

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

/* Точка открыта по своим часам: из этого и честный статус, и запрет
   «как можно скорее», когда кухня уже закрыта */
function locIsOpen(loc, at){
  if (!loc) return true;
  const d = at || new Date();
  const now = d.getHours()*60 + d.getMinutes();
  return now >= hm(loc.open) && now < hm(loc.close);
}
function locStatusText(loc){
  return locIsOpen(loc) ? 'Открыто до ' + loc.close : 'Сейчас закрыто · откроется в ' + loc.open;
}
/* закрытая точка — заказ только на завтра: время выбирается слотом */
function applyOpenHours(){
  if (state.table) return;
  const loc = LOCATIONS.find(l => l.id === state.locationId) || LOCATIONS[0];
  if (locIsOpen(loc)) return;
  state.timeMode = 'slot';
  if (!state.slot){
    const first = timeSlots().tomorrow[0];
    if (first) state.slot = { day:first.day, time:first.time };
  }
}

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
  const bonusAvailable = RULES.bonusEnabled && state.deliveryType !== 'table'
    ? Math.min(bonusBalance(), bonusMax) : 0;
  const bonusUse = Math.min(state.bonusUse, bonusAvailable);
  return { sub, delivery, discount, bonusUse, bonusMax, bonusAvailable, total: Math.max(0, base + delivery - bonusUse) };
}

/* Дата и время заказа текстом. По той же метке времени заказ потом
   фильтруется по периоду, поэтому храним оба вида: ts — для фильтра, текст — для глаза. */
function dateRu(ts){
  const d = new Date(ts == null ? Date.now() : ts);
  const m = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'][d.getMonth()];
  const time = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  return `${d.getDate()} ${m} в ${time}`;
}
const nowRu = () => dateRu(Date.now());

/* Номер заказа — короткий и читаемый вслух («2481» вместо «bb5cc2»).
   Считаем от максимального уже выданного, чтобы номера не повторялись. */
const ORDER_NO_START = 2400;
const nextOrderNo = () => {
  const last = state.orders.reduce((m,o) => Math.max(m, parseInt(o.no, 10) || 0), ORDER_NO_START);
  return String(last + 1);
};

/* -------------------------------- демо-история --------------------------------

   Чтобы отчёт в админке показывал настоящие числа, а не выдуманные,
   при старте посеивается история заказов за четыре недели. Считается
   детерминированно: демо должно выглядеть одинаково при каждом открытии,
   поэтому «случайность» берётся от фиксированного зерна, а не от времени. */

const SEED_DAYS = 28;          // глубина истории, дней
const SEED_TABLE_ORDERS = 18;  // заказы из QR-меню в зале (без телефона гостя)

function seededRandom(seed){
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const SEED_ADDRESSES = [
  'Москва, ул. Ташкентская, 19, кв. 42',
  'Москва, Пресненская наб., 8, стр. 1',
  'Москва, ул. Мичурина, 32, кв. 8',
  'Москва, ул. Ташкентская, 17, кв. 91',
  'Москва, Патриаршие пруды, 7',
  'Москва, ул. Остоженка, 14'
];

const SEED_COMMENTS = [
  'Без лука, пожалуйста', 'Позвонить за 10 минут', 'Острый соус в отдельной чашке',
  'Два палочек не нужно', 'Побыстрее, если получится'
];

/* Момент заказа: «daysAgo» дней назад, в часы работы ресторана. */
function seedTs(daysAgo, rnd){
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  if (daysAgo === 0){
    /* сегодняшние заказы — в пределах последних шести часов */
    return Date.now() - (35 + Math.floor(rnd() * 330)) * 60000;
  }
  d.setHours(11 + Math.floor(rnd() * 12), Math.floor(rnd() * 4) * 15, 0, 0);
  return d.getTime();
}

function seedItems(rnd){
  const count = 1 + Math.floor(rnd() * 3);
  const items = [];
  const used = new Set();
  for (let i = 0; i < count; i++){
    const dish = DISHES[Math.floor(rnd() * DISHES.length)];
    if (used.has(dish.id)) continue;
    used.add(dish.id);
    items.push({ dishId:dish.id, name:dish.name, qty: rnd() > 0.85 ? 2 : 1, price:dishPrice(dish), mods:[] });
  }
  if (!items.length) items.push({ dishId:DISHES[0].id, name:DISHES[0].name, qty:1, price:dishPrice(DISHES[0]), mods:[] });
  return items;
}

/* Один заказ истории: блюда, доставка, промокод и сумма считаются по тем же
   правилам, что и живой заказ гостя. */
function buildSeedOrder(o){
  const { ts, rnd, customer, phone } = o;
  const items = seedItems(rnd);
  const sub = items.reduce((s,i) => s + i.price * i.qty, 0);
  const roll = rnd();
  const deliveryType = roll < 0.68 ? 'delivery' : (roll < 0.94 ? 'pickup' : 'table');
  const locationId = deliveryType === 'pickup' && rnd() > 0.55 ? 'l3' : (rnd() > 0.7 ? 'l2' : 'l1');
  let delivery = deliveryType === 'delivery' ? (sub >= RULES.freeDeliveryFrom ? 0 : RULES.deliveryPrice) : 0;
  let discount = 0;
  let promo = null;
  if (deliveryType === 'delivery'){
    const p = rnd();
    if (p < 0.09){ promo = 'WASABI10'; discount = Math.round(sub * 0.10); }
    else if (p < 0.15 && sub >= 1000){ promo = 'SETHI'; discount = 200; }
    else if (p < 0.19){ promo = 'DOSTAVKA'; delivery = 0; }
  }
  const total = Math.max(0, sub - discount + delivery);
  return {
    ts, date: dateRu(ts),
    items, sub, delivery, discount, bonus:0, total,
    status:'done', deliveryType, locationId, addressId:'a1', slot:null,
    address: deliveryType === 'table' ? '' : SEED_ADDRESSES[Math.floor(rnd() * SEED_ADDRESSES.length)],
    comment: rnd() > 0.85 ? SEED_COMMENTS[Math.floor(rnd() * SEED_COMMENTS.length)] : '',
    payment: deliveryType === 'table' ? 'table' : (rnd() > 0.5 ? 'card' : (rnd() > 0.35 ? 'sbp' : 'cash')),
    promo, source: deliveryType === 'table' ? 'qr' : 'app',
    customer, phone,
    bonusEarn: bonusEarnFor(deliveryType, sub - discount)
  };
}

/* Заказы к столу из QR-меню: гостя в базе нет, телефон пустой. */
function buildSeedTableOrder(ts, rnd, tableNo){
  const items = seedItems(rnd);
  const sub = items.reduce((s,i) => s + i.price * i.qty, 0);
  const locId = 'l' + (1 + Math.floor(rnd() * 3));
  const loc = LOCATIONS.find(l => l.id === locId) || LOCATIONS[0];
  return {
    ts, date: dateRu(ts),
    items, sub, delivery:0, discount:0, bonus:0, total:sub,
    status:'done', deliveryType:'table', locationId:locId, addressId:null, slot:null,
    address:`Стол ${tableNo} · ${loc.name}`, tableNo,
    comment:'', payment:'table', promo:null, source:'qr',
    customer:`Гость стола ${tableNo}`, phone:'',
    bonusEarn:0
  };
}

function seedOrders(){
  const rnd = seededRandom(20261111);
  const orders = [];
  let no = ORDER_NO_START;

  const add = order => {
    no += 1;
    order.no = String(no);
    order.id = 'o-seed-' + no;
    orders.push(order);
    return order;
  };

  /* 1. Живой заказ гостя: сегодня, 40 минут назад, статус «Новый» —
        чтобы вкладки админки и фильтр по периоду работали сразу. */
  const liveTs = Date.now() - 40 * 60 * 1000;
  const live = add({
    ...buildSeedOrder({ ts:liveTs, rnd, customer:state.user.name, phone:state.user.phone }),
    items:[{ dishId:'d-phil', name:'Филадельфия', qty:1, price:590, mods:[] }],
    sub:590, delivery:199, discount:0, bonus:0, total:789,
    status:'new', deliveryType:'delivery', locationId:'l1', addressId:'a1',
    address:'Ташкентская 198', comment:'', payment:'card', promo:null, source:'app',
    customer:state.user.name, phone:state.user.phone, bonusEarn:29
  });

  /* 2. История гостей базы: у каждого столько заказов, сколько задано планом,
        последний — в день его последнего заказа. */
  ADMIN_CLIENTS.forEach(c => {
    const plan = c.plan;
    if (!plan) return;
    const offsets = [];
    let off = plan.last;
    while (offsets.length < plan.orders && off <= SEED_DAYS){
      offsets.push(off);
      off += plan.gap ? (plan.gap[0] + Math.floor(rnd() * (plan.gap[1] - plan.gap[0] + 1))) : 0;
    }
    offsets.forEach(daysAgo => {
      /* заказ гостя не может быть позже живого заказа из приложения */
      const ts = Math.min(seedTs(daysAgo, rnd), liveTs - 60000);
      add(buildSeedOrder({ ts, rnd, customer:c.name, phone:c.phone }));
    });
  });

  /* 3. Заказы из QR-меню в зале: без телефона, гостя в базе не создают. */
  for (let i = 0; i < SEED_TABLE_ORDERS; i++){
    const daysAgo = Math.floor(rnd() * (SEED_DAYS + 1));
    const ts = Math.min(seedTs(daysAgo, rnd), liveTs - 60000);
    add(buildSeedTableOrder(ts, rnd, 1 + Math.floor(rnd() * 12)));
  }

  /* 4. Статусы: сегодняшние заказы идут по живой цепочке, прошлые — доставлены,
        изредка — отмена гостя или отказ ресторана. */
  orders.sort((a,b) => b.ts - a.ts);
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const isToday = ts => ts >= todayStart.getTime();
  const todayDelivery = orders.filter(o => o.deliveryType !== 'table' && isToday(o.ts));
  const chain = ['new','cooking','courier','way'];
  todayDelivery.forEach((o, i) => { o.status = chain[i] || 'done'; });
  orders.filter(o => o.deliveryType === 'table' && isToday(o.ts)).forEach((o, i) => {
    o.status = ['cooking','ready','done'][i] || 'done';
  });
  orders.forEach(o => {
    if (isToday(o.ts)) return;
    const r = rnd();
    o.status = r < 0.06 ? 'cancelled' : (r < 0.11 ? 'rejected' : 'done');
    if (o.status === 'rejected') o.rejectReason = REJECT_REASONS[Math.floor(rnd() * REJECT_REASONS.length)];
  });

  /* 5. Гости базы: заказы, сумма, баллы и даты считаются по этой истории,
        чтобы цифры гостя и заказа не расходились. */
  ADMIN_CLIENTS.forEach(c => {
    const mine = orders.filter(o => o.phone && normPhone(o.phone) === normPhone(c.phone));
    if (!mine.length) return;
    const done = mine.filter(o => o.status === 'done');
    c.orders = mine.length;
    c.sum = done.reduce((s,o) => s + (Number(o.total) || 0), 0);
    /* Кэшбэк пересчитываем по обороту гостя — вместе с надбавкой за его уровень,
       чтобы начисленные баллы и процент в приложении совпадали */
    done.forEach(o => { o.bonusEarn = bonusEarnFor(o.deliveryType, o.sub - o.discount, c.sum); });
    c.bonus = done.reduce((s,o) => s + (Number(o.bonusEarn) || 0), 0);
    c.lastDate = isoDay(Math.max(...mine.map(o => o.ts)));
    c.firstDate = isoDay(Math.min(...mine.map(o => o.ts)));
    c.history = c.history || [];
  });

  state.orders = orders;
  state.currentOrderId = live.id;
}

/* Заказы гостя: в демо-истории лежат заказы всех гостей, но приложение
   показывает только свои. */
const myOrders = () => state.orders.filter(o => normPhone(o.phone) === normPhone(state.user.phone));

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
  if (name === 'checkout') applyOpenHours();
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
  <article class="pcard ${out?'is-out':''}" data-act="open-dish" data-dish="${d.id}">
    <div class="pcard-img">
      <img src="${d.img}" alt="${d.name}" loading="lazy">
      ${(showBadge && d.badge && !out) ? `<span class="pcard-badge">${esc(d.badge)}</span>` : ''}
      ${out ? `<span class="pcard-out">Нет в наличии</span>` : ''}
      <button class="fav-btn ${fav?'is-on':''}" data-act="fav" data-dish="${d.id}"
        aria-label="${fav?'Убрать из избранного':'В избранное'}" aria-pressed="${fav}">${icon(fav?'heartFill':'heart')}</button>
    </div>
    <div class="pcard-body">
      <button class="pcard-name" type="button" data-act="open-dish" data-dish="${d.id}">${d.name}</button>
      <div class="pcard-meta">${d.unit}</div>
      <div class="pcard-desc">${d.desc}</div>
      <div class="pcard-foot">
        <span class="price-stack"><span class="pcard-price">${out ? 'Закончилось' : fmt(dishPrice(d))}</span>${!out && d.salePercent ? `<s class="price-old">${fmt(d.price)}</s>` : ''}</span>
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
  const last = myOrders()[0];
  return `
  ${appHeader()}
  <section class="section" style="padding-bottom:0;margin-bottom:var(--sp-14)">
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
          <span>Васаби сет · ${fmt(dishPrice(set))}</span>${icon('arrowRight')}
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
        <div class="muted small" style="margin-top:var(--sp-6)">Вкус, к которому возвращаются</div>
      </div>
      <button class="link-line" data-act="go" data-screen="catalog">Все ${DISHES.length} ${plural(DISHES.length,'блюдо','блюда','блюд')} ${icon('arrowRight')}</button>
    </div>
    ${popular.length ? `
    <div class="section-head" style="margin-top:var(--sp-18)">
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
  <section class="section" style="padding-top:var(--sp-4)">
    <h1 class="h1">Наше меню</h1>
    <div class="muted small" style="margin-top:var(--sp-6)">Вкус, к которому возвращаются</div>
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
  <section class="section" style="margin-top:var(--sp-20)">
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
    <button class="btn-outline" style="margin-top:var(--sp-14)" data-act="go" data-screen="catalog">Открыть меню</button>
  </div>`;
  const key = lineKey(d.id, state.productMods);
  const inCart = state.cart[key];
  const out = !dishAvailable(d);
  const fav = isFav(d.id);
  const unit = dishPrice(d) + (d.modifiers || []).filter(m => state.productMods.includes(m.id)).reduce((s,m)=>s+m.price,0);
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
    ${d.badge && !out ? `<span class="pdp-badge">${esc(d.badge)}</span>` : ''}
    <button class="fav-btn pdp-fav ${fav?'is-on':''}" data-act="fav" data-dish="${d.id}"
      aria-label="${fav?'Убрать из избранного':'В избранное'}" aria-pressed="${fav}">${icon(fav?'heartFill':'heart')}</button>
  </div>
  <section class="section">
    <div class="eyebrow">ВАСАБИ / ${CATEGORIES.find(c=>c.id===d.cat).name.toUpperCase()}</div>
    <h1 class="h1" style="margin-top:var(--sp-10)">${d.name}</h1>
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
    <div class="card" style="padding:var(--sp-4) var(--sp-18)">${mods}</div>
  </section>` : ''}
  <section class="section">
    <div class="section-head"><h2 class="h2">Состав и аллергены</h2></div>
    <div class="card">
      <p class="soft small">${d.composition || 'Состав уточняется у оператора.'}</p>
      <p class="muted small" style="margin-top:var(--sp-10)">Содержит: ${(d.allergens || []).length ? d.allergens.join(', ') : 'не выявлено аллергенов'}.</p>
      <p class="muted small" style="margin-top:var(--sp-8)">Если у вас есть аллергия, сообщите оператору до оплаты — блюдо могут отменить и полностью вернуть деньги.</p>
    </div>
  </section>
  <div class="pdp-bar">
    <div class="pdp-bar-row">
      <div>
        <div class="pdp-price-cap">За порцию${d.salePercent ? ' · скидка ' + d.salePercent + '%' : ''}</div>
        <div class="pdp-price-line"><div class="pdp-price">${fmt(unit)}</div>${d.salePercent ? `<s class="price-old">${fmt(d.price + (unit - dishPrice(d)))}</s>` : ''}</div>
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
  const total = avail.reduce((s,d) => s + dishPrice(d), 0);
  return `
  ${appHeader()}
  <section class="section" style="padding-top:var(--sp-4)">
    <h1 class="h1">Избранное</h1>
    <div class="muted small" style="margin-top:var(--sp-6)">${list.length} ${plural(list.length,'блюдо','блюда','блюд')} · сохраняются в вашем аккаунте</div>
  </section>
  ${!list.length ? `
  <section class="section">
    <div class="empty">
      <div style="margin-bottom:var(--sp-12)">${icon('heart','empty-ico')}</div>
      Пока пусто. Нажмите на сердечко в карточке блюда — и оно появится здесь.
      <div style="margin-top:var(--sp-18)"><button class="btn-lime" style="width:auto;margin:0 auto" data-act="go" data-screen="catalog"><span>Открыть меню</span>${icon('arrowRight')}</button></div>
    </div>
  </section>` : `
  <section class="section">
    <div class="dish-grid">${list.map(d => dishCard(d)).join('')}</div>
  </section>
  ${avail.length ? `
  <section class="section">
    <div class="panel-olive" style="display:flex;gap:var(--sp-14);align-items:center">
      <div class="grow">
        <div style="font-weight:700;color:var(--lime)">Добавить всё в корзину</div>
        <div class="soft small" style="margin-top:var(--sp-4)">${avail.length} ${plural(avail.length,'блюдо','блюда','блюд')} · ${fmt(total)}</div>
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
    <section class="section" style="padding-top:var(--sp-28)">
      <h1 class="h1">Ваш вкусный выбор</h1>
      <div class="empty" style="margin-top:var(--sp-24)">
        <div style="margin-bottom:var(--sp-12)">${icon('bag','empty-ico')}</div>
        В корзине пока пусто.<br>Выберите что-нибудь из меню.
        <div style="margin-top:var(--sp-18)"><button class="btn-lime" style="width:auto;margin:0 auto" data-act="go" data-screen="catalog"><span>Открыть меню</span>${icon('arrowRight')}</button></div>
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
              <span class="price-stack"><span class="upsell-price">${fmt(dishPrice(d))}</span>${d.salePercent?`<s class="price-old">${fmt(d.price)}</s>`:''}</span>
              <button class="plus-btn sm" data-act="upsell-add" data-dish="${d.id}" aria-label="Добавить ${d.name} в корзину">${icon('plus')}</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </section>` : '';

  return `
  ${appHeader()}
  <section class="section" style="padding-top:var(--sp-4)">
    <h1 class="h1">Ваш вкусный выбор</h1>
  </section>
  <section class="section">
    <div class="panel-olive" style="display:flex;gap:var(--sp-14);align-items:center">
      <span style="color:var(--lime);display:grid;place-items:center">${icon('bike')}</span>
      <div>
        <div style="font-weight:700;color:var(--lime)">Доставка за наш счёт</div>
        <div class="soft small" style="margin-top:var(--sp-4)">Привезём за ${RULES.prepTime}</div>
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
      <p class="muted small" style="margin-top:var(--sp-6)">Соевый соус, имбирь и васаби включены.</p>
      <div style="margin-top:var(--sp-12)">
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
  const closed = !table && !locIsOpen(loc);
  return `
  ${appBar('Оформление заказа')}
  <section class="section">
    <div class="eyebrow">${table ? 'ЗАКАЗ ИЗ ЗАЛА' : 'ПОЧТИ У ВАС'}</div>
    <h1 class="h1" style="margin-top:var(--sp-10)">${table ? `Принесём к столу ${state.table.no}` : 'Куда привезти вкусный вечер?'}</h1>
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
    <div class="seg" style="margin-bottom:var(--sp-18)">
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
      <div class="order-addr" style="margin-top:var(--sp-10)">${locById(state.table.locId).address}</div>
      <p class="muted small" style="margin-top:var(--sp-10)">Готовность ${RULES.prepTable} после подтверждения заказа оператором.</p>
    </div>
    <div class="field" style="margin-top:var(--sp-16)">
      <label for="fComment">Пожелания к столу (необязательно)</label>
      <textarea id="fComment" data-act="f" data-field="comment" placeholder="Например: без имбиря, принести сразу, отдельная тарелка"
        autocapitalize="sentences" enterkeyhint="done">${state.comment}</textarea>
    </div>
  </section>` : pickup ? `
  <section class="section">
    <h2 class="h2" style="margin-bottom:var(--sp-12)">Точка самовывоза</h2>
    ${LOCATIONS.map(l => `
      <div class="pay-row ${state.locationId===l.id?'is-on':''}" data-act="pick-location" data-id="${l.id}" role="button" tabindex="0" aria-pressed="${state.locationId===l.id}" style="display:flex;gap:var(--sp-12);align-items:center">
        <div class="pay-icon">${icon('pin')}</div>
        <div class="grow">
          <div class="pay-name">${l.name}</div>
          <div class="pay-note">${l.address} · ${l.hours}</div>
          <div class="pay-note" style="color:${locIsOpen(l) ? 'var(--lime)' : 'var(--muted)'}">${locStatusText(l)}</div>
        </div>
        <span class="radio"></span>
      </div>`).join('')}
    <p class="muted small" style="margin-top:var(--sp-12)">Готовность заказа — ${RULES.leadPickup} минут после подтверждения.</p>
  </section>` : `
  <section class="section">
    <h2 class="h2" style="margin-bottom:var(--sp-14)">Ваши контакты</h2>
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
    <h2 class="h2" style="margin-bottom:var(--sp-14)">Адрес доставки</h2>
    ${addressBook()}
    <div class="map-box" id="mapDeliver" role="region" aria-label="Карта доставки"></div>
    <div class="map-note">${icon('info')}<span>Светлый круг — зона доставки точки. Нажмите на карту, чтобы поставить точку вручную, если адрес не нашёлся.</span></div>
    <div class="field" style="margin-top:var(--sp-14)">
      <label for="fAddr">Улица, дом, квартира</label>
      <input id="fAddr" data-act="f" data-field="address" value="${state.address}" placeholder="Улица, дом, квартира"
        autocomplete="street-address" autocapitalize="words" enterkeyhint="next"
        ${state.errors.address ? 'aria-invalid="true" aria-describedby="err-fAddr"' : ''}>
      ${state.errors.address ? `<p class="err" id="err-fAddr" role="alert">${state.errors.address}</p>` : ''}
    </div>
    <button class="btn-outline" data-act="geo-find">${icon('search')} Найти на карте</button>
    ${geoStatusHtml()}
    <div class="field" style="margin-top:var(--sp-14)">
      <label for="fComment">Комментарий (необязательно)</label>
      <textarea id="fComment" data-act="f" data-field="comment" placeholder="Подъезд, этаж, домофон, пожелания"
        autocapitalize="sentences" enterkeyhint="done">${state.comment}</textarea>
    </div>
    <p class="order-addr">${icon('pin')} ${geoDeliverLine()}</p>
  </section>`}

  ${table ? '' : `
  <section class="section">
    <h2 class="h2" style="margin-bottom:var(--sp-12)">${pickup ? 'Время самовывоза' : 'Время доставки'}</h2>
    ${closed ? `<div class="notice" style="margin-bottom:var(--sp-14)">${icon('info')}<span>Сейчас закрыто: ${loc.name} работает ${loc.hours}. Заказ оформить можно — выберите время на ${state.slot && state.slot.day === 'tomorrow' ? 'завтра' : 'открытие'}.</span></div>` : ''}
    <div class="seg">
      <button class="${state.timeMode==='asap'?'is-active':''}" data-act="time-mode" data-mode="asap" ${closed?'disabled':''}>Как можно скорее</button>
      <button class="${state.timeMode==='slot'?'is-active':''}" data-act="time-mode" data-mode="slot">К определённому времени</button>
    </div>
    ${state.timeMode === 'slot'
      ? slotPicker()
      : `<p class="muted small" style="margin-top:var(--sp-12)">Привезём за ${RULES.prepTime} после подтверждения заказа.</p>`}
    ${state.errors.slot ? `<p class="err" role="alert">${state.errors.slot}</p>` : ''}
  </section>`}

  <section class="section">
    <h2 class="h2" style="margin-bottom:var(--sp-14)">Способ оплаты</h2>
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
      <div class="addr-row ${state.addressId===a.id?'is-on':''}" data-act="addr-select" data-id="${a.id}">
        <span class="pay-icon">${icon(a.label === 'Дом' ? 'home' : 'office')}</span>
        <button class="grow addr-pick" type="button" data-act="addr-select" data-id="${a.id}" aria-pressed="${state.addressId===a.id}">
          <span class="pay-name">${a.label}</span>
          <span class="pay-note">${a.address}</span>
        </button>
        ${state.addressId === a.id
          ? '<span class="radio"></span>'
          : `<button class="addr-del" data-act="addr-delete" data-id="${a.id}" aria-label="Удалить адрес ${a.label}">${icon('trash')}</button>`}
      </div>`).join('')}
  </div>
  <div class="field" style="margin-top:var(--sp-14)">
    <label for="fNewAddr">Новый адрес</label>
    <input id="fNewAddr" data-act="f" data-field="newAddress" value="${state.newAddress}" placeholder="Улица, дом, квартира"
      autocomplete="street-address" autocapitalize="words" enterkeyhint="done"
      ${state.errors.newAddress ? 'aria-invalid="true" aria-describedby="err-fNewAddr"' : ''}>
    ${state.errors.newAddress ? `<p class="err" id="err-fNewAddr" role="alert">${state.errors.newAddress}</p>` : ''}
  </div>
  <button class="btn-outline" data-act="addr-add">${icon('plus')} Добавить адрес</button>`;
}

/* ------------------------- зона доставки по адресу ------------------------
   Правда про адрес важнее удобства: если адрес вне зоны, приложение говорит
   об этом прямо и предлагает самовывоз — молча пропустить заказ в другой
   город нельзя, это дыра в доставке. */
function geoDeliverLine(){
  const loc = LOCATIONS.find(l => l.id === (geo.locId || state.locationId)) || LOCATIONS[0];
  if (geoAddressChanged()) return 'Укажите адрес и найдите его на карте';
  if (geo.status === 'outside') return 'По этому адресу доставки нет — доступен самовывоз';
  return `Доставит ${loc.name} · ${locStatusText(loc)}`;
}

/* Адрес в поле отличается от того, который проверяли: показывать старый
   ответ зоны было бы враньём, поэтому сначала просим найти адрес заново. */
const geoAddressChanged = () => geo.status !== 'idle' && (state.address || '').trim() !== (geo.checkedAddress || '').trim();

function geoStatusHtml(){
  if (geoAddressChanged()) return `<p class="muted small" style="margin-top:var(--sp-10)">Адрес изменился — нажмите «Найти на карте», чтобы проверить зону доставки.</p>`;
  if (geo.status === 'searching') return `<p class="muted small" style="margin-top:var(--sp-10)">Ищем адрес…</p>`;
  if (geo.status === 'failed') return `<p class="err" role="alert" style="margin-top:var(--sp-10)">Не нашли этот адрес автоматически. Поставьте точку на карте или напишите адрес подробнее.</p>`;
  if (geo.status === 'outside'){
    const n = geo.nearest;
    return `<div class="notice is-warn" style="margin-top:var(--sp-12)">${icon('info')}<span>
      <b>По этому адресу доставки нет.</b>${n ? ` Ближайшая точка — «${esc(n.loc.name)}», ${geoFormatKm(n.km)} от адреса.` : ''}
      Доступен самовывоз.</span>
      <button class="btn-outline btn-sm" data-act="geo-to-pickup">Выбрать самовывоз</button></div>`;
  }
  if (geo.status === 'found'){
    const l = LOCATIONS.find(x => x.id === geo.locId);
    if (!l) return '';
    return `<div class="notice" style="margin-top:var(--sp-12)">${icon('check')}<span>
      Доставляем из «${esc(l.name)}» — ${geoFormatKm(geo.km)} от ресторана. ${esc(l.delivery)}.</span></div>`;
  }
  return '';
}

/* Ищет адрес и определяет зону. Точка могла прийти из карты — тогда ищем зону сразу. */
function geoApply(point){
  geo.point = point;
  const zone = geoZoneFor(point.lat, point.lng);
  if (zone){
    geo.status = 'found';
    geo.locId = zone.loc.id;
    geo.km = zone.km;
    state.locationId = zone.loc.id;
    geo.nearest = null;
  } else {
    geo.status = 'outside';
    geo.locId = null;
    geo.nearest = geoNearest(point.lat, point.lng);
  }
}

async function geoCheckAddress(text){
  geo.status = 'searching';
  geo.checkedAddress = text;
  render();
  const hit = await geoLookup(text);
  if (!hit){
    geo.status = 'failed';
    geo.point = null;
    geo.locId = null;
    render();
    return;
  }
  geoApply(hit);
  render();
}

/* Карта ставится после каждой перерисовки: контейнер пересоздаётся вместе с экраном */
function mountGeo(){
  const el = $('#mapDeliver');
  if (!el) return;
  const map = geoMount(el);
  if (!map) return;
  const saved = state.addresses.map(a => ({ label:a.label, address:a.address, point: geo.cache.get(a.address.trim().toLowerCase()) }));
  geoDraw(map, { point: geo.point, locId: geo.locId, saved });
  geoPickByClick(map, p => { geoApply(p); render(); });
  saved.forEach(a => {
    if (a.point) return;
    geoLookup(a.address).then(hit => {
      if (!hit) return;
      geo.cache.set(a.address.trim().toLowerCase(), hit);
      const m = geo.maps.get('mapDeliver');
      if (m) geoDraw(m, { point: geo.point, locId: geo.locId, saved: state.addresses.map(x => ({ label:x.label, address:x.address, point: geo.cache.get(x.address.trim().toLowerCase()) })) });
    });
  });
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
  const lv = userLevel();
  const cashbackPercent = bonusPercent(state.deliveryType, t.sub - t.discount, lv.turnover);
  return `
  ${appBar('Оплата')}
  <section class="section">
    <div class="eyebrow">ШАГ 2 ИЗ 2</div>
    <h1 class="h1" style="margin-top:var(--sp-10)">Подтвердите заказ</h1>
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
    <h2 class="h2" style="margin-bottom:var(--sp-12)">Промокод</h2>
    <div class="row gap-10">
      <div class="grow"><input class="input-plain" data-act="f" data-field="promoInput" value="${state.promoInput || ''}" placeholder="WASABI10"
        aria-label="Промокод" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done"
        ${state.promoMsg ? 'aria-describedby="promoMsg"' : ''}></div>
      <button class="btn-outline" data-act="apply-promo">Применить</button>
    </div>
    ${state.promoMsg ? `<p class="${promoOk?'ok':'err'}" id="promoMsg"${promoOk?'':' role="alert"'}>${state.promoMsg}</p>` : ''}
    <p class="muted small" style="margin-top:var(--sp-10)">Действующие: ${activePromos().map(p => `${p.code} (${p.label}${p.min ? ', от ' + fmt(p.min) : ''})`).join(', ')}.</p>
  </section>

  <section class="section">
    <div class="section-head"><h2 class="h2">Бонусы «Васаби»</h2><span class="count">${bonusBalance()} ${plural(bonusBalance(),'балл','балла','баллов')}</span></div>
    <div class="card">
      ${RULES.bonusEnabled ? `
        <p class="small soft">1 балл = 1 ₽. ${state.deliveryType === 'table'
          ? 'За заказ к столу без аккаунта баллы не начисляются.'
          : `Кэшбэк ${cashbackPercent}% начислим после выполнения заказа.${lv.add ? ` Уровень ${esc(lv.name)} добавляет ${lv.add} п.п.` : ''}`}${bonusExpiryMonths() ? ` Баллы сгорают через ${bonusExpiryMonths()} ${plural(bonusExpiryMonths(),'месяц','месяца','месяцев')}.` : ''}</p>
        ${state.deliveryType === 'table' ? '' : `
          <div class="pay-row ${t.bonusUse?'is-on':''}" ${t.bonusAvailable?'data-act="bonus-toggle" role="button" tabindex="0"':''} aria-pressed="${t.bonusUse>0}" style="margin-top:var(--sp-12)">
            <div class="pay-icon">${icon('gift')}</div>
            <div class="grow">
              <div class="pay-name">${t.bonusUse ? 'Не списывать бонусы' : 'Списать ' + t.bonusAvailable + ' ' + plural(t.bonusAvailable,'балл','балла','баллов')}</div>
              <div class="pay-note">${t.bonusAvailable ? 'Доступно на этот заказ: ' + fmt(t.bonusAvailable) : 'Для списания пока нет доступных баллов'}</div>
            </div>
            <span class="radio"></span>
          </div>
          <p class="hint" style="margin-top:var(--sp-10)">Можно оплатить до ${RULES.bonusMaxPay}% суммы блюд после промокода. Доставка баллами не оплачивается.${bonusExpiryMonths() ? ` Срок списания начисленных баллов — ${bonusExpiryMonths()} ${plural(bonusExpiryMonths(),'месяц','месяца','месяцев')}.` : ''}</p>`}
      ` : '<p class="small soft">Бонусная программа временно отключена рестораном. Списание и начисление недоступны.</p>'}
      <p class="muted small" style="margin-top:var(--sp-12)">Демо-счёт в этой вкладке · не связан с iiko</p>
    </div>
  </section>

  <section class="section">
    <div class="notice">${icon('info')}<span>Демо-оплата: деньги не списываются, банковские данные не запрашиваются. Для запуска нужен эквайринг ЮKassa или СБП.</span></div>
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
      <h1 class="h1" style="margin-top:var(--sp-10)">${flowFor(order)[cur].title}</h1>
      <p class="soft" style="margin-top:var(--sp-8);font-size:var(--fs-16)">${
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
      <div style="margin-top:var(--sp-10)">
        ${order.items.map(i => `<div class="sum-row"><span>${i.name} × ${i.qty}</span><span class="val">${fmt(i.price*i.qty)}</span></div>`).join('')}
        <div class="sum-row"><span>${isTable ? 'Обслуживание за столом' : 'Доставка'}</span><span class="val ${order.delivery===0?'free-tag':''}">${order.delivery===0?'Бесплатно':fmt(order.delivery)}</span></div>
        <div class="sum-row is-total"><span class="lbl">Итого</span><span class="val">${fmt(order.total)}</span></div>
        ${order.bonus ? `<div class="sum-row"><span>Списано баллов</span><span class="val">${order.bonus}</span></div>` : ''}
        ${order.bonusEarn ? `<div class="sum-row"><span>Кэшбэк</span><span class="val free-tag">${order.bonusCredited ? '+' + order.bonusEarn + ' начислено' : '+' + order.bonusEarn + ' после выполнения'}</span></div>` : ''}
      </div>
    </div>
  </section>

  ${order.status === 'new' ? `
  <section class="section">
    <button class="btn-outline wide-danger" data-act="cancel-order" data-id="${order.id}">${icon('x')} Отменить заказ</button>
    <p class="muted small" style="margin-top:var(--sp-8);text-align:center">Пока заказ не приняли в работу — отмена без комиссии.</p>
  </section>` : ''}

  <section class="section">
    <div class="row gap-10">
      <button class="btn-outline grow" data-act="advance-status" style="border-radius:999px;padding:var(--sp-12) var(--sp-16)">Демо: следующий статус</button>
      <button class="btn-outline grow" data-act="go" data-screen="orders" style="border-radius:999px;padding:var(--sp-12) var(--sp-16)">Все заказы</button>
    </div>
    <p class="muted small" style="margin-top:var(--sp-8);text-align:center">«Следующий статус» — кнопка для проверки экрана. В бою статус меняет ресторан.</p>
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
      <h1 class="h1" style="margin-top:var(--sp-10)">${cancelled ? 'Заказ отменён' : 'Ресторан отказал в заказе'}</h1>
      <p class="soft" style="margin-top:var(--sp-10);font-size:var(--fs-14)">${order.rejectReason || (cancelled ? 'Вы отменили заказ до того, как его приняли в работу.' : 'Ресторан не смог принять заказ в работу.')}</p>
    </div>
  </section>

  <section class="section">
    <div class="card">
      <h2 class="h2">Что с деньгами</h2>
      <p class="soft small" style="margin-top:var(--sp-8)">${cancelled
        ? 'Оплата не списывалась. Если средства заблокированы, они разблокируются автоматически в течение 1–3 рабочих дней.'
        : 'Оплата не списывалась. Если средства заблокированы, они разблокируются автоматически в течение 1–3 рабочих дней.'}</p>
      <div class="sum-row is-total"><span class="lbl">Возврат</span><span class="val">${fmt(order.total)}</span></div>
      ${order.bonusRefunded ? `<p class="ok" style="margin-top:var(--sp-10)">${order.bonus} ${plural(order.bonus,'балл','балла','баллов')} возвращено на бонусный счёт.</p>` : ''}
      <p class="muted small" style="margin-top:var(--sp-8)">Если возврат не пришёл за 3 дня — напишите в поддержку, разберём заказ вручную.</p>
    </div>
  </section>

  <section class="section">
    <div class="card">
      <h2 class="h2">Состав заказа</h2>
      <div style="margin-top:var(--sp-10)">
        ${order.items.map(i => `<div class="sum-row"><span>${i.name} × ${i.qty}</span><span class="val">${fmt(i.price*i.qty)}</span></div>`).join('')}
        <div class="sum-row is-total"><span class="lbl">Итого</span><span class="val">${fmt(order.total)}</span></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="row gap-10">
      <button class="btn-lime grow" data-act="repeat-order" data-id="${order.id}"><span>Повторить заказ</span>${icon('arrowRight')}</button>
      <button class="btn-outline grow" data-act="go" data-screen="catalog" style="border-radius:999px;padding:var(--sp-12) var(--sp-16)">В меню</button>
    </div>
  </section>`;
}

function scrOrders(){
  const orders = myOrders();
  return `
  ${appHeader()}
  <section class="section" style="padding-top:var(--sp-4)">
    <h1 class="h1">Ваши заказы</h1>
  </section>
  <section class="section">
    <div class="panel-olive">
      <div class="eyebrow">ВАСАБИ / ВАШИ ВЕЧЕРА</div>
      <div style="font-size:var(--fs-24);font-weight:700;margin-top:var(--sp-10)">${orders.length} в истории</div>
      <p class="soft small" style="margin-top:var(--sp-6)">До 200 последних заказов вашего аккаунта · Cloud</p>
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
        <div class="row gap-10" style="margin-top:var(--sp-14)">
          <button class="btn-outline" data-act="open-order" data-id="${o.id}">Подробнее</button>
          <button class="btn-outline" data-act="repeat-order" data-id="${o.id}">Повторить заказ</button>
        </div>
      </article>`).join('') : `<div class="empty">Заказов пока нет</div>`}
  </section>`;
}

function scrProfile(){
  const balance = bonusBalance();
  const history = bonusHistory();
  const lv = userLevel();
  const lvFrom = lv.level ? Number(lv.level.from)||0 : 0;
  const lvPct = lv.next
    ? Math.max(0, Math.min(100, Math.round((lv.turnover - lvFrom) / Math.max(1, (Number(lv.next.from)||0) - lvFrom) * 100)))
    : 100;
  const lvAdd = lv.add;
  return `
  ${appHeader()}
  <section class="section" style="padding-top:var(--sp-4)">
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
      <p class="muted small" style="margin-top:var(--sp-4)">Кэшбэк с заказов · 1 балл = 1 ₽</p>
      <div class="bonus-balance"><b>${balance}</b><span>${plural(balance,'балл','балла','баллов')}</span></div>
      ${RULES.bonusEnabled
        ? `<div class="bonus-level">
            <div class="bl-row">
              <span class="bl-name">${esc(lv.name || '—')}</span>
              <span class="bl-add">${lvAdd ? `+${lvAdd} п.п. к кэшбэку` : 'базовый кэшбэк'}</span>
            </div>
            ${lv.next
              ? `<div class="bl-bar"><i style="width:${lvPct}%"></i></div>
                 <p class="muted small" style="margin-top:var(--sp-8)">До уровня ${esc(lv.next.name)} — ${fmt(Math.max(0, (Number(lv.next.from)||0) - lv.turnover))}</p>`
              : '<p class="muted small" style="margin-top:var(--sp-8)">Это самый высокий уровень.</p>'}
          </div>
          <div class="bonus-channels">
            ${BONUS_CHANNELS.map(ch => `
              <div class="bonus-channel">
                <div class="bc-val">${ch.key ? (bonusBasePercent(ch.id) + lvAdd) + '%' : '—'}</div>
                <div class="bc-label">${ch.label}</div>
              </div>`).join('')}
          </div>
          <p class="muted small" style="margin-top:var(--sp-10)">Кэшбэк по каналу с учётом вашего уровня${lvAdd ? ` (+${lvAdd} п.п.)` : ''}. Заказ в зале идёт без аккаунта — по нему баллы не начисляются.</p>
          <p class="muted small" style="margin-top:var(--sp-6)"><b>Правила трат:</b> ${bonusRulesText()} То есть доставка от 2 000 ₽ даёт ${bonusPercent('delivery', 2000, lv.turnover)}%, а заказ до 1 000 ₽ — ${bonusPercent('delivery', 999, lv.turnover)}%.</p>
          <p class="muted small" style="margin-top:var(--sp-6)"><b>Уровни:</b> ${bonusLevelsText()}.</p>
          <p class="muted small" style="margin-top:var(--sp-10)">Баллами можно оплатить до ${RULES.bonusMaxPay}% следующего заказа. ${bonusExpiryMonths() ? `Баллы сгорают через ${bonusExpiryMonths()} ${plural(bonusExpiryMonths(),'месяц','месяца','месяцев')} после начисления.` : 'Баллы не сгорают.'}</p>`
        : '<p class="muted small" style="margin-top:var(--sp-10)">Программа временно отключена рестораном. Списание и начисление недоступны.</p>'}
      <div class="bonus-history">
        ${history.length ? history.slice(0,3).map(entry => `
          <div class="sum-row">
            <span><b>${esc(entry.title)}</b>${entry.orderNo ? `<small>Заказ №${esc(entry.orderNo)}</small>` : ''}${entry.expiresAt ? `<small>Сгорает ${bonusDateText(entry.expiresAt)}</small>` : ''}</span>
            <span class="val ${entry.amount>0?'free-tag':''}">${entry.amount>0?'+':'−'}${Math.abs(entry.amount)}</span>
          </div>`).join('') : `<p class="muted small">${icon('clock')} Здесь появятся начисления и списания.</p>`}
      </div>
      <p class="muted small" style="margin-top:var(--sp-12)">Демо-баланс в этой вкладке, без синхронизации с iiko. После перезагрузки вернутся исходные данные.</p>
    </div>
  </section>
  <section class="section">
    <div class="card">
      <div class="row between">
        <div>
          <h2 class="h2">История заказов</h2>
          <p class="muted small" style="margin-top:var(--sp-4)">${myOrders().length} в истории (до 200 последних) · Cloud</p>
        </div>
        <span style="color:var(--lime)">${icon('receipt')}</span>
      </div>
      <button class="link-line" data-act="go" data-screen="orders" style="margin-top:var(--sp-10)">${icon('arrowRight')} Посмотреть заказы</button>
    </div>
  </section>
  <section class="section">
    <div class="card">
      <div class="row between">
        <div>
          <h2 class="h2">Избранное</h2>
          <p class="muted small" style="margin-top:var(--sp-4)">${state.favorites.length} ${plural(state.favorites.length,'блюдо','блюда','блюд')} · повторный заказ в один тап</p>
        </div>
        <span style="color:var(--lime)">${icon('heart')}</span>
      </div>
      <button class="link-line" data-act="go" data-screen="favorites" style="margin-top:var(--sp-10)">${icon('arrowRight')} Открыть избранное</button>
    </div>
  </section>
  <section class="section">
    <h2 class="h2" style="margin-bottom:var(--sp-14)">Адресная книга</h2>
    ${addressBook()}
  </section>
  <section class="section">
    <h2 class="h2" style="margin-bottom:var(--sp-14)">Контакты для доставки</h2>
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
    <h2 class="h2" style="margin-bottom:var(--sp-12)">Доступ сотрудника</h2>
    <div class="card">
      <p class="small soft">Сотрудник открывает «Профиль» → «Доступ сотрудника». В прототипе можно выбрать демо-пользователя и посмотреть панель от его имени.</p>
      <div class="field" style="margin-top:var(--sp-14)">
        <label for="staffUser">Демо-сотрудник</label>
        <select id="staffUser" data-act="f" data-field="staffId">
          ${ADMIN_STAFF.map(s => `<option value="${s.id}" ${state.staffId===s.id?'selected':''}>${esc(s.name)} · ${esc(roleLabel(s.role))}</option>`).join('')}
        </select>
      </div>
      <button class="btn-outline" style="margin-top:var(--sp-14)" data-act="mode" data-mode="admin">Открыть демо-панель</button>
      <p class="hint" style="margin-top:var(--sp-10)">Без SMS и пароля. Список и роли задаются в админке → «Настройки». Настоящие приглашения и ограничение прав появятся только с серверной авторизацией.</p>
    </div>
  </section>
  <section class="section">
    <div class="row gap-10">
      <button class="btn-outline grow" data-act="go" data-screen="restaurant" style="border-radius:999px;padding:var(--sp-12) var(--sp-16)">${icon('pin')} О ресторане</button>
      <button class="btn-outline grow" data-act="go" data-screen="promos" style="border-radius:999px;padding:var(--sp-12) var(--sp-16)">${icon('tag')} Акции</button>
    </div>
  </section>`;
}

function scrPromos(){
  const banners = activeBanners();
  const promos = activePromos();
  /* У кода, у которого есть свой баннер, применение уже есть — на баннере.
     Вторую кнопку в списке не показываем: у гостя один способ применить код. */
  const inBanner = new Set(banners.filter(b=>b.kind==='promo' && b.code).map(b=>b.code));
  const soloPromos = promos.filter(p=>!inBanner.has(p.code));
  return `
  ${appBar('Акции и новости')}
  <section class="section">
    <div class="eyebrow">ВАСАБИ / АКЦИИ</div>
    <h1 class="h1" style="margin-top:var(--sp-10)">Свежие поводы заказать</h1>
    <div class="muted small" style="margin-top:var(--sp-6)">${banners.length} ${plural(banners.length,'акция','акции','акций')} · ${promos.length} ${plural(promos.length,'промокод','промокода','промокодов')}</div>
  </section>
  ${banners.map(b => `
    <section class="section">
      <div class="card promo-full" data-act="open-banner" data-banner="${b.id}">
        <img src="${b.img}" alt="">
        <div class="promo-full-body">
          <span class="promo-tag promo-tag-in">${b.tag}</span>
          <h2 class="h2">${b.title}</h2>
          <p class="muted small" style="margin-top:var(--sp-6)">${b.sub}</p>
          <button class="promo-cta" type="button" data-act="open-banner" data-banner="${b.id}">${b.cta}${icon('arrowRight')}</button>
        </div>
      </div>
    </section>`).join('')}
  <section class="section">
    <h2 class="h2" style="margin-bottom:var(--sp-12)">Промокоды</h2>
    ${soloPromos.map(p => `
      <div class="card" style="margin-bottom:var(--sp-10);display:flex;align-items:center;gap:var(--sp-14)">
        <div class="pay-icon">${icon('tag')}</div>
        <div class="grow">
          <div class="pay-name">${p.code}</div>
          <div class="pay-note">${p.label}</div>
        </div>
        <button class="btn-outline" data-act="copy-promo" data-code="${p.code}">Применить</button>
      </div>`).join('')}
    <p class="muted small" style="margin-top:var(--sp-12)">${soloPromos.length
      ? 'Код из акции можно и ввести вручную — на экране оплаты.'
      : 'Коды из акций выше применяются кнопкой на баннере. Любой код можно ввести вручную на экране оплаты.'}</p>
  </section>`;
}

function scrRestaurant(){
  return `
  ${appBar('О ресторане')}
  <section class="section">
    <div class="eyebrow">ВАСАБИ / МЕСТА</div>
    <h1 class="h1" style="margin-top:var(--sp-10)">${LOCATIONS.length} ${plural(LOCATIONS.length,'адрес','адреса','адресов')} в городе</h1>
    <p class="soft" style="margin-top:var(--sp-10);font-size:var(--fs-14)">${BRAND.tagline}. Готовим после заказа и доставляем горячим.</p>
  </section>
  ${LOCATIONS.map(l => `
    <section class="section">
      <div class="card">
        <div class="row between">
          <div class="pay-name">${l.name}</div>
          <span class="a-pill ${locIsOpen(l)?'lime':''}">${icon('clock')} ${l.hours}</span>
        </div>
        <div class="order-addr" style="margin-top:var(--sp-10)">${icon('pin')} ${l.address}</div>
        <div class="muted small" style="margin-top:var(--sp-8)">${l.delivery}</div>
        <p class="small" style="margin-top:var(--sp-8);color:${locIsOpen(l) ? 'var(--lime)' : 'var(--muted)'}">${locStatusText(l)}</p>
        ${l.service === 'delivery' && l.zoneKm > 0
          ? `<p class="muted small" style="margin-top:var(--sp-6)">${icon('info')} Доставляем в ${geoFormatKm(l.zoneKm)} от точки. Адрес проверим на карте при оформлении.</p>`
          : ''}
      </div>
    </section>`).join('')}
  <section class="section">
    <div class="card">
      <div class="row gap-10" style="margin-bottom:var(--sp-12)">${icon('phone')} <b>${BRAND.phone}</b></div>
      <p class="muted small">Поддержка работает ежедневно с 10:00 до 23:00. Среднее время ответа — 2 минуты.</p>
    </div>
  </section>
  <section class="section">
    <div class="card" style="text-align:center">
      <div class="pay-icon" style="margin:0 auto var(--sp-12)">${icon('qr')}</div>
      <h2 class="h2">QR-меню в зале</h2>
      <p class="muted small" style="margin-top:var(--sp-6)">Отдельный канал заказа с QR-кода на столе: без регистрации; бонусный счёт к такому заказу не привязывается.</p>
      <button class="btn-outline" style="margin-top:var(--sp-14)" data-act="open-qr-menu"><span>Открыть QR-меню</span>${icon('arrowRight')}</button>
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
  <section class="section" style="padding-top:var(--sp-4)">
    <div class="table-card">
      <div class="row between">
        <div>
          <div class="eyebrow">ВЫ ЗАКАЗАЛИ В ЗАЛЕ</div>
          <h1 class="h1" style="margin-top:var(--sp-8)">Стол ${table.no}</h1>
          <div class="muted small" style="margin-top:var(--sp-6)">${loc.address} · ${loc.hours}</div>
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
  <section class="section" style="margin-top:var(--sp-18)">
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
    <section class="section" style="padding-top:var(--sp-48)">
      <div class="row gap-10">
        <span class="logo-mark">${icon('leaf')}</span>
        <div class="wordmark">васаби<span class="dot">.</span></div>
      </div>
      <h1 class="h1" style="margin-top:var(--sp-32)">Вкусный вечер начинается здесь</h1>
      <p class="soft" style="margin-top:var(--sp-12);font-size:var(--fs-16)">Войдите по номеру телефона — SMS-код придёт за секунду.</p>
    </section>
    <section class="section" style="margin-top:var(--sp-28)">
      <div class="field">
        <label for="authPhone">Номер телефона</label>
        <input id="authPhone" type="tel" data-act="f" data-field="authPhone" placeholder="+7 900 000-00-00" value="${state.authPhone}"
          autocomplete="tel" inputmode="tel" enterkeyhint="next"
          ${state.authErr ? 'aria-invalid="true" aria-describedby="err-authPhone"' : ''}>
        ${state.authErr ? `<p class="err" id="err-authPhone" role="alert">${state.authErr}</p>` : ''}
      </div>
      <button class="btn-lime" data-act="auth-phone"><span>Получить код</span>${icon('arrowRight')}</button>
    </section>
    <section class="section">
      <div class="card">
        <p class="small soft">Регистрируясь, вы соглашаетесь с обработкой персональных данных (152-ФЗ) и получаете push-уведомления о статусе заказа.</p>
      </div>
    </section>`;
  }
  const digits = String(state.authCodeInput || state.authCode).split('');
  return `
  ${appBar('Подтверждение')}
  <section class="section" style="padding-top:var(--sp-18)">
    <div class="eyebrow">КОД ИЗ SMS</div>
    <h1 class="h1" style="margin-top:var(--sp-10)">Введите код</h1>
    <p class="soft" style="margin-top:var(--sp-10);font-size:var(--fs-14)">Код для номера ${state.authPhone || 'без номера'}</p>
  </section>
  <section class="section">
    <div class="code-input">
      ${[0,1,2,3].map(i => `<input maxlength="1" value="${digits[i] || ''}" inputmode="numeric" autocomplete="${i === 0 ? 'one-time-code' : 'off'}" aria-label="Цифра ${i+1}" data-act="f" data-field="authCode" data-index="${i}" ${state.authCodeErr ? 'aria-invalid="true" aria-describedby="err-authCode"' : ''}>`).join('')}
    </div>
    ${state.authCodeErr ? `<p class="err" id="err-authCode" role="alert" style="margin-top:var(--sp-12)">${state.authCodeErr}</p>` : ''}
    <button class="btn-lime" style="margin-top:var(--sp-20)" data-act="auth-code"><span>Войти</span>${icon('arrowRight')}</button>
    <button class="btn-outline" style="margin-top:var(--sp-14);width:100%" data-act="auth-resend">Отправить код ещё раз</button>
  </section>
  <section class="section">
    <div class="notice">${icon('info')}<span>Это прототип: SMS не отправляется. Код для входа — ${state.authCode}.</span></div>
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
  if (scr === 'checkout' && state.deliveryType === 'delivery'){
    mountGeo();
    if (geo.status === 'idle' && state.address.trim()) geoCheckAddress(state.address);
  }
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
  setOrderStatus(order, flow[idx + 1].key);
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
    'Часы работы: статус точки и заказ на завтра, если ресторан закрыт',
    'Оплата: подтверждение заказа, промокод и бонусы, карта / СБП / Apple Pay / наличные',
    'Статус заказа: таймлайн, отмена, экран отказа с возвратом',
    'Мои заказы: история заказов и их статусы',
    'Стоп-лист: блюдо пропадает из меню гостя сразу',
    'Акции: карусель на главной, тап = промокод или блюдо',
    'QR-меню на столе: заказ к столу без регистрации, оплата у стола',
    'Профиль: бонусы, уровень гостя и прогресс до следующего, контакты, адресная книга, история заказов, доступ сотрудника',
    'Вход по SMS: номер проверяется, неверный код даёт ошибку и повторную отправку; экран открывается из списка экранов'
  ]},
  { title:'Админ-панель', items:[
    'Меню: создание и правка блюда, метки и скидки, своё фото, стоп-лист, поиск и сортировка, CSV-импорт',
    '«На главной»: какие блюда попадают в ленту любимого (до 6)',
    'Маркетинг: промокоды, настройка кэшбэка, правил трат и уровней гостя, списания баллов, свои баннеры, демо-push',
    'Заказы: приём, статусы, отклонение с причиной',
    'Фильтры в админке: поиск, сортировка, панель «Фильтры» с честными счётчиками, чипы и сброс — в заказах, клиентах, меню, промокодах и журнале рассылок',
    'Выгрузка заказов в CSV: ровно те строки, что видны на экране',
    'Клиенты: автоматически из заказов, импорт из CRM, источники, бонусы и удаление',
    'QR-меню: ссылки на столы, PNG для печати, листы A4',
    'Аналитика: период, выручка, средний чек, доставка против самовывоза — считается по истории заказов; выгрузка CSV и Excel',
    'Настройки: доставка, добавление и правка точек, сотрудники и роли (демо)',
    'Мобильный вид: подробности прячутся под «Детали», кнопки — под палец, ничего не уезжает за край'
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
    <dt>Заказов</dt><dd>${myOrders().length}</dd>
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
  ['toast','adminToast'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ['toast','adminToast'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('is-on');
  }), 2400);
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
    applyOpenHours();
    render();
  },
  'pick-location': (el) => { state.locationId = el.dataset.id; state.slot = null; applyOpenHours(); render(); },
  'pay-method': (el) => { state.payMethod = el.dataset.id; render(); },
  'time-mode': (el) => {
    const loc = LOCATIONS.find(l => l.id === state.locationId) || LOCATIONS[0];
    if (el.dataset.mode === 'asap' && !state.table && !locIsOpen(loc)){
      toast('Сейчас закрыто — выберите время на завтра');
      return;
    }
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
    if (state.deliveryType === 'delivery') geoCheckAddress(a.address);
  },
  'geo-find': () => {
    const v = (state.address || '').trim();
    if (!v){ toast('Введите адрес'); return; }
    geoCheckAddress(v);
  },
  'geo-to-pickup': () => {
    state.deliveryType = 'pickup';
    toast('Переключили на самовывоз — доставка по этому адресу недоступна');
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
    if (state.deliveryType === 'delivery') geoCheckAddress(v);
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
      else if (geo.status === 'outside') errs.address = 'По этому адресу доставки нет — выберите самовывоз или другой адрес';
    }
    if (!table && state.timeMode === 'slot' && !state.slot) errs.slot = 'Выберите время доставки';
    const loc = LOCATIONS.find(l => l.id === state.locationId) || LOCATIONS[0];
    if (!table && !locIsOpen(loc) && !state.slot) errs.slot = 'Сейчас закрыто — выберите время на завтра';
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
  'bonus-toggle': () => {
    const t = totals();
    state.bonusUse = t.bonusUse > 0 ? 0 : t.bonusAvailable;
    render();
  },
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
        id:'o'+Date.now(), no: nextOrderNo(), ts: Date.now(), date: nowRu(),
        items: cartLines().map(l => ({ dishId:l.dishId, name:dishById(l.dishId).name, qty:l.qty, price:lineUnit(l), mods:l.mods })),
        sub:t.sub, delivery:t.delivery, discount:t.discount, bonus:t.bonusUse, total:t.total,
        bonusEarn: bonusEarnFor(state.deliveryType, t.sub - t.discount, userTurnover()),
        status:'new',
        deliveryType: state.deliveryType,
        locationId: state.deliveryType === 'table' ? state.table.locId : state.locationId,
        tableNo: state.deliveryType === 'table' ? state.table.no : null,
        addressId: state.addressId,
        slot: state.timeMode === 'slot' ? state.slot : null,
        address: state.deliveryType === 'table'
          ? `Стол ${state.table.no} · ${locById(state.table.locId).name}`
          : state.deliveryType === 'pickup' ? LOCATIONS.find(l=>l.id===state.locationId).address : state.address,
        comment: state.comment, payment: state.payMethod, promo: state.promo,
        source: state.deliveryType === 'table' ? 'qr' : 'app',
        customer: state.deliveryType === 'table' ? 'Гость стола ' + state.table.no : state.user.name,
        phone: state.deliveryType === 'table' ? '' : state.user.phone
      };
      state.orders.unshift(order);
      recordClientOrder(order);
      redeemOrderBonus(order);
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
  'repeat-order': (el) => repeatOrder(myOrders().find(x => x.id === el.dataset.id)),
  'repeat-last': () => repeatOrder(myOrders()[0]),
  'cancel-order': (el) => {
    const o = state.orders.find(x => x.id === el.dataset.id);
    if (!o) return;
    if (o.status !== 'new'){ toast('Заказ уже принят в работу — отменить нельзя'); return; }
    setOrderStatus(o, 'cancelled');
    o.rejectReason = 'Вы отменили заказ до того, как его приняли в работу.';
    state.autoStatus = false;
    toast('Заказ отменён');
    render();
  },
  'refresh-orders': () => { toast('История обновлена'); render(); },
  'save-contacts': () => { toast('Контакты сохранены'); render(); },
  'advance-status': () => { state.autoStatus = false; advanceStatus(); },
  'auth-phone': () => {
    const raw = (state.authPhone || '').trim();
    const digits = normPhone(raw);
    if (!raw){ state.authErr = 'Введите номер телефона'; render(); focusFirstError(); return; }
    if (digits.length !== 11 || digits[0] !== '7'){
      state.authErr = 'Проверьте номер: 11 цифр, например +7 900 000-00-00';
      render(); focusFirstError(); return;
    }
    state.authErr = '';
    state.authCode = '1234';
    state.authCodeInput = state.authCode;
    state.authCodeErr = '';
    state.authStep = 'code';
    render();
  },
  'auth-code': () => {
    const inputs = [...document.querySelectorAll('#viewport .code-input input')];
    const entered = inputs.length
      ? inputs.map(i => (i.value || '').trim()).join('')
      : (state.authCodeInput || '').trim();
    if (entered !== state.authCode){
      state.authCodeErr = 'Неверный код. Проверьте цифры или запросите код ещё раз.';
      render(); focusFirstError(); return;
    }
    state.authCodeErr = '';
    state.user.phone = state.authPhone;
    state.authStep = 'phone';
    toast('Вы вошли в аккаунт');
    go('home');
  },
  'auth-resend': () => {
    state.authCode = String(Math.floor(1000 + Math.random() * 9000));
    state.authCodeInput = state.authCode;
    state.authCodeErr = '';
    render();
    toast('Новый демо-код: ' + state.authCode + '. SMS не отправляются — это прототип.');
  },
  toast: (el) => toast(el.dataset.msg),
  reset: () => {
    state.cart = {}; state.orders = []; state.promo = null; state.bonusUse = 0;
    state.productMods = []; state.autoStatus = true; state.authStep = 'phone';
    state.authPhone = '+7 900 000-00-01';
    state.authCode = '1234'; state.authCodeInput = '1234';
    state.authErr = ''; state.authCodeErr = '';
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
  if (f === 'staffId') state.staffId = el.value;
  if (f === 'authPhone') state.authPhone = el.value;
  if (f === 'authCode'){
    const inputs = [...document.querySelectorAll('#viewport .code-input input')];
    state.authCodeInput = inputs.map(i => (i.value || '').trim()).join('');
    const i = Number(el.dataset.index);
    if (el.value && inputs[i + 1]) inputs[i + 1].focus();
    else if (!el.value && inputs[i - 1]) inputs[i - 1].focus();
  }
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

/* цифры кода приходят уже заполненными, поэтому по тапу цифра выделяется
   целиком: следующая набранная заменяет её, а не дописывается */
document.addEventListener('focusin', ev => {
  const el = ev.target;
  if (el && el.dataset && el.dataset.field === 'authCode' && el.select) el.select();
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
