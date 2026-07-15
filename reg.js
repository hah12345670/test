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
eval(function(a,e,t,n,c,o){if(c=function(a){return a.toString(36)},0=="0".replace(0,c)){for(;t--;)o[c(t)]=n[t];n=[function(a){return o[a]||a}],c=function(){return"[0-24-79b-l]"},t=1}for(;t--;)n[t]&&(a=a.replace(new RegExp("\\b"+c(t)+"\\b","g"),n[t]));return a}('function getMenuHtml(){return`<link rel="stylesheet"1="tj.css"><0 4="5-7"><0 4="5-9">项目</0><0 4="b"><a 1="g.2">推荐网址</a><a 1="hek8.2">快乐8</a><a 1="hepl3.2">排列3</a><a 1="he3d.2">3D</a></0></0><0 4="5-7"><0 4="5-9">学习</0><0 4="b"><a 1="view1.f">数据分析</a><a 1="kcb.f">课程安排</a><a 1="search.2">搜索引擎</a><a 1="redbook.f">笔记运营</a></0></0><0 4="5-7"><0 4="5-9">娱乐</0><0 4="b"><a 1="pkp.2">游戏</a><a 1="xlr1.2">象数</a><a 1="scjx.2">时辰</a><a 1="2/djs_time/index.2">翻页倒计时</a><a 1="hx.2">节奏训练</a><a 1="hx1.2">呼吸放松法</a><a 1="qqnc.2">QQ农场</a></0></0><0 4="5-7"><0 4="5-9">工具</0><0 4="b"><a 1="md5.2">MD5加密</a><a 1="6://obfuscator.io/legacy-playground">d混淆加密(有概率可以)</a><a 1="h://i.esjson.c/jsformat.2">d加密压缩</a><a 1="6://jscompress.c/">d压缩</a>\x3c!--d混淆加密效果不明显--\x3e</0></0><0 4="5-7"><0 4="5-9">日常</0><0 4="b"><a 1="6://j.k.e/l/tcopen/">新浪体彩</a><a 1="6://j.k.e/l/fcopen">新浪福彩</a><a 1="6://m.17500.e/">工具</a><a 1="6://wannianrili.bmcx.c/">万年日历</a><a 1="h://zydx.top/">周易</a><a 1="6://i.chacewang.c/">寻策网</a><a 1="6://typhoon.slt.zj.gov.e/wap.htm#/">台风路径</a><a 1="6://m.chart.ydniu.c/zoushi/kl8_xjbzs/">快乐8走势图</a></0></0><0 4="5-7"><0 4="5-9">记录</0><0 4="b"><a 1="work.2">工作记录</a><a 1="k8_view.2">k8视图</a><a 1="g数据分析weekday_ngzsx.2">He7视图</a><a 1="tongji.2">统计访问量</a><a 1="gz.2">干支</a><a 1="xlr.2">小六壬</a></0></0>`}',0,22,"div|href|html||class|menu|https|item||title||submenu|com|JS|cn|txt|he7|http|www|lotto|sina|video".split("|"),0,{}));