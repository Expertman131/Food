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
  menuFilter: 'all',
  rejectFor: null,
  promoDraft: { code:'', type:'percent', value:10 },
  dishDraft: {
    id:null, name:'', cat:'rolls', price:'', unit:'', badge:'',
    desc:'', composition:'', allergens:'', img:'assets/philadelphia.jpg', popular:false
  },
  bannerDraft: {
    kind:'promo', tag:'', title:'', sub:'', cta:'Применить код',
    img:'assets/sashimi.jpg', code:'', dish:'d-set-w', screen:'profile'
  },
  clientImport: { text:'', rows:null, errors:null, skipped:0 },
  bonusFor: null,
  bonusAmount: 100,
  qr: { locId:'l1', from:1, to:8, ec:'M' },
  settings: {
    deliveryPrice: RULES.deliveryPrice,
    freeFrom: RULES.freeDeliveryFrom,
    minOrder: RULES.minOrder,
    bonusPercent: RULES.bonusAccrual,
    prepTime: RULES.prepTime,
    autoAccept: false,
    sound: true
  }
};

const ADMIN_CLIENTS = [
  { name:'Сергей',   phone:'+7 900 000-00-01', orders:12, sum:14890, bonus:742, segment:'Постоянный', last:'сегодня' },
  { name:'Анна',     phone:'+7 916 330-12-04', orders:7,  sum:8240,  bonus:412, segment:'Постоянный', last:'вчера' },
  { name:'Дмитрий',  phone:'+7 903 118-77-21', orders:3,  sum:3170,  bonus:158, segment:'Новый',       last:'3 дня назад' },
  { name:'Мария',    phone:'+7 985 402-19-55', orders:1,  sum:1690,  bonus:84,  segment:'Новый',       last:'неделя назад' },
  { name:'Ольга',    phone:'+7 926 640-08-31', orders:19, sum:24310, bonus:1215,segment:'VIP',         last:'2 дня назад' },
  { name:'Игорь',    phone:'+7 891 003-92-44', orders:2,  sum:1580,  bonus:79,  segment:'Спящий',      last:'3 недели назад' }
];

const emptyDishDraft = () => ({
  id:null, name:'', cat:'rolls', price:'', unit:'', badge:'',
  desc:'', composition:'', allergens:'', img:'assets/philadelphia.jpg',
  defaultImg:'assets/philadelphia.jpg', popular:false
});

const emptyBannerDraft = () => ({
  kind:'promo', tag:'', title:'', sub:'', cta:'Применить код',
  img:'assets/sashimi.jpg', code:'', dish:'d-set-w', screen:'profile'
});

/* Телефоны сравниваются по цифрам: «+7 916 330-12-04» и «89163301204» — один гость */
function normPhone(raw){
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 11 && d[0] === '8') d = '7' + d.slice(1);
  if (d.length === 10) d = '7' + d;
  return d;
}
function formatPhone(digits){
  if (!digits || digits.length !== 11) return digits;
  return '+7 ' + digits.slice(1,4) + ' ' + digits.slice(4,7) + '-' + digits.slice(7,9) + '-' + digits.slice(9,11);
}

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
    rows.push({ name, phone: formatPhone(phone), orders, sum, bonus, segment, duplicate: known.has(phone) });
  });
  return { rows, errors, skipped: rows.filter(r => r.duplicate).length + errors.length };
}

/* Фото из телефона: ужимаем до 900 px по ширине и переводим в jpeg,
   иначе страница с картинкой весит десятки мегабайт и подвисает. */
