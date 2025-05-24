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
	const inRange0 = wr_arr[0][0].slice(0, -1).includes(count0);
	const inRange1 = wr_arr[0][1].slice(0, -1).includes(count1);
	const inRange2 = wr_arr[0][2].slice(0, -1).includes(count2);
	const inRangeOdd = wr_arr[1][0].slice(0, -1).includes(oddCount);
	const inRangeEven = wr_arr[1][1].slice(0, -1).includes(evenCount);
	const inRange_0_29 = wr_arr[2][0].slice(0, -1).includes(count_0_29);
	const inRange_30_59 = wr_arr[2][1].slice(0, -1).includes(count_30_59);
	const inRange_60_89 = wr_arr[2][2].slice(0, -1).includes(count_60_89);
	const inRangePrime = wr_arr[3][0].slice(0, -1).includes(primeCount);
	const inRangeNonPrime = wr_arr[3][1].slice(0, -1).includes(nonPrimeCount);

	// 输出
	let str1 = '';
	str1 += "012路比例 <font class="+(inRange0 ? 'highlight1' : '')+">["+wr_arr[0][0]+"]</font> : <font class="+(inRange1 ? 'highlight1' : '')+">["+wr_arr[0][1]+"]</font> : <font class="+(inRange2 ? 'highlight1' : '')+">["+wr_arr[0][2]+"]</font><br>"
	str1 += "奇偶比例 <font class="+(inRangeOdd ? 'highlight1' : '')+">["+wr_arr[1][0]+"]</font> : <font class="+(inRangeEven ? 'highlight1' : '')+">["+wr_arr[1][1]+"]</font><br>"
	str1 += "0-29、30-59、60-89比例 <font class="+(inRange_0_29 ? 'highlight1' : '')+">["+wr_arr[2][0]+"]</font> : <font class="+(inRange_30_59 ? 'highlight1' : '')+">["+wr_arr[2][1]+"]</font> : <font class="+(inRange_60_89 ? 'highlight1' : '')+">["+wr_arr[2][2]+"]</font><br>"
	str1 += "质数、非质数比例 <font class="+(inRangePrime ? 'highlight1' : '')+">["+wr_arr[3][0]+"]</font> : <font class="+(inRangeNonPrime ? 'highlight1' : '')+">["+wr_arr[3][1]+"]</font>"
	document.getElementById(nid).innerHTML = str1;
}