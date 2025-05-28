// 显示表格 最近开奖号码
function show_table_1to80_num(inputNumbers, nid = 'showdata1') {
	// let inputNumbers = [];
	let highlighted = new Set(inputNumbers);
	let count = 1;
	let str1 = '<table id="showtable"><caption></caption><tbody>';
	for(let i=0;i<8;i++) {
		str1 += '<tr>';
		for(let j=0;j<10;j++) {
			let extraClass = '';
			if(i === 4) extraClass += ' thick-top';
			if(j === 5) extraClass += ' thick-left';

			let displayNumber = count < 10 ? '0'+count : count;
			if(highlighted.has(count)){
				str1 += '<td class="'+extraClass.trim()+'"><div class="highlight">'+displayNumber+'</div></td>';
			} else {
				str1 += '<td class="'+extraClass.trim()+'">'+displayNumber+'</td>';
			}
			count++;
		}
		str1 += '</tr>';
	}
	str1 += '</tbody></table>';
	document.getElementById(nid).innerHTML = str1;
}

// 推荐号码 最近开奖号码
function show_table_1to80_numtj(kjNumbers, tjNumbers, nid = 'showdata1') {
	let kjnumed = new Set(kjNumbers);
	let tjnumed = new Set(tjNumbers);
	let count = 1;
	let str1 = '<table id="showtable"><caption></caption><tbody>';
	for(let i=0;i<8;i++) {
		str1 += '<tr>';
		for(let j=0;j<10;j++) {
			let extraClass = '';
			if(i === 4) extraClass += ' thick-top';
			if(j === 5) extraClass += ' thick-left';

			let displayNumber = count < 10 ? '0'+count : count;
			if(kjnumed.has(count) && tjnumed.has(count)){
				str1 += '<td class="'+extraClass.trim()+'"><div class="tjkjnum">'+displayNumber+'</div></td>';
			} else {
				if(kjnumed.has(count)){
					str1 += '<td class="'+extraClass.trim()+'"><div class="highlight">'+displayNumber+'</div></td>';
				} else if(tjnumed.has(count)){
					str1 += '<td class="'+extraClass.trim()+'"><div class="tjnum">'+displayNumber+'</div></td>';
				} else {
					str1 += '<td class="'+extraClass.trim()+'">'+displayNumber+'</td>';
				}
			}
			count++;
		}
		str1 += '</tr>';
	}
	str1 += '</tbody></table>';
	document.getElementById(nid).innerHTML = str1;
}

// 判断质数
function isPrime(n) {
	if (n < 2) return false;
	for (let i = 2; i <= Math.sqrt(n); i++) {
		if (n % i === 0) return false;
	}
	return true;
}

