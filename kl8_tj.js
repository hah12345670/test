let savedCoreNumbersHistory = [];
let currentPage = 1;
const pageSize = 5; // 每页显示5条历史记录
let selectedTiers = []; // 存储当前选中的段位数组，如 ['0', '2', '5']，为空时表示选择"全部"
let selectedSorts = ['varianceAsc', 'iterDesc']; // 多选排序规则数组，默认同时勾选两者

/**
 * 监听已知段位选择状态，动态控制“段位数量范围”输入框的启用/禁用
 */
function updateTierRangeInputStatus() {
    let checkedTierBoxes = document.querySelectorAll('input[name="knownTierSelect"]:checked');
    let isAnyTierChecked = checkedTierBoxes.length > 0;

    let minTierInput = document.getElementById('minTier');
    let maxTierInput = document.getElementById('maxTier');
    let tierRangeBox = document.getElementById('tierRangeBox');

    if (minTierInput && maxTierInput) {
        minTierInput.disabled = isAnyTierChecked;
        maxTierInput.disabled = isAnyTierChecked;
    }

    if (tierRangeBox) {
        if (isAnyTierChecked) {
            tierRangeBox.style.opacity = '0.5';
            tierRangeBox.style.cursor = 'not-allowed';
            tierRangeBox.title = '已选择特定已知段位，段位数量范围限制已自动失效';
        } else {
            tierRangeBox.style.opacity = '1.0';
            tierRangeBox.style.cursor = 'default';
            tierRangeBox.title = '';
        }
    }
}

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

    // 2. 已知数据段位勾选行 (0-8段，默认全不勾选)
    if (config.knownDataGroups) {
        let tierSelectRow = document.createElement('div');
        tierSelectRow.className = 'config-row';

        let tierTitleSpan = document.createElement('span');
        tierTitleSpan.className = 'config-title';
        tierTitleSpan.innerText = '已知段位选择:';
        tierSelectRow.appendChild(tierTitleSpan);

        // 支持最高到8段（下标0-8，共9个可能的段位）
        for (let i = 0; i <= 8; i++) {
            let groupData = config.knownDataGroups[i];
            let hasData = groupData && groupData.length > 0;

            let label = document.createElement('label');
            label.className = 'checkbox-label';
            if (!hasData) {
                label.style.color = '#ccc';
                label.style.cursor = 'not-allowed';
            }

            let input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'knownTierSelect';
            input.value = i;
            input.checked = false; // 默认不勾选

            if (!hasData) {
                input.disabled = true; // 空数组禁用
            } else {
                // 添加点击切换事件，实时更新段位数量范围框状态
                input.addEventListener('change', updateTierRangeInputStatus);
            }

            label.appendChild(input);
            label.appendChild(document.createTextNode(` 段${i}${hasData ? `(${groupData.length}个)` : '(空)'}`));
            tierSelectRow.appendChild(label);
        }
        panel.appendChild(tierSelectRow);
    }

    // 3. 抽取范围配置行
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

    // 4. 段位数量范围配置行
    let tierRangeRow = document.createElement('div');
    tierRangeRow.className = 'config-row';

    let tierRangeTitleSpan = document.createElement('span');
    tierRangeTitleSpan.className = 'config-title';
    tierRangeTitleSpan.innerText = '段位数量范围:';
    tierRangeRow.appendChild(tierRangeTitleSpan);

    let tierRangeBox = document.createElement('div');
    tierRangeBox.className = 'range-box';
    tierRangeBox.id = 'tierRangeBox';
    tierRangeBox.innerHTML = `
        <span>最小段位:</span>
        <input type="number" id="minTier" value="5" min="1" max="8">
        <span>最大段位:</span>
        <input type="number" id="maxTier" value="8" min="1" max="8">
    `;
    tierRangeRow.appendChild(tierRangeBox);
    panel.appendChild(tierRangeRow);

    // 5. 批量自动筛选配置行
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

    // 初始化交互UI状态
    updateTierRangeInputStatus();
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

/**
 * 固定 8x10 标准物理坐标象限推导函数：
 * 1象限：右上 (06-10, 16-20, 26-30, 36-40)
 * 2象限：左上 (01-05, 11-15, 21-25, 31-35)
 * 3象限：左下 (41-45, 51-55, 61-65, 71-75)
 * 4象限：右下 (46-50, 56-60, 66-70, 76-80)
 */
