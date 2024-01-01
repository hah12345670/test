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
document.writeln("<img src=\'https://tk2.zaojiao365.net:4949/col/1/ammh.jpg\' id=\'sbxpicx\'>");
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



document.writeln("\'https://tk2.zaojiao365.net:4949/col/1/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/365/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/364/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/363/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/362/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/361/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/360/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/359/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/358/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/357/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/356/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/355/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/354/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/353/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/352/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/351/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/350/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/349/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/348/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/347/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/346/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/345/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/344/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/343/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/342/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/341/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/340/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/339/ammh.jpg\',");
document.writeln("\'https://tk2.zaojiao365.net:4949/col/338/ammh.jpg\',");





document.writeln("\'https://tk2.zaojiao365.net:4949/col/337/ammh.jpg\'");

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