// 判断条件状态
function calculateStats(arr1, wr_arr = [], nid = "tj_where") {
	/** html显示
	<input id="inputArray" type="text" placeholder="例如：3,4,5,6,7,8,9,30,31,60,61" size="80">
  <button onclick="calculateStats()">统计</button>
	<h3>统计结果：</h3>
  <div id="result"></div>
	const input = document.getElementById("inputArray").value;
	const numbers = input.split(',').map(num => parseInt(num.trim())).filter(n => !isNaN(n));
	*/
	const numbers = arr1;

	let count0 = 0, count1 = 0, count2 = 0;
	let oddCount = 0, evenCount = 0;
	let count_0_29 = 0, count_30_59 = 0, count_60_89 = 0;
	let primeCount = 0, nonPrimeCount = 0;

	numbers.forEach(num => {
		// 012路
		const mod = num % 3;
		if (mod === 0) count0++;
		else if (mod === 1) count1++;
		else if (mod === 2) count2++;

		// 奇偶
		if (num % 2 === 0) evenCount++;
		else oddCount++;

		// 区间判断
		if (num >= 0 && num <= 29) count_0_29++;
		else if (num >= 30 && num <= 59) count_30_59++;
		else if (num >= 60 && num <= 89) count_60_89++;

		// 质数判断
		if (isPrime(num)) primeCount++;
		else nonPrimeCount++;
	});

	// 判断范围 不要最后一个元素array.slice(0, -1); 不需要修改原数组 
	// const inRange0 = wr_arr[0][0].slice(0, -1).includes(count0);
	// const inRange1 = wr_arr[0][1].slice(0, -1).includes(count1);
	// const inRange2 = wr_arr[0][2].slice(0, -1).includes(count2);
	// const inRangeOdd = wr_arr[1][0].slice(0, -1).includes(oddCount);
	// const inRangeEven = wr_arr[1][1].slice(0, -1).includes(evenCount);
	// const inRange_0_29 = wr_arr[2][0].slice(0, -1).includes(count_0_29);
	// const inRange_30_59 = wr_arr[2][1].slice(0, -1).includes(count_30_59);
	// const inRange_60_89 = wr_arr[2][2].slice(0, -1).includes(count_60_89);
	// const inRangePrime = wr_arr[3][0].slice(0, -1).includes(primeCount);
	// const inRangeNonPrime = wr_arr[3][1].slice(0, -1).includes(nonPrimeCount);
	// 保留2为小数 3≈3.00
	// wr_arr[0][0][wr_arr[0][0].length - 1] = parseFloat(wr_arr[0][0][wr_arr[0][0].length - 1].toFixed(2));
	// wr_arr[0][1][wr_arr[0][1].length - 1] = parseFloat(wr_arr[0][1][wr_arr[0][1].length - 1].toFixed(2));
	// wr_arr[0][2][wr_arr[0][2].length - 1] = parseFloat(wr_arr[0][2][wr_arr[0][2].length - 1].toFixed(2));
	// wr_arr[1][0][wr_arr[1][0].length - 1] = parseFloat(wr_arr[1][0][wr_arr[1][0].length - 1].toFixed(2));
	// wr_arr[1][1][wr_arr[1][1].length - 1] = parseFloat(wr_arr[1][1][wr_arr[1][1].length - 1].toFixed(2));
	// wr_arr[2][0][wr_arr[2][0].length - 1] = parseFloat(wr_arr[2][0][wr_arr[2][0].length - 1].toFixed(2));
	// wr_arr[2][1][wr_arr[2][1].length - 1] = parseFloat(wr_arr[2][1][wr_arr[2][1].length - 1].toFixed(2));
	// wr_arr[2][2][wr_arr[2][2].length - 1] = parseFloat(wr_arr[2][2][wr_arr[2][2].length - 1].toFixed(2));
	// wr_arr[3][0][wr_arr[3][0].length - 1] = parseFloat(wr_arr[3][0][wr_arr[3][0].length - 1].toFixed(2));
	// wr_arr[3][1][wr_arr[3][1].length - 1] = parseFloat(wr_arr[3][1][wr_arr[3][1].length - 1].toFixed(2));
	// console.log(arr_sort(wr_arr[0]));
	// console.log(arr_sort(wr_arr[1]));
	// console.log(arr_sort(wr_arr[2]));
	// console.log(arr_sort(wr_arr[3]));

	// 输出
	let str1 = '';
	str1 += "012路比例 <font class="+returnRangeClass(count0, wr_arr[0][0])+">["+wr_arr[0][0]+"]</font> : <font class="+returnRangeClass(count1, wr_arr[0][1])+">["+wr_arr[0][1]+"]</font> : <font class="+returnRangeClass(count2, wr_arr[0][2])+">["+wr_arr[0][2]+"]</font><br>"
	str1 += "奇偶比例 <font class="+returnRangeClass(oddCount, wr_arr[1][0])+">["+wr_arr[1][0]+"]</font> : <font class="+returnRangeClass(evenCount, wr_arr[1][1])+">["+wr_arr[1][1]+"]</font><br>"
	str1 += "0-29、30-59、60-89比例 <font class="+returnRangeClass(count_0_29, wr_arr[2][0])+">["+wr_arr[2][0]+"]</font> : <font class="+returnRangeClass(count_30_59, wr_arr[2][1])+">["+wr_arr[2][1]+"]</font> : <font class="+returnRangeClass(count_60_89, wr_arr[2][2])+">["+wr_arr[2][2]+"]</font><br>"
	str1 += "质数、非质数比例 <font class="+returnRangeClass(primeCount, wr_arr[3][0])+">["+wr_arr[3][0]+"]</font> : <font class="+returnRangeClass(nonPrimeCount, wr_arr[3][1])+">["+wr_arr[3][1]+"]</font>"
	document.getElementById(nid).innerHTML = str1;
}

