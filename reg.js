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
		// 如果不匹配，立即隐藏整个网页元素
		document.documentElement.style.display = 'none';
		
		alert('鉴权失败，无权访问该页面！');
		
		// 强制重定向回登录页
		window.location.href = 'reg.html'; 
	}
})();