function getNumQuadrant(num) {
    let r = Math.floor((num - 1) / 10); // 行 (0~7)
    let c = (num - 1) % 10;             // 列 (0~9)
    let isTop = r < 4;    // 0~3 行为上半区
    let isLeft = c < 5;   // 0~4 列为左半区
    if (isTop && !isLeft) return 1;   // 右上 -> 1象限
    if (isTop && isLeft) return 2;    // 左上 -> 2象限
    if (!isTop && isLeft) return 3;   // 左下 -> 3象限
    return 4;                         // 右下 -> 4象限
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
    let tipEl = document.getElementById('result-tip');
    if (tipEl) tipEl.innerText = "初始状态：显示 1-80 默认表格";
    let detailEl = document.getElementById('group-detail-tip');
    if (detailEl) detailEl.innerText = "";
}

/**
 * 检查历史条目是否契合底部选中的段位条件（AND 逻辑：必须同时包含所有勾选的段位）
 */
function isItemMatchingTiers(item) {
    if (selectedTiers.length === 0) return true; 
    if (!item.formatted) return false;

    let itemNums = item.formatted.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    let itemTierSet = new Set();
    itemNums.forEach(n => {
        let tierIndex = (n === 80) ? 8 : Math.floor(n / 10);
        itemTierSet.add(String(tierIndex));
    });

    // 改用 every，确保历史记录同时包含了所有勾选的段位
    return selectedTiers.every(t => itemTierSet.has(String(t)));
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

// 切换/多选历史筛选段位触发函数
function toggleTierFilter(tier) {
    if (tier === 'all') {
        selectedTiers = [];
    } else {
        let strTier = String(tier);
        let index = selectedTiers.indexOf(strTier);
        if (index > -1) {
            selectedTiers.splice(index, 1);
        } else {
            selectedTiers.push(strTier);
        }
    }
    currentPage = 1;
    renderHistoryContainer();
}

// 切换排序勾选状态（支持多选）
function toggleSortMode(mode) {
    let index = selectedSorts.indexOf(mode);
    if (index > -1) {
        selectedSorts.splice(index, 1);
    } else {
        selectedSorts.push(mode);
    }
    currentPage = 1;
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

    let filteredHistory = savedCoreNumbersHistory.filter(isItemMatchingTiers);

    filteredHistory.sort((a, b) => {
        let hasVariance = selectedSorts.includes('varianceAsc');
        let hasIter = selectedSorts.includes('iterDesc');

        if (hasVariance && hasIter) {
            if (a.variance !== b.variance) {
                return a.variance - b.variance;
            }
            return b.iterations - a.iterations;
        } else if (hasVariance) {
            return a.variance - b.variance;
        } else if (hasIter) {
            return b.iterations - a.iterations;
        }
        return 0;
    });

    const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let isAllSelected = selectedTiers.length === 0;
    let tierButtonsHtml = `
        <button onclick="toggleTierFilter('all')" style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s; border: 1px solid ${isAllSelected ? 'var(--primary-color, #007bff)' : '#ddd'}; background: ${isAllSelected ? 'var(--primary-color, #007bff)' : '#fff'}; color: ${isAllSelected ? '#fff' : '#555'};">全部</button>
    `;

    for (let i = 0; i <= 8; i++) {
        let isSelected = selectedTiers.includes(`${i}`);
        tierButtonsHtml += `
            <button onclick="toggleTierFilter('${i}')" style="padding: 2px 6px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.2s; border: 1px solid ${isSelected ? '#0275d8' : '#ddd'}; background: ${isSelected ? '#0275d8' : '#fff'}; color: ${isSelected ? '#fff' : '#555'}; font-weight: ${isSelected ? 'bold' : 'normal'};">段${i}</button>
        `;
    }

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
                    <span style="font-size: 12px; font-weight: bold; color: #555; margin-right: 2px;">🔍 筛选段位:</span>
                    ${tierButtonsHtml}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; border-top: 1px dashed #e0e0e0; padding-top: 6px;">
                    <span style="font-size: 12px; font-weight: bold; color: #555; margin-right: 2px;">🔃 多选排序规则:</span>
                    ${sortButtonsHtml}
                </div>
            </div>
        </div>`;

    if (filteredHistory.length === 0) {
        let selectedText = selectedTiers.map(t => `段${t}`).join(' 且 ');
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
                pagesHtml += `<button style="background: var(--primary-color, #007bff); color: white; border: 1px solid var(--primary-color, #007bff); border-radius: 3px; padding: 2px 6px; font-size: 11px; font-weight: bold; cursor: default;">${i}</button>`;
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
                    <button onclick="deleteHistoryItem('${item.id}')" style="background: var(--primary-color, #d9534f); color: white; border: none; border-radius: 3px; padding: 2px 6px; font-size: 10px; cursor: pointer;">删除</button>
                </div>
                <div>核心数字: <span style="color: var(--primary-color, #d9534f); font-weight: bold; word-break: break-all;">[${item.formatted}]</span></div>
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

    let checkedTierBoxes = document.querySelectorAll('input[name="knownTierSelect"]:checked');
    let allowedTierIndices = Array.from(checkedTierBoxes).map(el => parseInt(el.value));
    let hasCheckedTiers = allowedTierIndices.length > 0;

    let matrix, validAvailableNums, stats, finalGroupMapping = [], attempts = 0;

    matrix = [];
    let curNum = 1;
    for (let r = 0; r < 8; r++) {
        let row = [];
        for (let c = 0; c < 10; c++) row.push(curNum++);
        matrix.push(row);
    }

    while (true) {
        attempts++;
        
        let currentAvailableNums = [];

        currentSystemConfig.knownDataGroups.forEach((group, gIdx) => {
            if (group && group.length > 0) {
                if (!hasCheckedTiers || allowedTierIndices.includes(gIdx)) {
                    currentAvailableNums.push(...group);
                }
            }
        });

        if (currentAvailableNums.length < userMin) {
            currentAvailableNums = Array.from({ length: 80 }, (_, i) => i + 1);
        }

        let shuffledNums = shuffle([...new Set(currentAvailableNums)]);
        let targetCount = Math.floor(Math.random() * (userMax - userMin + 1)) + userMin;
        let samplePool = shuffledNums.slice(0, Math.min(targetCount, shuffledNums.length)).sort((a, b) => a - b);

        if (samplePool.length < userMin) {
            if (attempts > 20000) break;
            continue;
        }

        if (!hasCheckedTiers) {
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
        }

        let passedAllChecks = true;
        let reportParts = [];
        
        let currentHitTierCount = 0;
        currentSystemConfig.knownDataGroups.forEach((group) => {
            if (group && group.some(n => samplePool.includes(n))) {
                currentHitTierCount++;
            }
        });
        reportParts.push(`核心命中段位: ${currentHitTierCount}段${hasCheckedTiers ? '(已指定段位范围)' : ''}`);

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
                    let quadIdx = getNumQuadrant(n) - 1;
                    qd[quadIdx]++;
                });

                let maxQuadCount = Math.max(...qd);
                let isNotCrowded = maxQuadCount <= Math.ceil(samplePool.length / 2);

                let matched = checkedList.some(conf => getVariance([...qd, conf.threshold]) <= conf.threshold * 3.5) && isNotCrowded;
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
    if (tbody) {
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
    }

    let formattedPicked = validAvailableNums.map(n => pad(n)).sort().join(', ');
    let varianceMatch = stats.desc.match(/微观方差:\s*<strong>([\d.]+)<\/strong>/);
    let varianceVal = varianceMatch ? parseFloat(varianceMatch[1]) : 0.000;

    let hitTierSet = new Set();
    validAvailableNums.forEach(n => {
        let tIdx = (n === 80) ? 8 : Math.floor(n / 10);
        hitTierSet.add(tIdx);
    });
    let sortedTiers = Array.from(hitTierSet).sort((a, b) => a - b);
    let activeTiers = sortedTiers.map(t => `段${t}`).join(', ');
    let tierCount = sortedTiers.length;

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

    let resultTip = document.getElementById('result-tip');
    if (resultTip) {
        resultTip.innerHTML = `🎯 动态筛选抽取的 <strong>${validAvailableNums.length} 个核心数字</strong>：<span style="background:#fff3cd; padding:2px 4px; border:1px solid #f0ad4e;">[ ${formattedPicked} ]</span>`;
    }

    let tierTip = document.getElementById('tier-tip');
    if (tierTip) {
        tierTip.innerHTML = `📊 <strong>动态校验报告：</strong> ${stats.desc} (迭代: ${stats.iterations}次)`;
    }

    let groupDetailTip = document.getElementById('group-detail-tip');
    if (groupDetailTip) {
        groupDetailTip.innerHTML = `📍 <strong>核心数字所在段位 (0-7段)：</strong> ${tierDistributionText}`;
    }
}

window.onload = initSystem;