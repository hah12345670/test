(function() {
  // 1. 引入 Busuanzi 脚本
  const busuanziScript = document.createElement('script');
  busuanziScript.async = true;
  busuanziScript.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  document.head.appendChild(busuanziScript);

  // 2. 创建并插入隐藏的 Busuanzi 统计 <div>
  const busuanziDiv = document.createElement('div');
  busuanziDiv.style.fontWeight = 'bolder';
  busuanziDiv.style.fontSize = '0px';
  busuanziDiv.innerHTML = `
    <span id="busuanzi_container_site_uv"><span id="busuanzi_value_site_uv"></span></span>, 
    <span id="busuanzi_container_site_pv"><span id="busuanzi_value_site_pv"></span></span>, 
    <span id="busuanzi_container_page_pv"><span id="busuanzi_value_page_pv"></span></span>
  `;
  document.body.appendChild(busuanziDiv);

  // 3. 引入并配置 Google Analytics (gtag.js)
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-17W024N6QS';
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag; // 挂载到 window 方便其他地方调用
  gtag('js', new Date());
  gtag('config', 'G-17W024N6QS');

  // 4. 引入并配置 Microsoft Clarity
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "koo4icwpvz");
})();
