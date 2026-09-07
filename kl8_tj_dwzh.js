(function (global) {
    'use strict';

    // =========================================================================
    // 0. 动态注入全局 CSS（彻底禁掉浏览器的 Scroll Anchoring 自动跳转算法）
    // =========================================================================
    (function injectAntiJumpStyle() {
        if (document.getElementById('m-anti-jump-style')) return;
        const style = document.createElement('style');
        style.id = 'm-anti-jump-style';
        style.textContent = `
            html, body, div, section, article, table {
                overflow-anchor: none !important; /* 核心：禁止浏览器在 DOM 高度突变时自动矫正滚动位置 */
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    })();

    // =========================================================================
    // 1. 基础配置与判断工具函数
    // =========================================================================
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

    const INDICATOR_TO_CAT = new Map();
    Object.entries(CATEGORY_MAP).forEach(([catName, items]) => {
        items.forEach(ind => INDICATOR_TO_CAT.set(ind, catName));
    });

    const checkPrime = num => {
        if (num < 2) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
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

    function matchMultiIndicators(num, selectedIndicators) {
        if (!selectedIndicators || selectedIndicators.length === 0) return false;

        const groupedSelections = {};
        selectedIndicators.forEach(ind => {
            const catName = INDICATOR_TO_CAT.get(ind);
            if (catName) {
                if (!groupedSelections[catName]) groupedSelections[catName] = [];
                groupedSelections[catName].push(ind);
            }
        });

        return Object.values(groupedSelections).every(groupItems => 
            groupItems.some(ind => matchSingleIndicator(num, ind))
        );
    }

    function calculateNumberStats(numbers) {
        let r0 = 0, r1 = 0, r2 = 0;
        let odd = 0, even = 0;
        let z1 = 0, z2 = 0, z3 = 0;
        let prime = 0, composite = 0;
        let q1 = 0, q2 = 0, q3 = 0, q4 = 0;

        numbers.forEach(num => {
            const mod3 = num % 3;
            if (mod3 === 0) r0++;
            else if (mod3 === 1) r1++;
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

        return {
            rRatio: `${r0}:${r1}:${r2}`,
            oeRatio: `${odd}:${even}`,
            zRatio: `${z1}:${z2}:${z3}`,
            pcRatio: `${prime}:${composite}`,
            qRatio: `${q1}:${q2}:${q3}:${q4}`
        };
    }

    // =========================================================================
    // 2. 生成 Top 榜单有效组合与缓存
    // =========================================================================
    let cachedValidCombos = null;

    function getValidComboSubsets(arr, minSize = 2, maxSize = ALL_INDICATORS.length) {
        if (cachedValidCombos) return cachedValidCombos;

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
        cachedValidCombos = results;
        return results;
    }

    function formatComboString(combo) {
        const groupedMap = {};
        combo.forEach(ind => {
            const catName = INDICATOR_TO_CAT.get(ind);
            if (catName) {
                if (!groupedMap[catName]) groupedMap[catName] = [];
                groupedMap[catName].push(ind);
            }
        });

        return Object.values(groupedMap)
            .map(group => group.length > 1 ? `(${group.join(' OR ')})` : group[0])
            .join(' + ');
    }

    let cachedIntersections = [];

    // 计算指定门槛下的数据组合
    function calculateCombosByThreshold(minCount = 5, minHits = 7, orderParam = 'desc') {
        const validCombos = getValidComboSubsets(ALL_INDICATORS, 2, ALL_INDICATORS.length);
        const comboStatsMap = new Map();

        cachedIntersections.forEach(intersection => {
            if (intersection.length < minCount) return;

            validCombos.forEach(combo => {
                const matchedNums = intersection.filter(num => matchMultiIndicators(num, combo));

                if (matchedNums.length >= minCount) {
                    const comboKey = combo.join(',');
                    if (!comboStatsMap.has(comboKey)) {
                        const groupSet = new Set(combo.map(ind => INDICATOR_TO_CAT.get(ind)).filter(Boolean));
                        comboStatsMap.set(comboKey, {
                            comboStr: formatComboString(combo),
                            groupCount: groupSet.size, // 组合组数
                            comboSize: combo.length,   // 维度总数
                            historyHitTimes: 0,        // 出现次数
                            maxMatchCount: matchedNums.length // 单期最多交集数
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

        // 根据 minHits (出现次数门槛) 进行过滤
        const comboList = Array.from(comboStatsMap.values()).filter(item => item.historyHitTimes >= minHits);

        // 排序规则
        comboList.sort((a, b) => {
            if (b.groupCount !== a.groupCount) return b.groupCount - a.groupCount;
            if (b.historyHitTimes !== a.historyHitTimes) return b.historyHitTimes - a.historyHitTimes;
            if (a.comboSize !== b.comboSize) return a.comboSize - b.comboSize;
            return b.maxMatchCount - a.maxMatchCount;
        });

        comboList.forEach((item, idx) => {
            item.originalRank = idx + 1;
        });

        if (orderParam === 'asc') {
            comboList.reverse();
        }

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

        return dataSource.map(item => {
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
            const stats = calculateNumberStats(matchedNums);

            return {
                code: periodCode,
                count: matchedNums.length,
                nums: matchedNums,
                ...stats
            };
        });
    }

    // =========================================================================
    // 4. UI 面板渲染及抗抖动锁定机制
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

    let currentSortOrder = 'desc';

    function updateTopTableOnly(topN, minCount, minHits, sortOrder) {
        currentSortOrder = sortOrder;
        const tbody = document.querySelector('#topComboTableBody');
        const maxSpan = document.querySelector('#maxLimitSpan');
        if (!tbody) return;

        const currentComboList = calculateCombosByThreshold(minCount, minHits, currentSortOrder);
        const totalMax = currentComboList.length;

        if (maxSpan) maxSpan.textContent = totalMax;

        let validTopN = parseInt(topN, 10);
        if (isNaN(validTopN) || validTopN < 1) validTopN = 10;
        if (validTopN > totalMax) validTopN = totalMax;

        const displayList = currentComboList.slice(0, validTopN);

        if (displayList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="padding:15px; color:#856404; background:#fff3cd;">未找到符合条件的数据</td></tr>`;
            return;
        }

        let html = '';
        displayList.forEach((item) => {
            html += `
                <tr>
                    <td><strong>${item.originalRank}</strong></td>
                    <td style="text-align:left; color:#1a0dab; font-weight:bold;">${item.comboStr}</td>
                    <td style="background-color:#f0f7ff; color:#0056b3;"><strong>${item.comboSize} 维 (${item.groupCount} 组)</strong></td>
                    <td style="color:#d9534f;"><strong>${item.historyHitTimes}</strong></td>
                    <td><strong>${item.maxMatchCount} 个</strong></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    function renderTopComboTable(topN = 10, minCount = 5, minHits = 7, sortOrder = currentSortOrder) {
        currentSortOrder = sortOrder;

        // 计算动态最大历史期数上限
        const dynamicMaxHits = cachedIntersections.length || 999;

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
        } else {
            // 如果已存在容器，同步更新 max 属性
            const minHitsInput = document.querySelector('#minHitsInput');
            if (minHitsInput) minHitsInput.setAttribute('max', dynamicMaxHits);
            updateTopTableOnly(topN, minCount, minHits, sortOrder);
            return;
        }

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
                .m-fold-box { 
                    border: 1px solid #e9ecef; 
                    border-radius: 6px; 
                    margin-bottom: 10px; 
                    background: #fff; 
                    overflow: hidden;
                }
                .m-fold-header { 
                    font-size: 14px; 
                    font-weight: bold; 
                    color: #333; 
                    padding: 10px 12px; 
                    background: #f8f9fa; 
                    cursor: pointer; 
                    user-select: none; 
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .m-fold-header:hover { background: #eef2f7; }
                .m-fold-body { 
                    display: none; 
                    padding: 10px; 
                }
                .m-fold-icon {
                    font-size: 12px;
                    transition: transform 0.2s ease;
                }
                .m-checkbox-group { display: flex; flex-wrap: wrap; gap: 8px 12px; padding: 10px; background: #f8f9fa; border-radius: 6px; margin-bottom: 12px; border: 1px solid #e9ecef; }
                .m-checkbox-item { display: inline-flex; align-items: center; font-size: 13px; color: #333; cursor: pointer; }
                .m-checkbox-item input { margin-right: 4px; cursor: pointer; }
                .m-combo-header { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
                .m-combo-search { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
                .m-combo-input { width: 45px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; text-align: center; font-size: 13px; }
                .m-combo-btn { padding: 5px 12px; background: #007bff; color: #fff; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; }
                .m-order-toggle-btn { padding: 5px 10px; background: #6c757d; color: #fff; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
                .m-order-toggle-btn:hover { background: #5a6268; }
                .m-table-wrapper { width: 100%; overflow-x: auto; border-radius: 4px; }
                .m-combo-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 12px; white-space: nowrap; }
                .m-combo-table th, .m-combo-table td { padding: 8px 6px; }
                @media (min-width: 600px) {
                    .m-combo-header { flex-direction: row; justify-content: space-between; align-items: center; }
                    .m-combo-table { font-size: 13px; }
                    .m-combo-table th, .m-combo-table td { padding: 8px 10px; }
                }
            </style>

            <div class="m-combo-card">
                <!-- 自定义折叠面板 1 -->
                <div class="m-fold-box">
                    <div class="m-fold-header" id="foldHeader1">
                        <span>🛠️ 多维度交集筛选</span>
                        <span class="m-fold-icon" id="foldIcon1">▶</span>
                    </div>
                    <div class="m-fold-body" id="foldBody1">
                        <div class="m-checkbox-group" id="indicatorCheckboxGroup">
                            ${ALL_INDICATORS.map(ind => `
                                <label class="m-checkbox-item">
                                    <input type="checkbox" name="customIndicator" value="${ind}"> ${ind}
                                </label>
                            `).join('')}
                            <button id="resetCheckboxBtn" type="button" style="margin-left:auto; font-size:12px; padding:2px 8px; cursor:pointer;">清空已选</button>
                        </div>
                        <div id="manualResultContainer" style="display:none; margin-bottom:15px; border-bottom:2px dashed #007bff; padding-bottom:12px;"></div>
                    </div>
                </div>

                <!-- 自定义折叠面板 2 -->
                <div class="m-fold-box">
                    <div class="m-fold-header" id="foldHeader2">
                        <span>🔥 全历史交集【多维组合】</span>
                        <span class="m-fold-icon" id="foldIcon2">▶</span>
                    </div>
                    <div class="m-fold-body" id="foldBody2">
                        <div class="m-combo-header">
                            <div class="m-combo-search">
                                <label style="font-size:12px; color:#555; font-weight:bold;">数字门槛 >=</label>
                                <input type="number" id="minCountInput" value="${minCount}" min="1" max="20" class="m-combo-input">
                                <span style="font-size:12px; color:#555;">个</span>

                                <label style="font-size:12px; color:#555; font-weight:bold; margin-left:5px;">出现次数 >=</label>
                                <!-- max 动态绑定当前历史总期数 dynamicMaxHits -->
                                <input type="number" id="minHitsInput" value="${minHits}" min="1" max="${dynamicMaxHits}" class="m-combo-input">
                                <span style="font-size:12px; color:#555;">次</span>

                                <label style="font-size:12px; color:#555; font-weight:bold; margin-left:5px;">Top 数量:</label>
                                <input type="number" id="topNInput" value="${topN}" min="1" max="999" class="m-combo-input" style="width:50px;">

                                <button id="toggleSortOrderBtn" type="button" class="m-order-toggle-btn">
                                    排序: <span id="sortTextSpan">${currentSortOrder === 'desc' ? '高到低 ↓' : '低到高 ↑'}</span>
                                </button>

                                <button id="searchTopBtn" type="button" class="m-combo-btn">查询</button>
                                <span style="font-size:11px; color:#888;">(当前上限:<strong id="maxLimitSpan" style="color:#d9534f;">-</strong>)</span>
                            </div>
                        </div>

                        <p style="font-size:11px; color:#666; margin:0 0 10px 0; line-height:1.4;">
                            门槛：单期满足 <strong>≥ ${minCount}个</strong> | 出现次数 <strong>≥ ${minHits}次</strong> | 排序：<strong>组合组数</strong> ＞ <strong>出现次数</strong> ＞ <strong>维度总数(升序)</strong> ＞ <strong>最多交集数</strong>
                        </p>

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
                                <tbody id="topComboTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>`;

        topContainer.innerHTML = html;
        updateTopTableOnly(topN, minCount, minHits, currentSortOrder);
        bindEvents();

        function bindEvents() {
            // 折叠逻辑
            const setupFold = (headerId, bodyId, iconId) => {
                const header = document.querySelector(headerId);
                const body = document.querySelector(bodyId);
                const icon = document.querySelector(iconId);
                
                if (header && body) {
                    let isFirstOpen = true;

                    header.onclick = function (e) {
                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }

                        const targetY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                        const isHidden = body.style.display === '' || body.style.display === 'none';

                        if (isHidden) {
                            body.style.display = 'block';
                            if (icon) icon.textContent = '▼';

                            if (isFirstOpen) {
                                requestAnimationFrame(() => {
                                    window.scrollTo(0, targetY);
                                    setTimeout(() => {
                                        window.scrollTo(0, targetY);
                                        isFirstOpen = false;
                                    }, 0);
                                });
                            } else {
                                window.scrollTo(0, targetY);
                            }
                        } else {
                            body.style.display = 'none';
                            if (icon) icon.textContent = '▶';
                            window.scrollTo(0, targetY);
                        }

                        return false;
                    };
                }
            };

            setupFold('#foldHeader1', '#foldBody1', '#foldIcon1');
            setupFold('#foldHeader2', '#foldBody2', '#foldIcon2');

            const doSearch = (overrideOrder) => {
                const topVal = document.querySelector('#topNInput').value;
                const minVal = document.querySelector('#minCountInput').value;
                const hitsVal = document.querySelector('#minHitsInput').value;
                const order = overrideOrder !== undefined ? overrideOrder : currentSortOrder;
                
                const span = document.querySelector('#sortTextSpan');
                if (span) span.textContent = order === 'desc' ? '高到低 ↓' : '低到高 ↑';

                updateTopTableOnly(topVal, minVal, hitsVal, order);
            };

            const searchBtn = document.querySelector('#searchTopBtn');
            if (searchBtn) {
                searchBtn.onclick = (e) => {
                    if (e) e.preventDefault();
                    doSearch();
                };
            }

            const toggleOrderBtn = document.querySelector('#toggleSortOrderBtn');
            if (toggleOrderBtn) {
                toggleOrderBtn.onclick = (e) => {
                    if (e) e.preventDefault();
                    const nextOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
                    doSearch(nextOrder);
                };
            }

            const checkboxes = document.querySelectorAll('input[name="customIndicator"]');
            checkboxes.forEach(cb => {
                cb.onchange = handleCheckboxChange;
            });

            const resetBtn = document.querySelector('#resetCheckboxBtn');
            if (resetBtn) {
                resetBtn.onclick = (e) => {
                    if (e) e.preventDefault();
                    checkboxes.forEach(cb => cb.checked = false);
                    handleCheckboxChange();
                };
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

        const fragment = document.createDocumentFragment();

        rawDataArray.forEach(item => {
            const code = item[0].slice(0, 3);
            const set2 = new Set(item[2]);
            const intersection = item[1].filter(num => set2.has(num));

            cachedIntersections.push(intersection);

            const stats = calculateNumberStats(intersection);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${code}</strong></td>
                <td><strong>${intersection.length}</strong></td>
                <td class="intersection-cell">${intersection.join(', ')}</td>
                <td>${stats.rRatio}</td>
                <td>${stats.oeRatio}</td>
                <td>${stats.zRatio}</td>
                <td>${stats.pcRatio}</td>
                <td>${stats.qRatio}</td>
            `;
            fragment.appendChild(row);
        });

        tbody.appendChild(fragment);

        renderTopComboTable(10, 5, 7, currentSortOrder);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderStatTable);
        } else {
            renderStatTable();
        }
    }

    global.IndicatorStatModule = {
        init,
        renderStatTable,
        matchMultiIndicators,
        calculateManualCustomSelection
    };

    init();

})(typeof window !== 'undefined' ? window : this);