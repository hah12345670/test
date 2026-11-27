// 1. 渲染 快乐8 基础模型数据
function renderData(arr) {
    if (!Array.isArray(arr)) return;
    const container = document.getElementById("showdata");
    const fragment = document.createDocumentFragment();

    arr.forEach((line) => {
        const pre = document.createElement('pre');
        pre.className = 'data-card';
        pre.textContent = line || '';
        fragment.appendChild(pre);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
}

// 初始化数据加载
if (typeof arr_kl8 !== 'undefined') {
    renderData(arr_kl8);
} else {
    document.getElementById("showdata").innerHTML = '<div class="data-card">未检测到数据源 arr_kl8.js</div>';
}

// 屏幕常亮逻辑
let wakeLock = null;

async function toggleWakeLock() {
    const btn = document.getElementById("wakeLockBtn");
    if (wakeLock) {
        try { await wakeLock.release(); } finally { wakeLock = null; }
        return;
    }

    try {
        if (!('wakeLock' in navigator)) return alert("当前浏览器不支持屏幕常亮功能");
        wakeLock = await navigator.wakeLock.request('screen');
        btn.innerText = "屏幕常亮已生效 (点击关闭)";
        btn.classList.add("active");
        
        wakeLock.addEventListener('release', () => {
            wakeLock = null;
            btn.innerText = "开启屏幕常亮";
            btn.classList.remove("active");
        }, { once: true });
    } catch (err) {
        wakeLock = null;
        btn.innerText = "开启屏幕常亮";
        btn.classList.remove("active");
    }
}

document.addEventListener('visibilitychange', async () => {
    if (wakeLock && document.visibilityState === 'visible') {
        try { wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {}
    }
});