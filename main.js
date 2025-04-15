//^ Header move on scroll
let header = document.querySelector("header .container");
let headerHeight = header.offsetHeight;
let lastScrollY = 0;

window.addEventListener("scroll", () => {
    let currentScrollY = window.scrollY;
    if (currentScrollY >= 50 && currentScrollY >= lastScrollY) {
        header.style.cssText = `transform: translateY(-${headerHeight}px); position: fixed;`;
    } else if (currentScrollY < lastScrollY) {
        header.style.cssText = `transform: translateY(0px);`;
    }
    lastScrollY = currentScrollY;
});

//^ Scoll to top
let scrollToTopBtn = document.querySelector(".scroll-to-top");
window.onscroll = () => {
    if (window.scrollY >= 600) {
        scrollToTopBtn.style.display = "block";
        scrollToTopBtn.style.opacity = "1";
    } else {
        scrollToTopBtn.style.opacity = "0";
    }
}

scrollToTopBtn.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// ---------------------------------------------------------------------------
//^ image under the nav bar
const mainImg = document.querySelector(".home .image");

// mainImg.style.top = `${headerHeight}px`

//^ mobile nav bar mouse over
const allElements = Array.from(document.querySelectorAll("body *"));
const CheckBox = document.getElementById("checked");

document.body.addEventListener("click", event => {
    if (event.target !== CheckBox && !event.target.closest("ul.links li") && !event.target.closest(".icons")) {
        CheckBox.checked = false;
    }
});
window.addEventListener("scroll", () => {
    CheckBox.checked = false;
});
// ---------------------------------------------------------------------------
//^ Annimation

const skills = document.querySelector(".technical ul");
const exps = document.querySelector(".management ul");
const serviceItems = document.querySelectorAll(".services .container .service");

const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const target = entry.target;
            if (target === skills) {
                skills.classList.add("animate");
            } else if (target === exps) {
                exps.classList.add("animate-two");
            } else {
                target.classList.add("service-animate");
                observer.unobserve(target);
            }
        }
    });
};

const observer = new IntersectionObserver(callback, {
    threshold: 0.5
});

if (skills) observer.observe(skills);
if (exps) observer.observe(exps);

serviceItems.forEach(item => {
    if (item) observer.observe(item);
});



// ---------------------------------------------------------------------------
//^ Full screen when the user click on the image
function initialFullScreen(element) {
    const popupImg = element.querySelector(".popup-img");
    const popupClose = element.querySelector(".slider-wrapper .popup-img .close-popup");
    element.querySelectorAll(".slider-container img").forEach(image => {
        image.onclick = () => {
            element.querySelector(".popup-img img").src = image.getAttribute("src");
            popupImg.classList.add("showBlock");
            // تشغيل التأثير بعد لحظة
            setTimeout(() => {
                popupImg.classList.add("showOpacity");
            }, 100);
            document.body.classList.add("no-scroll");
        };
    });

    popupClose.onclick = () => {
        setTimeout(() => {
            popupImg.classList.remove("showOpacity");
        }, 10);
        popupImg.classList.remove("showBlock");
        document.body.classList.remove("no-scroll");
    };

    popupImg.addEventListener("click", (e) => {
        if (e.target === popupImg) {
            setTimeout(() => {
                popupImg.classList.remove("showOpacity");
            }, 10);
            popupImg.classList.remove("showBlock");
            document.body.classList.remove("no-scroll");
        }

    });
}
document.querySelectorAll('.slider-wrapper').forEach(initialFullScreen);


