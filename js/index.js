

// NAVBAR RESPONSIVE COLLAPSE
function navbarCollapse() {
    let x = document.getElementById("topNav");
    if (x.className === "top-nav") {
        x.className += " responsive";
    } else {
        x.className = "top-nav";
    }
}


// RECIPES SLIDE SHOW

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var images = document.getElementsByClassName("recipeSlides");
    var dots = document.getElementsByClassName("demo");

    if(n > images.length) {slideIndex = 1}
    if(n < 1) {slideIndex = images.length}
    for (var i = 0; i < images.length; i++) {
        images[i].classList.remove("active");
    }
    for (var i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" w3-white", "");
    }
    images[slideIndex-1].className += " active";
    // images[slideIndex-1].className += "showMe";
    dots[slideIndex-1].className += " w3-white";
}