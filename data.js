/* =========================================================================
   Данные прототипа: меню, промокоды, правила доставки и лояльности
   ========================================================================= */

const BRAND = {
  name: 'васаби.',
  tagline: 'Японская кухня • с любовью к вкусу',
  phone: '+7 495 120-08-40',
  address: 'Москва, ул. Ташкентская 19',
  hours: 'ежедневно 11:00 — 23:00',
  menuHost: 'https://vasabi.example'   // демо-домен для QR, пока прототип открыт локально
};

const CATEGORIES = [
  { id: 'all',     name: 'Все' },
  { id: 'rolls',   name: 'Роллы' },
  { id: 'sushi',   name: 'Суши' },
  { id: 'sets',    name: 'Сеты' },
  { id: 'baked',   name: 'Запечённые' },
  { id: 'hot',     name: 'Горячее' },
  { id: 'drinks',  name: 'Напитки' },
  { id: 'desserts',name: 'Десерты' }
];

/* Состав и аллергены — по каждому блюду свои.
   pairs — блюда, которые чаще всего берут вместе с этим (допродажа в корзине). */
const DISHES = [
  {
    id: 'd-set-w', name: 'Васаби сет', price: 1690, cat: 'sets', popular: 1,
    unit: '32 шт. · 920 г', img: 'assets/sushi-boat.jpg', badge: 'Выбор шефа',
    desc: 'Филадельфия, Калифорния, ролл с угрём и маки с огурцом. Идеально для вечера вдвоём или небольшой компании.',
    note: 'Готовим специально для вас. Только после заказа — свой соус, свежий имбирь и настоящий васаби.',
    composition: 'Рис, лосось, крабовый микс, сливочный сыр, огурец, авокадо, икра, угри, водоросли нори, кунжут, соевый соус, васаби, имбирь.',
    allergens: ['рыба', 'морепродукты', 'соя', 'глютен', 'кунжут', 'молоко'],
    pairs: ['d-miso', 'd-cheese', 'd-latte'],
    available: true,
    modifiers: [
      { id: 'avo',   name: 'Дополнительное авокадо', price: 150 },
      { id: 'spicy', name: 'Острый соус чили',        price: 50  },
      { id: 'sauce', name: 'Фирменный соус',         price: 0   }
    ]
  },
  {
    id: 'd-phil', name: 'Филадельфия', price: 590, cat: 'rolls', popular: 1,
    unit: '8 шт. · 260 г', img: 'assets/philadelphia.jpg', badge: 'Хит',
    desc: 'Нежный лосось, сливочный сыр, свежий огурец и рис. Наш любимый классический ролл — ничего лишнего.',
    note: 'Готовим специально для вас. Только после заказа — свой соус, свежий имбирь и настоящий васаби.',
    composition: 'Рис, лосось, сливочный сыр, огурец, авокадо, водоросли нори, кунжут, соевый соус, васаби, имбирь.',
    allergens: ['рыба', 'соя', 'глютен', 'кунжут', 'молоко'],
    pairs: ['d-miso', 'd-cheese', 'd-latte'],
    available: true,
    modifiers: [
      { id: 'avo',   name: 'Дополнительное авокадо', price: 150 },
      { id: 'spicy', name: 'Острый соус чили',        price: 50  }
    ]
  },
  {
    id: 'd-cal', name: 'Калифорния', price: 490, cat: 'rolls', popular: 1,
    unit: '8 шт. · 240 г', img: 'assets/california.jpg',
    desc: 'Крабовый микс, авокадо, огурец и икра. Лёгкий и яркий вкус без лишних специй.',
    note: 'Готовим специально для вас. Только после заказа — свой соус, свежий имбирь и настоящий васаби.',
    composition: 'Рис, крабовый микс, авокадо, огурец, икра, водоросли нори, кунжут, соевый соус, яичный майонез.',
    allergens: ['морепродукты', 'соя', 'кунжут', 'молоко', 'яйца'],
    pairs: ['d-miso', 'd-cheese', 'd-latte'],
    available: true,
    modifiers: [
      { id: 'spicy', name: 'Острый соус чили', price: 50 },
      { id: 'sauce', name: 'Фирменный соус',  price: 0  }
    ]
  },
  {
    id: 'd-temp', name: 'Темпура с лососем', price: 690, salePercent: 10, cat: 'hot', popular: 1,
    unit: '6 шт. · 240 г', img: 'assets/tempura.jpg', badge: 'Горячий',
    desc: 'Хрустящая креветка в панко, лосось и соус спайси. Подаём сразу горячим, пока хрустит.',
    note: 'Готовим специально для вас. Только после заказа — свой соус, свежий имбирь и настоящий васаби.',
    composition: 'Креветка, панко, лосось, рис, огурец, соус спайси, соевый соус.',
    allergens: ['рыба', 'морепродукты', 'глютен', 'соя', 'яйца'],
    pairs: ['d-miso', 'd-latte', 'd-cheese'],
    available: true,
    modifiers: [
      { id: 'spicy', name: 'Острый соус чили', price: 50 }
    ]
  },
  {
    id: 'd-sing', name: 'Сингапурский ролл', price: 620, cat: 'rolls',
    unit: '8 шт. · 250 г', img: 'assets/singapore.jpg',
    desc: 'Лосось, манго, авокадо и кунжут в сладком соусе. Летний вкус в каждом кусочке.',
    composition: 'Рис, лосось, манго, авокадо, кунжут, водоросли нори, сладкий соус, соевый соус.',
    allergens: ['рыба', 'соя', 'кунжут'],
    pairs: ['d-miso', 'd-cheese', 'd-latte'],
    available: true
  },
  {
    id: 'd-baked', name: 'Запечённый с лососем', price: 650, cat: 'baked',
    unit: '8 шт. · 260 г', img: 'assets/baked-roll.jpg',
    desc: 'Тёплый ролл с лососем, сливочным сыром и спайси-соусом в хрустящей корочке.',
    composition: 'Рис, лосось, сливочный сыр, спайси-соус, водоросли нори, кунжут, соевый соус.',
    allergens: ['рыба', 'соя', 'глютен', 'кунжут', 'молоко', 'яйца'],
    pairs: ['d-miso', 'd-cheese', 'd-latte'],
    available: true
  },
  {
    id: 'd-sashimi', name: 'Сашими микс', price: 890, cat: 'sushi',
    unit: '16 шт. · 220 г', img: 'assets/sashimi.jpg',
    desc: 'Лосось, тунец и оливковый морской орех. Подаём со льдом, васаби и имбирём.',
    composition: 'Лосось, тунец, оливковый морской орех, васаби, имбирь.',
    allergens: ['рыба', 'морепродукты'],
    pairs: ['d-latte', 'd-miso', 'd-cheese'],
    available: true
  },
  {
    id: 'd-miso', name: 'Мисо-суп', price: 390, cat: 'hot',
    unit: '350 мл', img: 'assets/miso-soup.jpg',
    desc: 'Тофу, водоросли, вакамэ и кунжут. Лёгкий горячий суп, который отлично идёт к роллам.',
    composition: 'Тофу, водоросли вакамэ, кунжут, соевый бульон, соевый соус.',
    allergens: ['соя', 'кунжут', 'глютен'],
    pairs: ['d-temp', 'd-latte'],
    available: true
  },
  {
    id: 'd-cheese', name: 'Чизкейс «Васаби»', price: 450, cat: 'desserts',
    unit: '160 г', img: 'assets/cheesecake.jpg',
    desc: 'Матча, сливочный сыр и цедра лайма. Нежный десерт, который легко делить на двоих.',
    composition: 'Матча, сливочный сыр, сливки, сахар, цедра лайма, пшеничная мука.',
    allergens: ['молоко', 'глютен'],
    pairs: ['d-latte'],
    available: true
  },
  {
    id: 'd-latte', name: 'Латте «Васаби»', price: 320, cat: 'drinks',
    unit: '400 мл', img: 'assets/latte.jpg',
    desc: 'Холодный матча-латте на молоке. Без сахара — или с лёгкой сладостью, как вам больше нравится.',
    composition: 'Матча, молоко, лёд.',
    allergens: ['молоко'],
    pairs: ['d-cheese', 'd-temp'],
    available: true
  }
];

