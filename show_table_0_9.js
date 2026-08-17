const buttons = document.querySelectorAll('.filter-btn');
const boxes = document.querySelectorAll('.box');
const resetBtn = document.getElementById('resetBtn');
const selectAllBtn = document.getElementById('selectAllBtn');

let currentMode = 'ALL'; 
let selectedNumbers = new Set();

function render() {
		boxes.forEach(box => {
				box.classList.remove('opacity-100', 'opacity-30', 'opacity-15');
		});

		if (currentMode === 'ALL') {
				buttons.forEach(btn => btn.classList.add('active')); 
				boxes.forEach(box => box.classList.add('opacity-100')); 
				
		} else if (currentMode === 'RESET') {
				buttons.forEach(btn => btn.classList.remove('active')); 
				boxes.forEach(box => {
						if (box.getAttribute('data-dim') === 'true') {
								box.classList.add('opacity-30'); 
						} else {
								box.classList.add('opacity-100'); 
						}
				});

		} else if (currentMode === 'FILTER') {
				buttons.forEach(btn => {
						const num = btn.getAttribute('data-num');
						if (selectedNumbers.has(num)) {
								btn.classList.add('active');
						} else {
								btn.classList.remove('active');
						}
				});
				boxes.forEach(box => {
						const val = box.getAttribute('data-val');
						if (selectedNumbers.has(val)) {
								box.classList.add('opacity-100'); 
						} else {
								box.classList.add('opacity-15');  
						}
				});
		}
}

function handleNumberClick(num) {
		if (currentMode !== 'FILTER') {
				currentMode = 'FILTER';
				selectedNumbers.clear();
				selectedNumbers.add(num);
		} else {
				if (selectedNumbers.has(num)) {
						selectedNumbers.delete(num);
						if (selectedNumbers.size === 0) {
								currentMode = 'RESET';
						}
				} else {
						selectedNumbers.add(num);
				}
		}
		render();
}

buttons.forEach(btn => {
		btn.addEventListener('click', () => {
				handleNumberClick(btn.getAttribute('data-num'));
		});
});

boxes.forEach(box => {
		box.addEventListener('click', () => {
				handleNumberClick(box.getAttribute('data-val'));
		});
});

selectAllBtn.addEventListener('click', () => {
		currentMode = 'ALL';
		selectedNumbers.clear();
		render();
});

resetBtn.addEventListener('click', () => {
		currentMode = 'RESET';
		selectedNumbers.clear();
		render();
});

window.addEventListener('DOMContentLoaded', () => {
		currentMode = 'ALL';
		render();
});

