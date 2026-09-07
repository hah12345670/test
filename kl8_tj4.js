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
        if (zScore > 2.0) return '极冷';
        if (zScore > 1.0) return '偏冷';
        if (zScore < -1.5) return '极热';
        if (zScore < -0.8) return '偏热';
        return '正常';
    }

    function getStabilityState(cv) {
        if (cv < 0.8) return { text: '稳定', color: '#28a745' };
        if (cv <= 1.5) return { text: '正常', color: '#333' };
        return { text: '剧烈', color: '#d9534f' };
    }

    let sortQueue1 = [];
    let selectedNums1 = new Set(); 

    function renderIntervalModule1(externalData) {
        const dataSource = externalData || (typeof rawDataArray !== 'undefined' ? rawDataArray : null);
        
        if (!dataSource || !Array.isArray(dataSource) || dataSource.length === 0) {
            return false; 
        }

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

        const targetNums = Array.from({ length: 80 }, (_, i) => String(i + 1).padStart(2, '0'));
        const hitIndicesMap = {};
        targetNums.forEach(num => hitIndicesMap[num] = []);

        const totalRows = dataSource.length;
        for (let i = 0; i < totalRows; i++) {
            const row = dataSource[i];
            if (!row || !Array.isArray(row[1])) continue;
            row[1].forEach(n => {
                const numStr = String(n).padStart(2, '0');
                if (hitIndicesMap[numStr]) {
                    hitIndicesMap[numStr].push(i);
                }
            });
        }

        const stats = {};
        targetNums.forEach(num => {
            const hitIndices = hitIndicesMap[num];
            let currentInterval = 0;
            let rawIntervals = [];

            if (hitIndices.length > 0) {
                currentInterval = hitIndices[0];
                for (let j = 0; j < hitIndices.length - 1; j++) {
                    rawIntervals.push(hitIndices[j + 1] - hitIndices[j] - 1);
                }
                const tailInterval = (totalRows - 1) - hitIndices[hitIndices.length - 1];
                if (tailInterval > 0) {
                    rawIntervals.push(tailInterval);
                }
                rawIntervals.reverse();
                rawIntervals.push(currentInterval);
            } else {
                currentInterval = totalRows;
                rawIntervals.push(currentInterval);
            }

            const { avg, variance, stdDev, cv } = calculateStats(rawIntervals);
            const zScore = stdDev > 0 ? (currentInterval - avg) / stdDev : 0;
            const zState = getZState(zScore);
            const stability = getStabilityState(cv);

            const cvs = avg > 0 ? (currentInterval / avg) * cv : 0;
            let cvsState = '常态';
            let cvsColor = '#333';
            if (cvs > 1.8) {
                cvsState = '爆发临界';
                cvsColor = '#d9534f';
            } else if (cvs < 0.4) {
                cvsState = '持续活跃';
                cvsColor = '#28a745';
            }

            let zWeight = Math.max(0, 1.5 - Math.abs(zScore)); 
            let stabilityWeight = Math.max(0.2, 1.8 - cv);    
            let avgWeight = Math.min(1.5, Math.max(0.5, avg / 25)); 
            let penalty = Math.abs(zScore) > 1.5 ? 0.6 : 1.0; 
            let compositeScore = (zWeight * 45 + stabilityWeight * 35 + avgWeight * 20) * penalty;
            if (currentInterval === 0) compositeScore += 10; 

            compositeScore = Math.min(100, Math.max(5, compositeScore));

            let scoreState = '观望';
            if (compositeScore >= 82) {
                scoreState = '极佳'; 
            } else if (compositeScore >= 68) {
                scoreState = '优质'; 
            } else if (compositeScore >= 50) {
                scoreState = '活跃'; 
            }

            stats[num] = {
                num: num,
                current: currentInterval,
                averageVal: avg,
                average: avg.toFixed(1),
                varianceVal: variance,
                variance: variance.toFixed(1),
                stabilityVal: cv, 
                stabilityText: `${cv.toFixed(2)}(${stability.text})`,
                stabilityColor: stability.color,
                zScoreVal: zScore,
                zScoreFormatted: `${zScore > 0 ? '+' : ''}${zScore.toFixed(2)} (${zState})`,
                cvsVal: cvs,
                cvsFormatted: `${cvs.toFixed(2)} (${cvsState})`,
                cvsColor: cvsColor,
                scoreFormatted: `${compositeScore.toFixed(1)}分 (${scoreState})`,
                scoreVal: compositeScore, 
                rawZ: zScore,
                history: rawIntervals
            };
        });

        let sortedNums = [...targetNums];
        if (sortQueue1.length > 0) {
            sortedNums.sort((a, b) => {
                for (let item of sortQueue1) {
                    let valA = stats[a][item.field];
                    let valB = stats[b][item.field];
                    let diff = item.order === 'asc' ? valA - valB : valB - valA;
                    if (diff !== 0) {
                        return diff;
                    }
                }
                return 0;
            });
        }

        const tableRowsHTML = sortedNums.map((num, index) => {
            const data = stats[num];
            const cur = data.current;
            const curText = `${cur}`;
            const curColor = cur === 0 ? 'color: #28a745; font-weight: bold;' : (cur <= 3 ? 'color: #d9534f; font-weight: bold;' : 'color: #333;');
            const historyText = data.history.length > 0 ? data.history.join(', ') : '暂无更多历史';
            const zVal = data.rawZ;
            const zScoreColor = zVal > 1.5 ? 'color: #d9534f; font-weight: bold;' : (zVal < -1.5 ? 'color: #28a745; font-weight: bold;' : 'color: #333;');
            const scoreColorStyle = data.scoreVal >= 82 ? 'color: #28a745; font-weight: bold;' : (data.scoreVal >= 68 ? 'color: #007bff; font-weight: bold;' : 'color: #333;');
            
            const isSelected = selectedNums1.has(num);
            const rowClass = isSelected ? 'stat-row selected-row' : 'stat-row';

            return `
                <tr class="${rowClass}" data-num="${num}" onclick="window.IntervalStatModule1._rowClickHandler('${num}')">
                    <td style="padding: 6px 8px; text-align: center; color: #666; border-bottom: 1px solid #eee;">${index + 1}</td>
                    <td style="padding: 6px 8px; text-align: center; font-weight: bold; color: #007bff; border-bottom: 1px solid #eee;">${num}</td>
                    <td style="padding: 6px 8px; text-align: center; ${curColor} border-bottom: 1px solid #eee;">${curText}</td>
                    <td style="padding: 6px 8px; text-align: center; color: #333; border-bottom: 1px solid #eee;">${data.average}</td>
                    <td style="padding: 6px 8px; text-align: center; color: #666; border-bottom: 1px solid #eee;">${data.variance}</td>
                    <td style="padding: 6px 8px; text-align: center; color: ${data.stabilityColor}; font-weight: bold; border-bottom: 1px solid #eee;">${data.stabilityText}</td>
                    <td style="padding: 6px 8px; text-align: center; ${zScoreColor} font-weight: bold; border-bottom: 1px solid #eee;">${data.zScoreFormatted}</td>
                    <td style="padding: 6px 8px; text-align: center; color: ${data.cvsColor}; font-weight: bold; border-bottom: 1px solid #eee;">${data.cvsFormatted}</td>
                    <td style="padding: 6px 8px; text-align: center; ${scoreColorStyle} border-bottom: 1px solid #eee;">${data.scoreFormatted}</td>
                    <td style="padding: 6px 8px; text-align: left; color: #555; font-size: 11px; border-bottom: 1px solid #eee; word-break: break-all; white-space: normal;" title="${data.history.join(', ')}">${historyText}</td>
                </tr>
            `;
        }).join('');

        const getArrow = (field) => {
            const index = sortQueue1.findIndex(item => item.field === field);
            if (index === -1) {
                return '<span style="color: #ccc; font-size: 10px; margin-left: 3px;">↕</span>';
            }
            const item = sortQueue1[index];
            const arrowSymbol = item.order === 'asc' ? '▲' : '▼';
            const priorityTag = sortQueue1.length > 1 ? `<sub style="font-size:8px; color:#007bff; font-weight:bold;">#${index + 1}</sub>` : '';
            return `<span style="color: #007bff; font-size: 10px; margin-left: 3px;">${arrowSymbol}</span>${priorityTag}`;
        };

        const existingWrapper = document.getElementById('intervalTableWrapper1');
        const isCurrentlyCollapsed = existingWrapper ? existingWrapper.classList.contains('collapsed') : true;

        const selectedCount = selectedNums1.size;
        const selectedArr = Array.from(selectedNums1).sort();
        const actionToolbarHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #eef2f7; padding: 6px 12px; border-radius: 4px; margin-bottom: 8px; font-size: 12px;">
                <div>
                    <span>容器1已选 (<strong style="color: #d9534f;">${selectedCount}</strong>个): </span>
                    <span style="color: #333; font-family: monospace;">${selectedCount > 0 ? selectedArr.join(', ') : '暂无勾选'}</span>
                </div>
                <div>
                    <button class="reset-btn" style="background:#d9534f; color:#fff; border:none;" onclick="window.IntervalStatModule1.copySelected();" ${selectedCount === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>📋 复制选中</button>
                    <button class="reset-btn" onclick="window.IntervalStatModule1.clearSelected();">☒ 清空选择</button>
                </div>
            </div>
        `;

        container.innerHTML = `
            <style>
                #myIntervalContainer1 {
                    width: 100%;
                    max-width: 1200px;
                    margin: 15px auto 0 auto;
                    box-sizing: border-box;
                    height: auto !important;
                }
                #myIntervalContainer1 .stat-header-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                    background-color: #e9ecef;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    user-select: none;
                    border: 1px solid #ced4da;
                }
                #myIntervalContainer1 .stat-header-bar:hover {
                    background-color: #dee2e6;
                }
                #myIntervalContainer1 .toggle-arrow {
                    font-size: 12px;
                    color: #666;
                    transition: transform 0.3s ease;
                }
                #myIntervalContainer1 .table-toolbar {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 6px;
                }
                #myIntervalContainer1 .reset-btn {
                    font-size: 12px;
                    padding: 3px 10px;
                    background-color: #fff;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    cursor: pointer;
                    color: #495057;
                }
                #myIntervalContainer1 .stat-table-wrapper {
                    transition: max-height 0.3s ease;
                    overflow: visible !important; 
                    max-height: none !important;  
                    height: auto !important;
                }
                #myIntervalContainer1 .stat-table-wrapper.collapsed {
                    max-height: 0 !important;
                    overflow: hidden !important;
                }
                #myIntervalContainer1 .stat-table-container {
                    width: 100%;
                    overflow-x: auto;
                    overflow-y: visible;
                    background-color: var(--card-bg, #fff);
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }
                #myIntervalContainer1 .stat-table {
                    width: 100%;
                    min-width: 1060px;
                    border-collapse: collapse;
                }
                #myIntervalContainer1 .sortable-th {
                    cursor: pointer;
                    user-select: none;
                }
                #myIntervalContainer1 .sortable-th:hover {
                    background-color: #eceff1;
                }
                #myIntervalContainer1 .stat-row {
                    cursor: pointer;
                }
                #myIntervalContainer1 .stat-row:hover {
                    background-color: #f8f9fa;
                }
                #myIntervalContainer1 .stat-row.selected-row {
                    background-color: #d1ecf1 !important;
                }
            </style>
            <div class="stat-header-bar" onclick="
                const wrapper = document.getElementById('intervalTableWrapper1');
                const arrow = document.getElementById('toggleArrow1');
                wrapper.classList.toggle('collapsed');
                arrow.style.transform = wrapper.classList.contains('collapsed') ? 'rotate(0deg)' : 'rotate(90deg)';
            ">
                <span>📊 全号统计 - 实例 1 (扩展分析)</span>
                <span class="toggle-arrow" id="toggleArrow1" style="transform: rotate(${isCurrentlyCollapsed ? '0deg' : '90deg'});">▶</span>
            </div>
            <div class="stat-table-wrapper ${isCurrentlyCollapsed ? 'collapsed' : ''}" id="intervalTableWrapper1">
                ${actionToolbarHTML}
                <div class="table-toolbar">
                    <button class="reset-btn" onclick="window.IntervalStatModule1.resetDefault();">↺ 重置全部</button>
                </div>
                <div class="stat-table-container">
                    <table class="stat-table">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="width: 4%;">序号</th>
                                <th style="width: 5%;">数字</th>
                                <th class="sortable-th" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('current');">当前间隔 ${getArrow('current')}</th>
                                <th class="sortable-th" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('averageVal');">平均间隔 ${getArrow('averageVal')}</th>
                                <th class="sortable-th" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('varianceVal');">样本方差 ${getArrow('varianceVal')}</th>
                                <th class="sortable-th" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('stabilityVal');">稳定性 ${getArrow('stabilityVal')}</th>
                                <th class="sortable-th" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('zScoreVal');">偏移(Z) ${getArrow('zScoreVal')}</th>
                                <th class="sortable-th" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('cvsVal');">综合动量(CVS) ${getArrow('cvsVal')}</th>
                                <th class="sortable-th" onclick="event.stopPropagation(); window.IntervalStatModule1._sortClickHandler('scoreVal');">综合评分(CS) ${getArrow('scoreVal')}</th>
                                <th style="width: 17%; text-align: left;">历史间隔</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHTML}
                        </tbody>
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

    let retryCount = 0;
    const timer = setInterval(() => {
        if (renderIntervalModule1() || retryCount >= 50) {
            clearInterval(timer);
        }
        retryCount++;
    }, 300);

    global.IntervalStatModule1 = {
        render: function(externalData) {
            if (this._sortQueue !== undefined) sortQueue1 = this._sortQueue;
            return renderIntervalModule1(externalData);
        },
        _sortClickHandler: function(field) {
            const existingIndex = sortQueue1.findIndex(item => item.field === field);
            if (existingIndex !== -1) {
                let currentOrder = sortQueue1[existingIndex].order;
                if (currentOrder === 'desc') {
                    sortQueue1[existingIndex].order = 'asc';
                } else {
                    sortQueue1.splice(existingIndex, 1);
                }
            } else {
                sortQueue1.push({ field: field, order: 'desc' });
            }
            this._sortQueue = sortQueue1;
            this.render();
        },
        _rowClickHandler: function(num) {
            if (selectedNums1.has(num)) {
                selectedNums1.delete(num);
            } else {
                selectedNums1.add(num); 
            }
            this.render();
        },
        resetDefault: function() {
            sortQueue1 = [];
            this._sortQueue = [];
            selectedNums1.clear();
            this.render();
        },
        clearSelected: function() {
            selectedNums1.clear();
            this.render();
        },
        getSelectedNums: function() {
            return Array.from(selectedNums1).sort();
        },
        copySelected: function() {
            const arr = this.getSelectedNums();
            if (arr.length === 0) return;
            navigator.clipboard.writeText(arr.join(', ')).then(() => {
                alert(`容器1已成功复制 ${arr.length} 个号码：\n${arr.join(', ')}`);
            });
        },
        _sortQueue: []
    };

})(window);