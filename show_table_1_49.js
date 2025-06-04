// 显示表格 最近开奖号码
function show_table_1to49_num(inputNumbers, nid = 'showdata1') {
	// let inputNumbers = [];
	let highlighted = new Set(inputNumbers);
	let count = 1;
	let str1 = '<table id="showtable"><caption></caption><tbody>';
	for(let i=0;i<7;i++) {
		str1 += '<tr>';
		for(let j=0;j<7;j++) {
			let extraClass = '';
			// if(i === 4) extraClass += ' thick-top';
			// if(j === 5) extraClass += ' thick-left';

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

// 判断质数
function isPrime(n) {
	if (n < 2) return false;
	for (let i = 2; i <= Math.sqrt(n); i++) {
		if (n % i === 0) return false;
	}
	return true;
}

const container = document.getElementById("container");

// 显示表格 最近开奖号码
function show_table_button() {
	let str1 = '<hr>';
	for(let i=0;i<arr.length;i++) {
		str1 += '<div class="row">';
		if (i==0) {
			str1 += '<h3>精选</h3>';
		} else if (i==1) {
			str1 += '<h3>热</h3>';
		} else if (i==2) {
			str1 += '<h3>温</h3>';
		} else {
			str1 += '<h3>冷</h3>';
		}
		for(let j=0;j<arr[i].length;j++) {
			str1 += '<span class="item" data-value="[' + arr[i][j][1] + ']">' + arr[i][j][0] + '</span>';
		}
		str1 += '</div><hr>';
	}
	container.innerHTML = str1;
}

container.addEventListener("click", function (e) {
	if (e.target.classList.contains("item")) {
		e.target.classList.toggle("selected");

		const rows = Array.from(container.querySelectorAll(".row"));
		const result = rows.map(row => {
			const spans = Array.from(row.querySelectorAll(".item"));
			return spans.map(span => {
				return span.classList.contains("selected")
					? JSON.parse(span.dataset.value)
					: [];
			});
		});

		show_table_1to49_num(getIntersection(result), "showdata1");
	}
});

// 让多维数组中的一维数组做交集计算
function getIntersection(array) {
	// 提取所有最底层的非空一维数组
	const allBottomArrays = [];
	function traverse(node) {
		if (Array.isArray(node)) {
			if (node.every(item => typeof item === 'number')) {
				if (node.length > 0) {
					allBottomArrays.push(node);
				}
			} else {
				for (const item of node) {
					traverse(item);
				}
			}
		}
	}
	traverse(array);
	if (allBottomArrays.length === 0) return [];
	// 执行交集计算
	// return allBottomArrays.reduce((acc, curr) => acc.filter(x => curr.includes(x)));
	// 先判断类型（每个数组第一个元素做类型判断），同类型做并集，然后不同类型做交集
	return mergeSameTypeThenIntersect(allBottomArrays);
}

// 同类型数组做并集，将不同类型的数组做交集
function mergeSameTypeThenIntersect(allBottomArrays) {
	const groups = {};

	// 1. 分组：按首元素类型归类，去掉首元素
	for (const arr of allBottomArrays) {
		const type = String(arr[0]); // 支持数字或字符串类型
		if (!groups[type]) groups[type] = [];
		groups[type].push(arr.slice(1));
	}

	// 2. 每组做并集
	const unionPerGroup = Object.values(groups).map(arrays => {
		return [...new Set(arrays.flat())];
	});

	// 3. 多组并集结果做交集
	if (unionPerGroup.length === 0) return [];
	return unionPerGroup.reduce((acc, curr) => acc.filter(x => curr.includes(x)));
}