/* Фото блюд: новую позицию в админке можно положить на любой снимок из набора */
const DISH_IMAGES = [
  'assets/sushi-boat.jpg', 'assets/philadelphia.jpg', 'assets/california.jpg',
  'assets/tempura.jpg', 'assets/sashimi.jpg', 'assets/cheesecake.jpg', 'assets/latte.jpg',
  'assets/singapore.jpg', 'assets/baked-roll.jpg', 'assets/miso-soup.jpg'
];

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

/* Единый демо-счёт гостя: профиль, оплата и база клиентов читают один баланс. */
const ADMIN_CLIENTS = [
  { name:'Сергей',   phone:'+7 900 000-00-01', orders:12, sum:14890, bonus:742, segment:'Постоянный', last:'сегодня', history:[] },
  { name:'Анна',     phone:'+7 916 330-12-04', orders:7,  sum:8240,  bonus:412, segment:'Постоянный', last:'вчера', history:[] },
  { name:'Дмитрий',  phone:'+7 903 118-77-21', orders:3,  sum:3170,  bonus:158, segment:'Новый',       last:'3 дня назад', history:[] },
  { name:'Мария',    phone:'+7 985 402-19-55', orders:1,  sum:1690,  bonus:84,  segment:'Новый',       last:'неделя назад', history:[] },
  { name:'Ольга',    phone:'+7 926 640-08-31', orders:19, sum:24310, bonus:1215,segment:'VIP',         last:'2 дня назад', history:[] },
  { name:'Игорь',    phone:'+7 891 003-92-44', orders:2,  sum:1580,  bonus:79,  segment:'Спящий',      last:'3 недели назад', history:[] }
];

