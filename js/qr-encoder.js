/* Daily Tools — QR Code Encoder (byte mode, error correction level M)
   Implements ISO/IEC 18004 well enough for versions 1-10, byte mode, EC level M.
   No external dependencies. */
(function (global) {
  "use strict";

  /* ---------------- GF(256) arithmetic (primitive poly 0x11d) -------- */
  const EXP = new Array(512);
  const LOG = new Array(256);
  (function buildTables() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly; // highest-degree coefficient first
  }

  function rsEncode(dataCodewords, ecCount) {
    const gen = rsGeneratorPoly(ecCount);
    const result = dataCodewords.slice();
    for (let i = 0; i < ecCount; i++) result.push(0);
    for (let i = 0; i < dataCodewords.length; i++) {
      const coef = result[i];
      if (coef === 0) continue;
      for (let j = 0; j < gen.length; j++) {
        result[i + j] ^= gfMul(gen[j], coef);
      }
    }
    return result.slice(dataCodewords.length);
  }

  /* ---------------- Version tables (Byte mode, EC level M) ----------- */
  /* [totalDataCodewords, ecCodewordsPerBlock, [ [blockCount, dataCwPerBlock], ... ] ] */
  const VERSION_TABLE = {
    1: { ec: 10, blocks: [[1, 16]] },
    2: { ec: 16, blocks: [[1, 28]] },
    3: { ec: 26, blocks: [[1, 44]] },
    4: { ec: 18, blocks: [[2, 32]] },
    5: { ec: 24, blocks: [[2, 43]] },
    6: { ec: 16, blocks: [[4, 27]] },
    7: { ec: 18, blocks: [[4, 31]] },
    8: { ec: 22, blocks: [[2, 38], [2, 39]] },
    9: { ec: 22, blocks: [[3, 36], [2, 37]] },
    10: { ec: 26, blocks: [[4, 43], [1, 44]] },
  };

  const ALIGNMENT_POSITIONS = {
    1: [],
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
    6: [6, 34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50],
  };

  function moduleCount(version) {
    return 21 + (version - 1) * 4;
  }

  function totalDataCodewords(version) {
    const t = VERSION_TABLE[version];
    return t.blocks.reduce((sum, [count, cw]) => sum + count * cw, 0);
  }

  function pickVersion(byteLength) {
    for (let v = 1; v <= 10; v++) {
      const t = VERSION_TABLE[v];
      const countIndicatorBits = v <= 9 ? 8 : 16;
      const capacityBits = totalDataCodewords(v) * 8;
      const overheadBits = 4 + countIndicatorBits;
      const maxDataBits = capacityBits - overheadBits;
      const maxBytes = Math.floor(maxDataBits / 8);
      if (byteLength <= maxBytes) return v;
    }
    return null; // too long
  }

  /* ---------------- Data encoding (byte mode) ------------------------- */
  function textToUtf8Bytes(str) {
    return Array.from(new TextEncoder().encode(str));
  }

  function buildDataCodewords(version, bytes) {
    const t = VERSION_TABLE[version];
    const totalCw = totalDataCodewords(version);
    const countIndicatorBits = version <= 9 ? 8 : 16;

    const bits = [];
    const pushBits = (value, len) => {
      for (let i = len - 1; i >= 0; i--) bits.push((value >> i) & 1);
    };

    pushBits(0b0100, 4); // byte mode indicator
    pushBits(bytes.length, countIndicatorBits);
    bytes.forEach((b) => pushBits(b, 8));

    // Terminator (up to 4 bits of 0)
    const capacityBits = totalCw * 8;
    for (let i = 0; i < 4 && bits.length < capacityBits; i++) bits.push(0);

    // Pad to a byte boundary
    while (bits.length % 8 !== 0) bits.push(0);

    // Convert to codewords
    const codewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
      codewords.push(byte);
    }

    // Pad codewords with alternating 0xEC / 0x11
    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (codewords.length < totalCw) {
      codewords.push(padBytes[padIdx % 2]);
      padIdx++;
    }

    return codewords;
  }

  function splitIntoBlocksAndEncode(version, dataCodewords) {
    const t = VERSION_TABLE[version];
    const blocks = [];
    let offset = 0;
    t.blocks.forEach(([count, cwPerBlock]) => {
      for (let i = 0; i < count; i++) {
        const block = dataCodewords.slice(offset, offset + cwPerBlock);
        offset += cwPerBlock;
        const ec = rsEncode(block, t.ec);
        blocks.push({ data: block, ec });
      }
    });
    return blocks;
  }

  function interleave(blocks) {
    const maxData = Math.max(...blocks.map((b) => b.data.length));
    const maxEc = Math.max(...blocks.map((b) => b.ec.length));
    const out = [];
    for (let i = 0; i < maxData; i++) {
      blocks.forEach((b) => {
        if (i < b.data.length) out.push(b.data[i]);
      });
    }
    for (let i = 0; i < maxEc; i++) {
      blocks.forEach((b) => {
        if (i < b.ec.length) out.push(b.ec[i]);
      });
    }
    return out;
  }

  /* ---------------- Matrix construction ------------------------------- */
  function createMatrix(version) {
    const n = moduleCount(version);
    const modules = Array.from({ length: n }, () => new Array(n).fill(null));
    const isFunction = Array.from({ length: n }, () => new Array(n).fill(false));

    function setFunc(r, c, val) {
      if (r < 0 || r >= n || c < 0 || c >= n) return;
      modules[r][c] = val;
      isFunction[r][c] = true;
    }

    function placeFinder(r, c) {
      for (let dr = -1; dr <= 7; dr++) {
        for (let dc = -1; dc <= 7; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          if (rr < 0 || rr >= n || cc < 0 || cc >= n) continue;
          const isBorder = dr === -1 || dr === 7 || dc === -1 || dc === 7;
          const inner = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
          let val = 0;
          if (inner) {
            const onRing = dr === 0 || dr === 6 || dc === 0 || dc === 6;
            const core = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
            val = onRing || core ? 1 : 0;
          } else if (isBorder) {
            val = 0; // separator (white)
          }
          setFunc(rr, cc, val);
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(0, n - 7);
    placeFinder(n - 7, 0);

    // Timing patterns
    for (let i = 8; i < n - 8; i++) {
      const val = i % 2 === 0 ? 1 : 0;
      setFunc(6, i, val);
      setFunc(i, 6, val);
    }

    // Alignment patterns
    const positions = ALIGNMENT_POSITIONS[version];
    positions.forEach((r) => {
      positions.forEach((c) => {
        // skip if overlapping a finder pattern corner
        const nearTL = r < 9 && c < 9;
        const nearTR = r < 9 && c > n - 9;
        const nearBL = r > n - 9 && c < 9;
        if (nearTL || nearTR || nearBL) return;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const dist = Math.max(Math.abs(dr), Math.abs(dc));
            setFunc(r + dr, c + dc, dist === 1 ? 0 : 1);
          }
        }
      });
    });

    // Dark module (always 1)
    setFunc(n - 8, 8, 1);

    // Reserve format info areas (value doesn't matter yet, just mark as function)
    for (let i = 0; i < 9; i++) {
      if (modules[8][i] === null) setFunc(8, i, 0);
      if (modules[i] && modules[i][8] === null) setFunc(i, 8, 0);
    }
    for (let i = 0; i < 8; i++) {
      setFunc(8, n - 1 - i, 0);
    }
    for (let i = 8; i < 15; i++) {
      setFunc(n - 15 + i, 8, 0);
    }
    setFunc(8, 8, 0);

    // Reserve version info areas (version >= 7) — not needed for versions <= 6
    if (version >= 7) {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 3; c++) {
          setFunc(r, n - 11 + c, 0);
          setFunc(n - 11 + c, r, 0);
        }
      }
    }

    return { n, modules, isFunction };
  }

  function placeData(matrixObj, codewords) {
    const { n, modules, isFunction } = matrixObj;
    const bits = [];
    codewords.forEach((cw) => {
      for (let i = 7; i >= 0; i--) bits.push((cw >> i) & 1);
    });
    let bitIndex = 0;

    let col = n - 1;
    let upward = true;
    while (col > 0) {
      if (col === 6) col--; // skip vertical timing column
      for (let i = 0; i < n; i++) {
        const row = upward ? n - 1 - i : i;
        for (let dc = 0; dc < 2; dc++) {
          const cc = col - dc;
          if (isFunction[row][cc]) continue;
          const bit = bitIndex < bits.length ? bits[bitIndex] : 0;
          modules[row][cc] = bit;
          bitIndex++;
        }
      }
      upward = !upward;
      col -= 2;
    }
    return matrixObj;
  }

  /* ---------------- Masking -------------------------------------------- */
  function maskFn(pattern, r, c) {
    switch (pattern) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
      case 7: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
      default: return false;
    }
  }

  function applyMask(matrixObj, pattern) {
    const { n, modules, isFunction } = matrixObj;
    const out = modules.map((row) => row.slice());
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (isFunction[r][c]) continue;
        if (maskFn(pattern, r, c)) out[r][c] ^= 1;
      }
    }
    return out;
  }

  function penaltyScore(modules, n) {
    let score = 0;

    // Rule 1: runs of 5+ same color in a row/column
    function runPenalty(getCell) {
      let p = 0;
      for (let i = 0; i < n; i++) {
        let runColor = -1;
        let runLen = 0;
        for (let j = 0; j < n; j++) {
          const v = getCell(i, j);
          if (v === runColor) {
            runLen++;
          } else {
            if (runLen >= 5) p += 3 + (runLen - 5);
            runColor = v;
            runLen = 1;
          }
        }
        if (runLen >= 5) p += 3 + (runLen - 5);
      }
      return p;
    }
    score += runPenalty((r, c) => modules[r][c]);
    score += runPenalty((r, c) => modules[c][r]);

    // Rule 2: 2x2 blocks of same color
    for (let r = 0; r < n - 1; r++) {
      for (let c = 0; c < n - 1; c++) {
        const v = modules[r][c];
        if (
          v === modules[r][c + 1] &&
          v === modules[r + 1][c] &&
          v === modules[r + 1][c + 1]
        ) {
          score += 3;
        }
      }
    }

    // Rule 3: finder-like patterns 1:1:3:1:1
    const pattern1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    const pattern2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function matchesPattern(arr, start, pat) {
      for (let i = 0; i < pat.length; i++) {
        if (arr[start + i] !== pat[i]) return false;
      }
      return true;
    }
    function findPatternPenalty(getRow) {
      let p = 0;
      for (let i = 0; i < n; i++) {
        const arr = [];
        for (let j = 0; j < n; j++) arr.push(getRow(i, j));
        for (let j = 0; j <= arr.length - 11; j++) {
          if (matchesPattern(arr, j, pattern1) || matchesPattern(arr, j, pattern2)) p += 40;
        }
      }
      return p;
    }
    score += findPatternPenalty((r, c) => modules[r][c]);
    score += findPatternPenalty((r, c) => modules[c][r]);

    // Rule 4: overall dark proportion
    let dark = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (modules[r][c]) dark++;
    const percent = (dark / (n * n)) * 100;
    const deviation = Math.floor(Math.abs(percent - 50) / 5);
    score += deviation * 10;

    return score;
  }

  /* ---------------- Format / version info ------------------------------ */
  const EC_LEVEL_M_BITS = 0b00; // format info EC level bits for M

  function bchFormatEncode(data5) {
    let g = data5 << 10;
    const poly = 0b10100110111; // degree-10 generator (0x537)
    for (let i = 4; i >= 0; i--) {
      if ((g >> (i + 10)) & 1) {
        g ^= poly << i;
      }
    }
    const withEc = (data5 << 10) | g;
    const mask = 0b101010000010010;
    return withEc ^ mask;
  }

  function bchVersionEncode(version) {
    let g = version << 12;
    const poly = 0b1111100100101; // degree-12 generator (0x1F25)
    for (let i = 5; i >= 0; i--) {
      if ((g >> (i + 12)) & 1) {
        g ^= poly << i;
      }
    }
    return (version << 12) | g;
  }

  function placeFormatInfo(matrixObj, maskPattern) {
    const { n, modules } = matrixObj;
    const data5 = (EC_LEVEL_M_BITS << 3) | maskPattern;
    const bits15 = bchFormatEncode(data5);
    const get = (i) => (bits15 >> (14 - i)) & 1;

    // Around top-left finder
    const tl = [
      [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
      [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
    ];
    for (let i = 0; i < 15; i++) {
      const [r, c] = tl[i];
      modules[r][c] = get(i);
    }

    // Split copy: top-right row + bottom-left column (LSB-first bit order)
    for (let i = 0; i < 8; i++) {
      modules[8][n - 1 - i] = (bits15 >> i) & 1;
    }
    for (let i = 8; i < 15; i++) {
      modules[n - 15 + i][8] = (bits15 >> i) & 1;
    }
  }

  function placeVersionInfo(matrixObj, version) {
    if (version < 7) return;
    const { n, modules } = matrixObj;
    const bits18 = bchVersionEncode(version);
    const get = (i) => (bits18 >> i) & 1;
    for (let i = 0; i < 18; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      modules[row][n - 11 + col] = get(i);
      modules[n - 11 + col][row] = get(i);
    }
  }

  /* ---------------- Public API ------------------------------------------ */
  function generate(text) {
    const bytes = textToUtf8Bytes(text);
    const version = pickVersion(bytes.length);
    if (!version) throw new Error("Text is too long to encode as a QR code (max ~213 bytes).");

    const dataCodewords = buildDataCodewords(version, bytes);
    const blocks = splitIntoBlocksAndEncode(version, dataCodewords);
    const finalCodewords = interleave(blocks);

    const baseMatrix = createMatrix(version);
    placeData(baseMatrix, finalCodewords);

    let bestPattern = 0;
    let bestScore = Infinity;
    let bestModules = null;
    for (let p = 0; p < 8; p++) {
      const masked = applyMask(baseMatrix, p);
      const score = penaltyScore(masked, baseMatrix.n);
      if (score < bestScore) {
        bestScore = score;
        bestPattern = p;
        bestModules = masked;
      }
    }

    const finalObj = { n: baseMatrix.n, modules: bestModules, isFunction: baseMatrix.isFunction };
    placeFormatInfo(finalObj, bestPattern);
    placeVersionInfo(finalObj, version);

    return { size: finalObj.n, modules: finalObj.modules, version, maskPattern: bestPattern };
  }

  global.DailyToolsQR = { generate };
})(typeof window !== "undefined" ? window : globalThis);
