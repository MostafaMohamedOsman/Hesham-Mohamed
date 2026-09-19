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

          project.project_image.forEach((media, index) => {
            const mediaWrapper = document.createElement("div");
            mediaWrapper.className = "slide-media";
            const mediaElement = createMediaElement(media.image, index);
            mediaWrapper.appendChild(mediaElement);

            if (mediaElement.tagName === "IMG") {
              mediaWrapper.classList.add("is-image-slide");
              mediaWrapper.addEventListener("click", () => {
                openFullscreen(projectContainer);
              });
            }

            imageSlider.appendChild(mediaWrapper);
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

function createMediaElement(mediaUrl, index) {
  const mediaType = getMediaType(mediaUrl);
  const mediaElement = document.createElement(mediaType);

  mediaElement.dataset.src = mediaUrl;
  mediaElement.dataset.mediaType = mediaType;

  if (mediaType === "video") {
    mediaElement.controls = true;
    mediaElement.playsInline = true;
    mediaElement.preload = "none";
  } else {
    mediaElement.loading = "lazy";
    mediaElement.decoding = "async";
    mediaElement.alt = "Project media";
  }

  return mediaElement;
}

function getMediaType(mediaUrl) {
  try {
    const extension = new URL(mediaUrl, window.location.href).pathname
      .split(".")
      .pop()
      .toLowerCase();
    const videoExtensions = ["mp4", "webm", "ogg", "ogv", "mov", "m4v"];

    return videoExtensions.includes(extension) ? "video" : "img";
  } catch {
    return "img";
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

  const zoomControls = document.createElement("div");
  zoomControls.className = "fs-zoom-controls";
  zoomControls.innerHTML = `
    <button type="button" class="fs-zoom-out" aria-label="تصغير">-</button>
    <span class="fs-zoom-level">100%</span>
    <button type="button" class="fs-zoom-in" aria-label="تكبير">+</button>
    <button type="button" class="fs-zoom-reset" aria-label="إعادة ضبط التكبير">Reset</button>
  `;
  overlay.appendChild(zoomControls);

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
  initFullscreenZoom(clonedContainer, zoomControls);

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

function initFullscreenZoom(container, controls) {
  const slider = container.querySelector(".slides");
  const media = Array.from(
    slider.querySelectorAll(".slide-media > img, .slide-media > video"),
  );
  const zoomInButton = controls.querySelector(".fs-zoom-in");
  const zoomOutButton = controls.querySelector(".fs-zoom-out");
  const resetButton = controls.querySelector(".fs-zoom-reset");
  const levelLabel = controls.querySelector(".fs-zoom-level");
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  const getCurrentMedia = () => {
    const index = Math.round(Math.abs(slider.scrollLeft) / slider.clientWidth);
    return media[index] || media[0];
  };

  const renderZoom = () => {
    const currentMedia = getCurrentMedia();
    slider.classList.toggle("is-zoomed", scale > 1);
    levelLabel.textContent = `${Math.round(scale * 100)}%`;

    media.forEach((item) => {
      item.style.transform =
        item === currentMedia
          ? `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`
          : "";
    });
  };

  const resetZoom = () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    renderZoom();
  };

  zoomInButton.addEventListener("click", () => {
    scale = Math.min(10, scale + 0.5);
    renderZoom();
  });

  zoomOutButton.addEventListener("click", () => {
    scale = Math.max(1, scale - 0.5);
    if (scale === 1) {
      offsetX = 0;
      offsetY = 0;
    }
    renderZoom();
  });

  resetButton.addEventListener("click", resetZoom);

  slider.addEventListener("scroll", () => {
    if (scale > 1) resetZoom();
  });

  slider.addEventListener("pointerdown", (event) => {
    if (scale <= 1 || event.target !== getCurrentMedia()) return;
    event.preventDefault();
    isDragging = true;
    dragStartX = event.clientX - offsetX;
    dragStartY = event.clientY - offsetY;
    slider.setPointerCapture(event.pointerId);
  });

  slider.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    offsetX = event.clientX - dragStartX;
    offsetY = event.clientY - dragStartY;
    renderZoom();
  });

  const stopDragging = () => {
    isDragging = false;
  };
  slider.addEventListener("pointerup", stopDragging);
  slider.addEventListener("pointercancel", stopDragging);
  slider.addEventListener("pointerleave", stopDragging);

  slider.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      scale = Math.min(10, Math.max(1, scale - event.deltaY * 0.002));
      if (scale === 1) {
        offsetX = 0;
        offsetY = 0;
      }
      renderZoom();
    },
    { passive: false },
  );

  renderZoom();
}
// ---------------------------------------------------------------------------

