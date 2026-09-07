(function (global) {
    function calculateStats(history) {
        if (history.length === 0) return { avg: 0, variance: 0, stdDev: 0, cv: 0 };
        const avg = history.reduce((acc, val) => acc + val, 0) / history.length;
        let variance = 0;
        if (history.length > 1) {
            const squareDiffSum = history.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0);
            variance = squareDiffSum / (history.length - 1);
        }
        const stdDev = Math.sqrt(variance);
        const cv = avg > 0 ? stdDev / avg : 0;
        return { avg, variance, stdDev, cv };
    }

    function getZState(zScore) {
        if (zScore > 2.0) return '偏多';
        if (zScore > 1.0) return '略多';
        if (zScore < -1.5) return '偏少';
        if (zScore < -0.8) return '略少';
        return '正常';
    }

    function getStabilityState(cv) {
        if (cv < 0.5) return { text: '稳定', color: '#28a745' };
        if (cv <= 1.0) return { text: '正常', color: '#333' };
        return { text: '波动大', color: '#d9534f' };
    }

    const categoryDefinitions = [
        { id: 'rem0', name: '0路', check: n => n % 3 === 0 },
        { id: 'rem1', name: '1路', check: n => n % 3 === 1 },
        { id: 'rem2', name: '2路', check: n => n % 3 === 2 },
        { id: 'odd',  name: '奇数', check: n => n % 2 !== 0 },
        { id: 'even', name: '偶数', check: n => n % 2 === 0 },
        { id: 'sec1', name: '一区', check: n => n >= 1 && n <= 29 },
        { id: 'sec2', name: '二区', check: n => n >= 30 && n <= 59 },
        { id: 'sec3', name: '三区', check: n => n >= 60 && n <= 80 },
        { id: 'prime', name: '质数', check: n => {
            if (n <= 1) return false;
            for (let i = 2; i <= Math.sqrt(n); i++) {
                if (n % i === 0) return false;
            }
            return true;
        }},
        { id: 'composite', name: '合数', check: n => {
            if (n <= 1) return false;
            let isP = true;
            for (let i = 2; i <= Math.sqrt(n); i++) {
                if (n % i === 0) { isP = false; break; }
            }
            return !isP;
        }},
        { id: 'quad1', name: '象限一', check: n => (n >= 6 && n <= 10) || (n >= 16 && n <= 20) || (n >= 26 && n <= 30) || (n >= 36 && n <= 40) },
        { id: 'quad2', name: '象限二', check: n => (n >= 1 && n <= 5) || (n >= 11 && n <= 15) || (n >= 21 && n <= 25) || (n >= 31 && n <= 35) },
        { id: 'quad3', name: '象限三', check: n => (n >= 41 && n <= 45) || (n >= 51 && n <= 55) || (n >= 61 && n <= 65) || (n >= 71 && n <= 75) },
        { id: 'quad4', name: '象限四', check: n => (n >= 46 && n <= 50) || (n >= 56 && n <= 60) || (n >= 66 && n <= 70) || (n >= 76 && n <= 80) }
    ];

    let sortQueue1 = [];
    let selectedCategories1 = new Set(); 
    let styleInjected = false;

    function injectStyles() {
        if (styleInjected || document.getElementById('myIntervalStyle1')) return;
        const style = document.createElement('style');
        style.id = 'myIntervalStyle1';
        style.textContent = `
            #myIntervalContainer1 { width: 100%; max-width: 1200px; margin: 15px auto 0; box-sizing: border-box; height: auto !important; }
            #myIntervalContainer1 .stat-header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 14px; font-weight: bold; color: #333; background-color: #f8f9fa; padding: 8px 12px; border-radius: 6px; cursor: pointer; user-select: none; border: 1px solid #e9ecef; }
            #myIntervalContainer1 .stat-header-bar:hover { background-color: #eef2f7; }
            #myIntervalContainer1 .toggle-arrow { font-size: 12px; color: #666; transition: transform 0.3s ease; }
            #myIntervalContainer1 .table-toolbar { display: flex; justify-content: flex-end; margin-bottom: 6px; }
            #myIntervalContainer1 .reset-btn { font-size: 12px; padding: 3px 10px; background-color: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; color: #495057; }
            #myIntervalContainer1 .stat-table-wrapper { transition: max-height 0.3s ease; overflow: visible !important; max-height: none !important; height: auto !important; }
            #myIntervalContainer1 .stat-table-wrapper.collapsed { max-height: 0 !important; overflow: hidden !important; }
            #myIntervalContainer1 .stat-table-container { width: 100%; overflow-x: auto; overflow-y: visible; background-color: var(--card-bg, #fff); border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            #myIntervalContainer1 .stat-table { width: 100%; min-width: 980px; border-collapse: collapse; }
            #myIntervalContainer1 .sortable-th { cursor: pointer; user-select: none; }
            #myIntervalContainer1 .sortable-th:hover { background-color: #eceff1; }
            #myIntervalContainer1 .stat-row { cursor: pointer; }
            #myIntervalContainer1 .stat-row:hover { background-color: #f8f9fa; }
            #myIntervalContainer1 .stat-row.selected-row { background-color: #d1ecf1 !important; }
        `;
        document.head.appendChild(style);
        styleInjected = true;
    }

    function renderIntervalModule1(externalData) {
        const dataSource = externalData || (typeof rawDataArray !== 'undefined' ? rawDataArray : null);
        
        if (!dataSource || !Array.isArray(dataSource) || dataSource.length === 0) {
            return false; 
        }

        injectStyles();

        let container = document.getElementById('myIntervalContainer1');
        if (!container) {
            container = document.createElement('div');
            container.id = 'myIntervalContainer1';
            const existingStat = document.getElementById('myIntervalContainer');
            if (existingStat && existingStat.parentNode) {
                existingStat.parentNode.insertBefore(container, existingStat.nextSibling);
            } else {
                document.body.appendChild(container);
            }
        }

        const tableContainerElem = container.querySelector('.stat-table-container');
        const scrollLeft = tableContainerElem ? tableContainerElem.scrollLeft : 0;
        const scrollTop = tableContainerElem ? tableContainerElem.scrollTop : 0;
        const totalRows = dataSource.length;

        // 预处理缓存：提前计算每行的交集数据，避免在分类循环中重复进行昂贵的 Set 操作
        const rowIntersections = new Array(totalRows);
        for (let i = 0; i < totalRows; i++) {
            const row = dataSource[i];
            if (!row || !Array.isArray(row[1]) || !Array.isArray(row[2])) {
                rowIntersections[i] = [];
                continue;
            }
            const set2 = new Set(row[2].map(String));
            rowIntersections[i] = row[1].filter(n => set2.has(String(n))).map(Number);
        }

        const rawCategoryData = {};
        categoryDefinitions.forEach(cat => {
            const countsArr = new Array(totalRows);
            for (let i = 0; i < totalRows; i++) {
                countsArr[i] = rowIntersections[i].filter(n => cat.check(n)).length;
            }

            const historyCounts = [...countsArr].reverse();
            const { avg, variance, stdDev, cv } = calculateStats(countsArr);
            const latestCount = countsArr[0];
            const zScore = stdDev > 0 ? (latestCount - avg) / stdDev : 0;
            
            rawCategoryData[cat.id] = {
                cat, avg, variance, stdDev, cv,
                stability: getStabilityState(cv),
                zScore, zState: getZState(zScore),
                latestCount, historyCounts,
                currentCvs: avg > 0 ? (latestCount / avg) * cv : 0,
                cvsHistory: countsArr.map(cnt => avg > 0 ? (cnt / avg) * cv : 0)
            };
        });

        const stats = {};
        categoryDefinitions.forEach(cat => {
            const item = rawCategoryData[cat.id];
            const cvsStats = calculateStats(item.cvsHistory);
            const dynamicUpper = cvsStats.avg + 1.0 * cvsStats.stdDev;
            const dynamicLower = cvsStats.avg - 1.0 * cvsStats.stdDev;

            let cvsState = '常态', cvsColor = '#333';
            if (item.cvsHistory.length > 1 && cvsStats.stdDev > 0) {
                if (item.currentCvs > dynamicUpper) { cvsState = '偏高'; cvsColor = '#d9534f'; } 
                else if (item.currentCvs < dynamicLower) { cvsState = '偏低'; cvsColor = '#28a745'; }
            }

            let zWeight = Math.max(0, 1.5 - Math.abs(item.zScore)); 
            let stabilityWeight = Math.max(0.2, 1.8 - item.cv);    
            let avgWeight = Math.min(1.5, Math.max(0.5, item.avg / 5)); 
            let compositeScore = (zWeight * 45 + stabilityWeight * 35 + avgWeight * 20) * (Math.abs(item.zScore) > 2.0 ? 0.6 : 1.0);
            compositeScore = Math.min(100, Math.max(5, compositeScore));

            let scoreState = compositeScore >= 85 ? '极佳' : (compositeScore >= 72 ? '优质' : (compositeScore >= 60 ? '活跃' : '观望'));

            stats[cat.id] = {
                id: cat.id, name: cat.name,
                averageVal: item.avg, average: item.avg.toFixed(1),
                varianceVal: item.variance, variance: item.variance.toFixed(1),
                stabilityVal: item.cv, stabilityText: `${item.cv.toFixed(2)}(${item.stability.text})`, stabilityColor: item.stability.color,
                zScoreVal: item.zScore, zScoreFormatted: `${item.zScore > 0 ? '+' : ''}${item.zScore.toFixed(2)} (${item.zState})`,
                cvsVal: item.currentCvs, cvsFormatted: `${item.currentCvs.toFixed(2)} (${cvsState})`, cvsColor: cvsColor,
                scoreFormatted: `${compositeScore.toFixed(1)}分 (${scoreState})`, scoreVal: compositeScore, 
                rawZ: item.zScore, history: item.historyCounts
            };
        });

        let sortedCatIds = categoryDefinitions.map(c => c.id);
        if (sortQueue1.length > 0) {
            sortedCatIds.sort((a, b) => {
                for (let item of sortQueue1) {
                    let diff = item.order === 'asc' ? stats[a][item.field] - stats[b][item.field] : stats[b][item.field] - stats[a][item.field];
                    if (diff !== 0) return diff;
                }
                return 0;
            });
        }

        const tableRowsHTML = sortedCatIds.map((catId, index) => {
            const data = stats[catId];
            const zColor = data.rawZ > 1.5 ? '#d9534f' : (data.rawZ < -1.5 ? '#28a745' : '#333');
            const sColor = data.scoreVal >= 85 ? '#28a745' : (data.scoreVal >= 72 ? '#007bff' : '#333');
            const rowClass = selectedCategories1.has(catId) ? 'stat-row selected-row' : 'stat-row';

            return `
                <tr class="${rowClass}" data-id="${catId}" onclick="window.IntervalStatModule1._rowClickHandler('${catId}')">
                    <td style="padding: 6px 8px; text-align: center; color: #666; border-bottom: 1px solid #eee;">${index + 1}</td>
                    <td style="padding: 6px 8px; text-align: left; font-weight: bold; color: #007bff; border-bottom: 1px solid #eee; padding-left: 12px;">${data.name}</td>
                    <td style="padding: 6px 8px; text-align: center; color: #333; border-bottom: 1px solid #eee;">${data.average}</td>
                    <td style="padding: 6px 8px; text-align: center; color: #666; border-bottom: 1px solid #eee;">${data.variance}</td>
                    <td style="padding: 6px 8px; text-align: center; color: ${data.stabilityColor}; font-weight: bold; border-bottom: 1px solid #eee;">${data.stabilityText}</td>
                    <td style="padding: 6px 8px; text-align: center; color: ${zColor}; font-weight: bold; border-bottom: 1px solid #eee;">${data.zScoreFormatted}</td>
                    <td style="padding: 6px 8px; text-align: center; color: ${data.cvsColor}; font-weight: bold; border-bottom: 1px solid #eee;">${data.cvsFormatted}</td>
                    <td style="padding: 6px 8px; text-align: center; color: ${sColor}; font-weight: bold; border-bottom: 1px solid #eee;">${data.scoreFormatted}</td>
                    <td style="padding: 6px 8px; text-align: left; color: #555; font-size: 11px; border-bottom: 1px solid #eee; word-break: break-all; white-space: normal;" title="${data.history.join(', ')}">${data.history.length > 0 ? data.history.join(', ') : '暂无历史'}</td>
                </tr>
            `;
        }).join('');

        const getArrow = (field) => {
            const index = sortQueue1.findIndex(item => item.field === field);
            if (index === -1) return '<span style="color: #ccc; font-size: 10px; margin-left: 3px;">↕</span>';
            const arrowSymbol = sortQueue1[index].order === 'asc' ? '▲' : '▼';
            const priorityTag = sortQueue1.length > 1 ? `<sub style="font-size:8px; color:#007bff; font-weight:bold;">#${index + 1}</sub>` : '';
            return `<span style="color: #007bff; font-size: 10px; margin-left: 3px;">${arrowSymbol}</span>${priorityTag}`;
        };

        const existingWrapper = document.getElementById('intervalTableWrapper1');
        const isCollapsed = existingWrapper ? existingWrapper.classList.contains('collapsed') : true;

        container.innerHTML = `
            <div class="stat-header-bar" onclick="
                const wrapper = document.getElementById('intervalTableWrapper1');
                const arrow = document.getElementById('toggleArrow1');
                wrapper.classList.toggle('collapsed');
                arrow.style.transform = wrapper.classList.contains('collapsed') ? 'rotate(0deg)' : 'rotate(90deg)';
            ">
                <span>🧊 多维度特征统计</span>
                <span class="toggle-arrow" id="toggleArrow1" style="transform: rotate(${isCollapsed ? '0deg' : '90deg'});">▶</span>
            </div>
            <div class="stat-table-wrapper ${isCollapsed ? 'collapsed' : ''}" id="intervalTableWrapper1">
                <div class="table-toolbar">
                    <button class="reset-btn" onclick="window.IntervalStatModule1.resetDefault();">↺ 重置</button>
                </div>
                <div class="stat-table-container">
                    <table class="stat-table">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="width: 5%; text-align: center;">序号</th>
                                <th style="width: 8%; text-align: left; padding-left: 12px;">特征维度</th>
                                <th class="sortable-th" style="width: 8%; text-align: center;" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('averageVal');">平均个数 ${getArrow('averageVal')}</th>
                                <th class="sortable-th" style="width: 8%; text-align: center;" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('varianceVal');">样本方差 ${getArrow('varianceVal')}</th>
                                <th class="sortable-th" style="width: 12%; text-align: center;" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('stabilityVal');">
                                    稳定性<br><span style="font-size: 10px; font-weight: normal; color: #666;">(&lt;0.5稳 0.5-1.0常 &gt;1.0大)<br>CV = 标准差 / 均值<br><b style="color:#28a745;">最优: 稳定 (&lt;0.5)</b></span> ${getArrow('stabilityVal')}
                                </th>
                                <th class="sortable-th" style="width: 13%; text-align: center;" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('zScoreVal');">
                                    偏移(Z)<br><span style="font-size: 10px; font-weight: normal; color: #666;">(&lt;-1.5少 -1.5~-0.8略少 常 1.0~2.0略多 &gt;2.0多)<br>Z = (最新 - 均值) / 标准差<br><b style="color:#28a745;">最优: 正常 (Z接近0)</b></span> ${getArrow('zScoreVal')}
                                </th>
                                <th class="sortable-th" style="width: 13%; text-align: center;" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('cvsVal');">
                                    综合动量(CVS)<br><span style="font-size: 10px; font-weight: normal; color: #666;">(动态阈值: 均值±1.0σ)<br>CVS = (最新 / 均值) × CV<br><b style="color:#28a745;">最优: 偏高 (&gt; 均值+1.0σ)</b></span> ${getArrow('cvsVal')}
                                </th>
                                <th class="sortable-th" style="width: 12%; text-align: center;" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('scoreVal');">
                                    评分(CS)<br><span style="font-size: 10px; font-weight: normal; color: #666;">(&lt;60观望 60活 72优 85极)<br>CS = 综合加权 × 惩罚系数<br><b style="color:#28a745;">最优: 极佳 (≥85分)</b></span> ${getArrow('scoreVal')}
                                </th>
                                <th style="width: 21%; text-align: left;">历史个数</th>
                            </tr>
                        </thead>
                        <tbody>${tableRowsHTML}</tbody>
                    </table>
                </div>
            </div>
        `;

        const newTableContainerElem = container.querySelector('.stat-table-container');
        if (newTableContainerElem) {
            newTableContainerElem.scrollLeft = scrollLeft;
            newTableContainerElem.scrollTop = scrollTop;
        }
        return true;
    }

    function initModule() {
        if (renderIntervalModule1()) return;
        let retryCount = 0;
        const safeTimer = setInterval(() => {
            retryCount++;
            if (renderIntervalModule1() || retryCount >= 100) clearInterval(safeTimer);
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModule);
    } else {
        initModule();
    }

    global.IntervalStatModule1 = {
        render: function(externalData) {
            if (this._sortQueue !== undefined) sortQueue1 = this._sortQueue;
            return renderIntervalModule1(externalData);
        },
        _sortClickHandler: function(field) {
            const existingIndex = sortQueue1.findIndex(item => item.field === field);
            if (existingIndex !== -1) {
                if (sortQueue1[existingIndex].order === 'desc') sortQueue1[existingIndex].order = 'asc';
                else sortQueue1.splice(existingIndex, 1);
            } else {
                sortQueue1.push({ field: field, order: 'desc' });
            }
            this._sortQueue = sortQueue1;
            this.render();
        },
        _rowClickHandler: function(catId) {
            selectedCategories1.has(catId) ? selectedCategories1.delete(catId) : selectedCategories1.add(catId);
            this.render();
        },
        resetDefault: function() {
            sortQueue1 = [];
            this._sortQueue = [];
            selectedCategories1.clear();
            this.render();
        },
        clearSelected: function() {
            selectedCategories1.clear();
            this.render();
        },
        getSelectedCategories: function() {
            return Array.from(selectedCategories1);
        },
        copySelected: function() {
            const arr = Array.from(selectedCategories1).map(id => {
                const found = categoryDefinitions.find(c => c.id === id);
                return found ? found.name : id;
            });
            if (arr.length === 0) return;
            navigator.clipboard.writeText(arr.join(', ')).then(() => {
                alert(`已成功复制 ${arr.length} 个特征维度：\n${arr.join(', ')}`);
            });
        },
        _sortQueue: []
    };

})(window);