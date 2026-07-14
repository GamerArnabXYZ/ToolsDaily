/* Daily Tools — Age Calculator */
(function () {
  "use strict";

  const birthInput = document.getElementById("birth");
  const asofInput = document.getElementById("asof");
  const calcBtn = document.getElementById("calc");

  const yearsEl = document.getElementById("years");
  const monthsEl = document.getElementById("months");
  const daysEl = document.getElementById("days");
  const totalDaysEl = document.getElementById("totaldays");
  const nextBdayEl = document.getElementById("nextbday");

  function toDateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function diffYMD(start, end) {
    // start, end are Date objects at midnight, start <= end
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      // days in the month before `end`'s month
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years, months, days };
  }

  function daysBetween(a, b) {
    const MS_PER_DAY = 86400000;
    return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
  }

  function nextBirthdayCountdown(birth, ref) {
    let next = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
    if (next.getTime() < ref.getTime()) {
      next = new Date(ref.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    // Handle Feb 29 birthdays landing on a non-leap year: JS Date auto-rolls
    // Feb 29 -> Mar 1 on non-leap years, which is the conventional fallback.
    return daysBetween(ref, next);
  }

  function calculate() {
    if (!birthInput.value) {
      DailyTools.showToast("Pick a birth date first");
      return;
    }
    const birth = toDateOnly(new Date(birthInput.value + "T00:00:00"));
    const ref = asofInput.value
      ? toDateOnly(new Date(asofInput.value + "T00:00:00"))
      : toDateOnly(new Date());

    if (birth.getTime() > ref.getTime()) {
      DailyTools.showToast("Birth date must be before the reference date");
      return;
    }

    const { years, months, days } = diffYMD(birth, ref);
    yearsEl.textContent = years;
    monthsEl.textContent = months;
    daysEl.textContent = days;
    totalDaysEl.textContent = daysBetween(birth, ref).toLocaleString();
    nextBdayEl.textContent = nextBirthdayCountdown(birth, ref) + " days";
  }

  calcBtn.addEventListener("click", calculate);
  birthInput.addEventListener("change", calculate);
  asofInput.addEventListener("change", calculate);

  // Default "as of" to today for convenience.
  const today = new Date();
  asofInput.value = today.toISOString().slice(0, 10);
})();
