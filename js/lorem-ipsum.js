/* Daily Tools — Lorem Ipsum Generator */
(function () {
  "use strict";

  const WORD_BANK = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod " +
    "tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis " +
    "nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis " +
    "aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur " +
    "excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt " +
    "mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error " +
    "voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae " +
    "ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo nemo " +
    "enim ipsam quia voluptas aspernatur aut odit fugit consequuntur magni dolores " +
    "eos ratione sequi nesciunt neque porro quisquam dolorem adipisci numquam eius " +
    "modi tempora incidunt magnam quaerat"
  ).split(" ");

  const OPENING = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"];

  const state = { unit: "paragraphs" };

  const output = document.getElementById("out");
  const countInput = document.getElementById("count");
  const startCheckbox = document.getElementById("startWithLorem");
  const generateBtn = document.getElementById("generate");

  function pick() {
    return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  }

  function capitalize(w) {
    return w.charAt(0).toUpperCase() + w.slice(1);
  }

  function makeSentence(minWords, maxWords) {
    const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
    const words = [];
    for (let i = 0; i < len; i++) words.push(pick());
    return capitalize(words.join(" ")) + ".";
  }

  function makeParagraph(useOpening) {
    const sentenceCount = 4 + Math.floor(Math.random() * 3);
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      if (i === 0 && useOpening) {
        sentences.push(capitalize(OPENING.join(" ")) + ".");
      } else {
        sentences.push(makeSentence(6, 16));
      }
    }
    return sentences.join(" ");
  }

  function generateWords(count, useOpening) {
    const words = [];
    if (useOpening) {
      words.push(...OPENING.slice(0, Math.min(count, OPENING.length)));
    }
    while (words.length < count) words.push(pick());
    words.length = count;
    words[0] = capitalize(words[0]);
    return words.join(" ");
  }

  function generateSentences(count, useOpening) {
    const out = [];
    for (let i = 0; i < count; i++) {
      if (i === 0 && useOpening) {
        out.push(capitalize(OPENING.join(" ")) + ".");
      } else {
        out.push(makeSentence(6, 16));
      }
    }
    return out.join(" ");
  }

  function generateParagraphs(count, useOpening) {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(makeParagraph(i === 0 && useOpening));
    }
    return out.join("\n\n");
  }

  function generate() {
    let count = parseInt(countInput.value, 10);
    if (!count || count < 1) count = 1;
    if (count > 50) count = 50;
    countInput.value = count;
    const useOpening = startCheckbox.checked;

    let result = "";
    if (state.unit === "words") result = generateWords(count, useOpening);
    else if (state.unit === "sentences") result = generateSentences(count, useOpening);
    else result = generateParagraphs(count, useOpening);

    output.value = result;
  }

  document.querySelectorAll("[data-unit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.unit = btn.getAttribute("data-unit");
      document.querySelectorAll("[data-unit]").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      generate();
    });
  });

  generateBtn.addEventListener("click", generate);
  countInput.addEventListener("change", generate);
  startCheckbox.addEventListener("change", generate);

  generate();
})();
