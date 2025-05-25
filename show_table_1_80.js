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
function tj_zy(data, where) {
	const where1 = where;
	// const data = [1, 3, 6, 7, 11, 12, 15, 17, 19, 20, 24, 27, 31, 34, 35, 36, 42, 45, 46, 49, 53, 54, 56, 57, 61, 65, 66, 70, 74, 76, 80];
	const mod2Nums = data.filter(n => n % 3 === 2);
	const oddNums = data.filter(n => n % 2 === 1);
	const range60_89 = data.filter(n => n >= 60 && n <= 89);
	const primeNums = data.filter(isPrime);

	function randomPick(arr, count) {
		const copy = [...arr];
		const result = [];
		while (result.length < count && copy.length > 0) {
			const idx = Math.floor(Math.random() * copy.length);
			result.push(copy.splice(idx, 1)[0]);
		}
		return result;
	}

	function scoreCombo(combo) {
		let score = 0;
		combo.forEach(n => {
			let count = 0;
			if (mod2Nums.includes(n)) count++;
			if (oddNums.includes(n)) count++;
			if (range60_89.includes(n)) count++;
			if (primeNums.includes(n)) count++;
			score += count;
		});
		score += 10 - combo.length;  // 越短越优
		return score;
	}

	function findBestCombo() {
		const seen = new Set();
		let best = null;
		let tries = 0;
		while (tries < 10000) {
			tries++;
			const mod2Count = Math.floor(Math.random() * 2) + 3; // 3~4
			const oddCount = Math.floor(Math.random() * 3) + 3;  // 3~5
			const primeCount = Math.floor(Math.random() * 2) + 2;// 2~3

			const mod2 = randomPick(mod2Nums, mod2Count);
			const odd = randomPick(oddNums, oddCount);
			const range = randomPick(range60_89, 2);
			const prime = randomPick(primeNums, primeCount);
			const combo = Array.from(new Set([...mod2, ...odd, ...range, ...prime]));
			if (combo.length <= 10) {
				const key = combo.slice().sort((a,b)=>a-b).join(',');
				if (!seen.has(key)) {
					seen.add(key);
					const score = scoreCombo(combo);
					if (!best || score > best.score) {
						best = { combo, mod2, odd, range, prime, score };
					}
				}
			}
		}
		return best;
	}

	const bestCombo = findBestCombo();
	console.log("最优推荐组合:");
	console.log("组合:", bestCombo.combo);
	console.log("得分:", bestCombo.score);
	console.log("包含2路数:", bestCombo.mod2);
	console.log("包含奇数:", bestCombo.odd);
	console.log("60-89区间:", bestCombo.range);
	console.log("质数:", bestCombo.prime);
}
