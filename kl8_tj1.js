// kl8_tj1.js - 快乐8历史交集14维度组合筛选（含自选维度手动筛选）

// 1. 基础判断工具函数
const checkPrime = num => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const checkQuadrant = num => {
    const col = (num - 1) % 10 + 1;
    return num <= 40 ? (col <= 5 ? 'Q2' : 'Q1') : (col <= 5 ? 'Q3' : 'Q4');
};

// 2. 单个数字指标匹配判断
function matchIndicator(num, indicator) {
    switch (indicator) {
        case '0路': return num % 3 === 0;
        case '1路': return num % 3 === 1;
        case '2路': return num % 3 === 2;
        case '奇': return num % 2 !== 0;
        case '偶': return num % 2 === 0;
        case '一区': return num >= 1 && num <= 29;
        case '二区': return num >= 30 && num <= 59;
        case '三区': return num >= 60 && num <= 80;
        case '质': return checkPrime(num);
        case '合': return !checkPrime(num);
        case '象限一': return checkQuadrant(num) === 'Q1';
        case '象限二': return checkQuadrant(num) === 'Q2';
        case '象限三': return checkQuadrant(num) === 'Q3';
        case '象限四': return checkQuadrant(num) === 'Q4';
        default: return false;
    }
}

// 14 个基础维度定义
const ALL_INDICATORS = [
    '0路', '1路', '2路',
    '奇', '偶',
    '一区', '二区', '三区',
    '质', '合',
    '象限一', '象限二', '象限三', '象限四'
];

