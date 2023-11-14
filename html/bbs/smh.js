document.writeln("<meta charset=\'utf-8\'>");
document.writeln("");
document.writeln("<style>");
document.writeln(".bizhong567 { width:100%; margin:0 auto;}");
document.writeln(".bizhong567-box{ float: left; width: 100%; display:none;}");
document.writeln(".action-bz{display:block;}");
document.writeln(".bizhong567-page { height: 40px; padding-top: 5px;}");
document.writeln(".bizhong567-btn { float: left; width: calc( 50% - 10px); height: 38px; line-height: 38px; margin-right: 10px; text-align: center; display: inline-block; background: #aaa; border: solid 1px #ccc; border-radius: 5px; background-image: linear-gradient(to top, #ddd, #fff); cursor: pointer;}");
document.writeln(".bizhong567-btn:hover { background-image: linear-gradient(to bottom, #ddd, #fff);}");
document.writeln(".bizhong567-btn.bizhong567-pre {}");
document.writeln(".bizhong567-btn.bizhong567-next { margin-right: 0;}");
document.writeln("");
document.writeln(".bizhong567 img {width:100%;height:100%; border-collapse: collapse; font-weight: bold;}");
document.writeln("</style>");
document.writeln(" ");
document.writeln("<div class=\'bizhong567 clearfix\'><img src=\'img/feicui/319.jpg\' id=\'123sjkjpicx567\'>");
document.writeln("    <div class=\'bizhong567-box action-bz\'>");
document.writeln("    </div>");
document.writeln("    ");
document.writeln("</div>");
document.writeln("    ");
document.writeln("<div class=\'bizhong567-page\'>");
document.writeln("    <span class=\'bizhong567-btn bizhong567-pre\' onclick=\'prex567();\'>下一期</span> ");
document.writeln("    <span class=\'bizhong567-btn bizhong567-next\' onclick=\'nextx567();\'>上一期</span>");
document.writeln("</div>");
document.writeln("<script>");
document.writeln("    var picArrx567=new Array(");

document.writeln("\'img/feicui/319.jpg\',")
document.writeln("\'img/feicui/318.jpg\',")
document.writeln("\'img/feicui/317.jpg\',")
document.writeln("\'img/feicui/316.jpg\',")
document.writeln("\'img/feicui/315.jpg\',")
document.writeln("\'img/feicui/314.jpg\',")
document.writeln("\'img/feicui/313.jpg\',")
document.writeln("\'img/feicui/312.jpg\',")
document.writeln("\'img/feicui/311.jpg\',")
document.writeln("\'img/feicui/310.jpg\',")
document.writeln("\'img/feicui/309.jpg\',")
document.writeln("\'img/feicui/308.jpg\',")
document.writeln("\'img/feicui/307.jpg\',")

document.writeln(");");
document.writeln("    var indexx=0;");
document.writeln("    function nextx567(){");
document.writeln("        indexx++;");
document.writeln("        if(indexx==picArrx567.length){");
document.writeln("            indexx=0;");
document.writeln("        }");
document.writeln("        document.getElementById(\'123sjkjpicx567\').src=picArrx567[indexx];");
document.writeln("    }");
document.writeln("    function prex567(){");
document.writeln("        indexx--;");
document.writeln("        if(indexx<0){");
document.writeln("            indexx=picArrx567.length-1;");
document.writeln("        }");
document.writeln("        document.getElementById(\'123sjkjpicx567\').src=picArrx567[indexx];");
document.writeln("    }");
document.writeln("</script>");
document.writeln("");
document.writeln("");
document.writeln("");