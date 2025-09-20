// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarNav = document.querySelector('.navbar-nav');

    if (mobileMenuToggle && navbarNav) {
        mobileMenuToggle.addEventListener('click', function() {
            navbarNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar') && navbarNav.classList.contains('active')) {
                navbarNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Handle mobile filters toggle
    const filtersToggle = document.querySelector('.filters-toggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');

    if (filtersToggle && filtersSidebar) {
        filtersToggle.addEventListener('click', function() {
            filtersSidebar.classList.toggle('active');
        });

        // Close filters when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.filters-sidebar') && 
                !event.target.closest('.filters-toggle') && 
                filtersSidebar.classList.contains('active')) {
                filtersSidebar.classList.remove('active');
            }
        });
    }

    // Handle horizontal scrolling for mobile
    const scrollContainers = document.querySelectorAll('.mobile-scroll');
    scrollContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });
});