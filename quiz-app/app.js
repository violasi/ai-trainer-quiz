const STORAGE_KEY = "local-quiz-progress-v1";

const TYPE_LABELS = {
  judge: "判断题",
  single: "单选题",
  multiple: "多选题",
};

const MODE_LABELS = {
  normal: "普通刷题",
  wrong: "错题库",
};

const state = {
  questionBank: [],
  meta: null,
  progress: loadProgress(),
  currentMode: "normal",
  currentType: "judge",
  currentOrder: "sequential",
  currentQuestion: null,
  answeredCount: 0,
  correctCount: 0,
};

const elements = {
  modeSegment: document.getElementById("mode-segment"),
  typeSelector: document.getElementById("type-selector"),
  poolCount: document.getElementById("pool-count"),
  remainingCount: document.getElementById("remaining-count"),
  wrongCount: document.getElementById("wrong-count"),
  accuracyCount: document.getElementById("accuracy-count"),
  nextQuestionBtn: document.getElementById("next-question-btn"),
  resetProgressBtn: document.getElementById("reset-progress-btn"),
  clearWrongBtn: document.getElementById("clear-wrong-btn"),
  clearAllBtn: document.getElementById("clear-all-btn"),
  orderSegment: document.getElementById("order-segment"),
  sessionTitle: document.getElementById("session-title"),
  sessionSubtitle: document.getElementById("session-subtitle"),
  questionBadge: document.getElementById("question-badge"),
  questionProgress: document.getElementById("question-progress"),
  questionText: document.getElementById("question-text"),
  optionsContainer: document.getElementById("options-container"),
  submitBtn: document.getElementById("submit-btn"),
  showAnswerBtn: document.getElementById("show-answer-btn"),
  feedback: document.getElementById("feedback"),
};

function loadProgress() {
  const empty = {
    seen: { judge: [], single: [], multiple: [] },
    wrongSeen: { judge: [], single: [], multiple: [] },
    wrong: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return {
      seen: {
        judge: parsed?.seen?.judge || [],
        single: parsed?.seen?.single || [],
        multiple: parsed?.seen?.multiple || [],
      },
      wrongSeen: {
        judge: parsed?.wrongSeen?.judge || [],
        single: parsed?.wrongSeen?.single || [],
        multiple: parsed?.wrongSeen?.multiple || [],
      },
      wrong: parsed?.wrong || [],
    };
  } catch {
    return empty;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function getQuestionsByType(type) {
  return state.questionBank.filter((item) => item.type === type);
}

function getWrongQuestionsByType(type) {
  const wrongSet = new Set(state.progress.wrong);
  return getQuestionsByType(type).filter((item) => wrongSet.has(item.id));
}

function getAvailableQuestions(type, mode) {
  if (mode === "wrong") {
    const wrongSeenSet = new Set(state.progress.wrongSeen[type]);
    return getWrongQuestionsByType(type).filter((item) => !wrongSeenSet.has(item.id));
  }

  const seenSet = new Set(state.progress.seen[type]);
  return getQuestionsByType(type).filter((item) => !seenSet.has(item.id));
}

function resetWrongRoundIfNeeded(type) {
  if (state.currentMode !== "wrong") {
    return false;
  }

  const wrongPool = getWrongQuestionsByType(type);
  if (wrongPool.length === 0) {
    state.progress.wrongSeen[type] = [];
    return false;
  }

  const available = getAvailableQuestions(type, "wrong");
  if (available.length === 0) {
    state.progress.wrongSeen[type] = [];
    saveProgress();
    return true;
  }

  return false;
}

function getSelectedAnswers() {
  return [...elements.optionsContainer.querySelectorAll(".option-button.selected")]
    .map((button) => button.dataset.key)
    .sort();
}

function isCorrect(question, selected) {
  const answer = Array.isArray(question.answer) ? [...question.answer].sort() : [question.answer];
  if (selected.length !== answer.length) return false;
  return selected.every((item, index) => item === answer[index]);
}

function markQuestionAsSeen(question) {
  if (state.currentMode === "wrong") {
    const seen = state.progress.wrongSeen[question.type];
    if (!seen.includes(question.id)) {
      seen.push(question.id);
    }
    return;
  }

  const seen = state.progress.seen[question.type];
  if (!seen.includes(question.id)) {
    seen.push(question.id);
  }
}

function addToWrongBook(question) {
  if (!state.progress.wrong.includes(question.id)) {
    state.progress.wrong.push(question.id);
  }
}

function removeFromWrongBook(question) {
  state.progress.wrong = state.progress.wrong.filter((id) => id !== question.id);
  state.progress.wrongSeen[question.type] = state.progress.wrongSeen[question.type].filter(
    (id) => id !== question.id,
  );
}

function revealAnswer(question, selected) {
  const answerSet = new Set(Array.isArray(question.answer) ? question.answer : [question.answer]);
  const selectedSet = new Set(selected);

  [...elements.optionsContainer.querySelectorAll(".option-button")].forEach((button) => {
    const key = button.dataset.key;
    button.disabled = true;
    if (answerSet.has(key)) button.classList.add("correct");
    if (selectedSet.has(key) && !answerSet.has(key)) button.classList.add("incorrect");
  });
}

function updateStats() {
  const pool = state.currentMode === "wrong"
    ? getWrongQuestionsByType(state.currentType)
    : getQuestionsByType(state.currentType);
  const roundRemaining = state.currentMode === "wrong" && pool.length > 0
    ? (() => {
        const available = getAvailableQuestions(state.currentType, state.currentMode);
        return available.length === 0 ? pool.length : available.length;
      })()
    : null;
  const available = getAvailableQuestions(state.currentType, state.currentMode);
  const accuracy = state.answeredCount === 0
    ? "0%"
    : `${Math.round((state.correctCount / state.answeredCount) * 100)}%`;

  elements.poolCount.textContent = String(pool.length);
  elements.remainingCount.textContent = String(roundRemaining ?? available.length);
  elements.wrongCount.textContent = String(state.progress.wrong.length);
  elements.accuracyCount.textContent = accuracy;
}

function setFeedback(message, kind) {
  elements.feedback.className = `feedback ${kind}`;
  elements.feedback.textContent = message;
}

function clearFeedback() {
  elements.feedback.className = "feedback hidden";
  elements.feedback.textContent = "";
}

function updateButtonStates() {
  [...elements.modeSegment.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.currentMode);
  });

  [...elements.typeSelector.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("active", button.dataset.type === state.currentType);
  });

  [...elements.orderSegment.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("active", button.dataset.order === state.currentOrder);
  });
}