function readImageFile(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        const maxW = 900;
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

const adminTop = (title, sub) => `
  <div>
    <h1>${title}</h1>
    <div class="sub">${sub}</div>
  </div>
  <div class="row gap-10">
    <span class="a-pill lime">${icon('volume')} Звук нового заказа</span>
    <span class="a-pill olive">Оператор · Мария</span>
  </div>`;

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
  if (!el || !el.id || !el.closest || !el.closest('#adminBody')) return null;
  if (!/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return null;
  return {id: el.id, start: el.selectionStart, end: el.selectionEnd};
}

function restoreAdminInput(key){
  if (!key) return;
  const el = document.getElementById(key.id);
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
      <span class="wordmark" style="font-size:19px">васаби<span class="dot">.</span></span>
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

/* -------------------------------- заказы -------------------------------- */

function adminOrders(){
  const groups = { new:'Новые', work:'В работе', done:'Завершённые' };
  const bucket = o => {
    if (o.status === 'new') return 'new';
    if (o.status === 'done' || DEAD_STATUSES.includes(o.status)) return 'done';
    return 'work';
  };
  const list = state.orders.filter(o => bucket(o) === admin.tab);
  const all = state.orders;

  const actions = o => {
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
  };

  return `
  <div class="a-tabs">
    <button class="${admin.tab==='new'?'is-active':''}" data-act="admin-tab" data-tab="new" aria-pressed="${admin.tab==='new'}">Новые · ${all.filter(o=>bucket(o)==='new').length}</button>
    <button class="${admin.tab==='work'?'is-active':''}" data-act="admin-tab" data-tab="work" aria-pressed="${admin.tab==='work'}">В работе · ${all.filter(o=>bucket(o)==='work').length}</button>
    <button class="${admin.tab==='done'?'is-active':''}" data-act="admin-tab" data-tab="done" aria-pressed="${admin.tab==='done'}">Завершённые · ${all.filter(o=>bucket(o)==='done').length}</button>
    <button class="a-btn" style="margin-left:auto" data-act="admin-new-order">+ Создать тестовый заказ</button>
  </div>

  ${list.length ? `<div class="a-orders">${list.map(o => `
    <article class="a-order ${o.status==='new'?'is-new':''}">
      <div class="a-order-head">
        <div>
          <div style="font-weight:700">№${o.no} ${o.deliveryType === 'table' ? `<span class="a-pill olive" style="margin-left:6px">${icon('qr')} QR · стол ${o.tableNo}</span>` : ''}</div>
          <div class="muted" style="font-size:12px;margin-top:3px">${o.date}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700;color:var(--lime)">${fmt(o.total)}</div>
          <span class="a-pill ${o.status==='new'?'lime':(DEAD_STATUSES.includes(o.status)?'red':'olive')}" style="margin-top:6px">${statusLabel(o)}</span>
        </div>
      </div>
      <div class="a-order-items">${o.items.map(i => `${i.name} × ${i.qty}`).join('<br>')}</div>
      <div class="a-order-meta">
        <div class="row">${icon('user')} ${o.customer || 'Сергей'} · ${o.phone || '+7 900 000-00-01'}</div>
        <div class="row">${icon('pin')} ${o.address}</div>
        <div class="row">${icon('clock')} ${o.slot ? slotFull(o.slot) : (o.deliveryType === 'table' ? `К столу · ${RULES.prepTable}` : (o.deliveryType === 'pickup' ? 'Самовывоз · как можно скорее' : 'Доставка · как можно скорее'))}</div>
        <div class="row">${icon('wallet')} ${o.payment==='sbp'?'СБП':(o.payment==='table'?'Оплата у стола':(o.payment==='cash'?'Наличные':'Карта онлайн'))}${o.promo?' · '+o.promo:''}</div>
        ${o.comment ? `<div class="row">${icon('doc')} ${o.comment}</div>` : ''}
        ${o.rejectReason ? `<div class="row" style="color:#F2856B">${icon('info')} ${o.rejectReason}</div>` : ''}
      </div>
      ${actions(o)}
    </article>`).join('')}</div>`
  : `<div class="a-panel" style="text-align:center;color:var(--muted)">В этой вкладке пусто</div>`}

  <div class="a-panel" style="margin-top:16px">
    <h2>Передача в iikoDelivery</h2>
    <p class="a-lead">Автоматическая передача заказа в iikoDelivery, печать на кухню в iikoKitchen и фискализация в iikoCash. Требуется лицензия iikoDelivery + iikoKitchen и API-ключи тестового стенда.</p>
    <div class="a-row" style="margin-top:12px">
      <span class="a-pill warn">${icon('info')} Не подключено</span>
      <button class="a-btn" data-act="admin-toast" data-msg="Заявка на подключение iiko отправлена подрядчику">Заказать подключение</button>
    </div>
  </div>`;
}

/* --------------------------------- меню --------------------------------- */

function adminMenu(){
  const cats = CATEGORIES.filter(c => c.id !== 'all');
  const list = DISHES;
  const featured = list.filter(d => d.popular);
  const active = list.filter(dishAvailable).length;
  const stopped = list.length - active;
  const ownPhoto = !!admin.dishDraft.img && !DISH_IMAGES.includes(admin.dishDraft.img);
  return `
  <div class="a-panel" id="dishForm" style="margin-bottom:18px">
    <h2>${admin.dishDraft.id ? 'Редактирование блюда' : 'Добавить блюдо в меню'}</h2>
    <p class="a-lead">Позиция появляется в меню гостя сразу: и в каталоге, и в поиске, и в QR-меню в зале.</p>
    <div class="a-grid a-grid-3" style="gap:10px">
      <input class="input-plain" id="dish-name" aria-label="Название блюда" data-act="admin-dish-draft" data-field="name" placeholder="Название, напр. Темпура с креветкой" value="${admin.dishDraft.name}">
      <select class="input-plain" id="dish-cat" aria-label="Категория блюда" data-act="admin-dish-draft" data-field="cat">
        ${CATEGORIES.filter(c => c.id !== 'all').map(c => `<option value="${c.id}" ${admin.dishDraft.cat===c.id?'selected':''}>${c.name}</option>`).join('')}
      </select>
      <input class="input-plain" id="dish-price" type="number" min="1" inputmode="numeric" aria-label="Цена блюда, ₽" data-act="admin-dish-draft" data-field="price" placeholder="Цена, ₽" value="${admin.dishDraft.price}">
      <input class="input-plain" id="dish-unit" aria-label="Вес или количество" data-act="admin-dish-draft" data-field="unit" placeholder="Вес: 8 шт. · 260 г" value="${admin.dishDraft.unit}">
      <input class="input-plain" id="dish-badge" aria-label="Пометка над названием" data-act="admin-dish-draft" data-field="badge" placeholder="Пометка, напр. Хит" value="${admin.dishDraft.badge}">
      <select class="input-plain" id="dish-img" aria-label="Фото блюда" data-act="admin-dish-draft" data-field="img">
        ${ownPhoto ? `<option value="${admin.dishDraft.img}" selected>— своё фото —</option>` : ''}
        ${DISH_IMAGES.map(p => `<option value="${p}" ${admin.dishDraft.img===p?'selected':''}>${p.replace('assets/','')}</option>`).join('')}
      </select>
    </div>
    <div class="a-photo">
      <img class="a-photo-preview" src="${admin.dishDraft.img}" alt="Фото блюда">
      <div class="a-photo-fields">
        <label class="a-photo-title" for="dishPhoto">Своё фото блюда</label>
        <input type="file" id="dishPhoto" class="a-file" accept="image/*" data-act="admin-dish-photo">
        <div class="muted" style="font-size:12px">Снимок с телефона подойдёт: он обрежется по квадрату и ужмётся, чтобы страница не тормозила.</div>
        ${ownPhoto ? '<button class="a-btn" data-act="admin-dish-photo-reset">Вернуть фото из набора</button>' : ''}
      </div>
    </div>
    <div class="a-grid a-grid-2" style="gap:10px;margin-top:10px">
      <textarea class="input-plain" id="dish-desc" rows="2" aria-label="Описание блюда" data-act="admin-dish-draft" data-field="desc" placeholder="Описание для гостя">${admin.dishDraft.desc}</textarea>
      <textarea class="input-plain" id="dish-composition" rows="2" aria-label="Состав блюда" data-act="admin-dish-draft" data-field="composition" placeholder="Состав: рис, лосось, соевый соус…">${admin.dishDraft.composition}</textarea>
    </div>
    <div class="a-grid a-grid-2" style="gap:10px;margin-top:10px;align-items:end">
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

  <div class="a-grid a-grid-4" style="margin-bottom:18px">
    <div class="a-stat"><div class="lbl">Позиций в меню</div><div class="val">${list.length}</div><div class="delta">${cats.length} категорий</div></div>
    <div class="a-stat"><div class="lbl">Активных</div><div class="val lime">${active}</div><div class="delta">${stopped} в стоп-листе</div></div>
    <div class="a-stat"><div class="lbl">Средняя цена</div><div class="val">${fmt(list.reduce((s,d)=>s+d.price,0)/list.length)}</div><div class="delta">по всем категориям</div></div>
    <div class="a-stat"><div class="lbl">Синхронизация с iiko</div><div class="val" style="font-size:18px;color:#F0B45A">Не настроена</div><div class="delta">Меню ведётся вручную</div></div>
  </div>

  <div class="a-panel">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px">
      <h2 style="margin-bottom:0">Блюда и цены</h2>
      <button class="a-btn primary" data-act="admin-dish-new">+ Добавить блюдо</button>
    </div>
    <table class="a-table a-table-dishes">
      <thead><tr><th scope="col"><span class="sr-only">Фото</span></th><th scope="col">Название</th><th scope="col">Категория</th><th scope="col">Вес</th><th scope="col">Цена</th><th scope="col">На главной</th><th scope="col">Статус</th><th scope="col"><span class="sr-only">Действия</span></th></tr></thead>
      <tbody>
        ${list.map(d => `
          <tr class="${dishAvailable(d)?'':'is-stopped'}">
            <td><img class="thumb" src="${d.img}" alt=""></td>
            <td><b>${d.name}</b>${d.badge?`<div class="muted" style="font-size:11.5px;margin-top:2px">${d.badge}</div>`:''}</td>
            <td class="muted nw">${CATEGORIES.find(c=>c.id===d.cat).name}</td>
            <td class="muted nw">${d.unit}</td>
            <td class="nw"><b>${fmt(d.price)}</b></td>
            <td class="nw">
              <button class="a-btn star ${d.popular?'is-on':''}" aria-pressed="${d.popular?'true':'false'}"
                aria-label="${d.popular?'Убрать «'+d.name+'» с главной':'Показать «'+d.name+'» на главной'}"
                data-act="admin-featured" data-id="${d.id}">${icon('star')}</button>
            </td>
            <td class="nw"><span class="a-pill ${dishAvailable(d)?'lime':'red'}">${dishAvailable(d)?'Активно':'Стоп-лист'}</span></td>
            <td class="nw">
              <div class="a-row">
                <button class="a-btn" aria-label="Редактировать «${d.name}»" data-act="admin-dish-edit" data-id="${d.id}">${icon('edit')}</button>
                <button class="a-btn a-btn-stop ${dishAvailable(d)?'':'primary'}" data-act="admin-stoplist" data-id="${d.id}">${dishAvailable(d) ? 'Стоп-лист' : 'Вернуть в меню'}</button>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>

    <div class="a-cards">
      ${list.map(d => `
        <article class="a-card ${dishAvailable(d)?'':'is-stopped'}">
          <img class="a-card-thumb" src="${d.img}" alt="">
          <div class="a-card-body">
            <div class="a-card-title"><b>${d.name}</b>${d.badge?`<span class="muted">${d.badge}</span>`:''}</div>
            <div class="muted" style="font-size:12.5px">${CATEGORIES.find(c=>c.id===d.cat).name} · ${d.unit}</div>
            <div class="a-card-row">
              <b>${fmt(d.price)}</b>
              <span class="a-pill ${dishAvailable(d)?'lime':'red'}">${dishAvailable(d)?'Активно':'Стоп-лист'}</span>
            </div>
            <div class="a-row">
              <button class="a-btn star ${d.popular?'is-on':''}" aria-pressed="${d.popular?'true':'false'}"
                aria-label="${d.popular?'Убрать «'+d.name+'» с главной':'Показать «'+d.name+'» на главной'}"
                data-act="admin-featured" data-id="${d.id}">${icon('star')}</button>
              <button class="a-btn" aria-label="Редактировать «${d.name}»" data-act="admin-dish-edit" data-id="${d.id}">${icon('edit')}</button>
              <button class="a-btn a-btn-stop ${dishAvailable(d)?'':'primary'}" data-act="admin-stoplist" data-id="${d.id}">${dishAvailable(d) ? 'Стоп-лист' : 'Вернуть в меню'}</button>
            </div>
          </div>
        </article>`).join('')}
    </div>
  </div>

  <div class="a-panel" style="margin-top:16px">
    <h2>Лента «Попробуйте любимое» на главной</h2>
    <p class="a-lead">Отмеченные блюда гость видит на главной без прокрутки. Не больше ${RULES.featuredMax}: главная не должна превращаться в каталог.</p>
    ${featured.length ? featured.map(d => `
      <div class="sum-row">
        <span class="row-star">${icon('star')}<span>${d.name}</span>${dishAvailable(d)?'':'<span class="a-pill red" style="margin-left:8px">в стоп-листе — гостю не виден</span>'}</span>
        <span class="val">
          <span class="muted" style="font-size:12px;margin-right:8px">${fmt(d.price)}</span>
          <button class="a-btn" data-act="admin-featured" data-id="${d.id}" aria-label="Убрать «${d.name}» с главной">${icon('x')}</button>
        </span>
      </div>`).join('') : `<div class="sum-row"><span>Ничего не отмечено — лента на главной пустая</span><span class="val">0 из ${RULES.featuredMax}</span></div>`}
    ${featured.length ? `<div class="sum-row" style="border-top:1px solid var(--line-soft);margin-top:8px;padding-top:10px"><span class="muted" style="font-size:12.5px">Занято мест в ленте</span><span class="val">${featured.length} из ${RULES.featuredMax}</span></div>` : ''}
  </div>

  <div class="a-grid a-grid-3" style="margin-top:16px">
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
      <div class="sum-row"><span>Калифорния</span><span class="val">нет в наличии</span></div>
    </div>
  </div>`;
}

/* ------------------------------- маркетинг ------------------------------- */

function adminMarketing(){
  return `
  <div class="a-grid a-grid-4" style="margin-bottom:18px">
    <div class="a-stat"><div class="lbl">Активных промокодов</div><div class="val lime">${activePromos().length}</div><div class="delta">всего в базе: ${PROMOS.length}</div></div>
    <div class="a-stat"><div class="lbl">Начисление бонусов</div><div class="val">${admin.settings.bonusPercent}%</div><div class="delta">от суммы заказа</div></div>
    <div class="a-stat"><div class="lbl">Push-рассылок за месяц</div><div class="val">3</div><div class="delta">средний CTR 6,4%</div></div>
    <div class="a-stat"><div class="lbl">Баннеров на главной</div><div class="val">${activeBanners().length}</div><div class="delta">всего заведено: ${BANNERS.length}</div></div>
  </div>

  <div class="a-grid a-grid-split" style="margin-bottom:16px">
    <div class="a-panel">
      <h2>Промокоды</h2>
      <table class="a-table a-table-promos">
        <thead><tr><th scope="col">Код</th><th scope="col">Тип</th><th scope="col">Значение</th><th scope="col">Мин. сумма</th><th scope="col">Использований</th><th scope="col"><span class="sr-only">Действия</span></th></tr></thead>
        <tbody>
          ${PROMOS.map(p => `
            <tr>
              <td><b>${p.code}</b>${p.active?'':'<div class="muted" style="font-size:11.5px">выключен</div>'}</td>
              <td class="muted nw">${p.type==='percent'?'Процент':(p.type==='fixed'?'Фиксированная':'Доставка')}</td>
              <td class="nw">${p.type==='percent'?p.value+'%':(p.type==='fixed'?fmt(p.value):'бесплатно')}</td>
              <td class="muted nw">${p.min?fmt(p.min):'—'}</td>
              <td class="muted nw">${p.code==='WASABI10'?28:(p.code==='SETHI'?9:4)}</td>
              <td class="nw"><button class="a-btn ${p.active?'danger':''}" data-act="admin-promo-toggle" data-code="${p.code}">${p.active?'Отключить':'Включить'}</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
      <div class="a-cards">
        ${PROMOS.map(p => `
          <article class="a-card a-card-col">
            <div class="a-card-body">
              <div class="a-card-title"><b>${p.code}</b>${p.active?'':'<span class="a-pill warn">выключен</span>'}</div>
              <div class="muted" style="font-size:12.5px">${p.type==='percent'?'Процент':(p.type==='fixed'?'Фиксированная сумма':'Бесплатная доставка')} · ${p.type==='percent'?p.value+'%':(p.type==='fixed'?fmt(p.value):'бесплатно')}${p.min?' · от '+fmt(p.min):''}</div>
              <div class="muted" style="font-size:12.5px">Использований: ${p.code==='WASABI10'?28:(p.code==='SETHI'?9:4)}</div>
              <div class="a-row"><button class="a-btn ${p.active?'danger':''}" data-act="admin-promo-toggle" data-code="${p.code}">${p.active?'Отключить':'Включить'}</button></div>
            </div>
          </article>`).join('')}
      </div>
      <h2 style="margin-top:20px">Новый промокод</h2>
      <div class="a-grid a-grid-3" style="gap:10px">
        <input class="input-plain" aria-label="Код промокода" data-act="admin-draft" data-field="code" placeholder="Код, напр. AUTUMN25" value="${admin.promoDraft.code}">
        <select class="input-plain" aria-label="Тип скидки" data-act="admin-draft" data-field="type">
          <option value="percent" ${admin.promoDraft.type==='percent'?'selected':''}>Процент</option>
          <option value="fixed" ${admin.promoDraft.type==='fixed'?'selected':''}>Фиксированная сумма</option>
          <option value="delivery" ${admin.promoDraft.type==='delivery'?'selected':''}>Бесплатная доставка</option>
        </select>
        <input class="input-plain" type="number" min="1" aria-label="Размер скидки" inputmode="numeric" data-act="admin-draft" data-field="value" value="${admin.promoDraft.value}">
      </div>
      <button class="a-btn primary" style="margin-top:12px" data-act="admin-promo-create">Создать промокод</button>
    </div>

    <div class="a-panel">
      <h2>Карусель акций на главной</h2>
      <div class="muted" style="font-size:12.5px;margin-bottom:12px">
        ${BANNERS.filter(b => b.active).length} из ${BANNERS.length} показываются гостю. Порядок ниже = порядок карточек в ленте, изменения видны сразу.
      </div>
      ${BANNERS.map((b, i) => `
        <div class="a-order" style="margin-bottom:10px">
          <div class="row between" style="gap:10px">
            <div style="font-weight:700">${b.title}</div>
            <div class="row gap-6">
              <button class="a-btn" data-act="admin-banner-move" data-banner="${b.id}" data-dir="-1" ${i===0?'disabled':''} aria-label="Выше">↑</button>
              <button class="a-btn" data-act="admin-banner-move" data-banner="${b.id}" data-dir="1" ${i===BANNERS.length-1?'disabled':''} aria-label="Ниже">↓</button>
            </div>
          </div>
          <div class="muted" style="font-size:12.5px;margin-top:4px">${bannerKind(b)} · ${b.sub}</div>
          <div class="a-row" style="margin-top:10px">
            <span class="a-pill ${b.active?'lime':''}">${b.active?'Показывается':'Скрыт'}</span>
            <button class="a-btn" data-act="admin-banner-toggle" data-banner="${b.id}">${b.active?'Выключить':'Показать'}</button>
          </div>
        </div>`).join('')}

      <h2 style="margin-top:20px">Новая акция на главной</h2>
      <p class="a-lead-sm">Карточка появится в карусели на главной и на экране «Акции» — сразу, как только создана.</p>
      <div id="bannerForm">
      <div class="a-grid a-grid-2" style="gap:10px">
        <select class="input-plain" id="banner-kind" aria-label="Куда ведёт акция" data-act="admin-banner-draft" data-field="kind">
          <option value="promo" ${admin.bannerDraft.kind==='promo'?'selected':''}>Промокод</option>
          <option value="dish" ${admin.bannerDraft.kind==='dish'?'selected':''}>Блюдо</option>
          <option value="screen" ${admin.bannerDraft.kind==='screen'?'selected':''}>Экран приложения</option>
        </select>
        <input class="input-plain" id="banner-tag" aria-label="Ярлык акции" data-act="admin-banner-draft" data-field="tag" placeholder="Ярлык, напр. −20%" value="${admin.bannerDraft.tag}">
      </div>
      <div style="margin-top:10px">
        <input class="input-plain" id="banner-title" style="width:100%" aria-label="Заголовок акции" data-act="admin-banner-draft" data-field="title" placeholder="Заголовок, напр. Скидка 20% на второй сет" value="${admin.bannerDraft.title}">
      </div>
      <div class="a-grid a-grid-2" style="gap:10px;margin-top:10px">
        <input class="input-plain" id="banner-sub" aria-label="Подпись под заголовком" data-act="admin-banner-draft" data-field="sub" placeholder="Подпись: промокод, условия" value="${admin.bannerDraft.sub}">
        <input class="input-plain" id="banner-cta" aria-label="Надпись на кнопке" data-act="admin-banner-draft" data-field="cta" placeholder="Кнопка: Применить код" value="${admin.bannerDraft.cta}">
      </div>
      <div class="a-grid a-grid-2" style="gap:10px;margin-top:10px">
        <select class="input-plain" id="banner-img" aria-label="Фото акции" data-act="admin-banner-draft" data-field="img">
          ${DISH_IMAGES.map(p => `<option value="${p}" ${admin.bannerDraft.img===p?'selected':''}>${p.replace('assets/','')}</option>`).join('')}
        </select>
        ${admin.bannerDraft.kind === 'promo' ? `
          <select class="input-plain" id="banner-code" aria-label="Промокод акции" data-act="admin-banner-draft" data-field="code">
            <option value="">— выберите промокод —</option>
            ${PROMOS.map(p => `<option value="${p.code}" ${admin.bannerDraft.code===p.code?'selected':''}>${p.code} · ${p.active?'активен':'выключен'}</option>`).join('')}
          </select>` : (admin.bannerDraft.kind === 'dish' ? `
          <select class="input-plain" id="banner-dish" aria-label="Блюдо акции" data-act="admin-banner-draft" data-field="dish">
            ${DISHES.map(d => `<option value="${d.id}" ${admin.bannerDraft.dish===d.id?'selected':''}>${d.name}</option>`).join('')}
          </select>` : `
          <select class="input-plain" id="banner-screen" aria-label="Экран приложения" data-act="admin-banner-draft" data-field="screen">
            ${['profile','promos','orders','favorites','restaurant','catalog'].map(k => `<option value="${k}" ${admin.bannerDraft.screen===k?'selected':''}>${SCREENS[k].title}</option>`).join('')}
          </select>`)}
      </div>
      <button class="a-btn primary" style="margin-top:12px" data-act="admin-banner-create">Создать акцию</button>
      </div>

      <h2 style="margin-top:20px">Push-рассылка</h2>
      <textarea class="input-plain" rows="3" placeholder="Текст сообщения для гостей"></textarea>
      <div class="a-row" style="margin-top:10px">
        <button class="a-btn" data-act="admin-toast" data-msg="Рассылка отправлена 214 гостям">Отправить всем (214)</button>
        <button class="a-btn" data-act="admin-toast" data-msg="Сегмент «Спящие» — 38 гостей">Сегмент «Спящие»</button>
      </div>
    </div>
  </div>`;
}

/* -------------------------------- клиенты ------------------------------- */

function adminClients(){
  return `
  <div class="a-grid a-grid-4" style="margin-bottom:18px">
    <div class="a-stat"><div class="lbl">Гостей в базе</div><div class="val">${ADMIN_CLIENTS.length}</div><div class="delta">+12 за неделю</div></div>
    <div class="a-stat"><div class="lbl">Из них с заказами</div><div class="val lime">${ADMIN_CLIENTS.filter(c=>c.orders>1).length}</div><div class="delta">повторные покупки</div></div>
    <div class="a-stat"><div class="lbl">Средний чек</div><div class="val">${fmt(1240)}</div><div class="delta">+6% к прошлой неделе</div></div>
    <div class="a-stat"><div class="lbl">Баллов в обороте</div><div class="val">${fmt(ADMIN_CLIENTS.reduce((s,c)=>s+c.bonus,0))}</div><div class="delta">начислено гостям</div></div>
  </div>
  <div class="a-panel">
    <h2>Гости</h2>
    <table class="a-table a-table-clients">
      <thead><tr><th scope="col">Имя</th><th scope="col">Телефон</th><th scope="col">Заказов</th><th scope="col">Сумма</th><th scope="col">Бонусы</th><th scope="col">Сегмент</th><th scope="col">Последний</th><th scope="col"><span class="sr-only">Действия</span></th></tr></thead>
      <tbody>
        ${ADMIN_CLIENTS.map(c => `
          <tr>
            <td><b>${c.name}</b>${c.source?` <span class="a-pill olive">${c.source}</span>`:''}</td>
            <td class="muted nw">${c.phone}</td>
            <td class="nw">${c.orders}</td>
            <td class="nw">${fmt(c.sum)}</td>
            <td class="nw">${fmt(c.bonus)}</td>
            <td class="nw"><span class="a-pill ${c.segment==='VIP'?'lime':(c.segment==='Спящий'?'warn':'')}">${c.segment}</span></td>
            <td class="muted nw">${c.last}</td>
            <td class="nw">
              <div class="a-row">
                <button class="a-btn" data-act="admin-bonus-open" data-phone="${c.phone}">Начислить</button>
                <button class="a-btn danger" data-act="admin-client-del" data-phone="${c.phone}" aria-label="Удалить гостя ${c.name}">${icon('trash')}</button>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>

    <div class="a-cards">
      ${ADMIN_CLIENTS.map(c => `
        <article class="a-card">
          <div class="a-card-body">
            <div class="a-card-title"><b>${c.name}</b>${c.source?`<span class="a-pill olive">${c.source}</span>`:''}</div>
            <div class="muted" style="font-size:12.5px">${c.phone}</div>
            <div class="a-card-row">
              <span>${c.orders} ${plural(c.orders,'заказ','заказа','заказов')} · ${fmt(c.sum)}</span>
              <span class="a-pill ${c.segment==='VIP'?'lime':(c.segment==='Спящий'?'warn':'')}">${c.segment}</span>
            </div>
            <div class="muted" style="font-size:12px">Бонусы ${fmt(c.bonus)} · был ${c.last}</div>
            <div class="a-row">
              <button class="a-btn" data-act="admin-bonus-open" data-phone="${c.phone}">Начислить баллы</button>
              <button class="a-btn danger" data-act="admin-client-del" data-phone="${c.phone}" aria-label="Удалить гостя ${c.name}">${icon('trash')}</button>
            </div>
          </div>
        </article>`).join('')}
    </div>
  </div>

  ${admin.bonusFor ? `
  <div class="a-panel" style="margin-top:16px">
    <h2>Начисление бонусов: ${admin.bonusFor.name}</h2>
    <div class="a-grid a-grid-2" style="gap:10px;align-items:end">
      <input class="input-plain" id="bonusAmount" type="number" min="1" inputmode="numeric" aria-label="Сколько баллов начислить" data-act="admin-bonus-amount" value="${admin.bonusAmount}">
      <div class="a-row">
        <button class="a-btn primary" data-act="admin-bonus-apply" data-phone="${admin.bonusFor.phone}">Начислить</button>
        <button class="a-btn" data-act="admin-bonus-cancel">Отмена</button>
      </div>
    </div>
    <p class="muted" style="font-size:12.5px;margin-top:10px">Сейчас у гостя ${fmt(admin.bonusFor.bonus)}. Бонусы iiko не подключены — начисление идёт только в базе прототипа.</p>
  </div>` : ''}

  <div class="a-panel" style="margin-top:16px">
    <h2>Импорт гостей из старой CRM</h2>
    <p class="a-lead">Выгрузите гостей из Foodpicasso в CSV и загрузите сюда — гости переедут в базу вместе с историей заказов и бонусами. Телефон сверяется: гостя с таким же номером второй раз не добавляем, а обновляем его историю.</p>
    <p class="muted" style="font-size:12.5px;margin-top:6px">Формат строки: <code>Имя;Телефон;Заказы;Сумма;Бонусы;Сегмент</code> — разделитель «;» или «,», первая строка может быть заголовком.</p>
    <div class="a-row" style="margin-top:12px">
      <input type="file" class="a-file" accept=".csv,text/csv,text/plain" aria-label="Выбрать CSV-файл с гостями" data-act="admin-import-file">
    </div>
    <textarea class="input-plain" id="importText" rows="3" style="margin-top:10px" aria-label="Данные гостей, можно вставить текстом" data-act="admin-import-text" placeholder="Имя;Телефон;Заказы;Сумма;Бонусы;Сегмент">${admin.clientImport.text}</textarea>
    <div class="a-row" style="margin-top:12px">
      <button class="a-btn" data-act="admin-import-check">Проверить файл</button>
      ${admin.clientImport.rows && admin.clientImport.rows.length ? `<button class="a-btn primary" id="importApply" data-act="admin-import-apply">Импортировать ${admin.clientImport.rows.length} ${plural(admin.clientImport.rows.length,'гостя','гостя','гостей')}</button>` : ''}
    </div>
    ${admin.clientImport.rows ? `
      <div style="margin-top:14px" id="importPreview">
        <div class="muted" style="font-size:12.5px;margin-bottom:8px">Разобрано строк: ${admin.clientImport.rows.length}. ${admin.clientImport.errors && admin.clientImport.errors.length ? `Не разобрано: ${admin.clientImport.errors.length}.` : ''}</div>
        <div class="muted" style="font-size:12.5px;margin-bottom:8px">
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
                <div class="a-card-title"><b>${r.name}</b><span class="muted" style="font-size:12.5px">${r.phone}</span></div>
                <div class="a-card-row">${r.orders} ${plural(r.orders,'заказ','заказа','заказов')} · ${fmt(r.sum)}</div>
                <div class="muted" style="font-size:12.5px">Бонусы ${fmt(r.bonus)} · ${r.segment}</div>
                <div class="a-card-row"><span class="a-pill ${r.duplicate?'warn':'lime'}">${r.duplicate?'уже есть — обновим историю':'добавим'}</span></div>
              </div>
            </article>`).join('')}
        </div>
        ${admin.clientImport.errors && admin.clientImport.errors.length ? `
          <div class="muted" style="font-size:12.5px;margin-top:10px;color:var(--danger)">Не разобрано строк: ${admin.clientImport.errors.length} — ${admin.clientImport.errors.slice(0,3).join('; ')}${admin.clientImport.errors.length>3?'…':''}</div>` : ''}
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
  <div class="a-grid a-grid-4" style="margin-bottom:18px">
    <div class="a-stat"><div class="lbl">Выручка за неделю</div><div class="val lime">${fmt(684300)}</div><div class="delta">+14% к прошлой неделе</div></div>
    <div class="a-stat"><div class="lbl">Заказов</div><div class="val">556</div><div class="delta">79 в день</div></div>
    <div class="a-stat"><div class="lbl">Средний чек</div><div class="val">${fmt(1231)}</div><div class="delta">+2,1%</div></div>
    <div class="a-stat"><div class="lbl">Доставка / самовывоз</div><div class="val">72% / 28%</div><div class="delta">среднее время 41 мин</div></div>
  </div>

  <div class="a-grid a-grid-split" style="margin-bottom:16px">
    <div class="a-panel">
      <h2>Заказы по дням недели</h2>
      <div style="display:flex;align-items:flex-end;gap:12px;height:170px;padding-top:10px">
        ${bars.map(b => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end">
            <span style="font-size:12px;color:var(--muted)">${b.v}</span>
            <div style="width:100%;height:${Math.round(b.v/max*125)}px;background:var(--lime);border-radius:8px 8px 0 0"></div>
            <span style="font-size:12px;color:var(--muted)">${b.d}</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="a-panel">
      <h2>Популярные блюда</h2>
      ${top.map((d,i) => `
        <div style="margin-bottom:12px">
          <div class="row between" style="font-size:13.5px;margin-bottom:6px"><span>${i+1}. ${d.name}</span><span class="muted">${[214,187,143,121,96][i]} шт.</span></div>
          <div class="a-bar"><i style="width:${[100,87,67,56,45][i]}%"></i></div>
        </div>`).join('')}
    </div>
  </div>

  <div class="a-panel" style="margin-top:16px">
    <div class="row between">
      <h2>Отчёт за неделю</h2>
      <div class="a-row">
        <button class="a-btn" data-act="admin-toast" data-msg="Отчёт выгружен в CSV">Выгрузить CSV</button>
        <button class="a-btn" data-act="admin-toast" data-msg="Отчёт выгружен в Excel">Выгрузить Excel</button>
      </div>
    </div>
    <table class="a-table a-table-report" style="margin-top:12px">
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
            <div class="muted" style="font-size:12.5px">Средний чек ${r[3]} · доставка ${r[4]}</div>
          </div>
        </article>`).join('')}
    </div>
  </div>`;
}

/* ------------------------------- настройки ------------------------------- */

function adminSettings(){
  const s = admin.settings;
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
      <button class="a-btn primary" style="margin-top:8px" data-act="admin-save">Сохранить</button>
    </div>

    <div>
      <div class="a-panel" style="margin-bottom:16px">
        <h2>Точки ресторана</h2>
        ${LOCATIONS.map(l => `
          <div class="sum-row" style="align-items:flex-start">
            <div>
              <div style="font-weight:600">${l.name}</div>
              <div class="muted" style="font-size:12.5px">${l.address} · ${l.hours}</div>
            </div>
            <span class="a-pill lime">${l.delivery}</span>
          </div>`).join('')}
      </div>
      <div class="a-panel">
        <h2>Роли сотрудников</h2>
        ${[['Администратор','меню, заказы, отчёты, сотрудники'],
           ['Оператор заказов','приём, статус, печать чека'],
           ['Курьер','выдача заказа, статус доставки']].map(r=>`
          <div class="sum-row" style="align-items:flex-start">
            <div>
              <div style="font-weight:600">${r[0]}</div>
              <div class="muted" style="font-size:12.5px">${r[1]}</div>
            </div>
          </div>`).join('')}
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
      <div class="muted small" style="margin-top:10px">
        Версия ${m.version} · ${m.size}×${m.size} модулей · уровень ${m.ec} · маска ${m.mask}
      </div>
      <div class="a-row" style="margin-top:14px">
        <button class="a-btn primary" data-act="admin-qr-png" data-no="${tables[0]}" data-loc="${loc.id}">${icon('doc')} Скачать PNG</button>
        <button class="a-btn" data-act="admin-qr-print" data-loc="${loc.id}" data-count="${tables.length}">${icon('printer')} Печать ${tables.length} ${plural(tables.length,'листа','листов','листов')}</button>
      </div>
    </div>
  </div>

  <div class="a-panel" style="margin-top:16px">
    <div class="a-row between" style="margin-bottom:10px">
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
            <td class="muted" style="font-size:12px">${u}</td>
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
            <div class="a-row" style="align-items:center;gap:12px">
              <span class="qr-mini">${QR.svg(u, { ec:q.ec, px:1.6, margin:2 })}</span>
              <span class="muted" style="font-size:12px;word-break:break-all">${u}</span>
            </div>
            <div class="a-row">
              <button class="a-btn" data-act="admin-qr-png" data-no="${no}" data-loc="${loc.id}">PNG</button>
              <button class="a-btn" data-act="admin-qr-open" data-no="${no}" data-loc="${loc.id}">Открыть меню</button>
            </div>
          </div>
        </article>`;
      }).join('')}
    </div>
    <p class="muted small" style="margin-top:12px">
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
    if (o && !DEAD_STATUSES.includes(o.status)){ o.status = el.dataset.to; renderAdmin(); toast('Заказ №' + o.no + ' → ' + statusLabel(o)); render(); }
  }
  if (act === 'admin-reject-open'){ admin.rejectFor = el.dataset.id; renderAdmin(); }
  if (act === 'admin-reject-cancel'){ admin.rejectFor = null; renderAdmin(); }
  if (act === 'admin-reject'){
    const o = state.orders.find(x => x.id === el.dataset.id);
    if (o){
      o.status = 'rejected';
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
  if (act === 'admin-dish-popular'){
    admin.dishDraft.popular = !admin.dishDraft.popular;
    renderAdmin();
  }
  if (act === 'admin-dish-edit'){
    const d = dishById(el.dataset.id);
    if (!d) return;
    admin.dishDraft = {
      id:d.id, name:d.name, cat:d.cat, price:d.price, unit:d.unit || '',
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
  if (act === 'admin-dish-photo-reset'){
    admin.dishDraft.img = admin.dishDraft.defaultImg || 'assets/philadelphia.jpg';
    renderAdmin();
  }
  if (act === 'admin-dish-save'){
    const dr = readDraftFields('dishForm', 'admin-dish-draft', admin.dishDraft);
    const name = (dr.name || '').trim();
    const price = Number(dr.price);
    if (!name){ toast('Введите название блюда'); return; }
    if (!isFinite(price) || price <= 0){ toast('Укажите цену больше нуля'); return; }
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
      name, price, cat:dr.cat, popular:dr.popular,
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
    BANNERS.push({
      id:'b-' + Date.now().toString(36),
      kind:dr.kind, active:true,
      tag:(dr.tag || '').trim() || 'Акция',
      img:dr.img,
      title,
      sub:(dr.sub || '').trim(),
      cta:(dr.cta || '').trim() || (dr.kind === 'dish' ? 'Открыть блюдо' : (dr.kind === 'promo' ? 'Применить код' : 'Открыть')),
      ...link
    });
    admin.bannerDraft = emptyBannerDraft();
    renderAdmin();
    render();
    toast('Акция «' + title + '» — уже в карусели на главной');
  }
  if (act === 'admin-bonus-open'){
    const c = ADMIN_CLIENTS.find(x => x.phone === el.dataset.phone);
    if (!c) return;
    admin.bonusFor = c;
    admin.bonusAmount = 100;
    renderAdmin();
    const amt = document.getElementById('bonusAmount');
    if (amt) amt.focus({ preventScroll:true });
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
    c.bonus += n;
    admin.bonusFor = null;
    renderAdmin();
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
        updated++;
        return;
      }
      ADMIN_CLIENTS.push({
        name:r.name, phone:r.phone, orders:r.orders, sum:r.sum, bonus:r.bonus,
        segment:r.segment, last:'импорт из CRM', source:'CRM'
      });
      added++;
    });
    admin.clientImport = { text:admin.clientImport.text, rows:null, errors:null, skipped:0 };
    renderAdmin();
    toast('Добавлено гостей: ' + added + ', история обновлена: ' + updated);
  }
  if (act === 'admin-new-order'){
    const d = dishById('d-sing');
    state.orders.unshift({
      id:'o'+Date.now(), no: Math.random().toString(36).slice(2,8), date: nowRu(),
      items:[{ dishId:d.id, name:d.name, qty:1, price:d.price, mods:[] }],
      sub:d.price, delivery:RULES.deliveryPrice, discount:0, bonus:0, total:d.price + RULES.deliveryPrice,
      status:'new', address:'Ташкентская 198', comment:'Домофон 42', payment:'card', promo:null,
      deliveryType:'delivery', locationId:'l1', addressId:'a1', slot:null,
      customer:'Гость с терминала', phone:'+7 926 640-08-31'
    });
    admin.tab = 'new';
    renderAdmin();
    toast('Тестовый заказ создан — он появился в приложении гостя');
    render();
  }
  if (act === 'admin-toggle'){
    const k = el.dataset.key;
    admin.settings[k] = !admin.settings[k];
    renderAdmin();
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
    const value = Math.max(0, Number(admin.promoDraft.value) || 0);
    PROMOS.push({
      code, type, value, min: 0, active: true,
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
  if (el.dataset.act === 'admin-dish-draft'){ admin.dishDraft[el.dataset.field] = el.value; }
  if (el.dataset.act === 'admin-banner-draft'){ admin.bannerDraft[el.dataset.field] = el.value; }
  if (el.dataset.act === 'admin-bonus-amount'){ admin.bonusAmount = el.value; }
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
  if (el.dataset.act === 'admin-setting'){
    admin.settings[el.dataset.key] = el.value;
    const n = parseFloat(el.value);
    if (!isNaN(n)){
      if (el.dataset.key === 'deliveryPrice') RULES.deliveryPrice = n;
      if (el.dataset.key === 'freeFrom') RULES.freeDeliveryFrom = n;
      if (el.dataset.key === 'minOrder') RULES.minOrder = n;
      if (el.dataset.key === 'bonusPercent') RULES.bonusAccrual = n;
    }
    if (el.dataset.key === 'prepTime') RULES.prepTime = el.value;
  }
});

document.addEventListener('change', ev => {
  const el = ev.target;
  if (!el.dataset) return;
  if (el.dataset.act === 'admin-qr-field'){
    admin.qr[el.dataset.key] = el.value;
    renderAdmin();
    return;
  }
  if (el.dataset.act === 'admin-banner-draft'){
    admin.bannerDraft[el.dataset.field] = el.value;
    /* смена типа акции меняет набор полей и подпись кнопки — перерисовываем панель */
    if (el.dataset.field === 'kind'){
      admin.bannerDraft.cta = el.value === 'dish' ? 'Открыть блюдо' : (el.value === 'promo' ? 'Применить код' : 'Открыть');
      renderAdmin();
    }
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
});