// ---------------------------------------------------------------------------
//^ Image slider parts
function initialSlider(slider) {
    const popupImg = slider.querySelector(".popup-img");
    const sliderImages = Array.from(slider.querySelectorAll('.slider-container img'));
    const sliderCount = sliderImages.length;
    const sliderImagesBox = slider.querySelector('.slider-container');
    let currentSlide = 1;
    let slideElementNumber = slider.querySelector(".slide-number");
    let prevButton = slider.querySelector('.prev');
    let nextButton = slider.querySelector('.next');
    let paginationElement = document.createElement("ul");
    let popupCurrentImg = 1;

    paginationElement.setAttribute("class", "pagination-ul");
    for (let index = 1; index <= sliderCount; index++) {
        let paginationItem = document.createElement('li');
        paginationItem.setAttribute("data-index", index);
        paginationItem.appendChild(document.createTextNode(index));
        paginationElement.appendChild(paginationItem);
    }
    slider.querySelector(".indicators").appendChild(paginationElement);
    let paginationCreatedUl = slider.querySelector(".pagination-ul");
    //Get pagination items
    let paginationBullets = Array.from(slider.querySelectorAll('.pagination-ul li'))
    //Loop through all bullets items
    paginationBullets.forEach(function (bullet) {
        bullet.addEventListener("click", function () {
            currentSlide = parseInt(this.getAttribute('data-index'));
            theChecker();
        });
    });
    theChecker();
    nextButton.onclick = nextSlide;
    prevButton.onclick = prevSlide;

    //^ Swipe and touches for mobile
    let startX = 0;
    sliderImagesBox.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX;
    });
    sliderImagesBox.addEventListener("touchend", (event) => {
        let endX = event.changedTouches[0].clientX;
        let pixelsDiffer = endX - startX;

        if (pixelsDiffer > 50) {
            prevSlide();
        } else if (pixelsDiffer < -50) {
            nextSlide();
        }
    });

    function nextSlide() {
        if (nextButton.classList.contains('disabled')) {
            return 0;
        } else {
            currentSlide++;
            theChecker();
        }
    }
    function prevSlide() {
        if (prevButton.classList.contains('disabled')) {
            return 0;
        } else {
            currentSlide--;
            theChecker();
        }
    }
    function theChecker() {
        //Set the slider number
        slideElementNumber.textContent = "Image " + currentSlide + " of " + sliderCount;
        //Remove All Active Classes
        removeAllActive();
        //Set Active class on the current slide
        sliderImages[currentSlide - 1].classList.add('active');
        sliderImages[currentSlide - 1].style.cssText = "z-index: 2; display: block; opacity: 0;";
        setTimeout(() => {
            sliderImages[currentSlide - 1].style.opacity = "1";
        }, 200);

        setTimeout(() => {
            sliderImages[currentSlide - 1].style.visibility = "visible";
        }, 1000);
        //Set Active class on the pa
        paginationCreatedUl.children[currentSlide - 1].classList.add('active');
        //Check if the current is the first
        if (currentSlide === 1) {
            //Add disabled class on the prev button
            prevButton.classList.add("disabled");
        } else {
            //remove disabled class from the pre button
            prevButton.classList.remove("disabled");
        }
        //Check if the current is the Latest
        if (currentSlide === sliderCount) {
            //Add disabled class on the next button
            nextButton.classList.add("disabled");
        } else {
            //remove disabled class from the next button
            nextButton.classList.remove("disabled");
        }
    }
    //Remove All Active Classes
    function removeAllActive() {
        //Loop Through Images
        sliderImages.forEach(function (img) {
            img.classList.remove('active');
            img.style.cssText = "z-index: 0; display: none";
        });
        //Loop Through pagination
        paginationBullets.forEach(function (bullet) {
            bullet.classList.remove('active');
        });
    }


    // ---------------------------------------------------------------------------
    //^ images slider inside the popup (full-screen mode)

    const prevPopupButton = slider.querySelector(".popup-img .arrow.left");
    const nextPopupButton = slider.querySelector(".popup-img .arrow.right");

    //^ Change the popupCurrentImg to the current image
    sliderImages.forEach(function (image, index) {
        image.addEventListener("click", () => {
            popupCurrentImg = index + 1;
        });
    });

    //^ The Action that will happend after clicking on the prevPopupButton
    function fullScreenPrevImage() {
        if (popupCurrentImg > 1) {
            popupCurrentImg--;
            slider.querySelector(".popup-img img").src = sliderImages[popupCurrentImg - 1].src;
        }
    }
    //^ The Action that will happend after clicking on the nextPopupButton
    function fullScreenNextImage() {
        if (popupCurrentImg != sliderCount) {
            popupCurrentImg++;
            slider.querySelector(".popup-img img").src = sliderImages[popupCurrentImg - 1].src;
        };
    }
    prevPopupButton.addEventListener("click", fullScreenPrevImage);
    nextPopupButton.addEventListener("click", fullScreenNextImage);

    // //^ Swipe and touches for mobile
    let startFullScreenX = 0;
    popupImg.addEventListener("touchstart", (event) => {
        startFullScreenX = event.touches[0].clientX;
    });
    popupImg.addEventListener("touchend", (event) => {
        let endFullScreenX = event.changedTouches[0].clientX;
        let pixelsDiffer = endFullScreenX - startFullScreenX;

        if (pixelsDiffer > 50) {
            fullScreenPrevImage();
        } else if (pixelsDiffer < -50) {
            fullScreenNextImage();
        }
    });
}
// Initialize All Sliders
document.querySelectorAll('.slider-wrapper').forEach(initialSlider);

let images = document.querySelectorAll("img");
images.forEach(element => {
    element.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
});
images.forEach(element => {
    element.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });
});
