const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
    const title = item.querySelector('.menu-title');
    const submenu = item.querySelector('.submenu');
    
    title.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = item.classList.contains('active');

        // 排他：关闭其他所有菜单，并把它们的高度归零
        menuItems.forEach(i => {
            if (i !== item) {
                i.classList.remove('active');
                i.querySelector('.submenu').style.maxHeight = '0px';
            }
        });

        // 切换当前菜单
        if (!isActive) {
            item.classList.add('active');
            // 动态设置为其实际撑开的高度
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
        } else {
            item.classList.remove('active');
            submenu.style.maxHeight = '0px';
        }
    });
});