const RULES = {
  deliveryPrice: 199,
  freeDeliveryFrom: 1500,
  minOrder: 300,
  bonusEnabled: true,
  bonusAccrual: 5,      // % кэшбэка от блюд после промокода, без доставки
  bonusMaxPay: 30,      // максимум оплаты бонусами, % от суммы блюд после промокода
  bonusExpiryMonths: 12, // срок списания начисленных баллов, месяцев (0 — не сгорают)
  prepTime: '45–60 мин',
  prepTable: '20–25 мин к столу',   // заказ из QR-меню в зале
  leadDelivery: 60,     // минут от заказа до готовности при доставке
  leadPickup: 30,      // минут от заказа до готовности при самовывозе
  slotStep: 30,         // шаг слотов времени, минут
  lastOrderSlot: 60,    // за сколько минут до закрытия последний слот недоступен
  featuredMax: 6        // сколько блюд помещается в ленту «Попробуйте любимое» на главной
};

const PROMOS = [
  { code: 'WASABI10', type: 'percent', value: 10, label: '−10% на заказ', min: 0, active: true },
  { code: 'SETHI',    type: 'fixed',   value: 200, label: '−200 ₽', min: 1000, active: true },
  { code: 'DOSTAVKA', type: 'delivery',value: 0,  label: 'Бесплатная доставка', min: 0, active: true },
  { code: 'VASABI',   type: 'percent', value: 15, label: '−15% только в приложении', min: 500, appOnly: true, active: true }
];

/* Акции главной: один список на карусель гостя, экран «Акции» и переключатели админки.
   kind решает, что делает тап: dish — открыть блюдо, promo — применить код,
   screen — перейти на экран. active выключает акцию у гостя без правки кода,
   порядок в списке = порядок карточек в карусели. */
const BANNERS = [
  {
    id: 'b-app15', kind: 'promo', code: 'VASABI', active: true,
    tag: '−15%', img: 'assets/sashimi.jpg',
    title: 'Скидка 15% только в приложении.',
    sub: 'Промокод VASABI · от 500 ₽', cta: 'Применить код'
  },
  {
    id: 'b-delivery', kind: 'promo', code: 'DOSTAVKA', active: true,
    tag: 'Доставка 0 ₽', img: 'assets/california.jpg',
    title: 'Бесплатная доставка от 1 500 ₽.',
    sub: 'В пределах 3 км от ресторана', cta: 'Применить код'
  },
  {
    id: 'b-set200', kind: 'promo', code: 'SETHI', active: true,
    tag: '−200 ₽', img: 'assets/sushi-boat.jpg',
    title: 'Минус 200 ₽ на большой заказ.',
    sub: 'Промокод SETHI · от 1 000 ₽', cta: 'Применить код'
  },
  {
    id: 'b-tempura', kind: 'dish', dish: 'd-temp', active: true,
    tag: '−10%', img: 'assets/tempura.jpg',
    title: 'Темпура с лососем — горячий хит.',
    sub: '6 шт. · готовим после заказа', cta: 'Открыть блюдо'
  },
  {
    id: 'b-bonus', kind: 'screen', screen: 'profile', active: true,
    tag: 'Бонусы', img: 'assets/cheesecake.jpg',
    title: 'Кэшбэк баллами с каждого заказа.',
    sub: '1 балл = 1 ₽ · правила в профиле', cta: 'Мои бонусы'
  },
  {
    id: 'b-lunch', kind: 'dish', dish: 'd-phil', active: false,
    tag: 'Обед', img: 'assets/philadelphia.jpg',
    title: 'Обед в подарок.',
    sub: '«Филадельфия» к сету при заказе после 12:00', cta: 'Выбрать сет'
  }
];

