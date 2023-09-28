document.writeln("<meta charset=\'utf-8\'>");
document.writeln("");
document.writeln("<style>");
document.writeln(".bizhong1234 { width:100%; margin:0 auto;}");
document.writeln(".bizhong1234-box{ float: left; width: 100%; display:none;}");
document.writeln(".action-bz{display:block;}");
document.writeln(".bizhong1234-page { height: 40px; padding-top: 5px;}");
document.writeln(".bizhong1234-btn { float: left; width: calc( 50% - 10px); height: 38px; line-height:38px; margin-right: 10px; text-align: center; display: inline-block; background: #aaa; border: solid 1px #ccc; border-radius: 5px; background-image: linear-gradient(to top, #ddd, #fff); cursor:pointer;}");
document.writeln(".bizhong1234-btn:hover { background-image: linear-gradient(to bottom, #ddd,#fff);}");
document.writeln(".bizhong1234-btn.bizhong1234-pre {}");
document.writeln(".bizhong1234-btn.bizhong1234-next { margin-right: 0;}");
document.writeln("");
document.writeln(".bizhong1234 img {width:100%; border-collapse: collapse; font-weight: bold;}");
document.writeln("</style>");
document.writeln("<div class=\'bizhong1234 clearfix\'>");
document.writeln("    <div class=\'bizhong1234-box action-bz\'>");
document.writeln("<img src=\'/img/jrqy271.jpg\' id=\'jrqypicx\'>");
document.writeln("    </div>");
document.writeln("    ");
document.writeln("</div>");
document.writeln("    ");
document.writeln("<div class=\'bizhong1234-page\'>");
document.writeln("<span class=\'bizhong1234-btn bizhong1234-pre\' onclick=\'presbx();\'>上一期</span> ");
document.writeln(" <span class=\'bizhong1234-btn bizhong1234-next\' onclick=\'nextsbx();\'>下一期</span>");
document.writeln("</div>");
document.writeln("<script>");
document.writeln("    var picArrsbx=new Array(");

document.writeln("\'/img/jrqy271.jpg\',");
document.writeln("\'/img/jrqy270.jpg\',");
document.writeln("\'/img/jrqy269.jpg\',");
document.writeln("\'/img/jrqy268.jpg\',");
document.writeln("\'/img/jrqy267.jpg\',");
document.writeln("\'/img/jrqy266.jpg\',");
document.writeln("\'/img/jrqy265.jpg\',");
document.writeln("\'/img/jrqy264.jpg\',");
document.writeln("\'/img/jrqy263.jpg\',");
document.writeln("\'/img/jrqy262.jpg\',");

document.writeln("\'/img/jrqy261.jpg\',");

document.writeln("\'/img/jrqy260.jpg\',");

document.writeln("\'/img/jrqy259.jpg\',");
document.writeln("\'/img/jrqy258.jpg\',");
document.writeln("\'/img/jrqy257.jpg\',");
document.writeln("\'/img/jrqy256.jpg\',");
document.writeln("\'/img/jrqy255.jpg\',");
document.writeln("\'/img/jrqy254.jpg\',");
document.writeln("\'/img/jrqy253.jpg\',");




document.writeln("\'/img/jrqy252.jpg\'");
document.writeln(");");
document.writeln("    var indexjrqy=0;");
document.writeln("    function nextsbx(){");
document.writeln("        indexjrqy++;");
document.writeln("        if(indexjrqy==picArrsbx.length){");
document.writeln("            indexjrqy=0;");
document.writeln("        }");
document.writeln("        document.getElementById(\'jrqypicx\').src=picArrsbx[indexjrqy];");
document.writeln("    }");
document.writeln("    function presbx(){");
document.writeln("        indexjrqy--;");
document.writeln("        if(indexjrqy<0){");
document.writeln("            indexjrqy=picArrsbx.length-1;");
document.writeln("        }");
document.writeln("        document.getElementById(\'jrqypicx\').src=picArrsbx[indexjrqy];");
document.writeln("    }");
document.writeln("</script>");
document.writeln("");
document.writeln("");