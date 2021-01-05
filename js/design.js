
document.addEventListener("scroll", function(){
    if (window.scrollY > 70 ){
        $(".second-nav").css("position","fixed");
        $(".second-nav ul li a").css("color","#666");
        $(".second-nav i").css("color","#666");
        $(".second-nav").css("background","#fff").css("padding-top","15px").css("top","0px");
    }else{
        $(".second-nav ul li a").css("color","#ddd");
        $(".second-nav").css("background","transparent").css("top","60px");
        $(".second-nav i").css("color","#ddd");
    }
    
});

$(".second-nav ul li a").click(function(){
    $(".second-nav ul li").removeClass("active");
    $(this).parent().addClass("active");
});
$(".about-link").click(function(){
    $("html,body").animate({
        scrollTop: $('#about').offset().top - 100
    },1000); 
 });
 $(".product-link").click(function(){
    $("html,body").animate({
        scrollTop: $('#some_product').offset().top - 80
    },1000); 
 });
 $(".leaderShip-link").click(function(){
    $("html,body").animate({
        scrollTop: $('#leadership').offset().top - 120
    },1000); 
 });
 $(".contact-link").click(function(){
    $("html,body").animate({
        scrollTop: $('#contact').offset().top -120
    },1000); 
 });
 $(".home-link").click(function(){
    $("html,body").animate({
        scrollTop: 0
    },1000); 
 });