// 3. 生成有效组合（排他逻辑剔除）
function getValidComboSubsets(arr, minSize = 2) {
    const results = [];
    function hasConflict(combo) {
        const has = item => combo.includes(item);
        if (has('奇') && has('偶')) return true;
        if ((has('0路') && has('1路')) || (has('0路') && has('2路')) || (has('1路') && has('2路'))) return true;
        if ((has('一区') && has('二区')) || (has('一区') && has('三区')) || (has('二区') && has('三区'))) return true;
        if (has('质') && has('合')) return true;
        const qCount = ['象限一', '象限二', '象限三', '象限四'].filter(q => has(q)).length;
        if (qCount > 1) return true;
        return false;
    }

    function backtrack(start, current) {
        if (current.length >= minSize) {
            if (!hasConflict(current)) results.push([...current]);
        }
        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    backtrack(0, []);
    return results;
}

// 全局数据缓存
let cachedIntersections = [];

// 4. 根据指定的数字门槛（minCount）计算组合（自动 Top 榜）
function calculateCombosByThreshold(minCount = 5) {
    const validCombos = getValidComboSubsets(ALL_INDICATORS, 2);
    const comboStatsMap = new Map();

    cachedIntersections.forEach(intersection => {
        if (intersection.length < minCount) return;

        validCombos.forEach(combo => {
            const matchedNums = intersection.filter(num =>
                combo.every(indicator => matchIndicator(num, indicator))
            );

            if (matchedNums.length >= minCount) {
                const comboKey = combo.join(' + ');
                if (!comboStatsMap.has(comboKey)) {
                    comboStatsMap.set(comboKey, {
                        comboStr: comboKey,
                        comboSize: combo.length,
                        historyHitTimes: 0,
                        maxMatchCount: matchedNums.length
                    });
                }
                const statObj = comboStatsMap.get(comboKey);
                statObj.historyHitTimes += 1;
                if (matchedNums.length > statObj.maxMatchCount) {
                    statObj.maxMatchCount = matchedNums.length;
                }
            }
        });
    });

    const comboList = Array.from(comboStatsMap.values());

    comboList.sort((a, b) => {
        if (b.comboSize !== a.comboSize) return b.comboSize - a.comboSize;
        if (b.historyHitTimes !== a.historyHitTimes) return b.historyHitTimes - a.historyHitTimes;
        return b.maxMatchCount - a.maxMatchCount;
    });

    return comboList;
}

// 5. 手动复选框筛选计算逻辑（使用 knownDataGroups 与全维度交集）
function calculateManualCustomSelection(selectedIndicators) {
    if (!selectedIndicators || selectedIndicators.length === 0) return [];

    // 获取数据源：优先使用全局 knownDataGroups，若不存在则回退至 rawDataArray/cachedIntersections
    const dataSource = (typeof knownDataGroups !== 'undefined' && knownDataGroups.length > 0)
        ? knownDataGroups
        : (typeof rawDataArray !== 'undefined' ? rawDataArray : []);

    const results = [];

    dataSource.forEach(item => {
        let periodCode = '';
        let intersection = [];

        // 兼容 knownDataGroups [期号, [数字组1], [数字组2]] 格式
        if (Array.isArray(item)) {
            periodCode = item[0] ? String(item[0]).slice(0, 3) : '';
            if (item[1] && item[2]) {
                const set2 = new Set(item[2]);
                intersection = item[1].filter(num => set2.has(num));
            } else if (item[1]) {
                intersection = item[1];
            }
        }

        // 在已知交集中，再过滤满足所有勾选维度的数字
        const matchedNums = intersection.filter(num =>
            selectedIndicators.every(ind => matchIndicator(num, ind))
        );

        let r0 = 0, r1 = 0, r2 = 0;
        let odd = 0, even = 0;
        let z1 = 0, z2 = 0, z3 = 0;
        let prime = 0, composite = 0;
        let q1 = 0, q2 = 0, q3 = 0, q4 = 0;

        matchedNums.forEach(num => {
            if (num % 3 === 0) r0++;
            else if (num % 3 === 1) r1++;
            else r2++;

            num % 2 !== 0 ? odd++ : even++;

            if (num <= 29) z1++;
            else if (num <= 59) z2++;
            else z3++;

            checkPrime(num) ? prime++ : composite++;

            const q = checkQuadrant(num);
            if (q === 'Q1') q1++;
            else if (q === 'Q2') q2++;
            else if (q === 'Q3') q3++;
            else if (q === 'Q4') q4++;
        });

        results.push({
            code: periodCode,
            count: matchedNums.length,
            nums: matchedNums,
            rRatio: `${r0}:${r1}:${r2}`,
            oeRatio: `${odd}:${even}`,
            zRatio: `${z1}:${z2}:${z3}`,
            pcRatio: `${prime}:${composite}`,
            qRatio: `${q1}:${q2}:${q3}:${q4}`
        });
    });

    return results;
}

// 6. 渲染 UI 面板（包含复选框与 Top 统计表）
function renderTopComboTable(topN = 10, minCount = 5) {
    let topContainer = document.querySelector('#topIndicatorContainer');
    if (!topContainer) {
        const targetTable = document.querySelector('#statResultTable');
        if (!targetTable) return;
        topContainer = document.createElement('div');
        topContainer.id = 'topIndicatorContainer';
        topContainer.style.marginBottom = '15px';
        targetTable.parentNode.insertBefore(topContainer, targetTable);
    }

    const currentComboList = calculateCombosByThreshold(minCount);
    const totalMax = currentComboList.length;

    let validTopN = parseInt(topN, 10);
    if (isNaN(validTopN) || validTopN < 1) validTopN = 10;

    let html = `
        <style>
            .m-combo-card {
                background: #fff;
                padding: 12px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                box-sizing: border-box;
            }
            .m-checkbox-group {
                display: flex;
                flex-wrap: wrap;
                gap: 8px 12px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 6px;
                margin-bottom: 12px;
                border: 1px solid #e9ecef;
            }
            .m-checkbox-item {
                display: inline-flex;
                align-items: center;
                font-size: 13px;
                color: #333;
                cursor: pointer;
            }
            .m-checkbox-item input {
                margin-right: 4px;
                cursor: pointer;
            }
            .m-combo-header {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 10px;
            }
            .m-combo-search {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            }
            .m-combo-input {
                width: 50px;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 4px;
                text-align: center;
                font-size: 13px;
            }
            .m-combo-btn {
                padding: 5px 12px;
                background: #007bff;
                color: #fff;
                border: none;
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
                touch-action: manipulation;
            }
            .m-combo-btn-danger {
                background: #dc3545;
            }
            .m-table-wrapper {
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                border-radius: 4px;
            }
            .m-combo-table {
                width: 100%;
                border-collapse: collapse;
                text-align: center;
                font-size: 12px;
                white-space: nowrap;
            }
            .m-combo-table th, .m-combo-table td {
                padding: 8px 6px;
            }
            @media (min-width: 600px) {
                .m-combo-header {
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
                .m-combo-table { font-size: 13px; }
                .m-combo-table th, .m-combo-table td { padding: 8px 10px; }
            }
        </style>

        <div class="m-combo-card">
            <!-- 14维度自由勾选区 -->
            <div style="font-size:14px; font-weight:bold; color:#333; margin-bottom:6px;">🛠️ 自定义14维度交集筛选 (默认未勾选)</div>
            <div class="m-checkbox-group" id="indicatorCheckboxGroup">
                ${ALL_INDICATORS.map(ind => `
                    <label class="m-checkbox-item">
                        <input type="checkbox" name="customIndicator" value="${ind}"> ${ind}
                    </label>
                `).join('')}
                <button id="resetCheckboxBtn" style="margin-left:auto; font-size:12px; padding:2px 8px; cursor:pointer;">清空已选</button>
            </div>

            <!-- 自定义筛选结果显示区域 (仅在勾选时渲染) -->
            <div id="manualResultContainer" style="display:none; margin-bottom:15px; border-bottom:2px dashed #007bff; padding-bottom:12px;"></div>

            <!-- Top 排名控制栏 -->
            <div class="m-combo-header">
                <h3 style="margin:0; color:#333; font-size:16px;">🔥 全历史交集【多维组合筛选】排名</h3>
                
                <div class="m-combo-search">
                    <label style="font-size:12px; color:#555; font-weight:bold;">数字门槛 >=</label>
                    <input type="number" id="minCountInput" value="${minCount}" min="1" max="20" class="m-combo-input">
                    <span style="font-size:12px; color:#555;">个</span>

                    <label style="font-size:12px; color:#555; font-weight:bold; margin-left:5px;">Top 数量:</label>
                    <input type="number" id="topNInput" value="${validTopN}" min="1" max="${totalMax || 1}" class="m-combo-input" style="width:55px;">

                    <button id="searchTopBtn" class="m-combo-btn">查询</button>
                    <span style="font-size:11px; color:#888;">(当前上限:<strong style="color:#d9534f;">${totalMax}</strong>)</span>
                </div>
            </div>

            <p style="font-size:11px; color:#666; margin:0 0 10px 0; line-height:1.4;">
                门槛：单期满足 <strong>≥ ${minCount}个</strong> | 排序：<strong>组合维度数</strong> ＞ <strong>出现次数</strong> ＞ <strong>最多交集数</strong>
            </p>
    `;

    if (totalMax === 0) {
        html += `
            <div style="padding:15px; background:#fff3cd; border:1px solid #ffeeba; color:#856404; border-radius:6px; font-size:13px; text-align:center;">
                <strong>提示：</strong>历史交集中未找到通过组合筛选后交集数字个数 <strong>≥ ${minCount}</strong> 个的形态。
            </div></div>
        `;
        topContainer.innerHTML = html;
        bindEvents();
        return;
    }

    if (validTopN > totalMax) validTopN = totalMax;
    const displayList = currentComboList.slice(0, validTopN);

    html += `
            <div class="m-table-wrapper">
                <table border="1" borderColor="#e5e5e5" class="m-combo-table">
                    <thead>
                        <tr style="background-color: #f4f7fa;">
                            <th>排名</th>
                            <th style="text-align:left;">维度组合条件</th>
                            <th>维度数</th>
                            <th>出现次数</th>
                            <th>单期最多交集数</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    displayList.forEach((item, index) => {
        html += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td style="text-align:left; color:#1a0dab; font-weight:bold;">${item.comboStr}</td>
                <td style="background-color:#f0f7ff; color:#0056b3;"><strong>${item.comboSize} 维</strong></td>
                <td style="color:#d9534f;"><strong>${item.historyHitTimes}</strong></td>
                <td><strong>${item.maxMatchCount} 个</strong></td>
            </tr>
        `;
    });

    html += '</tbody></table></div></div>';
    topContainer.innerHTML = html;
    bindEvents();

    function bindEvents() {
        const doSearch = () => {
            const topVal = document.querySelector('#topNInput').value;
            const minVal = document.querySelector('#minCountInput').value;
            renderTopComboTable(topVal, minVal);
        };

        document.querySelector('#searchTopBtn').addEventListener('click', doSearch);
        document.querySelector('#topNInput').addEventListener('keyup', e => e.key === 'Enter' && doSearch());
        document.querySelector('#minCountInput').addEventListener('keyup', e => e.key === 'Enter' && doSearch());

        // 监听 14 个复选框点击事件
        const checkboxes = document.querySelectorAll('input[name="customIndicator"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', handleCheckboxChange);
        });

        // 重置按钮
        document.querySelector('#resetCheckboxBtn').addEventListener('click', () => {
            checkboxes.forEach(cb => cb.checked = false);
            handleCheckboxChange();
        });
    }
}

