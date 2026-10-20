// ==========================================
// 配置参数
// ==========================================
const BASE_BET = 10; // 盈利计算基数（可在此处随时修改数值）

const escapeHTML = str => str.replace(/[&<>'"]/g, t => ({'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[t]));

// 局部高亮匹配的文字
function highlightMatch(text, keyword) {
    const safeText = escapeHTML(text);
    const safeKeyword = escapeHTML(keyword);
    const escapedKeyword = safeKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'g');
    return safeText.replace(regex, '<span class="rule-match">$1</span>');
}

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

// 2. 渲染 arr_he7 表格数据及合并后的正确率与盈利统计
function renderHe7(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return;
    
    document.getElementById("he7-section").style.display = "block";
    const tbody = document.getElementById("he7-body");
    const tfoot = document.getElementById("he7-foot");
    tbody.innerHTML = '';
    tfoot.innerHTML = '';

    const fragment = document.createDocumentFragment();
    
    const matchCounts = [0, 0, 0, 0, 0, 0, 0];
    const validTotals = [0, 0, 0, 0, 0, 0, 0];

    let combo32Hits = 0, combo32Valid = 0;
    let combo15Hits = 0, combo15Valid = 0;
    let combo55Hits = 0, combo55Valid = 0;

    // 盈利统计变量
    const profitCols = [0, 0, 0, 0, 0, 0, 0]; // 对应单列 1~6
    let profit32 = 0, profit15 = 0, profit55 = 0;

    const getRecommendCount = (colIndex, text) => {
        if (!text) return 0;
        return text.replace(/\s+/g, '').length || 0;
    };

    arr.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        const ruleText = row[7] || ''; 

        const isValidRule = ruleText !== '' && ruleText !== '-';
        const isMatch = (val) => val !== '' && isValidRule && val.includes(ruleText);

        const c1 = row[1] !== undefined ? String(row[1]) : '';
        const c2 = row[2] !== undefined ? String(row[2]) : '';
        if ((c1 !== '' || c2 !== '') && isValidRule) {
            combo32Valid++;
            if (isMatch(c1) || isMatch(c2)) combo32Hits++;
        }

        const c3 = row[3] !== undefined ? String(row[3]) : '';
        const c4 = row[4] !== undefined ? String(row[4]) : '';
        if ((c3 !== '' || c4 !== '') && isValidRule) {
            combo15Valid++;
            if (isMatch(c3) || isMatch(c4)) combo15Hits++;
        }

        const c5 = row[5] !== undefined ? String(row[5]) : '';
        const c6 = row[6] !== undefined ? String(row[6]) : '';
        if ((c5 !== '' || c6 !== '') && isValidRule) {
            combo55Valid++;
            if (isMatch(c5) || isMatch(c6)) combo55Hits++;
        }

        // 盈利计算（使用 BASE_BET 参数）
        let rowProfit32 = 0;
        let rowProfit15 = 0;
        let rowProfit55 = 0;

        for (let i = 1; i <= 6; i++) {
            const cellValue = row[i] !== undefined ? String(row[i]) : '';
            if (cellValue !== '' && isValidRule) {
                const count = getRecommendCount(i, cellValue);
                let p = 0;
                if (isMatch(cellValue)) {
                    p = BASE_BET * (11 - count);
                } else {
                    p = -BASE_BET * count;
                }
                profitCols[i] += p;

                if (i === 1 || i === 2) rowProfit32 += p;
                if (i === 3 || i === 4) rowProfit15 += p;
                if (i === 5 || i === 6) rowProfit55 += p;
            }
        }
        profit32 += rowProfit32;
        profit15 += rowProfit15;
        profit55 += rowProfit55;

        // 列 1: 序号
        const tdIndex = document.createElement('td');
        tdIndex.textContent = rowIndex + 1;
        tr.appendChild(tdIndex);

        for (let i = 0; i < 8; i++) {
            const td = document.createElement('td');
            const cellValue = row[i] !== undefined ? String(row[i]) : '';

            if (i >= 1 && i <= 6) {
                if (cellValue !== '' && isValidRule) {
                    validTotals[i]++;
                    if (isMatch(cellValue)) {
                        td.innerHTML = highlightMatch(cellValue, ruleText);
                        matchCounts[i]++;
                    } else {
                        td.textContent = cellValue;
                    }
                } else {
                    td.textContent = cellValue;
                }
            } else {
                td.textContent = cellValue;
            }
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);

    // 底部第一行：正确率
    const footTr1 = document.createElement('tr');
    
    const rate32 = combo32Valid > 0 ? ((combo32Hits / combo32Valid) * 100).toFixed(1) : '0.0';
    const rate15 = combo15Valid > 0 ? ((combo15Hits / combo15Valid) * 100).toFixed(1) : '0.0';
    const rate55 = combo55Valid > 0 ? ((combo55Hits / combo55Valid) * 100).toFixed(1) : '0.0';

    const getSingleStr = (i) => {
        const total = validTotals[i];
        const hits = matchCounts[i];
        const rate = total > 0 ? ((hits / total) * 100).toFixed(1) : '0.0';
        return `${hits}/${total} (${rate}%)`;
    };

    footTr1.innerHTML = `
        <td colspan="2">正确率</td>
        <td colspan="2">
            单列: ${getSingleStr(1)} / ${getSingleStr(2)}<br>
            <span class="sub-rate">3+2 组合: ${combo32Hits}/${combo32Valid} (${rate32}%)</span>
        </td>
        <td colspan="2">
            单列: ${getSingleStr(3)} / ${getSingleStr(4)}<br>
            <span class="sub-rate">1+5 组合: ${combo15Hits}/${combo15Valid} (${rate15}%)</span>
        </td>
        <td colspan="2">
            单列: ${getSingleStr(5)} / ${getSingleStr(6)}<br>
            <span class="sub-rate">5+5 组合: ${combo55Hits}/${combo55Valid} (${rate55}%)</span>
        </td>
        <td>-</td>
    `;
    tfoot.appendChild(footTr1);

    // 底部第二行：盈利
    const footTr2 = document.createElement('tr');
    footTr2.innerHTML = `
        <td colspan="2">盈利</td>
        <td colspan="2">
            单列: ${profitCols[1]} / ${profitCols[2]}<br>
            <span class="sub-rate">3+2 组合盈利: ${profit32}</span>
        </td>
        <td colspan="2">
            单列: ${profitCols[3]} / ${profitCols[4]}<br>
            <span class="sub-rate">1+5 组合盈利: ${profit15}</span>
        </td>
        <td colspan="2">
            单列: ${profitCols[5]} / ${profitCols[6]}<br>
            <span class="sub-rate">5+5 组合盈利: ${profit55}</span>
        </td>
        <td>-</td>
    `;
    tfoot.appendChild(footTr2);
}

// 初始化数据加载
if (typeof arr_kl8 !== 'undefined') {
    renderData(arr_kl8);
} else {
    document.getElementById("showdata").innerHTML = '<div class="data-card">未检测到数据源 arr_kl8.js</div>';
}

if (typeof arr_he7 !== 'undefined') {
    renderHe7(arr_he7);
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