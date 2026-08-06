window.addEventListener('DOMContentLoaded', () => {
		const hotTextEl = document.getElementById('stat-hot-text');
		if (!hotTextEl) return;

		function combinations(arr, k) {
				if (k === 0) return [[]];
				if (arr.length === 0 || k > arr.length) return [];
				const head = arr[0];
				const tail = arr.slice(1);
				const withHead = combinations(tail, k - 1).map(c => [head, ...c]);
				const withoutHead = combinations(tail, k);
				return [...withHead, ...withoutHead];
		}

		const allPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

		let userCustomPositions = null; 
		let userK = 7; 
		let showTopN = 1; // 组合显示名数默认1
		let posShowTopN = 5; // 落点位置显示名数默认改为3

		const kInput = document.getElementById('combo-k-input');
		const customInput = document.getElementById('combo-custom-input');
		const showCountInput = document.getElementById('combo-show-count-input');
		const updateBtn = document.getElementById('combo-update-btn');

		const posShowCountInput = document.getElementById('pos-show-count-input');
		const posUpdateBtn = document.getElementById('pos-update-btn');

		posUpdateBtn.addEventListener('click', () => {
				const val = parseInt(posShowCountInput.value);
				if (val >= 1 && val <= 12) {
						posShowTopN = val;
						hotTextEl.textContent = hotTextEl.textContent; // 触发刷新
				} else {
						alert('落点位置显示名数应在 1 到 12 之间！');
				}
		});

		function updateMaxLimit() {
				let maxTotal = 1;
				const customVal = customInput.value.trim();
				if (customVal) {
						const parsed = customVal.split(/[,，\s]+/).map(Number).filter(n => n >= 1 && n <= 12);
						maxTotal = parsed.length > 0 ? 1 : 1; 
				} else {
						const k = parseInt(kInput.value) || 5;
						let numerator = 1;
						let denominator = 1;
						let realK = Math.min(k, 12 - k);
						for (let i = 0; i < realK; i++) {
								numerator *= (12 - i);
								denominator *= (i + 1);
						}
						maxTotal = numerator / denominator;
				}
				showCountInput.max = maxTotal;
				showCountInput.title = `当前模式下最多可显示 ${maxTotal} 名`;
				if (showTopN > maxTotal) {
						showTopN = maxTotal;
						showCountInput.value = maxTotal;
				}
		}

		kInput.addEventListener('input', updateMaxLimit);
		customInput.addEventListener('input', updateMaxLimit);
		updateMaxLimit();

		updateBtn.addEventListener('click', () => {
				const customVal = customInput.value.trim();
				if (customVal) {
						const parsed = customVal.split(/[,，\s]+/).map(Number).filter(n => n >= 1 && n <= 12);
						if (parsed.length > 0) {
								userCustomPositions = parsed;
						} else {
								alert('输入的位置格式有误，请输入1到12之间的数字！');
								return;
						}
				} else {
						userCustomPositions = null;
						const kval = parseInt(kInput.value);
						if (kval >= 1 && kval <= 12) {
								userK = kval;
						} else {
								alert('组合位数应在 1 到 12 之间！');
								return;
						}
				}

				updateMaxLimit();
				const maxAllowed = parseInt(showCountInput.max);
				const nval = parseInt(showCountInput.value);
				if (nval >= 1 && nval <= maxAllowed) {
						showTopN = nval;
				} else {
						alert(`显示名数应在 1 到 ${maxAllowed} 之间！`);
						return;
				}

				hotTextEl.textContent = hotTextEl.textContent;
		});

		const observer = new MutationObserver(() => {
				const positionCounts = {};
				let validRowsCount = 0;
				let latestNumBoxes = null;

				const rows = Array.from(document.querySelectorAll('.row')).filter(row => row.style.display !== 'none');
				
				if (rows.length > 0) {
						const latestRow = rows[0]; 
						latestNumBoxes = latestRow.querySelectorAll('.num-box');
				}

				let targetCombos = [];
				if (userCustomPositions) {
						targetCombos = [userCustomPositions];
				} else {
						targetCombos = combinations(allPositions, userK);
				}

				const comboHitCounts = {};
				targetCombos.forEach(combo => {
						comboHitCounts[combo.join(',')] = 0;
				});

				rows.forEach(row => {
						const ruleBox = row.querySelector('.rule-box');
						if (!ruleBox) return;
						const ruleValue = ruleBox.textContent.trim();

						if (ruleValue === '?' || !ruleValue) return;

						const numBoxes = row.querySelectorAll('.num-box');
						if (numBoxes.length === 12) {
								validRowsCount++;
								
								numBoxes.forEach((box, index) => {
										const boxValue = box.textContent.trim();
										if (boxValue === ruleValue) {
												const posKey = index + 1;
												positionCounts[posKey] = (positionCounts[posKey] || 0) + 1;
										}
								});

								targetCombos.forEach(combo => {
										let hit = false;
										for (let p of combo) {
												if (numBoxes[p - 1] && numBoxes[p - 1].textContent.trim() === ruleValue) {
														hit = true;
														break;
												}
										}
										if (hit) {
												comboHitCounts[combo.join(',')]++;
										}
								});
						}
				});

				const sortedPositions = Object.entries(positionCounts).sort((a, b) => b[1] - a[1]);
				const topPositions = sortedPositions.slice(0, posShowTopN);

				const containerEl = document.getElementById('stat-top3-container');
				if (containerEl) {
						let htmlLines = '';
						for (let i = 0; i < posShowTopN; i++) {
								const rankNum = i + 1;
								if (topPositions[i]) {
										const [posIndex, count] = topPositions[i];
										const pct = validRowsCount > 0 ? ((count / validRowsCount) * 100).toFixed(1) : '0.0';
										
										let correspondingAnimal = '-';
										if (latestNumBoxes && latestNumBoxes[posIndex - 1]) {
												correspondingAnimal = latestNumBoxes[posIndex - 1].textContent.trim();
										}
										
										htmlLines += `<div style="text-align: left; padding: 3px 6px; background: #fafafa; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;">
												<div>
														<span style="font-weight: bold; color: #1890ff;">第${rankNum}名</span> 
														<span style="color: #666; margin-left: 4px;">第 <b>${posIndex}</b> 位</span>
												</div>
												<div style="display: flex; gap: 6px; align-items: center;">
														<span style="color: #ff4d4f; font-weight: bold; background: #fff1f0; padding: 1px 6px; border-radius: 3px; border: 1px solid #ffa39e;">
																${correspondingAnimal}
														</span>
														<span style="color: #333; font-size: 10px; background: #e6f7ff; padding: 1px 4px; border-radius: 3px; border: 1px solid #91d5ff;">
																${count}次/${pct}%
														</span>
												</div>
										</div>`;
								} else {
										htmlLines += `<div style="text-align: left; padding: 3px 6px; background: #fafafa; border-radius: 3px; color: #999;">
												<span style="font-weight: bold; color: #bbb;">第${rankNum}名</span>: 暂无
										</div>`;
								}
						}
						containerEl.innerHTML = htmlLines;
				}

				// 处理组合命中渲染
				const sortedCombos = Object.entries(comboHitCounts).sort((a, b) => b[1] - a[1]);
				const topCombos = sortedCombos.slice(0, showTopN);

				const comboContainerEl = document.getElementById('stat-pos-combo-container');
				if (comboContainerEl) {
						let comboHtml = '';
						for (let i = 0; i < showTopN; i++) {
								const rankNum = i + 1;
								if (topCombos[i]) {
										const [comboKeyStr, count] = topCombos[i];
										const comboArr = comboKeyStr.split(',').map(Number);
										const pct = validRowsCount > 0 ? ((count / validRowsCount) * 100).toFixed(1) : '0.0';
										
										let latestAnimalsStr = '-';
										if (latestNumBoxes) {
												const tmpArr = [];
												comboArr.forEach(p => {
														if (latestNumBoxes[p - 1]) tmpArr.push(latestNumBoxes[p - 1].textContent.trim());
												});
												latestAnimalsStr = tmpArr.join(' ');
										}

										const displayPositions = comboArr.join('、');

										comboHtml += `<div style="text-align: left; padding: 3px 6px; background: #f6ffed; border-radius: 3px; border: 1px solid #b7eb8f; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
												<div>
														<span style="font-weight: bold; color: #52c41a;">第${rankNum}名</span> 
														<span style="color: #666; font-size: 10px;">(${displayPositions})</span>
												</div>
												<div style="display: flex; gap: 6px; align-items: center;">
														<span style="color: #389e0d; font-weight: bold; background: #fff; padding: 1px 4px; border-radius: 3px; border: 1px solid #b7eb8f; font-size: 10px;">
																${latestAnimalsStr}
														</span>
														<span style="color: #333; font-size: 10px; background: #fff; padding: 1px 4px; border-radius: 3px; border: 1px solid #d9d9d9;">
																${count}次/${pct}%
														</span>
												</div>
										</div>`;
								} else {
										comboHtml += `<div style="text-align: left; padding: 3px 6px; background: #fafafa; border-radius: 3px; color: #999;">
												<span style="font-weight: bold; color: #bbb;">第${rankNum}名</span>: 暂无
										</div>`;
								}
						}
						comboContainerEl.innerHTML = comboHtml;
				}
		});

		observer.observe(hotTextEl.parentElement.parentElement, {
				childList: true,
				subtree: true,
				characterData: true
		});

		setTimeout(() => {
				hotTextEl.textContent = hotTextEl.textContent;
		}, 100);
});