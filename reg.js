// 在 head 中立即执行拦截逻辑，防止内容闪现
(function() {
	// 1. 动态引入 MD5 依赖（确保该 JS 独立运行，不依赖页面手动写 <script>）
	if (typeof md5 === 'undefined') {
		const script = document.createElement('script');
		script.src = "https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js";
		script.async = false; // 同步加载，确保后续加密逻辑能用
		document.head.appendChild(script);
		
		// 等待 MD5 库加载完成后再执行初始化
		script.onload = init;
	} else {
		init();
	}
	
	function init() {
		// 2. 获取 URL 中的明文参数
		const urlParams = new URLSearchParams(window.location.search);
		const userParam = urlParams.get('user') || ''; // 防止为 null
		const pwdParam = urlParams.get('pwd') || '';

		// 3. 在本地将获取到的明文参数进行 MD5 加密
		const encryptedUser = md5(userParam.trim());
		const encryptedPwd = md5(pwdParam.trim());

		// 4. 正确的 MD5 目标值
		const targetUserMd5 = '21232f297a57a5a743894a0e4a801fc3'; // admin 的 md5
		const targetPwdMd5  = '03ae6740bdf5aaa9074475fcd9462e82'; // 123 的 md5

		// 5. 创建一个安全的菜单挂载容器（避免依赖特定的 body.children）
		let menuContainer = document.getElementById('global-menu-container');
		if (!menuContainer) {
			menuContainer = document.createElement('div');
			menuContainer.id = 'global-menu-container';
			menuContainer.className = 'menu-container';
			// 将菜单容器插入到 body 的最顶部
			document.body.insertBefore(menuContainer, document.body.firstChild);
		}

		// 6. 比对加密后的结果
		if (encryptedUser !== targetUserMd5 || encryptedPwd !== targetPwdMd5) {
			// 强制重定向回登录页
			// window.location.href = 'reg.html';
			menuContainer.innerHTML = `
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
			menuContainer.innerHTML = getMenuHtml();
			bindMenuEvents(menuContainer);
		}
	}
})();

// 绑定折叠逻辑的函数
function bindMenuEvents(container) {
	const menuItems = document.querySelectorAll('.menu-item');

	menuItems.forEach(item => {
			const title = item.querySelector('.menu-title');
			const submenu = item.querySelector('.submenu');
			if (!title || !submenu) return; // 安全防空
			
			title.addEventListener('click', (e) => {
					e.preventDefault();
					const isActive = item.classList.contains('active');

					// 排他：关闭其他所有菜单，并把它们的高度归零
					menuItems.forEach(i => {
							if (i !== item) {
									i.classList.remove('active');
									const sub = i.querySelector('.submenu');
									if (sub) sub.style.maxHeight = '0px';
							}
					});

					// 切换当前菜单
					if (!isActive) {
							item.classList.add('active');
							// 动态设置为其实际撑开的高度
							submenu.style.maxHeight = submenu.scrollHeight + 'px';
					} else {
							item.classList.remove('active');
							submenu.style.maxHeight = '0px';
					}
			});
	});
}
function _0x2d6f(){var _0x4bfce7=['5628HaqTUf','\x0a\x09\x09<link\x20rel=\x22stylesheet\x22\x20href=\x22tj.css\x22>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>项目</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22he7.html\x22>推荐网址</a>\x0a\x09\x09\x09\x09<a\x20href=\x22hek8.html\x22>快乐8</a>\x0a\x09\x09\x09\x09<a\x20href=\x22hepl3.html\x22>排列3</a>\x0a\x09\x09\x09\x09<a\x20href=\x22he3d.html\x22>3D</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>学习</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22view1.txt\x22>数据分析</a>\x0a\x09\x09\x09\x09<a\x20href=\x22kcb.txt\x22>课程安排</a>\x0a\x09\x09\x09\x09<a\x20href=\x22search.html\x22>搜索引擎</a>\x0a\x09\x09\x09\x09<a\x20href=\x22redbook.txt\x22>笔记运营</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>娱乐</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22pkp.html\x22>游戏</a>\x0a\x09\x09\x09\x09<a\x20href=\x22xlr1.html\x22>象数</a>\x0a\x09\x09\x09\x09<a\x20href=\x22scjx.html\x22>时辰</a>\x0a\x09\x09\x09\x09<a\x20href=\x22html/djs_time/index.html\x22>翻页倒计时</a>\x0a\x09\x09\x09\x09<a\x20href=\x22hx.html\x22>节奏训练</a>\x0a\x09\x09\x09\x09<a\x20href=\x22hx1.html\x22>呼吸放松法</a>\x0a\x09\x09\x09\x09<a\x20href=\x22qqnc.html\x22>QQ农场</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>工具</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22md5.html\x22>MD5加密</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://obfuscator.io/legacy-playground\x22>JS混淆加密(有概率可以)</a>\x0a\x09\x09\x09\x09<a\x20href=\x22http://www.esjson.com/jsformat.html\x22>JS普通压缩</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://jscompress.com/\x22>JS普通压缩(效果明显)</a>\x0a\x09\x09\x09\x09<!--\x20JS混淆加密效果不明显，普通压缩也会出现明文\x20-->\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>日常</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22https://lotto.sina.cn/video/tcopen/\x22>新浪体彩</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://lotto.sina.cn/video/fcopen\x22>新浪福彩</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://m.17500.cn/\x22>工具</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://wannianrili.bmcx.com/\x22>万年日历</a>\x0a\x09\x09\x09\x09<a\x20href=\x22http://zydx.top/\x22>周易</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://www.chacewang.com/\x22>寻策网</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://typhoon.slt.zj.gov.cn/wap.htm#/\x22>台风路径</a>\x0a\x09\x09\x09\x09<a\x20href=\x22https://m.chart.ydniu.com/zoushi/kl8_xjbzs/\x22>快乐8走势图</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09\x09<div\x20class=\x22menu-item\x22>\x0a\x09\x09\x09<div\x20class=\x22menu-title\x22>记录</div>\x0a\x09\x09\x09<div\x20class=\x22submenu\x22>\x0a\x09\x09\x09\x09<a\x20href=\x22work.html\x22>工作记录</a>\x0a\x09\x09\x09\x09<a\x20href=\x22k8_view.html\x22>k8视图</a>\x0a\x09\x09\x09\x09<a\x20href=\x22he7数据分析weekday_ngzsx.html\x22>He7视图</a>\x0a\x09\x09\x09\x09<a\x20href=\x22tongji.html\x22>统计访问量</a>\x0a\x09\x09\x09\x09<a\x20href=\x22gz.html\x22>干支</a>\x0a\x09\x09\x09\x09<a\x20href=\x22xlr.html\x22>小六壬</a>\x0a\x09\x09\x09</div>\x0a\x09\x09</div>\x0a\x09','7hnfwgd','2261005ciHEAg','171lsMqva','450069YQlSiH','455796xpcgQC','38258tzssbj','6KWVGdN','86784KQjuKD','6oWgZHk','820LVrtls','4777464YDRzUs'];_0x2d6f=function(){return _0x4bfce7;};return _0x2d6f();}function _0x3315(_0x4ca703,_0x4b9ec1){_0x4ca703=_0x4ca703-0x1cf;var _0x2d6f4d=_0x2d6f();var _0x331568=_0x2d6f4d[_0x4ca703];return _0x331568;}(function(_0x46d13f,_0x1fa388){var _0x258c54=_0x3315;var _0x5613db=_0x46d13f();while(!![]){try{var _0x4e55e0=parseInt(_0x258c54(0x1d7))/0x1+parseInt(_0x258c54(0x1db))/0x2*(parseInt(_0x258c54(0x1d6))/0x3)+-parseInt(_0x258c54(0x1da))/0x4+parseInt(_0x258c54(0x1d4))/0x5*(parseInt(_0x258c54(0x1d9))/0x6)+-parseInt(_0x258c54(0x1d3))/0x7*(-parseInt(_0x258c54(0x1d0))/0x8)+parseInt(_0x258c54(0x1d5))/0x9*(-parseInt(_0x258c54(0x1cf))/0xa)+parseInt(_0x258c54(0x1d8))/0xb*(-parseInt(_0x258c54(0x1d1))/0xc);if(_0x4e55e0===_0x1fa388){break;}else{_0x5613db['push'](_0x5613db['shift']());}}catch(_0x36a52e){_0x5613db['push'](_0x5613db['shift']());}}}(_0x2d6f,0x4970d));function getMenuHtml(){var _0x4338be=_0x3315;return _0x4338be(0x1d2);}