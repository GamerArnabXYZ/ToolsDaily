/* Daily Tools — Quiz Maker (build + shareable link + take) */
(function () {
  "use strict";

  const buildMode = document.getElementById("build-mode");
  const takeMode = document.getElementById("take-mode");
  const questionsList = document.getElementById("questions-list");
  const addQuestionBtn = document.getElementById("add-question");
  const generateLinkBtn = document.getElementById("generate-link");
  const linkPanel = document.getElementById("link-panel");
  const shareLinkInput = document.getElementById("share-link");
  const quizTitleInput = document.getElementById("quiz-title");

  let qCount = 0;

  function encodeQuiz(obj) {
    const json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)));
  }

  function decodeQuiz(str) {
    const json = decodeURIComponent(escape(atob(str)));
    return JSON.parse(json);
  }

  function addQuestionBlock() {
    qCount++;
    const id = qCount;
    const wrap = document.createElement("div");
    wrap.className = "quiz-q";
    wrap.dataset.qid = id;
    wrap.innerHTML = `
      <input type="text" class="q-text" placeholder="Question ${id}" />
      <div class="quiz-opt-row">
        <input type="radio" name="correct-${id}" value="0" checked />
        <input type="text" class="q-opt" placeholder="Option A" />
      </div>
      <div class="quiz-opt-row">
        <input type="radio" name="correct-${id}" value="1" />
        <input type="text" class="q-opt" placeholder="Option B" />
      </div>
      <div class="quiz-opt-row">
        <input type="radio" name="correct-${id}" value="2" />
        <input type="text" class="q-opt" placeholder="Option C" />
      </div>
      <div class="quiz-opt-row">
        <input type="radio" name="correct-${id}" value="3" />
        <input type="text" class="q-opt" placeholder="Option D" />
      </div>
      <button type="button" class="pill quiz-remove" data-remove="${id}">Remove question</button>
    `;
    questionsList.appendChild(wrap);
    wrap.querySelector("[data-remove]").addEventListener("click", () => wrap.remove());
  }

  function collectQuiz() {
    const title = quizTitleInput.value.trim() || "Untitled Quiz";
    const questions = [];
    document.querySelectorAll(".quiz-q").forEach((block) => {
      const qText = block.querySelector(".q-text").value.trim();
      const opts = Array.from(block.querySelectorAll(".q-opt")).map((i) => i.value.trim());
      const correctRadio = block.querySelector('input[type="radio"]:checked');
      const correct = correctRadio ? parseInt(correctRadio.value, 10) : 0;
      if (qText && opts.every((o) => o)) {
        questions.push({ q: qText, options: opts, correct });
      }
    });
    return { title, questions };
  }

  addQuestionBtn.addEventListener("click", addQuestionBlock);

  generateLinkBtn.addEventListener("click", () => {
    const quiz = collectQuiz();
    if (quiz.questions.length === 0) {
      DailyTools.showToast("Add at least one complete question first");
      return;
    }
    const encoded = encodeQuiz(quiz);
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("quiz", encoded);
    shareLinkInput.value = url.toString();
    linkPanel.style.display = "block";
    if (typeof linkPanel.scrollIntoView === "function") {
      linkPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  /* ---- Take mode: triggered if ?quiz= is present ------------------- */
  function initTakeMode(encoded) {
    let quiz;
    try {
      quiz = decodeQuiz(encoded);
    } catch (e) {
      DailyTools.showToast("This quiz link looks invalid");
      return;
    }
    buildMode.style.display = "none";
    takeMode.style.display = "block";
    document.getElementById("tool-title").textContent = quiz.title;
    document.getElementById("tool-subtitle").textContent =
      "Answer each question, then submit to see your score.";
    document.getElementById("take-title").textContent = "";

    const container = document.getElementById("take-questions");
    quiz.questions.forEach((q, qi) => {
      const block = document.createElement("div");
      block.className = "take-q";
      block.dataset.qi = qi;
      block.dataset.correct = q.correct;
      const optsHtml = q.options
        .map(
          (opt, oi) => `
        <label class="take-opt" data-oi="${oi}">
          <input type="radio" name="take-q-${qi}" value="${oi}" />
          <span>${opt}</span>
        </label>`
        )
        .join("");
      block.innerHTML = `<p style="font-weight:600;margin-bottom:10px;">${qi + 1}. ${q.q}</p>${optsHtml}`;
      container.appendChild(block);
    });

    document.getElementById("submit-quiz").addEventListener("click", () => {
      let score = 0;
      const blocks = document.querySelectorAll(".take-q");
      blocks.forEach((block) => {
        const correct = parseInt(block.dataset.correct, 10);
        const picked = block.querySelector('input[type="radio"]:checked');
        const pickedVal = picked ? parseInt(picked.value, 10) : -1;
        if (pickedVal === correct) score++;
        block.querySelectorAll(".take-opt").forEach((optEl) => {
          const oi = parseInt(optEl.dataset.oi, 10);
          if (oi === correct) optEl.classList.add("is-correct");
          else if (oi === pickedVal) optEl.classList.add("is-wrong");
        });
      });
      document.getElementById("score-result").textContent =
        `You scored ${score} / ${blocks.length}`;
    });
  }

  const params = new URLSearchParams(location.search);
  const quizParam = params.get("quiz");
  if (quizParam) {
    initTakeMode(quizParam);
  } else {
    addQuestionBlock();
  }
})();
