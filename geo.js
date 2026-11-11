/* --------------------------- карта и зоны доставки ---------------------------
   Leaflet лежит в папке проекта, картинки карты — бесплатный OpenStreetMap,
   поиск адреса — Photon (без ключа и оплаты). Всё живёт в памяти вкладки,
   как и остальной прототип: сервера у демо нет.

   Карта нужна только там, где гость выбирает точку самовывоза. Зона доставки
   проверяется по адресу без карты: адрес ищется, а ответ приложение даёт словами.
   Если интернета нет, экран остаётся рабочим: карта пустая, точку выбирают
   из списка под ней, адрес вводится текстом. Пустого экрана не будет. */

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR = '© OpenStreetMap';
const PHOTON_URL = 'https://photon.komoot.io/api/';

const geo = {
  locId: null,        // точка ресторана, в зоне которой оказался адрес
  status: 'idle',     // idle | searching | found | outside | failed
  km: 0,              // расстояние от адреса до точки ресторана, км
  nearest: null,      // ближайшая точка, когда адрес вне зоны
  checkedAddress: '', // адрес, для которого считался ответ зоны
  maps: new Map(),    // id элемента -> карта Leaflet
  cache: new Map()    // адрес -> { lat, lng, label }
};

const geoKm = (a, b) => {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

/* Точка без координат на карте (её только что добавили в панели) — её не рисуем */
const geoHasCoords = l => l && typeof l.lat === 'number' && typeof l.lng === 'number';

const geoFormatKm = km => km < 1 ? Math.round(km * 100) + ' м' : km.toFixed(1).replace('.', ',') + ' км';

/* Точка, из которой мы доезжаем: ближайшая, у которой радиус зоны накрывает адрес */
const geoZoneFor = (lat, lng) => {
  let best = null;
  LOCATIONS.forEach(l => {
    if (l.service !== 'delivery' || !(l.zoneKm > 0)) return;
    if (!geoHasCoords(l)) return;
    const km = geoKm({ lat, lng }, { lat: l.lat, lng: l.lng });
    if (km <= l.zoneKm && (!best || km < best.km)) best = { loc: l, km };
  });
  return best;
};

/* Ближайшая точка доставки — нужна, чтобы честно сказать, где она и почему не подходит */
const geoNearest = (lat, lng) => {
  let best = null;
  LOCATIONS.forEach(l => {
    if (l.service !== 'delivery') return;
    if (!geoHasCoords(l)) return;
    const km = geoKm({ lat, lng }, { lat: l.lat, lng: l.lng });
    if (!best || km < best.km) best = { loc: l, km };
  });
  return best;
};

/* Ближайшая точка среди всех — для выбора точки самовывоза на карте */
const geoNearestAny = (lat, lng) => {
  let best = null;
  LOCATIONS.forEach(l => {
    if (!geoHasCoords(l)) return;
    const km = geoKm({ lat, lng }, { lat: l.lat, lng: l.lng });
    if (!best || km < best.km) best = { loc: l, km };
  });
  return best;
};

/* Адрес вида «Москва, ул. Ташкентская, 19, кв. 42» поисковик не понимает:
   убираем квартиру, подъезд и этаж, а сокращения разворачиваем в слова. */
const GEO_DROP = /^(кв\.?|квартира|стр\.?|строение|подъезд|этаж|д\.|дом|корп\.?|корпус|мкр\.?|микрорайон|блок)/i;
const GEO_ABBR = [
  [/\bул\.?\s*/gi, 'улица '], [/\bнаб\.?\s*/gi, 'набережная '],
  [/\bпр\.?\s*/gi, 'проспект '], [/\bпер\.?\s*/gi, 'переулок '],
  [/\bш\.?\s*/gi, 'шоссе '], [/\bбул\.?\s*/gi, 'бульвар '],
  [/\bпл\.?\s*/gi, 'площадь '], [/\bпроезд\.\s*/gi, 'проезд ']
];

const geoClean = (text, parts) => GEO_ABBR.reduce(
  (s, r) => s.replace(r[0], r[1]),
  parts.join(', ').replace(/\s+/g, ' ').trim()
);

const geoQueries = (text) => {
  const parts = (text || '').split(',').map(s => s.trim()).filter(Boolean);
  const kept = parts.filter(p => !GEO_DROP.test(p));
  const list = [geoClean(text, kept)];
  if (kept.length > 1) list.push(geoClean(text, kept.slice(1)));
  if (kept.length > 2) list.push(geoClean(text, kept.slice(0, 2)));
  return [...new Set(list.filter(Boolean))];
};

const geoLookup = async (text) => {
  const key = (text || '').trim().toLowerCase();
  if (!key) return null;
  if (geo.cache.has(key)) return geo.cache.get(key);
  for (const q of geoQueries(text)){
    try {
      const res = await fetch(PHOTON_URL + '?limit=1&q=' + encodeURIComponent(q));
      if (!res.ok) continue;
      const data = await res.json();
      const f = data.features && data.features[0];
      if (!f) continue;
      const hit = {
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        label: f.properties.street
          ? [f.properties.street, f.properties.housenumber].filter(Boolean).join(', ')
          : (f.properties.name || q)
      };
      geo.cache.set(key, hit);
      return hit;
    } catch (err) {
      /* сеть недоступна — пробуем следующий вариант запроса */
    }
  }
  return null;
};

/* --------------------------------- карта ---------------------------------- */

function geoMount(el, opts = {}){
  if (!el || typeof L === 'undefined') return null;
  const old = geo.maps.get(el.id);
  if (old){
    if (old._container === el) return old;
    old.remove();
    geo.maps.delete(el.id);
  }
  const map = L.map(el, {
    zoomControl: opts.zoomControl !== false,
    attributionControl: true,
    scrollWheelZoom: false
  });
  L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);
  geo.maps.set(el.id, map);
  requestAnimationFrame(() => map.invalidateSize());
  return map;
}

/* Зоны доставки и точки ресторана — на карте выбора точки самовывоза */
function geoDraw(map, opts = {}){
  if (!map) return;
  const drawn = map._vasabiLayers || (map._vasabiLayers = L.layerGroup().addTo(map));
  drawn.clearLayers();

  const bounds = [];
  LOCATIONS.forEach(l => {
    if (!geoHasCoords(l)) return;
    if (l.zoneKm > 0){
      L.circle([l.lat, l.lng], {
        radius: l.zoneKm * 1000,
        color: '#c6f16e', weight: 1.5, fillColor: '#c6f16e', fillOpacity: 0.13
      }).addTo(drawn);
    }
    const isSel = opts.locId === l.id;
    L.circleMarker([l.lat, l.lng], {
      radius: isSel ? 8 : 6,
      color: isSel ? '#c6f16e' : '#ffffff',
      weight: 2,
      fillColor: '#1b1b1f', fillOpacity: 1
    }).addTo(drawn).bindPopup(`<b>${l.name}</b><br>${l.address}<br>${l.hours}`);
    bounds.push([l.lat, l.lng]);
  });

  if (opts.fit !== false && bounds.length){
    map.fitBounds(L.latLngBounds(bounds).pad(0.35), { animate: false });
  }
}

/* Точка, поставленная кликом по карте: гость сам показывает, куда привозить */
function geoPickByClick(map, cb){
  if (!map) return;
  map.on('click', ev => cb({ lat: ev.latlng.lat, lng: ev.latlng.lng, label: 'Точка на карте' }));
}
