sections=$("section");
s=0;

$(".next").click(function() {
if(s<sections.length-1){
s++;
$('html, body').animate({
   scrollTop: sections.eq(s).offset().top
}, 500);
}});

$(".previous").click(function() {
if(s>0){
s--;
$('html, body').animate({
   scrollTop: sections.eq(s).offset().top
}, 500);
}});