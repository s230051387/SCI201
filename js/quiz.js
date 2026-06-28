// ============================================================
// SCI201 - Quiz Engine with Navigation (Reusable for all chapters)
// ============================================================

function initQuiz(config) {
  const { chapterNum, quizData, containerId = "quiz-container" } = config;

  const container = document.getElementById(containerId);
  if (!container || !quizData || quizData.length === 0) return;

  let currentQ = 0;
  let score = 0;
  let userAnswers = new Array(quizData.length).fill(null);
  let answerStatus = new Array(quizData.length).fill(false);

  // Build quiz HTML structure
  container.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-header">
        <span class="quiz-counter">Question 1 of ${quizData.length}</span>
        <span>🎯 Score: <span class="quiz-score">0</span></span>
      </div>
      <div style="background: var(--surface); border-radius: 10px; height: 6px; margin-bottom: 0.5rem; overflow: hidden;">
        <div class="quiz-progress-bar" style="background: var(--primary); height: 100%; width: ${(1 / quizData.length) * 100}%; border-radius: 10px; transition: width 0.3s ease;"></div>
      </div>
      <div class="quiz-question"></div>
      <div class="quiz-options"></div>
      <div style="display: flex; gap: 10px; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="quiz-hint-btn nav-btn" style="background: var(--surface); color: var(--text); border: 1px solid var(--border);">💡 Hint</button>
      </div>
      <div class="quiz-feedback hidden"></div>
      <div style="display: flex; justify-content: space-between; margin-top: 1.5rem; align-items: center;">
        <button class="quiz-prev-btn nav-btn hidden" style="background: var(--surface); color: var(--text); border: 1px solid var(--border);">← Previous</button>
        <span class="quiz-answered-indicator" style="color: var(--text-secondary); font-size: 0.85rem;">0 of ${quizData.length} answered</span>
        <button class="quiz-next-btn nav-btn">Next →</button>
      </div>
    </div>
    <div class="quiz-results hidden" style="text-align:center;">
      <div style="font-size:4rem;" class="quiz-emoji">🏆</div>
      <div class="quiz-score-display score-display">0/${quizData.length}</div>
      <p class="quiz-message" style="color: var(--text-secondary); margin: 1rem 0;"></p>
      <button class="quiz-retry-btn nav-btn">🔄 Retry Quiz</button>
    </div>
  `;

  // Cache DOM elements
  const quizCard = container.querySelector(".quiz-card");
  const resultsDiv = container.querySelector(".quiz-results");
  const counterEl = container.querySelector(".quiz-counter");
  const scoreEl = container.querySelector(".quiz-score");
  const progressBar = container.querySelector(".quiz-progress-bar");
  const questionEl = container.querySelector(".quiz-question");
  const optionsEl = container.querySelector(".quiz-options");
  const feedbackEl = container.querySelector(".quiz-feedback");
  const hintBtn = container.querySelector(".quiz-hint-btn");
  const prevBtn = container.querySelector(".quiz-prev-btn");
  const nextBtn = container.querySelector(".quiz-next-btn");
  const answeredEl = container.querySelector(".quiz-answered-indicator");
  const retryBtn = container.querySelector(".quiz-retry-btn");
  const emojiEl = container.querySelector(".quiz-emoji");
  const scoreDisplayEl = container.querySelector(".quiz-score-display");
  const messageEl = container.querySelector(".quiz-message");

  function renderQuestion() {
    const q = quizData[currentQ];

    counterEl.textContent = `Question ${currentQ + 1} of ${quizData.length}`;
    scoreEl.textContent = score;

    const progress = ((currentQ + 1) / quizData.length) * 100;
    progressBar.style.width = progress + "%";

    questionEl.textContent = q.question;

    optionsEl.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.style.cssText = `
        display: block; margin: 0.5rem 0; cursor: pointer;
        padding: 0.75rem 1rem; border-radius: 8px;
        border: 1px solid var(--border); transition: 0.2s;
        background: var(--surface);
      `;

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "quiz";
      radio.value = idx;
      radio.disabled = userAnswers[currentQ] !== null;
      radio.style.cssText =
        "margin-right: 10px; accent-color: var(--primary); transform: scale(1.1);";

      if (userAnswers[currentQ] === idx) {
        radio.checked = true;
      }

      // Green/red highlighting
      if (userAnswers[currentQ] !== null) {
        label.style.cursor = "default";
        if (idx === q.correct) {
          label.style.background = "var(--green)";
          label.style.color = "var(--bg0_h)";
          label.style.borderColor = "var(--green)";
          label.style.fontWeight = "bold";
        } else if (idx === userAnswers[currentQ] && !answerStatus[currentQ]) {
          label.style.background = "var(--red)";
          label.style.color = "var(--bg0_h)";
          label.style.borderColor = "var(--red)";
          label.style.fontWeight = "bold";
        }
      }

      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + opt));

      if (userAnswers[currentQ] === null) {
        radio.addEventListener("change", () => selectAnswer(idx));
      }

      optionsEl.appendChild(label);
    });

    updateNavigationButtons();

    if (userAnswers[currentQ] !== null) {
      feedbackEl.classList.remove("hidden");
      const isCorrect = answerStatus[currentQ];
      feedbackEl.innerHTML = `<strong>${isCorrect ? "✅ Correct!" : "❌ Incorrect"}</strong><br>${q.explanation}`;
      feedbackEl.style.borderLeft = isCorrect
        ? "4px solid var(--green)"
        : "4px solid var(--red)";
    } else {
      feedbackEl.classList.add("hidden");
    }

    updateAnsweredIndicator();
  }

  function updateNavigationButtons() {
    if (currentQ === 0) {
      prevBtn.classList.add("hidden");
    } else {
      prevBtn.classList.remove("hidden");
    }

    if (currentQ === quizData.length - 1) {
      nextBtn.textContent = "See Results 🏆";
      nextBtn.onclick = showResults;
    } else {
      nextBtn.textContent = "Next →";
      nextBtn.onclick = nextQuestion;
    }

    if (userAnswers[currentQ] === null) {
      nextBtn.style.opacity = "0.5";
      nextBtn.style.cursor = "not-allowed";
      nextBtn.style.pointerEvents = "none";
    } else {
      nextBtn.style.opacity = "1";
      nextBtn.style.cursor = "pointer";
      nextBtn.style.pointerEvents = "auto";
    }
  }

  function updateAnsweredIndicator() {
    const answeredCount = userAnswers.filter((a) => a !== null).length;
    answeredEl.textContent = `${answeredCount} of ${quizData.length} answered`;
  }

  function selectAnswer(selected) {
    if (userAnswers[currentQ] !== null) return;

    const q = quizData[currentQ];
    const isCorrect = selected === q.correct;

    userAnswers[currentQ] = selected;
    answerStatus[currentQ] = isCorrect;

    if (isCorrect) {
      score++;
      scoreEl.textContent = score;
    }

    renderQuestion();
  }

  function nextQuestion() {
    if (userAnswers[currentQ] === null) return;
    if (currentQ < quizData.length - 1) {
      currentQ++;
      renderQuestion();
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function previousQuestion() {
    if (currentQ > 0) {
      currentQ--;
      renderQuestion();
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function showHint() {
    const q = quizData[currentQ];
    feedbackEl.classList.remove("hidden");
    feedbackEl.innerHTML = `<strong>💡 Hint:</strong> ${q.hint}`;
    feedbackEl.style.borderLeft = "4px solid var(--accent)";
  }

  function showResults() {
    if (userAnswers[currentQ] === null) return;

    quizCard.classList.add("hidden");
    resultsDiv.classList.remove("hidden");

    const total = quizData.length;
    const percentage = Math.round((score / total) * 100);

    scoreDisplayEl.textContent = `${score}/${total}`;

    if (percentage === 100) {
      emojiEl.textContent = "🏆";
      messageEl.textContent = "Perfect! You're a physics master!";
    } else if (percentage >= 80) {
      emojiEl.textContent = "🎉";
      messageEl.textContent = "Great job! You really understand this chapter!";
    } else if (percentage >= 60) {
      emojiEl.textContent = "📖";
      messageEl.textContent = "Good effort! Review the chapter and try again.";
    } else {
      emojiEl.textContent = "📚";
      messageEl.textContent =
        "Keep studying! Review the material and try the quiz again.";
    }

    if (chapterNum) {
      localStorage.setItem(`chapter_${chapterNum}_status`, "completed");
    }

    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function retryQuiz() {
    currentQ = 0;
    score = 0;
    userAnswers = new Array(quizData.length).fill(null);
    answerStatus = new Array(quizData.length).fill(false);

    scoreEl.textContent = "0";
    quizCard.classList.remove("hidden");
    resultsDiv.classList.add("hidden");

    renderQuestion();
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Event listeners
  prevBtn.addEventListener("click", previousQuestion);
  nextBtn.addEventListener("click", nextQuestion);
  hintBtn.addEventListener("click", showHint);
  retryBtn.addEventListener("click", retryQuiz);

  // Initialize
  renderQuestion();
}

// ============================================================
// SIDEBAR - Active link highlighting
// ============================================================
(function initSidebar() {
  const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
  if (sidebarLinks.length === 0) return;

  const sections = [];

  sidebarLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const section = document.getElementById(href.substring(1));
      if (section) {
        sections.push({ link, section });
      }
    }
  });

  function highlightSidebar() {
    let currentId = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach(({ section }) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }

  // Click handler for smooth scrolling
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.getElementById(href.substring(1));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // Close mobile sidebar if open
          const sidebar = document.getElementById("sidebar");
          if (sidebar && window.innerWidth <= 900) {
            sidebar.classList.remove("open");
          }
        }
      }
    });
  });

  window.addEventListener("scroll", highlightSidebar);
  highlightSidebar();
})();

// ============================================================
// MOBILE SIDEBAR TOGGLE
// ============================================================
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

// Close sidebar when clicking outside on mobile
document.addEventListener("click", function (e) {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.querySelector(".sidebar-toggle");
  if (
    sidebar &&
    sidebar.classList.contains("open") &&
    window.innerWidth <= 900
  ) {
    if (
      !sidebar.contains(e.target) &&
      e.target !== toggle &&
      !toggle.contains(e.target)
    ) {
      sidebar.classList.remove("open");
    }
  }
});
