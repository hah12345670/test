let savedCoreNumbersHistory = [];
let currentPage = 1;
const pageSize = 5; // 每页显示5条历史记录
let selectedTiers = []; // 存储当前选中的段位数组，如 ['0', '2', '5']，为空时表示选择"全部"
let selectedSorts = ['varianceAsc', 'iterDesc']; // 多选排序规则数组，默认同时勾选两者

/**
 * 渲染顶部配置面板
 */
function renderConfigPanel(config) {
    const panel = document.getElementById('configPanel');
    if (!panel) return;
    panel.innerHTML = '';

    // 1. 渲染原有的比例配置项
    for (let key in config.configOptions) {
        let group = config.configOptions[key];
        let row = document.createElement('div');
        row.className = 'config-row';

        let titleSpan = document.createElement('span');
        titleSpan.className = 'config-title';
        titleSpan.innerText = group.title + ':';
        row.appendChild(titleSpan);

        group.options.forEach((opt, idx) => {
            let label = document.createElement('label');
            label.className = 'checkbox-label';

            let input = document.createElement('input');
            input.type = 'checkbox';
            input.name = key;
            input.value = idx;

            let subName = (group.subNames && group.subNames[idx]) ? group.subNames[idx] : `选项${idx + 1}`;
            let patternStr = opt.pattern.join(',');
            let displayText = `${subName}[${patternStr},${opt.threshold}]`;

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${displayText}`));
            row.appendChild(label);
        });

        panel.appendChild(row);
    }

    // 2. 抽取范围配置行
    let rangeRow = document.createElement('div');
    rangeRow.className = 'config-row';

    let rangeTitleSpan = document.createElement('span');
    rangeTitleSpan.className = 'config-title';
    rangeTitleSpan.innerText = '抽取数量范围:';
    rangeRow.appendChild(rangeTitleSpan);

    let rangeBox = document.createElement('div');
    rangeBox.className = 'range-box';
    rangeBox.innerHTML = `
        <span>最小:</span>
        <input type="number" id="minCount" value="6" min="1" max="20">
        <span>最大:</span>
        <input type="number" id="maxCount" value="8" min="1" max="20">
    `;
    rangeRow.appendChild(rangeBox);
    panel.appendChild(rangeRow);

    // 3. 段位数量范围配置行
    let tierRangeRow = document.createElement('div');
    tierRangeRow.className = 'config-row';

    let tierRangeTitleSpan = document.createElement('span');
    tierRangeTitleSpan.className = 'config-title';
    tierRangeTitleSpan.innerText = '段位数量范围:';
    tierRangeRow.appendChild(tierRangeTitleSpan);

    let tierRangeBox = document.createElement('div');
    tierRangeBox.className = 'range-box';
    tierRangeBox.innerHTML = `
        <span>最小段位:</span>
        <input type="number" id="minTier" value="5" min="1" max="8">
        <span>最大段位:</span>
        <input type="number" id="maxTier" value="8" min="1" max="8">
    `;
    tierRangeRow.appendChild(tierRangeBox);
    panel.appendChild(tierRangeRow);

    // 4. 批量自动筛选配置行
    let batchRow = document.createElement('div');
    batchRow.className = 'config-row';
    batchRow.style.marginTop = '10px';
    batchRow.style.borderTop = '1px dashed #ccc';
    batchRow.style.paddingTop = '10px';

    let batchTitleSpan = document.createElement('span');
    batchTitleSpan.className = 'config-title';
    batchTitleSpan.innerText = '自动连续筛选:';
    batchRow.appendChild(batchTitleSpan);

    let batchBox = document.createElement('div');
    batchBox.className = 'range-box';
    batchBox.innerHTML = `
        <span>次数:</span>
        <input type="number" id="batchCount" value="100" min="1" max="1000" style="width: 70px;">
        <button id="batchBtn" onclick="batchGenerate()" style="margin-left: 10px; padding: 4px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">开始批量筛选</button>
    `;
    batchRow.appendChild(batchBox);
    panel.appendChild(batchRow);
}

/**
 * 批量执行异步逻辑（防止浏览器 UI 卡死）
 */
async function batchGenerate() {
    let count = parseInt(document.getElementById('batchCount').value) || 100;
    let btn = document.getElementById('batchBtn');
    
    let originalText = btn.innerText;
    let originalColor = btn.style.background;
    btn.disabled = true;
    btn.style.background = '#6c757d';
    btn.style.cursor = 'not-allowed';

    for(let i = 0; i < count; i++) {
        btn.innerText = `筛选中 (${i + 1}/${count})...`;
        await new Promise(resolve => setTimeout(resolve, 0));
        generateByCheckedConfigs();
    }

    btn.innerText = originalText;
    btn.style.background = originalColor;
    btn.disabled = false;
    btn.style.cursor = 'pointer';
}

function pad(n) {
    return n < 10 ? '0' + n : '' + n;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isPrime(n) {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function getVariance(arr) {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
}

function getQuadrant(r, c) {
    let isTop = r < 4;
    let isLeft = c < 5;
    if (isTop && isLeft) return 1;
    if (isTop && !isLeft) return 2;
    if (!isTop && isLeft) return 3;
    return 4;
}

/**
 * 初始化系统
 */
function initSystem() {
    if (typeof currentSystemConfig === 'undefined') {
        console.error("未找到 currentSystemConfig，请确保 tj_sx.js 已在 kl8_tj.js 之前加载！");
        return;
    }
    renderConfigPanel(currentSystemConfig);
    let tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let currentNum = 1;
    for (let r = 0; r < 8; r++) {
        let tr = document.createElement('tr');
        for (let c = 0; c < 10; c++) {
            let td = document.createElement('td');
            td.innerText = pad(currentNum++);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    document.getElementById('result-tip').innerText = "初始状态：显示 1-80 默认表格";
    document.getElementById('group-detail-tip').innerText = "";
}

// 检查条目是否契合多选段位条件 (必须同时包含所有选中的段位)
function isItemMatchingTiers(item) {
    if (selectedTiers.length === 0) return true;
    return selectedTiers.every(t => item.activeTiers.includes(`段${t}`));
}

// 安全删除历史记录项
function deleteHistoryItem(id) {
    savedCoreNumbersHistory = savedCoreNumbersHistory.filter(item => item.id !== id);

    let filteredHistory = savedCoreNumbersHistory.filter(isItemMatchingTiers);

    const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    renderHistoryContainer();
}

function changePage(page) {
    let filteredHistory = savedCoreNumbersHistory.filter(isItemMatchingTiers);

    const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderHistoryContainer();
}

// 切换/多选段位触发函数
function toggleTierFilter(tier) {
    if (tier === 'all') {
        selectedTiers = [];
    } else {
        let index = selectedTiers.indexOf(tier);
        if (index > -1) {
            selectedTiers.splice(index, 1);
        } else {
            selectedTiers.push(tier);
        }
    }
    currentPage = 1;
    renderHistoryContainer();
}

// 切换排序勾选状态（支持多选）
function toggleSortMode(mode) {
    let index = selectedSorts.indexOf(mode);
    if (index > -1) {
        selectedSorts.splice(index, 1); // 取消勾选
    } else {
        selectedSorts.push(mode); // 勾选
    }
    currentPage = 1; // 重置到第 1 页
    renderHistoryContainer();
}

/**
 * 渲染历史记录区域
 */
function renderHistoryContainer() {
    let historyContainer = document.getElementById('history-container');
    if (!historyContainer) return;

    if (savedCoreNumbersHistory.length === 0) {
        historyContainer.innerHTML = '';
        return;
    }

    // 1. 段位过滤
    let filteredHistory = savedCoreNumbersHistory.filter(isItemMatchingTiers);

    // 2. 多选排序逻辑 (固定微观方差升序优先级最高)
    filteredHistory.sort((a, b) => {
        let hasVariance = selectedSorts.includes('varianceAsc');
        let hasIter = selectedSorts.includes('iterDesc');

        if (hasVariance && hasIter) {
            // 【两者均选】微观方差优先 (升序)；方差相同时按迭代次数 (降序)
            if (a.variance !== b.variance) {
                return a.variance - b.variance;
            }
            return b.iterations - a.iterations;
        } else if (hasVariance) {
            // 【仅选微观方差升序】
            return a.variance - b.variance;
        } else if (hasIter) {
            // 【仅选迭代次数降序】
            return b.iterations - a.iterations;
        }
        return 0; // 【均未选】按原逻辑相对顺序
    });

    const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    // 构建多选段位（0-8）按钮组
    let isAllSelected = selectedTiers.length === 0;
    let tierButtonsHtml = `
        <button onclick="toggleTierFilter('all')" style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s; border: 1px solid ${isAllSelected ? 'var(--primary-color)' : '#ddd'}; background: ${isAllSelected ? 'var(--primary-color)' : '#fff'}; color: ${isAllSelected ? '#fff' : '#555'};">全部</button>
    `;

    for (let i = 0; i <= 8; i++) {
        let isSelected = selectedTiers.includes(`${i}`);
        tierButtonsHtml += `
            <button onclick="toggleTierFilter('${i}')" style="padding: 2px 6px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.2s; border: 1px solid ${isSelected ? '#0275d8' : '#ddd'}; background: ${isSelected ? '#0275d8' : '#fff'}; color: ${isSelected ? '#fff' : '#555'}; font-weight: ${isSelected ? 'bold' : 'normal'};">段${i}</button>
        `;
    }

    // 构建可多选的排序按钮 UI
    let sortOptions = [
        { key: 'varianceAsc', label: '微观方差 ↑' },
        { key: 'iterDesc', label: '迭代次数 ↓' }
    ];

    let sortButtonsHtml = '';
    sortOptions.forEach(opt => {
        let isSelected = selectedSorts.includes(opt.key);
        sortButtonsHtml += `
            <button onclick="toggleSortMode('${opt.key}')" style="padding: 2px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.2s; border: 1px solid ${isSelected ? '#28a745' : '#ddd'}; background: ${isSelected ? '#28a745' : '#fff'}; color: ${isSelected ? '#fff' : '#555'}; font-weight: ${isSelected ? 'bold' : 'normal'};">
                ${isSelected ? '✓ ' : ''}${opt.label}
            </button>
        `;
    });

    let htmlContent = `
        <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
                <div style="font-weight:bold; color:#333;">📜 历史保存记录 (${filteredHistory.length}/${savedCoreNumbersHistory.length}条)：</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; background: #f8f9fa; padding: 6px 8px; border-radius: 6px; border: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                    <span style="font-size: 12px; font-weight: bold; color: #555; margin-right: 2px;">🔍 多选段位(需同时包含):</span>
                    ${tierButtonsHtml}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; border-top: 1px dashed #e0e0e0; padding-top: 6px;">
                    <span style="font-size: 12px; font-weight: bold; color: #555; margin-right: 2px;">🔃 多选排序规则:</span>
                    ${sortButtonsHtml}
                </div>
            </div>
        </div>`;

    if (filteredHistory.length === 0) {
        let selectedText = selectedTiers.map(t => `段${t}`).join(' + ');
        htmlContent += `<div style="text-align: center; color: #999; padding: 15px 0; font-size: 12px; background: #fafafa; border: 1px dashed #ddd; border-radius: 6px;">未检索到同时包含 [${selectedText}] 的历史保存记录</div>`;
        historyContainer.innerHTML = htmlContent;
        return;
    }

    if (totalPages > 1) {
        let pagesHtml = '';
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + 2);
        if (endPage - startPage < 2) {
            startPage = Math.max(1, endPage - 2);
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                pagesHtml += `<button style="background: var(--primary-color); color: white; border: 1px solid var(--primary-color); border-radius: 3px; padding: 2px 6px; font-size: 11px; font-weight: bold; cursor: default;">${i}</button>`;
            } else {
                pagesHtml += `<button onclick="changePage(${i})" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 3px; padding: 2px 6px; font-size: 11px; cursor: pointer;">${i}</button>`;
            }
        }

        htmlContent += `
            <div style="display: flex; justify-content: center; align-items: center; gap: 4px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #eee; flex-wrap: wrap;">
                <button onclick="changePage(1)" ${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'} style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 3px; padding: 2px 6px; font-size: 11px;">最 前</button>
                <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'} style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 3px; padding: 2px 6px; font-size: 11px;">上一页</button>

                <div style="display: flex; gap: 3px; margin: 0 4px;">
                    ${pagesHtml}
                </div>

                <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'} style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 3px; padding: 2px 6px; font-size: 11px;">下一页</button>
                <button onclick="changePage(${totalPages})" ${currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'} style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 3px; padding: 2px 6px; font-size: 11px;">最 后</button>
            </div>`;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageItems = filteredHistory.slice(startIndex, endIndex);

    pageItems.forEach((item, idx) => {
        let absoluteIndex = startIndex + idx;
        let rank = absoluteIndex + 1;
        let iterText = item.iterations ? ` (迭代: ${item.iterations}次)` : '';
        htmlContent += `
            <div style="background: #fafafa; border: 1px solid #eee; border-radius: 6px; padding: 6px 10px; margin: 6px 0; font-family: monospace; font-size: 12px; line-height: 1.6; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #eee; padding-bottom: 2px; margin-bottom: 4px; color: #888;">
                    <span>排名 <strong>#${rank}</strong> (${item.time})</span>
                    <button onclick="deleteHistoryItem('${item.id}')" style="background: var(--primary-color); color: white; border: none; border-radius: 3px; padding: 2px 6px; font-size: 10px; cursor: pointer;">删除</button>
                </div>
                <div>核心数字: <span style="color: var(--primary-color); font-weight: bold; word-break: break-all;">[${item.formatted}]</span></div>
                <div>微观方差: <span style="color: #0275d8; font-weight: bold;">${item.variance.toFixed(3)}${iterText}</span></div>
                <div>覆盖段位(${item.tierCount}段): <span style="color: #5bc0de; font-weight: bold;">[${item.activeTiers}]</span></div>
            </div>`;
    });

    historyContainer.innerHTML = htmlContent;
}

/**
 * 核心筛选算法逻辑
 */
function generateByCheckedConfigs() {
    let userMin = parseInt(document.getElementById('minCount').value) || 6;
    let userMax = parseInt(document.getElementById('maxCount').value) || 8;
    if (userMin > userMax) {
        let temp = userMin;
        userMin = userMax;
        userMax = temp;
    }

    let userMinTier = parseInt(document.getElementById('minTier').value) || 1;
    let userMaxTier = parseInt(document.getElementById('maxTier').value) || 8;
    if (userMinTier > userMaxTier) {
        let temp = userMinTier;
        userMinTier = userMaxTier;
        userMaxTier = temp;
    }

    let activeConfigOptions = currentSystemConfig.configOptions;
    let checkedData = {};

    for (let key in activeConfigOptions) {
        let checkboxes = document.querySelectorAll(`input[name="${key}"]:checked`);
        checkedData[key] = Array.from(checkboxes).map(el => activeConfigOptions[key].options[el.value]);
    }

    let matrix, validAvailableNums, stats, finalGroupMapping = [], attempts = 0;

    while (true) {
        attempts++;
        let allNumbers = [];
        for (let i = 1; i <= 80; i++) allNumbers.push(i);
        shuffle(allNumbers);

        matrix = [];
        let idx = 0;
        for (let r = 0; r < 8; r++) {
            let row = [];
            for (let c = 0; c < 10; c++) row.push(allNumbers[idx++]);
            matrix.push(row);
        }

        let hitTierCount = 0;
        let currentAvailableNums = [];

        currentSystemConfig.knownDataGroups.forEach((group) => {
            let hitsInMatrix = group.filter(num => {
                for (let r = 0; r < 8; r++) {
                    if (matrix[r].includes(num)) return true;
                }
                return false;
            });

            if (hitsInMatrix.length >= 1) {
                hitTierCount++;
                currentAvailableNums.push(...hitsInMatrix);
            }
        });

        if (hitTierCount < userMinTier || currentAvailableNums.length < userMin) {
            if (attempts > 20000) break;
            continue;
        }

        shuffle(currentAvailableNums);

        let targetCount = Math.floor(Math.random() * (userMax - userMin + 1)) + userMin;
        let samplePool = currentAvailableNums.slice(0, Math.min(targetCount, currentAvailableNums.length));
        if (samplePool.length < userMin) continue;

        let finalHitTierCount = 0;
        currentSystemConfig.knownDataGroups.forEach((group) => {
            let matchedInSample = group.filter(n => samplePool.includes(n));
            if (matchedInSample.length > 0) {
                finalHitTierCount++;
            }
        });

        if (finalHitTierCount < userMinTier || finalHitTierCount > userMaxTier) {
            if (attempts > 20000) break;
            continue;
        }

        let passedAllChecks = true;
        let reportParts = [`核心命中段位: ${finalHitTierCount}段`];
        let totalVarianceScore = 0;

        for (let key in checkedData) {
            let checkedList = checkedData[key];
            if (checkedList.length === 0) continue;

            if (key === 'mod3') {
                let m3 = [0, 0, 0];
                samplePool.forEach(n => m3[n % 3]++);
                let matched = checkedList.some(conf => getVariance([...m3, conf.threshold]) <= conf.threshold * 2.5);
                totalVarianceScore += Math.min(...checkedList.map(conf => getVariance([...m3, conf.threshold])));
                reportParts.push(`012路[${m3.join(':')}]`);
                if (!matched) passedAllChecks = false;
            } else if (key === 'oe') {
                let oe = [0, 0];
                samplePool.forEach(n => n % 2 === 0 ? oe[1]++ : oe[0]++);
                let matched = checkedList.some(conf => getVariance([...oe, conf.threshold]) <= conf.threshold * 2.5);
                totalVarianceScore += Math.min(...checkedList.map(conf => getVariance([...oe, conf.threshold])));
                reportParts.push(`奇偶[${oe.join(':')}]`);
                if (!matched) passedAllChecks = false;
            } else if (key === 'range') {
                let rg = [0, 0, 0];
                samplePool.forEach(n => {
                    if (n <= 29) rg[0]++;
                    else if (n <= 59) rg[1]++;
                    else rg[2]++;
                });
                let matched = checkedList.some(conf => getVariance([...rg, conf.threshold]) <= conf.threshold * 4.0);
                totalVarianceScore += Math.min(...checkedList.map(conf => getVariance([...rg, conf.threshold])));
                reportParts.push(`三区[${rg.join(':')}]`);
                if (!matched) passedAllChecks = false;
            } else if (key === 'prime') {
                let pr = [0, 0];
                samplePool.forEach(n => isPrime(n) ? pr[0]++ : pr[1]++);
                let matched = checkedList.some(conf => getVariance([...pr, conf.threshold]) <= conf.threshold * 3.0);
                totalVarianceScore += Math.min(...checkedList.map(conf => getVariance([...pr, conf.threshold])));
                reportParts.push(`质合[${pr.join(':')}]`);
                if (!matched) passedAllChecks = false;
            } else if (key === 'quad') {
                let qd = [0, 0, 0, 0];
                samplePool.forEach(n => {
                    for (let r = 0; r < 8; r++) {
                        for (let c = 0; c < 10; c++) {
                            if (matrix[r][c] === n) qd[getQuadrant(r, c) - 1]++;
                        }
                    }
                });
                let matched = checkedList.some(conf => getVariance([...qd, conf.threshold]) <= conf.threshold * 3.5);
                totalVarianceScore += Math.min(...checkedList.map(conf => getVariance([...qd, conf.threshold])));
                reportParts.push(`象限[${qd.join(':')}]`);
                if (!matched) passedAllChecks = false;
            }
        }

        if (passedAllChecks || attempts > 20000) {
            validAvailableNums = samplePool;

            finalGroupMapping = [];
            currentSystemConfig.knownDataGroups.forEach((group, gIndex) => {
                let matchedInSample = group.filter(n => validAvailableNums.includes(n));
                if (matchedInSample.length > 0) {
                    finalGroupMapping.push({ tier: gIndex, nums: matchedInSample });
                }
            });

            reportParts.push(`微观方差: <strong>${totalVarianceScore.toFixed(3)}</strong>`);
            stats = {
                desc: reportParts.join(' | '),
                iterations: attempts
            };
            break;
        }
    }

    if (!validAvailableNums) {
        console.warn("单次筛选未能在 20000 次内契合，跳过此条记录");
        return;
    }

    let tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    for (let r = 0; r < 8; r++) {
        let tr = document.createElement('tr');
        for (let c = 0; c < 10; c++) {
            let td = document.createElement('td');
            let val = matrix[r][c];
            td.innerText = pad(val);
            if (validAvailableNums.includes(val)) {
                td.classList.add('selected-target');
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    let formattedPicked = validAvailableNums.map(n => pad(n)).sort().join(', ');
    let varianceMatch = stats.desc.match(/微观方差:\s*<strong>([\d.]+)<\/strong>/);
    let varianceVal = varianceMatch ? parseFloat(varianceMatch[1]) : 0.000;

    let activeTiers = finalGroupMapping.map(item => `段${item.tier}`).join(', ');
    let tierCount = finalGroupMapping.length;

    savedCoreNumbersHistory.push({
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        time: new Date().toLocaleTimeString(),
        formatted: formattedPicked,
        variance: varianceVal,
        iterations: stats.iterations,
        tierCount: tierCount,
        activeTiers: activeTiers
    });

    currentPage = 1;
    renderHistoryContainer();

    let tierDistributionText = finalGroupMapping.map(item => {
        let numsStr = item.nums.map(n => pad(n)).join(',');
        return `[段${item.tier}: ${numsStr}]`;
    }).join(' ');

    document.getElementById('result-tip').innerHTML =
        `🎯 动态筛选抽取的 <strong>${validAvailableNums.length} 个核心数字</strong>：<span style="background:#fff3cd; padding:2px 4px; border:1px solid #f0ad4e;">[ ${formattedPicked} ]</span>`;

    document.getElementById('tier-tip').innerHTML =
        `📊 <strong>动态校验报告：</strong> ${stats.desc} (迭代: ${stats.iterations}次)`;

    document.getElementById('group-detail-tip').innerHTML =
        `📍 <strong>核心数字所在段位 (0-7段)：</strong> ${tierDistributionText}`;
}

window.onload = initSystem;
