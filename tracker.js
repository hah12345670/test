(function() {
  // 1. Google Analytics (不需要 DOM 节点，可直接挂载 Head)
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-17W024N6QS';
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-17W024N6QS');

  // 2. Microsoft Clarity (不需要 DOM 节点，可直接挂载 Head)
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "koo4icwpvz");

  // 3. 不算子（Busuanzi）：必须在 DOM 准备就绪后再挂载
  function loadBusuanzi() {
    // 3.1 优先创建并插入 DOM 节点
    const busuanziDiv = document.createElement('div');
    busuanziDiv.style.fontWeight = 'bolder';
    busuanziDiv.style.fontSize = '0px';
    busuanziDiv.innerHTML = `
      <span id="busuanzi_container_site_uv"><span id="busuanzi_value_site_uv"></span></span>, 
      <span id="busuanzi_container_site_pv"><span id="busuanzi_value_site_pv"></span></span>, 
      <span id="busuanzi_container_page_pv"><span id="busuanzi_value_page_pv"></span></span>
    `;
    document.body.appendChild(busuanziDiv);

    // 3.2 节点创建成功后，再动态引入 JS 文件
    const busuanziScript = document.createElement('script');
    busuanziScript.async = true;
    busuanziScript.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    document.head.appendChild(busuanziScript);
  }

  // 安全检查：确保 document.body 存在后再执行 DOM 操作
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBusuanzi);
  } else {
    loadBusuanzi();
  }
})();