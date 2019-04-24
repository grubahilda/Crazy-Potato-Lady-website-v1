$(document).ready(function(){
    $(".owl-carousel").owlCarousel();
  });

  $('.loop').owlCarousel({
    center: true,
    items:2,
    loop:true,
    margin:10,
    responsive:{
        600:{
            items:4
        }
    }
});