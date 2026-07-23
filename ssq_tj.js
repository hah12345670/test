// ==================== 模型核心逻辑 ====================
class LotteryModel {
	constructor(historicalData) {
			this.rawData = historicalData;
			this.redStats = {};
			this.blueStats = {};
			this.processedDraws = [];
			
			this._parseData();
			this._calculateStats();
	}

	_parseData() {
			for (let line of this.rawData) {
					let parts = line.split('|').map(p => p.trim());
					if (parts.length === 3) {
							this.processedDraws.push({
									issue: parts[0],
									red: parts[1].split(/\s+/),
									blue: parts[2]
							});
					}
			}
	}

	_calculateStats() {
			let redCountsTotal = {};
			let redCountsRecent10 = {};
			let blueCountsTotal = {};
			let blueCountsRecent10 = {};

			for (let i = 1; i <= 33; i++) {
					let key = String(i).padStart(2, '0');
					redCountsTotal[key] = 0;
					redCountsRecent10[key] = 0;
			}

			for (let i = 1; i <= 16; i++) {
					let key = String(i).padStart(2, '0');
					blueCountsTotal[key] = 0;
					blueCountsRecent10[key] = 0;
			}
			
			let recentPeriods = this.processedDraws.slice(0, 10);

			for (let draw of this.processedDraws) {
					for (let r of draw.red) {
							if (redCountsTotal.hasOwnProperty(r)) redCountsTotal[r] += 1;
					}
					if (blueCountsTotal.hasOwnProperty(draw.blue)) blueCountsTotal[draw.blue] += 1;
			}

			for (let draw of recentPeriods) {
					for (let r of draw.red) {
							if (redCountsRecent10.hasOwnProperty(r)) redCountsRecent10[r] += 1;
					}
					if (blueCountsRecent10.hasOwnProperty(draw.blue)) blueCountsRecent10[draw.blue] += 1;
			}

			for (let num in redCountsTotal) {
					let recentC = redCountsRecent10[num];
					let attr = recentC >= 3 ? "热号" : (recentC >= 1 ? "温号" : "冷号");
					this.redStats[num] = {
							total_count: redCountsTotal[num],
							recent_count: recentC,
							attribute: attr
					};
			}

			for (let num in blueCountsTotal) {
					let totalC = blueCountsTotal[num];
					let recentC = blueCountsRecent10[num];
					let omission = 0;
					for (let draw of this.processedDraws) {
							if (draw.blue === num) break;
							omission += 1;
					}
					let attr = recentC >= 2 ? "热号" : (omission >= 8 ? "冷号" : "温号");
					this.blueStats[num] = {
							total_count: totalC,
							recent_count: recentC,
							omission: omission,
							attribute: attr
					};
			}
	}

	static calculateAc(reds) {
			let redInts = reds.map(r => parseInt(r, 10)).sort((a, b) => a - b);
			let diffs = new Set();
			for (let i = 0; i < redInts.length; i++) {
					for (let j = i + 1; j < redInts.length; j++) {
							diffs.add(Math.abs(redInts[i] - redInts[j]));
					}
			}
			return diffs.size - (redInts.length - 1);
	}

	static checkParity(reds) {
			let odds = reds.filter(r => parseInt(r, 10) % 2 !== 0).length;
			let evens = reds.length - odds;
			return `${odds}:${evens}`;
	}

	static checkZone(reds) {
			let z1 = reds.some(r => { let n = parseInt(r, 10); return n >= 1 && n <= 11; });
			let z2 = reds.some(r => { let n = parseInt(r, 10); return n >= 12 && n <= 22; });
			let z3 = reds.some(r => { let n = parseInt(r, 10); return n >= 23 && n <= 33; });
			return z1 && z2 && z3;
	}

	static checkConsecutive(reds) {
			let redInts = reds.map(r => parseInt(r, 10)).sort((a, b) => a - b);
			for (let i = 0; i < redInts.length - 2; i++) {
					if (redInts[i+1] === redInts[i] + 1 && redInts[i+2] === redInts[i] + 2) return true;
			}
			return false;
	}

