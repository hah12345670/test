// 使用自执行函数 (IIFE) 隔离作用域，防止全局变量污染
(function (global) {
    'use strict';

    // =========================================================================
    // 1. 基础判断工具函数 (局限于内部作用域)
    // =========================================================================
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

    function matchSingleIndicator(num, indicator) {
        switch (indicator) {
            case '0路': return num % 3 === 0;
            case '1路': return num % 3 === 1;
            case '2路': return num % 3 === 2;
            case '奇数': return num % 2 !== 0;
            case '偶数': return num % 2 === 0;
            case '一区': return num >= 1 && num <= 29;
            case '二区': return num >= 30 && num <= 59;
            case '三区': return num >= 60 && num <= 80;
            case '质数': return checkPrime(num);
            case '合数': return !checkPrime(num);
            case '象限一': return checkQuadrant(num) === 'Q1';
            case '象限二': return checkQuadrant(num) === 'Q2';
            case '象限三': return checkQuadrant(num) === 'Q3';
            case '象限四': return checkQuadrant(num) === 'Q4';
            default: return false;
        }
    }

    const ALL_INDICATORS = [
        '0路', '1路', '2路',
        '奇数', '偶数',
        '一区', '二区', '三区',
        '质数', '合数',
        '象限一', '象限二', '象限三', '象限四'
    ];

    const CATEGORY_MAP = {
        '012路': ['0路', '1路', '2路'],
        '奇偶': ['奇数', '偶数'],
        '三区': ['一区', '二区', '三区'],
        '质合': ['质数', '合数'],
        '象限': ['象限一', '象限二', '象限三', '象限四']
    };

    function matchMultiIndicators(num, selectedIndicators) {
        if (!selectedIndicators || selectedIndicators.length === 0) return false;

        const groupedSelections = {};
        selectedIndicators.forEach(ind => {
            for (const [catName, items] of Object.entries(CATEGORY_MAP)) {
                if (items.includes(ind)) {
                    if (!groupedSelections[catName]) {
                        groupedSelections[catName] = [];
                    }
                    groupedSelections[catName].push(ind);
                    break;
                }
            }
        });

        return Object.values(groupedSelections).every(groupItems => {
            return groupItems.some(ind => matchSingleIndicator(num, ind));
        });
    }

    // =========================================================================
    // 2. 生成 Top 榜单有效组合
    // =========================================================================
    function getValidComboSubsets(arr, minSize = 2, maxSize = 5) {
        const results = [];
        function hasRedundantFullGroup(combo) {
            for (const [catName, items] of Object.entries(CATEGORY_MAP)) {
                const groupSelectedCount = combo.filter(ind => items.includes(ind)).length;
                if (groupSelectedCount === items.length) return true;
            }
            return false;
        }

        function backtrack(start, current) {
            if (current.length >= minSize) {
                if (!hasRedundantFullGroup(current)) results.push([...current]);
            }
            if (current.length >= maxSize) return;

            for (let i = start; i < arr.length; i++) {
                current.push(arr[i]);
                backtrack(i + 1, current);
                current.pop();
            }
        }
        backtrack(0, []);
        return results;
    }

    function formatComboString(combo) {
        const groupedMap = {};
        combo.forEach(ind => {
            for (const [catName, items] of Object.entries(CATEGORY_MAP)) {
                if (items.includes(ind)) {
                    if (!groupedMap[catName]) groupedMap[catName] = [];
                    groupedMap[catName].push(ind);
                    break;
                }
            }
        });

        return Object.values(groupedMap)
            .map(group => group.length > 1 ? `(${group.join(' OR ')})` : group[0])
            .join(' + ');
    }

    let cachedIntersections = [];

    function calculateCombosByThreshold(minCount = 5) {
        const validCombos = getValidComboSubsets(ALL_INDICATORS, 2, 5);
        const comboStatsMap = new Map();

        cachedIntersections.forEach(intersection => {
            if (intersection.length < minCount) return;

            validCombos.forEach(combo => {
                const matchedNums = intersection.filter(num => matchMultiIndicators(num, combo));

                if (matchedNums.length >= minCount) {
                    const comboKey = combo.join(',');
                    if (!comboStatsMap.has(comboKey)) {
                        comboStatsMap.set(comboKey, {
                            comboStr: formatComboString(combo),
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

    // =========================================================================
    // 3. 手动复选框筛选计算逻辑
    // =========================================================================
    function calculateManualCustomSelection(selectedIndicators) {
        if (!selectedIndicators || selectedIndicators.length === 0) return [];

        const dataSource = (typeof knownDataGroups !== 'undefined' && knownDataGroups.length > 0)
            ? knownDataGroups
            : (typeof rawDataArray !== 'undefined' ? rawDataArray : []);

        const results = [];

        dataSource.forEach(item => {
            let periodCode = '';
            let intersection = [];

            if (Array.isArray(item)) {
                periodCode = item[0] ? String(item[0]).slice(0, 3) : '';
                if (item[1] && item[2]) {
                    const set2 = new Set(item[2]);
                    intersection = item[1].filter(num => set2.has(num));
                } else if (item[1]) {
                    intersection = item[1];
                }
            }

            const matchedNums = intersection.filter(num => matchMultiIndicators(num, selectedIndicators));

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

    // =========================================================================
    // 4. 渲染 UI 面板与交互绑定
    // =========================================================================
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
                📌 已选维度交集: <span style="color:#d9534f;">${formatComboString(checked)}</span> (共 ${checked.length} 项)
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

    function renderTopComboTable(topN = 10, minCount = 5) {
        let topContainer = document.querySelector('#topIndicatorContainer');
        if (!topContainer) {
            const targetTable = document.querySelector('#statResultTable');
            if (!targetTable) return;
            
            topContainer = document.createElement('div');
            topContainer.id = 'topIndicatorContainer';
            topContainer.style.marginBottom = '15px';
            
            let insertTarget = targetTable;
            if (targetTable.parentElement && targetTable.parentElement.tagName !== 'BODY') {
                insertTarget = targetTable.parentElement;
            }
            insertTarget.parentNode.insertBefore(topContainer, insertTarget);
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
                    width: 100%;
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
                }
                .m-table-wrapper {
                    width: 100%;
                    overflow-x: auto;
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
                <div style="font-size:14px; font-weight:bold; color:#333; margin-bottom:6px;">
                    🛠️ 自定义14维度交集筛选
                </div>
                <div class="m-checkbox-group" id="indicatorCheckboxGroup">
                    ${ALL_INDICATORS.map(ind => `
                        <label class="m-checkbox-item">
                            <input type="checkbox" name="customIndicator" value="${ind}"> ${ind}
                        </label>
                    `).join('')}
                    <button id="resetCheckboxBtn" style="margin-left:auto; font-size:12px; padding:2px 8px; cursor:pointer;">清空已选</button>
                </div>

                <div id="manualResultContainer" style="display:none; margin-bottom:15px; border-bottom:2px dashed #007bff; padding-bottom:12px;"></div>

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

            const searchBtn = document.querySelector('#searchTopBtn');
            if (searchBtn) searchBtn.addEventListener('click', doSearch);

            const checkboxes = document.querySelectorAll('input[name="customIndicator"]');
            checkboxes.forEach(cb => {
                cb.addEventListener('change', handleCheckboxChange);
            });

            const resetBtn = document.querySelector('#resetCheckboxBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    checkboxes.forEach(cb => cb.checked = false);
                    handleCheckboxChange();
                });
            }
        }
    }

    // =========================================================================
    // 5. 主渲染流程
    // =========================================================================
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

    // 安全的 DOM 绑定与对外暴露
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderStatTable);
        } else {
            renderStatTable();
        }
    }

    // 暴露为唯一的全局名 API，避免函数名互相覆盖
    global.IndicatorStatModule = {
        init: init,
        renderStatTable: renderStatTable,
        matchMultiIndicators: matchMultiIndicators,
        calculateManualCustomSelection: calculateManualCustomSelection
    };

    // 自动初始化
    init();

})(typeof window !== 'undefined' ? window : this);
