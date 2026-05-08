import { fetchLink } from "./main.js";

//^ Header move on scroll
let header = document.querySelector("header");
let headerHeight = header ? header.offsetHeight : 0;
let lastScrollY = 0;

if (header) {
  window.addEventListener("scroll", () => {
    let currentScrollY = window.scrollY;
    if (currentScrollY >= 50 && currentScrollY >= lastScrollY) {
      header.style.cssText = `transform: translateY(-${headerHeight}px); position: fixed;`;
    } else if (currentScrollY < lastScrollY) {
      header.style.cssText = `transform: translateY(0px);`;
    }
    lastScrollY = currentScrollY;
  });
}

// ---------------------------------------------------------------------------
//^ Scroll to top
let scrollToTopBtn = document.querySelector(".scroll-to-top");

if (scrollToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY >= 600) {
      scrollToTopBtn.style.display = "block";
      scrollToTopBtn.style.opacity = "1";
    } else {
      scrollToTopBtn.style.opacity = "0";
    }
  });

  scrollToTopBtn.onclick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
}

// ---------------------------------------------------------------------------
//^ Mobile nav bar mouse over
const CheckBox = document.getElementById("checked");

if (CheckBox) {
  document.body.addEventListener("click", (event) => {
    if (
      event.target !== CheckBox &&
      !event.target.closest("ul.links li") &&
      !event.target.closest(".icons")
    ) {
      CheckBox.checked = false;
    }
  });

  window.addEventListener("scroll", () => {
    CheckBox.checked = false;
  });
}

// ---------------------------------------------------------------------------
//^ Page Load Animation (حل مشكلة الوميض)
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// ---------------------------------------------------------------------------

const projectsWrapper = document.querySelector(".projects-wrapper .container");
const path = window.location.href;
const fileName = path.split("/").pop();

async function FetchAndDisplayProjects() {
  if (!projectsWrapper) return;

  try {
    const response = await fetch(fetchLink);

    if (!response.ok) {
      throw new Error("Connection With Categories API Failed!!");
    }

    const jsonCategoryData = await response.json();
    const categoryData = jsonCategoryData.data;

    categoryData.forEach((category) => {
      if (
        category.category_description.toLowerCase() === fileName.toLowerCase()
      ) {
        let projects = category.projects;

        projects.forEach((project) => {
          const projectContainer = document.createElement("div");
          projectContainer.className = "project-container";

          const projectHeader = document.createElement("div");
          projectHeader.className = "project-header";

          const projectTitle = document.createElement("h2");
          projectTitle.className = "project-title";
          projectTitle.innerText = project.project_name;

          const projectCat = document.createElement("span");
          projectCat.className = "project-category";
          projectCat.innerText = category.category_name;

          projectHeader.appendChild(projectTitle);
          projectHeader.appendChild(projectCat);

          const sliderContainer = document.createElement("div");
          sliderContainer.className = "slider-container";

          const imageSlider = document.createElement("div");
          imageSlider.className = "slides";

          const sliderContent = document.createElement("div");
          sliderContent.className = "slider-content";
          // ^^^  إضافة زر Full-screen هنا ^^^
          sliderContent.innerHTML = `
            <div class="image-counter"><span class="current-img">1</span> / <span class="total-imgs">${project.project_image.length}</span></div>
            
            <button class="nav-btn fs-btn" aria-label="عرض بملء الشاشة">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            </button>

            <button class="nav-btn prev-btn" aria-label="السابق" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <button class="nav-btn next-btn" aria-label="التالي" ${project.project_image.length <= 1 ? "disabled" : ""}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          `;

          sliderContainer.appendChild(sliderContent);

          project.project_image.forEach((img, index) => {
            const image = document.createElement("img");
            image.src = img.image;
            if (index === 0) {
              img.loading = "eager";
            } else {
              img.loading = "lazy";
            }
            imageSlider.appendChild(image);
          });

          const projectFooter = document.createElement("footer");
          projectFooter.className = "project-footer";

          const dotsWrapper = document.createElement("div");
          dotsWrapper.className = "dots-wrapper";

          project.project_image.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.className = `dot ${index === 0 ? "active" : ""}`;
            dotsWrapper.appendChild(dot);
          });

          const description = document.createElement("div");
          description.className = "project-description";
          description.innerText = project.project_description;

          projectFooter.appendChild(dotsWrapper);
          projectFooter.appendChild(description);

          projectContainer.appendChild(projectHeader);
          sliderContainer.appendChild(imageSlider);
          projectContainer.appendChild(sliderContainer);
          projectContainer.appendChild(projectFooter);
          projectsWrapper.appendChild(projectContainer);

          // تهيئة السلايدر العادي
          initSlider(projectContainer);

          // ^^^ إضافة حدث ضغط لزر Full-screen ^^^
          const fsBtn = projectContainer.querySelector(".fs-btn");
          fsBtn.addEventListener("click", () => {
            openFullscreen(projectContainer);
          });
        });
      }
    });
  } catch (err) {
    console.log("Try-Catch Error: ", err);
  }
}

