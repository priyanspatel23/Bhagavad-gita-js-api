const pageTurnBtn = document.querySelectorAll(".nextprev-btn");
const pages = document.querySelectorAll(".book-page.page-right");
const coverRight = document.querySelector(".cover.cover-right");
const leftPage = document.querySelector(".book-page.page-left");
const backProfileBtn = document.querySelector(".back-profile");
const totalPages = pages.length;

let currentPage = 0;

// ---------- INITIAL PAGE SETUP ----------
pages.forEach((page, i) => {
  page.style.transition = "transform 1s ease, box-shadow 0.8s ease";
  page.style.transformOrigin = "left center";
  page.style.transformStyle = "preserve-3d";
  page.style.opacity = "1";
});

if (leftPage) leftPage.style.zIndex = 1;

// =====================================================
// 🔄 PAGE TURN LOGIC (NEXT + BACK)
// =====================================================
pageTurnBtn.forEach((btn) => {
  btn.onclick = () => {
    if (btn.classList.contains("back")) {
      // 🔙 Previous page
      if (currentPage > 0) {
        const prevPage = document.getElementById(`turn-${currentPage}`);
        if (prevPage && prevPage.classList.contains("turn")) {
          prevPage.classList.remove("turn");
          prevPage.style.transform = "rotateY(0deg)";
          prevPage.style.boxShadow = "inset 0 0 0 rgba(0,0,0,0)";
          currentPage--;
          reorderPages();
        }
      }
    } else {
      // ⏭️ Next page
      if (currentPage < totalPages) {
        currentPage++;
        const nextPage = document.getElementById(`turn-${currentPage}`);
        if (nextPage && !nextPage.classList.contains("turn")) {
          nextPage.classList.add("turn");
          nextPage.style.transform = "rotateY(-180deg)";
          nextPage.style.boxShadow = "inset -8px 0 20px rgba(0,0,0,0.3)";
          reorderPages();
        }
      }
    }
  };
});

// =====================================================
// 📑 PAGE REORDER FUNCTION
// =====================================================
function reorderPages() {
  const turned = document.querySelectorAll(".book-page.turn");
  const unturned = document.querySelectorAll(".book-page.page-right:not(.turn)");
  const total = pages.length;

  unturned.forEach((page, i) => {
    page.style.zIndex = total - i + 2;
  });

  turned.forEach((page, i) => {
    page.style.zIndex = i + 2;
  });

  if (leftPage) leftPage.style.zIndex = 1;
}

// =====================================================
// 🔙 BACK TO PROFILE (CLOSE BOOK ANIMATION)
// =====================================================
if (backProfileBtn) {
  backProfileBtn.onclick = () => {
    const reversedPages = Array.from(pages).reverse();
    reversedPages.forEach((page, index) => {
      setTimeout(() => {
        page.classList.remove("turn");
        page.style.transform = "rotateY(0deg)";
        page.style.boxShadow = "inset 0 0 0 rgba(0,0,0,0)";
        page.style.zIndex = 10 + index;
      }, index * 200 + 100);
    });
    setTimeout(() => {
      if (coverRight) {
        coverRight.classList.remove("turn");
        coverRight.style.transform = "rotateY(0deg)";
        coverRight.style.zIndex = 30;
      }
      if (leftPage) leftPage.style.zIndex = 1;
      currentPage = 0;
    }, reversedPages.length * 200 + 500);
  };
}


// =====================================================
// 📖 SMOOTH OPEN ANIMATION
// =====================================================
document.body.style.overflow = "hidden";
pages.forEach((p) => (p.style.opacity = "1"));
//////////////////////////////////////

const pageLeft = document.querySelector(".book-page.page-left");
let pageNumber = 0;

function reverseIndex() {
  pageNumber--;
  if (pageNumber < 0) {
    pageNumber = totalPages - 1;
  }
  console.log("pageNumber:", pageNumber);
}

// open animation (cover right animation)
setTimeout(() => {
  coverRight.classList.add("turn");
}, 2100);

setTimeout(() => {
  coverRight.style.zIndex = -1;
}, 2800);

pages.forEach((_, index) => {
  setTimeout(() => {
    reverseIndex();

    pages[pageNumber].classList.remove("turn");

     pages[pageNumber].style.zIndex = 1 + index;
  }, (index + 1) * 200 + 2100);
});

/////////////////////////////////////////

// =====================================================
// 🕉️ LOAD BHAGAVAD GITA CHAPTERS
// =====================================================
const apiUrl = () => {
  const container = document.getElementById("chapters-container");
  if (!container) return;

  // container.innerHTML = "<p>Loading Bhagavad Gita chapters...</p>";

  fetch("https://vedicscriptures.github.io/chapters")
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = "";

      data.forEach((chapter, index) => {
        const div = document.createElement("div");
        div.style.border = "1px solid #9c5c16";
        div.style.borderRadius = "8px";
        div.style.padding = "10px";
        div.style.background = "#fbf0d8";
        div.style.boxShadow = "0 0 6px rgba(0,0,0,0.15)";
        div.style.cursor = "pointer";
        div.style.transition = "transform 0.2s ease";
        div.innerHTML = `<strong style="color:#9c5c16;">अध्याय ${chapter.chapter_number}: ${chapter.name}</strong>`;
        div.onmouseover = () => (div.style.transform = "scale(1.03)");
        div.onmouseout = () => (div.style.transform = "scale(1)");

        let chapterPage = document.getElementById(`turn-${index + 2}`);
        if (chapterPage) {
          let summaryDiv = document.createElement("div");
          summaryDiv.classList.add("chapter-summary");
          summaryDiv.style.padding = "15px";
          summaryDiv.innerHTML = `
            <h3 style="color:#9c5c16;">अध्याय ${chapter.chapter_number}: ${
            chapter.name
          }</h3>
            <p style="font-size:17px; margin-top:5px; line-height:1.4;">
              ${
                chapter.summary?.hi ||
                chapter.summary?.en ||
                "Summary not available."
              }
            </p>
          `;
          chapterPage.querySelector(".page-front")?.appendChild(summaryDiv);
        }

        div.onclick = () => {
          for (let i = 1; i <= index + 1; i++) {
            const p = document.getElementById(`turn-${i}`);
            if (p && !p.classList.contains("turn")) {
              setTimeout(() => {
                p.classList.add("turn");
                p.style.transform = "rotateY(-180deg)";
                p.style.boxShadow = "inset -8px 0 20px rgba(0,0,0,0.3)";
                reorderPages();
              }, i * 200);
            }
          }
          currentPage = index + 1;
        };

        container.appendChild(div);
      });
    })
    .catch((err) => {
      container.innerHTML = "<p>⚠️ Failed to load chapters.</p>";
      console.error(err);
    });
};

apiUrl();
