window.addEventListener('DOMContentLoaded', () => {
		const topContainer = document.getElementById('stat-top3-container');
		const frontTextEl = document.getElementById('stat-front-text');
		const backTextEl = document.getElementById('stat-back-text');
		const oddTextEl = document.getElementById('stat-odd-text');
		const evenTextEl = document.getElementById('stat-even-text');
		
		const patternTextEl = document.getElementById('rec-pattern-text');
		const goldenTextEl = document.getElementById('rec-golden-text');
		const defendTextEl = document.getElementById('rec-defend-text');
		const killTextEl = document.getElementById('rec-kill-text');
		
		const tagGoldenLabel = document.getElementById('tag-golden-label');
		const tagDefendLabel = document.getElementById('tag-defend-label');

		if (!topContainer || !frontTextEl || !backTextEl || !oddTextEl || !evenTextEl) return;

		const recUpdateBtn = document.getElementById('rec-update-btn');
		if (recUpdateBtn) {
				recUpdateBtn.addEventListener('click', calcAllAndRecommend);
		}

		function getLatestRowZodiacs() {
				const latestRow = document.querySelector('.row');
				let latestZodiacMap = {};

				if (latestRow) {
						const numBoxes = latestRow.querySelectorAll('.num-box');
						numBoxes.forEach((box, index) => {
								const text = box.textContent.trim();
								latestZodiacMap[index + 1] = text || `位${index + 1}`;
						});
				} else {
						for (let i = 1; i <= 12; i++) {
								latestZodiacMap[i] = `位${i}`;
						}
				}
				return latestZodiacMap;
		}

		function calcAllAndRecommend() {
				const latestZodiacs = getLatestRowZodiacs();

				const goldenCount = parseInt(document.getElementById('rec-golden-input').value, 10) || 3;
				const defendCount = parseInt(document.getElementById('rec-defend-input').value, 10) || 2;

				if (tagGoldenLabel) tagGoldenLabel.textContent = `主攻推荐(${goldenCount}位)`;
				if (tagDefendLabel) tagDefendLabel.textContent = `防守补位(${defendCount}位)`;

				let posCounts = {};
				let posTempCounts = {}; 

				for(let i=1; i<=12; i++) {
						posCounts[i] = 0;
						posTempCounts[i] = { hot: 0, warm: 0, cold: 0 };
				}

				const rows = Array.from(document.querySelectorAll('.row')).filter(row => row.style.display !== 'none');

				rows.forEach(row => {
						const ruleBox = row.querySelector('.rule-box');
						if (!ruleBox) return;
						const ruleValue = ruleBox.textContent.trim();

						if (ruleValue === '?' || !ruleValue) return;

						const numBoxes = row.querySelectorAll('.num-box');
						if (numBoxes.length === 12) {
								numBoxes.forEach((box, index) => {
										if (box.textContent.trim() === ruleValue) {
												const posKey = index + 1;
												posCounts[posKey]++;

												if (box.classList.contains('hot')) posTempCounts[posKey].hot++;
												else if (box.classList.contains('warm')) posTempCounts[posKey].warm++;
												else if (box.classList.contains('cold')) posTempCounts[posKey].cold++;
										}
								});
						}
				});

				// 1. 基础分布统计
				let frontHits = 0, backHits = 0;
				let oddHits = 0, evenHits = 0;

				for (let pos = 1; pos <= 12; pos++) {
						const count = posCounts[pos];
						if (pos <= 6) frontHits += count;
						else backHits += count;

						if (pos % 2 !== 0) oddHits += count;
						else evenHits += count;
				}

				const totalHits = frontHits + backHits;

				const frontPct = totalHits > 0 ? ((frontHits / totalHits) * 100).toFixed(1) : '0.0';
				const backPct = totalHits > 0 ? ((backHits / totalHits) * 100).toFixed(1) : '0.0';
				const oddPct = totalHits > 0 ? ((oddHits / totalHits) * 100).toFixed(1) : '0.0';
				const evenPct = totalHits > 0 ? ((evenHits / totalHits) * 100).toFixed(1) : '0.0';

				frontTextEl.textContent = `个数: ${frontHits} (${frontPct}%)`;
				backTextEl.textContent = `个数: ${backHits} (${backPct}%)`;
				oddTextEl.textContent = `个数: ${oddHits} (${oddPct}%)`;
				evenTextEl.textContent = `个数: ${evenHits} (${evenPct}%)`;

				if (totalHits === 0) {
						patternTextEl.textContent = "无有效样本";
						goldenTextEl.textContent = "无";
						defendTextEl.textContent = "无";
						killTextEl.textContent = "无";
						return;
				}

				// 2. 评分与截取
				const isFrontDominant = frontHits >= backHits;
				const isOddDominant = oddHits >= evenHits;

				const spaceTag = isFrontDominant ? "前区" : "后区";
				const parityTag = isOddDominant ? "奇数" : "偶数";

				let positionScores = [];

				for (let pos = 1; pos <= 12; pos++) {
						let score = posCounts[pos] * 1.5;

						const isPosFront = pos <= 6;
						if (isPosFront === isFrontDominant) score += 2;

						const isPosOdd = (pos % 2 !== 0);
						if (isPosOdd === isOddDominant) score += 2;

						const hotRatio = posCounts[pos] > 0 ? (posTempCounts[pos].hot / posCounts[pos]) : 0;
						score += hotRatio * 3;

						let tempAttr = "温";
						if (posTempCounts[pos].hot >= posTempCounts[pos].warm && posTempCounts[pos].hot >= posTempCounts[pos].cold) {
								tempAttr = "热";
						} else if (posTempCounts[pos].cold > posTempCounts[pos].warm && posTempCounts[pos].cold > posTempCounts[pos].hot) {
								tempAttr = "冷";
						}

						const spaceAttr = isPosFront ? "前" : "后";
						const parityAttr = isPosOdd ? "奇" : "偶";
						
						const zodiacName = latestZodiacs[pos] || `位${pos}`;

						const attrText = `位${pos}-${zodiacName} [${tempAttr}|${spaceAttr}|${parityAttr}](${posCounts[pos]}次)`;

						positionScores.push({ pos, score, hits: posCounts[pos], attrText });
				}

				// 【已修复排序不稳定问题】：得分高排前面，如果得分相同，按位置序号(pos)从小到大排
				positionScores.sort((a, b) => {
						if (b.score !== a.score) return b.score - a.score;
						return a.pos - b.pos;
				});

				// 截取逻辑
				const goldenPosList = positionScores.slice(0, goldenCount).map(item => item.attrText).join(" 、 ");
				const defendPosList = positionScores.slice(goldenCount, goldenCount + defendCount).map(item => item.attrText).join(" 、 ");
				const killPosList = positionScores.slice(-2).map(item => item.attrText).join(" 、 ");

				patternTextEl.textContent = `${spaceTag} + ${parityTag} + 综合趋势`;
				goldenTextEl.textContent = goldenPosList || "无";
				defendTextEl.textContent = defendPosList || "无";
				killTextEl.textContent = killPosList || "无";
		}

		/**
		 * 新增的独立方法：三维交叉智能动态推荐
		 * @param {Array} positionScores - 已经排好序的 12 个位置评分数组
		 * @param {number} goldenCount - 主攻推荐数量（默认5位）
		 * @param {number} defendCount - 防守推荐数量（默认5位）
		 */
		// 【完全独立的独立方法】内部自动统计 posCounts 并打印日志
		function logThreeDimensionalRecommendation(goldenCount = 5, defendCount = 5) {
				// 1. 获取最新生肖映射
				const latestZodiacs = (typeof getLatestRowZodiacs === 'function') ? getLatestRowZodiacs() : {};

				let posCounts = {};
				let posTempCounts = {}; 

				for(let i=1; i<=12; i++) {
						posCounts[i] = 0;
						posTempCounts[i] = { hot: 0, warm: 0, cold: 0 };
				}

				const rows = Array.from(document.querySelectorAll('.row')).filter(row => row.style.display !== 'none');

				// 2. 统计各位置命中次数与冷热属性
				rows.forEach(row => {
						const ruleBox = row.querySelector('.rule-box');
						if (!ruleBox) return;
						const ruleValue = ruleBox.textContent.trim();

						if (ruleValue === '?' || !ruleValue) return;

						const numBoxes = row.querySelectorAll('.num-box');
						if (numBoxes.length === 12) {
								numBoxes.forEach((box, index) => {
										if (box.textContent.trim() === ruleValue) {
												const posKey = index + 1;
												posCounts[posKey]++;

												if (box.classList.contains('hot')) posTempCounts[posKey].hot++;
												else if (box.classList.contains('warm')) posTempCounts[posKey].warm++;
												else if (box.classList.contains('cold')) posTempCounts[posKey].cold++;
										}
								});
						}
				});

				// 3. 基础分布与大盘趋势分析
				let frontHits = 0, backHits = 0;
				let oddHits = 0, evenHits = 0;

				for (let pos = 1; pos <= 12; pos++) {
						const count = posCounts[pos];
						if (pos <= 6) frontHits += count;
						else backHits += count;

						if (pos % 2 !== 0) oddHits += count;
						else evenHits += count;
				}

				const isFrontDominant = frontHits >= backHits;
				const isOddDominant = oddHits >= evenHits;

				// 4. 评分与排序
				let positionScores = [];

				for (let pos = 1; pos <= 12; pos++) {
						let score = posCounts[pos] * 1.5;

						const isPosFront = pos <= 6;
						if (isPosFront === isFrontDominant) score += 2;

						const isPosOdd = (pos % 2 !== 0);
						if (isPosOdd === isOddDominant) score += 2;

						const hotRatio = posCounts[pos] > 0 ? (posTempCounts[pos].hot / posCounts[pos]) : 0;
						score += hotRatio * 3;

						let tempAttr = "温";
						if (posTempCounts[pos].hot >= posTempCounts[pos].warm && posTempCounts[pos].hot >= posTempCounts[pos].cold) {
								tempAttr = "热";
						} else if (posTempCounts[pos].cold > posTempCounts[pos].warm && posTempCounts[pos].cold > posTempCounts[pos].hot) {
								tempAttr = "冷";
						}

						const spaceAttr = isPosFront ? "前" : "后";
						const parityAttr = isPosOdd ? "奇" : "偶";
						
						const zodiacName = latestZodiacs[pos] || `位${pos}`;
						const attrText = `位${pos}-${zodiacName} [${tempAttr}|${spaceAttr}|${parityAttr}](${posCounts[pos]}次)`;

						positionScores.push({ pos, score, hits: posCounts[pos], attrText });
				}

				positionScores.sort((a, b) => {
						if (b.score !== a.score) return b.score - a.score;
						return a.pos - b.pos;
				});

				// 5. 打印控制台日志
				// const goldenList = positionScores.slice(0, goldenCount);
				// const defendList = positionScores.slice(goldenCount, goldenCount + defendCount);
				const goldenNames = positionScores.slice(0, goldenCount).map(item => {
						const parts = item.attrText.split("-"); // 以 "-" 分割
						if (parts.length > 1) {
								// 拿 "-" 后面的第一部分，并只取它的第一个字符（或者按空格切开取首个词）
								return parts[1].trim().charAt(0); 
						}
						return "";
				}).join("");
				const defendNames = positionScores.slice(goldenCount, goldenCount + defendCount).map(item => {
						const parts = item.attrText.split("-");
						if (parts.length > 1) {
								return parts[1].trim().charAt(0);
						}
						return "";
				}).join("");

				console.log(`${goldenCount}：${goldenNames}`);
				console.log(`${defendCount}：${defendNames}`);

				// return positionScores;
		}
		// logThreeDimensionalRecommendation();

		/**
		 * 三维交叉智能动态推荐（纯数据版，不依赖 DOM）
		 * @param {Array} rawData - 包含所有期号数据的原始数组（如你上面提供的数组）
		 * @param {number} goldenCount - 主攻推荐数量（默认5位）
		 * @param {number} defendCount - 防守推荐数量（默认5位）
		 */
		function logThreeDimensionalRecommendationByData(rawData, goldenCount = 5, defendCount = 5) {
			if (!rawData || rawData.length === 0) {
					console.log("无有效原始数据");
					return;
			}

			// 1. 获取最新生肖映射（第 1 行作为 mockZodiacs）
			const firstRow = rawData[0];
			let latestZodiacs = {};
			if (firstRow && Array.isArray(firstRow.list)) {
					firstRow.list.forEach((zodiac, index) => {
							latestZodiacs[index + 1] = zodiac || `位${index + 1}`;
					});
			} else {
					for (let i = 1; i <= 12; i++) {
							latestZodiacs[i] = `位${i}`;
					}
			}

			// 2. 截取除去第一行后的前 30 行作为统计样本
			const rowsData = rawData.slice(1, 31);

			let posCounts = {};
			let posTempCounts = {}; 

			for (let i = 1; i <= 12; i++) {
					posCounts[i] = 0;
					posTempCounts[i] = { hot: 0, warm: 0, cold: 0 };
			}

			// 3. 统计各位置命中次数与冷热属性
			rowsData.forEach(row => {
					const ruleValue = row.rule ? row.rule.trim() : '';
					if (ruleValue === '?' || !ruleValue) return;

					const numList = row.list || [];
					if (numList.length === 12) {
							numList.forEach((item, index) => {
									if (item === ruleValue) {
											const posKey = index + 1;
											posCounts[posKey]++;

											// 根据你的规则：1-4为hot，5-8为warm，9-12为cold（下标 0-3, 4-7, 8-11）
											if (index >= 0 && index <= 3) {
													posTempCounts[posKey].hot++;
											} else if (index >= 4 && index <= 7) {
													posTempCounts[posKey].warm++;
											} else if (index >= 8 && index <= 11) {
													posTempCounts[posKey].cold++;
											}
									}
							});
					}
			});

			// 4. 基础分布与大盘趋势分析
			let frontHits = 0, backHits = 0;
			let oddHits = 0, evenHits = 0;

			for (let pos = 1; pos <= 12; pos++) {
					const count = posCounts[pos];
					if (pos <= 6) frontHits += count;
					else backHits += count;

					if (pos % 2 !== 0) oddHits += count;
					else evenHits += count;
			}

			const isFrontDominant = frontHits >= backHits;
			const isOddDominant = oddHits >= evenHits;

			// 5. 评分与排序
			let positionScores = [];

			for (let pos = 1; pos <= 12; pos++) {
					let score = posCounts[pos] * 1.5;

					const isPosFront = pos <= 6;
					if (isPosFront === isFrontDominant) score += 2;

					const isPosOdd = (pos % 2 !== 0);
					if (isPosOdd === isOddDominant) score += 2;

					const hotRatio = posCounts[pos] > 0 ? (posTempCounts[pos].hot / posCounts[pos]) : 0;
					score += hotRatio * 3;

					let tempAttr = "温";
					if (posTempCounts[pos].hot >= posTempCounts[pos].warm && posTempCounts[pos].hot >= posTempCounts[pos].cold) {
							tempAttr = "热";
					} else if (posTempCounts[pos].cold > posTempCounts[pos].warm && posTempCounts[pos].cold > posTempCounts[pos].hot) {
							tempAttr = "冷";
					}

					const spaceAttr = isPosFront ? "前" : "后";
					const parityAttr = isPosOdd ? "奇" : "偶";
					
					const zodiacName = latestZodiacs[pos] || `位${pos}`;
					const attrText = `位${pos}-${zodiacName} [${tempAttr}|${spaceAttr}|${parityAttr}](${posCounts[pos]}次)`;

					positionScores.push({ pos, score, hits: posCounts[pos], attrText });
			}

			positionScores.sort((a, b) => {
					if (b.score !== a.score) return b.score - a.score;
					return a.pos - b.pos;
			});

			// 6. 提取名称并打印控制台日志
			const goldenNames = positionScores.slice(0, goldenCount).map(item => {
					const parts = item.attrText.split("-");
					if (parts.length > 1) {
							return parts[1].trim().charAt(0); 
					}
					return "";
			}).join("");

			const defendNames = positionScores.slice(goldenCount, goldenCount + defendCount).map(item => {
					const parts = item.attrText.split("-");
					if (parts.length > 1) {
							return parts[1].trim().charAt(0);
					}
					return "";
			}).join("");

			// console.log(`${goldenCount}：${goldenNames}`);
			// console.log(`${defendCount}：${defendNames}`);

			const partsArray = [
					rawData[0].qihao, 
					goldenNames.slice(0, 3), 
					goldenNames.slice(3, 5), 
					goldenNames.slice(0, 1), 
					goldenNames.slice(1, 6), 
					goldenNames.slice(0, 5), 
					goldenNames.slice(5, 10), 
					defendNames, 
					rawData[0].rule === '?' ? '-' : rawData[0].rule
			];
			return partsArray;

			// return positionScores;
		}
		// for (let i = 31; i >= 0; i--) {
		// 		logThreeDimensionalRecommendationByData(rawData.slice(0+i, 31+i), 10, 2);
		// }
		const arr_he7 = [];
		for (let i = 20; i >= 0; i--) {
				arr_he7.push(logThreeDimensionalRecommendationByData(rawData.slice(0+i, 31+i), 10, 2));
		}

		/**
		 * 渲染 arr_he7 表格的通用方法（参数化注码与赔率优化版 - 增设“倍数(1-3-7循环)”行）
		 * @param {Array} data 数据源
		 * @param {string} tableId 表格 DOM 元素的 ID（默认 'arr-he7-table'）
		 * @param {number} stake 注码（默认 10）
		 * @param {number} odds 赔率（默认 10）
		 */
		function renderArrHe7Table(data, tableId = 'arr-he7-table', stake = 10, odds = 10) {
				const table = document.getElementById(tableId);
				if (!table) return;

				if (!data || !Array.isArray(data) || data.length === 0) {
						table.innerHTML = '<tr><td style="padding: 12px; color: #888; text-align: center;">数据为空或未定义</td></tr>';
						return;
				}

				if (table.parentElement && !table.parentElement.style.overflowX) {
						table.parentElement.style.overflowX = 'auto';
						table.parentElement.style.webkitOverflowScrolling = 'touch';
				}

				const firstItem = data[0];
				let headerHtml = '';
				let bodyHtml = '';

				const isObjectArray = (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem));

				function highlightMatch(text, rule) {
						if (!rule || rule === '-' || !text) return text;
						const escapedRule = rule.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
						const regex = new RegExp(`(${escapedRule})`, 'g');
						return text.replace(regex, '<span style="color: red; font-weight: bold;">$1</span>');
				}

				// 1-3-7 倍投状态机辅助函数：根据当前错误次数获取倍数，并更新下一次的错误次数
				const multiSteps = [1, 3, 7];
				function calcStepProfitAndUpdateState(stateObj, key, isHit, charCount) {
						let errCount = stateObj[key] || 0;
						let currentMult = multiSteps[errCount]; // 当前这一把的倍数 (1, 3 或 7)
						let actualStake = stake * currentMult;  // 当前这一把的实际注码

						// 计算本把盈亏（与原盈利公式完全一致，仅替换 stake 为 actualStake）
						let profit = isHit ? (actualStake * odds - actualStake * charCount) : (-actualStake * charCount);

						// 更新下一把的状态：中了直接还原(0)，错了累加，满3次(errCount >= 2后再错)还原(0)
						if (isHit) {
								stateObj[key] = 0;
						} else {
								stateObj[key] = (errCount + 1) % 3;
						}

						return profit;
				}

				const thStyle = "border: 1px solid #ddd; padding: 7px 5px; color: #333; font-weight: bold; text-align: center; font-size: 11px;";
				const tdStyle = "border: 1px solid #ddd; padding: 6px 5px; color: #555; text-align: center; font-size: 11px;";
				const summaryTdStyle = "border: 1px solid #ddd; padding: 6px 5px; color: #d9363e; font-weight: bold; text-align: center; font-size: 11px; background: #fafafa; vertical-align: middle;";
				
				// 命中单元格的背景标注样式
				const hitBgStyle = "background: #fff1f0;";

				if (isObjectArray) {
						// --- 对象数组渲染逻辑 ---
						let keys = Object.keys(firstItem);
						const hasIndexField = keys.some(k => ['index', 'xuhao', 'id'].includes(k.toLowerCase()));
						const renderKeys = hasIndexField ? [...keys] : ['xuhao', ...keys];

						const splitColumns = ['推荐3-2', '推荐1-5', '推荐5-5', 'tj32', 'rec32', 'tj15', 'rec15', 'tj55', 'rec55'];
						const fieldLabels = {
								'index': '序号', 'xuhao': '序号', 'id': '序号',
								'qihao': '期数', 'period': '期数',
								'tj32': '推荐3-2', 'rec32': '推荐3-2',
								'tj15': '推荐1-5', 'rec15': '推荐1-5',
								'tj55': '推荐5-5', 'rec55': '推荐5-5',
								'lengmen': '冷门', 'cold': '冷门',
								'guize': '规则', 'rule': '规则'
						};

						headerHtml = `<thead style="background: #fafafa; position: sticky; top: 0; z-index: 1;"><tr>`;
						renderKeys.forEach(key => {
								const lowerKey = key.toLowerCase();
								const label = fieldLabels[lowerKey] || fieldLabels[key] || key;
								if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
										headerHtml += `<th style="${thStyle}" colspan="2">${label}</th>`;
								} else {
										headerHtml += `<th style="${thStyle}">${label}</th>`;
								}
						});
						headerHtml += '</tr></thead><tbody>';

						let validRowsCount = 0;
						let statsHits = {};
						let statsProfit = {}; 
						let statsMultProfit = {}; // 倍数盈亏统计
						let errStates = {};       // 记录各列当前的连错次数 (0, 1, 2)

						let prevItem = null;
						data.forEach((item, rowIndex) => {
								const currentRuleVal = String(item['rule'] !== undefined ? item['rule'] : (item['guize'] || item['规则'] || '')).trim();
								const isValidRule = (currentRuleVal !== '' && currentRuleVal !== '-');

								if (isValidRule) validRowsCount++;

								bodyHtml += '<tr>';
								renderKeys.forEach(key => {
										let val;
										if (key === 'xuhao' && !hasIndexField) {
												val = rowIndex + 1;
										} else {
												val = item[key];
										}

										const lowerKey = key.toLowerCase();
										let isRuleField = ['rule', 'guize', '规则'].includes(lowerKey) || ['rule', 'guize', '规则'].includes(key);
										let isSameAsPrevious = false;

										if (isRuleField && prevItem) {
												const prevRuleVal = prevItem[key] !== undefined ? prevItem[key] : (prevItem['rule'] || prevItem['guize'] || prevItem['规则']);
												if (val !== undefined && val !== '' && val === prevRuleVal) {
														isSameAsPrevious = true;
												}
										}

										if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
												let sub1 = '', sub2 = '';
												if (Array.isArray(val)) {
														sub1 = val[0] !== undefined ? String(val[0]).trim() : '';
														sub2 = val[1] !== undefined ? String(val[1]).trim() : '';
												} else if (typeof val === 'string' && val.includes(',')) {
														const parts = val.split(',');
														sub1 = parts[0].trim();
														sub2 = parts[1] ? parts[1].trim() : '';
												} else {
														sub1 = val !== undefined && val !== null ? String(val).trim() : '';
														sub2 = '';
												}

												let hit1 = false, hit2 = false;
												if (isValidRule) {
														hit1 = (sub1 && sub1.includes(currentRuleVal));
														hit2 = (sub2 && sub2.includes(currentRuleVal));

														if (hit1) statsHits[key + '_sub1'] = (statsHits[key + '_sub1'] || 0) + 1;
														if (hit2) statsHits[key + '_sub2'] = (statsHits[key + '_sub2'] || 0) + 1;
														if (hit1 || hit2) statsHits[key + '_comb'] = (statsHits[key + '_comb'] || 0) + 1;

														let count1 = sub1.length;
														if (count1 > 0) {
																statsProfit[key + '_sub1'] = (statsProfit[key + '_sub1'] || 0) + (hit1 ? (stake * odds - stake * count1) : (-stake * count1));
																statsMultProfit[key + '_sub1'] = (statsMultProfit[key + '_sub1'] || 0) + calcStepProfitAndUpdateState(errStates, key + '_sub1', hit1, count1);
														}
														let count2 = sub2.length;
														if (count2 > 0) {
																statsProfit[key + '_sub2'] = (statsProfit[key + '_sub2'] || 0) + (hit2 ? (stake * odds - stake * count2) : (-stake * count2));
																statsMultProfit[key + '_sub2'] = (statsMultProfit[key + '_sub2'] || 0) + calcStepProfitAndUpdateState(errStates, key + '_sub2', hit2, count2);
														}
														let totalCombCount = count1 + count2;
														if (totalCombCount > 0) {
																let isCombHit = (hit1 || hit2);
																statsProfit[key + '_comb'] = (statsProfit[key + '_comb'] || 0) + (isCombHit ? (stake * odds - stake * totalCombCount) : (-stake * totalCombCount));
																statsMultProfit[key + '_comb'] = (statsMultProfit[key + '_comb'] || 0) + calcStepProfitAndUpdateState(errStates, key + '_comb', isCombHit, totalCombCount);
														}
												}

												let bg1 = hit1 ? hitBgStyle : "";
												let bg2 = hit2 ? hitBgStyle : "";
												bodyHtml += `<td style="${tdStyle} ${bg1}">${highlightMatch(sub1, currentRuleVal)}</td>`;
												bodyHtml += `<td style="${tdStyle} ${bg2}">${highlightMatch(sub2, currentRuleVal)}</td>`;
										} else {
												let displayVal = Array.isArray(val) ? val.join(', ') : val;
												let cellStr = displayVal !== undefined && displayVal !== null ? String(displayVal).trim() : '';
												let isHit = false;

												if (isValidRule && !isRuleField && !['xuhao', 'qihao', 'period'].includes(lowerKey)) {
														isHit = (cellStr && cellStr.includes(currentRuleVal));
														if (isHit) statsHits[key] = (statsHits[key] || 0) + 1;
														let count = cellStr.length;
														if (count > 0) {
																statsProfit[key] = (statsProfit[key] || 0) + (isHit ? (stake * odds - stake * count) : (-stake * count));
																statsMultProfit[key] = (statsMultProfit[key] || 0) + calcStepProfitAndUpdateState(errStates, key, isHit, count);
														}
												}

												let hitBg = isHit ? hitBgStyle : "";

												if (isRuleField) {
														if (isSameAsPrevious) {
																bodyHtml += `<td style="${tdStyle} background-color: #fff3cd; color: #856404; font-weight: bold;">${cellStr} <span style="font-size: 9px; color: #e6a23c;">(同上)</span></td>`;
														} else {
																bodyHtml += `<td style="${tdStyle} font-weight: bold;">${cellStr}</td>`;
														}
												} else {
														bodyHtml += `<td style="${tdStyle} ${hitBg}">${highlightMatch(cellStr, currentRuleVal)}</td>`;
												}
										}
								});
								bodyHtml += '</tr>';
								prevItem = item;
						});

						const divisor = validRowsCount > 0 ? validRowsCount : 1;

						// 1. 正确率统计行
						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}" colspan="2" rowspan="2">正确率</td>`;
						
						renderKeys.slice(2).forEach(key => {
								const lowerKey = key.toLowerCase();
								let isRuleField = ['rule', 'guize', '规则'].includes(lowerKey) || ['rule', 'guize', '规则'].includes(key);
								let isLengmenField = ['lengmen', 'cold'].includes(lowerKey) || ['lengmen', 'cold'].includes(key);

								if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
										let h1 = statsHits[key + '_sub1'] || 0;
										let h2 = statsHits[key + '_sub2'] || 0;
										let p1 = ((h1 / divisor) * 100).toFixed(1);
										let p2 = ((h2 / divisor) * 100).toFixed(1);

										bodyHtml += `<td style="${summaryTdStyle}">${h1}/${validRowsCount} (${p1}%)</td>`;
										bodyHtml += `<td style="${summaryTdStyle}">${h2}/${validRowsCount} (${p2}%)</td>`;
								} else if (isRuleField || isLengmenField) {
										let h = statsHits[key] || 0;
										let p = isLengmenField ? ` (${((h / divisor) * 100).toFixed(1)}%)` : '';
										let valStr = isLengmenField ? `${h}/${validRowsCount}${p}` : `-`;
										bodyHtml += `<td style="${summaryTdStyle}" rowspan="2">${valStr}</td>`;
								} else {
										let h = statsHits[key] || 0;
										let p = ((h / divisor) * 100).toFixed(1);
										bodyHtml += `<td style="${summaryTdStyle}">${h}/${validRowsCount} (${p}%)</td>`;
								}
						});
						bodyHtml += `</tr>`;

						// 组合正确率行
						bodyHtml += `<tr style="background: #fafafa;">`;
						renderKeys.slice(2).forEach(key => {
								const lowerKey = key.toLowerCase();
								let isRuleField = ['rule', 'guize', '规则'].includes(lowerKey) || ['rule', 'guize', '规则'].includes(key);
								let isLengmenField = ['lengmen', 'cold'].includes(lowerKey) || ['lengmen', 'cold'].includes(key);

								if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
										let hComb = statsHits[key + '_comb'] || 0;
										let pComb = ((hComb / divisor) * 100).toFixed(1);
										let combName = "组合";
										if (lowerKey.includes('32') || key.includes('3-2')) combName = "3+2";
										else if (lowerKey.includes('15') || key.includes('1-5')) combName = "1+5";
										else if (lowerKey.includes('55') || key.includes('5-5')) combName = "5+5";

										bodyHtml += `<td style="${summaryTdStyle}; color: #1890ff;" colspan="2">${combName}: ${hComb}/${validRowsCount} (${pComb}%)</td>`;
								} else if (!isRuleField && !isLengmenField) {
										bodyHtml += `<td style="${summaryTdStyle}"></td>`;
								}
						});
						bodyHtml += `</tr>`;

						// 2. 盈利统计行
						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}" colspan="2" rowspan="2">盈利</td>`;
						
						renderKeys.slice(2).forEach(key => {
								const lowerKey = key.toLowerCase();
								let isRuleField = ['rule', 'guize', '规则'].includes(lowerKey) || ['rule', 'guize', '规则'].includes(key);
								let isLengmenField = ['lengmen', 'cold'].includes(lowerKey) || ['lengmen', 'cold'].includes(key);

								if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
										let prof1 = statsProfit[key + '_sub1'] || 0;
										let prof2 = statsProfit[key + '_sub2'] || 0;
										let c1 = prof1 >= 0 ? '#52c41a' : '#f5222d';
										let c2 = prof2 >= 0 ? '#52c41a' : '#f5222d';

										bodyHtml += `<td style="${summaryTdStyle} color: ${c1};">${prof1}</td>`;
										bodyHtml += `<td style="${summaryTdStyle} color: ${c2};">${prof2}</td>`;
								} else if (isRuleField || isLengmenField) {
										let prof = statsProfit[key] || 0;
										let color = prof >= 0 ? '#52c41a' : '#f5222d';
										let valStr = isLengmenField ? `<span style="color: ${color};">${prof}</span>` : `-`;
										bodyHtml += `<td style="${summaryTdStyle}" rowspan="2">${valStr}</td>`;
								} else {
										let prof = statsProfit[key] || 0;
										let color = prof >= 0 ? '#52c41a' : '#f5222d';
										bodyHtml += `<td style="${summaryTdStyle} color: ${color};">${prof}</td>`;
								}
						});
						bodyHtml += `</tr>`;

						// 组合盈利行
						bodyHtml += `<tr style="background: #fafafa;">`;
						renderKeys.slice(2).forEach(key => {
								const lowerKey = key.toLowerCase();
								let isRuleField = ['rule', 'guize', '规则'].includes(lowerKey) || ['rule', 'guize', '规则'].includes(key);
								let isLengmenField = ['lengmen', 'cold'].includes(lowerKey) || ['lengmen', 'cold'].includes(key);

								if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
										let profComb = statsProfit[key + '_comb'] || 0;
										let cComb = profComb >= 0 ? '#52c41a' : '#f5222d';
										let combName = "组合";
										if (lowerKey.includes('32') || key.includes('3-2')) combName = "3+2";
										else if (lowerKey.includes('15') || key.includes('1-5')) combName = "1+5";
										else if (lowerKey.includes('55') || key.includes('5-5')) combName = "5+5";

										bodyHtml += `<td style="${summaryTdStyle}; color: ${cComb};" colspan="2">${combName}: ${profComb}</td>`;
								} else if (!isRuleField && !isLengmenField) {
										bodyHtml += `<td style="${summaryTdStyle}"></td>`;
								}
						});
						bodyHtml += `</tr>`;

						// 3. 倍数统计行 (1 -> 3 -> 7 -> 1 循环倍投)
						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}" colspan="2" rowspan="2">倍数137</td>`;
						
						renderKeys.slice(2).forEach(key => {
								const lowerKey = key.toLowerCase();
								let isRuleField = ['rule', 'guize', '规则'].includes(lowerKey) || ['rule', 'guize', '规则'].includes(key);
								let isLengmenField = ['lengmen', 'cold'].includes(lowerKey) || ['lengmen', 'cold'].includes(key);

								if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
										let mp1 = statsMultProfit[key + '_sub1'] || 0;
										let mp2 = statsMultProfit[key + '_sub2'] || 0;
										let c1 = mp1 >= 0 ? '#52c41a' : '#f5222d';
										let c2 = mp2 >= 0 ? '#52c41a' : '#f5222d';

										bodyHtml += `<td style="${summaryTdStyle} color: ${c1};">${mp1}</td>`;
										bodyHtml += `<td style="${summaryTdStyle} color: ${c2};">${mp2}</td>`;
								} else if (isRuleField || isLengmenField) {
										let mp = statsMultProfit[key] || 0;
										let color = mp >= 0 ? '#52c41a' : '#f5222d';
										let valStr = isLengmenField ? `<span style="color: ${color};">${mp}</span>` : `-`;
										bodyHtml += `<td style="${summaryTdStyle}" rowspan="2">${valStr}</td>`;
								} else {
										let mp = statsMultProfit[key] || 0;
										let color = mp >= 0 ? '#52c41a' : '#f5222d';
										bodyHtml += `<td style="${summaryTdStyle} color: ${color};">${mp}</td>`;
								}
						});
						bodyHtml += `</tr>`;

						// 组合倍数行
						bodyHtml += `<tr style="background: #fafafa;">`;
						renderKeys.slice(2).forEach(key => {
								const lowerKey = key.toLowerCase();
								let isRuleField = ['rule', 'guize', '规则'].includes(lowerKey) || ['rule', 'guize', '规则'].includes(key);
								let isLengmenField = ['lengmen', 'cold'].includes(lowerKey) || ['lengmen', 'cold'].includes(key);

								if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
										let mpComb = statsMultProfit[key + '_comb'] || 0;
										let cComb = mpComb >= 0 ? '#52c41a' : '#f5222d';
										let combName = "组合";
										if (lowerKey.includes('32') || key.includes('3-2')) combName = "3+2";
										else if (lowerKey.includes('15') || key.includes('1-5')) combName = "1+5";
										else if (lowerKey.includes('55') || key.includes('5-5')) combName = "5+5";

										bodyHtml += `<td style="${summaryTdStyle}; color: ${cComb};" colspan="2">${combName}倍数: ${mpComb}</td>`;
								} else if (!isRuleField && !isLengmenField) {
										bodyHtml += `<td style="${summaryTdStyle}"></td>`;
								}
						});
						bodyHtml += `</tr>`;
						bodyHtml += '</tbody>';

				} else {
						// --- 二维数组渲染逻辑 ---
						const headers = ['序号', '期数', '推荐3-2', '推荐1-5', '推荐5-5', '冷门', '规则'];

						headerHtml = `<thead style="background: #fafafa; position: sticky; top: 0; z-index: 1;"><tr>`;
						headers.forEach(h => {
								if (['推荐3-2', '推荐1-5', '推荐5-5'].includes(h)) {
										headerHtml += `<th style="${thStyle}" colspan="2">${h}</th>`;
								} else {
										headerHtml += `<th style="${thStyle}">${h}</th>`;
								}
						});
						headerHtml += '</tr></thead><tbody>';

						let validRowsCount = 0;
						let colHits = [0, 0, 0, 0, 0, 0, 0]; 
						let colProfits = [0, 0, 0, 0, 0, 0, 0]; 
						let colMultProfits = [0, 0, 0, 0, 0, 0, 0]; // 各列倍数盈亏
						let combHits32 = 0, combHits15 = 0, combHits55 = 0;
						let combProfit32 = 0, combProfit15 = 0, combProfit55 = 0;
						let combMultProfit32 = 0, combMultProfit15 = 0, combMultProfit55 = 0;
						let errStatesArr = {}; // 二维数组各列连错状态

						let prevRow = null;
						data.forEach((row, rowIndex) => {
								bodyHtml += '<tr>';
								if (Array.isArray(row)) {
										let renderRow = [rowIndex + 1, ...row]; 
										let currentRule = String(renderRow[renderRow.length - 1] || '').trim();
										let isValidRule = (currentRule !== '' && currentRule !== '-');

										if (isValidRule) validRowsCount++;

										let prevRule = (prevRow && prevRow.length > 0) ? String(prevRow[prevRow.length - 1] || '').trim() : null;
										let isSameRuleAsPrev = (currentRule !== '' && currentRule === prevRule);

										for (let i = 2; i <= 8; i++) {
												let cellText = String(renderRow[i] || '').trim();
												let isHit = isValidRule && cellText.includes(currentRule);
												let count = cellText.length;

												if (isHit) colHits[i - 2]++;
												if (isValidRule && count > 0) {
														colProfits[i - 2] += isHit ? (stake * odds - stake * count) : (-stake * count);
														colMultProfits[i - 2] += calcStepProfitAndUpdateState(errStatesArr, 'col_' + i, isHit, count);
												}
										}

										let h32_1 = isValidRule && String(renderRow[2]).includes(currentRule);
										let h32_2 = isValidRule && String(renderRow[3]).includes(currentRule);
										let h15_1 = isValidRule && String(renderRow[4]).includes(currentRule);
										let h15_2 = isValidRule && String(renderRow[5]).includes(currentRule);
										let h55_1 = isValidRule && String(renderRow[6]).includes(currentRule);
										let h55_2 = isValidRule && String(renderRow[7]).includes(currentRule);

										if (isValidRule) {
												if (h32_1 || h32_2) combHits32++;
												if (h15_1 || h15_2) combHits15++;
												if (h55_1 || h55_2) combHits55++;

												let c32_len = String(renderRow[2]).trim().length + String(renderRow[3]).trim().length;
												if (c32_len > 0) {
														let isHit32 = (h32_1 || h32_2);
														combProfit32 += isHit32 ? (stake * odds - stake * c32_len) : (-stake * c32_len);
														combMultProfit32 += calcStepProfitAndUpdateState(errStatesArr, 'comb32', isHit32, c32_len);
												}
												let c15_len = String(renderRow[4]).trim().length + String(renderRow[5]).trim().length;
												if (c15_len > 0) {
														let isHit15 = (h15_1 || h15_2);
														combProfit15 += isHit15 ? (stake * odds - stake * c15_len) : (-stake * c15_len);
														combMultProfit15 += calcStepProfitAndUpdateState(errStatesArr, 'comb15', isHit15, c15_len);
												}
												let c55_len = String(renderRow[6]).trim().length + String(renderRow[7]).trim().length;
												if (c55_len > 0) {
														let isHit55 = (h55_1 || h55_2);
														combProfit55 += isHit55 ? (stake * odds - stake * c55_len) : (-stake * c55_len);
														combMultProfit55 += calcStepProfitAndUpdateState(errStatesArr, 'comb55', isHit55, c55_len);
												}
										}

										renderRow.forEach((cell, idx) => {
												let cellStr = cell !== undefined && cell !== null ? String(cell).trim() : '';
												let isRuleCol = (idx === renderRow.length - 1);
												let isPeriodCol = (idx === 1);
												let isIndexCol = (idx === 0);

												if (isRuleCol) {
														if (isSameRuleAsPrev) {
																bodyHtml += `<td style="${tdStyle} background-color: #fff3cd; color: #856404; font-weight: bold;">${cellStr} <span style="font-size: 9px; color: #e6a23c;">(同上)</span></td>`;
														} else {
																bodyHtml += `<td style="${tdStyle} font-weight: bold;">${cellStr}</td>`;
														}
												} else if (isIndexCol || isPeriodCol) {
														bodyHtml += `<td style="${tdStyle}">${cellStr}</td>`;
												} else {
														let isHit = isValidRule && cellStr.includes(currentRule);
														let hitBg = isHit ? hitBgStyle : "";
														bodyHtml += `<td style="${tdStyle} ${hitBg}">${highlightMatch(cellStr, currentRule)}</td>`;
												}
										});
								} else {
										bodyHtml += `<td style="${tdStyle}" colspan="10">${row}</td>`;
								}
								bodyHtml += '</tr>';
								prevRow = row;
						});

						const divisor = validRowsCount > 0 ? validRowsCount : 1;
						let p32 = ((combHits32 / divisor) * 100).toFixed(1);
						let p15 = ((combHits15 / divisor) * 100).toFixed(1);
						let p55 = ((combHits55 / divisor) * 100).toFixed(1);

						// 1. 正确率统计行
						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}" colspan="2" rowspan="2">正确率</td>`;
						
						for(let i = 0; i < 6; i++) {
								let h = colHits[i];
								let p = ((h / divisor) * 100).toFixed(1);
								bodyHtml += `<td style="${summaryTdStyle}">${h}/${validRowsCount} (${p}%)</td>`;
						}

						let lengmen_p = ((colHits[6] / divisor) * 100).toFixed(1);
						bodyHtml += `<td style="${summaryTdStyle}" rowspan="2">${colHits[6]}/${validRowsCount} (${lengmen_p}%)</td>`;
						bodyHtml += `<td style="${summaryTdStyle}" rowspan="2">-</td>`;
						bodyHtml += `</tr>`;

						// 组合正确率跨列行
						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}; color: #1890ff;" colspan="2">3+2 组合: ${combHits32}/${validRowsCount} (${p32}%)</td>`;
						bodyHtml += `<td style="${summaryTdStyle}; color: #1890ff;" colspan="2">1+5 组合: ${combHits15}/${validRowsCount} (${p15}%)</td>`;
						bodyHtml += `<td style="${summaryTdStyle}; color: #1890ff;" colspan="2">5+5 组合: ${combHits55}/${validRowsCount} (${p55}%)</td>`;
						bodyHtml += `</tr>`;

						// 2. 盈利统计行
						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}" colspan="2" rowspan="2">盈利</td>`;
						for(let i = 0; i < 6; i++) {
								let prof = colProfits[i];
								let color = prof >= 0 ? '#52c41a' : '#f5222d';
								bodyHtml += `<td style="${summaryTdStyle} color: ${color};">${prof}</td>`;
						}
						let prof6 = colProfits[6];
						let c6 = prof6 >= 0 ? '#52c41a' : '#f5222d';
						bodyHtml += `<td style="${summaryTdStyle} color: ${c6};" rowspan="2">${prof6}</td>`;
						bodyHtml += `<td style="${summaryTdStyle}" rowspan="2">-</td>`;
						bodyHtml += `</tr>`;

						// 组合盈利跨列行
						let cbp32_c = combProfit32 >= 0 ? '#52c41a' : '#f5222d';
						let cbp15_c = combProfit15 >= 0 ? '#52c41a' : '#f5222d';
						let cbp55_c = combProfit55 >= 0 ? '#52c41a' : '#f5222d';

						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}; color: ${cbp32_c};" colspan="2">3+2 组合盈利: ${combProfit32}</td>`;
						bodyHtml += `<td style="${summaryTdStyle}; color: ${cbp15_c};" colspan="2">1+5 组合盈利: ${combProfit15}</td>`;
						bodyHtml += `<td style="${summaryTdStyle}; color: ${cbp55_c};" colspan="2">5+5 组合盈利: ${combProfit55}</td>`;
						bodyHtml += `</tr>`;

						// 3. 倍数统计行 (1 -> 3 -> 7 -> 1 循环倍投)
						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}" colspan="2" rowspan="2">倍数137</td>`;
						for(let i = 0; i < 6; i++) {
								let mp = colMultProfits[i];
								let color = mp >= 0 ? '#52c41a' : '#f5222d';
								bodyHtml += `<td style="${summaryTdStyle} color: ${color};">${mp}</td>`;
						}
						let mp6 = colMultProfits[6];
						let mc6 = mp6 >= 0 ? '#52c41a' : '#f5222d';
						bodyHtml += `<td style="${summaryTdStyle} color: ${mc6};" rowspan="2">${mp6}</td>`;
						bodyHtml += `<td style="${summaryTdStyle}" rowspan="2">-</td>`;
						bodyHtml += `</tr>`;

						// 组合倍数跨列行
						let cbm32_c = combMultProfit32 >= 0 ? '#52c41a' : '#f5222d';
						let cbm15_c = combMultProfit15 >= 0 ? '#52c41a' : '#f5222d';
						let cbm55_c = combMultProfit55 >= 0 ? '#52c41a' : '#f5222d';

						bodyHtml += `<tr style="background: #fafafa;">`;
						bodyHtml += `<td style="${summaryTdStyle}; color: ${cbm32_c};" colspan="2">3+2 组合倍数: ${combMultProfit32}</td>`;
						bodyHtml += `<td style="${summaryTdStyle}; color: ${cbm15_c};" colspan="2">1+5 组合倍数: ${combMultProfit15}</td>`;
						bodyHtml += `<td style="${summaryTdStyle}; color: ${cbm55_c};" colspan="2">5+5 组合倍数: ${combMultProfit55}</td>`;
						bodyHtml += `</tr>`;

						bodyHtml += '</tbody>';
				}

				table.innerHTML = headerHtml + bodyHtml;
		}
		// 初始化数据加载
		if (typeof arr_he7 !== 'undefined') {
				renderArrHe7Table(arr_he7, 'arr-he7-table', 10, 10);
		}

		const observer = new MutationObserver(calcAllAndRecommend);
		observer.observe(topContainer, { childList: true, subtree: true });

		setTimeout(calcAllAndRecommend, 300);
});