// دالة الـ Slider (مع إضافة كود النقط clickable من الرد السابق)
function initSlider(container) {
  const slider = container.querySelector(".slides");
  const dots = container.querySelectorAll(".dot");
  const counter = container.querySelector(".current-img");

  const rightArrowBtn = container.querySelector(".prev-btn");
  const leftArrowBtn = container.querySelector(".next-btn");
  const slideMedia = slider.querySelectorAll(".slide-media");

  let currentIndex = 0;

  const loadMedia = (mediaWrapper) => {
    if (!mediaWrapper) return;

    const mediaElement = mediaWrapper.querySelector("img, video");
    if (!mediaElement || mediaElement.src) return;

    mediaWrapper.classList.add("is-loading");
    mediaElement.src = mediaElement.dataset.src;
    delete mediaElement.dataset.src;

    if (mediaElement.tagName === "VIDEO") {
      mediaElement.load();
    }
  };

  const isMediaLoaded = (media) => {
    if (!media) return true;
    const mediaElement = media.querySelector("img, video");
    return mediaElement.tagName === "IMG"
      ? mediaElement.complete && mediaElement.naturalWidth > 0
      : mediaElement.readyState >= 3;
  };

  const updateLoadingState = () => {
    const currentMedia = slideMedia[currentIndex];
    currentMedia?.classList.toggle("is-loading", !isMediaLoaded(currentMedia));
  };

  slideMedia.forEach((mediaWrapper) => {
    const mediaElement = mediaWrapper.querySelector("img, video");
    mediaElement.addEventListener("load", updateLoadingState);
    mediaElement.addEventListener("loadeddata", updateLoadingState);
    mediaElement.addEventListener("error", () =>
      mediaWrapper.classList.remove("is-loading"),
    );
  });

  const mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) loadMedia(entry.target);
      });
    },
    { root: null, rootMargin: "0px", threshold: 0.1 },
  );

  slideMedia.forEach((mediaWrapper) => mediaObserver.observe(mediaWrapper));

  updateLoadingState();

  const updateButtonsState = (index) => {
    if (slideMedia.length <= 1) {
      if (leftArrowBtn) leftArrowBtn.disabled = true;
      if (rightArrowBtn) rightArrowBtn.disabled = true;
      return;
    }
    if (leftArrowBtn) leftArrowBtn.disabled = index === 0;
    if (rightArrowBtn) rightArrowBtn.disabled = index === slideMedia.length - 1;
  };

  // تأكد من تهيئة العداد الكلي في البداية
  const totalCounter = container.querySelector(".total-imgs");
  if (totalCounter) totalCounter.textContent = slideMedia.length;

  slider.addEventListener("scroll", () => {
    const width = slider.clientWidth;
    currentIndex = Math.round(Math.abs(slider.scrollLeft) / width);

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    if (counter) counter.textContent = currentIndex + 1;
    updateButtonsState(currentIndex);
    loadMedia(slideMedia[currentIndex]);
    updateLoadingState();
  });

  //  جعل النقط clickable
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (slideMedia[index]) {
        slideMedia[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    });
  });

  if (rightArrowBtn) {
    rightArrowBtn.addEventListener("click", () => {
      if (currentIndex < slideMedia.length - 1) {
        slideMedia[currentIndex + 1].scrollIntoView({
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
        slideMedia[currentIndex - 1].scrollIntoView({
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
