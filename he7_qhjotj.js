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
		logThreeDimensionalRecommendation();

		const observer = new MutationObserver(calcAllAndRecommend);
		observer.observe(topContainer, { childList: true, subtree: true });

		setTimeout(calcAllAndRecommend, 300);
});