// 返回在范围内、大于范围的样式
function returnRangeClass(count, arr) {
	const array = arr.slice(0, -1);
	const inRange = array.includes(count);
	const inRangeUp = isGreaterThanArray(count, array);
	const inRangeDown = isValueLessThanArray(count, array);
	let str1 = '';
	if (inRange) {
		str1 = 'highlight1';
	} else {
		if (inRangeUp) {
			str1 = 'highlight2';
		}
	}
	return str1;
}

// 返回true 大于最大值
function isGreaterThanArray(value, array) {
	return array.every(item => value > item);
}

// 返回true 小于最小值
function isValueLessThanArray(value, array) {
	return array.some(item => value < item);
}

// 二维数组每行取最后值，获取这些值中最小的返回，并且返回该行数组原来的所有
function arr_sort(array) {
	let minVal = array[0][array[0].length - 1];
	let minIndex = 0;
	array.forEach((row, index) => {
		const lastVal = row[row.length - 1];
		if (lastVal < minVal) {
			minVal = lastVal;
			minIndex = index;
		}
	});
	const minRowWithoutLast = array[minIndex].slice(0, -1);  // 去掉最后一个值
	return [minVal, minIndex, minRowWithoutLast];
}

// 最优推荐
// function tj_zy(data, where1) { // 参数还没处理好
// 	{
// 		data: [1, 3, 5, 8, 13, 18, 22, 29, 35, 41, 45, 50, 52, 60, 65, 70, 72, 80],
// 		config: [
// 			{ type: "mod", mod: 3, eq: 0, name: "mod0", count: [2, 3, 4] },
// 			{ type: "mod", mod: 3, eq: 1, name: "mod1", count: [3, 4, 5] },
// 			{ type: "mod", mod: 3, eq: 2, name: "mod2", count: [3, 4] },
// 			{ type: "odd", count: [3, 4, 5] },
// 			{ type: "even", count: [5, 6, 7] },
// 			{ type: "range", min: 0, max: 29, name: "range0_29", count: [3, 4] },
// 			{ type: "range", min: 30, max: 59, name: "range30_59", count: [4, 5, 6] },
// 			{ type: "range", min: 60, max: 89, name: "range60_89", count: [2, 3] },
// 			{ type: "prime", count: [2, 3] },
// 			{ type: "nonPrime", count: [6, 7, 8] }
// 		]
// 	}

// 	// 从数组随机选count个数，确保无重复
// 	function randomPick(arr, count) {
// 		const copy = [...arr];
// 		const result = [];
// 		while (result.length < count && copy.length > 0) {
// 			const idx = Math.floor(Math.random() * copy.length);
// 			result.push(copy.splice(idx, 1)[0]);
// 		}
// 		return result;
// 	}

// 	// 从数组随机取一个值
// 	function randomFrom(arr) {
// 		return arr[Math.floor(Math.random() * arr.length)];
// 	}

// 	// 构建规则和对应数字集合
// 	const ruleSet = {};
// 	for (const rule of config) {
// 		const name = rule.name || rule.type;
// 		let filterFn;
// 		switch (rule.type) {
// 			case "mod": filterFn = n => n % rule.mod === rule.eq; break;
// 			case "odd": filterFn = n => n % 2 === 1; break;
// 			case "even": filterFn = n => n % 2 === 0; break;
// 			case "range": filterFn = n => n >= rule.min && n <= rule.max; break;
// 			case "prime": filterFn = isPrime; break;
// 			case "nonPrime": filterFn = n => !isPrime(n); break;
// 			default: continue;
// 		}
// 		ruleSet[name] = {
// 			countRange: rule.count,
// 			set: data.filter(filterFn),
// 		};
// 	}

// 	// 评分函数：数字越多命中规则越高，且组合越短越优
// 	function scoreCombo(combo) {
// 		let score = 0;
// 		for (const r of Object.values(ruleSet)) {
// 			score += combo.filter(n => r.set.includes(n)).length;
// 		}
// 		score += 10 - combo.length;
// 		return score;
// 	}

