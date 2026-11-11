/* =========================================================================
   Админ-панель «васаби.» — заказы, меню, маркетинг, клиенты, аналитика
   ========================================================================= */

const ADMIN_SECTIONS = [
  { id:'orders',   label:'Заказы',    icon:'receipt' },
  { id:'menu',     label:'Меню',      icon:'utensils' },
  { id:'qr',       label:'QR-меню',   icon:'qr' },
  { id:'marketing',label:'Маркетинг', icon:'tag' },
  { id:'clients',  label:'Клиенты',   icon:'users' },
  { id:'analytics',label:'Аналитика', icon:'chart' },
  { id:'settings', label:'Настройки', icon:'settings' }
];

const admin = {
  section: 'orders',
  tab: 'new',
  rejectFor: null,
  promoDraft: { code:'', type:'percent', value:10, min:0 },
  dishDraft: {
    id:null, name:'', cat:'rolls', price:'', salePercent:0, unit:'', badge:'',
    desc:'', composition:'', allergens:'', img:'assets/philadelphia.jpg', popular:false
  },
  bannerDraft: {
    id:null, kind:'promo', tag:'', title:'', sub:'', cta:'Применить код',
    img:'assets/sashimi.jpg', defaultImg:'assets/sashimi.jpg', code:'', dish:'d-set-w', screen:'profile'
  },
  locationDraft: { id:null, name:'', address:'', open:'11:00', close:'23:00', service:'delivery' },
  staffDraft: { name:'', phone:'', role:'operator' },
  /* Фильтры разделов. Одно поле — одно значение, мультивыбор — массив.
     Внутри группы значения OR, между группами AND. */
  f: {
    orders:  { query:'', range:'', status:[], delivery:[], payment:[], location:[], reject:'', sumMin:'', sumMax:'', sort:'new' },
    clients: { query:'', segment:[], source:[], sort:'name' },
    menu:    { query:'', cat:[], state:[], popular:[], sort:'name' },
    promos:  { query:'', state:[], type:[], sort:'code' },
    push:    { audience:[], sort:'' }
  },
  fOpen: { orders:false, clients:false, menu:false, promos:false, push:false },
  dishOpen: [],
  clientImport: { text:'', rows:null, errors:null, skipped:0 },
  menuImport: { text:'', rows:null, errors:null },
  pushDraft: { audience:'all', title:'', text:'', promo:'', when:'now', scheduleAt:'' },
  pushLog: [],
  bonusFor: null,
  bonusAmount: 100,
  qr: { locId:'l1', from:1, to:8, ec:'M' },
  settings: {
    deliveryPrice: RULES.deliveryPrice,
    freeFrom: RULES.freeDeliveryFrom,
    minOrder: RULES.minOrder,
    bonusEnabled: RULES.bonusEnabled,
    bonusPercent: RULES.bonusAccrual,
    bonusMaxPay: RULES.bonusMaxPay,
    bonusExpiryMonths: RULES.bonusExpiryMonths,
    prepTime: RULES.prepTime,
    autoAccept: false,
    sound: true
  }
};

const emptyDishDraft = () => ({
  id:null, name:'', cat:'rolls', price:'', salePercent:0, unit:'', badge:'',
  desc:'', composition:'', allergens:'', img:'assets/philadelphia.jpg',
  defaultImg:'assets/philadelphia.jpg', popular:false
});
const DISH_BADGE_PRESETS = ['Хит', 'Выбор шефа', 'Новинка', 'Горячий', 'Острое', 'Веган'];

function syncDishBadgePresets(){
  const current = (admin.dishDraft.badge || '').trim();
  document.querySelectorAll('[data-act="admin-dish-badge"]').forEach(button => {
    const active = (button.dataset.badge || '') === current;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

const emptyBannerDraft = () => ({
  id:null, kind:'promo', tag:'', title:'', sub:'', cta:'Применить код',
  img:'assets/sashimi.jpg', defaultImg:'assets/sashimi.jpg', code:'', dish:'d-set-w', screen:'profile'
});

const emptyLocationDraft = () => ({ id:null, name:'', address:'', open:'11:00', close:'23:00', service:'delivery' });
const roleLabel = id => (STAFF_ROLES[id] || STAFF_ROLES.operator).label;

const clientOrigin = c => (c.sources || [c.source || 'Демо']).join(' + ');

/* источники гостя списком: демо-запись, заказ в прототипе, импорт из CRM */
const clientSources = c => (c.sources && c.sources.length ? c.sources : [c.source || 'Демо']);

/* Сколько раз промокод применили в заказах — считаем по заказам,
   а не выдумываем число: демо-панель не должна показывать то, чего нет. */
const promoUses = code => state.orders.filter(o => o.promo === code).length;

function addClientSource(client, source){
  const sources = new Set(client.sources || [client.source || 'Демо']);
  sources.add(source);
  client.sources = [...sources];
  delete client.source;
}

/* Дата гостя — ISO «ГГГГ-ММ-ДД». Принимаем и «11.11.2026», и «2026-11-11»:
   в выгрузке из CRM дата может быть в любом из двух видов. */
function parseClientDate(raw){
  const s = String(raw || '').trim();
  if (!s) return '';
  const m = s.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/);
  if (m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return '';
}
const isoToTime = iso => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return new Date(+m[1], +m[2]-1, +m[3]).getTime();
};

/* Когда гость был последний раз: текстом («сегодня», «вчера», «11 ноября»).
   Если даты нет (импорт без даты) — показываем текст из выгрузки. */
function clientLastText(c){
  if (!c.lastDate) return c.last || '—';
  const days = Math.floor((Date.now() - isoToTime(c.lastDate)) / 86400000);
  if (days <= 0) return 'сегодня';
  if (days === 1) return 'вчера';
  if (days < 30) return days + ' ' + plural(days, 'день', 'дня', 'дней') + ' назад';
  const d = new Date(isoToTime(c.lastDate));
  const m = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'][d.getMonth()];
  return `${d.getDate()} ${m}`;
}

/* Заказ с телефоном пополняет базу; QR-заказ к столу без контактов гостя не создаёт. */
function recordClientOrder(order){
  if (!order || order.deliveryType === 'table') return;
  const phone = normPhone(order.phone);
  if (phone.length !== 11) return;
  let client = ADMIN_CLIENTS.find(c => normPhone(c.phone) === phone);
  if (!client){
    client = {
      name:(order.customer || '').trim() || 'Гость', phone:formatPhone(phone),
      orders:0, sum:0, bonus:0, segment:'Новый', last:order.date, sources:[]
    };
    ADMIN_CLIENTS.push(client);
  }
  addClientSource(client, 'Заказ');
  if ((order.customer || '').trim()) client.name = order.customer.trim();
  client.orders = (Number(client.orders) || 0) + 1;
  client.sum = (Number(client.sum) || 0) + Math.max(0, Number(order.total) || 0);
  client.last = order.date || nowRu();
  if (order.ts){
    client.lastDate = new Date(order.ts).toISOString().slice(0,10);
    if (!client.firstDate) client.firstDate = client.lastDate;
  }
  if (client.orders > 1 && client.segment === 'Новый') client.segment = 'Постоянный';
}

const normDishName = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const MENU_CSV_TEMPLATE = '\uFEFFНазвание;Категория;Цена;Скидка %;Вес;Метка;Описание;Состав;Аллергены;На главной\n'
  + 'Темпура с креветкой;hot;690;10;6 шт. · 240 г;Новинка;Хрустящий ролл с креветкой;Креветка, рис, панко, соус спайси;рыба, глютен;да\n'
  + 'Матча с юдзу;drinks;350;0;400 мл;;Освежающий напиток;Матча, юдзу, молоко;молоко;нет';

/* В меню запятые встречаются в составе, поэтому разделитель только «;».
   Кавычки вокруг ячейки поддерживаются, внутри них двойная кавычка экранируется парой. */
function parseMenuLine(line){
  const cells = [];
  let cell = '', quoted = false;
  for (let i = 0; i < line.length; i++){
    const ch = line[i];
    if (ch === '"'){
      if (quoted && line[i + 1] === '"'){ cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === ';' && !quoted){
      cells.push(cell.trim()); cell = '';
    } else cell += ch;
  }
  cells.push(cell.trim());
  return { cells, unclosed:quoted };
}

function parseMenuCsv(text){
  const rows = [], errors = [], seen = new Set();
  const lines = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/);
  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line) return;
    const parsed = parseMenuLine(line);
    const c = parsed.cells;
    if (idx === 0 && /^(название|name|блюдо)$/i.test(c[0] || '') && /^(категория|category|cat)$/i.test(c[1] || '')) return;
    if (parsed.unclosed){ errors.push('строка ' + (idx + 1) + ': не закрыта кавычка'); return; }
    const name = (c[0] || '').trim();
    const catText = (c[1] || '').trim().toLowerCase();
    const cat = CATEGORIES.find(x => x.id !== 'all' && (x.id === catText || x.name.toLowerCase() === catText));
    const price = Number((c[2] || '').replace(/\s/g, '').replace(',', '.'));
    const salePercent = c[3] ? Number(String(c[3]).replace(',', '.')) : 0;
    const key = normDishName(name);
    if (!name){ errors.push('строка ' + (idx + 1) + ': нет названия'); return; }
    if (!cat){ errors.push('строка ' + (idx + 1) + ': неизвестная категория «' + (c[1] || 'пусто') + '»'); return; }
    if (!isFinite(price) || price <= 0){ errors.push('строка ' + (idx + 1) + ': цена должна быть больше нуля'); return; }
    if (!isFinite(salePercent) || salePercent < 0 || salePercent > 90){ errors.push('строка ' + (idx + 1) + ': скидка — от 0 до 90%'); return; }
    if (seen.has(key)){ errors.push('строка ' + (idx + 1) + ': блюдо повторяется в файле'); return; }
    if (c.some(value => /[<>"]/.test(value))){ errors.push('строка ' + (idx + 1) + ': уберите <, > и двойные кавычки из текста'); return; }
    seen.add(key);
    const popular = /^(да|1|true|yes|\+)$/i.test((c[9] || '').trim());
    rows.push({
      name, cat:cat.id, price, salePercent,
      unit:(c[4] || '').trim() || '1 порция', badge:(c[5] || '').trim(),
      desc:(c[6] || '').trim(), composition:(c[7] || '').trim(),
      allergens:(c[8] || '').split(',').map(s => s.trim()).filter(Boolean),
      popular, duplicate:DISHES.some(d => normDishName(d.name) === key), warning:''
    });
  });
  const featured = new Set(DISHES.filter(d => d.popular).map(d => normDishName(d.name)));
  rows.forEach(r => {
    const key = normDishName(r.name);
    if (!r.popular){ featured.delete(key); return; }
    if (featured.has(key)) return;
    if (featured.size >= RULES.featuredMax){
      r.popular = false;
      r.warning = 'на главную не добавим: занято ' + RULES.featuredMax + ' мест';
    } else featured.add(key);
  });
  return { rows, errors };
}

const MENU_DEMO_IMAGES = {
  rolls:'assets/philadelphia.jpg', sushi:'assets/sashimi.jpg', sets:'assets/sushi-boat.jpg',
  baked:'assets/philadelphia.jpg', hot:'assets/tempura.jpg', drinks:'assets/latte.jpg', desserts:'assets/cheesecake.jpg'
};

/* Разбор выгрузки гостей из старой CRM: разделитель «;» или «,»,
   первая строка может быть заголовком. Плохие строки не роняют весь файл. */
function parseClientsCsv(text){
  const rows = [];
  const errors = [];
  const known = new Set(ADMIN_CLIENTS.map(c => normPhone(c.phone)));
  const lines = String(text || '').split(/\r?\n/);
  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line) return;
    const cells = line.split(/[;,]/).map(s => s.trim());
    if (idx === 0 && /^(имя|name|телефон|phone|клиент|client|гость)/i.test(cells[0] || '')) return;
    const name = (cells[0] || '').trim();
    const phone = normPhone(cells[1] || '');
    if (!name){ errors.push('строка ' + (idx + 1) + ': нет имени'); return; }
    if (phone.length !== 11){ errors.push('строка ' + (idx + 1) + ': телефон не распознан'); return; }
    const orders = Math.max(0, parseInt(cells[2] || '0', 10) || 0);
    const sum = Math.max(0, parseFloat((cells[3] || '0').replace(/\s/g, '')) || 0);
    const bonus = Math.max(0, parseInt((cells[4] || '0').replace(/\s/g, ''), 10) || 0);
    const segment = (cells[5] || '').trim() || (orders > 1 ? 'Постоянный' : 'Новый');
    const lastDate = parseClientDate(cells[6]);
    const firstDate = parseClientDate(cells[7]);
    rows.push({ name, phone: formatPhone(phone), orders, sum, bonus, segment, lastDate, firstDate, duplicate: known.has(phone) });
  });
  return { rows, errors, skipped: rows.filter(r => r.duplicate).length + errors.length };
}

/* Фото из телефона: ужимаем до 900 px по ширине и переводим в jpeg,
   иначе страница с картинкой весит десятки мегабайт и подвисает. */
