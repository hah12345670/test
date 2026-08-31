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

    function renderIntervalModule(externalData) {
        const dataSource = externalData || (typeof rawDataArray !== 'undefined' ? rawDataArray : null);
        
        if (!dataSource || !Array.isArray(dataSource) || dataSource.length === 0) {
            return false; 
        }

        let container = document.getElementById('myIntervalContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'myIntervalContainer';
            
            // 插入到现有其他统计模块的后面
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

            // 计算新增的合理复合指标 CVS (Comprehensive Volatility Score)
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

            stats[num] = {
                current: currentInterval,
                average: avg.toFixed(1),
                variance: variance.toFixed(1),
                stabilityText: `${cv.toFixed(2)}(${stability.text})`,
                stabilityColor: stability.color,
                zScoreFormatted: `${zScore > 0 ? '+' : ''}${zScore.toFixed(2)} (${zState})`,
                cvsFormatted: `${cvs.toFixed(2)} (${cvsState})`,
                cvsColor: cvsColor,
                rawZ: zScore,
                history: rawIntervals
            };
        });

        const tableRowsHTML = targetNums.map(num => {
            const data = stats[num];
            const cur = data.current;
            const curText = `${cur}`;
            const curColor = cur === 0 ? 'color: #28a745; font-weight: bold;' : (cur <= 3 ? 'color: #d9534f; font-weight: bold;' : 'color: #333;');
            
            // 完整显示所有开出间隔明细
            const historyText = data.history.length > 0 ? data.history.join(', ') : '暂无更多历史';
            
            const zVal = data.rawZ;
            const zScoreColor = zVal > 1.5 ? 'color: #d9534f; font-weight: bold;' : (zVal < -1.5 ? 'color: #28a745; font-weight: bold;' : 'color: #333;');

            return `
                <tr>
                    <td style="padding: 6px 8px; text-align: center; font-weight: bold; color: #007bff; border-bottom: 1px solid #eee;">${num}</td>
                    <td style="padding: 6px 8px; text-align: center; ${curColor} border-bottom: 1px solid #eee;">${curText}</td>
                    <td style="padding: 6px 8px; text-align: center; color: #333; border-bottom: 1px solid #eee;">${data.average}</td>
                    <td style="padding: 6px 8px; text-align: center; color: #666; border-bottom: 1px solid #eee;">${data.variance}</td>
                    <td style="padding: 6px 8px; text-align: center; color: ${data.stabilityColor}; font-weight: bold; border-bottom: 1px solid #eee;">${data.stabilityText}</td>
                    <td style="padding: 6px 8px; text-align: center; ${zScoreColor} font-weight: bold; border-bottom: 1px solid #eee;">${data.zScoreFormatted}</td>
                    <td style="padding: 6px 8px; text-align: center; color: ${data.cvsColor}; font-weight: bold; border-bottom: 1px solid #eee;">${data.cvsFormatted}</td>
                    <td style="padding: 6px 8px; text-align: left; color: #555; font-size: 11px; border-bottom: 1px solid #eee; word-break: break-all; white-space: normal;" title="${data.history.join(', ')}">${historyText}</td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <style>
                #myIntervalContainer {
                    width: 100%;
                    max-width: 1100px;
                    margin: 10px auto 0 auto;
                    box-sizing: border-box;
                }
                #myIntervalContainer .stat-table-container {
                    width: 100%;
                    overflow-x: auto;
                    background-color: var(--card-bg, #fff);
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    -webkit-overflow-scrolling: touch;
                    touch-action: pan-x;
                }
                #myIntervalContainer .stat-table {
                    width: 100%;
                    min-width: 900px;
                    border-collapse: collapse;
                    border-spacing: 0;
                }
                #myIntervalContainer .stat-table th, 
                #myIntervalContainer .stat-table td {
                    box-sizing: border-box;
                }
            </style>
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #333;">📊 全号 (01-80) 统计</div>
            <div class="stat-table-container">
                <table class="stat-table">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="width: 6%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;">号码</th>
                            <th style="width: 9%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;">当前间隔</th>
                            <th style="width: 9%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;">平均间隔</th>
                            <th style="width: 9%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;">样本方差</th>
                            <th style="width: 12%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;">
                                稳定性
                                <div style="font-size: 9px; font-weight: normal; color: #666; margin-top: 2px; white-space: nowrap;">(&lt;0.8稳定|&gt;1.5剧烈)</div>
                            </th>
                            <th style="width: 16%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;">
                                偏移(Z)
                                <div style="font-size: 9px; font-weight: normal; color: #666; margin-top: 2px; white-space: nowrap;">(&gt;2极冷|&lt;-1.5极热)</div>
                            </th>
                            <th style="width: 16%; padding: 8px 4px; text-align: center; border-bottom: 2px solid #dee2e6;">
                                综合动量(CVS)
                                <div style="font-size: 9px; font-weight: normal; color: #666; margin-top: 2px; white-space: nowrap;">(&gt;1.8爆发临界)</div>
                            </th>
                            <th style="width: 23%; padding: 8px 4px; text-align: left; border-bottom: 2px solid #dee2e6;">历史间隔</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHTML}
                    </tbody>
                </table>
            </div>
        `;
        return true;
    }

    let retryCount = 0;
    const maxRetries = 50;
    const timer = setInterval(() => {
        retryCount++;
        if (renderIntervalModule() || retryCount >= maxRetries) {
            clearInterval(timer);
            if (retryCount >= maxRetries) {
                console.warn("数据加载超时：未检测到有效的 rawDataArray 数据源。");
            }
        }
    }, 300);

    global.IntervalStatModule = {
        render: renderIntervalModule
    };

})(window);