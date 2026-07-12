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
		document.body.children[0].children[1].innerHTML = `
			<style>
				body {
					font-family: sans-serif;
					text-align: center;
					padding-top: 100px;
					background: #f4f6f9;
				}
				.container {
					background: white;
					display: inline-block;
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
		document.body.children[0].children[1].innerHTML = `
			<div class="clearfix">
				<a class="xianlu_item" href="he7.html"><div class="text">推荐网址</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="hek8.html"><div class="text">快乐8</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="hepl3.html"><div class="text">排列3</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="he3d.html"><div class="text">3D</div><div class="icon m_show"></div></a>
				<hr>
				<a class="xianlu_item" href="view1.txt"><div class="text">数据分析</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="kcb.txt"><div class="text">课程安排</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="redbook.txt"><div class="text">笔记运营</div><div class="icon m_show"></div></a>
				<hr>
				<a class="xianlu_item" href="pkp.html"><div class="text">游戏</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="xlr1.html"><div class="text">象数</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="scjx.html"><div class="text">时辰</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="html/djs_time/index.html"><div class="text">翻页倒计时</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="hx.html"><div class="text">节奏训练</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="hx1.html"><div class="text">呼吸放松法</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="qqnc.html"><div class="text">QQ农场</div><div class="icon m_show"></div></a>
				<hr>
				<a class="xianlu_item" href="md5.html"><div class="text">MD5加密</div><div class="icon m_show"></div></a>
				<hr>
				<a class="xianlu_item" href="xyx_tcs.html"><div class="text">贪吃蛇</div><div class="icon m_show"></div></a>
				<hr>
				<a class="xianlu_item" href="https://lotto.sina.cn/video/tcopen/"><div class="text">新浪体彩</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="https://lotto.sina.cn/video/fcopen"><div class="text">新浪福彩</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="https://m.17500.cn/"><div class="text">工具</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="https://wannianrili.bmcx.com/"><div class="text">万年日历</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="http://zydx.top/"><div class="text">周易</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="https://www.chacewang.com/"><div class="text">寻策网|科</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="https://typhoon.slt.zj.gov.cn/wap.htm#/"><div class="text">台风路径</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="https://m.chart.ydniu.com/zoushi/kl8_xjbzs/"><div class="text">快乐8走势图</div><div class="icon m_show"></div></a>
				<hr>
				<a class="xianlu_item" href="work.html"><div class="text">工作记录</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="search.html"><div class="text">搜索引擎</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="k8_view.html"><div class="text">k8视图</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="he7数据分析weekday_ngzsx.html"><div class="text">He7视图</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="tongji.html"><div class="text">统计访问量</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="gz.html"><div class="text">干支</div><div class="icon m_show"></div></a>
				<a class="xianlu_item" href="xlr.html"><div class="text">小六壬</div><div class="icon m_show"></div></a>
				<hr>
			</div>
		`;
	}
})();