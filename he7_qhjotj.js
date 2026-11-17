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
		for (let i = 31; i >= 0; i--) {
				arr_he7.push(logThreeDimensionalRecommendationByData(rawData.slice(0+i, 31+i), 10, 2));
		}

		/**
		 * 渲染 arr_he7 表格的通用方法
		 * 自动将“推荐3-2”、“推荐1-5”、“推荐5-5”拆分为双子列展示
		 * @param {Array} data - 数据源（支持对象数组或二维数组）
		 * @param {string} tableId - 表格 DOM 元素的 ID（默认 'arr-he7-table'）
		 */
		function renderArrHe7Table(data, tableId = 'arr-he7-table') {
			const table = document.getElementById(tableId);
			if (!table) return;

			if (!data || !Array.isArray(data) || data.length === 0) {
					table.innerHTML = '<tr><td style="padding: 10px; color: #888;">数据为空或未定义</td></tr>';
					return;
			}

			// 需要拆分为两列展示的字段列表
			const splitColumns = ['推荐3-2', '推荐1-5', '推荐5-5', 'tj32', 'rec32', 'tj15', 'rec15', 'tj55', 'rec55'];

			let headerHtml = '';
			let bodyHtml = '';

			// 字段中文表头映射
			const fieldLabels = {
					'index': '序号', 'xuhao': '序号', 'id': '序号',
					'qihao': '期数', 'period': '期数',
					'tj32': '推荐3-2', 'rec32': '推荐3-2',
					'tj15': '推荐1-5', 'rec15': '推荐1-5',
					'tj55': '推荐5-5', 'rec55': '推荐5-5',
					'lengmen': '冷门', 'cold': '冷门',
					'guize': '规则', 'rule': '规则'
			};

			// 判断是否为对象数组
			if (typeof data[0] === 'object' && data[0] !== null && !Array.isArray(data[0])) {
					const keys = Object.keys(data[0]);
					
					// 第一行表头（包含合并单元格）
					headerHtml = '<thead style="background: #fafafa; position: sticky; top: 0; z-index: 1;"><tr>';
					keys.forEach(key => {
							const lowerKey = key.toLowerCase();
							const label = fieldLabels[lowerKey] || key;
							if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
									headerHtml += `<th style="border: 1px solid #ddd; padding: 6px; color: #333; font-weight: bold;" colspan="2">${label}</th>`;
							} else {
									headerHtml += `<th style="border: 1px solid #ddd; padding: 6px; color: #333; font-weight: bold;" rowspan="2">${label}</th>`;
							}
					});
					headerHtml += '</tr><tr>';
					
					// 第二行子列表头（针对拆分列）
					keys.forEach(key => {
							const lowerKey = key.toLowerCase();
							if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
									headerHtml += `<th style="border: 1px solid #ddd; padding: 4px; color: #666; font-size: 10px; background: #f0f0f0;">子列1</th>`;
									headerHtml += `<th style="border: 1px solid #ddd; padding: 4px; color: #666; font-size: 10px; background: #f0f0f0;">子列2</th>`;
							}
					});
					headerHtml += '</tr></thead><tbody>';

					// 填充数据行
					data.forEach(item => {
							bodyHtml += '<tr>';
							keys.forEach(key => {
									let val = item[key];
									const lowerKey = key.toLowerCase();
									
									if (splitColumns.includes(lowerKey) || splitColumns.includes(key)) {
											let sub1 = '', sub2 = '';
											if (Array.isArray(val)) {
													sub1 = val[0] !== undefined ? val[0] : '';
													sub2 = val[1] !== undefined ? val[1] : '';
											} else if (typeof val === 'string' && val.includes(',')) {
													const parts = val.split(',');
													sub1 = parts[0].trim();
													sub2 = parts[1] ? parts[1].trim() : '';
											} else {
													sub1 = val !== undefined && val !== null ? val : '';
													sub2 = '';
											}
											bodyHtml += `<td style="border: 1px solid #ddd; padding: 5px; color: #555;">${sub1}</td>`;
											bodyHtml += `<td style="border: 1px solid #ddd; padding: 5px; color: #555;">${sub2}</td>`;
									} else {
											if (Array.isArray(val)) val = val.join(', ');
											bodyHtml += `<td style="border: 1px solid #ddd; padding: 5px; color: #555;">${val !== undefined && val !== null ? val : ''}</td>`;
									}
							});
							bodyHtml += '</tr>';
					});
					bodyHtml += '</tbody>';
			} else {
					// 二维数组兜底渲染
					const headers = ['序号', '期数', '推荐3-2 (1)', '推荐3-2 (2)', '推荐1-5 (1)', '推荐1-5 (2)', '推荐5-5 (1)', '推荐5-5 (2)', '冷门', '规则'];
					headerHtml = '<thead style="background: #fafafa; position: sticky; top: 0; z-index: 1;"><tr>';
					headers.forEach(h => {
							headerHtml += `<th style="border: 1px solid #ddd; padding: 6px; color: #333; font-weight: bold;">${h}</th>`;
					});
					headerHtml += '</tr></thead><tbody>';

					data.forEach(row => {
							bodyHtml += '<tr>';
							if (Array.isArray(row)) {
									row.forEach((cell, idx) => {
											if ([2, 3, 4].includes(idx) && (Array.isArray(cell) || (typeof cell === 'string' && cell.includes(',')))) {
													let parts = Array.isArray(cell) ? cell : cell.split(',');
													bodyHtml += `<td style="border: 1px solid #ddd; padding: 5px; color: #555;">${parts[0] !== undefined ? parts[0].trim() : ''}</td>`;
													bodyHtml += `<td style="border: 1px solid #ddd; padding: 5px; color: #555;">${parts[1] !== undefined ? parts[1].trim() : ''}</td>`;
											} else {
													bodyHtml += `<td style="border: 1px solid #ddd; padding: 5px; color: #555;">${cell !== undefined && cell !== null ? cell : ''}</td>`;
											}
									});
							} else {
									bodyHtml += `<td style="border: 1px solid #ddd; padding: 5px; color: #555;" colspan="${headers.length}">${row}</td>`;
							}
							bodyHtml += '</tr>';
					});
					bodyHtml += '</tbody>';
			}

			table.innerHTML = headerHtml + bodyHtml;
		}
		// 初始化数据加载
		if (typeof arr_he7 !== 'undefined') {
			renderArrHe7Table(arr_he7, 'arr-he7-table');
		}

		const observer = new MutationObserver(calcAllAndRecommend);
		observer.observe(topContainer, { childList: true, subtree: true });

		setTimeout(calcAllAndRecommend, 300);
});
