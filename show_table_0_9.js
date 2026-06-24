const buttons = document.querySelectorAll('.filter-btn');
const boxes = document.querySelectorAll('.box');
const resetBtn = document.getElementById('resetBtn');
const selectAllBtn = document.getElementById('selectAllBtn');

let currentMode = 'ALL'; 
let selectedNumbers = new Set();

function render() {
		boxes.forEach(box => {
				box.classList.remove('opacity-100', 'opacity-30', 'opacity-15');
		});

		if (currentMode === 'ALL') {
				buttons.forEach(btn => btn.classList.add('active')); 
				boxes.forEach(box => box.classList.add('opacity-100')); 
				
		} else if (currentMode === 'RESET') {
				buttons.forEach(btn => btn.classList.remove('active')); 
				boxes.forEach(box => {
						if (box.getAttribute('data-dim') === 'true') {
								box.classList.add('opacity-30'); 
						} else {
								box.classList.add('opacity-100'); 
						}
				});

		} else if (currentMode === 'FILTER') {
				buttons.forEach(btn => {
						const num = btn.getAttribute('data-num');
						if (selectedNumbers.has(num)) {
								btn.classList.add('active');
						} else {
								btn.classList.remove('active');
						}
				});
				boxes.forEach(box => {
						const val = box.getAttribute('data-val');
						if (selectedNumbers.has(val)) {
								box.classList.add('opacity-100'); 
						} else {
								box.classList.add('opacity-15');  
						}
				});
		}
}

function handleNumberClick(num) {
		if (currentMode !== 'FILTER') {
				currentMode = 'FILTER';
				selectedNumbers.clear();
				selectedNumbers.add(num);
		} else {
				if (selectedNumbers.has(num)) {
						selectedNumbers.delete(num);
						if (selectedNumbers.size === 0) {
								currentMode = 'RESET';
						}
				} else {
						selectedNumbers.add(num);
				}
		}
		render();
}

buttons.forEach(btn => {
		btn.addEventListener('click', () => {
				handleNumberClick(btn.getAttribute('data-num'));
		});
});

boxes.forEach(box => {
		box.addEventListener('click', () => {
				handleNumberClick(box.getAttribute('data-val'));
		});
});

selectAllBtn.addEventListener('click', () => {
		currentMode = 'ALL';
		selectedNumbers.clear();
		render();
});

resetBtn.addEventListener('click', () => {
		currentMode = 'RESET';
		selectedNumbers.clear();
		render();
});

window.addEventListener('DOMContentLoaded', () => {
		currentMode = 'ALL';
		render();
});