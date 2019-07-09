// initialize animation on scroll
AOS.init({
    duration: 1000,
    once: true,
    mirror: true,
    easing: 'ease',
    anchorPlacement: 'top-center',
});


// initialize swiper
var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    effect: 'fade',

  })


// NAVBAR RESPONSIVE COLLAPSE
function navbarCollapse() {
    let x = document.getElementById("topNav");
    if (x.className === "top-nav") {
        x.className += " responsive";
    } else {
        x.className = "top-nav";
    }
}


// Back to top button

var btn = $('#button');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});


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

    var ingredientsAdd = document.getElementsByClassName("addIngredientButton");

    for(var i = 0; i < ingredientsAdd.length; i++){
        ingredientsAdd[i].parentNode.removeChild(ingredientsAdd[i]);
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

    // if(document.getElementById("fieldIngredients").children.length-1 > 2) {
    console.log(document.getElementById("fieldIngredients").children.length-1);

}

function removeIngredient(ingredient) {
    
    document.getElementById("fieldIngredients").removeChild(ingredient);
    var ingredientsAdd = document.getElementsByClassName("addIngredientButton");

    for(var i = 0; i < ingredientsAdd.length; i++){
        ingredientsAdd[i].parentNode.removeChild(ingredientsAdd[i]);
    }

    const newIngredientButton = document.createElement("button");
    newIngredientButton.type = "button";
    newIngredientButton.className = "addIngredientButton";
    newIngredientButton.setAttribute("onClick", "addIngredient()");
    newIngredientButton.innerText = "+";
    document.getElementById("fieldIngredients").lastElementChild.appendChild(newIngredientButton);
}