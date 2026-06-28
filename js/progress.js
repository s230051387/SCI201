// Chapter completion status
// Each chapter has 3 parts: viewed content + quiz completed
// Status: 0 = not started, 1 = viewed, 2 = completed (quiz passed)

function updateProgress() {
  let completedChapters = 0;
  const totalChapters = 13;

  for (let i = 1; i <= totalChapters; i++) {
    const status = localStorage.getItem("chapter_" + i + "_status");
    const statusElement = document.getElementById("status" + i);

    if (status === "completed") {
      completedChapters++;
      if (statusElement) {
        statusElement.textContent = "✅ Completed";
        statusElement.className = "status completed";
      }
    } else if (status === "viewed") {
      if (statusElement) {
        statusElement.textContent = "📖 In Progress";
        statusElement.className = "status in-progress";
      }
    } else {
      if (statusElement) {
        statusElement.textContent = "⬜ Not Started";
        statusElement.className = "status";
      }
    }
  }

  // Update progress bar
  const percentage = Math.round((completedChapters / totalChapters) * 100);
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  if (progressBar) {
    progressBar.style.width = percentage + "%";
    progressBar.textContent = percentage + "%";
  }

  if (progressText) {
    if (percentage === 0) {
      progressText.textContent =
        "📚 Start studying by clicking on a chapter above!";
    } else if (percentage === 100) {
      progressText.textContent =
        "🎉 Congratulations! You've completed all chapters!";
    } else {
      progressText.textContent = `📖 You've completed ${percentage}% of the course. Keep going!`;
    }
  }
}

// Mark chapter as viewed (called when user opens a chapter)
function markChapterViewed(chapterNum) {
  const currentStatus = localStorage.getItem(
    "chapter_" + chapterNum + "_status",
  );
  if (!currentStatus || currentStatus === "not-started") {
    localStorage.setItem("chapter_" + chapterNum + "_status", "viewed");
  }
  updateProgress();
}

// Mark chapter as completed (called when quiz is passed)
function markChapterCompleted(chapterNum) {
  localStorage.setItem("chapter_" + chapterNum + "_status", "completed");
  updateProgress();
}

// Initialize progress on page load
document.addEventListener("DOMContentLoaded", function () {
  updateProgress();
});
