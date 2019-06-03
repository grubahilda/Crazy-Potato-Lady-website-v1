// NAVBAR RESPONSIVE COLLAPSE
function navbarCollapse() {
    let x = document.getElementById("topNav");
    if (x.className === "top-nav") {
        x.className += " responsive";
    } else {
        x.className = "top-nav";
    }
}


//GLOBALS
var IngredientId = 1;
var slideIndex = 1;

// RECIPES SLIDE SHOW

showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var images = document.getElementsByClassName("recipeSlides");

    if (images.length == 0) {
        return;
    }
    var dots = document.getElementsByClassName("demo");

    if (n > images.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = images.length
    }
    for (var i = 0; i < images.length; i++) {
        images[i].classList.remove("active");
    }
    for (var i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" w3-white", "");
    }
    images[slideIndex - 1].className += " active";
    // images[slideIndex-1].className += "showMe";
    dots[slideIndex - 1].className += " w3-white";
}




// Footnote copyright year
window.onload = function () {
    d = new Date();
    document.getElementById("currentYear").innerHTML = d.getFullYear();
}



// Footer colour

window.onload = function () {
    document.getElementsByTagName("footer")[0].style.backgroundColor = document.getElementsByTagName("body")[0].style.backgroundColor;
}


// Page title
window.onload = function () {
    document.title = document.getElementsByClassName("page-title")[0].innerHTML + " || Crazy Potato Lady";
}



//ONMOUSEDOWN PHONE NUMBER REVEAL
function mouseDownPhoneNumber() {
    document.getElementById("phoneNumber").innerHTML = "0 621 419 988";
}

function mouseUpPhoneNumber() {
    document.getElementById("phoneNumber").innerHTML = document.getElementById("phoneNumber").title;
}


// Touch events on slide show index.ejs


// var sliderMain = document.getElementById('sliderMain');

// var hammertime = new Hammer(sliderMain);

// hammertime.on("swipe", function(ev){
    
// });

$(document).ready(function() {
    var owl = $('.owl-carousel');
    owl.owlCarousel({
      margin: 0,
      nav: true,
      loop: false,
      responsive: {
        0: {
            items: 1
          },
        600: {
            items: 2
          },
        950: {
          items: 3
        },
        1250: {
          items: 4
        },
        1500: {
          items: 5
        }
      }
    })
  })


function addIngredient() {

    console.log(document.getElementById("fieldIngredients").children.length-1);
    
    if(document.getElementById("fieldIngredients").childElementCount > 2) {
        document.getElementById("ingredient" + IngredientId).removeChild(document.getElementsByClassName("addIngredientButton")[0]);
    }
 
    IngredientId++;
    
    const newIngredientDiv = document.createElement("div");
    newIngredientDiv.id = "ingredient" + IngredientId;
    // newIngredientDiv.className = "";
    document.getElementById("fieldIngredients").appendChild(newIngredientDiv);
    const newIngredientName = document.createElement("input");
    newIngredientName.type = "text";
    newIngredientName.placeholder = "Ingredient";
    document.getElementById(newIngredientDiv.id).appendChild(newIngredientName);
    const newIngredientAmount = document.createElement("input");
    newIngredientAmount.type = "text";
    newIngredientAmount.placeholder = "Amount";
    document.getElementById(newIngredientDiv.id).appendChild(newIngredientAmount);
    const newIngredientSelect = document.createElement("select");
    document.getElementById(newIngredientDiv.id).appendChild(newIngredientSelect);
    const newIngredientOptionPiece = document.createElement("option");
    newIngredientOptionPiece.value = "piece";
    newIngredientOptionPiece.text = "Piece";
    document.getElementById(newIngredientDiv.id).getElementsByTagName("select")[0].appendChild(newIngredientOptionPiece);
    const newIngredientOptionMl = document.createElement("option");
    newIngredientOptionMl.value = "ml";
    newIngredientOptionMl.text = "ml";
    document.getElementById(newIngredientDiv.id).getElementsByTagName("select")[0].appendChild(newIngredientOptionMl);
    const newIngredientOptionG = document.createElement("option");
    newIngredientOptionG.value = "g";
    newIngredientOptionG.text = "g";
    document.getElementById(newIngredientDiv.id).getElementsByTagName("select")[0].appendChild(newIngredientOptionG);
    const newIngredientButton = document.createElement("button");
    newIngredientButton.type = "button";
    newIngredientButton.className = "addIngredientButton";
    newIngredientButton.setAttribute("onClick", "addIngredient()");
    newIngredientButton.innerText = "+";
    document.getElementById(newIngredientDiv.id).appendChild(newIngredientButton);
    const IngredientButtonRemove = document.createElement("button");
    IngredientButtonRemove.type = "button";
    IngredientButtonRemove.className = "removeIngredientButton";
    IngredientButtonRemove.setAttribute("onClick", "removeIngredient(" + newIngredientDiv.id + ")");
    IngredientButtonRemove.innerText = "-";
    document.getElementById(newIngredientDiv.id).appendChild(IngredientButtonRemove);

}

function removeIngredient(ingredient) {
    
    document.getElementById("fieldIngredients").removeChild(ingredient);

    const newIngredientButton = document.createElement("button");
    newIngredientButton.type = "button";
    newIngredientButton.className = "addIngredientButton";
    newIngredientButton.setAttribute("onClick", "addIngredient()");
    newIngredientButton.innerText = "+";
    document.getElementById("fieldIngredients").lastElementChild.appendChild(newIngredientButton);
}