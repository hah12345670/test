// 生肖映射数组索引 (1-12)
const animals = ["", "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

const allRowDataObjs = [];
const selectedNumbers = new Set();
const container = document.getElementById('data-container');

rawData.forEach(item => {
		const rowDiv = document.createElement('div');
		rowDiv.className = 'row';

		const qhDiv = document.createElement('div');
		qhDiv.className = 'qihao';
		qhDiv.textContent = item.qihao;
		rowDiv.appendChild(qhDiv);

		const numsDiv = document.createElement('div');
		numsDiv.className = 'numbers-container';

		const hotList = item.list.slice(0, 4);
		const warmList = item.list.slice(4, 8);
		const coldList = item.list.slice(8, 12);

		const rowItemObj = {
				item: item,
				numBoxes: [],
				ruleBoxObj: null
		};

		const createSection = (subList, typeClass) => {
				const secDiv = document.createElement('div');
				secDiv.className = 'section';
				subList.forEach(num => {
						const numBox = document.createElement('div');
						numBox.className = `num-box ${typeClass}`;
						numBox.textContent = num;
						
						const boxObj = {
								element: numBox,
								num: num,
								type: typeClass,
								rule: item.rule
						};
						rowItemObj.numBoxes.push(boxObj);

						numBox.addEventListener('click', (e) => {
								e.stopPropagation();
								if (selectedNumbers.has(num)) {
										selectedNumbers.delete(num);
								} else {
										selectedNumbers.add(num);
								}
								updateDisplay();
						});

						secDiv.appendChild(numBox);
				});
				return secDiv;
		};

		numsDiv.appendChild(createSection(hotList, 'hot'));
		
		const sep1 = document.createElement('div');
		sep1.className = 'section-separator';
		numsDiv.appendChild(sep1);

		numsDiv.appendChild(createSection(warmList, 'warm'));

		const sep2 = document.createElement('div');
		sep2.className = 'section-separator';
		numsDiv.appendChild(sep2);

		numsDiv.appendChild(createSection(coldList, 'cold'));

		rowDiv.appendChild(numsDiv);

		const ruleDiv = document.createElement('div');
		ruleDiv.className = 'rule-result';

		const ruleBox = document.createElement('div');
		ruleBox.textContent = item.rule;

		let ruleType = 'question';
		if (item.rule !== "?") {
				if (hotList.includes(item.rule)) ruleType = 'hot';
				else if (warmList.includes(item.rule)) ruleType = 'warm';
				else if (coldList.includes(item.rule)) ruleType = 'cold';
				else ruleType = 'hot';

				ruleBox.className = `rule-box ${ruleType}`;
		} else {
				ruleBox.className = 'rule-box question';
		}

		const ruleObj = {
				element: ruleBox,
				rule: item.rule,
				type: ruleType
		};
		rowItemObj.ruleBoxObj = ruleObj;

		ruleBox.addEventListener('click', (e) => {
				e.stopPropagation();
				if (item.rule === "?") return;

				const ruleNum = item.rule;
				if (selectedNumbers.has(ruleNum)) {
						selectedNumbers.delete(ruleNum);
				} else {
						selectedNumbers.add(ruleNum);
				}
				updateDisplay();
		});

		ruleDiv.appendChild(ruleBox);
		rowDiv.appendChild(ruleDiv);
		container.appendChild(rowDiv);

		allRowDataObjs.push(rowItemObj);
});

// 点击“全部显示”按钮
document.getElementById('btn-show-all').addEventListener('click', () => {
		selectedNumbers.clear();
		allRowDataObjs.forEach(rowObj => {
				rowObj.numBoxes.forEach(b => {
						b.element.classList.remove('transparent');
						b.element.classList.remove('active-selected');
				});
				if (rowObj.ruleBoxObj) {
						rowObj.ruleBoxObj.element.classList.remove('transparent');
						rowObj.ruleBoxObj.element.classList.remove('active-selected');
				}
		});
		updateRuleStats();
});

document.getElementById('btn-show-rule').addEventListener('click', () => {
		selectedNumbers.clear();
		updateDisplay();
});

// 初始化默认状态
updateDisplay();

function updateDisplay() {
		allRowDataObjs.forEach(rowObj => {
				// 处理生肖方块显隐及选中态
				rowObj.numBoxes.forEach(box => {
						if (selectedNumbers.has(box.num)) {
								box.element.classList.add('active-selected');
						} else {
								box.element.classList.remove('active-selected');
						}

						if (selectedNumbers.size === 0) {
								if (box.rule === "?") {
										box.element.classList.add('transparent');
								} else {
										if (box.num === box.rule) {
												box.element.classList.remove('transparent');
										} else {
												box.element.classList.add('transparent');
										}
								}
						} else {
								if (selectedNumbers.has(box.num)) {
										box.element.classList.remove('transparent');
								} else {
										box.element.classList.add('transparent');
								}
						}
				});

				// 处理规则方块显隐及选中态
				const rBox = rowObj.ruleBoxObj;
				if (rBox) {
						if (rBox.rule === "?") {
								rBox.element.classList.add('transparent');
						} else {
								const rNum = rBox.rule;
								
								if (selectedNumbers.has(rNum)) {
										rBox.element.classList.add('active-selected');
								} else {
										rBox.element.classList.remove('active-selected');
								}

								if (selectedNumbers.size === 0) {
										rBox.element.classList.remove('transparent');
								} else {
										if (selectedNumbers.has(rNum)) {
												rBox.element.classList.remove('transparent');
										} else {
												rBox.element.classList.add('transparent');
										}
								}
						}
				}
		});

		updateStats();
}

function updateStats() {
		let hotCount = 0;
		let warmCount = 0;
		let coldCount = 0;

		allRowDataObjs.forEach(rowObj => {
				rowObj.numBoxes.forEach(box => {
						if (!box.element.classList.contains('transparent')) {
								if (box.type === 'hot') hotCount++;
								else if (box.type === 'warm') warmCount++;
								else if (box.type === 'cold') coldCount++;
						}
				});
		});

		const total = hotCount + warmCount + coldCount;
		const getPct = (cnt) => {
				if (total === 0) return '0.0%';
				return ((cnt / total) * 100).toFixed(1) + '%';
		};

		document.getElementById('stat-hot-text').textContent = `个数: ${hotCount} (${getPct(hotCount)})`;
		document.getElementById('stat-warm-text').textContent = `个数: ${warmCount} (${getPct(warmCount)})`;
		document.getElementById('stat-cold-text').textContent = `个数: ${coldCount} (${getPct(coldCount)})`;
}

function updateRuleStats() {
		let hotCount = 0;
		let warmCount = 0;
		let coldCount = 0;

		allRowDataObjs.forEach(rowObj => {
				const rBox = rowObj.ruleBoxObj;
				if (rBox && rBox.rule !== "?") {
						if (rBox.type === 'hot') hotCount++;
						else if (rBox.type === 'warm') warmCount++;
						else if (rBox.type === 'cold') coldCount++;
				}
		});

		const total = hotCount + warmCount + coldCount;
		const getPct = (cnt) => {
				if (total === 0) return '0.0%';
				return ((cnt / total) * 100).toFixed(1) + '%';
		};

		document.getElementById('stat-hot-text').textContent = `个数: ${hotCount} (${getPct(hotCount)})`;
		document.getElementById('stat-warm-text').textContent = `个数: ${warmCount} (${getPct(warmCount)})`;
		document.getElementById('stat-cold-text').textContent = `个数: ${coldCount} (${getPct(coldCount)})`;
}
