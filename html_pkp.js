// 获取随机的几张唯一的牌
function get_random_num(arr, count) {
	let new_arr = [];
	let arr1 = [...arr];
	while (new_arr.length < count) {
		let index = Math.floor(Math.random() * arr1.length);
		new_arr.push(arr1[index]);
		arr1.splice(index, 1);
	}
	return new_arr;
}
// 自定义模态对话框函数
function showModal(message) {
	let modal = document.getElementById('myModal');
	let modalContent = document.getElementById('myModalContent');
	modalContent.innerText = message;
	modal.style.display = 'block';
	// 定时关闭
	// setTimeout(function() {
	// 	modal.style.display = "none";
	// }, 2000);
}
// 统计数量
function get_tjnum(arr) {
	arr.sort();
	let new_arr = [];
	for(let v=1;v<7;v++){
		let count = arr.filter(item => item == v).length;
		new_arr.push([v, count]);
	}
	return new_arr;
}
// 博饼规则
function get_gz(arr) {
	let arr1 = get_tjnum(arr);
	str1 = '恭喜 '
	let where01 = (arr1[3][1]===4 && arr1[0][1]===2); // 状元插金花
	let where02 = (arr1[3][1]===6); // 状元, 红六勃
	let where03 = (arr1[0][1]===6); // 状元, 遍地锦
	let where04 = (arr1[1][1]===6 || arr1[2][1]===6 || arr1[4][1]===6 || arr1[5][1]===6); // 状元, 黑六勃
	let where05 = (arr1[3][1]===5); // 状元, 红五
	let where06 = (arr1[0][1]===5 || arr1[1][1]===5 || arr1[2][1]===5 || arr1[4][1]===5 || arr1[5][1]===5); // 状元, 五子
	let where07 = (arr1[3][1]===4); // 状元, 红四
	let where08 = (arr1[0][1]===1 && arr1[1][1]===1 && arr1[2][1]===1 && arr1[3][1]===1 && arr1[4][1]===1 && arr1[5][1]===1); // 榜眼, 对堂
	let where09 = (arr1[3][1]===3); // 探花, 三红
	let where10 = (arr1[0][1]===4 || arr1[1][1]===4 || arr1[2][1]===4 || arr1[4][1]===4 || arr1[5][1]===4); // 进士, 四进
	let where11 = (arr1[3][1]===2); // 举人, 二举
	let where12 = (arr1[3][1]===1 && !where08); // 秀才, 一秀
	if (where01){
		// alert(str1+'状元插金花');
		showModal(str1+'状元插金花');
	} else if (where02){
		showModal(str1+'状元, 红六勃');
	} else if (where03){
		showModal(str1+'状元, 遍地锦');
	} else if (where04){
		showModal(str1+'状元, 黑六勃');
	} else if (where05){
		showModal(str1+'状元, 红五');
	} else if (where06){
		showModal(str1+'状元, 五子');
	} else if (where07){
		showModal(str1+'状元, 红四');
	} else if (where08){
		showModal(str1+'榜眼, 对堂');
	} else if (where09){
		showModal(str1+'探花, 三红');
	} else if (where10){
		showModal(str1+'进士, 四进');
	} else if (where11){
		showModal(str1+'举人, 二举');
	} else if (where12){
		showModal(str1+'秀才, 一秀');
	} else {
		showModal('继续加油...');
	}
}
// 权重随机
function get_qz1() {
	let prizes = [
		{ name: 'zy1', weight: 15 },
		{ name: 'zy2', weight: 1 },
		{ name: 'zy3', weight: 1 },
		{ name: 'zy4', weight: 4 },
		{ name: 'zy5', weight: 30 },
		{ name: 'zy6', weight: 150 },
		{ name: 'zy7', weight: 360 },
		{ name: 'by', weight: 720 },
		{ name: 'th', weight: 2500 },
		{ name: 'js', weight: 1875 },
		{ name: 'jr', weight: 9300 },
		{ name: 'xc', weight: 17400 },
		{ name: 'jxjy', weight: 14300 }
	];
	let map = ''
	let prize = draw(prizes)
	if (prize) {
		map = prize.name
	}
	return map
}
// 返回数组中的随机一个
function return_arr1(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
// 权重随机
function get_qz2() {
	let peoples = [
		{ n: 'p1', w: 1 },
		{ n: 'p2', w: 100 },
		{ n: 'p3', w: 100 }
	];
	let rand = function (p) {
		const totalWeight = p.reduce(function (pre, cur, index) {
			cur.startW = pre;
			return cur.endW = pre + cur.w
		}, 0)
		let random = Math.ceil(Math.random() * totalWeight)
		let selectPeople = p.find(people => people.startW < random && people.endW > random)
		return selectPeople.n
	};
	return rand(peoples);
}
function draw(prizes) {
	// 根据每个奖品的权重，生成区间 [[0, 50], [50, 100], ...]
	const intervals = prizes.reduce((acc, curr, idx) => {
		const weight = curr.weight
		const [preStart, preEnd] = acc[acc.length-1] || [0, 0]
		acc.push([preEnd, preEnd + weight])
		return acc
	}, []);
	// 找到区间的最小和最大值
	const [min, max] = intervals.reduce((acc, curr) => {
		if (curr && curr.length) {
			acc[0] = Math.min(acc[0], curr[0])
			acc[1] = Math.max(acc[1], curr[1])
		}
		return acc
	}, [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]);
	// 随机一个数
	const luckyNumber = random(min, max);
	// 看落在哪个区间
	const luckPrizeIndex = intervals.findIndex(item => item[0] <= luckyNumber && item[1] > luckyNumber)
	if (luckPrizeIndex === -1) {
		// 当做未中奖来处理
	}
	// 找到中奖奖品
	const luckyPirze = prizes[luckPrizeIndex]
	return luckyPirze
}
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}
function testDraw() {
	const prizes = [
		{
			name: "抽奖券",
			weight: 50,
		},{
			name: "大奖",
			weight: 70,
		},{
			name: "二奖",
			weight: 80,
		}];
	const countMap = {}
	for (let i = 0; i < 10000; i++) {
		const prize = draw(prizes)
		if (prize) {
			countMap[prize.name] = (countMap[prize.name] || 0) + 1
		}
	}
	return countMap
}
function testDraw1() {
	const prizes = [
		{ name: 'zy1', weight: 15 },
		{ name: 'zy2', weight: 1 },
		{ name: 'zy3', weight: 1 },
		{ name: 'zy4', weight: 4 },
		{ name: 'zy5', weight: 30 },
		{ name: 'zy6', weight: 150 },
		{ name: 'zy7', weight: 360 },
		{ name: 'by', weight: 720 },
		{ name: 'th', weight: 2500 },
		{ name: 'js', weight: 1875 },
		{ name: 'jr', weight: 9300 },
		{ name: 'xc', weight: 17400 },
		{ name: 'jxjy', weight: 14300 }
	];
	const countMap = {}
	for (let i = 0; i < 50; i++) {
		const prize = draw(prizes)
		if (prize) {
			countMap[prize.name] = (countMap[prize.name] || 0) + 1
		}
	}
	return countMap
}
// console.log(testDraw());
