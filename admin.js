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

const adminTop = (title, sub) => `
  <div>
    <h2>${title}</h2>
    <div class="sub">${sub}</div>
  </div>
  <div class="row gap-10">
    <span class="a-pill lime">${icon('volume')} Звук нового заказа</span>
    <span class="a-pill olive">Оператор · Мария</span>
  </div>`;

let lastAdminSection = null;

function renderAdmin(){
  const keepY = window.scrollY;
  renderAdminSide();
  const map = {
    orders: adminOrders, menu: adminMenu, qr: adminQr, marketing: adminMarketing,
    clients: adminClients, analytics: adminAnalytics, settings: adminSettings
  };
  const sec = ADMIN_SECTIONS.find(s => s.id === admin.section);
  $('#adminTop').innerHTML = adminTop(sec.label, adminSub());
  $('#adminBody').innerHTML = (map[admin.section] || adminOrders)();
  if (lastAdminSection === null || lastAdminSection === admin.section){
    if (window.scrollY !== keepY) window.scrollTo(0, keepY);
  } else {
    window.scrollTo(0, 0);
  }
  lastAdminSection = admin.section;
}

function adminSub(){
  switch (admin.section){
    case 'orders':   return 'Лента в реальном времени · обновляется по WebSocket';
    case 'menu':     return 'Категории, блюда, модификаторы и стоп-лист';
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
    <div class="aside-nav">
      ${ADMIN_SECTIONS.map(s => `
        <button class="${admin.section===s.id?'is-active':''}" data-act="admin-section" data-section="${s.id}">
          ${icon(s.icon)} ${s.label}
        </button>`).join('')}
    </div>
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
    <button class="${admin.tab==='new'?'is-active':''}" data-act="admin-tab" data-tab="new">Новые · ${all.filter(o=>bucket(o)==='new').length}</button>
    <button class="${admin.tab==='work'?'is-active':''}" data-act="admin-tab" data-tab="work">В работе · ${all.filter(o=>bucket(o)==='work').length}</button>
    <button class="${admin.tab==='done'?'is-active':''}" data-act="admin-tab" data-tab="done">Завершённые · ${all.filter(o=>bucket(o)==='done').length}</button>
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
    <h3>Передача в iikoDelivery</h3>
    <p class="muted" style="font-size:13px">Автоматическая передача заказа в iikoDelivery, печать на кухню в iikoKitchen и фискализация в iikoCash. Требуется лицензия iikoDelivery + iikoKitchen и API-ключи тестового стенда.</p>
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
  const active = list.filter(dishAvailable).length;
  const stopped = list.length - active;
  return `
  <div class="a-grid a-grid-4" style="margin-bottom:18px">
    <div class="a-stat"><div class="lbl">Позиций в меню</div><div class="val">${list.length}</div><div class="delta">${cats.length} категорий</div></div>
    <div class="a-stat"><div class="lbl">Активных</div><div class="val lime">${active}</div><div class="delta">${stopped} в стоп-листе</div></div>
    <div class="a-stat"><div class="lbl">Средняя цена</div><div class="val">${fmt(list.reduce((s,d)=>s+d.price,0)/list.length)}</div><div class="delta">по всем категориям</div></div>
    <div class="a-stat"><div class="lbl">Синхронизация с iiko</div><div class="val" style="font-size:18px;color:#F0B45A">Не настроена</div><div class="delta">Меню ведётся вручную</div></div>
  </div>

  <div class="a-panel">
    <h3>Блюда и цены</h3>
    <table class="a-table">
      <thead><tr><th></th><th>Название</th><th>Категория</th><th>Вес</th><th>Цена</th><th>Статус</th><th></th></tr></thead>
      <tbody>
        ${list.map(d => `
          <tr class="${dishAvailable(d)?'':'is-stopped'}">
            <td><img class="thumb" src="${d.img}" alt=""></td>
            <td><b>${d.name}</b>${d.badge?`<div class="muted" style="font-size:11.5px;margin-top:2px">${d.badge}</div>`:''}</td>
            <td class="muted">${CATEGORIES.find(c=>c.id===d.cat).name}</td>
            <td class="muted">${d.unit}</td>
            <td><b>${fmt(d.price)}</b></td>
            <td><span class="a-pill ${dishAvailable(d)?'lime':'red'}">${dishAvailable(d)?'Активно':'Стоп-лист'}</span></td>
            <td>
              <div class="a-row">
                <button class="a-btn" data-act="admin-toast" data-msg="Карточка блюда открыта на редактирование">${icon('edit')}</button>
                <button class="a-btn ${dishAvailable(d)?'':'primary'}" data-act="admin-stoplist" data-id="${d.id}">${dishAvailable(d) ? 'Стоп-лист' : 'Вернуть в меню'}</button>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="a-grid a-grid-3" style="margin-top:16px">
    <div class="a-panel"><h3>Категории</h3>
      ${cats.map(c=>`<div class="sum-row"><span>${c.name}</span><span class="val">${DISHES.filter(d=>d.cat===c.id).length}</span></div>`).join('')}
    </div>
    <div class="a-panel"><h3>Модификаторы</h3>
      <div class="sum-row"><span>Дополнительное авокадо</span><span class="val">+150 ₽</span></div>
      <div class="sum-row"><span>Острый соус чили</span><span class="val">+50 ₽</span></div>
      <div class="sum-row"><span>Фирменный соус</span><span class="val">0 ₽</span></div>
    </div>
    <div class="a-panel"><h3>Стоп-лист</h3>
      <p class="muted" style="font-size:13px">Позиции, которых нет на кухне прямо сейчас. Клиенты их не видят, и оповещение уходит в зал.</p>
      <div class="sum-row"><span>Калифорния</span><span class="val">нет в наличии</span></div>
    </div>
  </div>`;
}

/* ------------------------------- маркетинг ------------------------------- */

function adminMarketing(){
  return `
  <div class="a-grid a-grid-4" style="margin-bottom:18px">
    <div class="a-stat"><div class="lbl">Активных промокодов</div><div class="val lime">${PROMOS.length}</div><div class="delta">использований за неделю: 41</div></div>
    <div class="a-stat"><div class="lbl">Начисление бонусов</div><div class="val">${admin.settings.bonusPercent}%</div><div class="delta">от суммы заказа</div></div>
    <div class="a-stat"><div class="lbl">Push-рассылок за месяц</div><div class="val">3</div><div class="delta">средний CTR 6,4%</div></div>
    <div class="a-stat"><div class="lbl">Баннеров на главной</div><div class="val">2</div><div class="delta">показ 100%</div></div>
  </div>

  <div class="a-grid a-grid-split" style="margin-bottom:16px">
    <div class="a-panel">
      <h3>Промокоды</h3>
      <table class="a-table">
        <thead><tr><th>Код</th><th>Тип</th><th>Значение</th><th>Мин. сумма</th><th>Использований</th><th></th></tr></thead>
        <tbody>
          ${PROMOS.map(p => `
            <tr>
              <td><b>${p.code}</b></td>
              <td class="muted">${p.type==='percent'?'Процент':(p.type==='fixed'?'Фиксированная':'Доставка')}</td>
              <td>${p.type==='percent'?p.value+'%':(p.type==='fixed'?fmt(p.value):'бесплатно')}</td>
              <td class="muted">${p.min?fmt(p.min):'—'}</td>
              <td class="muted">${p.code==='WASABI10'?28:(p.code==='SETHI'?9:4)}</td>
              <td><button class="a-btn danger" data-act="admin-toast" data-msg="Промокод отключён">Отключить</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
      <h3 style="margin-top:20px">Новый промокод</h3>
      <div class="a-grid a-grid-3" style="gap:10px">
        <input class="input-plain" data-act="admin-draft" data-field="code" placeholder="Код, напр. AUTUMN25" value="${admin.promoDraft.code}">
        <select class="input-plain" data-act="admin-draft" data-field="type">
          <option value="percent" ${admin.promoDraft.type==='percent'?'selected':''}>Процент</option>
          <option value="fixed" ${admin.promoDraft.type==='fixed'?'selected':''}>Фиксированная сумма</option>
          <option value="delivery" ${admin.promoDraft.type==='delivery'?'selected':''}>Бесплатная доставка</option>
        </select>
        <input class="input-plain" type="number" data-act="admin-draft" data-field="value" value="${admin.promoDraft.value}">
      </div>
      <button class="a-btn primary" style="margin-top:12px" data-act="admin-promo-create">Создать промокод</button>
    </div>

    <div class="a-panel">
      <h3>Баннеры на главном экране</h3>
      <div class="a-order" style="margin-bottom:10px">
        <div style="font-weight:700">Хороший вечер начинается с роллов.</div>
        <div class="muted" style="font-size:12.5px;margin-top:4px">Васаби сет · 1 690 ₽ · активен</div>
        <div class="a-row" style="margin-top:10px">
          <span class="a-pill lime">Показывается</span>
          <button class="a-btn" data-act="admin-toast" data-msg="Баннер отключён">Выключить</button>
        </div>
      </div>
      <div class="a-order">
        <div style="font-weight:700">Бонус 5% за каждый заказ</div>
        <div class="muted" style="font-size:12.5px;margin-top:4px">Активная программа лояльности · выключен</div>
        <div class="a-row" style="margin-top:10px">
          <span class="a-pill">Скрыт</span>
          <button class="a-btn" data-act="admin-toast" data-msg="Баннер показан гостям">Показать</button>
        </div>
      </div>

      <h3 style="margin-top:20px">Push-рассылка</h3>
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
    <h3>Гости</h3>
    <table class="a-table">
      <thead><tr><th>Имя</th><th>Телефон</th><th>Заказов</th><th>Сумма</th><th>Бонусы</th><th>Сегмент</th><th>Последний</th><th></th></tr></thead>
      <tbody>
        ${ADMIN_CLIENTS.map(c => `
          <tr>
            <td><b>${c.name}</b></td>
            <td class="muted">${c.phone}</td>
            <td>${c.orders}</td>
            <td>${fmt(c.sum)}</td>
            <td>${fmt(c.bonus)}</td>
            <td><span class="a-pill ${c.segment==='VIP'?'lime':(c.segment==='Спящий'?'warn':'')}">${c.segment}</span></td>
            <td class="muted">${c.last}</td>
            <td><button class="a-btn" data-act="admin-toast" data-msg="Начисление 100 баллов гостю ${c.name}">Начислить</button></td>
          </tr>`).join('')}
      </tbody>
    </table>
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
      <h3>Заказы по дням недели</h3>
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
      <h3>Популярные блюда</h3>
      ${top.map((d,i) => `
        <div style="margin-bottom:12px">
          <div class="row between" style="font-size:13.5px;margin-bottom:6px"><span>${i+1}. ${d.name}</span><span class="muted">${[214,187,143,121,96][i]} шт.</span></div>
          <div class="a-bar"><i style="width:${[100,87,67,56,45][i]}%"></i></div>
        </div>`).join('')}
    </div>
  </div>

  <div class="a-panel" style="margin-top:16px">
    <div class="row between">
      <h3>Отчёт за неделю</h3>
      <div class="a-row">
        <button class="a-btn" data-act="admin-toast" data-msg="Отчёт выгружен в CSV">Выгрузить CSV</button>
        <button class="a-btn" data-act="admin-toast" data-msg="Отчёт выгружен в Excel">Выгрузить Excel</button>
      </div>
    </div>
    <table class="a-table" style="margin-top:12px">
      <thead><tr><th>Период</th><th>Заказов</th><th>Выручка</th><th>Средний чек</th><th>Доставка</th></tr></thead>
      <tbody>
        ${[['20–26 октября',556,'684 300 ₽','1 231 ₽','72%'],
           ['13–19 октября',487,'601 900 ₽','1 236 ₽','70%'],
           ['6–12 октября',455,'558 200 ₽','1 227 ₽','68%']].map(r=>`
          <tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ------------------------------- настройки ------------------------------- */

function adminSettings(){
  const s = admin.settings;
  return `
  <div class="a-grid a-grid-2">
    <div class="a-panel">
      <h3>Доставка и заказы</h3>
      <div class="field"><label>Стоимость доставки, ₽</label><input class="input-plain" data-act="admin-setting" data-key="deliveryPrice" value="${s.deliveryPrice}"></div>
      <div class="field"><label>Бесплатная доставка от, ₽</label><input class="input-plain" data-act="admin-setting" data-key="freeFrom" value="${s.freeFrom}"></div>
      <div class="field"><label>Минимальная сумма заказа, ₽</label><input class="input-plain" data-act="admin-setting" data-key="minOrder" value="${s.minOrder}"></div>
      <div class="field"><label>Время приготовления</label><input class="input-plain" data-act="admin-setting" data-key="prepTime" value="${s.prepTime}"></div>
      <label class="switch-row"><span>Автоподтверждение заказов</span><button class="opt-toggle ${s.autoAccept?'is-on':''}" data-act="admin-toggle" data-key="autoAccept"></button></label>
      <label class="switch-row"><span>Звук нового заказа</span><button class="opt-toggle ${s.sound?'is-on':''}" data-act="admin-toggle" data-key="sound"></button></label>
      <button class="a-btn primary" style="margin-top:8px" data-act="admin-save">Сохранить</button>
    </div>

    <div>
      <div class="a-panel" style="margin-bottom:16px">
        <h3>Точки ресторана</h3>
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
        <h3>Роли сотрудников</h3>
        <table class="a-table">
          <tbody>
            <tr><td>Администратор</td><td class="muted">меню, заказы, отчёты, сотрудники</td></tr>
            <tr><td>Оператор заказов</td><td class="muted">приём, статус, печать чека</td></tr>
            <tr><td>Курьер</td><td class="muted">выдача заказа, статус доставки</td></tr>
          </tbody>
        </table>
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
      <h3>Параметры листов</h3>
      <div class="field">
        <label>Точка ресторана</label>
        <select class="input-plain" data-act="admin-qr-field" data-key="locId">
          ${LOCATIONS.map(l => `<option value="${l.id}" ${l.id===q.locId?'selected':''}>${l.name}</option>`).join('')}
        </select>
      </div>
      <div class="a-grid a-grid-2">
        <div class="field"><label>Столы с</label><input class="input-plain" type="number" min="1" max="60" data-act="admin-qr-field" data-key="from" value="${q.from}"></div>
        <div class="field"><label>по</label><input class="input-plain" type="number" min="1" max="60" data-act="admin-qr-field" data-key="to" value="${q.to}"></div>
      </div>
      <div class="field">
        <label>Защита кода от повреждений</label>
        <select class="input-plain" data-act="admin-qr-field" data-key="ec">
          <option value="L" ${q.ec==='L'?'selected':''}>L — максимум данных, нужен чистый печать</option>
          <option value="M" ${q.ec==='M'?'selected':''}>M — стандарт: читается с потёртостью и пятнами</option>
        </select>
      </div>
      <div class="field">
        <label>Ссылка, которую открывает камера</label>
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
      <h3>Предпросмотр · стол ${tables[0]}</h3>
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
      <h3>Столы точки «${loc.name}»</h3>
      <button class="a-btn" data-act="admin-qr-print" data-loc="${loc.id}" data-count="${tables.length}">${icon('printer')} Печать всех листов</button>
    </div>
    <table class="a-table">
      <thead><tr><th>Стол</th><th>QR</th><th>Адрес меню</th><th></th></tr></thead>
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
  if (act === 'admin-stoplist'){
    const d = dishById(el.dataset.id);
    if (!d) return;
    d.available = !dishAvailable(d);
    renderAdmin();
    render();
    toast(d.available ? d.name + ' — снова в меню' : d.name + ' — стоп-лист, гости не видят блюдо');
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
    if (!admin.promoDraft.code){ toast('Введите код промокода'); return; }
    toast('Промокод ' + admin.promoDraft.code + ' создан');
    admin.promoDraft.code = '';
    renderAdmin();
  }
});

document.addEventListener('input', ev => {
  const el = ev.target;
  if (!el.dataset) return;
  if (el.dataset.act === 'admin-draft'){ admin.promoDraft[el.dataset.field] = el.value; }
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
  if (!el.dataset || el.dataset.act !== 'admin-qr-field') return;
  admin.qr[el.dataset.key] = el.value;
  renderAdmin();
});
