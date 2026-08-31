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

    let sortQueue = [];

    function renderIntervalModule(externalData) {
        const dataSource = externalData || (typeof rawDataArray !== 'undefined' ? rawDataArray : null);
        
        if (!dataSource || !Array.isArray(dataSource) || dataSource.length === 0) {
            return false; 
        }

        let container = document.getElementById('myIntervalContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'myIntervalContainer';
            
            const existingStat = document.querySelector('.stat-section-wrapper');
            if (existingStat && existingStat.parentNode) {
                existingStat.parentNode.insertBefore(container, existingStat.nextSibling);
            } else {
                document.body.appendChild(container);
            }
        }

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
        if (sortQueue.length > 0) {
            sortedNums.sort((a, b) => {
                for (let item of sortQueue) {
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

        const tableRowsHTML = sortedNums.map(num => {
            const data = stats[num];
            const cur = data.current;
            const curText = `${cur}`;
            const curColor = cur === 0 ? 'color: #28a745; font-weight: bold;' : (cur <= 3 ? 'color: #d9534f; font-weight: bold;' : 'color: #333;');
            
            const historyText = data.history.length > 0 ? data.history.join(', ') : '暂无更多历史';
            
            const zVal = data.rawZ;
            const zScoreColor = zVal > 1.5 ? 'color: #d9534f; font-weight: bold;' : (zVal < -1.5 ? 'color: #28a745; font-weight: bold;' : 'color: #333;');
            const scoreColorStyle = data.scoreVal >= 82 ? 'color: #28a745; font-weight: bold;' : (data.scoreVal >= 68 ? 'color: #007bff; font-weight: bold;' : 'color: #333;');

            return `
                <tr>
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
            const index = sortQueue.findIndex(item => item.field === field);
            if (index === -1) {
                return '<span style="color: #ccc; font-size: 10px; margin-left: 3px;">↕</span>';
            }
            const item = sortQueue[index];
            const arrowSymbol = item.order === 'asc' ? '▲' : '▼';
            const priorityTag = sortQueue.length > 1 ? `<sub style="font-size:8px; color:#007bff; font-weight:bold;">#${index + 1}</sub>` : '';
            return `<span style="color: #007bff; font-size: 10px; margin-left: 3px;">${arrowSymbol}</span>${priorityTag}`;
        };

        const existingWrapper = document.getElementById('intervalTableWrapper');
        const isCurrentlyCollapsed = existingWrapper ? existingWrapper.classList.contains('collapsed') : true;

        container.innerHTML = `
            <style>
                #myIntervalContainer {
                    width: 100%;
                    max-width: 1200px;
                    margin: 10px auto 0 auto;
                    box-sizing: border-box;
                    height: auto !important;
                }
                #myIntervalContainer .stat-header-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                    background-color: #f8f9fa;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    user-select: none;
                    border: 1px solid #e9ecef;
                }
                #myIntervalContainer .stat-header-bar:hover {
                    background-color: #f1f3f5;
                }
                #myIntervalContainer .toggle-arrow {
                    font-size: 12px;
                    color: #666;
                    transition: transform 0.3s ease;
                }
                #myIntervalContainer .stat-table-wrapper {
                    transition: max-height 0.3s ease;
                    overflow: visible !important; /* 微调：避免高度被意外裁剪隐藏 */
                    max-height: none !important;  /* 微调：取消硬性高度上限限制 */
                    height: auto !important;
                }
                #myIntervalContainer .stat-table-wrapper.collapsed {
                    max-height: 0 !important;
                    overflow: hidden !important;
                }
                #myIntervalContainer .stat-table-container {
                    width: 100%;
                    overflow-x: auto;
                    overflow-y: visible;
                    background-color: var(--card-bg, #fff);
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    -webkit-overflow-scrolling: touch;
                }
                #myIntervalContainer .stat-table {
                    width: 100%;
                    min-width: 1020px;
                    border-collapse: collapse;
                    border-spacing: 0;
                }
                #myIntervalContainer .stat-table th, 
                #myIntervalContainer .stat-table td {
                    box-sizing: border-box;
                }
                #myIntervalContainer .sortable-th {
                    cursor: pointer;
                    user-select: none;
                }
                #myIntervalContainer .sortable-th:hover {
                    background-color: #eceff1;
                }
            </style>
            <div class="stat-header-bar" onclick="
                const wrapper = document.getElementById('intervalTableWrapper');
                const arrow = document.getElementById('toggleArrow');
                wrapper.classList.toggle('collapsed');
                if (wrapper.classList.contains('collapsed')) {
                    arrow.style.transform = 'rotate(0deg)';
                } else {
                    arrow.style.transform = 'rotate(90deg)';
                }
            ">
                <span>📊 全号 (01-80) 统计</span>
                <span class="toggle-arrow" id="toggleArrow" style="transform: rotate(${isCurrentlyCollapsed ? '0deg' : '90deg'});">▶</span>
            </div>
            <div class="stat-table-wrapper ${isCurrentlyCollapsed ? 'collapsed' : ''}" id="intervalTableWrapper">
                <div class="stat-table-container">
                    <table class="stat-table">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="width: 5%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;">号码</th>
                                <th class="sortable-th" style="width: 8%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;" onclick="event.stopPropagation(); window.IntervalStatModule._sortClickHandler('current');">
                                    当前间隔 ${getArrow('current')}
                                </th>
                                <th class="sortable-th" style="width: 8%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;" onclick="event.stopPropagation(); window.IntervalStatModule._sortClickHandler('averageVal');">
                                    平均间隔 ${getArrow('averageVal')}
                                </th>
                                <th class="sortable-th" style="width: 8%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;" onclick="event.stopPropagation(); window.IntervalStatModule._sortClickHandler('varianceVal');">
                                    样本方差 ${getArrow('varianceVal')}
                                </th>
                                <th class="sortable-th" style="width: 11%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;" onclick="event.stopPropagation(); window.IntervalStatModule._sortClickHandler('stabilityVal');">
                                    稳定性 ${getArrow('stabilityVal')}<div style="font-size: 9px; font-weight: normal; color: #666; margin-top: 2px; line-height: 1.2;">(&lt;0.8稳定|&gt;1.5剧烈)</div>
                                </th>
                                <th class="sortable-th" style="width: 15%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;" onclick="event.stopPropagation(); window.IntervalStatModule._sortClickHandler('zScoreVal');">
                                    偏移(Z) ${getArrow('zScoreVal')}
                                    <div style="font-size: 9px; font-weight: normal; color: #666; margin-top: 2px; line-height: 1.2;">(&gt;2极冷|&gt;1偏冷)<br>(正常|-0.8~-1.5偏热|&lt;-1.5极热)</div>
                                </th>
                                <th class="sortable-th" style="width: 15%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;" onclick="event.stopPropagation(); window.IntervalStatModule._sortClickHandler('cvsVal');">
                                    综合动量(CVS) ${getArrow('cvsVal')}
                                    <div style="font-size: 9px; font-weight: normal; color: #666; margin-top: 2px; line-height: 1.2;">(&lt;0.4持续活跃)<br>(&gt;1.8爆发临界)</div>
                                </th>
                                <th class="sortable-th" style="width: 13%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;" onclick="event.stopPropagation(); window.IntervalStatModule._sortClickHandler('scoreVal');">
                                    综合评分(CS) ${getArrow('scoreVal')}
                                    <div style="font-size: 9px; font-weight: normal; color: #666; margin-top: 2px; line-height: 1.2;">(均值/Z/稳定性)</div>
                                </th>
                                <th style="width: 17%; padding: 8px 4px; text-align: left; border-bottom: 2px solid #dee2e6;">历史间隔</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHTML}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        return true;
    }

    let retryCount = 0;
    const maxRetries = 50;
    const timer = setInterval(() => {
        if (renderIntervalModule() || retryCount >= maxRetries) {
            clearInterval(timer);
            if (retryCount >= maxRetries) {
                console.warn("数据加载超时：未检测到有效的 rawDataArray 数据源。");
            }
        }
        retryCount++;
    }, 300);

    global.IntervalStatModule = {
        render: function(externalData) {
            if (this._sortQueue !== undefined) sortQueue = this._sortQueue;
            return renderIntervalModule(externalData);
        },
        _sortClickHandler: function(field) {
            const existingIndex = sortQueue.findIndex(item => item.field === field);
            if (existingIndex !== -1) {
                let currentOrder = sortQueue[existingIndex].order;
                if (currentOrder === 'asc') {
                    sortQueue[existingIndex].order = 'desc';
                } else {
                    sortQueue.splice(existingIndex, 1);
                }
            } else {
                sortQueue.push({ field: field, order: 'asc' });
            }
            this._sortQueue = sortQueue;
            this.render();
        },
        _sortQueue: []
    };

})(window);