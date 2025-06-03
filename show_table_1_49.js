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

		console.log(result);
		show_table_1to49_num([], "showdata1");
	}
});
