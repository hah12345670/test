document.writeln("<meta charset=\'utf-8\'>");
document.writeln("");
document.writeln("<style>");
document.writeln(".bizhong123 { width:100%; margin:0 auto;}");
document.writeln(".bizhong123-box{ float: left; width: 100%; display:none;}");
document.writeln(".action-bz{display:block;}");
document.writeln(".bizhong123-page { height: 40px; padding-top: 5px;}");
document.writeln(".bizhong123-btn { float: left; width: calc( 50% - 10px); height: 38px; line-height: 38px; margin-right: 10px; text-align: center; display: inline-block; background: #aaa; border: solid 1px #ccc; border-radius: 5px; background-image: linear-gradient(to top, #ddd, #fff); cursor: pointer;}");
document.writeln(".bizhong123-btn:hover { background-image: linear-gradient(to bottom, #ddd, #fff);}");
document.writeln(".bizhong123-btn.bizhong123-pre {}");
document.writeln(".bizhong123-btn.bizhong123-next { margin-right: 0;}");
document.writeln("");
document.writeln(".bizhong123 img {width:100%; border-collapse: collapse; font-weight: bold;}");
document.writeln("</style>");
document.writeln("<div class=\'bizhong123 clearfix\'>");
document.writeln("    <div class=\'bizhong123-box action-bz\'>");
document.writeln("<img src=\'https://tk2.zaojiao365.net:4949/col/120/amsbx.jpg\' id=\'lfktzm\'>");
document.writeln("    </div>");
document.writeln("    ");
document.writeln("</div>");
document.writeln("    ");
document.writeln("<div class=\'bizhong123-page\'>");
document.writeln("    <span class=\'bizhong123-btn bizhong123-pre\' onclick=\'xyqzmw();\'>下一期</span> ");
document.writeln("    <span class=\'bizhong123-btn bizhong123-next\' onclick=\'syqzmw();\'>上一期</span>");
document.writeln("</div>");
document.writeln("<script>");
document.writeln("    var leifeng=new Array(");

document.writeln("\'https://tk2.zaojiao365.net:4949/col/120/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/119/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/118/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/117/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/116/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/115/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/114/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/113/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/112/amsbx.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/111/amsbx.jpg\',");




document.writeln("\'https://tk2.zaojiao365.net:4949/col/110/amsbx.jpg\'");

document.writeln(");");
document.writeln("    var indexx=0;");
document.writeln("    function syqzmw(){");
document.writeln("        indexx++;");
document.writeln("        if(indexx==leifeng.length){");
document.writeln("            indexx=0;");
document.writeln("        }");
document.writeln("        document.getElementById(\'lfktzm\').src=leifeng[indexx];");
document.writeln("    }");
document.writeln("    function xyqzmw(){");
document.writeln("        indexx--;");
document.writeln("        if(indexx<0){");
document.writeln("            indexx=leifeng.length-1;");
document.writeln("        }");
document.writeln("        document.getElementById(\'lfktzm\').src=leifeng[indexx];");
document.writeln("    }");
document.writeln("</script>");
document.writeln("");
document.writeln("");
document.writeln("");
document.writeln("");