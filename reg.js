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

function getMenuHtml() {
	return `
		<link rel="stylesheet" href="tj.css">
		<div class="menu-item">
			<div class="menu-title">项目</div>
			<div class="submenu">
				<a href="he7.html">推荐网址</a>
				<a href="hek8.html">快乐8</a>
				<a href="hepl3.html">排列3</a>
				<a href="he3d.html">3D</a>
			</div>
		</div>
		<div class="menu-item">
			<div class="menu-title">学习</div>
			<div class="submenu">
				<a href="view1.txt">数据分析</a>
				<a href="kcb.txt">课程安排</a>
				<a href="redbook.txt">笔记运营</a>
			</div>
		</div>
		<div class="menu-item">
			<div class="menu-title">娱乐</div>
			<div class="submenu">
				<a href="pkp.html">游戏</a>
				<a href="xlr1.html">象数</a>
				<a href="scjx.html">时辰</a>
				<a href="html/djs_time/index.html">翻页倒计时</a>
				<a href="hx.html">节奏训练</a>
				<a href="hx1.html">呼吸放松法</a>
				<a href="qqnc.html">QQ农场</a>
			</div>
		</div>
		<div class="menu-item">
			<div class="menu-title">工具</div>
			<div class="submenu">
				<a href="md5.html">MD5加密</a>
				<a href="https://tool.chinaz.com/js.aspx">JS混淆(加密压缩)</a>
				<a href="https://www.lzltool.cn/js">JS混淆加密</a>
			</div>
		</div>
		<div class="menu-item">
			<div class="menu-title">日常</div>
			<div class="submenu">
				<a href="https://lotto.sina.cn/video/tcopen/">新浪体彩</a>
				<a href="https://lotto.sina.cn/video/fcopen">新浪福彩</a>
				<a href="https://m.17500.cn/">工具</a>
				<a href="https://wannianrili.bmcx.com/">万年日历</a>
				<a href="http://zydx.top/">周易</a>
				<a href="https://www.chacewang.com/">寻策网</a>
				<a href="https://typhoon.slt.zj.gov.cn/wap.htm#/">台风路径</a>
				<a href="https://m.chart.ydniu.com/zoushi/kl8_xjbzs/">快乐8走势图</a>
			</div>
		</div>
		<div class="menu-item">
			<div class="menu-title">记录</div>
			<div class="submenu">
				<a href="work.html">工作记录</a>
				<a href="search.html">搜索引擎</a>
				<a href="k8_view.html">k8视图</a>
				<a href="he7数据分析weekday_ngzsx.html">He7视图</a>
				<a href="tongji.html">统计访问量</a>
				<a href="gz.html">干支</a>
				<a href="xlr.html">小六壬</a>
			</div>
		</div>
	`;
}