	validateMorphology(reds) {
			let parity = LotteryModel.checkParity(reds);
			if (parity !== "4:2") return [false, `奇偶比不符合4:2 (${parity})`];
			if (!LotteryModel.checkZone(reds)) return [false, "三区分布不均衡（存在空区）"];
			if (LotteryModel.checkConsecutive(reds)) return [false, "包含三连号"];
			let ac = LotteryModel.calculateAc(reds);
			if (ac < 6) return [false, `AC值过低 (${ac} < 6)`];
			return [true, "形态校验通过"];
	}

	validateCombination(reds) {
			let [isValidMorph, msg] = this.validateMorphology(reds);
			if (!isValidMorph) return [false, msg];

			let attrs = reds.map(r => this.redStats[r].attribute);
			let hotCount = attrs.filter(a => a === "热号").length;
			let warmCount = attrs.filter(a => a === "温号").length;
			let coldCount = attrs.filter(a => a === "冷号").length;

			if (!(hotCount >= 2 && hotCount <= 3)) return [false, `热号数量不符 (${hotCount})`];
			if (warmCount !== 2) return [false, `温号数量不符 (${warmCount})`];
			if (!(coldCount >= 1 && coldCount <= 2)) return [false, `冷号数量不符 (${coldCount})`];

			return [true, "符合规则"];
	}

	static validateNumberRange(recommendations) {
			let totalRedsCount = 0;
			let validRangeCount = 0;
			for (let item of recommendations) {
					for (let r of item.red) {
							totalRedsCount += 1;
							let n = parseInt(r, 10);
							if (n >= 1 && n <= 33) validRangeCount += 1;
					}
			}
			if (totalRedsCount === 0) return [false, "推荐列表为空"];
			let ratio = validRangeCount / totalRedsCount;
			if (ratio < 0.97) return [false, `红球在1-33范围内的比例不足90%`];
			return [true, `红球范围达标率: ${(ratio * 100).toFixed(1)}%`];
	}

	validateRecentOverlap(reds) {
			if (this.processedDraws.length === 0) return true;
			let latestReds = this.processedDraws[0].red;
			let overlapCount = reds.filter(r => latestReds.includes(r)).length;
			return overlapCount >= 1 && overlapCount <= 2;
	}

	selectBlueBalls(count = 5) {
			let blueCandidates = Object.keys(this.blueStats);
			let hotBlues = blueCandidates.filter(b => this.blueStats[b].attribute === "热号");
			let warmBlues = blueCandidates.filter(b => this.blueStats[b].attribute === "温号");
			let coldBlues = blueCandidates.filter(b => this.blueStats[b].attribute === "冷号");
			if (hotBlues.length === 0) hotBlues = blueCandidates;
			if (warmBlues.length === 0) warmBlues = blueCandidates;
			
			let selectedBlues = [];
			for (let i = 0; i < count; i++) {
					let pools = [hotBlues, warmBlues, coldBlues.length > 0 ? coldBlues : warmBlues];
					let chosenPool = pools[Math.floor(Math.random() * pools.length)];
					let chosenB = chosenPool[Math.floor(Math.random() * chosenPool.length)];
					selectedBlues.push(chosenB);
			}
			return selectedBlues;
	}

