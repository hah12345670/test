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