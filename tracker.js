(function() {
  // 防重复加载：如果已经执行过，直接退出，绝不重复发送数据
  if (window.__TRACKER_LOADED__) return;
  window.__TRACKER_LOADED__ = true;

  function initTracker() {
    var head = document.head || document.getElementsByTagName('head')[0];
    var body = document.body || document.getElementsByTagName('body')[0];

    // 1. 不算子节点
    var busuanziDiv = document.createElement('div');
    busuanziDiv.style.fontWeight = 'bolder';
    busuanziDiv.style.fontSize = '0px';
    busuanziDiv.innerHTML = 
      '<span id="busuanzi_container_site_uv"><span id="busuanzi_value_site_uv"></span></span>, ' +
      '<span id="busuanzi_container_site_pv"><span id="busuanzi_value_site_pv"></span></span>, ' +
      '<span id="busuanzi_container_page_pv"><span id="busuanzi_value_page_pv"></span></span>';
    if (body) body.appendChild(busuanziDiv);

    // 2. 不算子 JS
    var busuanziScript = document.createElement('script');
    busuanziScript.async = true;
    busuanziScript.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    if (head) head.appendChild(busuanziScript);

    // 3. Google Analytics
    var gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-17W024N6QS';
    if (head) head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-17W024N6QS');

    // 4. Microsoft Clarity
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "koo4icwpvz");
  }

  if (document.body) {
    initTracker();
  } else {
    document.addEventListener('DOMContentLoaded', initTracker);
  }
})();