	generateRecommendations(count = 5) {
			let hotPool = Object.keys(this.redStats).filter(num => this.redStats[num].attribute === "热号");
			let warmPool = Object.keys(this.redStats).filter(num => this.redStats[num].attribute === "温号");
			let coldPool = Object.keys(this.redStats).filter(num => this.redStats[num].attribute === "冷号");
			if (coldPool.length === 0) coldPool = warmPool;

			let validRedPools = [];
			let maxAttempts = 2000;

			for (let attempt = 0; attempt < maxAttempts; attempt++) {
					if (validRedPools.length >= 50) break;
					let numHot = Math.random() < 0.5 ? 2 : 3;
					let numCold = 6 - 2 - numHot;
					if (hotPool.length < numHot || warmPool.length < 2 || coldPool.length < numCold) continue;

					let selectedHot = [...hotPool].sort(() => 0.5 - Math.random()).slice(0, numHot);
					let selectedWarm = [...warmPool].sort(() => 0.5 - Math.random()).slice(0, 2);
					let selectedCold = [...coldPool].sort(() => 0.5 - Math.random()).slice(0, numCold);

					let combo = [...selectedHot, ...selectedWarm, ...selectedCold].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
					let comboKey = combo.join(',');

					let [isValid] = this.validateCombination(combo);
					if (!isValid) continue;
					if (!this.validateRecentOverlap(combo)) continue;

					if (!validRedPools.some(p => p.join(',') === comboKey)) {
							validRedPools.push(combo);
					}
			}

			if (validRedPools.length === 0) {
					throw new Error("未找到满足条件的组合，请重试。");
			}

			let selectedBlues = this.selectBlueBalls(count);
			let recommendations = [];
			let usedRedCombos = [];

			validRedPools.sort(() => 0.5 - Math.random());
			for (let candidate of validRedPools) {
					if (recommendations.length >= count) break;
					let overlapBetweenGroups = false;
					for (let existing of usedRedCombos) {
							let commonCount = candidate.filter(r => existing.includes(r)).length;
							if (commonCount > 2) { overlapBetweenGroups = true; break; }
					}

					if (!overlapBetweenGroups || usedRedCombos.length === 0) {
							usedRedCombos.push(candidate);
							let assignedBlue = selectedBlues[recommendations.length % selectedBlues.length];
							let bInfo = this.blueStats[assignedBlue];
							let latestReds = this.processedDraws.length > 0 ? this.processedDraws[0].red : [];
							let recentHit = candidate.filter(r => latestReds.includes(r)).length;
							let reason = `奇偶4:2均衡，AC值>=6，三区均布；与最新期重复 ${recentHit} 个，搭配${bInfo.attribute}蓝球${assignedBlue}(遗漏${bInfo.omission}期)。`;
							
							recommendations.push({ red: candidate, blue: assignedBlue, reason: reason });
					}
			}

			let [isRangeValid, rangeMsg] = LotteryModel.validateNumberRange(recommendations);
			if (!isRangeValid) throw new Error(rangeMsg);

			return recommendations;
	}
}

// ==================== 界面渲染绑定 ====================
function generateAndShow() {
	const fixedData = [
			"2026083 | 07 14 15 23 28 33 | 03",
			"2026082 | 05 07 10 14 21 28 | 04",
			"2026081 | 06 10 12 15 24 27 | 12",
			"2026080 | 04 05 11 19 27 32 | 01",
			"2026079 | 01 11 17 22 24 29 | 04",
			"2026078 | 07 11 14 16 27 28 | 06",
			"2026077 | 01 04 05 14 18 25 | 04",
			"2026076 | 01 03 19 20 24 25 | 07",
			"2026075 | 08 12 18 21 24 30 | 01",
			"2026074 | 02 23 24 26 28 32 | 04",
			"2026073 | 09 10 13 16 19 21 | 08",
			"2026072 | 07 08 12 15 17 21 | 01",
			"2026071 | 03 08 19 25 31 33 | 05",
			"2026070 | 03 06 08 14 26 27 | 08",
			"2026069 | 12 14 16 17 18 32 | 08",
			"2026068 | 03 05 16 18 29 32 | 04",
			"2026067 | 04 19 27 29 30 32 | 13",
			"2026066 | 05 11 21 23 24 29 | 16",
			"2026065 | 07 08 16 24 30 32 | 02",
			"2026064 | 01 09 15 18 29 33 | 15"
	];

	const outputDiv = document.getElementById("output");
	outputDiv.innerHTML = "<p style='text-align: center;'>正在高速计算中...</p>";

	try {
			const model = new LotteryModel(fixedData);
			const results = model.generateRecommendations(5);

			let htmlContent = "";
			results.forEach((item, idx) => {
					let redBallsHtml = item.red.map(r => `<span class="red-ball">${r}</span>`).join('');
					let blueBallHtml = `<span class="blue-ball">${item.blue}</span>`;
					
					htmlContent += `
							<div class="result-item">
									<div class="balls">第 ${idx + 1} 组：${redBallsHtml} + ${blueBallHtml}</div>
									<div class="reason">💡 <strong>判定理由：</strong>${item.reason}</div>
							</div>
					`;
			});
			outputDiv.innerHTML = htmlContent;
	} catch (error) {
			outputDiv.innerHTML = `<p class="error">计算出错：${error.message}</p>`;
	}
}