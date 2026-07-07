/* Unit Converter — factor-based + temperature special-case */
(function () {
  // Convert factors are relative to the category's base unit.
  const UNITS = {
    length: { base: "m", units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
    mass: { base: "g", units: { mg: 0.001, g: 1, kg: 1000, oz: 28.3495, lb: 453.592, t: 1e6 } },
    time: { base: "s", units: { ms: 0.001, s: 1, min: 60, h: 3600, day: 86400 } },
    data: { base: "B", units: { b: 0.125, B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 } },
    temperature: { base: "C", units: { C: 1, F: 1, K: 1 } },
  };

  const category = document.getElementById("category");
  const fromU = document.getElementById("from-unit");
  const toU = document.getElementById("to-unit");
  const amount = document.getElementById("amount");
  const result = document.getElementById("result");
  const equation = document.getElementById("equation");

  function fillSelect(sel, keys) {
    sel.innerHTML = "";
    keys.forEach((k) => {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = k;
      sel.appendChild(o);
    });
  }

  function populate() {
    const cat = UNITS[category.value];
    const keys = Object.keys(cat.units);
    fillSelect(fromU, keys);
    fillSelect(toU, keys);
    if (category.value === "temperature") {
      fromU.value = "C"; toU.value = "F";
    } else if (category.value === "length") {
      fromU.value = "km"; toU.value = "mi";
    } else {
      fromU.value = keys[0]; toU.value = keys[1] || keys[0];
    }
    convert();
  }

  function toBase(val, unit, cat) {
    if (cat === "temperature") {
      if (unit === "C") return val;
      if (unit === "F") return ((val - 32) * 5) / 9;
      return val - 273.15; // K
    }
    return val * UNITS[cat].units[unit];
  }
  function fromBase(base, unit, cat) {
    if (cat === "temperature") {
      if (unit === "C") return base;
      if (unit === "F") return (base * 9) / 5 + 32;
      return base + 273.15; // K
    }
    return base / UNITS[cat].units[unit];
  }

  function convert() {
    const cat = category.value;
    const v = parseFloat(amount.value);
    if (isNaN(v)) { result.textContent = "—"; equation.textContent = ""; return; }
    const base = toBase(v, fromU.value, cat);
    const out = fromBase(base, toU.value, cat);
    const rounded = Math.abs(out) >= 1e-6 && Math.abs(out) < 1e15
      ? Math.round(out * 1e6) / 1e6
      : out.toExponential(4);
    result.textContent = rounded.toLocaleString(undefined, { maximumFractionDigits: 6 }) + " " + toU.value;
    equation.textContent = `${v} ${fromU.value} = ${rounded} ${toU.value}`;
  }

  category.addEventListener("change", populate);
  fromU.addEventListener("change", convert);
  toU.addEventListener("change", convert);
  amount.addEventListener("input", convert);

  populate();
})();
