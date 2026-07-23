// ==================== 模型核心逻辑 (大乐透版·严守底层逻辑) ====================
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
                  blue: parts[2].split(/\s+/)
              });
          }
      }
  }

  _calculateStats() {
      let redCountsTotal = {};
      let redCountsRecent10 = {};
      let blueCountsTotal = {};
      let blueCountsRecent10 = {};

      for (let i = 1; i <= 35; i++) {
          let key = String(i).padStart(2, '0');
          redCountsTotal[key] = 0;
          redCountsRecent10[key] = 0;
      }

      for (let i = 1; i <= 12; i++) {
          let key = String(i).padStart(2, '0');
          blueCountsTotal[key] = 0;
          blueCountsRecent10[key] = 0;
      }
      
      let recentPeriods = this.processedDraws.slice(0, 10);

      for (let draw of this.processedDraws) {
          for (let r of draw.red) {
              if (redCountsTotal.hasOwnProperty(r)) redCountsTotal[r] += 1;
          }
          for (let b of draw.blue) {
              if (blueCountsTotal.hasOwnProperty(b)) blueCountsTotal[b] += 1;
          }
      }

      for (let draw of recentPeriods) {
          for (let r of draw.red) {
              if (redCountsRecent10.hasOwnProperty(r)) redCountsRecent10[r] += 1;
          }
          for (let b of draw.blue) {
              if (blueCountsRecent10.hasOwnProperty(b)) blueCountsRecent10[b] += 1;
          }
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
              if (draw.blue.includes(num)) break;
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
      let z1 = reds.some(r => { let n = parseInt(r, 10); return n >= 1 && n <= 12; });
      let z2 = reds.some(r => { let n = parseInt(r, 10); return n >= 13 && n <= 24; });
      let z3 = reds.some(r => { let n = parseInt(r, 10); return n >= 25 && n <= 35; });
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
      if (!LotteryModel.checkZone(reds)) return [false, "三区分布不均衡（存在空区）"];
      if (LotteryModel.checkConsecutive(reds)) return [false, "包含三连号"];
      let ac = LotteryModel.calculateAc(reds);
      if (ac < 5) return [false, `AC值过低 (${ac} < 5)`];
      return [true, "形态校验通过"];
  }

  validateCombination(reds) {
      let [isValidMorph, msg] = this.validateMorphology(reds);
      if (!isValidMorph) return [false, msg];

      let attrs = reds.map(r => this.redStats[r].attribute);
      let hotCount = attrs.filter(a => a === "热号").length;
      let warmCount = attrs.filter(a => a === "温号").length;
      let coldCount = attrs.filter(a => a === "冷号").length;

      // 严格按照大乐透5码特性的热、温、冷比例约束
      if (!(hotCount >= 1 && hotCount <= 2)) return [false, `热号数量不符 (${hotCount})`];
      if (!(warmCount >= 2 && warmCount <= 3)) return [false, `温号数量不符 (${warmCount})`];
      if (!(coldCount >= 0 && coldCount <= 1)) return [false, `冷号数量不符 (${coldCount})`];

      return [true, "符合规则"];
  }

  static validateNumberRange(recommendations) {
      let totalRedsCount = 0;
      let validRangeCount = 0;
      for (let item of recommendations) {
          for (let r of item.red) {
              totalRedsCount += 1;
              let n = parseInt(r, 10);
              if (n >= 1 && n <= 35) validRangeCount += 1;
          }
      }
      if (totalRedsCount === 0) return [false, "推荐列表为空"];
      let ratio = validRangeCount / totalRedsCount;
      if (ratio < 1) return [false, `前区在1-35范围内的比例不足97%`];
      return [true, `前区范围达标率: ${(ratio * 100).toFixed(1)}%`];
  }

  validateRecentOverlap(reds) {
      if (this.processedDraws.length === 0) return true;
      let latestReds = this.processedDraws[0].red;
      let overlapCount = reds.filter(r => latestReds.includes(r)).length;
      return overlapCount >= 0 && overlapCount <= 3;
  }

  selectBlueBalls(count = 5) {
      let blueCandidates = Object.keys(this.blueStats);
      let hotBlues = blueCandidates.filter(b => this.blueStats[b].attribute === "热号");
      let warmBlues = blueCandidates.filter(b => this.blueStats[b].attribute === "温号");
      let coldBlues = blueCandidates.filter(b => this.blueStats[b].attribute === "冷号");
      if (hotBlues.length === 0) hotBlues = blueCandidates;
      if (warmBlues.length === 0) warmBlues = blueCandidates;
      if (coldBlues.length === 0) coldBlues = warmBlues;
      
      let selectedBlues = [];
      for (let i = 0; i < count; i++) {
          let pool1 = hotBlues.length > 0 ? hotBlues[Math.floor(Math.random() * hotBlues.length)] : blueCandidates[0];
          let pool2 = warmBlues.length > 0 ? warmBlues[Math.floor(Math.random() * warmBlues.length)] : blueCandidates[1];
          
          let pair = [pool1, pool2].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
          if (pair[0] === pair[1]) {
              let remaining = blueCandidates.filter(b => b !== pair[0]);
              pair[1] = remaining[Math.floor(Math.random() * remaining.length)];
              pair.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
          }
          selectedBlues.push(pair);
      }
      return selectedBlues;
  }

  generateRecommendations(count = 5) {
      let hotPool = Object.keys(this.redStats).filter(num => this.redStats[num].attribute === "热号");
      let warmPool = Object.keys(this.redStats).filter(num => this.redStats[num].attribute === "温号");
      let coldPool = Object.keys(this.redStats).filter(num => this.redStats[num].attribute === "冷号");
      
      // 保证池子不为空的兜底
      if (hotPool.length === 0) hotPool = Object.keys(this.redStats);
      if (warmPool.length === 0) warmPool = Object.keys(this.redStats);
      if (coldPool.length === 0) coldPool = warmPool;

      let validRedPools = [];
      let maxAttempts = 5000;

      // 严格按照底层逻辑：从热、温、冷池中按权重配比提取组合
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
          if (validRedPools.length >= 50) break;
          
          let numHot = Math.random() < 0.6 ? 1 : 2;
          let numCold = Math.random() < 0.4 ? 0 : 1;
          let numWarm = 5 - numHot - numCold;

          if (hotPool.length < numHot || warmPool.length < numWarm || coldPool.length < numCold) continue;

          let selectedHot = [...hotPool].sort(() => 0.5 - Math.random()).slice(0, numHot);
          let selectedWarm = [...warmPool].sort(() => 0.5 - Math.random()).slice(0, numWarm);
          let selectedCold = [...coldPool].sort(() => 0.5 - Math.random()).slice(0, numCold);

          let combo = [...selectedHot, ...selectedWarm, ...selectedCold].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
          
          // 确保前区5个号码绝对不重复
          if (new Set(combo).size !== 5) continue;

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
              let latestReds = this.processedDraws.length > 0 ? this.processedDraws[0].red : [];
              let recentHit = candidate.filter(r => latestReds.includes(r)).length;
              let parity = LotteryModel.checkParity(candidate);
              let ac = LotteryModel.calculateAc(candidate);
              let reason = `奇偶比${parity}，AC值${ac}，三区均布；热温冷配比合规，与最新期重复 ${recentHit} 个，后区搭配 ${assignedBlue.join(' ')}.`;
              
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

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "<p style='text-align: center;'>正在严格按底层逻辑计算中...</p>";

  try {
      const model = new LotteryModel(fixedData);
      const results = model.generateRecommendations(5);

      let htmlContent = "";
      results.forEach((item, idx) => {
          let redBallsHtml = item.red.map(r => `<span class="red-ball">${r}</span>`).join('');
          let blueBallHtml = item.blue.map(b => `<span class="blue-ball">${b}</span>`).join('');
          
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