// 	// 找出最优组合
// 	function findBestCombo() {
// 		const seen = new Set();
// 		let best = null;
// 		let tries = 0;
// 		while (tries < 10000) {
// 			tries++;
// 			let picked = [];
// 			for (const r of Object.values(ruleSet)) {
// 				const count = randomFrom(r.countRange);
// 				picked.push(...randomPick(r.set, count));
// 			}
// 			// 去重并升序排序
// 			const combo = Array.from(new Set(picked)).sort((a, b) => a - b);
// 			if (combo.length <= 10) {
// 				const key = combo.join(',');
// 				if (!seen.has(key)) {
// 					seen.add(key);
// 					const score = scoreCombo(combo);
// 					if (!best || score > best.score) {
// 						best = { combo, score };
// 					}
// 				}
// 			}
// 		}
// 		return best;
// 	}

// 	const bestCombo = findBestCombo();
// 	console.log("🎯 最优推荐组合:");
// 	console.log("组合:", bestCombo.combo.join(', '));
// 	console.log("得分:", bestCombo.score);
// }

function tj_zy(data, ruleGroups) {
	// ruleGroups = [
	// 							[[],[],ruleGroups[0][2]],
	// 							[[],[]],
	// 							[[],[],[]],
	// 							[[],[]],
	// 							];
	
	// 获取012路分类（取模3）
	function modClass(n) {
		return n % 3;
	}

	// 从数组中随机挑选count个不重复元素
	function randomPick(arr, count) {
		const copy = [...arr];
		const result = [];
		while (result.length < count && copy.length > 0) {
			const idx = Math.floor(Math.random() * copy.length);
			result.push(copy.splice(idx, 1)[0]);
		}
		return result;
	}

	// 从数组中随机选一个元素
	function randomFrom(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	// 验证逻辑，组合中的每一条规则都满足它的数量范围
	function isValidCombo(combo) {
		for (const rule of ruleSet) {
			const hitCount = combo.filter(n => rule.set.includes(n)).length;
			const [min, max] = [Math.min(...rule.countRange), Math.max(...rule.countRange)];
			if (hitCount < min || hitCount > max) return false;
		}
		return true;
	}

	// 权重换算：权重值越小表示越重要，取倒数使其得分更高
	const inverseWeight = (w, arr) => {
		// 默认参数直接写在函数内部
		const alpha = 1;   // 倒数项权重
		const beta = 0.7;  // 最大值归一项权重
		const gamma = 0.3; // 最小值归一项权重
		const delta = 0.5; // 数组长度项权重

		const minVal = 0;         // 数组值预期最小值（用于归一化）
		const maxVal = 80;       // 数组值预期最大值（用于归一化）
		const maxExpectedLength = 20; // 数组预期最大长度
		const epsilon = 1e-6;     // 防止除以 0

		// 校验
		if (typeof w !== 'number' || isNaN(w) || w === 0) {
			throw new Error('w 必须是非零数字');
		}

		if (!Array.isArray(arr) || arr.length === 0) {
			throw new Error('arr 必须是非空数组');
		}

		const numbersOnly = arr.filter(x => typeof x === 'number' && !isNaN(x));
		if (numbersOnly.length !== arr.length) {
			throw new Error('数组必须只包含数字');
		}

		// 计算各部分
		const invW = 1 / (w + epsilon);
		const max = Math.max(...numbersOnly);
		const min = Math.min(...numbersOnly);
		const len = numbersOnly.length;

		const maxNorm = (max - minVal) / (maxVal - minVal);
		const minNorm = (min - minVal) / (maxVal - minVal);
		const lenNorm = len / maxExpectedLength;

		// 综合得分
		return (
			alpha * invW +
			beta * maxNorm +
			gamma * minNorm +
			delta * lenNorm
		);
	};

	// 判断是哪个段位的
	function getSegment(num) {
		if (num >= 1 && num <= 9) return 1;
		if (num >= 10 && num <= 19) return 2;
		if (num >= 20 && num <= 29) return 3;
		if (num >= 30 && num <= 39) return 4;
		if (num >= 40 && num <= 49) return 5;
		if (num >= 50 && num <= 59) return 6;
		if (num >= 60 && num <= 69) return 7;
		if (num >= 70 && num <= 79) return 8;
		// if (num === 80) return 9;  // 80 归为第9段位
		return null;
	}

	// 返回段位数量、是否段位数 >= 5
	function analyzeInputArray(arr) {
		const segments = new Set();
		for (const num of arr) {
			const seg = getSegment(num);
			if (seg !== null) segments.add(seg);
		}
	
		const segmentCount = segments.size;
		const isSegmentGE5 = segmentCount >= 5;
	
		let probability = 0;
		let category = "";
	
		if (segmentCount < 5) {
			probability = 0.30;  // <5 段位概率 30%
			category = "<5 segments（低覆盖）";
		} else if (segmentCount === 5) {
			probability = 0.50;  // =5 段位概率 50%
			category = "=5 segments（标准覆盖）";
		} else {
			probability = 0.20;  // >5 段位概率 20%
			category = ">5 segments（高覆盖）";
		}
	
		// 根据对应概率做随机判断
		const passProbabilistic = Math.random() < probability;
	
		return {
			segmentCount,        // 使用的段位数量
			category,            // 段位分类说明
			segments,            // 使用的段位是哪些
			isSegmentGE5,        // 是否段位数 >= 5
			probability,         // 概率数值（浮点型）
			probabilityText: (probability * 100).toFixed(1) + "%", // 概率文本
			passProbabilistic    // 概率判断结果 true/false
		};
	}

	// 区间定义，用于三段区间：0-29，30-59，60-89
	const ranges = [
		{ min: 0, max: 29 },
		{ min: 30, max: 59 },
		{ min: 60, max: 89 }
	];

	const ruleSet = [];

	// === 处理规则组 ===

	// 1. 处理012路规则
	if (ruleGroups[0]) {
		for (let i = 0; i < 3; i++) {
			const rule = ruleGroups[0][i];
			if (!rule || rule.length < 2) continue; // 空规则跳过
			const countRange = rule.slice(0, -1);
			const weight = inverseWeight(rule[rule.length - 1], rule.slice(0, rule.length - 1));
			ruleSet.push({
				name: `mod${i}`,
				countRange,
				weight,
				set: data.filter(n => modClass(n) === i)
			});
		}
	}

	// 2. 奇偶规则
	if (ruleGroups[1]) {
		const [oddRule, evenRule] = ruleGroups[1];

		if (oddRule && oddRule.length >= 2) {
			const countRange = oddRule.slice(0, -1);
			const weight = inverseWeight(oddRule[oddRule.length - 1], oddRule.slice(0, oddRule.length - 1));
			ruleSet.push({
				name: 'odd',
				countRange,
				weight,
				set: data.filter(n => n % 2 === 1)
			});
		}

		if (evenRule && evenRule.length >= 2) {
			const countRange = evenRule.slice(0, -1);
			const weight = inverseWeight(evenRule[evenRule.length - 1], evenRule.slice(0, evenRule.length - 1));
			ruleSet.push({
				name: 'even',
				countRange,
				weight,
				set: data.filter(n => n % 2 === 0)
			});
		}
	}

	// 3. 区间规则（0-29, 30-59, 60-89）
	if (ruleGroups[2]) {
		for (let i = 0; i < 3; i++) {
			const rule = ruleGroups[2][i];
			if (!rule || rule.length < 2) continue;
			const countRange = rule.slice(0, -1);
			const weight = inverseWeight(rule[rule.length - 1], rule.slice(0, rule.length - 1));
			ruleSet.push({
				name: `range_${ranges[i].min}_${ranges[i].max}`,
				countRange,
				weight,
				set: data.filter(n => n >= ranges[i].min && n <= ranges[i].max)
			});
		}
	}

	// 4. 质数 / 非质数规则
	if (ruleGroups[3]) {
		const [primeRule, nonPrimeRule] = ruleGroups[3];

		if (primeRule && primeRule.length >= 2) {
			const countRange = primeRule.slice(0, -1);
			const weight = inverseWeight(primeRule[primeRule.length - 1], primeRule.slice(0, primeRule.length - 1));
			ruleSet.push({
				name: 'prime',
				countRange,
				weight,
				set: data.filter(isPrime)
			});
		}

		if (nonPrimeRule && nonPrimeRule.length >= 2) {
			const countRange = nonPrimeRule.slice(0, -1);
			const weight = inverseWeight(nonPrimeRule[nonPrimeRule.length - 1], nonPrimeRule.slice(0, nonPrimeRule.length - 1));
			ruleSet.push({
				name: 'nonPrime',
				countRange,
				weight,
				set: data.filter(n => !isPrime(n))
			});
		}
	}

	// === 组合评分 ===
	function scoreCombo(combo) {
		let score = 0;
		for (const rule of ruleSet) {
			const hitCount = combo.filter(n => rule.set.includes(n)).length;
			score += hitCount * rule.weight;
		}
		score += 10 - combo.length; // 越短越优
		return score;
	}

	// === 搜索最优组合 ===
	function findBestCombo() {
		const seen = new Set();
		let best = null;
		let tries = 0;

		while (tries < 10000*3) {
			tries++;
			let picked = [];

			for (const rule of ruleSet) {
				const count = randomFrom(rule.countRange);
				picked.push(...randomPick(rule.set, count));
			}

			const combo = Array.from(new Set(picked)).sort((a, b) => a - b); // 去重+升序
			// 是否重复2、3
			let is_repeated = true;
			if (isRepeat==1) {
				is_repeated = generateAndCheck(combo);
			}
			// 段位数量、段位概率
			let is_dwrestart = true;
			const num_gl = analyzeInputArray(combo);
			if (isDwRestart==1) {
				is_dwrestart = (num_gl.isSegmentGE5 && num_gl.passProbabilistic);
			}
			if (combo.length <= 10 && isValidCombo(combo) && is_repeated && is_dwrestart) {
				const key = combo.join(',');
				if (!seen.has(key)) {
					seen.add(key);
					const score = scoreCombo(combo);
					if (!best || score > best.score) {
						// 将Set转换为数组，排序，值减1，然后转换为字符串
						const segmentsString = Array.from(num_gl.segments).sort().map(value => value - 1).join(',');
						best = { combo, score: parseFloat(score.toFixed(3)), 
										segmentnum: num_gl.segmentCount, 
										segments: segmentsString };
					}
				}
			}
		}

		return best;
	}

	// === 主执行 ===
	const bestCombo = findBestCombo();
	let str1 = '';
	if (bestCombo && bestCombo.combo.length) {
		str1 += '最优推荐组合: <br>';
		str1 += '组合: '+bestCombo.combo.join(', ')+'<br>';
		str1 += '得分: '+bestCombo.score+'<br>';
		str1 += '段位数量: '+bestCombo.segmentnum+'<br>';
		str1 += '各个段位: '+bestCombo.segments+'<br>';
		// console.log("🎯 最优推荐组合:");
		// console.log("组合:", bestCombo.combo.join(', '));
		// console.log("得分:", bestCombo.score);
		// return bestCombo;
	} else {
		str1 += '暂无推荐！<br>';
		// console.log("暂无推荐！");
	}
	gridOutput.innerHTML = str1;
}

// 随机的数组和交集是否满足条件
function generateAndCheck(randomArray) {
	const baseArray = getArrayRelations(newtj_arr, arr[0][1]).intersection;
	const intersection = randomArray.filter(num => baseArray.includes(num));
	const matchCount = intersection.length;
	const isValid = matchCount === 2 || matchCount === 3;
	return isValid;
}

// 获取数组的交集
function getArrayRelations(array1, array2) {
	// const set1 = new Set(array1);
	const set2 = new Set(array2);
	// 交集
	const intersection = array1.filter(item => set2.has(item));
	// 差集：arr1 中有，arr2 中没有
	// const difference = array1.filter(item => !set2.has(item));
	// 对称差集：两个数组中不重复的部分
	// const symmetricDifference = [
	// 	...array1.filter(item => !set2.has(item)),
	// 	...array2.filter(item => !set1.has(item))
	// ];
	return {
		intersection,
		// difference,
		// symmetricDifference
	};
}
