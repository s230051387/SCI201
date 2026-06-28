// ============================================================
// SCI201 - Top Toolbar (shared across all chapters)
// ============================================================
(function () {
  const totalChapters = 13;

  function getChapterNum() {
    const url = window.location.pathname;
    const match = url.match(/chapter(\d+)/i);
    return match ? parseInt(match[1]) : 1;
  }

  const chapterNum = getChapterNum();
  const prevNum = chapterNum - 1;
  const nextNum = chapterNum + 1;

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.innerHTML = `
    <div class="toolbar-left">
      <button class="sidebar-toggle toolbar-hamburger" onclick="toggleSidebar()" aria-label="Toggle sidebar" style="display:none;">☰</button>
      <a href="../index.html" class="toolbar-btn" title="Home" aria-label="Back to chapters">
        <i class="fa-solid fa-house"></i>
      </a>
      ${prevNum >= 1 ? `<a href="chapter${prevNum}.html" class="toolbar-btn" title="Previous Chapter" aria-label="Previous chapter"><i class="fa-solid fa-chevron-left"></i></a>` : `<span class="toolbar-btn disabled-btn"><i class="fa-solid fa-chevron-left"></i></span>`}
    </div>
    <div class="toolbar-center">
      <span class="subject-icon">⚛️</span>
      <span>SCI201 · CH ${chapterNum}</span>
    </div>
    <div class="toolbar-right">
      ${nextNum <= totalChapters ? `<a href="chapter${nextNum}.html" class="toolbar-btn" title="Next Chapter" aria-label="Next chapter"><i class="fa-solid fa-chevron-right"></i></a>` : `<span class="toolbar-btn disabled-btn"><i class="fa-solid fa-chevron-right"></i></span>`}
      <button class="toolbar-btn" onclick="toggleTheme()" id="toolbarThemeBtn" title="Toggle theme" aria-label="Toggle dark/light mode">
        <i class="fa-solid fa-moon"></i>
      </button>
    </div>
  `;

  // Insert at body level, BEFORE the sidebar
  const body = document.body;
  body.insertBefore(toolbar, body.firstChild);

  // Make body a column layout so toolbar sits on top
  body.style.flexDirection = "column";

  // Wrap sidebar + main-wrapper in a row container
  const sidebar = document.getElementById("sidebar");
  const mainWrapper = document.querySelector(".main-wrapper");

  if (sidebar && mainWrapper) {
    const rowContainer = document.createElement("div");
    rowContainer.className = "content-row";
    rowContainer.style.display = "flex";
    rowContainer.style.flex = "1";
    rowContainer.style.minHeight = "0";

    // Move sidebar and main-wrapper into the row
    body.appendChild(rowContainer);
    rowContainer.appendChild(sidebar);
    rowContainer.appendChild(mainWrapper);
  }

  function updateThemeIcon() {
    const btn = document.getElementById("toolbarThemeBtn");
    if (!btn) return;
    const theme = document.documentElement.getAttribute("data-theme");
    btn.innerHTML =
      theme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
  }

  updateThemeIcon();

  const observer = new MutationObserver(updateThemeIcon);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
})();

// Scroll to top button
(function() {
  const btn = document.querySelector('.scroll-top-btn');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
})();
