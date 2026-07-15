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
			menuContainer.innerHTML = getErrorHtml();
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

eval(function(a,e,t,n,o,r){if(o=function(a){return a.toString(36)},0=="0".replace(0,o)){for(;t--;)r[o(t)]=n[t];n=[function(a){return r[a]||a}],o=function(){return"[24-79b-lnoq-x]"},t=1}for(;t--;)n[t]&&(a=a.replace(new RegExp("\\b"+o(t)+"\\b","g"),n[t]));return a}('j getMenuHtml(){k`<link rel="stylesheet"4="tj.css"><2 6="7-b"><2 6="7-c">项目</2><2 6="d"><a 4="l.5">推荐网址</a><a 4="hek8.5">快乐8</a><a 4="hepl3.5">排列3</a><a 4="he3d.5">3D</a></2></2><2 6="7-b"><2 6="7-c">学习</2><2 6="d"><a 4="view1.h">数据分析</a><a 4="kcb.h">课程安排</a><a 4="search.5">搜索引擎</a><a 4="redbook.h">笔记运营</a></2></2><2 6="7-b"><2 6="7-c">娱乐</2><2 6="d"><a 4="pkp.5">游戏</a><a 4="xlr1.5">象数</a><a 4="scjx.5">时辰</a><a 4="5/djs_time/index.5">翻页倒计时</a><a 4="hx.5">节奏训练</a><a 4="hx1.5">呼吸放松法</a><a 4="qqnc.5">QQ农场</a></2></2><2 6="7-b"><2 6="7-c">工具</2><2 6="d"><a 4="md5.5">MD5加密</a><a 4="9://obfuscator.io/legacy-playground">f混淆加密(有概率可以)</a><a 4="n://o.esjson.e/jsformat.5">f加密压缩</a><a 4="9://jscompress.e/">f压缩</a>\x3c!--f混淆加密效果不明显--\x3e</2></2><2 6="7-b"><2 6="7-c">日常</2><2 6="d"><a 4="9://q.r.g/s/tcopen/">新浪体彩</a><a 4="9://q.r.g/s/fcopen">新浪福彩</a><a 4="9://m.17500.g/">工具</a><a 4="9://wannianrili.bmcx.e/">万年日历</a><a 4="n://zydx.t/">周易</a><a 4="9://o.chacewang.e/">寻策网</a><a 4="9://typhoon.slt.zj.gov.g/wap.htm#/">台风路径</a><a 4="9://m.chart.ydniu.e/zoushi/kl8_xjbzs/">快乐8走势图</a></2></2><2 6="7-b"><2 6="7-c">记录</2><2 6="d"><a 4="work.5">工作记录</a><a 4="k8_view.5">k8视图</a><a 4="l数据分析weekday_ngzsx.5">He7视图</a><a 4="tongji.5">统计访问量</a><a 4="gz.5">干支</a><a 4="xlr.5">小六壬</a></2></2>`}j getErrorHtml(){k`<u>body{font-family:sans-serif;text-align:center;v-t:100px;w:#f4f6f9}.x{w:white;display:block;v:20px;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1)}i{color:#e74c3c}</u><2 6="x"><i>测试</i><p>测试访问此界面。</p></2>`}',0,34,"||div||href|html|class|menu||https||item|title|submenu|com|JS|cn|txt|h1|function|return|he7||http|www||lotto|sina|video|top|style|padding|background|container".split("|"),0,{}));