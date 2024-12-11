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

    //Loop through all bullets itesms
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
        });

        //Loop Through pagination
        paginationBullets.forEach(function(bullet) {
            bullet.classList.remove('active');
        })
    }

}




// Initialize All Sliders
document.querySelectorAll('.slider-wrapper').forEach(initialSlider);