// 7. 处理复选框选中并渲染与 knownDataGroups 一致的详情结果表
function handleCheckboxChange() {
    const checked = Array.from(document.querySelectorAll('input[name="customIndicator"]:checked')).map(cb => cb.value);
    const resultBox = document.querySelector('#manualResultContainer');
    if (!resultBox) return;

    if (checked.length === 0) {
        resultBox.style.display = 'none';
        resultBox.innerHTML = '';
        return;
    }

    const manualData = calculateManualCustomSelection(checked);
    resultBox.style.display = 'block';

    let html = `
        <div style="font-size:13px; font-weight:bold; color:#0056b3; margin-bottom:8px;">
            📌 已选维度交集: <span style="color:#d9534f;">${checked.join(' + ')}</span> (共 ${checked.length} 个维度)
        </div>
        <div class="m-table-wrapper">
            <table border="1" borderColor="#e5e5e5" class="m-combo-table">
                <thead>
                    <tr style="background-color: #e9ecef;">
                        <th>期号</th>
                        <th>个数</th>
                        <th>交集数字（符合已选维度）</th>
                        <th>012路</th>
                        <th>奇偶</th>
                        <th>三区</th>
                        <th>质合</th>
                        <th>象限</th>
                    </tr>
                </thead>
                <tbody>
    `;

    manualData.forEach(row => {
        html += `
            <tr>
                <td><strong>${row.code}</strong></td>
                <td><strong style="color:#d9534f;">${row.count}</strong></td>
                <td style="text-align:left; padding-left:10px; color:#1a0dab; font-weight:bold;">
                    ${row.nums.length > 0 ? row.nums.join(', ') : '<span style="color:#aaa;">-</span>'}
                </td>
                <td>${row.rRatio}</td>
                <td>${row.oeRatio}</td>
                <td>${row.zRatio}</td>
                <td>${row.pcRatio}</td>
                <td>${row.qRatio}</td>
            </tr>
        `;
    });

    html += '</tbody></table></div>';
    resultBox.innerHTML = html;
}

