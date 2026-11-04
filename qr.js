/* =========================================================================
   QR — генератор QR-кодов без внешних библиотек
   Byte mode, уровни коррекции L и M, версии 1–10
   ========================================================================= */

const QR = (() => {

  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  (function initGF(){
    let x = 1;
    for (let i = 0; i < 255; i++){
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11D;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  const mul = (a, b) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];

  function genPoly(degree){
    let poly = [1];
    for (let i = 0; i < degree; i++){
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++){
        next[j] ^= poly[j];
        next[j + 1] ^= mul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  function ecBytes(data, count){
    const gen = genPoly(count);
    const rem = new Array(count).fill(0);
    for (const byte of data){
      const factor = byte ^ rem[0];
      rem.shift();
      rem.push(0);
      if (factor) for (let i = 0; i < count; i++) rem[i] ^= mul(gen[i + 1], factor);
    }
    return rem;
  }

  // [ec на блок, блоков группа 1, кодовых слов в блоке гр.1, блоков гр.2, слов в блоке гр.2]
  const RS = {
    L: [[7,1,19,0,0],[10,1,34,0,0],[15,1,55,0,0],[20,1,80,0,0],[26,1,108,0,0],
        [18,2,68,0,0],[20,2,78,0,0],[24,2,97,0,0],[30,2,116,0,0],[18,2,68,2,69]],
    M: [[10,1,16,0,0],[16,1,28,0,0],[26,1,44,0,0],[18,2,32,0,0],[24,2,43,0,0],
        [16,4,27,0,0],[18,4,31,0,0],[22,2,38,2,39],[22,3,36,2,37],[26,4,43,1,44]]
  };
  const TOTAL = [26,44,70,100,134,172,196,242,292,346];
  const ALIGN = [null, null, [6,18], [6,22], [6,26], [6,30], [6,34], [6,22,38], [6,24,42], [6,26,46], [6,28,50]];
  const EC_BITS = { L:1, M:0 };

  function utf8Bytes(text){
    return Array.from(new TextEncoder().encode(text));
  }

  function dataCodewords(bytes, version, ec){
    const [ecLen, b1, d1, b2, d2] = RS[ec][version - 1];
    const blocks = b1 + b2;
    const capacity = TOTAL[version - 1] - ecLen * blocks;
    const ccBits = version < 10 ? 8 : 16;

    const bits = [];
    const push = (value, len) => {
      for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
    };
    push(4, 4);
    push(bytes.length, ccBits);
    for (const b of bytes) push(b, 8);

    const limit = capacity * 8;
    for (let i = 0; i < 4 && bits.length < limit; i++) bits.push(0);
    while (bits.length % 8) bits.push(0);

    const data = [];
    for (let i = 0; i < bits.length; i += 8){
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      data.push(b);
    }
    const pad = [0xEC, 0x11];
    let pi = 0;
    while (data.length < capacity) data.push(pad[pi++ % 2]);

    const chunks = [];
    let k = 0;
    for (let i = 0; i < b1; i++){ chunks.push(data.slice(k, k + d1)); k += d1; }
    for (let i = 0; i < b2; i++){ chunks.push(data.slice(k, k + d2)); k += d2; }
    const eccs = chunks.map(c => ecBytes(c, ecLen));

    const out = [];
    const maxLen = Math.max(d1, d2);
    for (let i = 0; i < maxLen; i++)
      for (const c of chunks) if (i < c.length) out.push(c[i]);
    for (let i = 0; i < ecLen; i++)
      for (const c of eccs) out.push(c[i]);
    return out;
  }

  function formatBits(ec, mask){
    const data = (EC_BITS[ec] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    return ((data << 10) | rem) ^ 0x5412;
  }

  function versionBits(version){
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
    return (version << 12) | rem;
  }

  function maskAt(mask, x, y){
    switch (mask){
      case 0: return (x + y) % 2 === 0;
      case 1: return y % 2 === 0;
      case 2: return x % 3 === 0;
      case 3: return (x + y) % 3 === 0;
      case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
      case 5: return (x * y) % 2 + (x * y) % 3 === 0;
      case 6: return ((x * y) % 2 + (x * y) % 3) % 2 === 0;
      default: return ((x + y) % 2 + (x * y) % 3) % 2 === 0;
    }
  }

  const P_A = [1,0,1,1,1,0,1,0,0,0,0];
  const P_B = [0,0,0,0,1,0,1,1,1,0,1];

  function penalty(modules, size){
    let score = 0;

    const line = (get) => {
      let run = 1;
      for (let i = 0; i < size; i++){
        if (i > 0 && get(i) === get(i - 1)){
          run++;
          if (run === 5) score += 3;
          else if (run > 5) score += 1;
        } else {
          run = 1;
        }
      }
    };
    for (let y = 0; y < size; y++) line(x => modules[y][x]);
    for (let x = 0; x < size; x++) line(y => modules[y][x]);

    for (let y = 0; y < size - 1; y++)
      for (let x = 0; x < size - 1; x++){
        const v = modules[y][x];
        if (v === modules[y][x + 1] && v === modules[y + 1][x] && v === modules[y + 1][x + 1]) score += 3;
      }

    const countPatterns = (get) => {
      let hits = 0;
      for (let i = 0; i < size; i++){
        for (let j = 0; j + 11 <= size; j++){
          let okA = true, okB = true;
          for (let k = 0; k < 11; k++){
            const v = get(i, j + k);
            if (v !== P_A[k]) okA = false;
            if (v !== P_B[k]) okB = false;
          }
          if (okA) hits++;
          if (okB) hits++;
        }
      }
      return hits;
    };
    score += 40 * countPatterns((y, x) => modules[y][x]);
    score += 40 * countPatterns((x, y) => modules[y][x]);

    let dark = 0;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (modules[y][x]) dark++;
    const percent = (dark * 100) / (size * size);
    score += Math.floor(Math.abs(percent - 50) / 5) * 10;

    return score;
  }

  function matrix(text, ecLevel = 'M', opts = {}){
    const bytes = utf8Bytes(text);
    const ec = RS[ecLevel] ? ecLevel : 'M';

    let version = 0;
    if (opts.version){
      version = opts.version;
    } else {
      for (let v = 1; v <= RS[ec].length; v++){
        const [ecLen, b1, , b2] = RS[ec][v - 1];
        const capacity = TOTAL[v - 1] - ecLen * (b1 + b2);
        const needed = 4 + (v < 10 ? 8 : 16) + bytes.length * 8;
        if (needed <= capacity * 8){ version = v; break; }
      }
    }
    if (!version) throw new Error('Ссылка слишком длинная для QR-кода');

    const codewords = dataCodewords(bytes, version, ec);
    const size = version * 4 + 17;
    const modules = Array.from({ length: size }, () => new Array(size).fill(0));
    const isFn = Array.from({ length: size }, () => new Array(size).fill(false));

    const setFn = (x, y, dark) => {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      modules[y][x] = dark ? 1 : 0;
      isFn[y][x] = true;
    };

    // поисковые узоры и разделители
    const finder = (cx, cy) => {
      for (let dy = -1; dy <= 7; dy++)
        for (let dx = -1; dx <= 7; dx++){
          const ring = (dx >= 0 && dx <= 6 && (dy === 0 || dy === 6)) ||
                       (dy >= 0 && dy <= 6 && (dx === 0 || dx === 6));
          const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
          setFn(cx + dx, cy + dy, ring || core);
        }
    };
    finder(0, 0);
    finder(size - 7, 0);
    finder(0, size - 7);

    // синхрополосы
    for (let i = 8; i < size - 8; i++){
      const v = i % 2 === 0 ? 1 : 0;
      setFn(i, 6, v);
      setFn(6, i, v);
    }

    // выравнивающие узоры
    const apos = ALIGN[version];
    if (apos){
      for (const ay of apos)
        for (const ax of apos){
          if ((ax === 6 && ay === 6) ||
              (ax === 6 && ay === size - 7) ||
              (ax === size - 7 && ay === 6)) continue;
          for (let dy = -2; dy <= 2; dy++)
            for (let dx = -2; dx <= 2; dx++)
              setFn(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
    }

    // тёмный модуль
    setFn(8, size - 8, true);

    // места под информацию о формате — их не занимают данные
    for (let i = 0; i <= 5; i++) isFn[i][8] = true;
    isFn[7][8] = true;
    isFn[8][8] = true;
    isFn[8][7] = true;
    for (let i = 9; i < 15; i++) isFn[8][14 - i] = true;
    for (let i = 0; i < 8; i++) isFn[8][size - 1 - i] = true;
    for (let i = 8; i < 15; i++) isFn[size - 15 + i][8] = true;

    // информация о версии (с 7-й)
    if (version >= 7){
      const vbits = versionBits(version);
      for (let i = 0; i < 18; i++){
        const bit = ((vbits >>> i) & 1) === 1;
        const a = size - 11 + (i % 3);
        const b = Math.floor(i / 3);
        setFn(a, b, bit);
        setFn(b, a, bit);
      }
    }

    // размещение данных зигзагом
    let bitIndex = 0;
    for (let right = size - 1; right >= 1; right -= 2){
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++){
        for (let j = 0; j < 2; j++){
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? size - 1 - vert : vert;
          if (isFn[y][x]) continue;
          let dark = 0;
          if (bitIndex < codewords.length * 8){
            dark = (codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1;
            bitIndex++;
          }
          modules[y][x] = dark;
        }
      }
    }

    const drawFormat = (mask, target) => {
      const bits = formatBits(ec, mask);
      const get = i => ((bits >>> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) target[i][8] = get(i) ? 1 : 0;
      target[7][8] = get(6) ? 1 : 0;
      target[8][8] = get(7) ? 1 : 0;
      target[8][7] = get(8) ? 1 : 0;
      for (let i = 9; i < 15; i++) target[8][14 - i] = get(i) ? 1 : 0;
      for (let i = 0; i < 8; i++) target[8][size - 1 - i] = get(i) ? 1 : 0;
      for (let i = 8; i < 15; i++) target[size - 15 + i][8] = get(i) ? 1 : 0;
      target[size - 8][8] = 1;
    };

    // выбор маски по минимальному штрафу
    let best = 0;
    let bestScore = Infinity;
    let bestModules = null;
    for (let mask = 0; mask < 8; mask++){
      if (opts.mask != null && mask !== opts.mask) continue;
      const cand = modules.map(row => row.slice());
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
          if (!isFn[y][x] && maskAt(mask, x, y)) cand[y][x] ^= 1;
      drawFormat(mask, cand);
      const score = penalty(cand, size);
      if (score < bestScore){ bestScore = score; best = mask; bestModules = cand; }
    }

    return { modules: bestModules, size, version, ec: ecLevel, mask: best, codewords };
  }

  function svg(text, opts = {}){
    const m = matrix(text, opts.ec, opts);
    const margin = opts.margin == null ? 4 : opts.margin;
    const dim = m.size + margin * 2;
    let path = '';
    for (let y = 0; y < m.size; y++)
      for (let x = 0; x < m.size; x++)
        if (m.modules[y][x]) path += `M${x + margin} ${y + margin}h1v1h-1z`;
    const px = (opts.px || 8) * dim;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" width="${px}" height="${px}" shape-rendering="crispEdges" role="img" aria-label="QR-код"><rect width="${dim}" height="${dim}" fill="${opts.light || '#FFFFFF'}"/><path d="${path}" fill="${opts.dark || '#080B08'}"/></svg>`;
  }

  function png(text, opts = {}){
    const m = matrix(text, opts.ec, opts);
    const scale = opts.scale || 10;
    const margin = opts.margin == null ? 4 : opts.margin;
    const dim = (m.size + margin * 2) * scale;
    const canvas = document.createElement('canvas');
    canvas.width = dim;
    canvas.height = dim;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = opts.light || '#FFFFFF';
    ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = opts.dark || '#080B08';
    for (let y = 0; y < m.size; y++)
      for (let x = 0; x < m.size; x++)
        if (m.modules[y][x]) ctx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale);
    return canvas.toDataURL('image/png');
  }

  return { matrix, svg, png };
})();