function typeSubtitle() {
  const orderLabel = state.currentOrder === "random" ? "乱序" : "顺序";
  if (state.currentMode === "wrong") {
    return `当前在错题库模式（${orderLabel}），答对后会自动移出错题库。`;
  }
  return `当前为${orderLabel}刷题模式，每道题只会出现一次，直到该题型全部刷完。`;
}

function renderEmptyState(message) {
  state.currentQuestion = null;
  elements.sessionTitle.textContent = `${MODE_LABELS[state.currentMode]} · ${TYPE_LABELS[state.currentType]}`;
  elements.sessionSubtitle.textContent = message;
  elements.questionBadge.textContent = TYPE_LABELS[state.currentType];
  elements.questionProgress.textContent = "暂无题目";
  elements.questionText.textContent = message;
  elements.optionsContainer.innerHTML = "";
  elements.submitBtn.disabled = true;
  elements.showAnswerBtn.disabled = true;
  clearFeedback();
  updateStats();
}

function renderQuestion(question, remaining) {
  state.currentQuestion = question;
  elements.sessionTitle.textContent = `${MODE_LABELS[state.currentMode]} · ${TYPE_LABELS[state.currentType]}`;
  elements.sessionSubtitle.textContent = typeSubtitle();
  elements.questionBadge.textContent = TYPE_LABELS[question.type];
  elements.questionProgress.textContent = `剩余 ${remaining} 题`;
  elements.questionText.textContent = `${question.number}. ${question.question}`;
  elements.optionsContainer.innerHTML = "";
  clearFeedback();
  elements.submitBtn.disabled = false;
  elements.showAnswerBtn.disabled = false;

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.dataset.key = option.key;
    button.textContent = `${option.key}. ${option.text}`;
    button.addEventListener("click", () => toggleOption(button, question.type));
    elements.optionsContainer.appendChild(button);
  });

  updateStats();
}

