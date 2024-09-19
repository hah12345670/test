document.getElementById('yx1').addEventListener('click', function(event) {
	let unum = get_random_num(arr, 6);
	document.getElementById('jg').innerHTML = '<td>' + unum[0] + unum[2] + unum[4] + '</td><td>' + unum[1] + unum[3] + unum[5] + '</td>'
});
document.getElementById('yx2').addEventListener('click', function(event) {
	let unum = get_random_num(arr, 4);
	document.getElementById('jg').innerHTML = '<td colspan=2>' + unum[0] + unum[1] + unum[2] + unum[3] + '</td>'
});
document.getElementById('yx3').addEventListener('click', function(event) {
	let unum = get_random_num(arr2, 3);
	document.getElementById('jg').innerHTML = '<td colspan=2>' + unum[0] + unum[1] + unum[2] + '</td>'
});
document.getElementById('yx4').addEventListener('click', function(event) {
	let unum = get_random_num(arr3, 6);
	let res = [];
	for(let x=0;x<unum.length;x++){
		// res.push(unum[x].substring(unum[x].length-11));
		res.push(unum[x].slice(-11, -10));
	}
	document.getElementById('jg').innerHTML = '<td colspan=2>' + unum[0] + unum[1] + unum[2] + unum[3] + unum[4] + unum[5] + '</td>'
	window.setTimeout(function() {
		get_gz(res);
	}, 0);
});
document.getElementById('myModal').addEventListener('click', function(event) {
	document.getElementById('myModal').style.display = "none";
});
