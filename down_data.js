/* HTML部分
<div id="accordion">
  <div class="item">
    <h3>222<hr></h3>
    <div>
      这是内容1。
    </div>
  </div>
  <div class="item">
    <h3>111<hr></h3>
    <div>
      这是内容2。
    </div>
  </div>
  <!-- 更多的.item元素 -->
</div> */
document.addEventListener('DOMContentLoaded', function() {
	var accordion = document.getElementById('accordion');
	Array.from(accordion.getElementsByTagName('h3')).forEach(function(h3) {
		h3.addEventListener('click', function() {
			var item = h3.parentNode;
			var content = item.getElementsByTagName('div')[0];
			if (content.style.display === 'block') {
				content.style.display = 'none';
				h3.textContent = h3.textContent.slice(0, -1) + ' ⌵';
			} else {
				content.style.display = 'block';
				h3.textContent = h3.textContent.slice(0, -1) + ' ❯';
			}
		});
	});
});