const STORAGE_KEY = "code-quiz-progress-v1";

const state = {
  questions: [],
  currentIndex: 0,
  order: "sequential",
  // progress: { "1.1.1": { done: false, answers: { "0": "pd.read_csv(...)", ... } } }
  progress: loadProgress(),
  // shuffled order indices
  shuffledOrder: [],
};

const el = {
  questionList: document.getElementById("question-list"),
  orderSegment: document.getElementById("order-segment"),
  totalCount: document.getElementById("total-count"),
  doneCount: document.getElementById("done-count"),
  blankCount: document.getElementById("blank-count"),
  correctCount: document.getElementById("correct-count"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  clearAllBtn: document.getElementById("clear-all-btn"),
  sessionTitle: document.getElementById("session-title"),
  sessionSubtitle: document.getElementById("session-subtitle"),
  codeArea: document.getElementById("code-area"),
  submitBtn: document.getElementById("submit-btn"),
  showBtn: document.getElementById("show-btn"),
  clearBtn: document.getElementById("clear-btn"),
  feedback: document.getElementById("feedback"),
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getQuestionProgress(qid) {
  if (!state.progress[qid]) {
    state.progress[qid] = { done: false, answers: {} };
  }
  return state.progress[qid];
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCurrentQuestionIndex() {
  if (state.order === "random") {
    return state.shuffledOrder[state.currentIndex];
  }
  return state.currentIndex;
}

function buildQuestionList() {
  el.questionList.innerHTML = "";
  state.questions.forEach((q, i) => {
    const btn = document.createElement("button");
    btn.textContent = q.id;
    btn.dataset.index = String(i);
    const prog = state.progress[q.id];
    if (prog && prog.done) btn.classList.add("done");
    btn.addEventListener("click", () => {
      // Find position in current order
      if (state.order === "random") {
        const pos = state.shuffledOrder.indexOf(i);
        state.currentIndex = pos >= 0 ? pos : 0;
      } else {
        state.currentIndex = i;
      }
      renderCurrentQuestion();
    });
    el.questionList.appendChild(btn);
  });
}

function highlightActiveQuestion() {
  const realIndex = getCurrentQuestionIndex();
  el.questionList.querySelectorAll("button").forEach((btn) => {
    const i = parseInt(btn.dataset.index);
    btn.classList.toggle("active", i === realIndex);
    const q = state.questions[i];
    const prog = state.progress[q.id];
    btn.classList.toggle("done", !!(prog && prog.done));
  });
}

function renderCurrentQuestion() {
  const realIndex = getCurrentQuestionIndex();
  const q = state.questions[realIndex];
  if (!q) return;

  const prog = getQuestionProgress(q.id);
  const totalBlanks = q.cells.reduce((s, c) => s + c.answers.length, 0);

  el.sessionTitle.textContent = `题目 ${q.id}`;
  el.sessionSubtitle.textContent = `共 ${q.cells.length} 个代码块，${totalBlanks} 个填空`;
  el.feedback.className = "feedback hidden";

  el.codeArea.innerHTML = "";
  let globalBlankIdx = 0;

  q.cells.forEach((cell, cellIdx) => {
    const block = document.createElement("div");
    block.className = "code-block";

    const label = document.createElement("span");
    label.className = "cell-label";
    label.textContent = `Cell ${cellIdx + 1}`;
    block.appendChild(label);

    const pre = document.createElement("pre");

    if (cell.answers.length === 0) {
      // Read-only cell
      pre.innerHTML = escapeHtml(cell.text);
    } else {
      // Cell with blanks
      const parts = cell.text.split(/_{2,}/);
      let html = "";
      let blankInCell = 0;

      for (let i = 0; i < parts.length; i++) {
        html += escapeHtml(parts[i]);
        if (i < parts.length - 1 && blankInCell < cell.answers.length) {
          const answer = cell.answers[blankInCell];
          const savedVal = prog.answers[String(globalBlankIdx)] || "";
          const width = Math.max(answer.length, 6);
          html += `<input type="text" class="blank-input" data-blank="${globalBlankIdx}" ` +
            `value="${escapeHtml(savedVal)}" ` +
            `size="${width}" ` +
            `placeholder="填写代码" ` +
            `autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">`;
          blankInCell++;
          globalBlankIdx++;
        }
      }
      pre.innerHTML = html;
    }

    block.appendChild(pre);
    el.codeArea.appendChild(block);
  });

  // Auto-save on input change
  el.codeArea.querySelectorAll(".blank-input").forEach((input) => {
    input.addEventListener("input", () => {
      const idx = input.dataset.blank;
      prog.answers[idx] = input.value;
      saveProgress();
    });
  });

  highlightActiveQuestion();
  updateStats();
}

function checkAnswers() {
  const realIndex = getCurrentQuestionIndex();
  const q = state.questions[realIndex];
  if (!q) return;

  const prog = getQuestionProgress(q.id);
  const inputs = el.codeArea.querySelectorAll(".blank-input");
  let correct = 0;
  let total = 0;
  let globalIdx = 0;

  q.cells.forEach((cell) => {
    cell.answers.forEach((answer, i) => {
      const input = inputs[globalIdx];
      if (!input) { globalIdx++; return; }

      total++;
      const userVal = input.value.trim();
      const expected = answer.trim();

      // 精确匹配或者去除多余空格后匹配
      const normalizeWs = (s) => s.replace(/\s+/g, " ");
      const isCorrect = userVal === expected || normalizeWs(userVal) === normalizeWs(expected);

      input.classList.remove("correct", "incorrect");
      if (userVal === "") {
        input.classList.add("incorrect");
      } else if (isCorrect) {
        input.classList.add("correct");
        correct++;
      } else {
        input.classList.add("incorrect");
      }

      // Show hint for incorrect
      const existingHint = input.parentElement.querySelector(`.answer-hint[data-for="${globalIdx}"]`);
      if (existingHint) existingHint.remove();

      if (!isCorrect && userVal !== "") {
        const hint = document.createElement("span");
        hint.className = "answer-hint";
        hint.dataset.for = String(globalIdx);
        hint.textContent = `正确: ${expected}`;
        input.insertAdjacentElement("afterend", hint);
      }

      globalIdx++;
    });
  });

  prog.done = correct === total && total > 0;
  saveProgress();

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  el.feedback.className = correct === total ? "feedback success" : "feedback error";
  el.feedback.textContent = correct === total
    ? `全部正确！${total}/${total} 填空通过检查。`
    : `${correct}/${total} 正确 (${pct}%)，错误处已标红并显示正确答案。`;

  highlightActiveQuestion();
  updateStats();
}

function showAllAnswers() {
  const realIndex = getCurrentQuestionIndex();
  const q = state.questions[realIndex];
  if (!q) return;

  const inputs = el.codeArea.querySelectorAll(".blank-input");
  let globalIdx = 0;

  q.cells.forEach((cell) => {
    cell.answers.forEach((answer) => {
      const input = inputs[globalIdx];
      if (input) {
        input.value = answer.trim();
        input.classList.remove("incorrect");
        input.classList.add("correct");

        const prog = getQuestionProgress(q.id);
        prog.answers[String(globalIdx)] = answer.trim();
      }
      globalIdx++;
    });
  });

  saveProgress();
  el.feedback.className = "feedback success";
  el.feedback.textContent = "已显示所有正确答案。";
}

function clearCurrentQuestion() {
  const realIndex = getCurrentQuestionIndex();
  const q = state.questions[realIndex];
  if (!q) return;

  const prog = getQuestionProgress(q.id);
  prog.answers = {};
  prog.done = false;
  saveProgress();

  el.codeArea.querySelectorAll(".blank-input").forEach((input) => {
    input.value = "";
    input.classList.remove("correct", "incorrect");
  });
  el.codeArea.querySelectorAll(".answer-hint").forEach((h) => h.remove());
  el.feedback.className = "feedback hidden";
  highlightActiveQuestion();
  updateStats();
}

function goNext() {
  state.currentIndex = (state.currentIndex + 1) % state.questions.length;
  renderCurrentQuestion();
}

function goPrev() {
  state.currentIndex = (state.currentIndex - 1 + state.questions.length) % state.questions.length;
  renderCurrentQuestion();
}

function updateStats() {
  const totalQ = state.questions.length;
  const doneQ = state.questions.filter((q) => state.progress[q.id]?.done).length;
  const totalBlanks = state.questions.reduce(
    (s, q) => s + q.cells.reduce((s2, c) => s2 + c.answers.length, 0), 0
  );
  const correctBlanks = state.questions.reduce((s, q) => {
    const prog = state.progress[q.id];
    if (!prog) return s;
    let globalIdx = 0;
    q.cells.forEach((cell) => {
      cell.answers.forEach((answer) => {
        const userVal = (prog.answers[String(globalIdx)] || "").trim();
        const expected = answer.trim();
        const normalizeWs = (str) => str.replace(/\s+/g, " ");
        if (userVal && (userVal === expected || normalizeWs(userVal) === normalizeWs(expected))) {
          s++;
        }
        globalIdx++;
      });
    });
    return s;
  }, 0);

  el.totalCount.textContent = String(totalQ);
  el.doneCount.textContent = String(doneQ);
  el.blankCount.textContent = String(totalBlanks);
  el.correctCount.textContent = String(correctBlanks);
}

function updateOrderButtons() {
  el.orderSegment.querySelectorAll("button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.order === state.order);
  });
}

function init() {
  const data = window.CODE_QUESTIONS;
  if (!data) {
    el.sessionTitle.textContent = "加载失败";
    el.sessionSubtitle.textContent = "未找到题库数据。";
    return;
  }

  state.questions = data.questions;
  state.shuffledOrder = shuffleArray(state.questions.map((_, i) => i));

  buildQuestionList();
  renderCurrentQuestion();
  updateOrderButtons();
}

el.submitBtn.addEventListener("click", checkAnswers);
el.showBtn.addEventListener("click", showAllAnswers);
el.clearBtn.addEventListener("click", clearCurrentQuestion);
el.nextBtn.addEventListener("click", goNext);
el.prevBtn.addEventListener("click", goPrev);

el.orderSegment.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-order]");
  if (!btn) return;
  state.order = btn.dataset.order;
  state.currentIndex = 0;
  if (state.order === "random") {
    state.shuffledOrder = shuffleArray(state.questions.map((_, i) => i));
  }
  updateOrderButtons();
  renderCurrentQuestion();
});

el.clearAllBtn.addEventListener("click", () => {
  if (!confirm("确定要清空所有刷题数据吗？")) return;
  localStorage.removeItem(STORAGE_KEY);
  state.progress = {};
  buildQuestionList();
  renderCurrentQuestion();
});

init();
