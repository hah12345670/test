var cur_status = "less";
$.extend({
show_more_init:function(){
//alert("show_more_init!");
var charNumbers=$(".kjtkc").html().length;//总字数
var limit=10;//显示字数
if(charNumbers>limit)
{
var orgText=$(".kjtkc").html();//原始文本
var orgHeight=$(".kjtkc").height();//原始高度
var showText=orgText.substring(0,limit);//最终显示的文本
$(".kjtkc").html(showText);
var contentHeight=$(".kjtkc").height();//截取内容后的高度
$(".kjtkb").click(
function() {
if(cur_status == "less"){
$(".kjtkc").height(contentHeight).html(orgText).animate({ height:orgHeight}, { duration: "slow" });
$(this).html("隐藏图>>");
cur_status = "more";
}else{
$(".kjtkc").height(orgHeight).html(showText).animate({ height:contentHeight}, { duration: "fast" });
$(this).html("更多图>>");
cur_status = "less";
}
}
);
}
else
{
$(".kjtkb").hide();
}
}
});
$(document).ready(function(){
$.show_more_init();
});