// 8. 主渲染与统计流程
function renderStatTable() {
    const tbody = document.querySelector('#statResultTable tbody');
    if (!tbody || typeof rawDataArray === 'undefined') return;

    tbody.innerHTML = '';
    cachedIntersections = [];

    rawDataArray.forEach(item => {
        const code = item[0].slice(0, 3);
        const set2 = new Set(item[2]);
        const intersection = item[1].filter(num => set2.has(num));

        cachedIntersections.push(intersection);

        let r0 = 0, r1 = 0, r2 = 0;
        let odd = 0, even = 0;
        let z1 = 0, z2 = 0, z3 = 0;
        let prime = 0, composite = 0;
        let q1 = 0, q2 = 0, q3 = 0, q4 = 0;

        intersection.forEach(num => {
            if (num % 3 === 0) r0++;
            else if (num % 3 === 1) r1++;
            else r2++;

            num % 2 !== 0 ? odd++ : even++;

            if (num <= 29) z1++;
            else if (num <= 59) z2++;
            else z3++;

            checkPrime(num) ? prime++ : composite++;

            const q = checkQuadrant(num);
            if (q === 'Q1') q1++;
            else if (q === 'Q2') q2++;
            else if (q === 'Q3') q3++;
            else if (q === 'Q4') q4++;
        });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${code}</strong></td>
            <td><strong>${intersection.length}</strong></td>
            <td class="intersection-cell">${intersection.join(', ')}</td>
            <td>${r0}:${r1}:${r2}</td>
            <td>${odd}:${even}</td>
            <td>${z1}:${z2}:${z3}</td>
            <td>${prime}:${composite}</td>
            <td>${q1}:${q2}:${q3}:${q4}</td>
        `;
        tbody.appendChild(row);
    });

    renderTopComboTable(10, 5);
}

document.addEventListener('DOMContentLoaded', renderStatTable);