function readImageFile(file, maxW = 900){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        const scale = Math.min(1, maxW / (img.width || maxW));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        try { resolve(canvas.toDataURL('image/jpeg', 0.82)); }
        catch (e) { reject(e); }
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

/* Значения полей берём из формы, а не из состояния: браузер мог заполнить
   поле автозаполнением, и событие input тогда не придёт */
function readDraftFields(rootId, act, base){
  const out = Object.assign({}, base);
  const root = document.getElementById(rootId);
  if (!root) return out;
  root.querySelectorAll('[data-act="' + act + '"]').forEach(el => {
    if (el.dataset.field) out[el.dataset.field] = el.value;
  });
  return out;
}

const adminTop = (title, sub) => {
  const staff = ADMIN_STAFF.find(s => s.id === state.staffId) || ADMIN_STAFF[0];
  return `
  <div>
    <h1>${title}</h1>
    <div class="sub">${sub}</div>
  </div>
  <div class="row gap-10">
    <a class="a-guide" href="guide.html" target="_blank" rel="noopener">Инструкция</a>
    <span class="a-pill lime">${icon('volume')} Звук нового заказа</span>
    <span class="a-pill olive">${esc(roleLabel(staff.role))} · ${esc(staff.name)} · демо</span>
  </div>`;
};

/* Что делает тап по карточке акции — так оператор видит, куда ведёт баннер */
const bannerKind = b => b.kind === 'dish'
  ? 'Открывает блюдо'
  : (b.kind === 'promo' ? 'Промокод ' + b.code : 'Ведёт на экран «' + ((SCREENS[b.screen] || {}).title || b.screen) + '»');

let lastAdminSection = null;

function renderAdmin(){
  const keepY = window.scrollY;
  const fkey = window.captureFocus();
  const ikey = captureAdminInput();
  renderAdminSide();
  const map = {
    orders: adminOrders, menu: adminMenu, qr: adminQr, marketing: adminMarketing,
    clients: adminClients, analytics: adminAnalytics, settings: adminSettings
  };
  const sec = ADMIN_SECTIONS.find(s => s.id === admin.section);
  $('#adminTop').innerHTML = adminTop(sec.label, adminSub());
  $('#adminBody').innerHTML = (map[admin.section] || adminOrders)();
  if (FILTER_DEFS[admin.section]) updateFilterMeta(admin.section);
  markScrollPanels();
  window.restoreFocus(fkey);
  restoreAdminInput(ikey);
  if (lastAdminSection === null || lastAdminSection === admin.section){
    if (window.scrollY !== keepY) window.scrollTo(0, keepY);
  } else {
    window.scrollTo(0, 0);
  }
  lastAdminSection = admin.section;
}

/* поле меняется по «change» и сразу перерисовывается: без возврата фокуса
   клавиатура уезжает в начало страницы посреди набора значения */
function captureAdminInput(){
  /* на телефоне возврат фокуса в поле поднимает клавиатуру поверх кнопки,
     поэтому фокус в полях восстанавливаем только на десктопе с мышью */
  if (!window.matchMedia('(pointer: fine)').matches) return null;
  const el = document.activeElement;
  if (!el || !el.closest || !el.closest('#adminBody')) return null;
  if (!/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return null;
  /* поле без id (начисление баллов) узнаём по data-fk: оно рисуется дважды —
     в таблице и в карточках, восстанавливаем видимый экземпляр */
  if (el.dataset && el.dataset.fk) return { fk: el.dataset.fk, start: el.selectionStart, end: el.selectionEnd };
  if (!el.id) return null;
  return {id: el.id, start: el.selectionStart, end: el.selectionEnd};
}

function restoreAdminInput(key){
  if (!key) return;
  let el = null;
  if (key.fk){
    const all = [...document.querySelectorAll('[data-fk="' + key.fk + '"]')];
    el = all.find(i => i.offsetParent !== null) || all[0] || null;
  } else {
    el = document.getElementById(key.id);
  }
  if (!el) return;
  el.focus({preventScroll: true});
  try { if (el.setSelectionRange && key.start != null) el.setSelectionRange(key.start, key.end); } catch (e) {}
}

/* таблицу в панели можно прокрутить только мышью — даём ей фокус и имя,
   чтобы к ней доехали с клавиатуры и озвучил скринридер */
function markScrollPanels(){
  document.querySelectorAll('#adminBody .a-panel').forEach(el => {
    if (el.scrollWidth <= el.clientWidth + 2) return;
    el.tabIndex = 0;
    el.setAttribute('role', 'region');
    const h = el.querySelector('h2');
    el.setAttribute('aria-label', (h ? h.textContent.trim() + ' — ' : '') + 'прокручивается по горизонтали');
  });
}

function adminSub(){
  switch (admin.section){
    case 'orders':   return 'Лента в реальном времени · обновляется по WebSocket';
    case 'menu':     return 'Добавить блюдо и цены, стоп-лист, модификаторы';
    case 'qr':       return 'QR-коды на столы: печать листов и ссылка меню';
    case 'marketing':return 'Промокоды, бонусы, баннеры и push-рассылки';
    case 'clients':  return 'База гостей, сегменты и ручные начисления бонусов';
    case 'analytics':return 'Выручка, средний чек и популярные блюда за неделю';
    case 'settings': return 'Доставка, точки ресторана, роли сотрудников';
  }
}

function renderAdminSide(){
  $('#adminSide').innerHTML = `
    <div class="aside-brand">
      <span class="logo-mark" style="width:34px;height:34px;border-radius:11px">${icon('leaf')}</span>
      <span class="wordmark" style="font-size:var(--fs-18)">васаби<span class="dot">.</span></span>
    </div>
    <nav class="aside-nav" aria-label="Разделы панели">
      ${ADMIN_SECTIONS.map(s => `
        <button class="${admin.section===s.id?'is-active':''}" data-act="admin-section" data-section="${s.id}"
          ${admin.section===s.id ? 'aria-current="page"' : ''}>
          ${icon(s.icon)} ${s.label}
        </button>`).join('')}
    </nav>
    <div class="aside-note">
      Демо-панель. Данные из iiko не подключены: меню и стоп-лист ведутся здесь вручную, заказы не попадают в кассу.
    </div>`;
}

/* =========================================================================
   Фильтры разделов: один шаблон на «Заказы», «Клиенты», «Меню», «Промокоды».
   Описание групп лежит в одном месте, поэтому разметка, счётчики и проверка
   совпадения не могут разойтись.
   Правило: фильтр появляется только там, где он реально сужает список.
   Внутри группы значения OR, между группами AND.
   ========================================================================= */

const ORDER_DELIVERY_LABELS = { delivery:'Доставка', pickup:'Самовывоз', table:'К столу (QR)' };
const ORDER_PAYMENT_LABELS  = { card:'Карта онлайн', sbp:'СБП', cash:'Наличные', table:'Оплата у стола' };

const orderBucket = o => {
  if (o.status === 'new') return 'new';
  if (o.status === 'done' || DEAD_STATUSES.includes(o.status)) return 'done';
  return 'work';
};

const dayStart = offset => {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - (Number(offset) || 0));
  return d.getTime();
};

/* Заказ попадает во все подходящие периоды: сегодняшний входит и в «7 дней»,
   поэтому выбор «Последние 7 дней» не теряет сегодняшние заказы. */
function orderRangeValues(o){
  const ts = Number(o.ts) || 0;
  if (!ts) return [];
  const out = [];
  if (ts >= dayStart(0)) out.push('today');
  if (ts >= dayStart(1)) out.push('yesterday');
  if (ts >= dayStart(6)) out.push('7d');
  if (ts >= dayStart(29)) out.push('30d');
  return out;
}

const FILTER_DEFS = {
  orders: {
    noun: 'заказ',
    plural: ['заказ', 'заказа', 'заказов'],
    query: '№ заказа, имя, телефон или адрес',
    emptyText: 'В этой вкладке пусто',
    items: () => state.orders,
    tabFilter: o => orderBucket(o),
    searchText: o => [o.no, o.customer, o.phone, o.address].join(' '),
    sorts: [
      { v:'new',      label:'Сначала новые' },
      { v:'old',      label:'Сначала старые' },
      { v:'sum-desc', label:'Сначала дорогие' },
      { v:'sum-asc',  label:'Сначала дешёвые' }
    ],
    sorters: {
      'new':      (a,b) => (Number(b.ts)||0) - (Number(a.ts)||0),
      'old':      (a,b) => (Number(a.ts)||0) - (Number(b.ts)||0),
      'sum-desc': (a,b) => (Number(b.total)||0) - (Number(a.total)||0),
      'sum-asc':  (a,b) => (Number(a.total)||0) - (Number(b.total)||0)
    },
    listHtml: list => ordersListHtml(list),
    groups: [
      { key:'range', label:'Дата заказа', kind:'select',
        options: () => [
          { v:'', label:'Всё время' },
          { v:'today', label:'Сегодня' },
          { v:'yesterday', label:'Вчера' },
          { v:'7d', label:'Последние 7 дней' },
          { v:'30d', label:'Последние 30 дней' }
        ],
        values: o => orderRangeValues(o) },
      { key:'status', label:'Статус', kind:'chips',
        options: (section, items, sel) => {
          const used = new Set(items.map(o => o.status));
          return Object.keys(STATUS_LABEL)
            .filter(k => used.has(k) || sel.includes(k))
            .map(k => ({ v:k, label:STATUS_LABEL[k] }));
        },
        values: o => [o.status] },
      { key:'delivery', label:'Как получить', kind:'chips',
        options: (section, items, sel) => {
          const used = new Set(items.map(o => o.deliveryType));
          return Object.keys(ORDER_DELIVERY_LABELS)
            .filter(k => used.has(k) || sel.includes(k))
            .map(k => ({ v:k, label:ORDER_DELIVERY_LABELS[k] }));
        },
        values: o => [o.deliveryType] },
      { key:'payment', label:'Оплата', kind:'chips',
        options: (section, items, sel) => {
          const used = new Set(items.map(o => o.payment));
          return Object.keys(ORDER_PAYMENT_LABELS)
            .filter(k => used.has(k) || sel.includes(k))
            .map(k => ({ v:k, label:ORDER_PAYMENT_LABELS[k] }));
        },
        values: o => [o.payment] },
      { key:'location', label:'Точка', kind:'chips',
        options: (section, items, sel) => LOCATIONS
          .filter(l => items.some(o => o.locationId === l.id) || sel.includes(l.id))
          .map(l => ({ v:l.id, label:l.name })),
        values: o => [o.locationId] },
      { key:'reject', label:'Причина отмены', kind:'select',
        options: (section, items, sel) => REJECT_REASONS
          .filter(r => items.some(o => o.rejectReason === r) || sel === r)
          .map(r => ({ v:r, label:r })),
        values: o => o.rejectReason ? [o.rejectReason] : [] },
      { key:'sum', label:'Сумма заказа', unit:'₽', kind:'sum', minKey:'sumMin', maxKey:'sumMax',
        total: o => Number(o.total) || 0 }
    ]
  },
  clients: {
    noun: 'гость',
    plural: ['гость', 'гостя', 'гостей'],
    query: 'Имя или телефон',
    emptyText: 'Гостей пока нет',
    items: () => ADMIN_CLIENTS,
    /* телефон ищем и в написанном виде, и по цифрам — без кода страны и без
       пробелов: владелец набирает «9000000001», а в базе «+7 900 000-00-01» */
    searchText: c => {
      const d = normPhone(c.phone);
      return [c.name, c.phone, d, d.replace(/^7/, '')].join(' ');
    },
    sorts: [
      { v:'name',       label:'По имени' },
      { v:'orders-desc', label:'Больше заказов' },
      { v:'sum-desc',   label:'Больше сумма' },
      { v:'bonus-desc', label:'Больше баллов' },
      { v:'last-desc',  label:'Недавно заказывал' }
    ],
    sorters: {
      'name':       (a,b) => a.name.localeCompare(b.name, 'ru'),
      'orders-desc':(a,b) => (Number(b.orders)||0) - (Number(a.orders)||0),
      'sum-desc':   (a,b) => (Number(b.sum)||0) - (Number(a.sum)||0),
      'bonus-desc': (a,b) => (Number(b.bonus)||0) - (Number(a.bonus)||0),
      'last-desc':  (a,b) => (isoToTime(b.lastDate) || 0) - (isoToTime(a.lastDate) || 0)
    },
    listHtml: list => clientsListHtml(list),
    groups: [
      { key:'segment', label:'Сегмент', kind:'chips',
        options: (section, items, sel) => {
          const used = new Set(items.map(c => c.segment));
          return [...used].filter(v => v).map(v => ({ v, label:v }));
        },
        values: c => c.segment ? [c.segment] : [] },
      { key:'source', label:'Источник', kind:'chips',
        options: (section, items, sel) => {
          const used = new Set(items.flatMap(clientSources));
          return [...used].filter(v => v).map(v => ({ v, label:v }));
        },
        values: c => clientSources(c) }
    ]
  },
  menu: {
    noun: 'блюдо',
    plural: ['блюдо', 'блюда', 'блюд'],
    query: 'Название, метка или категория',
    emptyText: 'В меню пока нет блюд',
    items: () => DISHES,
    searchText: d => {
      const cat = CATEGORIES.find(c => c.id === d.cat);
      return [d.name, d.badge || '', cat ? cat.name : ''].join(' ');
    },
    sorts: [
      { v:'name',      label:'По имени' },
      { v:'cat',       label:'По категории' },
      { v:'price-asc', label:'Сначала недорогие' },
      { v:'price-desc',label:'Сначала дорогие' }
    ],
    sorters: {
      'name':      (a,b) => a.name.localeCompare(b.name, 'ru'),
      'cat':       (a,b) => CATEGORIES.findIndex(c => c.id === a.cat) - CATEGORIES.findIndex(c => c.id === b.cat) || a.name.localeCompare(b.name, 'ru'),
      'price-asc': (a,b) => dishPrice(a) - dishPrice(b),
      'price-desc':(a,b) => dishPrice(b) - dishPrice(a)
    },
    listHtml: list => list.map(dishRowHtml).join(''),
    groups: [
      { key:'cat', label:'Категория', kind:'chips',
        options: (section, items, sel) => {
          const used = new Set(items.map(d => d.cat));
          return CATEGORIES.filter(c => c.id !== 'all' && (used.has(c.id) || sel.includes(c.id)))
            .map(c => ({ v:c.id, label:c.name }));
        },
        values: d => [d.cat] },
      /* «В меню» и «Стоп-лист» взаимоисключающие, поэтому это отдельная группа:
         в одной группе с «На главной» выбор стал бы давать лишние блюда */
      { key:'state', label:'В меню', kind:'chips',
        options: () => [
          { v:'menu', label:'В меню' },
          { v:'stop', label:'Стоп-лист' }
        ],
        values: d => [dishAvailable(d) ? 'menu' : 'stop'] },
      { key:'popular', label:'На главной', kind:'chips',
        options: () => [
          { v:'yes', label:'На главной' },
          { v:'no',  label:'Не на главной' }
        ],
        values: d => [d.popular ? 'yes' : 'no'] }
    ]
  },
  promos: {
    noun: 'промокод',
    plural: ['промокод', 'промокода', 'промокодов'],
    query: 'Код промокода',
    emptyText: 'Промокодов пока нет',
    items: () => PROMOS,
    searchText: p => p.code,
    sorts: [
      { v:'code',     label:'По коду' },
      { v:'uses-desc',label:'По числу использований' },
      { v:'min-desc', label:'По минимальной сумме' }
    ],
    sorters: {
      'code':      (a,b) => a.code.localeCompare(b.code, 'ru'),
      'uses-desc': (a,b) => promoUses(b.code) - promoUses(a.code),
      'min-desc':  (a,b) => (Number(b.min)||0) - (Number(a.min)||0)
    },
    listHtml: list => promosListHtml(list),
    groups: [
      { key:'state', label:'Состояние', kind:'chips',
        options: () => [
          { v:'on',  label:'Включён' },
          { v:'off', label:'Выключен' }
        ],
        values: p => [p.active ? 'on' : 'off'] },
      { key:'type', label:'Тип скидки', kind:'chips',
        options: () => [
          { v:'percent', label:'Процент' },
          { v:'fixed',   label:'Фиксированная сумма' },
          { v:'delivery',label:'Бесплатная доставка' }
        ],
        values: p => [p.type] }
    ]
  },
  push: {
    noun: 'рассылка',
    plural: ['рассылка', 'рассылки', 'рассылок'],
    query: '',
    emptyText: 'Рассылок пока нет',
    items: () => admin.pushLog,
    searchText: () => '',
    sorts: [],
    listHtml: list => pushLogListHtml(list),
    groups: [
      { key:'audience', label:'Аудитория', kind:'chips',
        options: (section, items) => {
          const used = new Set(items.map(e => e.audienceId).filter(Boolean));
          return [...used].map(id => ({ v:id, label:pushAudienceLabel(id) }));
        },
        values: e => e.audienceId ? [e.audienceId] : [] }
    ]
  }
};

/* выбранные значения группы */
function filterSelected(section, group){
  const f = admin.f[section];
  if (group.kind === 'sum'){
    return (f[group.minKey] !== '' && f[group.minKey] != null) || (f[group.maxKey] !== '' && f[group.maxKey] != null) ? 'sum' : '';
  }
  if (group.kind === 'select') return f[group.key] || '';
  return f[group.key] || [];
}

function groupMatches(group, item, f){
  if (group.kind === 'sum'){
    const total = group.total(item);
    const min = f[group.minKey], max = f[group.maxKey];
    if (min !== '' && min != null && total < Number(min)) return false;
    if (max !== '' && max != null && total > Number(max)) return false;
    return true;
  }
  const sel = filterSelectedOf(group, f);
  if (!sel || !sel.length) return true;
  const vals = group.values(item) || [];
  return sel.some(v => vals.includes(v));
}
const filterSelectedOf = (group, f) => group.kind === 'select' ? (f[group.key] ? [f[group.key]] : []) : (f[group.key] || []);

/* предметы раздела, прошедшие фильтры.
   skip — группу, которую не учитываем (для честных счётчиков),
   tabMode — 'all' для подсчёта по всем вкладкам, иначе текущая. */
function filterItems(section, skip, tabMode){
  const def = FILTER_DEFS[section];
  const f = admin.f[section];
  const q = (f.query || '').trim().toLowerCase();
  return def.items().filter(item => {
    if (q && !def.searchText(item).toLowerCase().includes(q)) return false;
    if (def.tabFilter && tabMode !== 'all' && def.tabFilter(item) !== admin.tab) return false;
    for (const g of def.groups){
      if (g.key === skip) continue;
      if (!groupMatches(g, item, f)) return false;
    }
    return true;
  });
}

function sortedFilterItems(section){
  const def = FILTER_DEFS[section];
  const sorter = def.sorters && def.sorters[admin.f[section].sort];
  const list = filterItems(section, null);
  return sorter ? list.slice().sort(sorter) : list;
}

/* сколько заказов останется, если выбрать этот вариант:
   считаем по списку без этой группы — иначе счётчик врал бы */
function facetCount(section, group, value){
  return filterItems(section, group.key).filter(item => (group.values(item) || []).includes(value)).length;
}

function activeFilterGroups(section){
  return FILTER_DEFS[section].groups.filter(g => {
    const sel = filterSelected(section, g);
    return Array.isArray(sel) ? sel.length > 0 : !!sel;
  });
}

function activeFilterChips(section){
  const def = FILTER_DEFS[section];
  const items = def.items();
  const out = [];
  def.groups.forEach(g => {
    const sel = filterSelected(section, g);
    if (!sel || (Array.isArray(sel) && !sel.length)) return;
    if (g.kind === 'sum'){
      const f = admin.f[section];
      const from = f[g.minKey] !== '' ? fmt(Number(f[g.minKey])) : '';
      const to = f[g.maxKey] !== '' ? fmt(Number(f[g.maxKey])) : '';
      const text = from && to ? (from + ' — ' + to) : (from ? ('от ' + from) : ('до ' + to));
      out.push({ group:g, value:'sum', label:g.label + ': ' + text + (g.unit ? ' ' + g.unit : '') });
      return;
    }
    const values = g.kind === 'select' ? [sel] : sel;
    values.forEach(v => {
      const opt = g.options(section, items, []).find(o => String(o.v) === String(v));
      out.push({ group:g, value:v, label:g.label + ': ' + (opt ? opt.label : v) });
    });
  });
  return out;
}

function filterCountText(section){
  const def = FILTER_DEFS[section];
  const shown = filterItems(section, null).length;
  const total = def.items().filter(item => !def.tabFilter || def.tabFilter(item) === admin.tab).length;
  return 'Показано ' + shown + ' из ' + total;
}

/* ------------------------------ разметка ------------------------------ */

function filterGroupHtml(section, g){
  const def = FILTER_DEFS[section];
  const items = def.items();
  const sel = filterSelected(section, g);
  const P = def.plural || ['заказ', 'заказа', 'заказов'];
  if (g.kind === 'sum'){
    const f = admin.f[section];
    return `
    <div class="a-filter-group">
      <span class="a-filter-legend">${g.label}${g.unit ? ', ' + g.unit : ''}</span>
      <div class="a-filter-range">
        <input class="input-plain" type="number" min="0" inputmode="numeric" id="fMin-${section}-${g.key}"
          data-act="admin-filter-num" data-section="${section}" data-group="${g.key}" data-key="${g.minKey}"
          placeholder="от" aria-label="${g.label}: от" value="${esc(f[g.minKey])}">
        <span class="muted">—</span>
        <input class="input-plain" type="number" min="0" inputmode="numeric" id="fMax-${section}-${g.key}"
          data-act="admin-filter-num" data-section="${section}" data-group="${g.key}" data-key="${g.maxKey}"
          placeholder="до" aria-label="${g.label}: до" value="${esc(f[g.maxKey])}">
      </div>
    </div>`;
  }
  if (g.kind === 'select'){
    const opts = g.options(section, items, sel ? [sel] : []);
    if (!opts.length) return '';
    return `
    <div class="a-filter-group">
      <label class="a-filter-legend" for="fSel-${section}-${g.key}">${g.label}</label>
      <select class="input-plain" id="fSel-${section}-${g.key}" data-act="admin-filter-set" data-section="${section}" data-group="${g.key}">
        ${opts.map(o => `<option value="${esc(o.v)}" ${String(sel||'')===String(o.v)?'selected':''}>${esc(o.label)}</option>`).join('')}
      </select>
    </div>`;
  }
  const opts = g.options(section, items, sel);
  if (!opts.length) return '';
  const legend = 'fLegend-' + section + '-' + g.key;
  return `
  <div class="a-filter-group">
    <div class="a-filter-legend" id="${legend}">${g.label}</div>
    <div class="a-chip-row" role="group" aria-labelledby="${legend}">
      ${opts.map(o => {
        const on = sel.includes(o.v);
        const n = facetCount(section, g, o.v);
        return `<button type="button" class="a-chip ${on?'is-active':''}" data-act="admin-filter-value" data-section="${section}"
          data-group="${g.key}" data-value="${esc(o.v)}" data-label="${esc(o.label)}" aria-pressed="${on}"
          aria-label="${esc(o.label)}, ${n} ${plural(n, P[0], P[1], P[2])}">${esc(o.label)} <span class="n">${n}</span></button>`;
      }).join('')}
    </div>
  </div>`;
}

function filterPanelHtml(section){
  const def = FILTER_DEFS[section];
  const P = def.plural || ['заказ', 'заказа', 'заказов'];
  const body = def.groups.map(g => filterGroupHtml(section, g)).filter(Boolean).join('');
  return `
  <div class="a-filter-panel" id="fPanel-${section}" ${admin.fOpen[section]?'':'hidden'}>
    ${body || '<p class="a-form-note">Для этого раздела фильтров нет.</p>'}
    <p class="a-form-note">Счётчик у варианта показывает, сколько ${P[2]} останется, если его выбрать. Пустой счётчик — таких записей сейчас нет.${def.tabFilter ? ' Счётчики и «Показано» считают по текущей вкладке.' : ''}</p>
  </div>`;
}

function filterToolbarHtml(section, tools){
  const def = FILTER_DEFS[section];
  const f = admin.f[section];
  const n = activeFilterGroups(section).length;
  const search = def.query ? `
    <input class="input-plain a-toolbar-search" id="fSearch-${section}" type="search" data-act="admin-filter-search" data-section="${section}"
      placeholder="${esc(def.query)}" aria-label="${esc(def.query)}" value="${esc(f.query)}">` : '';
  const sort = def.sorts && def.sorts.length ? `
    <select class="input-plain a-toolbar-sort" id="fSort-${section}" data-act="admin-filter-sort" data-section="${section}" aria-label="Сортировка списка">
      ${def.sorts.map(s => `<option value="${s.v}" ${f.sort===s.v?'selected':''}>${s.label}</option>`).join('')}
    </select>` : '';
  return `
  <div class="a-toolbar">
    ${search}
    <button type="button" class="a-btn a-filter-toggle ${n?'is-on':''}" id="fToggle-${section}" data-act="admin-filter-toggle" data-section="${section}"
      aria-expanded="${admin.fOpen[section]?'true':'false'}" aria-controls="fPanel-${section}">Фильтры${n?' · '+n:''}</button>
    ${sort}
    <span class="a-toolbar-count" id="fCount-${section}">${filterCountText(section)}</span>
    ${tools ? `<div class="a-toolbar-tools">${tools}</div>` : ''}
  </div>
  <div class="a-filter-active" id="fActive-${section}"></div>
  ${filterPanelHtml(section)}`;
}

function filterEmptyHtml(section){
  const chips = activeFilterChips(section);
  const q = (admin.f[section].query || '').trim();
  if (!chips.length && !q) return `<div class="a-empty">${esc(FILTER_DEFS[section].emptyText || 'Здесь пока пусто')}</div>`;
  return `
  <div class="a-empty">
    <div>${q ? 'Ничего не нашлось по запросу «' + esc(q) + '»' : 'Под фильтры ничего не попало'}</div>
    ${chips.length ? `<div class="a-filter-active" style="justify-content:center;margin-top:var(--sp-10)">
      ${chips.map(c => `<button type="button" class="a-chip-active" data-act="admin-filter-remove" data-section="${section}"
        data-group="${c.group.key}" data-value="${esc(c.value)}" aria-label="Снять фильтр: ${esc(c.label)}">${esc(c.label)} <span aria-hidden="true">×</span></button>`).join('')}
    </div>` : ''}
    <button class="a-btn" style="margin-top:var(--sp-12)" data-act="admin-filter-reset" data-section="${section}">Сбросить фильтры</button>
  </div>`;
}

/* ------------------------- перерисовка без потери фокуса ------------------------- */

/* список раздела — единственное, что перерисовывается при вводе в поиск
   и при переключении варианта: поле поиска и чипы остаются на месте */
function filterListHtml(section){
  const def = FILTER_DEFS[section];
  const list = sortedFilterItems(section);
  return list.length ? def.listHtml(list) : filterEmptyHtml(section);
}

function renderFilterList(section){
  const box = document.getElementById('fList-' + section);
  if (!box) return;
  box.innerHTML = filterListHtml(section);
}

/* варианты в панели обновляем на месте — кнопка не пересоздаётся,
   поэтому фокус и клавиатура не слетают */
function syncFilterChips(section){
  const panel = document.getElementById('fPanel-' + section);
  if (!panel) return;
  const def = FILTER_DEFS[section];
  const P = def.plural || ['заказ', 'заказа', 'заказов'];
  panel.querySelectorAll('.a-chip[data-group]').forEach(btn => {
    const g = def.groups.find(x => x.key === btn.dataset.group);
    if (!g) return;
    const sel = filterSelected(section, g) || [];
    const on = sel.includes(btn.dataset.value);
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
    const n = facetCount(section, g, btn.dataset.value);
    const num = btn.querySelector('.n');
    if (num) num.textContent = n;
    btn.setAttribute('aria-label', btn.dataset.label + ', ' + n + ' ' + plural(n, P[0], P[1], P[2]));
  });
}

function updateFilterMeta(section){
  const count = document.getElementById('fCount-' + section);
  if (count) count.textContent = filterCountText(section);
  const toggle = document.getElementById('fToggle-' + section);
  if (toggle){
    const n = activeFilterGroups(section).length;
    toggle.textContent = 'Фильтры' + (n ? ' · ' + n : '');
    toggle.classList.toggle('is-on', n > 0);
  }
  const row = document.getElementById('fActive-' + section);
  if (row){
    const chips = activeFilterChips(section);
    const q = (admin.f[section].query || '').trim();
    row.innerHTML = chips.map(c => `
      <button type="button" class="a-chip-active" data-act="admin-filter-remove" data-section="${section}"
        data-group="${c.group.key}" data-value="${esc(c.value)}" aria-label="Снять фильтр: ${esc(c.label)}">${esc(c.label)} <span aria-hidden="true">×</span></button>`).join('')
      + ((chips.length || q) ? `<button class="a-btn" data-act="admin-filter-reset" data-section="${section}">Сбросить фильтры</button>` : '');
  }
  if (section === 'orders') syncOrderTabs();
}

function resetSectionFilters(section){
  const def = FILTER_DEFS[section];
  const f = admin.f[section];
  f.query = '';
  def.groups.forEach(g => {
    if (g.kind === 'sum'){ f[g.minKey] = ''; f[g.maxKey] = ''; }
    else if (g.kind === 'select') f[g.key] = '';
    else f[g.key] = [];
  });
  const search = document.getElementById('fSearch-' + section);
  if (search) search.value = '';
}

/* после снятия фильтра крестиком фокус переносим на кнопку «Фильтры»:
   нажатая кнопка исчезает, иначе фокус провалился бы в никуда */
function focusFilterToggle(section){
  const toggle = document.getElementById('fToggle-' + section);
  if (toggle) toggle.focus({ preventScroll:true });
}

/* -------------------------------- заказы -------------------------------- */

function orderActionsHtml(o){
  const next = (o.deliveryType === 'table' ? {
    new:     { label:'Принять в работу', to:'cooking' },
    cooking: { label:'Собрать заказ',    to:'ready' },
    ready:   { label:'Подан к столу',    to:'done' }
  } : {
    new:     { label:'Принять в работу', to:'cooking' },
    cooking: { label:'Передать курьеру', to:'courier' },
    courier: { label:'Курьер выехал',   to:'way' },
    way:     { label:'Доставлен',       to:'done' }
  })[o.status];
  const dead = DEAD_STATUSES.includes(o.status);
  return `
    <div class="a-row">
      ${next && !dead ? `<button class="a-btn primary" data-act="admin-order-status" data-id="${o.id}" data-to="${next.to}">${next.label}</button>` : ''}
      <button class="a-btn" data-act="admin-toast" data-msg="Чек отправлен на кухню (iikoKitchen)">${icon('printer')} На кухню</button>
      ${dead ? '' : (admin.rejectFor === o.id
        ? `<div class="a-reject">
            <div class="a-reject-title">Причина отказа — гость увидит её в приложении</div>
            ${REJECT_REASONS.map(r => `<button class="a-btn danger" data-act="admin-reject" data-id="${o.id}" data-reason="${r}">${r}</button>`).join('')}
            <button class="a-btn" data-act="admin-reject-cancel">Отмена</button>
          </div>`
        : `<button class="a-btn danger" data-act="admin-reject-open" data-id="${o.id}">Отклонить</button>`)}
    </div>`;
}

function orderCardHtml(o){
  return `
    <article class="a-order ${o.status==='new'?'is-new':''}">
      <div class="a-order-head">
        <div>
          <div style="font-weight:700">№${o.no} ${o.deliveryType === 'table' ? `<span class="a-pill olive" style="margin-left:var(--sp-6)">${icon('qr')} QR · стол ${o.tableNo}</span>` : ''}</div>
          <div class="muted" style="font-size:var(--fs-12);margin-top:var(--sp-4)">${o.date}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700;color:var(--lime)">${fmt(o.total)}</div>
          <span class="a-pill ${o.status==='new'?'lime':(DEAD_STATUSES.includes(o.status)?'red':'olive')}" style="margin-top:var(--sp-6)">${statusLabel(o)}</span>
        </div>
      </div>
      <div class="a-order-items">${o.items.map(i => `${i.name} × ${i.qty}`).join('<br>')}</div>
      <div class="a-order-meta">
        <div class="row">${icon('user')} ${o.customer || 'Сергей'} · ${o.phone || '+7 900 000-00-01'}</div>
        <div class="row">${icon('pin')} ${o.address}</div>
        <div class="row">${icon('clock')} ${o.slot ? slotFull(o.slot) : (o.deliveryType === 'table' ? `К столу · ${RULES.prepTable}` : (o.deliveryType === 'pickup' ? 'Самовывоз · как можно скорее' : 'Доставка · как можно скорее'))}</div>
        <div class="row">${icon('wallet')} ${ORDER_PAYMENT_LABELS[o.payment] || 'Карта онлайн'}${o.promo?' · '+o.promo:''}</div>
        ${o.bonus ? `<div class="row">${icon('gift')} Списано ${o.bonus} ${plural(o.bonus,'балл','балла','баллов')}${o.bonusRefunded?' · возвращены':''}</div>` : ''}
        ${o.bonusEarn ? `<div class="row">${icon('gift')} Кэшбэк +${o.bonusEarn} · ${o.bonusCredited?'начислен':'после выполнения заказа'}</div>` : ''}
        ${o.comment ? `<div class="row">${icon('doc')} ${o.comment}</div>` : ''}
        ${o.rejectReason ? `<div class="row" style="color:#F2856B">${icon('info')} ${o.rejectReason}</div>` : ''}
      </div>
      ${orderActionsHtml(o)}
    </article>`;
}

function ordersListHtml(list){
  return `<div class="a-orders">${list.map(orderCardHtml).join('')}</div>`;
}

function adminOrders(){
  return `
  <div class="a-tabs">
    <button id="tab-new" class="${admin.tab==='new'?'is-active':''}" data-act="admin-tab" data-tab="new" aria-pressed="${admin.tab==='new'}">Новые</button>
    <button id="tab-work" class="${admin.tab==='work'?'is-active':''}" data-act="admin-tab" data-tab="work" aria-pressed="${admin.tab==='work'}">В работе</button>
    <button id="tab-done" class="${admin.tab==='done'?'is-active':''}" data-act="admin-tab" data-tab="done" aria-pressed="${admin.tab==='done'}">Завершённые</button>
    <button class="a-btn" style="margin-left:auto" data-act="admin-new-order">+ Создать тестовый заказ</button>
  </div>

  ${filterToolbarHtml('orders', `<button class="a-btn" data-act="admin-orders-csv">${icon('doc')} Скачать CSV</button>`)}

  <div id="fList-orders">${filterListHtml('orders')}</div>

  <div class="a-panel" style="margin-top:var(--sp-16)">
    <h2>Передача в iikoDelivery</h2>
    <p class="a-lead">Автоматическая передача заказа в iikoDelivery, печать на кухню в iikoKitchen и фискализация в iikoCash. Требуется лицензия iikoDelivery + iikoKitchen и API-ключи тестового стенда.</p>
    <div class="a-row" style="margin-top:var(--sp-12)">
      <span class="a-pill warn">${icon('info')} Не подключено</span>
      <button class="a-btn" data-act="admin-toast" data-msg="Заявка на подключение iiko отправлена подрядчику">Заказать подключение</button>
    </div>
  </div>`;
}

/* Счётчик вкладки считаем по всем фильтрам, кроме группы «Статус»:
   иначе вкладка «В работе» показывала бы ноль, когда выбран статус «Новый». */
const ORDER_TAB_LABELS = { new:'Новые', work:'В работе', done:'Завершённые' };

function syncOrderTabs(){
  ['new','work','done'].forEach(bucket => {
    const el = document.getElementById('tab-' + bucket);
    if (!el) return;
    const n = filterItems('orders', 'status', 'all').filter(o => orderBucket(o) === bucket).length;
    el.textContent = ORDER_TAB_LABELS[bucket] + ' · ' + n;
  });
}

/* Выгрузка отфильтрованных заказов в CSV: разделитель «;» и BOM,
   чтобы Excel открыл файл в нормальной кодировке. */
function ordersCsvText(list){
  const head = ['Номер','Дата','Статус','Гость','Телефон','Адрес','Сумма','Как получить','Оплата','Промокод','Комментарий'];
  const rows = list.map(o => [
    o.no, o.date, statusLabel(o), o.customer || '', o.phone || '', o.address || '',
    o.total, ORDER_DELIVERY_LABELS[o.deliveryType] || o.deliveryType,
    ORDER_PAYMENT_LABELS[o.payment] || o.payment, o.promo || '', o.comment || ''
  ]);
  const cell = c => '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"';
  return '\uFEFF' + [head, ...rows].map(r => r.map(cell).join(';')).join('\r\n');
}

function downloadTextFile(filename, text){
  const blob = new Blob([text], { type:'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* --------------------------------- меню --------------------------------- */

/* Список блюд — одна конструкция на все ширины: в строке только главное
   (фото, название, цена, статус, «на главной», «Детали», действия), остальное
   раскрывается кнопкой «Детали» под строкой. Горизонтальной прокрутки нет. */

function dishRowHtml(d){
  const open = admin.dishOpen.includes(d.id);
  const cat = CATEGORIES.find(c => c.id === d.cat);
  return `
  <div class="a-dish ${dishAvailable(d) ? '' : 'is-stopped'}">
    <div class="a-dish-main">
      <img class="thumb" src="${d.img}" alt="">
      <div class="a-dish-name"><b>${esc(d.name)}</b>${d.badge ? `<span class="muted" style="font-size:var(--fs-11)">${esc(d.badge)}</span>` : ''}</div>
    </div>
    <div class="a-dish-price"><b>${fmt(dishPrice(d))}</b>${d.salePercent ? `<span class="muted" style="font-size:var(--fs-11)"><s>${fmt(d.price)}</s> · −${d.salePercent}%</span>` : ''}</div>
    <span class="a-pill ${dishAvailable(d) ? 'lime' : 'red'}">${dishAvailable(d) ? 'Активно' : 'Стоп-лист'}</span>
    <button class="a-btn star ${d.popular ? 'is-on' : ''}" aria-pressed="${d.popular ? 'true' : 'false'}"
      aria-label="${d.popular ? 'Убрать «' + d.name + '» с главной' : 'Показать «' + d.name + '» на главной'}"
      data-act="admin-featured" data-id="${d.id}">${icon('star')}</button>
    <button class="a-btn" data-act="admin-dish-details" data-id="${d.id}" aria-expanded="${open ? 'true' : 'false'}">Детали ${open ? '▴' : '▾'}</button>
    <div class="a-dish-actions">
      <button class="a-btn" aria-label="Редактировать «${d.name}»" data-act="admin-dish-edit" data-id="${d.id}">${icon('edit')}</button>
      <button class="a-btn a-btn-stop ${dishAvailable(d) ? '' : 'primary'}" data-act="admin-stoplist" data-id="${d.id}">${dishAvailable(d) ? 'Стоп-лист' : 'Вернуть в меню'}</button>
    </div>
  </div>
  ${open ? `
  <div class="a-dish-details" data-details-for="${d.id}">
    <div class="a-dish-tags">
      <span class="a-pill">${esc(cat.name)}</span>
      ${d.unit ? `<span class="a-pill">${esc(d.unit)}</span>` : ''}
      ${d.salePercent ? `<span class="a-pill warn">Скидка −${d.salePercent}% · было ${fmt(d.price)}</span>` : ''}
      ${d.popular ? '<span class="a-pill lime">В ленте на главной</span>' : ''}
      ${(d.modifiers || []).map(m => `<span class="a-pill">+${m.price} ₽ · ${esc(m.name)}</span>`).join('')}
      ${(d.allergens || []).map(a => `<span class="a-pill red">${esc(a)}</span>`).join('')}
    </div>
    ${d.composition ? `<p class="a-dish-note muted"><b>Состав:</b> ${esc(d.composition)}</p>` : ''}
    ${d.desc ? `<p class="a-dish-note muted"><b>Описание:</b> ${esc(d.desc)}</p>` : ''}
  </div>` : ''}`;
}

function adminMenu(){
  const cats = CATEGORIES.filter(c => c.id !== 'all');
  const list = DISHES;
  const featured = list.filter(d => d.popular);
  const active = list.filter(dishAvailable).length;
  const stopped = list.filter(d => !dishAvailable(d));
  const stoppedCount = stopped.length;
  const ownPhoto = !!admin.dishDraft.img && !DISH_IMAGES.includes(admin.dishDraft.img);
  return `
  <div class="a-panel" id="dishForm" style="margin-bottom:var(--sp-18)">
    <h2>${admin.dishDraft.id ? 'Редактирование блюда' : 'Добавить блюдо в меню'}</h2>
    <p class="a-lead">Здесь управляются карточка и цена гостя. «Хит» или «Выбор шефа» — обычная метка; скидка в процентах уменьшает цену и показывает старую зачёркнутой.</p>
    <div class="a-grid dish-fields">
      <label class="a-labeled" for="dish-name"><span>Название блюда</span><input class="input-plain" id="dish-name" data-act="admin-dish-draft" data-field="name" placeholder="Темпура с креветкой" value="${esc(admin.dishDraft.name)}"></label>
      <label class="a-labeled" for="dish-cat"><span>Категория</span><select class="input-plain" id="dish-cat" data-act="admin-dish-draft" data-field="cat">
        ${CATEGORIES.filter(c => c.id !== 'all').map(c => `<option value="${c.id}" ${admin.dishDraft.cat===c.id?'selected':''}>${c.name}</option>`).join('')}
      </select></label>
      <label class="a-labeled" for="dish-price"><span>Обычная цена, ₽</span><input class="input-plain" id="dish-price" type="number" min="1" inputmode="numeric" data-act="admin-dish-draft" data-field="price" placeholder="690" value="${admin.dishDraft.price}"></label>
      <label class="a-labeled" for="dish-unit"><span>Вес или количество</span><input class="input-plain" id="dish-unit" data-act="admin-dish-draft" data-field="unit" placeholder="8 шт. · 260 г" value="${esc(admin.dishDraft.unit)}"></label>
      <label class="a-labeled" for="dish-discount"><span>Скидка на блюдо, %</span><input class="input-plain" id="dish-discount" type="number" min="0" max="90" inputmode="numeric" data-act="admin-dish-draft" data-field="salePercent" value="${admin.dishDraft.salePercent || 0}"></label>
    </div>
    <div class="a-badge-field">
      <label class="a-labeled" for="dish-badge"><span>Метка на карточке</span><input class="input-plain" id="dish-badge" maxlength="24" data-act="admin-dish-draft" data-field="badge" placeholder="Своя метка, напр. Соус в подарок" value="${esc(admin.dishDraft.badge)}"></label>
      <div class="a-badge-presets" role="group" aria-label="Готовые метки">
        ${['', ...DISH_BADGE_PRESETS].map(badge => `<button type="button" class="a-badge-preset ${admin.dishDraft.badge.trim()===badge?'is-active':''}" data-act="admin-dish-badge" data-badge="${esc(badge)}" aria-pressed="${admin.dishDraft.badge.trim()===badge}">${esc(badge || 'Без метки')}</button>`).join('')}
      </div>
      <p class="a-form-note">Нажмите готовую метку или впишите свою — до 24 символов. Она появится на карточке после сохранения блюда.</p>
    </div>
    <p class="a-form-note">Метка не меняет цену. Скидка действует на базовую цену блюда, доплаты за модификаторы не уменьшаются; 0 — без скидки. Промокод из раздела «Маркетинг» применяется дополнительно ко всей корзине.</p>
    <div class="a-photo">
      <img class="a-photo-preview" src="${admin.dishDraft.img}" alt="Фото блюда">
      <div class="a-photo-fields">
        <label class="a-photo-title" for="dishPhoto">Фото блюда — загрузить своё</label>
        <input type="file" id="dishPhoto" class="a-file" accept="image/*" data-act="admin-dish-photo">
        <div class="muted" style="font-size:var(--fs-12)">Лучше квадратный снимок от 900 × 900 px. Фото с телефона ужмётся до 900 px по ширине и появится в предпросмотре.</div>
        ${ownPhoto ? '<button class="a-btn" data-act="admin-dish-photo-reset">Вернуть прежнее фото</button>' : ''}
        <details class="a-stock">
          <summary>Нет своего фото? Выбрать демо-изображение</summary>
          <div class="a-stock-grid">
            ${DISH_IMAGES.map((p, i) => `<button type="button" class="a-stock-image ${admin.dishDraft.img===p?'is-active':''}" data-act="admin-dish-stock" data-img="${p}" aria-label="Выбрать демо-фото ${i+1}" aria-pressed="${admin.dishDraft.img===p}"><img src="${p}" alt=""></button>`).join('')}
          </div>
          <p class="a-form-note">Демо-фото нужны только для макета. Перед запуском замените их настоящими снимками блюд.</p>
        </details>
      </div>
    </div>
    <div class="a-grid a-grid-2" style="gap:var(--sp-10);margin-top:var(--sp-10)">
      <textarea class="input-plain" id="dish-desc" rows="2" aria-label="Описание блюда" data-act="admin-dish-draft" data-field="desc" placeholder="Описание для гостя">${admin.dishDraft.desc}</textarea>
      <textarea class="input-plain" id="dish-composition" rows="2" aria-label="Состав блюда" data-act="admin-dish-draft" data-field="composition" placeholder="Состав: рис, лосось, соевый соус…">${admin.dishDraft.composition}</textarea>
    </div>
    <div class="a-grid a-grid-2" style="gap:var(--sp-10);margin-top:var(--sp-10);align-items:end">
      <input class="input-plain" id="dish-allergens" aria-label="Аллергены через запятую" data-act="admin-dish-draft" data-field="allergens" placeholder="Аллергены через запятую: рыба, соя, молоко" value="${admin.dishDraft.allergens}">
      <button class="switch-row" role="switch" aria-checked="${admin.dishDraft.popular?'true':'false'}" data-act="admin-dish-popular">
        <span>Показывать на главной</span><span class="opt-toggle ${admin.dishDraft.popular?'is-on':''}" aria-hidden="true"></span>
      </button>
    </div>
    <div class="a-row dish-form-actions">
      <button class="a-btn primary" data-act="admin-dish-save">${admin.dishDraft.id ? 'Сохранить блюдо' : 'Создать блюдо'}</button>
      ${admin.dishDraft.id ? '<button class="a-btn" data-act="admin-dish-cancel">Отмена</button>' : ''}
    </div>
  </div>

  <details class="a-panel a-menu-import" id="menuImport" ${admin.menuImport.rows || admin.menuImport.text ? 'open' : ''}>
    <summary><span><b>Импорт меню из CSV или Excel</b><small>Загрузить сразу несколько блюд, сначала проверить предпросмотр</small></span></summary>
    <div class="a-import-body">
      <p class="a-lead">В Excel сохраните лист как «CSV UTF-8» с разделителем «;» или скачайте готовый шаблон. Дубликаты сверяются по названию: существующее блюдо обновится, новое добавится.</p>
      <p class="a-form-note">Колонки: <code>Название;Категория;Цена;Скидка %;Вес;Метка;Описание;Состав;Аллергены;На главной</code>. Категорию можно указать кодом (<code>rolls</code>, <code>hot</code>) или названием («Роллы», «Горячее»). В последней колонке — «да» или «нет». Состав и аллергены пишутся через запятую внутри своей ячейки.</p>
      <p class="a-form-note">Фото и модификаторы файл не переносит: новые позиции получат демо-фото по категории, после импорта загрузите свои снимки через редактирование. Это файловый импорт, а не прямая синхронизация с Foodpicasso или iiko.</p>
      <div class="a-row" style="margin-top:var(--sp-12)">
        <input type="file" class="a-file" accept=".csv,text/csv,text/plain" aria-label="Выбрать CSV-файл с меню" data-act="admin-menu-import-file">
        <button class="a-btn" data-act="admin-menu-template">Скачать шаблон CSV</button>
      </div>
      <textarea class="input-plain" id="menuImportText" rows="4" style="margin-top:var(--sp-10)" aria-label="Данные меню, можно вставить текстом" data-act="admin-menu-import-text" placeholder="Название;Категория;Цена;Скидка %;Вес;Метка;Описание;Состав;Аллергены;На главной">${esc(admin.menuImport.text)}</textarea>
      <div class="a-row" style="margin-top:var(--sp-12)">
        <button class="a-btn" data-act="admin-menu-import-check">Проверить меню</button>
        ${admin.menuImport.rows && admin.menuImport.rows.length ? `<button class="a-btn primary" id="menuImportApply" data-act="admin-menu-import-apply">Импортировать ${admin.menuImport.rows.length} ${plural(admin.menuImport.rows.length,'позицию','позиции','позиций')}</button>` : ''}
      </div>
      ${admin.menuImport.rows ? `
        <div style="margin-top:var(--sp-14)" id="menuImportPreview">
          <div class="muted" style="font-size:var(--fs-12);margin-bottom:var(--sp-8)">Добавим: ${admin.menuImport.rows.filter(r => !r.duplicate).length}. Обновим по названию: ${admin.menuImport.rows.filter(r => r.duplicate).length}. ${admin.menuImport.errors.length ? `Строк с ошибками: ${admin.menuImport.errors.length} — они не попадут в меню.` : ''}</div>
          <table class="a-table a-table-menu-import">
            <thead><tr><th scope="col">Блюдо</th><th scope="col">Категория</th><th scope="col">Цена</th><th scope="col">Скидка</th><th scope="col">На главной</th><th scope="col">Действие</th></tr></thead>
            <tbody>${admin.menuImport.rows.map(r => `
              <tr><td><b>${esc(r.name)}</b><div class="muted" style="font-size:var(--fs-11)">${esc(r.unit)}</div></td><td>${esc(CATEGORIES.find(c => c.id===r.cat).name)}</td><td>${fmt(r.price)}</td><td>${r.salePercent ? '−'+r.salePercent+'%' : '—'}</td><td>${r.popular?'Да':'Нет'}${r.warning?`<div class="muted" style="font-size:var(--fs-11)">${esc(r.warning)}</div>`:''}</td><td><span class="a-pill ${r.duplicate?'warn':'lime'}">${r.duplicate?'обновим':'добавим'}</span></td></tr>`).join('')}</tbody>
          </table>
          <div class="a-cards">${admin.menuImport.rows.map(r => `
            <article class="a-card a-card-col"><div class="a-card-body">
              <div class="a-card-title"><b>${esc(r.name)}</b><span class="a-pill ${r.duplicate?'warn':'lime'}">${r.duplicate?'обновим':'добавим'}</span></div>
              <div class="muted" style="font-size:var(--fs-12)">${esc(CATEGORIES.find(c => c.id===r.cat).name)} · ${fmt(r.price)}${r.salePercent?' · −'+r.salePercent+'%':''}</div>
              <div class="muted" style="font-size:var(--fs-12)">${r.popular?'Покажем на главной':'Без ленты на главной'}${r.warning?' · '+esc(r.warning):''}</div>
            </div></article>`).join('')}</div>
          ${admin.menuImport.errors.length ? `<div class="a-form-error">Не разобрано строк: ${admin.menuImport.errors.length} — ${admin.menuImport.errors.slice(0,4).map(esc).join('; ')}${admin.menuImport.errors.length>4?'…':''}</div>` : ''}
        </div>` : ''}
    </div>
  </details>

  <div class="a-grid a-grid-4" style="margin-bottom:var(--sp-18);margin-top:var(--sp-18)">
    <div class="a-stat"><div class="lbl">Позиций в меню</div><div class="val">${list.length}</div><div class="delta">${cats.length} категорий</div></div>
    <div class="a-stat"><div class="lbl">Активных</div><div class="val lime">${active}</div><div class="delta">${stoppedCount} в стоп-листе</div></div>
    <div class="a-stat"><div class="lbl">Средняя цена</div><div class="val">${fmt(list.reduce((s,d)=>s+dishPrice(d),0)/list.length)}</div><div class="delta">с учётом скидок</div></div>
    <div class="a-stat"><div class="lbl">Синхронизация с iiko</div><div class="val" style="font-size:var(--fs-18);color:#F0B45A">Не настроена</div><div class="delta">Меню ведётся вручную</div></div>
  </div>

  <div class="a-panel">
    <h2 style="margin-bottom:var(--sp-8)">Блюда и цены</h2>
    <p class="a-form-note">В строке — только главное: фото, название, цена, статус и действия. Категорию, вес, скидку, состав, аллергены и доплаты показывает кнопка «Детали».</p>
    ${filterToolbarHtml('menu', `<button class="a-btn primary" data-act="admin-dish-new">+ Добавить блюдо</button>`)}
    <div class="a-dishlist" id="fList-menu">
      ${filterListHtml('menu')}
    </div>
  </div>

  <div class="a-panel" style="margin-top:var(--sp-16)">
    <h2>Лента «Попробуйте любимое» на главной</h2>
    <p class="a-lead">Отмеченные блюда гость видит на главной без прокрутки. Не больше ${RULES.featuredMax}: главная не должна превращаться в каталог.</p>
    ${featured.length ? featured.map(d => `
      <div class="sum-row">
        <span class="row-star">${icon('star')}<span>${d.name}</span>${dishAvailable(d)?'':'<span class="a-pill red" style="margin-left:var(--sp-8)">в стоп-листе — гостю не виден</span>'}</span>
        <span class="val">
          <span class="muted" style="font-size:var(--fs-12);margin-right:var(--sp-8)">${fmt(dishPrice(d))}</span>
          <button class="a-btn" data-act="admin-featured" data-id="${d.id}" aria-label="Убрать «${d.name}» с главной">${icon('x')}</button>
        </span>
      </div>`).join('') : `<div class="sum-row"><span>Ничего не отмечено — лента на главной пустая</span><span class="val">0 из ${RULES.featuredMax}</span></div>`}
    ${featured.length ? `<div class="sum-row" style="border-top:1px solid var(--line-soft);margin-top:var(--sp-8);padding-top:var(--sp-10)"><span class="muted" style="font-size:var(--fs-12)">Занято мест в ленте</span><span class="val">${featured.length} из ${RULES.featuredMax}</span></div>` : ''}
  </div>

  <div class="a-grid a-grid-3" style="margin-top:var(--sp-16)">
    <div class="a-panel"><h2>Категории</h2>
      ${cats.map(c=>`<div class="sum-row"><span>${c.name}</span><span class="val">${DISHES.filter(d=>d.cat===c.id).length}</span></div>`).join('')}
    </div>
    <div class="a-panel"><h2>Модификаторы</h2>
      <div class="sum-row"><span>Дополнительное авокадо</span><span class="val">+150 ₽</span></div>
      <div class="sum-row"><span>Острый соус чили</span><span class="val">+50 ₽</span></div>
      <div class="sum-row"><span>Фирменный соус</span><span class="val">0 ₽</span></div>
    </div>
    <div class="a-panel"><h2>Стоп-лист</h2>
      <p class="a-lead">Позиции, которых нет на кухне прямо сейчас. Клиенты их не видят, и оповещение уходит в зал.</p>
      ${stopped.length ? stopped.map(d=>`<div class="sum-row"><span>${esc(d.name)}</span><span class="val">нет в наличии</span></div>`).join('')
        : '<div class="sum-row"><span>Сейчас пусто — все блюда в меню</span><span class="val">0</span></div>'}
    </div>
  </div>`;
}

/* ------------------------------- маркетинг ------------------------------- */

const PROMO_TYPE_LABEL = { percent:'Процент', fixed:'Фиксированная', delivery:'Доставка' };
const promoValueText = p => p.type === 'percent' ? p.value + '%' : (p.type === 'fixed' ? fmt(p.value) : 'бесплатно');

/* Промокоды: таблица и карточки строятся из одного отфильтрованного списка */
function promosListHtml(list){
  return `
    <table class="a-table a-table-promos">
      <thead><tr><th scope="col">Код</th><th scope="col">Тип</th><th scope="col">Значение</th><th scope="col">Мин. сумма</th><th scope="col">Использований</th><th scope="col"><span class="sr-only">Действия</span></th></tr></thead>
      <tbody>
        ${list.map(p => `
          <tr>
            <td><b>${esc(p.code)}</b>${p.active?'':'<div class="muted" style="font-size:var(--fs-11)">выключен</div>'}</td>
            <td class="muted nw">${PROMO_TYPE_LABEL[p.type] || p.type}</td>
            <td class="nw">${promoValueText(p)}</td>
            <td class="muted nw">${p.min?fmt(p.min):'—'}</td>
            <td class="muted nw">${promoUses(p.code)}</td>
            <td class="nw"><button class="a-btn ${p.active?'danger':''}" data-act="admin-promo-toggle" data-code="${esc(p.code)}">${p.active?'Отключить':'Включить'}</button></td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div class="a-cards">
      ${list.map(p => `
        <article class="a-card a-card-col">
          <div class="a-card-body">
            <div class="a-card-title"><b>${esc(p.code)}</b>${p.active?'':'<span class="a-pill warn">выключен</span>'}</div>
            <div class="muted" style="font-size:var(--fs-12)">${PROMO_TYPE_LABEL[p.type] || p.type} · ${promoValueText(p)}${p.min?' · от '+fmt(p.min):''}</div>
            <div class="muted" style="font-size:var(--fs-12)">Использований: ${promoUses(p.code)}</div>
            <div class="a-row"><button class="a-btn ${p.active?'danger':''}" data-act="admin-promo-toggle" data-code="${esc(p.code)}">${p.active?'Отключить':'Включить'}</button></div>
          </div>
        </article>`).join('')}
    </div>`;
}

/* Журнал рассылок: запись хранит id аудитории, поэтому фильтруем по нему,
   а не по текстовой подписи */
function pushLogListHtml(list){
  return list.map(entry => `
    <div class="sum-row" style="align-items:flex-start"><div><b>${esc(entry.title)}</b><div class="muted" style="font-size:var(--fs-12)">${esc(entry.audience)} · ${entry.count} ${plural(entry.count,'получатель','получателя','получателей')} · ${esc(entry.timing)}</div></div><span class="a-pill warn">Не отправлено</span></div>`).join('');
}

const PUSH_AUDIENCES = [
  { id:'all', label:'Вся база' },
  { id:'segment:Новый', label:'Новые гости' },
  { id:'segment:Постоянный', label:'Постоянные гости' },
  { id:'segment:VIP', label:'VIP' },
  { id:'segment:Спящий', label:'Спящие' },
  { id:'source:CRM', label:'Импортированные из CRM' },
  { id:'source:Заказ', label:'С заказом в прототипе' }
];
function pushRecipients(audience = admin.pushDraft.audience){
  if (audience.startsWith('segment:')) return ADMIN_CLIENTS.filter(c => c.segment === audience.slice(8));
  if (audience.startsWith('source:')){
    const source = audience.slice(7);
    return ADMIN_CLIENTS.filter(c => (c.sources || [c.source || 'Демо']).includes(source));
  }
  return ADMIN_CLIENTS.slice();
}
const pushAudienceLabel = id => (PUSH_AUDIENCES.find(a => a.id === id) || PUSH_AUDIENCES[0]).label;

function bonusExampleText(){
  const months = Math.max(0, Number(RULES.bonusExpiryMonths) || 0);
  return `Пример: при заказе блюд на 1 000 ₽ гость получит ${Math.floor(1000*RULES.bonusAccrual/100)} баллов после выполнения и сможет списать до ${Math.floor(1000*RULES.bonusMaxPay/100)} баллов.` +
    (months ? ` Баллы сгорят через ${months} ${plural(months,'месяц','месяца','месяцев')} после начисления.` : ' Баллы не сгорают.');
}

function syncBonusExample(){
  const example = document.getElementById('bonusExample');
  if (example) example.textContent = bonusExampleText();
}

function updatePushPreview(){
  const d = admin.pushDraft;
  const recipients = pushRecipients(d.audience);
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set('pushCount', recipients.length + ' ' + plural(recipients.length,'получатель','получателя','получателей'));
  set('pushPreviewTitle', d.title.trim() || 'Заголовок уведомления');
  set('pushPreviewText', d.text.trim() || 'Текст сообщения появится здесь');
  set('pushChars', String(d.text.length) + ' / 180');
  set('pushRecipientNames', recipients.length
    ? recipients.slice(0,3).map(c => c.name).join(', ') + (recipients.length>3 ? ' и ещё ' + (recipients.length-3) : '')
    : 'В этой аудитории пока никого нет');
  const promo = document.getElementById('pushPreviewPromo');
  if (promo){ promo.hidden = !d.promo; promo.textContent = d.promo ? 'Промокод: ' + d.promo : ''; }
  set('pushSendLabel', d.when === 'later' ? 'Сохранить демо-расписание' : 'Смоделировать отправку');
}

function adminMarketing(){
  const s = admin.settings;
  const ownBanner = !!admin.bannerDraft.img && !DISH_IMAGES.includes(admin.bannerDraft.img);
  return `
  <div class="a-grid a-grid-4" style="margin-bottom:var(--sp-18)">
    <div class="a-stat"><div class="lbl">Активных промокодов</div><div class="val lime">${activePromos().length}</div><div class="delta">всего в базе: ${PROMOS.length}</div></div>
    <div class="a-stat"><div class="lbl">Начисление бонусов</div><div class="val">${admin.settings.bonusPercent}%</div><div class="delta">от суммы заказа</div></div>
    <div class="a-stat"><div class="lbl">Рассылок в демо-журнале</div><div class="val">${admin.pushLog.length}</div><div class="delta">реальная отправка не подключена</div></div>
    <div class="a-stat"><div class="lbl">Баннеров на главной</div><div class="val">${activeBanners().length}</div><div class="delta">всего заведено: ${BANNERS.length}</div></div>
  </div>

  <div class="a-panel" id="bonusSettings" style="margin-bottom:var(--sp-16)">
    <div class="row between" style="align-items:flex-start;gap:var(--sp-16)">
      <div>
        <h2>Бонусная система</h2>
        <p class="a-lead-sm" style="margin-top:var(--sp-6)">Простой кэшбэк: 1 балл = 1 ₽. Без уровней и отдельных условий по блюдам.${s.bonusExpiryMonths ? ` Баллы сгорают через ${s.bonusExpiryMonths} ${plural(s.bonusExpiryMonths,'месяц','месяца','месяцев')} после начисления.` : ' Баллы не сгорают.'}</p>
      </div>
      <span class="a-pill ${s.bonusEnabled?'lime':'warn'}">${s.bonusEnabled?'Включена':'Выключена'}</span>
    </div>
    <button class="switch-row" role="switch" aria-checked="${!!s.bonusEnabled}" data-act="admin-toggle" data-key="bonusEnabled">
      <span>Начислять и списывать бонусы</span><span class="opt-toggle ${s.bonusEnabled?'is-on':''}" aria-hidden="true"></span>
    </button>
    <div class="a-grid a-grid-3" style="gap:var(--sp-10);margin-top:var(--sp-12)">
      <label class="a-labeled"><span>Кэшбэк с заказа, %</span><input class="input-plain" id="bonusPercent" type="number" min="0" max="50" step="1" inputmode="numeric" data-act="admin-setting" data-key="bonusPercent" value="${s.bonusPercent}" ${s.bonusEnabled?'':'disabled'}></label>
      <label class="a-labeled"><span>Максимум оплаты баллами, %</span><input class="input-plain" id="bonusMaxPay" type="number" min="0" max="100" step="1" inputmode="numeric" data-act="admin-setting" data-key="bonusMaxPay" value="${s.bonusMaxPay}" ${s.bonusEnabled?'':'disabled'}></label>
      <label class="a-labeled"><span>Срок списания баллов, месяцев</span><input class="input-plain" id="bonusExpiryMonths" type="number" min="0" max="60" step="1" inputmode="numeric" data-act="admin-setting" data-key="bonusExpiryMonths" value="${s.bonusExpiryMonths}" ${s.bonusEnabled?'':'disabled'}></label>
    </div>
    <p class="a-form-note" id="bonusExample">${bonusExampleText()}</p>
    <p class="a-form-note">Кэшбэк считается от суммы блюд после промокода, без доставки. Списанные баллы возвращаются при отмене. Срок списания действует для новых начислений: уже начисленные баллы сохраняют свой срок. 0 месяцев — баллы не сгорают. Настройки применяются сразу и работают только в демо-вкладке; это не счёт iiko.</p>
  </div>

  <div class="a-grid a-grid-split" style="margin-bottom:var(--sp-16)">
    <div class="a-panel">
      <h2>Промокоды</h2>
      ${filterToolbarHtml('promos')}
      <div id="fList-promos">${filterListHtml('promos')}</div>
      <h2 style="margin-top:var(--sp-20)">Новый промокод</h2>
      <p class="a-lead-sm">Скидка на всю корзину: гость вводит код на оплате или нажимает на связанный баннер. Минимум 0 ₽ — без ограничения по сумме.</p>
      <div class="a-grid a-grid-2" style="gap:var(--sp-10)">
        <label class="a-labeled"><span>Код для гостя</span><input class="input-plain" data-act="admin-draft" data-field="code" placeholder="AUTUMN25" value="${esc(admin.promoDraft.code)}"></label>
        <label class="a-labeled"><span>Что уменьшаем</span><select class="input-plain" data-act="admin-draft" data-field="type">
          <option value="percent" ${admin.promoDraft.type==='percent'?'selected':''}>Процент от заказа</option>
          <option value="fixed" ${admin.promoDraft.type==='fixed'?'selected':''}>Сумма заказа, ₽</option>
          <option value="delivery" ${admin.promoDraft.type==='delivery'?'selected':''}>Стоимость доставки</option>
        </select></label>
        <label class="a-labeled"><span>Размер скидки${admin.promoDraft.type==='percent'?', %':(admin.promoDraft.type==='fixed'?', ₽':'')}</span><input class="input-plain" id="promo-value" type="number" min="0" max="${admin.promoDraft.type==='percent'?'90':''}" inputmode="numeric" data-act="admin-draft" data-field="value" value="${admin.promoDraft.value}" ${admin.promoDraft.type==='delivery'?'disabled':''}></label>
        <label class="a-labeled"><span>Минимальный заказ, ₽</span><input class="input-plain" type="number" min="0" inputmode="numeric" data-act="admin-draft" data-field="min" value="${admin.promoDraft.min}"></label>
      </div>
      <div class="a-row" style="margin-top:var(--sp-12)">
        <button class="a-btn primary" data-act="admin-promo-create">Создать промокод</button>
        <button class="a-btn" data-act="admin-section" data-section="menu">Скидка на одно блюдо →</button>
      </div>
    </div>

    <div class="a-panel">
      <h2>Карусель акций на главной</h2>
      <div class="muted" style="font-size:var(--fs-12);margin-bottom:var(--sp-12)">
        ${BANNERS.filter(b => b.active).length} из ${BANNERS.length} показываются гостю. Порядок ниже = порядок карточек в ленте, изменения видны сразу.
      </div>
      ${BANNERS.map((b, i) => `
        <div class="a-order a-banner-row" style="margin-bottom:var(--sp-10)">
          <img class="a-banner-thumb" src="${b.img}" alt="">
          <div class="a-banner-info">
            <div class="row between" style="gap:var(--sp-10)">
              <div style="font-weight:700">${b.title}</div>
              <div class="row gap-6">
                <button class="a-btn" data-act="admin-banner-move" data-banner="${b.id}" data-dir="-1" ${i===0?'disabled':''} aria-label="Выше">↑</button>
                <button class="a-btn" data-act="admin-banner-move" data-banner="${b.id}" data-dir="1" ${i===BANNERS.length-1?'disabled':''} aria-label="Ниже">↓</button>
              </div>
            </div>
            <div class="muted" style="font-size:var(--fs-12);margin-top:var(--sp-4)"><span class="a-pill olive">Метка: ${b.tag}</span> ${bannerKind(b)} · ${b.sub}</div>
            <div class="a-row" style="margin-top:var(--sp-10)">
              <span class="a-pill ${b.active?'lime':''}">${b.active?'Показывается':'Скрыт'}</span>
              <button class="a-btn" data-act="admin-banner-edit" data-banner="${b.id}">${icon('edit')} Изменить</button>
              <button class="a-btn" data-act="admin-banner-toggle" data-banner="${b.id}">${b.active?'Выключить':'Показать'}</button>
            </div>
          </div>
        </div>`).join('')}

      <h2 style="margin-top:var(--sp-20)">${admin.bannerDraft.id ? 'Изменить акцию' : 'Новая акция на главной'}</h2>
      <p class="a-lead-sm">Метка «−15%» — это текст на картинке, а не сама скидка. Скидку считает выбранный промокод; после его выбора метка подставится автоматически, но её можно изменить.</p>
      <div id="bannerForm">
      <div class="a-grid a-grid-2" style="gap:var(--sp-10)">
        <label class="a-labeled"><span>Что открывает баннер</span><select class="input-plain" id="banner-kind" data-act="admin-banner-draft" data-field="kind">
          <option value="promo" ${admin.bannerDraft.kind==='promo'?'selected':''}>Промокод</option>
          <option value="dish" ${admin.bannerDraft.kind==='dish'?'selected':''}>Блюдо</option>
          <option value="screen" ${admin.bannerDraft.kind==='screen'?'selected':''}>Экран приложения</option>
        </select></label>
        <label class="a-labeled"><span>Метка на картинке</span><input class="input-plain" id="banner-tag" data-act="admin-banner-draft" data-field="tag" placeholder="−20% или Новинка" value="${esc(admin.bannerDraft.tag)}"></label>
      </div>
      <div style="margin-top:var(--sp-10)">
        <input class="input-plain" id="banner-title" style="width:100%" aria-label="Заголовок акции" data-act="admin-banner-draft" data-field="title" placeholder="Заголовок, напр. Скидка 20% на второй сет" value="${esc(admin.bannerDraft.title)}">
      </div>
      <div class="a-grid a-grid-2" style="gap:var(--sp-10);margin-top:var(--sp-10)">
        <input class="input-plain" id="banner-sub" aria-label="Подпись под заголовком" data-act="admin-banner-draft" data-field="sub" placeholder="Подпись: промокод, условия" value="${esc(admin.bannerDraft.sub)}">
        <input class="input-plain" id="banner-cta" aria-label="Надпись на кнопке" data-act="admin-banner-draft" data-field="cta" placeholder="Кнопка: Применить код" value="${esc(admin.bannerDraft.cta)}">
      </div>
      <div style="margin-top:var(--sp-10)">
        ${admin.bannerDraft.kind === 'promo' ? `
          <label class="a-labeled"><span>Промокод, который даёт скидку</span><select class="input-plain" id="banner-code" data-act="admin-banner-draft" data-field="code">
            <option value="">— выберите промокод —</option>
            ${PROMOS.map(p => `<option value="${p.code}" ${admin.bannerDraft.code===p.code?'selected':''}>${p.code} · ${p.active?'активен':'выключен'}</option>`).join('')}
          </select></label>` : (admin.bannerDraft.kind === 'dish' ? `
          <label class="a-labeled"><span>Блюдо для открытия</span><select class="input-plain" id="banner-dish" data-act="admin-banner-draft" data-field="dish">
            ${DISHES.map(d => `<option value="${d.id}" ${admin.bannerDraft.dish===d.id?'selected':''}>${d.name}</option>`).join('')}
          </select></label>` : `
          <label class="a-labeled"><span>Экран приложения</span><select class="input-plain" id="banner-screen" data-act="admin-banner-draft" data-field="screen">
            ${['profile','promos','orders','favorites','restaurant','catalog'].map(k => `<option value="${k}" ${admin.bannerDraft.screen===k?'selected':''}>${SCREENS[k].title}</option>`).join('')}
          </select></label>`)}
      </div>
      <div class="a-photo a-banner-photo">
        <img class="a-banner-preview" src="${admin.bannerDraft.img}" alt="Предпросмотр баннера">
        <div class="a-photo-fields">
          <label class="a-photo-title" for="bannerPhoto">Баннер — загрузить свой JPG или PNG</label>
          <input type="file" id="bannerPhoto" class="a-file" accept="image/*" data-act="admin-banner-photo">
          <div class="muted" style="font-size:var(--fs-12)">Рекомендуем 1600 × 800 px, горизонтальный 2:1. На главной верх и низ обрежутся чуть сильнее — текст и блюдо держите по центру. Большой файл ужмётся до 1600 px по ширине.</div>
          ${ownBanner ? '<button class="a-btn" data-act="admin-banner-photo-reset">Вернуть прежний баннер</button>' : ''}
          <details class="a-stock">
            <summary>Нет своего баннера? Выбрать демо-фон</summary>
            <div class="a-stock-grid a-stock-banners">
              ${DISH_IMAGES.map((p, i) => `<button type="button" class="a-stock-image ${admin.bannerDraft.img===p?'is-active':''}" data-act="admin-banner-stock" data-img="${p}" aria-label="Выбрать демо-фон ${i+1}" aria-pressed="${admin.bannerDraft.img===p}"><img src="${p}" alt=""></button>`).join('')}
            </div>
            <p class="a-form-note">Это фотографии блюд для демонстрации, а не готовые рекламные макеты. Для запуска загрузите свой баннер с текстом и нужным кадрированием.</p>
          </details>
        </div>
      </div>
      <div class="a-row" style="margin-top:var(--sp-12)">
        <button class="a-btn primary" data-act="admin-banner-create">${admin.bannerDraft.id ? 'Сохранить акцию' : 'Создать акцию'}</button>
        ${admin.bannerDraft.id ? '<button class="a-btn" data-act="admin-banner-cancel">Отмена</button>' : ''}
      </div>
      </div>

      <div class="a-subform" id="pushForm">
        <h2>Push-рассылка</h2>
        <p class="a-lead-sm">Настройте аудиторию, текст, промокод и время. Получатели считаются из текущей базы гостей выше, а не заданы вручную.</p>
        <div class="field">
          <label for="pushAudience">Кому отправить</label>
          <select class="input-plain" id="pushAudience" data-act="admin-push-draft" data-field="audience">
            ${PUSH_AUDIENCES.map(a => `<option value="${a.id}" ${admin.pushDraft.audience===a.id?'selected':''}>${a.label} · ${pushRecipients(a.id).length}</option>`).join('')}
          </select>
          <p class="hint" id="pushCount">${pushRecipients().length} ${plural(pushRecipients().length,'получатель','получателя','получателей')}</p>
        </div>
        <div class="field"><label for="pushTitle">Заголовок</label><input class="input-plain" id="pushTitle" maxlength="60" data-act="admin-push-draft" data-field="title" placeholder="Например: Ужин со скидкой" value="${esc(admin.pushDraft.title)}"></div>
        <div class="field">
          <label for="pushText">Текст сообщения</label>
          <textarea class="input-plain" id="pushText" rows="3" maxlength="180" data-act="admin-push-draft" data-field="text" placeholder="Сегодня −15% на роллы по промокоду VASABI">${esc(admin.pushDraft.text)}</textarea>
          <p class="hint" id="pushChars">${admin.pushDraft.text.length} / 180</p>
        </div>
        <div class="a-grid a-grid-2" style="gap:var(--sp-10)">
          <label class="a-labeled"><span>Что откроется по нажатию</span><select class="input-plain" id="pushPromo" data-act="admin-push-draft" data-field="promo">
            <option value="">Главная приложения</option>
            ${PROMOS.filter(p => p.active).map(p => `<option value="${p.code}" ${admin.pushDraft.promo===p.code?'selected':''}>Промокод ${p.code}</option>`).join('')}
          </select></label>
          <label class="a-labeled"><span>Когда</span><select class="input-plain" id="pushWhen" data-act="admin-push-draft" data-field="when">
            <option value="now" ${admin.pushDraft.when==='now'?'selected':''}>Сейчас</option>
            <option value="later" ${admin.pushDraft.when==='later'?'selected':''}>Запланировать</option>
          </select></label>
        </div>
        ${admin.pushDraft.when === 'later' ? `<div class="field" style="margin-top:var(--sp-10)"><label for="pushScheduleAt">Дата и время</label><input class="input-plain" id="pushScheduleAt" type="datetime-local" data-act="admin-push-draft" data-field="scheduleAt" value="${esc(admin.pushDraft.scheduleAt)}"></div>` : ''}
        <div class="a-push-preview" aria-label="Предпросмотр уведомления">
          <div class="a-push-brand">${icon('bell')} васаби. <span>сейчас</span></div>
          <b id="pushPreviewTitle">${esc(admin.pushDraft.title || 'Заголовок уведомления')}</b>
          <p id="pushPreviewText">${esc(admin.pushDraft.text || 'Текст сообщения появится здесь')}</p>
          <span class="a-pill lime" id="pushPreviewPromo" ${admin.pushDraft.promo?'':'hidden'}>${admin.pushDraft.promo?'Промокод: '+esc(admin.pushDraft.promo):''}</span>
        </div>
        <p class="a-form-note a-push-recipients" id="pushRecipientNames">${pushRecipients().length ? pushRecipients().slice(0,3).map(c => esc(c.name)).join(', ') + (pushRecipients().length>3 ? ' и ещё ' + (pushRecipients().length-3) : '') : 'В этой аудитории пока никого нет'}</p>
        <button class="a-btn primary a-push-send" data-act="admin-push-send" ${pushRecipients().length?'':'disabled'}><span id="pushSendLabel">${admin.pushDraft.when==='later'?'Сохранить демо-расписание':'Смоделировать отправку'}</span></button>
        <p class="a-form-note">В прототипе рассылка только сохраняется в демо-журнал: телефоны ничего не получат. Для настоящей отправки и расписания нужны сервер, согласия гостей и push-провайдер.</p>
      </div>
      ${admin.pushLog.length ? `<div class="a-subform"><h2>Демо-журнал рассылок</h2>
        ${filterToolbarHtml('push')}
        <div id="fList-push">${filterListHtml('push')}</div>
      </div>` : ''}
    </div>
  </div>`;
}

/* -------------------------------- клиенты ------------------------------- */

function bonusOpenFor(c){
  return !!(admin.bonusFor && admin.bonusFor.phone === c.phone);
}

/* форма начисления баллов раскрывается прямо под гостем — без модального окна,
   по тому же принципу, что «Детали» в списке блюд */
function bonusBoxHtml(c){
  return `
    <div class="a-bonus-box">
      <span class="muted" style="font-size:var(--fs-12)">Сейчас у гостя ${fmt(c.bonus)} · начислить:</span>
      ${[100,500,1000].map(n => `<button class="a-btn amt ${Number(admin.bonusAmount)===n?'is-on':''}" data-act="admin-bonus-quick" data-amount="${n}" aria-pressed="${Number(admin.bonusAmount)===n}">+${fmt(n)}</button>`).join('')}
      <input class="input-plain js-bonus-amount" type="number" min="1" inputmode="numeric" aria-label="Сколько баллов начислить" data-act="admin-bonus-amount" data-fk="bonus-amount" value="${admin.bonusAmount}">
      <button class="a-btn primary" data-act="admin-bonus-apply" data-phone="${esc(c.phone)}">Начислить</button>
      <button class="a-btn" data-act="admin-bonus-cancel">Отмена</button>
    </div>
    <p class="muted" style="font-size:var(--fs-12);margin-top:var(--sp-8)">Начисление попадёт в историю демо-счёта, срок сгорания — по общему правилу. Гость с этим телефоном увидит новый баланс.</p>`;
}

function focusBonusAmount(){
  /* форма рендерится и в таблице, и в карточках (одна из них скрыта CSS) —
     фокус ставим на видимый экземпляр поля */
  const vis = [...document.querySelectorAll('.js-bonus-amount')].find(i => i.offsetParent !== null)
    || document.querySelector('.js-bonus-amount');
  if (vis) vis.focus({ preventScroll:true });
}

/* Список гостей строится один раз, из отфильтрованного массива: и таблица,
   и карточки показывают одни и те же строки — иначе на десктопе и на телефоне
   цифры разойдутся */
function clientsListHtml(list){
  return `
    <table class="a-table a-table-clients">
      <thead><tr><th scope="col">Имя</th><th scope="col">Телефон</th><th scope="col">Заказов</th><th scope="col">Сумма</th><th scope="col">Бонусы</th><th scope="col">Сегмент</th><th scope="col">Последний</th><th scope="col"><span class="sr-only">Действия</span></th></tr></thead>
      <tbody>
        ${list.map(c => `
          <tr>
            <td><b>${esc(c.name)}</b> <span class="a-pill olive">${esc(clientOrigin(c))}</span></td>
            <td class="muted nw">${esc(c.phone)}</td>
            <td class="nw">${c.orders}</td>
            <td class="nw">${fmt(c.sum)}</td>
            <td class="nw">${fmt(c.bonus)}</td>
            <td class="nw"><span class="a-pill ${c.segment==='VIP'?'lime':(c.segment==='Спящий'?'warn':'')}">${esc(c.segment)}</span></td>
            <td class="muted nw">${esc(clientLastText(c))}</td>
            <td class="nw">
              <div class="a-row">
                <button class="a-btn" data-act="admin-bonus-open" data-phone="${esc(c.phone)}" aria-expanded="${bonusOpenFor(c)}">Начислить</button>
                <button class="a-btn danger" data-act="admin-client-del" data-phone="${esc(c.phone)}" aria-label="Удалить гостя ${esc(c.name)}">${icon('trash')}</button>
              </div>
            </td>
          </tr>
          ${bonusOpenFor(c) ? `<tr class="a-bonus-tr"><td colspan="8">${bonusBoxHtml(c)}</td></tr>` : ''}`).join('')}
      </tbody>
    </table>

    <div class="a-cards">
      ${list.map(c => `
        <article class="a-card">
          <div class="a-card-body">
            <div class="a-card-title"><b>${esc(c.name)}</b><span class="a-pill olive">${esc(clientOrigin(c))}</span></div>
            <div class="muted" style="font-size:var(--fs-12)">${esc(c.phone)}</div>
            <div class="a-card-row">
              <span>${c.orders} ${plural(c.orders,'заказ','заказа','заказов')} · ${fmt(c.sum)}</span>
              <span class="a-pill ${c.segment==='VIP'?'lime':(c.segment==='Спящий'?'warn':'')}">${esc(c.segment)}</span>
            </div>
            <div class="muted" style="font-size:var(--fs-12)">Бонусы ${fmt(c.bonus)} · был ${esc(clientLastText(c))}</div>
            <div class="a-row">
              <button class="a-btn" data-act="admin-bonus-open" data-phone="${esc(c.phone)}" aria-expanded="${bonusOpenFor(c)}">Начислить баллы</button>
              <button class="a-btn danger" data-act="admin-client-del" data-phone="${esc(c.phone)}" aria-label="Удалить гостя ${esc(c.name)}">${icon('trash')}</button>
            </div>
            ${bonusOpenFor(c) ? bonusBoxHtml(c) : ''}
          </div>
        </article>`).join('')}
    </div>`;
}

function adminClients(){
  const orderCount = ADMIN_CLIENTS.reduce((s,c) => s + (Number(c.orders) || 0), 0);
  const orderSum = ADMIN_CLIENTS.reduce((s,c) => s + (Number(c.sum) || 0), 0);
  return `
  <div class="a-grid a-grid-4" style="margin-bottom:var(--sp-10)">
    <div class="a-stat"><div class="lbl">Гостей в базе</div><div class="val">${ADMIN_CLIENTS.length}</div><div class="delta">демо, CRM и заказы</div></div>
    <div class="a-stat"><div class="lbl">Повторных гостей</div><div class="val lime">${ADMIN_CLIENTS.filter(c=>c.orders>1).length}</div><div class="delta">больше одного заказа</div></div>
    <div class="a-stat"><div class="lbl">Средний чек</div><div class="val">${fmt(orderCount ? orderSum/orderCount : 0)}</div><div class="delta">по истории в этой базе</div></div>
    <div class="a-stat"><div class="lbl">Баллов в обороте</div><div class="val">${fmt(ADMIN_CLIENTS.reduce((s,c)=>s+c.bonus,0))}</div><div class="delta">демо и CRM, не iiko</div></div>
  </div>
  <p class="muted" style="font-size:var(--fs-12);margin:0 0 var(--sp-12)">Сводка сверху — по всей базе. Фильтры ниже сужают только список гостей.</p>
  <div class="a-panel">
    <h2>Гости</h2>
    <p class="a-lead">После оформления заказа с телефоном гость появляется здесь автоматически или обновляет свою историю. Импорт из CRM добавляет переехавшую базу. Исходные шесть записей — демо; QR-заказ к столу без телефона карточку не создаёт.</p>
    ${filterToolbarHtml('clients')}
    <div id="fList-clients">${filterListHtml('clients')}</div>
  </div>

  <div class="a-panel" style="margin-top:var(--sp-16)">
    <h2>Импорт гостей из старой CRM</h2>
    <p class="a-lead">Выгрузите гостей из Foodpicasso в CSV и загрузите сюда — гости переедут в базу вместе с историей заказов и бонусами. Телефон сверяется: гостя с таким же номером второй раз не добавляем, а обновляем его историю.</p>
    <p class="muted" style="font-size:var(--fs-12);margin-top:var(--sp-6)">Формат строки: <code>Имя;Телефон;Заказы;Сумма;Бонусы;Сегмент</code> — разделитель «;» или «,», первая строка может быть заголовком.</p>
    <div class="a-row" style="margin-top:var(--sp-12)">
      <input type="file" class="a-file" accept=".csv,text/csv,text/plain" aria-label="Выбрать CSV-файл с гостями" data-act="admin-import-file">
    </div>
    <textarea class="input-plain" id="importText" rows="3" style="margin-top:var(--sp-10)" aria-label="Данные гостей, можно вставить текстом" data-act="admin-import-text" placeholder="Имя;Телефон;Заказы;Сумма;Бонусы;Сегмент">${admin.clientImport.text}</textarea>
    <div class="a-row" style="margin-top:var(--sp-12)">
      <button class="a-btn" data-act="admin-import-check">Проверить файл</button>
      ${admin.clientImport.rows && admin.clientImport.rows.length ? `<button class="a-btn primary" id="importApply" data-act="admin-import-apply">Импортировать ${admin.clientImport.rows.length} ${plural(admin.clientImport.rows.length,'гостя','гостя','гостей')}</button>` : ''}
    </div>
    ${admin.clientImport.rows ? `
      <div style="margin-top:var(--sp-14)" id="importPreview">
        <div class="muted" style="font-size:var(--fs-12);margin-bottom:var(--sp-8)">Разобрано строк: ${admin.clientImport.rows.length}. ${admin.clientImport.errors && admin.clientImport.errors.length ? `Не разобрано: ${admin.clientImport.errors.length}.` : ''}</div>
        <div class="muted" style="font-size:var(--fs-12);margin-bottom:var(--sp-8)">
          Добавим: ${admin.clientImport.rows.filter(r => !r.duplicate).length}. Обновим историю: ${admin.clientImport.rows.filter(r => r.duplicate).length}.
        </div>
        <table class="a-table a-table-import">
          <thead><tr><th scope="col">Имя</th><th scope="col">Телефон</th><th scope="col">Заказов</th><th scope="col">Сумма</th><th scope="col">Бонусы</th><th scope="col">Сегмент</th><th scope="col">Статус</th></tr></thead>
          <tbody>
            ${admin.clientImport.rows.map(r => `
              <tr>
                <td><b>${r.name}</b></td>
                <td class="muted">${r.phone}</td>
                <td>${r.orders}</td>
                <td>${fmt(r.sum)}</td>
                <td>${fmt(r.bonus)}</td>
                <td>${r.segment}</td>
                <td>${r.duplicate ? '<span class="a-pill warn">уже есть — обновим историю</span>' : '<span class="a-pill lime">добавим</span>'}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="a-cards">
          ${admin.clientImport.rows.map(r => `
            <article class="a-card a-card-col">
              <div class="a-card-body">
                <div class="a-card-title"><b>${r.name}</b><span class="muted" style="font-size:var(--fs-12)">${r.phone}</span></div>
                <div class="a-card-row">${r.orders} ${plural(r.orders,'заказ','заказа','заказов')} · ${fmt(r.sum)}</div>
                <div class="muted" style="font-size:var(--fs-12)">Бонусы ${fmt(r.bonus)} · ${r.segment}</div>
                <div class="a-card-row"><span class="a-pill ${r.duplicate?'warn':'lime'}">${r.duplicate?'уже есть — обновим историю':'добавим'}</span></div>
              </div>
            </article>`).join('')}
        </div>
        ${admin.clientImport.errors && admin.clientImport.errors.length ? `
          <div class="muted" style="font-size:var(--fs-12);margin-top:var(--sp-10);color:var(--danger)">Не разобрано строк: ${admin.clientImport.errors.length} — ${admin.clientImport.errors.slice(0,3).join('; ')}${admin.clientImport.errors.length>3?'…':''}</div>` : ''}
      </div>` : ''}
  </div>`;
}

/* ------------------------------- аналитика ------------------------------- */

function adminAnalytics(){
  const bars = [
    { d:'Пн', v:41 }, { d:'Вт', v:58 }, { d:'Ср', v:47 }, { d:'Чт', v:72 },
    { d:'Пт', v:96 }, { d:'Сб', v:128 }, { d:'Вс', v:114 }
  ];
  const top = DISHES.slice().sort((a,b)=>b.price-a.price).slice(0,5);
  const max = Math.max(...bars.map(b=>b.v));
  return `
  <div class="a-grid a-grid-4" style="margin-bottom:var(--sp-18)">
    <div class="a-stat"><div class="lbl">Выручка за неделю</div><div class="val lime">${fmt(684300)}</div><div class="delta">+14% к прошлой неделе</div></div>
    <div class="a-stat"><div class="lbl">Заказов</div><div class="val">556</div><div class="delta">79 в день</div></div>
    <div class="a-stat"><div class="lbl">Средний чек</div><div class="val">${fmt(1231)}</div><div class="delta">+2,1%</div></div>
    <div class="a-stat"><div class="lbl">Доставка / самовывоз</div><div class="val">72% / 28%</div><div class="delta">среднее время 41 мин</div></div>
  </div>

  <div class="a-grid a-grid-split" style="margin-bottom:var(--sp-16)">
    <div class="a-panel">
      <h2>Заказы по дням недели</h2>
      <div style="display:flex;align-items:flex-end;gap:var(--sp-12);height:170px;padding-top:var(--sp-10)">
        ${bars.map(b => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:var(--sp-8);height:100%;justify-content:flex-end">
            <span style="font-size:var(--fs-12);color:var(--muted)">${b.v}</span>
            <div style="width:100%;height:${Math.round(b.v/max*125)}px;background:var(--lime);border-radius:8px 8px 0 0"></div>
            <span style="font-size:var(--fs-12);color:var(--muted)">${b.d}</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="a-panel">
      <h2>Популярные блюда</h2>
      ${top.map((d,i) => `
        <div style="margin-bottom:var(--sp-12)">
          <div class="row between" style="font-size:var(--fs-13);margin-bottom:var(--sp-6)"><span>${i+1}. ${d.name}</span><span class="muted">${[214,187,143,121,96][i]} шт.</span></div>
          <div class="a-bar"><i style="width:${[100,87,67,56,45][i]}%"></i></div>
        </div>`).join('')}
    </div>
  </div>

  <div class="a-panel" style="margin-top:var(--sp-16)">
    <div class="row between">
      <h2>Отчёт по неделям</h2>
      <div class="a-row">
        <button class="a-btn" data-act="admin-toast" data-msg="Отчёт выгружен в CSV">Выгрузить CSV</button>
        <button class="a-btn" data-act="admin-toast" data-msg="Отчёт выгружен в Excel">Выгрузить Excel</button>
      </div>
    </div>
    <table class="a-table a-table-report" style="margin-top:var(--sp-12)">
      <thead><tr><th scope="col">Период</th><th scope="col">Заказов</th><th scope="col">Выручка</th><th scope="col">Средний чек</th><th scope="col">Доставка</th></tr></thead>
      <tbody>
        ${[['20–26 октября',556,'684 300 ₽','1 231 ₽','72%'],
           ['13–19 октября',487,'601 900 ₽','1 236 ₽','70%'],
           ['6–12 октября',455,'558 200 ₽','1 227 ₽','68%']].map(r=>`
          <tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}
      </tbody>
    </table>
    <div class="a-cards">
      ${[['20–26 октября',556,'684 300 ₽','1 231 ₽','72%'],
         ['13–19 октября',487,'601 900 ₽','1 236 ₽','70%'],
         ['6–12 октября',455,'558 200 ₽','1 227 ₽','68%']].map(r=>`
        <article class="a-card a-card-col">
          <div class="a-card-body">
            <div class="a-card-title"><b>${r[0]}</b></div>
            <div class="a-card-row">${r[1]} ${plural(r[1],'заказ','заказа','заказов')} · ${r[2]}</div>
            <div class="muted" style="font-size:var(--fs-12)">Средний чек ${r[3]} · доставка ${r[4]}</div>
          </div>
        </article>`).join('')}
    </div>
  </div>`;
}

/* ------------------------------- настройки ------------------------------- */

function adminSettings(){
  const s = admin.settings;
  const l = admin.locationDraft;
  return `
  <div class="a-grid a-grid-2">
    <div class="a-panel">
      <h2>Доставка и заказы</h2>
      <div class="field"><label for="set-deliveryPrice">Стоимость доставки, ₽</label><input class="input-plain" id="set-deliveryPrice" inputmode="numeric" data-act="admin-setting" data-key="deliveryPrice" value="${s.deliveryPrice}"></div>
      <div class="field"><label for="set-freeFrom">Бесплатная доставка от, ₽</label><input class="input-plain" id="set-freeFrom" inputmode="numeric" data-act="admin-setting" data-key="freeFrom" value="${s.freeFrom}"></div>
      <div class="field"><label for="set-minOrder">Минимальная сумма заказа, ₽</label><input class="input-plain" id="set-minOrder" inputmode="numeric" data-act="admin-setting" data-key="minOrder" value="${s.minOrder}"></div>
      <div class="field"><label for="set-prepTime">Время приготовления</label><input class="input-plain" id="set-prepTime" data-act="admin-setting" data-key="prepTime" value="${s.prepTime}"></div>
      <button class="switch-row" role="switch" aria-checked="${!!s.autoAccept}" data-act="admin-toggle" data-key="autoAccept">
        <span>Автоподтверждение заказов</span><span class="opt-toggle ${s.autoAccept?'is-on':''}" aria-hidden="true"></span>
      </button>
      <button class="switch-row" role="switch" aria-checked="${!!s.sound}" data-act="admin-toggle" data-key="sound">
        <span>Звук нового заказа</span><span class="opt-toggle ${s.sound?'is-on':''}" aria-hidden="true"></span>
      </button>
      <button class="a-btn primary" style="margin-top:var(--sp-8)" data-act="admin-save">Сохранить</button>
    </div>

    <div>
      <div class="a-panel" style="margin-bottom:var(--sp-16)">
        <h2>Точки ресторана</h2>
        <p class="a-lead-sm">Новая точка сразу появляется в самовывозе, на экране «О ресторане» и в списке для печати QR-меню.</p>
        ${LOCATIONS.map(loc => `
          <div class="sum-row" style="align-items:flex-start">
            <div>
              <div style="font-weight:600">${esc(loc.name)}</div>
              <div class="muted" style="font-size:var(--fs-12)">${esc(loc.address)} · ${loc.hours}</div>
              <div class="a-pill ${loc.service==='pickup'?'olive':'lime'}" style="margin-top:var(--sp-8)">${esc(loc.delivery)}</div>
            </div>
            <button class="a-btn" data-act="admin-location-edit" data-id="${loc.id}" aria-label="Изменить ${esc(loc.name)}">${icon('edit')}</button>
          </div>`).join('')}
        <div id="locationForm" class="a-subform">
          <h3>${l.id ? 'Изменить точку' : '+ Добавить точку'}</h3>
          <div class="field"><label for="location-name">Название</label><input class="input-plain" id="location-name" data-act="admin-location-draft" data-field="name" placeholder="Васаби на Ленина" value="${esc(l.name)}"></div>
          <div class="field"><label for="location-address">Адрес</label><input class="input-plain" id="location-address" data-act="admin-location-draft" data-field="address" placeholder="Город, улица, дом" value="${esc(l.address)}"></div>
          <div class="a-grid a-grid-2" style="gap:var(--sp-10)">
            <div class="field"><label for="location-open">Открытие</label><input class="input-plain" id="location-open" type="time" data-act="admin-location-draft" data-field="open" value="${l.open}"></div>
            <div class="field"><label for="location-close">Закрытие</label><input class="input-plain" id="location-close" type="time" data-act="admin-location-draft" data-field="close" value="${l.close}"></div>
          </div>
          <div class="field"><label for="location-service">Как работает точка</label><select class="input-plain" id="location-service" data-act="admin-location-draft" data-field="service"><option value="delivery" ${l.service==='delivery'?'selected':''}>Доставка и самовывоз</option><option value="pickup" ${l.service==='pickup'?'selected':''}>Только самовывоз</option></select></div>
          <div class="a-row"><button class="a-btn primary" data-act="admin-location-save">${l.id ? 'Сохранить точку' : 'Добавить точку'}</button>${l.id ? '<button class="a-btn" data-act="admin-location-cancel">Отмена</button>' : ''}</div>
        </div>
      </div>
      <div class="a-panel">
        <h2>Сотрудники и роли</h2>
        <p class="a-lead-sm">Выберите роль у человека или добавьте нового. Войти в демо-панель: приложение гостя → «Профиль» → «Доступ сотрудника».</p>
        ${ADMIN_STAFF.map(person => `
          <div class="sum-row a-staff-row">
            <div><div style="font-weight:600">${esc(person.name)}</div><div class="muted" style="font-size:var(--fs-12)">${esc(person.phone)}</div><div class="muted" style="font-size:var(--fs-12);margin-top:var(--sp-4)">${esc(STAFF_ROLES[person.role].description)}</div></div>
            <label class="a-role-select"><span class="sr-only">Роль сотрудника ${esc(person.name)}</span><select class="input-plain" data-act="admin-staff-role" data-id="${person.id}">${Object.entries(STAFF_ROLES).map(([id,r]) => `<option value="${id}" ${person.role===id?'selected':''}>${r.label}</option>`).join('')}</select></label>
          </div>`).join('')}
        <div id="staffForm" class="a-subform">
          <h3>+ Добавить сотрудника</h3>
          <div class="a-grid a-grid-2" style="gap:var(--sp-10)">
            <div class="field"><label for="staff-name">Имя</label><input class="input-plain" id="staff-name" data-act="admin-staff-draft" data-field="name" autocomplete="off" value="${esc(admin.staffDraft.name)}"></div>
            <div class="field"><label for="staff-phone">Телефон</label><input class="input-plain" id="staff-phone" type="tel" data-act="admin-staff-draft" data-field="phone" autocomplete="off" placeholder="+7 900 000-00-00" value="${esc(admin.staffDraft.phone)}"></div>
          </div>
          <div class="field"><label for="staff-role">Роль</label><select class="input-plain" id="staff-role" data-act="admin-staff-draft" data-field="role">${Object.entries(STAFF_ROLES).map(([id,r]) => `<option value="${id}" ${admin.staffDraft.role===id?'selected':''}>${r.label}</option>`).join('')}</select></div>
          <button class="a-btn primary" data-act="admin-staff-add">Добавить в демо-список</button>
          <p class="a-form-note">Прототип не отправляет SMS и не создаёт пароль. Роль здесь показывает обязанности, но не ограничивает кнопки: для настоящих приглашений и прав нужен сервер.</p>
        </div>
      </div>
    </div>
  </div>`;
}

/* -------------------------------- QR-меню -------------------------------- */

function qrTableList(){
  const from = Math.min(60, Math.max(1, parseInt(admin.qr.from, 10) || 1));
  const to = Math.min(60, Math.max(from, parseInt(admin.qr.to, 10) || from));
  return Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
}

function adminQr(){
  const q = admin.qr;
  const loc = locById(q.locId);
  const tables = qrTableList();
  const url = menuUrl(tables[0], loc.id);
  const m = QR.matrix(url, q.ec);
  const hosted = /^https?:$/.test(location.protocol);
  return `
  <div class="a-grid a-grid-2">
    <div class="a-panel">
      <h2>Параметры листов</h2>
      <div class="field">
        <label for="qr-locId">Точка ресторана</label>
        <select class="input-plain" id="qr-locId" data-act="admin-qr-field" data-key="locId">
          ${LOCATIONS.map(l => `<option value="${l.id}" ${l.id===q.locId?'selected':''}>${l.name}</option>`).join('')}
        </select>
      </div>
      <div class="a-grid a-grid-2">
        <div class="field"><label for="qr-from">Столы с</label><input class="input-plain" id="qr-from" type="number" min="1" max="60" inputmode="numeric" data-act="admin-qr-field" data-key="from" value="${q.from}"></div>
        <div class="field"><label for="qr-to">по</label><input class="input-plain" id="qr-to" type="number" min="1" max="60" inputmode="numeric" data-act="admin-qr-field" data-key="to" value="${q.to}"></div>
      </div>
      <div class="field">
        <label for="qr-ec">Защита кода от повреждений</label>
        <select class="input-plain" id="qr-ec" data-act="admin-qr-field" data-key="ec">
          <option value="L" ${q.ec==='L'?'selected':''}>L — максимум данных, нужен чистый печать</option>
          <option value="M" ${q.ec==='M'?'selected':''}>M — стандарт: читается с потёртостью и пятнами</option>
        </select>
      </div>
      <div class="field">
        <span class="field-caption">Ссылка, которую открывает камера</span>
        <div class="qr-url">
          <code>${url}</code>
          <button class="a-btn" data-act="admin-qr-copy" data-url="${url}">${icon('doc')} Копировать</button>
        </div>
      </div>
      <p class="muted small">${hosted
        ? 'Прототип открыт по HTTP: коды ведут на этот адрес, их можно распечатать и проверить телефоном прямо сейчас.'
        : 'Прототип открыт локально, поэтому в коде демо-домен. После выкладки на хостинг код сам начнёт вести на реальный адрес страницы — перепечатывать листы не нужно.'}</p>
    </div>

    <div class="a-panel">
      <h2>Предпросмотр · стол ${tables[0]}</h2>
      <div class="qr-tile">${QR.svg(url, { ec:q.ec, px:5, margin:3, dark:'#080B08', light:'#FFFFFF' })}</div>
      <div class="muted small" style="margin-top:var(--sp-10)">
        Версия ${m.version} · ${m.size}×${m.size} модулей · уровень ${m.ec} · маска ${m.mask}
      </div>
      <div class="a-row" style="margin-top:var(--sp-14)">
        <button class="a-btn primary" data-act="admin-qr-png" data-no="${tables[0]}" data-loc="${loc.id}">${icon('doc')} Скачать PNG</button>
        <button class="a-btn" data-act="admin-qr-print" data-loc="${loc.id}" data-count="${tables.length}">${icon('printer')} Печать ${tables.length} ${plural(tables.length,'листа','листов','листов')}</button>
      </div>
    </div>
  </div>

  <div class="a-panel" style="margin-top:var(--sp-16)">
    <div class="a-row between" style="margin-bottom:var(--sp-10)">
      <h2>Столы точки «${loc.name}»</h2>
      <button class="a-btn" data-act="admin-qr-print" data-loc="${loc.id}" data-count="${tables.length}">${icon('printer')} Печать всех листов</button>
    </div>
    <table class="a-table a-table-qr">
      <thead><tr><th scope="col">Стол</th><th scope="col">QR</th><th scope="col">Адрес меню</th><th scope="col"><span class="sr-only">Действия</span></th></tr></thead>
      <tbody>
        ${tables.map(no => {
          const u = menuUrl(no, loc.id);
          return `
          <tr>
            <td><b>№ ${no}</b></td>
            <td><span class="qr-mini">${QR.svg(u, { ec:q.ec, px:1.6, margin:2 })}</span></td>
            <td class="muted" style="font-size:var(--fs-12)">${u}</td>
            <td>
              <div class="a-row">
                <button class="a-btn" data-act="admin-qr-png" data-no="${no}" data-loc="${loc.id}">PNG</button>
                <button class="a-btn" data-act="admin-qr-open" data-no="${no}" data-loc="${loc.id}">Открыть меню</button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    <div class="a-cards">
      ${tables.map(no => {
        const u = menuUrl(no, loc.id);
        return `
        <article class="a-card a-card-col">
          <div class="a-card-body">
            <div class="a-card-title"><b>№ ${no}</b></div>
            <div class="a-row" style="align-items:center;gap:var(--sp-12)">
              <span class="qr-mini">${QR.svg(u, { ec:q.ec, px:1.6, margin:2 })}</span>
              <span class="muted" style="font-size:var(--fs-12);word-break:break-all">${u}</span>
            </div>
            <div class="a-row">
              <button class="a-btn" data-act="admin-qr-png" data-no="${no}" data-loc="${loc.id}">PNG</button>
              <button class="a-btn" data-act="admin-qr-open" data-no="${no}" data-loc="${loc.id}">Открыть меню</button>
            </div>
          </div>
        </article>`;
      }).join('')}
    </div>
    <p class="muted small" style="margin-top:var(--sp-12)">
      Листы печатаются по 4 на странице A4: номер стола крупно, меню открывается камерой — приложение ставить не нужно.
      Гость видит тот же стоп-лист, что и зал: снятое блюдо исчезает из меню сразу.
    </p>
  </div>`;
}

/* ------------------------------ печать и PNG ------------------------------ */

function printQrSheets(locId, nos, ec){
  const loc = locById(locId);
  let root = document.getElementById('qrPrintRoot');
  if (!root){
    document.body.insertAdjacentHTML('beforeend', '<div class="qr-print-root" id="qrPrintRoot"></div>');
    root = document.getElementById('qrPrintRoot');
  }
  const pages = [];
  for (let i = 0; i < nos.length; i += 4) pages.push(nos.slice(i, i + 4));
  root.innerHTML = pages.map(list => `
    <div class="qr-print-page">
      ${list.map(no => `
        <div class="qr-print-card">
          <div class="qc-top">
            <span class="qc-brand">васаби.</span>
            <span class="qc-table">Стол ${no}</span>
          </div>
          <div class="qc-qr">${QR.svg(menuUrl(no, locId), { ec, px:5, margin:3, dark:'#000000', light:'#FFFFFF' })}</div>
          <div class="qc-body">
            <div class="qc-hint">Наведите камеру телефона — меню откроется, заказ принесём к этому столу.</div>
            <div class="qc-loc">${loc.name} · ${loc.address}<br>${loc.hours} · ${BRAND.phone}</div>
          </div>
        </div>`).join('')}
    </div>`).join('');
  window.print();
}

function downloadQrPng(no, locId, ec){
  const url = menuUrl(no, locId);
  const a = document.createElement('a');
  a.href = QR.png(url, { ec, scale: 12, margin: 4 });
  a.download = `qr-menu-stol-${no}.png`;
  a.click();
}

function copyText(text){
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(() => toast('Ссылка скопирована'), () => toast(text));
    return;
  }
  toast(text);
}

/* ------------------------------ обработчики ------------------------------ */

document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (!act.startsWith('admin')) return;

  if (act === 'admin-section'){ admin.section = el.dataset.section; renderAdmin(); }
  if (act === 'admin-tab'){ admin.tab = el.dataset.tab; renderAdmin(); }
  if (act === 'admin-filter-toggle'){
    const section = el.dataset.section;
    admin.fOpen[section] = !admin.fOpen[section];
    const panel = document.getElementById('fPanel-' + section);
    if (panel) panel.hidden = !admin.fOpen[section];
    el.setAttribute('aria-expanded', String(admin.fOpen[section]));
    return;
  }
  if (act === 'admin-filter-value'){
    const section = el.dataset.section;
    const group = el.dataset.group;
    const value = el.dataset.value;
    const list = admin.f[section][group] || [];
    const i = list.indexOf(value);
    if (i >= 0) list.splice(i, 1); else list.push(value);
    admin.f[section][group] = list;
    renderFilterList(section);
    syncFilterChips(section);
    updateFilterMeta(section);
    return;
  }
  if (act === 'admin-filter-remove'){
    const section = el.dataset.section;
    const group = el.dataset.group;
    const value = el.dataset.value;
    const g = FILTER_DEFS[section].groups.find(x => x.key === group);
    if (g && g.kind === 'sum'){
      admin.f[section][g.minKey] = '';
      admin.f[section][g.maxKey] = '';
    } else if (g && g.kind === 'select'){
      admin.f[section][group] = '';
    } else {
      const list = admin.f[section][group] || [];
      const i = list.indexOf(value);
      if (i >= 0) list.splice(i, 1);
    }
    renderFilterList(section);
    syncFilterChips(section);
    updateFilterMeta(section);
    focusFilterToggle(section);
    return;
  }
  if (act === 'admin-filter-reset'){
    const section = el.dataset.section;
    resetSectionFilters(section);
    renderFilterList(section);
    syncFilterChips(section);
    updateFilterMeta(section);
    focusFilterToggle(section);
    return;
  }
  if (act === 'admin-orders-csv'){
    const list = sortedFilterItems('orders');
    if (!list.length){ toast('Нет заказов для выгрузки'); return; }
    const now = new Date();
    const stamp = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    downloadTextFile('wasabi-zakazy-' + stamp + '.csv', ordersCsvText(list));
    toast('Выгружено заказов: ' + list.length + ' — файл откроется в Excel');
    return;
  }
  if (act === 'admin-toast'){ toast(el.dataset.msg); }
  if (act === 'admin-qr-copy'){ copyText(el.dataset.url); }
  if (act === 'admin-qr-png'){
    downloadQrPng(el.dataset.no, el.dataset.loc, admin.qr.ec);
    toast('PNG сохранён: стол ' + el.dataset.no);
  }
  if (act === 'admin-qr-print'){
    const nos = qrTableList();
    printQrSheets(el.dataset.loc, nos, admin.qr.ec);
    toast('Диалог печати: ' + nos.length + ' ' + plural(nos.length,'лист','листа','листов'));
  }
  if (act === 'admin-qr-open'){
    openTableMenu({ no: el.dataset.no, locId: el.dataset.loc });
    switchMode('client');
  }
  if (act === 'admin-order-status'){
    const o = state.orders.find(x => x.id === el.dataset.id);
    if (o && !DEAD_STATUSES.includes(o.status)){ setOrderStatus(o, el.dataset.to); renderAdmin(); toast('Заказ №' + o.no + ' → ' + statusLabel(o)); render(); }
  }
  if (act === 'admin-reject-open'){ admin.rejectFor = el.dataset.id; renderAdmin(); }
  if (act === 'admin-reject-cancel'){ admin.rejectFor = null; renderAdmin(); }
  if (act === 'admin-reject'){
    const o = state.orders.find(x => x.id === el.dataset.id);
    if (o){
      setOrderStatus(o, 'rejected');
      o.rejectReason = el.dataset.reason;
      admin.rejectFor = null;
      renderAdmin();
      toast('Заказ №' + o.no + ' отклонён: ' + el.dataset.reason);
      render();
    }
  }
  if (act === 'admin-featured'){
    const d = dishById(el.dataset.id);
    if (!d) return;
    if (!d.popular && DISHES.filter(x => x.popular).length >= RULES.featuredMax){
      toast('В ленте главной уже ' + RULES.featuredMax + ' блюд — снимите одно, чтобы поставить другое');
      return;
    }
    d.popular = !d.popular;
    renderAdmin();
    render();
    toast(d.popular ? d.name + ' — теперь в ленте «Попробуйте любимое»' : d.name + ' — убран с главной');
  }
  if (act === 'admin-stoplist'){
    const d = dishById(el.dataset.id);
    if (!d) return;
    d.available = !dishAvailable(d);
    renderAdmin();
    render();
    toast(d.available ? d.name + ' — снова в меню' : d.name + ' — стоп-лист, гости не видят блюдо');
  }
  if (act === 'admin-dish-details'){
    const id = el.dataset.id;
    const i = admin.dishOpen.indexOf(id);
    if (i >= 0) admin.dishOpen.splice(i, 1); else admin.dishOpen.push(id);
    renderAdmin();
    if (i < 0){
      const det = document.querySelector('[data-details-for="' + id + '"]');
      if (det) det.scrollIntoView({ block:'nearest', behavior:'smooth' });
    }
  }
  if (act === 'admin-dish-badge'){
    admin.dishDraft.badge = el.dataset.badge || '';
    const input = document.getElementById('dish-badge');
    if (input) input.value = admin.dishDraft.badge;
    syncDishBadgePresets();
    return;
  }
  if (act === 'admin-dish-popular'){
    admin.dishDraft.popular = !admin.dishDraft.popular;
    renderAdmin();
  }
  if (act === 'admin-dish-edit'){
    const d = dishById(el.dataset.id);
    if (!d) return;
    admin.dishDraft = {
      id:d.id, name:d.name, cat:d.cat, price:d.price, salePercent:d.salePercent || 0, unit:d.unit || '',
      badge:d.badge || '', desc:d.desc || '', composition:d.composition || '',
      allergens:(d.allergens || []).join(', '), img:d.img, defaultImg:d.img, popular:!!d.popular
    };
    renderAdmin();
    const form = document.getElementById('dishForm');
    if (form) form.scrollIntoView({ block:'start', behavior:'smooth' });
    const nameEl = document.getElementById('dish-name');
    if (nameEl) nameEl.focus({ preventScroll:true });
  }
  if (act === 'admin-dish-cancel'){
    admin.dishDraft = emptyDishDraft();
    renderAdmin();
  }
  if (act === 'admin-dish-new'){
    admin.dishDraft = emptyDishDraft();
    renderAdmin();
    const form = document.getElementById('dishForm');
    if (form) form.scrollIntoView({ block:'start', behavior:'smooth' });
    const nameEl = document.getElementById('dish-name');
    if (nameEl) nameEl.focus({ preventScroll:true });
  }
  if (act === 'admin-dish-stock'){
    admin.dishDraft.img = el.dataset.img;
    renderAdmin();
  }
  if (act === 'admin-dish-photo-reset'){
    admin.dishDraft.img = admin.dishDraft.defaultImg || 'assets/philadelphia.jpg';
    renderAdmin();
  }
  if (act === 'admin-dish-save'){
    const dr = readDraftFields('dishForm', 'admin-dish-draft', admin.dishDraft);
    const name = (dr.name || '').trim();
    const price = Number(dr.price);
    const salePercent = Number(dr.salePercent) || 0;
    if (!name){ toast('Введите название блюда'); return; }
    if (!isFinite(price) || price <= 0){ toast('Укажите цену больше нуля'); return; }
    if (salePercent < 0 || salePercent > 90){ toast('Скидка блюда — от 0 до 90%'); return; }
    if (dr.popular && DISHES.filter(x => x.popular && x.id !== dr.id).length >= RULES.featuredMax){
      toast('В ленте главной уже ' + RULES.featuredMax + ' блюд — снимите одно, чтобы поставить другое');
      return;
    }
    const allergens = (dr.allergens || '').split(',').map(s => s.trim()).filter(Boolean);
    const unit = (dr.unit || '').trim() || '1 порция';
    const existing = dishById(dr.id);
    if (existing){
      existing.name = name;
      existing.price = price;
      existing.salePercent = salePercent;
      existing.cat = dr.cat;
      existing.unit = unit;
      existing.badge = (dr.badge || '').trim();
      existing.desc = (dr.desc || '').trim();
      existing.composition = (dr.composition || '').trim();
      existing.allergens = allergens;
      existing.img = dr.img;
      existing.popular = dr.popular;
      admin.dishDraft = emptyDishDraft();
      renderAdmin();
      render();
      toast('Блюдо «' + name + '» сохранено — гость видит изменения сразу');
      return;
    }
    DISHES.push({
      id:'d-' + Date.now().toString(36),
      name, price, salePercent, cat:dr.cat, popular:dr.popular,
      unit, img:dr.img,
      badge:(dr.badge || '').trim(),
      desc:(dr.desc || '').trim() || 'Новая позиция в меню «васаби.».',
      note:'Готовим специально для вас. Только после заказа — свой соус, свежий имбирь и настоящий васаби.',
      composition:(dr.composition || '').trim(),
      allergens, pairs:[], available:true, modifiers:[]
    });
    admin.dishDraft = emptyDishDraft();
    renderAdmin();
    render();
    toast('Блюдо «' + name + '» добавлено в меню — гость видит его сразу');
  }
  if (act === 'admin-banner-edit'){
    const b = BANNERS.find(x => x.id === el.dataset.banner);
    if (!b) return;
    admin.bannerDraft = {
      id:b.id, kind:b.kind, tag:b.tag || '', title:b.title || '', sub:b.sub || '', cta:b.cta || '',
      img:b.img, defaultImg:DISH_IMAGES.includes(b.img) ? b.img : 'assets/sashimi.jpg',
      code:b.code || '', dish:b.dish || 'd-set-w', screen:b.screen || 'profile'
    };
    renderAdmin();
    const form = document.getElementById('bannerForm');
    if (form) form.scrollIntoView({ block:'start', behavior:'smooth' });
    const title = document.getElementById('banner-title');
    if (title) title.focus({ preventScroll:true });
  }
  if (act === 'admin-banner-cancel'){
    admin.bannerDraft = emptyBannerDraft();
    renderAdmin();
  }
  if (act === 'admin-banner-stock'){
    admin.bannerDraft.img = el.dataset.img;
    renderAdmin();
  }
  if (act === 'admin-banner-photo-reset'){
    admin.bannerDraft.img = admin.bannerDraft.defaultImg || 'assets/sashimi.jpg';
    renderAdmin();
  }
  if (act === 'admin-location-edit'){
    const loc = LOCATIONS.find(x => x.id === el.dataset.id);
    if (!loc) return;
    admin.locationDraft = { id:loc.id, name:loc.name, address:loc.address, open:loc.open, close:loc.close, service:loc.service || 'delivery' };
    renderAdmin();
    const input = document.getElementById('location-name');
    if (input){ input.scrollIntoView({ block:'center', behavior:'smooth' }); input.focus({ preventScroll:true }); }
  }
  if (act === 'admin-location-cancel'){
    admin.locationDraft = emptyLocationDraft();
    renderAdmin();
  }
  if (act === 'admin-location-save'){
    const dr = readDraftFields('locationForm', 'admin-location-draft', admin.locationDraft);
    const name = (dr.name || '').trim();
    const address = (dr.address || '').trim();
    if (!name || !address){ toast('Укажите название и адрес точки'); return; }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(dr.open) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(dr.close) || hm(dr.close) <= hm(dr.open)){
      toast('Время закрытия должно быть позже открытия'); return;
    }
    const value = {
      name, address, open:dr.open, close:dr.close, service:dr.service,
      hours:dr.open + ' — ' + dr.close,
      delivery:dr.service === 'pickup' ? 'Самовывоз от 20 мин' : 'Доставка от ' + fmt(RULES.deliveryPrice)
    };
    const existing = LOCATIONS.find(x => x.id === dr.id);
    if (existing) Object.assign(existing, value);
    else LOCATIONS.push({ id:'l-' + Date.now().toString(36), ...value });
    admin.locationDraft = emptyLocationDraft();
    renderAdmin();
    render();
    toast(existing ? 'Точка сохранена — гость видит изменения' : 'Точка добавлена в самовывоз и QR-меню');
  }
  if (act === 'admin-staff-add'){
    const dr = readDraftFields('staffForm', 'admin-staff-draft', admin.staffDraft);
    const name = (dr.name || '').trim();
    const phone = normPhone(dr.phone);
    if (!name){ toast('Введите имя сотрудника'); return; }
    if (phone.length !== 11){ toast('Проверьте телефон сотрудника'); return; }
    if (ADMIN_STAFF.some(s => normPhone(s.phone) === phone)){ toast('Сотрудник с таким телефоном уже есть'); return; }
    ADMIN_STAFF.push({ id:'s-' + Date.now().toString(36), name, phone:formatPhone(phone), role:STAFF_ROLES[dr.role] ? dr.role : 'operator' });
    admin.staffDraft = { name:'', phone:'', role:'operator' };
    renderAdmin();
    render();
    toast(name + ' добавлен — можно выбрать его в «Профиле» → «Доступ сотрудника»');
  }
  if (act === 'admin-banner-create'){
    const dr = readDraftFields('bannerForm', 'admin-banner-draft', admin.bannerDraft);
    const title = (dr.title || '').trim();
    if (!title){ toast('Введите заголовок акции'); return; }
    let link = {};
    if (dr.kind === 'promo'){
      const p = PROMOS.find(x => x.code === dr.code);
      if (!p){ toast('Выберите промокод для акции'); return; }
      if (!p.active){ toast('Промокод ' + p.code + ' выключен — гостю нечего будет применять'); return; }
      link.code = p.code;
    } else if (dr.kind === 'dish'){
      const d = dishById(dr.dish);
      if (!d){ toast('Выберите блюдо для акции'); return; }
      link.dish = d.id;
    } else {
      if (!SCREENS[dr.screen]){ toast('Выберите экран приложения'); return; }
      link.screen = dr.screen;
    }
    const value = {
      kind:dr.kind,
      tag:(dr.tag || '').trim() || 'Акция',
      img:dr.img,
      title,
      sub:(dr.sub || '').trim(),
      cta:(dr.cta || '').trim() || (dr.kind === 'dish' ? 'Открыть блюдо' : (dr.kind === 'promo' ? 'Применить код' : 'Открыть')),
      ...link
    };
    const existing = BANNERS.find(x => x.id === dr.id);
    if (existing){
      delete existing.code; delete existing.dish; delete existing.screen;
      Object.assign(existing, value);
    } else {
      BANNERS.push({ id:'b-' + Date.now().toString(36), active:true, ...value });
    }
    admin.bannerDraft = emptyBannerDraft();
    renderAdmin();
    render();
    toast(existing ? 'Акция «' + title + '» сохранена' : 'Акция «' + title + '» — уже в карусели на главной');
  }
  if (act === 'admin-push-send'){
    const dr = readDraftFields('pushForm', 'admin-push-draft', admin.pushDraft);
    const recipients = pushRecipients(dr.audience);
    if (!dr.title.trim()){ toast('Введите заголовок рассылки'); return; }
    if (!dr.text.trim()){ toast('Введите текст сообщения'); return; }
    if (!recipients.length){ toast('В выбранной аудитории нет гостей'); return; }
    let timing = 'сейчас · ' + nowRu();
    if (dr.when === 'later'){
      const at = new Date(dr.scheduleAt);
      if (!dr.scheduleAt || !isFinite(at.getTime()) || at.getTime() <= Date.now()){
        toast('Выберите дату и время в будущем'); return;
      }
      timing = 'на ' + at.toLocaleString('ru-RU', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' });
    }
    admin.pushLog.unshift({
      title:dr.title.trim(), text:dr.text.trim(),
      audience:pushAudienceLabel(dr.audience), audienceId:dr.audience,
      count:recipients.length, promo:dr.promo, timing
    });
    admin.pushDraft = { ...dr, title:'', text:'' };
    renderAdmin();
    toast('Демо-рассылка сохранена для ' + recipients.length + ' ' + plural(recipients.length,'гостя','гостей','гостей') + '. Реальные push не отправлялись');
    return;
  }
  if (act === 'admin-menu-template'){
    const blob = new Blob([MENU_CSV_TEMPLATE], { type:'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'wasabi-menu-template.csv'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Шаблон скачан: откройте в Excel, замените примеры и сохраните как CSV UTF-8');
    return;
  }
  if (act === 'admin-menu-import-check'){
    const parsed = parseMenuCsv(admin.menuImport.text);
    admin.menuImport.rows = parsed.rows;
    admin.menuImport.errors = parsed.errors;
    renderAdmin();
    if (!parsed.rows.length && !parsed.errors.length) toast('В данных нет блюд');
    else if (!parsed.rows.length) toast('Ни одна строка не разобрана — проверьте шаблон');
    else toast('Готово к импорту: ' + parsed.rows.length + ', ошибок: ' + parsed.errors.length);
    return;
  }
  if (act === 'admin-menu-import-apply'){
    const rows = admin.menuImport.rows || [];
    if (!rows.length){ toast('Сначала проверьте меню'); return; }
    let added = 0, updated = 0;
    rows.forEach(r => {
      const existing = DISHES.find(d => normDishName(d.name) === normDishName(r.name));
      if (existing){
        Object.assign(existing, {
          name:r.name, cat:r.cat, price:r.price, salePercent:r.salePercent,
          unit:r.unit, badge:r.badge, desc:r.desc, composition:r.composition,
          allergens:r.allergens, popular:r.popular
        });
        updated++;
        return;
      }
      DISHES.push({
        id:'d-import-' + Date.now().toString(36) + '-' + added,
        name:r.name, cat:r.cat, price:r.price, salePercent:r.salePercent,
        unit:r.unit, badge:r.badge, popular:r.popular,
        desc:r.desc || 'Новая позиция в меню «васаби.».',
        note:'Готовим специально для вас. Только после заказа — свой соус, свежий имбирь и настоящий васаби.',
        composition:r.composition, allergens:r.allergens, pairs:[], available:true, modifiers:[],
        img:MENU_DEMO_IMAGES[r.cat] || 'assets/philadelphia.jpg'
      });
      added++;
    });
    const errors = (admin.menuImport.errors || []).length;
    admin.menuImport = { text:admin.menuImport.text, rows:null, errors:null };
    renderAdmin();
    render();
    toast('Меню обновлено: добавлено ' + added + ', изменено ' + updated + (errors ? ', пропущено с ошибками ' + errors : ''));
    return;
  }
  if (act === 'admin-bonus-open'){
    const c = ADMIN_CLIENTS.find(x => x.phone === el.dataset.phone);
    if (!c) return;
    admin.bonusFor = bonusOpenFor(c) ? null : c;
    if (admin.bonusFor) admin.bonusAmount = 100;
    renderAdmin();
    if (admin.bonusFor) focusBonusAmount();
  }
  if (act === 'admin-bonus-quick'){
    admin.bonusAmount = Number(el.dataset.amount);
    renderAdmin();
    focusBonusAmount();
  }
  if (act === 'admin-bonus-cancel'){
    admin.bonusFor = null;
    renderAdmin();
  }
  if (act === 'admin-bonus-apply'){
    const c = ADMIN_CLIENTS.find(x => x.phone === el.dataset.phone);
    if (!c) return;
    const n = Math.round(Number(admin.bonusAmount) || 0);
    if (n <= 0){ toast('Введите количество баллов'); return; }
    addBonusEntry(c, n, 'Начисление рестораном');
    admin.bonusFor = null;
    renderAdmin();
    render();
    toast(c.name + ' — начислено ' + n + ' баллов');
  }
  if (act === 'admin-client-del'){
    const i = ADMIN_CLIENTS.findIndex(x => x.phone === el.dataset.phone);
    if (i < 0) return;
    const c = ADMIN_CLIENTS[i];
    if (!confirm('Удалить гостя ' + c.name + ' (' + c.phone + ') из базы?')) return;
    ADMIN_CLIENTS.splice(i, 1);
    if (admin.bonusFor && admin.bonusFor.phone === c.phone) admin.bonusFor = null;
    renderAdmin();
    toast('Гость удалён из базы');
  }
  if (act === 'admin-import-check'){
    const parsed = parseClientsCsv(admin.clientImport.text);
    admin.clientImport.rows = parsed.rows;
    admin.clientImport.errors = parsed.errors;
    admin.clientImport.skipped = parsed.skipped;
    renderAdmin();
    if (!parsed.rows.length && !parsed.errors.length) toast('В данных нет гостей');
    else if (!parsed.rows.length) toast('Ни одна строка не разобрана — проверьте формат');
    else toast('Разобрано гостей: ' + parsed.rows.filter(r => !r.duplicate).length + ', дубликатов: ' + parsed.rows.filter(r => r.duplicate).length);
  }
  if (act === 'admin-import-apply'){
    const rows = admin.clientImport.rows || [];
    if (!rows.length){ toast('Сначала проверьте файл'); return; }
    let added = 0, updated = 0;
    rows.forEach(r => {
      const exist = ADMIN_CLIENTS.find(c => normPhone(c.phone) === normPhone(r.phone));
      if (exist){
        /* CRM знает историю целиком — берём большее, чтобы ничего не потерять */
        exist.orders = Math.max(exist.orders, r.orders);
        exist.sum = Math.max(exist.sum, r.sum);
        exist.bonus = Math.max(exist.bonus, r.bonus);
        if (r.lastDate){
          if (!exist.lastDate || isoToTime(r.lastDate) > isoToTime(exist.lastDate)) exist.lastDate = r.lastDate;
          if (!exist.firstDate || (r.firstDate && isoToTime(r.firstDate) < isoToTime(exist.firstDate))) exist.firstDate = r.firstDate;
        }
        addClientSource(exist, 'CRM');
        updated++;
        return;
      }
      ADMIN_CLIENTS.push({
        name:r.name, phone:r.phone, orders:r.orders, sum:r.sum, bonus:r.bonus,
        segment:r.segment, last:'импорт из CRM', lastDate:r.lastDate || '', firstDate:r.firstDate || '',
        sources:['CRM']
      });
      added++;
    });
    admin.clientImport = { text:admin.clientImport.text, rows:null, errors:null, skipped:0 };
    renderAdmin();
    toast('Добавлено гостей: ' + added + ', история обновлена: ' + updated);
  }
  if (act === 'admin-new-order'){
    const d = dishById('d-sing');
    const order = {
      id:'o'+Date.now(), no: nextOrderNo(), ts: Date.now(), date: nowRu(), source:'test',
      items:[{ dishId:d.id, name:d.name, qty:1, price:dishPrice(d), mods:[] }],
      sub:dishPrice(d), delivery:RULES.deliveryPrice, discount:0, bonus:0, total:dishPrice(d) + RULES.deliveryPrice,
      status:'new', address:'Ташкентская 198', comment:'Домофон 42', payment:'card', promo:null,
      deliveryType:'delivery', locationId:'l1', addressId:'a1', slot:null,
      customer:'Гость с терминала', phone:'+7 926 640-08-31'
    };
    state.orders.unshift(order);
    recordClientOrder(order);
    admin.tab = 'new';
    renderAdmin();
    toast('Тестовый заказ создан — он появился в приложении гостя');
    render();
  }
  if (act === 'admin-toggle'){
    const k = el.dataset.key;
    admin.settings[k] = !admin.settings[k];
    if (k === 'bonusEnabled'){
      RULES.bonusEnabled = admin.settings[k];
      state.bonusUse = 0;
    }
    renderAdmin();
    render();
  }
  if (act === 'admin-save'){
    renderAdmin();
    render();
    toast('Настройки сохранены — приложение гостя обновлено');
  }
  if (act === 'admin-promo-create'){
    const code = admin.promoDraft.code.trim().toUpperCase();
    if (!code){ toast('Введите код промокода'); return; }
    if (PROMOS.some(p => p.code === code)){ toast('Промокод ' + code + ' уже есть'); return; }
    const type = admin.promoDraft.type;
    const value = type === 'delivery' ? 0 : Number(admin.promoDraft.value);
    const min = Math.max(0, Number(admin.promoDraft.min) || 0);
    if (type === 'percent' && (!isFinite(value) || value < 1 || value > 90)){ toast('Процент скидки — от 1 до 90'); return; }
    if (type === 'fixed' && (!isFinite(value) || value <= 0)){ toast('Укажите скидку больше нуля'); return; }
    PROMOS.push({
      code, type, value, min, active: true,
      label: type === 'percent' ? `−${value}% на заказ`
           : (type === 'fixed' ? `−${fmt(value)}` : 'Бесплатная доставка')
    });
    admin.promoDraft.code = '';
    renderAdmin();
    render();
    toast('Промокод ' + code + ' создан — он в списке акций у гостя');
  }
  if (act === 'admin-promo-toggle'){
    const p = PROMOS.find(x => x.code === el.dataset.code);
    if (!p) return;
    p.active = !p.active;
    if (!p.active && state.promo === p.code){ state.promo = null; state.promoMsg = ''; }
    renderAdmin();
    render();
    toast('Промокод ' + p.code + (p.active ? ' включён' : ' отключён'));
  }
  if (act === 'admin-banner-toggle'){
    const b = BANNERS.find(x => x.id === el.dataset.banner);
    if (!b) return;
    b.active = !b.active;
    renderAdmin();
    render();
    toast(b.active ? 'Акция видна гостю на главной' : 'Акция скрыта с главной');
  }
  if (act === 'admin-banner-move'){
    const i = BANNERS.findIndex(x => x.id === el.dataset.banner);
    const j = i + Number(el.dataset.dir);
    if (i < 0 || j < 0 || j >= BANNERS.length) return;
    [BANNERS[i], BANNERS[j]] = [BANNERS[j], BANNERS[i]];
    renderAdmin();
    render();
    toast('Порядок карусели обновлён');
  }
});

document.addEventListener('input', ev => {
  const el = ev.target;
  if (!el.dataset) return;
  if (el.dataset.act === 'admin-draft'){ admin.promoDraft[el.dataset.field] = el.value; }
  if (el.dataset.act === 'admin-dish-draft'){
    admin.dishDraft[el.dataset.field] = el.value;
    if (el.id === 'dish-badge') syncDishBadgePresets();
  }
  if (el.dataset.act === 'admin-banner-draft'){ admin.bannerDraft[el.dataset.field] = el.value; }
  if (el.dataset.act === 'admin-location-draft'){ admin.locationDraft[el.dataset.field] = el.value; }
  if (el.dataset.act === 'admin-staff-draft'){ admin.staffDraft[el.dataset.field] = el.value; }
  if (el.dataset.act === 'admin-bonus-amount'){ admin.bonusAmount = el.value; }
  if (el.dataset.act === 'admin-filter-search'){
    const section = el.dataset.section;
    admin.f[section].query = el.value;
    renderFilterList(section);
    syncFilterChips(section);
    updateFilterMeta(section);
  }
  if (el.dataset.act === 'admin-filter-num'){
    const section = el.dataset.section;
    admin.f[section][el.dataset.key] = el.value;
    renderFilterList(section);
    syncFilterChips(section);
    updateFilterMeta(section);
  }
  if (el.dataset.act === 'admin-import-text'){
    admin.clientImport.text = el.value;
    admin.clientImport.rows = null;
    admin.clientImport.errors = null;
    /* разбор устарел — убираем кнопку импорта и таблицу, не трогая само поле */
    const apply = document.getElementById('importApply');
    const prev = document.getElementById('importPreview');
    if (apply) apply.remove();
    if (prev) prev.remove();
  }
  if (el.dataset.act === 'admin-menu-import-text'){
    admin.menuImport.text = el.value;
    admin.menuImport.rows = null;
    admin.menuImport.errors = null;
    const apply = document.getElementById('menuImportApply');
    const prev = document.getElementById('menuImportPreview');
    if (apply) apply.remove();
    if (prev) prev.remove();
  }
  if (el.dataset.act === 'admin-push-draft'){
    admin.pushDraft[el.dataset.field] = el.value;
    updatePushPreview();
  }
  if (el.dataset.act === 'admin-setting'){
    admin.settings[el.dataset.key] = el.value;
    const n = parseFloat(el.value);
    if (!isNaN(n)){
      if (el.dataset.key === 'deliveryPrice') RULES.deliveryPrice = n;
      if (el.dataset.key === 'freeFrom') RULES.freeDeliveryFrom = n;
      if (el.dataset.key === 'minOrder') RULES.minOrder = n;
      if (el.dataset.key === 'bonusPercent') RULES.bonusAccrual = Math.min(50, Math.max(0, n));
      if (el.dataset.key === 'bonusMaxPay') RULES.bonusMaxPay = Math.min(100, Math.max(0, n));
      if (el.dataset.key === 'bonusExpiryMonths') RULES.bonusExpiryMonths = Math.min(60, Math.max(0, Math.round(n)));
      if (el.dataset.key === 'bonusPercent' || el.dataset.key === 'bonusMaxPay' || el.dataset.key === 'bonusExpiryMonths') syncBonusExample();
    }
    if (el.dataset.key === 'prepTime') RULES.prepTime = el.value;
  }
});

document.addEventListener('change', ev => {
  const el = ev.target;
  if (!el.dataset) return;
  if (el.dataset.act === 'admin-filter-sort'){
    const section = el.dataset.section;
    admin.f[section].sort = el.value;
    renderFilterList(section);
    return;
  }
  if (el.dataset.act === 'admin-filter-set'){
    const section = el.dataset.section;
    admin.f[section][el.dataset.group] = el.value;
    renderFilterList(section);
    syncFilterChips(section);
    updateFilterMeta(section);
    return;
  }
  if (el.dataset.act === 'admin-setting' && ['bonusPercent','bonusMaxPay','bonusExpiryMonths'].includes(el.dataset.key)){
    const key = el.dataset.key;
    const max = key === 'bonusPercent' ? 50 : (key === 'bonusMaxPay' ? 100 : 60);
    const value = Math.min(max, Math.max(0, Math.round(Number(el.value) || 0)));
    admin.settings[key] = value;
    RULES[key === 'bonusPercent' ? 'bonusAccrual' : (key === 'bonusMaxPay' ? 'bonusMaxPay' : 'bonusExpiryMonths')] = value;
    state.bonusUse = 0;
    renderAdmin();
    render();
    return;
  }
  if (el.dataset.act === 'admin-qr-field'){
    admin.qr[el.dataset.key] = el.value;
    renderAdmin();
    return;
  }
  if (el.dataset.act === 'admin-draft' && el.dataset.field === 'type'){
    renderAdmin();
    return;
  }
  if (el.dataset.act === 'admin-push-draft'){
    admin.pushDraft[el.dataset.field] = el.value;
    if (['audience','promo','when'].includes(el.dataset.field)) renderAdmin();
    else updatePushPreview();
    return;
  }
  if (el.dataset.act === 'admin-staff-role'){
    const person = ADMIN_STAFF.find(s => s.id === el.dataset.id);
    if (!person || !STAFF_ROLES[el.value]) return;
    person.role = el.value;
    renderAdmin();
    render();
    toast(person.name + ' — роль: ' + roleLabel(person.role) + ' (демо, без ограничения прав)');
    return;
  }
  if (el.dataset.act === 'admin-banner-draft'){
    admin.bannerDraft[el.dataset.field] = el.value;
    /* смена типа акции меняет набор полей и подпись кнопки — перерисовываем панель */
    if (el.dataset.field === 'kind'){
      admin.bannerDraft.cta = el.value === 'dish' ? 'Открыть блюдо' : (el.value === 'promo' ? 'Применить код' : 'Открыть');
      renderAdmin();
    }
    if (el.dataset.field === 'code'){
      const p = PROMOS.find(x => x.code === el.value);
      if (p) admin.bannerDraft.tag = p.type === 'percent' ? '−' + p.value + '%' : (p.type === 'fixed' ? '−' + fmt(p.value) : 'Доставка 0 ₽');
      renderAdmin();
    }
    return;
  }
  if (el.dataset.act === 'admin-menu-import-file'){
    const file = el.files && el.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      admin.menuImport.text = String(reader.result || '');
      admin.menuImport.rows = null;
      admin.menuImport.errors = null;
      renderAdmin();
      toast('Файл прочитан: ' + file.name + ' — нажмите «Проверить меню»');
    };
    reader.readAsText(file, 'utf-8');
    return;
  }
  if (el.dataset.act === 'admin-import-file'){
    const file = el.files && el.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      admin.clientImport.text = String(reader.result || '');
      admin.clientImport.rows = null;
      admin.clientImport.errors = null;
      renderAdmin();
      toast('Файл прочитан: ' + file.name + ' — нажмите «Проверить файл»');
    };
    reader.readAsText(file, 'utf-8');
    return;
  }
  if (el.dataset.act === 'admin-dish-photo'){
    const file = el.files && el.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type || '')){
      toast('Нужен файл картинки — jpg или png');
      return;
    }
    readImageFile(file).then(dataUrl => {
      admin.dishDraft.img = dataUrl;
      renderAdmin();
      toast('Фото загружено — сохраните блюдо, чтобы оно появилось в меню');
    }).catch(() => toast('Не получилось прочитать фото'));
    return;
  }
  if (el.dataset.act === 'admin-banner-photo'){
    const file = el.files && el.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type || '')){
      toast('Нужен файл картинки — jpg или png');
      return;
    }
    readImageFile(file, 1600).then(dataUrl => {
      admin.bannerDraft.img = dataUrl;
      renderAdmin();
      toast('Баннер загружен — сохраните акцию, чтобы показать его гостю');
    }).catch(() => toast('Не получилось прочитать баннер'));
    return;
  }
});