// 添加统计的js
function updateEmbeddedStats() {
	const rows = document.querySelectorAll('.matrix-table tbody tr');
	if (!rows.length) return;

	let visibleCount = 0;
	let frontCounts = { '0':0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0, '8':0, '9':0 };
	let backCounts = { '0':0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0, '8':0, '9':0 };
	let resultCounts = {};

	let typeMap = {};

	rows.forEach(row => {
			const rowIndexTd = row.querySelector('.row-index');
			if (rowIndexTd && rowIndexTd.textContent.trim() === '?') {
					return; 
			}

			const labelSpan = row.querySelector('.highlight-label');
			let resText = labelSpan ? labelSpan.textContent.trim() : '';
			if (!resText || resText === '?') return;

			if (!typeMap[resText]) {
					typeMap[resText] = {
							totalRows: 0,
							segs: [
									{ 0: 0, 1: 0, 2: 0, 3: 0 },
									{ 0: 0, 1: 0, 2: 0, 3: 0 },
									{ 0: 0, 1: 0, 2: 0, 3: 0 }
							],
							combos: {}
					};
			}
			typeMap[resText].totalRows++;
			resultCounts[resText] = (resultCounts[resText] || 0) + 1;

			const boxes = row.querySelectorAll('.box');
			
			let backValues = [];
			boxes.forEach((box, index) => {
					const val = box.getAttribute('data-val');
					if (index >= 9 && val !== '?' && !box.classList.contains('opacity-15')) {
							backValues.push(val);
					}
			});

			let segHits = [0, 0, 0];
			boxes.forEach((box, index) => {
					const val = box.getAttribute('data-val');
					if (val !== '?') {
							if (!box.classList.contains('opacity-15')) {
									visibleCount++;
									if (index < 9 && frontCounts.hasOwnProperty(val)) {
											frontCounts[val]++;
											if (backValues.includes(val)) {
													if (index < 3) segHits[0]++;
													else if (index < 6) segHits[1]++;
													else if (index < 9) segHits[2]++;
											}
									} else if (index >= 9 && backCounts.hasOwnProperty(val)) {
											backCounts[val]++;
									}
							}
					}
			});

			for (let s = 0; s < 3; s++) {
					if (segHits[s] > 3) segHits[s] = 3;
					typeMap[resText].segs[s][segHits[s]]++;
			}

			let comboKey = `${segHits[0]}-${segHits[1]}-${segHits[2]}`;
			typeMap[resText].combos[comboKey] = (typeMap[resText].combos[comboKey] || 0) + 1;
	});

	document.getElementById('statTotal').textContent = visibleCount;

	// 渲染前9个数字分段统计
	let fG1 = '', fG2 = '', fG3 = '', fG4 = '';
	for (let i = 0; i <= 8; i++) {
			let badge = `<span class="stat-badge"><b>${i}</b>: ${frontCounts[i]}次</span>`;
			if (i < 3) fG1 += badge;
			else if (i < 6) fG2 += badge;
			else fG3 += badge;
	}
	fG4 = `<span class="stat-badge"><b>9</b>: ${frontCounts[9]}次</span>`;

	document.getElementById('frontGroup1').innerHTML = fG1;
	document.getElementById('frontGroup2').innerHTML = fG2;
	document.getElementById('frontGroup3').innerHTML = fG3;
	document.getElementById('frontGroup4').innerHTML = fG4;

	// 渲染后3个数字统计
	let bHtml = '';
	for (let i = 0; i <= 9; i++) {
			bHtml += `<span class="stat-badge"><b>${i}</b>: ${backCounts[i]}次</span>`;
	}
	document.getElementById('backGroup').innerHTML = bHtml;

	// 渲染开奖结果分类统计
	let resHtml = '';
	const sortedKeys = Object.keys(resultCounts).sort();
	if (sortedKeys.length === 0) {
			resHtml += `<span class="result-badge">暂无数据</span>`;
	} else {
			sortedKeys.forEach(key => {
					resHtml += `<span class="result-badge">${key}: <b>${resultCounts[key]}</b>次</span>`;
			});
	}
	document.getElementById('statsResultsGroup').innerHTML = resHtml;

	// 渲染：各类型分段频次及组合分布
	let typeFreqHtml = '';
	if (sortedKeys.length === 0) {
			typeFreqHtml = `<div style="text-align: center; font-size: 0.75rem; color: #666;">暂无有效数据</div>`;
	} else {
			const segNames = ["第1-3段", "第4-6段", "第7-9段"];
			sortedKeys.forEach(resType => {
					let data = typeMap[resType];
					typeFreqHtml += `<div class="type-freq-card">`;
					typeFreqHtml += `<div class="type-freq-header">类型: ${resType} (共 ${data.totalRows} 次)</div>`;
					
					for (let s = 0; s < 3; s++) {
							typeFreqHtml += `<div class="seg-line"><span><b>${segNames[s]}</b>:</span>`;
							for (let c = 0; c <= 3; c++) {
									let cnt = data.segs[s][c];
									let pct = data.totalRows > 0 ? ((cnt / data.totalRows) * 100).toFixed(1) : 0;
									typeFreqHtml += `<span class="freq-badge"><b>${c}</b>次:<b>${cnt}</b>(${pct}%)</span>`;
							}
							typeFreqHtml += `</div>`;
					}

					// 将组合对象转为数组并按出现次数从大到小排序
					let comboArray = [];
					for (let combo in data.combos) {
							comboArray.push({ combo: combo, count: data.combos[combo] });
					}
					comboArray.sort((a, b) => b.count - a.count);

					typeFreqHtml += `<div class="best-combos-box">`;
					typeFreqHtml += `<div class="best-combos-title">🔥 组合分布 (第1-3段 / 第4-6段 / 第7-9段)：</div>`;
					if (comboArray.length === 0) {
							typeFreqHtml += `<div class="combo-item"><span>暂无组合数据</span></div>`;
					} else {
							comboArray.forEach((item, idx) => {
									let pct = data.totalRows > 0 ? ((item.count / data.totalRows) * 100).toFixed(1) : 0;
									// 第4名开始显示分割标题
									if (idx === 3) {
											typeFreqHtml += `<div style="font-size: 0.7rem; color: #888; margin-top: 6px; border-top: 1px dashed #ddd; padding-top: 4px;">其余组合：</div>`;
									}
									// 前3名正常显示，第4名及以后以 60% 透明度置灰显示
									if (idx < 3) {
											typeFreqHtml += `<div class="combo-item"><span><b>No.${idx + 1}</b> [ ${item.combo} ]</span><span>出现 <b>${item.count}</b> 次 (<b>${pct}%</b>)</span></div>`;
									} else {
											typeFreqHtml += `<div class="combo-item" style="opacity: 0.6;"><span>No.${idx + 1} [ ${item.combo} ]</span><span>出现 ${item.count} 次 (${pct}%)</span></div>`;
									}
							});
					}
					typeFreqHtml += `</div>`;

					typeFreqHtml += `</div>`;
			});
	}
	document.getElementById('statsFrequencyGroup').innerHTML = typeFreqHtml;
}

document.addEventListener('click', () => {
	setTimeout(updateEmbeddedStats, 50);
});

window.addEventListener('DOMContentLoaded', () => {
	setTimeout(updateEmbeddedStats, 150);
});