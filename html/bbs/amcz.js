document.writeln("<meta charset=\'utf-8\'>");
document.writeln("");
document.writeln("<style>");
document.writeln(".bizhong123 { width:100%; margin:0 auto;}");
document.writeln(".bizhong123-box{ float: left; width: 100%; display:none;}");
document.writeln(".action-bz{display:block;}");
document.writeln(".bizhong123-page { height: 40px; padding-top: 5px;}");
document.writeln(".bizhong123-btn { float: left; width: calc( 50% - 10px); height: 38px;  line-height:38px; margin-right: 10px; text-align: center; display: inline-block; background: #aaa; border: solid 1px #ccc; border-radius: 5px; background-image: linear-gradient(to top, #ddd, #fff); cursor:pointer;}");
document.writeln(".bizhong123-btn:hover { background-image: linear-gradient(to bottom, #ddd,#fff);}");
document.writeln(".bizhong123-btn.bizhong123-pre {}");
document.writeln(".bizhong123-btn.bizhong123-next { margin-right: 0;}");
document.writeln("");
document.writeln(".bizhong123 img {width:100%; border-collapse: collapse; font-weight: bold;}");
document.writeln("</style>");
document.writeln("<div class=\'bizhong123 clearfix\'>");
document.writeln("    <div class=\'bizhong123-box action-bz\'>");
document.writeln("<img src=\'https://tk2.zaojiao365.net:4949/col/77/ammh.jpg\' id=\'sbxpicx\'>");
document.writeln("    </div>");
document.writeln("    ");
document.writeln("</div>");
document.writeln("    ");
document.writeln("<div class=\'bizhong123-page\'>");
document.writeln("<span class=\'bizhong123-btn bizhong123-pre\' onclick=\'presbx();\'>下一期</span> ");
document.writeln(" <span class=\'bizhong123-btn bizhong123-next\' onclick=\'nextsbx();\'>上一期</span>");
document.writeln("</div>");
document.writeln("<script>");
document.writeln("    var picArrsbx=new Array(");

document.writeln("\'https://tk2.zaojiao365.net:4949/col/77/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/76/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/75/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/74/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/73/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/72/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/71/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/70/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/69/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/68/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/67/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/66/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/65/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/64/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/63/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/62/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/61/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/60/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/59/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/58/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/57/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/56/ammh.jpg\',");





document.writeln("\'https://tk2.zaojiao365.net:4949/col/55/ammh.jpg\'");

document.writeln(");");
document.writeln("    var indexsbx=0;");
document.writeln("    function nextsbx(){");
document.writeln("        indexsbx++;");
document.writeln("        if(indexsbx==picArrsbx.length){");
document.writeln("            indexsbx=0;");
document.writeln("        }");
document.writeln("        document.getElementById(\'sbxpicx\').src=picArrsbx[indexsbx];");
document.writeln("    }");
document.writeln("    function presbx(){");
document.writeln("        indexsbx--;");
document.writeln("        if(indexsbx<0){");
document.writeln("            indexsbx=picArrsbx.length-1;");
document.writeln("        }");
document.writeln("        document.getElementById(\'sbxpicx\').src=picArrsbx[indexsbx];");
document.writeln("    }");
document.writeln("</script>");
document.writeln("");
document.writeln("");