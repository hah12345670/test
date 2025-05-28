const container = document.getElementById("container");
const gridOutput = document.getElementById("gridOutput");
const buttoncf = document.getElementById("buttoncf");
const buttondw = document.getElementById("buttondw");

container.addEventListener("click", function (e) {
	if (e.target.classList.contains("item")) {
		e.target.classList.toggle("selected");

		const rows = Array.from(container.querySelectorAll(".row"));
		const result = rows.map(row => {
			const spans = Array.from(row.querySelectorAll(".item"));
			return spans.map(span => {
				return span.classList.contains("selected")
					? wr_arr[JSON.parse(span.dataset.value)[0]][JSON.parse(span.dataset.value)[1]]
					: [];
			});
		});

		newwr_arr = result;
		tj_zy(newtj_arr, newwr_arr);
	}
});

buttoncf.addEventListener("click", function (e) {
	if (e.target.classList.contains("item")) {
		if (e.target.classList.toggle("selected")) {
			isRepeat = 1;
			// console.log(JSON.parse(e.target.dataset.value));
		} else {
			isRepeat = 0;
		}
		tj_zy(newtj_arr, newwr_arr);
	}
});

buttondw.addEventListener("click", function (e) {
	if (e.target.classList.contains("item")) {
		if (e.target.classList.toggle("selected")) {
			isDwRestart = 1;
		} else {
			isDwRestart = 0;
		}
		tj_zy(newtj_arr, newwr_arr);
	}
});

function renderGrid(arrays) {
	gridOutput.innerHTML = ""; // 清空之前的内容
	arrays.forEach(arr => {
		const cell = document.createElement("div");
		cell.className = "cell";
		cell.textContent = `[${arr.join(", ")}]`;
		gridOutput.appendChild(cell);
	});
}