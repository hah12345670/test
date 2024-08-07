document.writeln("<meta charset=\'utf-8\'>");
document.writeln("");
document.writeln("<style>");
document.writeln(".bizhong128 { width:100%; margin:0 auto;}");
document.writeln(".bizhong128-box{ float: left; width: 100%; display:none;}");
document.writeln(".action-bz{display:block;}");
document.writeln(".bizhong128-page { height: 40px; padding-top: 5px;}");
document.writeln(".bizhong128-btn { float: left; width: calc( 50% - 10px); height: 38px; line-height: 38px; margin-right: 10px; text-align: center; display: inline-block; background: #aaa; border: solid 1px #ccc; border-radius: 5px; background-image: linear-gradient(to top, #ddd, #fff); cursor: pointer;}");
document.writeln(".bizhong128-btn:hover { background-image: linear-gradient(to bottom, #ddd, #fff);}");
document.writeln(".bizhong128-btn.bizhong128-pre {}");
document.writeln(".bizhong128-btn.bizhong128-next { margin-right: 0;}");
document.writeln("");
document.writeln(".bizhong128 img {width:100%; border-collapse: collapse; font-weight: bold;}");
document.writeln("</style>");
document.writeln(" ");
document.writeln("<div class=\'bizhong128 clearfix\'><img src=\'/img/amhmt221.jpg\' id=\'123sjkjpicx8\'>");
document.writeln("    <div class=\'bizhong128-box action-bz\'>");
document.writeln("    </div>");
document.writeln("    ");
document.writeln("</div>");
document.writeln("    ");
document.writeln("<div class=\'bizhong128-page\'>");
document.writeln("    <span class=\'bizhong128-btn bizhong128-pre\' onclick=\'prex8();\'>下一期</span> ");
document.writeln("    <span class=\'bizhong128-btn bizhong128-next\' onclick=\'nextx8();\'>上一期</span>");
document.writeln("</div>");
document.writeln("<script>");
document.writeln("    var picArrx8=new Array(");

document.writeln("\'/img/amhmt221.jpg\',");
document.writeln("\'/img/amhmt220.jpg\',");
document.writeln("\'/img/amhmt219.jpg\',");
document.writeln("\'/img/amhmt218.jpg\',");
document.writeln("\'/img/amhmt217.jpg\',");
document.writeln("\'/img/amhmt216.jpg\',");
document.writeln("\'/img/amhmt215.jpg\',");
document.writeln("\'/img/amhmt214.jpg\',");
document.writeln("\'/img/amhmt213.jpg\',");
document.writeln("\'/img/amhmt212.jpg\',");
document.writeln("\'/img/amhmt211.jpg\',");
document.writeln("\'/img/amhmt210.jpg\',");
document.writeln("\'/img/amhmt209.jpg\',");
document.writeln("\'/img/amhmt208.jpg\',");




document.writeln("\'/img/amhmt207.jpg\'");


document.writeln(");");
document.writeln("    var indexx=0;");
document.writeln("    function nextx8(){");
document.writeln("        indexx++;");
document.writeln("        if(indexx==picArrx8.length){");
document.writeln("            indexx=0;");
document.writeln("        }");
document.writeln("        document.getElementById(\'123sjkjpicx8\').src=picArrx8[indexx];");
document.writeln("    }");
document.writeln("    function prex8(){");
document.writeln("        indexx--;");
document.writeln("        if(indexx<0){");
document.writeln("            indexx=picArrx8.length-1;");
document.writeln("        }");
document.writeln("        document.getElementById(\'123sjkjpicx8\').src=picArrx8[indexx];");
document.writeln("    }");
document.writeln("</script>");
document.writeln("");
document.writeln("");