const activeBanners = () => BANNERS.filter(b => b.active);
const activePromos = () => PROMOS.filter(p => p.active);

/* Причины отказа ресторана — из них оператор выбирает в админ-панели */
const REJECT_REASONS = [
  'Закончился свежий лосось',
  'Нет свободного курьера в этом районе',
  'Ресторан не работает в этот час',
  'Кухня не успевает принять заказ'
];

const STATUS_FLOW = [
  { key: 'new',      title: 'Заказ принят',        sub: 'Оператор подтвердил заказ',        time: '15:02' },
  { key: 'cooking',  title: 'Готовим на кухне',    sub: 'Шеф-повар уже знает ваш заказ',     time: '15:05' },
  { key: 'courier',  title: 'Курьер получил заказ', sub: 'Иван, велокурьер · из ресторана',  time: '15:20' },
  { key: 'way',      title: 'В пути',              sub: 'Приедем за 45–60 минут',            time: '15:25' },
  { key: 'done',     title: 'Доставлено',          sub: 'Приятного аппетита!',               time: '15:47' }
];

const STATUS_LABEL = {
  new: 'Новый', cooking: 'Готовится', courier: 'Передан курьеру',
  way: 'В пути', done: 'Доставлен', ready: 'Собран к выдаче',
  cancelled: 'Отменён', rejected: 'Отказ ресторана'
};

/* Заказ из QR-меню в зале идёт по своей цепочке — без курьера */
const STATUS_FLOW_TABLE = [
  { key: 'new',     title: 'Заказ принят',       sub: 'Оператор передал заказ на кухню',   time: '15:02' },
  { key: 'cooking', title: 'Готовим на кухне',    sub: 'Шеф-повар уже знает ваш заказ',      time: '15:05' },
  { key: 'ready',   title: 'Заказ собран',        sub: 'Официант забирает с выдачи',         time: '15:18' },
  { key: 'done',    title: 'Подан к столу',       sub: 'Приятного аппетита!',                time: '15:24' }
];

const flowFor = o => o && o.deliveryType === 'table' ? STATUS_FLOW_TABLE : STATUS_FLOW;
const statusLabel = o => (o.deliveryType === 'table' && o.status === 'done' ? 'Подан к столу' : (STATUS_LABEL[o.status] || o.status));

/* Статусы, при которых заказ не готовится — клиент видит отдельный экран */
const DEAD_STATUSES = ['cancelled', 'rejected'];

const LOCATIONS = [
  { id: 'l1', name: 'Васаби на Ташкентской', address: 'Москва, ул. Ташкентская, 19', hours: '11:00 — 23:00', delivery: 'Доставка от 199 ₽', open: '11:00', close: '23:00', service:'delivery' },
  { id: 'l2', name: 'Васаби на Мичурина',    address: 'Москва, ул. Мичурина, 32',    hours: '11:00 — 23:00', delivery: 'Доставка от 199 ₽', open: '11:00', close: '23:00', service:'delivery' },
  { id: 'l3', name: 'Васаби на Патриарших',  address: 'Москва, Патриаршие пруды, 7', hours: '12:00 — 23:00', delivery: 'Самовывоз от 20 мин', open: '12:00', close: '23:00', service:'pickup' }
];

const STAFF_ROLES = {
  admin:    { label:'Администратор',  description:'меню, заказы, отчёты, точки и сотрудники' },
  operator: { label:'Оператор заказов', description:'приём заказов, статусы и печать чека' },
  courier:  { label:'Курьер',          description:'выдача заказа и статус доставки' }
};

const ADMIN_STAFF = [
  { id:'s1', name:'Мария',   phone:'+7 900 000-00-11', role:'operator' },
  { id:'s2', name:'Алексей', phone:'+7 900 000-00-12', role:'admin' },
  { id:'s3', name:'Иван',    phone:'+7 900 000-00-13', role:'courier' }
];

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[ch]));