// ---------------------------------------------------------------------------
// ^^^  دالة فتح  Full-screen ^^^
function openFullscreen(originalContainer) {
  // 1. إنشاء الطبقة الخلفية المعتمة (Overlay)
  const overlay = document.createElement("div");
  overlay.className = "fs-overlay";

  // 2. إنشاء زر الإغلاق (X)
  const closeBtn = document.createElement("button");
  closeBtn.className = "fs-close-btn";
  closeBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    `;
  overlay.appendChild(closeBtn);

  // 3. عمل نسخة عميقة (Clone) من حاوية المشروع بالكامل
  const clonedContainer = originalContainer.cloneNode(true);
  clonedContainer.classList.add("in-fullscreen"); // كلاس للتمييز في الـ CSS

  // تنظيف النسخة: إزالة زر الـ FS القديم، الـ Header، والـ Description لو مش عايزهم يظهروا في الـ FS
  const oldFsBtn = clonedContainer.querySelector(".fs-btn");
  if (oldFsBtn) oldFsBtn.remove();
  const header = clonedContainer.querySelector(".project-header");
  if (header) header.remove();
  const footerDesc = clonedContainer.querySelector(".project-description");
  if (footerDesc) footerDesc.remove();

  // إضافة النسخة داخل الـ Overlay
  overlay.appendChild(clonedContainer);
  // إضافة الـ Overlay للجسم (Body)
  document.body.appendChild(overlay);

  // لمنع سكرول الصفحة الخلفية
  document.body.style.overflow = "hidden";

  // 4. تهيئة السلايدر للنسخة الجديدة (مهم جداً!)
  initSlider(clonedContainer);

  // 5. منطق الإغلاق
  const closeFS = () => {
    overlay.remove(); // مسح النسخة بالكامل من الـ DOM
    document.body.style.overflow = ""; // إعادة السكرول للصفحة
  };

  closeBtn.addEventListener("click", closeFS);

  // الإغلاق عند الضغط على الـ Overlay نفسه (خارج حاوية الصورة)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeFS();
    }
  });

  // الإغلاق بزر Esc
  document.addEventListener("keydown", function handler(e) {
    if (e.key === "Escape") {
      closeFS();
      document.removeEventListener("keydown", handler); // إزالة الحدث بعد الاستخدام
    }
  });
}
// ---------------------------------------------------------------------------

// دالة الـ Slider (مع إضافة كود النقط clickable من الرد السابق)
function initSlider(container) {
  const slider = container.querySelector(".slides");
  const dots = container.querySelectorAll(".dot");
  const counter = container.querySelector(".current-img");

  const rightArrowBtn = container.querySelector(".prev-btn");
  const leftArrowBtn = container.querySelector(".next-btn");
  const slideImages = slider.querySelectorAll("img");

  let currentIndex = 0;

  const updateButtonsState = (index) => {
    if (slideImages.length <= 1) {
      if (leftArrowBtn) leftArrowBtn.disabled = true;
      if (rightArrowBtn) rightArrowBtn.disabled = true;
      return;
    }
    if (leftArrowBtn) leftArrowBtn.disabled = index === 0;
    if (rightArrowBtn)
      rightArrowBtn.disabled = index === slideImages.length - 1;
  };

  // تأكد من تهيئة العداد الكلي في البداية
  const totalCounter = container.querySelector(".total-imgs");
  if (totalCounter) totalCounter.textContent = slideImages.length;

  slider.addEventListener("scroll", () => {
    const width = slider.clientWidth;
    currentIndex = Math.round(Math.abs(slider.scrollLeft) / width);

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    if (counter) counter.textContent = currentIndex + 1;
    updateButtonsState(currentIndex);
  });

  //  جعل النقط clickable
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (slideImages[index]) {
        slideImages[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    });
  });

  if (rightArrowBtn) {
    rightArrowBtn.addEventListener("click", () => {
      if (currentIndex < slideImages.length - 1) {
        slideImages[currentIndex + 1].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    });
  }

  if (leftArrowBtn) {
    leftArrowBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        slideImages[currentIndex - 1].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    });
  }

  updateButtonsState(0);
}

FetchAndDisplayProjects();