function toggleOption(button, questionType) {
  if (questionType === "multiple") {
    button.classList.toggle("selected");
    return;
  }

  [...elements.optionsContainer.querySelectorAll(".option-button")].forEach((item) => {
    item.classList.remove("selected");
  });
  button.classList.add("selected");
}

function nextQuestion() {
  resetWrongRoundIfNeeded(state.currentType);
  const available = getAvailableQuestions(state.currentType, state.currentMode);
  updateButtonStates();

  if (available.length === 0) {
    const message = state.currentMode === "wrong"
      ? "当前题型的错题库已经刷完了。"
      : "当前题型已经全部刷完了，可以切换题型或进入错题库继续练习。";
    renderEmptyState(message);
    return;
  }

  const pick = state.currentOrder === "random"
    ? available[Math.floor(Math.random() * available.length)]
    : available[0];
  renderQuestion(pick, available.length);
}

function submitAnswer() {
  if (!state.currentQuestion) return;

  const selected = getSelectedAnswers();
  if (selected.length === 0) {
    setFeedback("请先选择答案。", "error");
    return;
  }

  markQuestionAsSeen(state.currentQuestion);
  state.answeredCount += 1;

  const correct = isCorrect(state.currentQuestion, selected);
  if (correct) {
    state.correctCount += 1;
    removeFromWrongBook(state.currentQuestion);
    setFeedback("回答正确，这题不会进入错题库；如果它原本在错题库里，也已经移除了。", "success");
  } else {
    addToWrongBook(state.currentQuestion);
    const answerText = Array.isArray(state.currentQuestion.answer)
      ? state.currentQuestion.answer.join("、")
      : state.currentQuestion.answer;
    setFeedback(`回答错误，已加入错题库。正确答案：${answerText}`, "error");
  }

  revealAnswer(state.currentQuestion, selected);
  saveProgress();
  updateStats();
  elements.submitBtn.disabled = true;

  if (state.currentMode === "wrong") {
    resetWrongRoundIfNeeded(state.currentType);
    updateStats();
  }
}

function showAnswer() {
  if (!state.currentQuestion) return;
  const answerText = Array.isArray(state.currentQuestion.answer)
    ? state.currentQuestion.answer.join("、")
    : state.currentQuestion.answer;
  revealAnswer(state.currentQuestion, getSelectedAnswers());
  setFeedback(`正确答案：${answerText}`, "success");
}

function resetCurrentTypeProgress() {
  if (state.currentMode === "wrong") {
    state.progress.wrongSeen[state.currentType] = [];
  } else {
    state.progress.seen[state.currentType] = [];
  }
  saveProgress();
  nextQuestion();
}

function clearWrongBook() {
  state.progress.wrong = [];
  state.progress.wrongSeen = { judge: [], single: [], multiple: [] };
  saveProgress();
  nextQuestion();
}

function init() {
  const payload = window.QUESTION_BANK;
  if (!payload) {
    throw new Error("未找到题库数据，请先运行 build_question_bank.py 生成 questions.js。");
  }
  state.meta = payload.meta;
  state.questionBank = payload.questions;
  nextQuestion();
}

elements.modeSegment.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mode]");
  if (!button) return;
  state.currentMode = button.dataset.mode;
  nextQuestion();
});

elements.typeSelector.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-type]");
  if (!button) return;
  state.currentType = button.dataset.type;
  nextQuestion();
});

elements.orderSegment.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-order]");
  if (!button) return;
  state.currentOrder = button.dataset.order;
  nextQuestion();
});

elements.clearAllBtn.addEventListener("click", () => {
  if (!confirm("确定要清空所有刷题数据吗？（包括所有题型的进度和错题库）")) return;
  localStorage.removeItem(STORAGE_KEY);
  state.progress = loadProgress();
  state.answeredCount = 0;
  state.correctCount = 0;
  nextQuestion();
});

elements.nextQuestionBtn.addEventListener("click", nextQuestion);
elements.submitBtn.addEventListener("click", submitAnswer);
elements.showAnswerBtn.addEventListener("click", showAnswer);
elements.resetProgressBtn.addEventListener("click", resetCurrentTypeProgress);
elements.clearWrongBtn.addEventListener("click", clearWrongBook);

try {
  init();
} catch (error) {
  elements.sessionTitle.textContent = "加载失败";
  elements.sessionSubtitle.textContent = "题库读取失败，请先运行生成脚本。";
  elements.questionText.textContent = String(error);
}
