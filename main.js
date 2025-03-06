//^ Scoll to top
let scrollToTopBtn = document.querySelector(".scroll-to-top");
window.onscroll = () => {
    if(window.scrollY >= 600) {
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
//^ mobile nave bar mouse over

const allElements = Array.from(document.querySelectorAll("body *"));
const CheckBox = document.getElementById("checked");

document.body.addEventListener("click", event => {
    if(event.target !== CheckBox && !event.target.closest("ul.links li") && !event.target.closest(".icons")) {
        CheckBox.checked = false;
    }
});

// ---------------------------------------------------------------------------
//^ Image slider parts
function initialSlider(slider) {
    const sliderImages = Array.from(slider.querySelectorAll('.slider-container img'));
    const sliderCount = sliderImages.length;
    let currentSlide = 1;
    let slideElementNumber = slider.querySelector(".slide-number");
    let prevButton = slider.querySelector('.prev');
    let nextButton = slider.querySelector('.next');
    let indicatorsContainer = slider.querySelector('.indicators');
    let paginationElement = document.createElement("ul");
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
    function nextSlide () {
        if(nextButton.classList.contains('disabled')) {
            return 0;
        } else {
            currentSlide++;
            theChecker();
        }
    }
    function prevSlide () {
        if(prevButton.classList.contains('disabled')) {
            return 0;
        } else {
            currentSlide--;
            theChecker();
        }
    }
    function theChecker () {
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

        setTimeout( () => {
            sliderImages[currentSlide - 1].style.visibility = "visible";
        },1000);
        //Set Active class on the pa
        paginationCreatedUl.children[currentSlide -1].classList.add('active');
        //Check if the current is the first
        if(currentSlide === 1) {
            //Add disabled class on the prev button
            prevButton.classList.add("disabled");
        } else {
            //remove disabled class from the pre button
            prevButton.classList.remove("disabled");
        }
        //Check if the current is the Latest
        if(currentSlide === sliderCount) {
            //Add disabled class on the next button
            nextButton.classList.add("disabled");
        } else {
            //remove disabled class from the next button
            nextButton.classList.remove("disabled");
        }
    }
    //Remove All Active Classes
    function removeAllActive () {
        //Loop Through Images
        sliderImages.forEach(function(img) {
            img.classList.remove('active');
            img.style.cssText = "z-index: 0; display: none";
        });
        //Loop Through pagination
        paginationBullets.forEach(function(bullet) {
            bullet.classList.remove('active');
        })
    }
}
// Initialize All Sliders
document.querySelectorAll('.slider-wrapper').forEach(initialSlider);

// ---------------------------------------------------------------------------
//^ Full screen when the user click on the image

const popupImg = document.querySelector(".popup-img");
const popupClose = document.querySelector(".slider-wrapper .popup-img span");

document.querySelectorAll(".slider-container img").forEach(image => {
    image.onclick = () => {
        document.querySelector(".popup-img img").src = image.getAttribute("src");
        popupImg.classList.add("showBlock");
        // تشغيل التأثير بعد لحظة
        setTimeout(() => {
            popupImg.classList.add("showOpacity");
        },100);
        document.body.classList.add("no-scroll");
    };
});

popupClose.onclick = () => {
    setTimeout( () => {
        popupImg.classList.remove("showOpacity");
    },10);
    popupImg.classList.remove("showBlock");
    document.body.classList.remove("no-scroll");
};

