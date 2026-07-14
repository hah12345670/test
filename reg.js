/* 1. <script src="https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script> */

// 2. 在 head 中立即执行拦截逻辑，防止内容闪现
(function() {
	// 获取 URL 中的明文参数
	const urlParams = new URLSearchParams(window.location.search);
	const userParam = urlParams.get('user') || ''; // 防止为 null
	const pwdParam = urlParams.get('pwd') || '';

	// 3. 在本地将获取到的明文参数进行 MD5 加密
	const encryptedUser = md5(userParam.trim());
	const encryptedPwd = md5(pwdParam.trim());

	// 4. 正确的 MD5 目标值
	const targetUserMd5 = '21232f297a57a5a743894a0e4a801fc3'; // admin 的 md5
	const targetPwdMd5  = '03ae6740bdf5aaa9074475fcd9462e82'; // 123 的 md5

	// 5. 比对加密后的结果
	if (encryptedUser !== targetUserMd5 || encryptedPwd !== targetPwdMd5) {
		/* // 如果不匹配，立即隐藏整个网页元素
		document.documentElement.style.display = 'none';
		
		alert('鉴权失败，无权访问该页面！');
		
		// 强制重定向回登录页
		window.location.href = 'reg.html'; */
		document.body.children[1].innerHTML = `
			<style>
				body {
					font-family: sans-serif;
					text-align: center;
					padding-top: 100px;
					background: #f4f6f9;
				}
				.container {
					background: white;
					display: block;
					padding: 20px;
					border-radius: 8px;
					box-shadow: 0 4px 6px rgba(0,0,0,0.1);
				}
				h1 {
					color: #e74c3c;
				}
			</style>
			<div class="container">
				<h1>测试</h1>
				<p>测试访问此界面。</p>
			</div>
		`;
	} else {
		document.body.children[1].innerHTML = getMenuHtml();
	}
})();
function _0x28b3(_0x260f96,_0x357f19){_0x260f96=_0x260f96-0x130;var _0x5bcc54=_0x5bcc();var _0x28b345=_0x5bcc54[_0x260f96];return _0x28b345}(function(_0x56736e,_0x33b018){var _0x22cbc7=_0x28b3,_0x1068f0=_0x56736e();while(!![]){try{var _0x2b3376=parseInt(_0x22cbc7(0x131))/0x1+parseInt(_0x22cbc7(0x132))/0x2+-parseInt(_0x22cbc7(0x135))/0x3*(-parseInt(_0x22cbc7(0x137))/0x4)+-parseInt(_0x22cbc7(0x138))/0x5+parseInt(_0x22cbc7(0x133))/0x6*(-parseInt(_0x22cbc7(0x134))/0x7)+-parseInt(_0x22cbc7(0x130))/0x8+-parseInt(_0x22cbc7(0x136))/0x9;if(_0x2b3376===_0x33b018)break;else _0x1068f0['push'](_0x1068f0['shift']())}catch(_0x229802){_0x1068f0['push'](_0x1068f0['shift']())}}}(_0x5bcc,0x84370));function _0x5bcc(){var _0xb0e0f8=['399PiWjXS','5406516WgZyUi','21388jItgiK','736055ZhJNqi','4045056DguDzJ','953084fjwKrs','686780YWmOLa','1806uqeYsK','4942uQCfyV'];_0x5bcc=function(){return _0xb0e0f8};return _0x5bcc()}function getMenuHtml(){return'\x0a\x09\x09<link\x20rel=\x22stylesheet\x22\x20href=\x22tj.css\x22>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>项目</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22he7.html\x22>推荐网址</a>\x0a\x09\x09\x09\x09<a\x20href=\x22hek8.html\x22>快乐8</a>\x0a\x09\x09\x09\x09<a\x20href=\x22hepl3.html\x22>排列3</a>\x0a\x09\x09\x09\x09<a\x20href=\x22he3d.html\x22>3D</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>学习</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22view1.txt\x22>数据分析</a>\x0a\x09\x09\x09\x09<a\x20href=\x22kcb.txt\x22>课程安排</a>\x0a\x09\x09\x09\x09<a\x20href=\x22search.html\x22>搜索引擎</a>\x0a\x09\x09\x09\x09<a\x20href=\x22redbook.txt\x22>笔记运营</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>娱乐</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22pkp.html\x22>游戏</a>\x0a\x09\x09\x09\x09<a\x20href=\x22xlr1.html\x22>象数</a>\x0a\x09\x09\x09\x09<a\x20href=\x22scjx.html\x22>时辰</a>\x0a\x09\x09\x09\x09<a\x20href=\x22html/djs_time/index.html\x22>翻页倒计时</a>\x0a\x09\x09\x09\x09<a\x20href=\x22hx.html\x22>节奏训练</a>\x0a\x09\x09\x09\x09<a\x20href=\x22hx1.html\x22>呼吸放松法</a>\x0a\x09\x09\x09\x09<a\x20href=\x22qqnc.html\x22>QQ农场</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>工具</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22md5.html\x22>MD5加密</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://obfuscator.io/legacy-playground\x22>JS混淆加密(有概率可以)</a>\x0a\x09\x09\x09\x09<a\x20href=\x22http://www.esjson.com/jsformat.html\x22>JS普通压缩</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>日常</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22https://lotto.sina.cn/video/tcopen/\x22>新浪体彩</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://lotto.sina.cn/video/fcopen\x22>新浪福彩</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://m.17500.cn/\x22>工具</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://wannianrili.bmcx.com/\x22>万年日历</a>\x0a\x09\x09\x09\x09<a\x20href=\x22http://zydx.top/\x22>周易</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://www.chacewang.com/\x22>寻策网</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://typhoon.slt.zj.gov.cn/wap.htm#/\x22>台风路径</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://m.chart.ydniu.com/zoushi/kl8_xjbzs/\x22>快乐8走势图</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>记录</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22work.html\x22>工作记录</a>\x0a\x09\x09\x09\x09<a\x20href=\x22k8_view.html\x22>k8视图</a>\x0a\x09\x09\x09\x09<a\x20href=\x22he7数据分析weekday_ngzsx.html\x22>He7视图</a>\x0a\x09\x09\x09\x09<a\x20href=\x22tongji.html\x22>统计访问量</a>\x0a\x09\x09\x09\x09<a\x20href=\x22gz.html\x22>干支</a>\x0a\x09\x09\x09\x09<a\x20href=\x22xlr.html\x22>小六壬</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09'}