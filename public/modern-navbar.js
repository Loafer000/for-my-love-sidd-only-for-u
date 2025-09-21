// Modern Navigation JavaScript
class ModernNavigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMobile = document.querySelector('.nav-mobile');
    this.navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
    
    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupActiveLinks();
    this.setupSmoothScroll();
  }

  setupScrollEffect() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    });
  }

  setupMobileMenu() {
    if (this.navToggle && this.navMobile) {
      this.navToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close mobile menu when clicking on a link
      document.querySelectorAll('.nav-mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.navbar.contains(e.target) && this.navMobile.classList.contains('active')) {
          this.closeMobileMenu();
        }
      });

      // Close mobile menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navMobile.classList.contains('active')) {
          this.closeMobileMenu();
        }
      });
    }
  }

  toggleMobileMenu() {
    this.navToggle.classList.toggle('active');
    this.navMobile.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (this.navMobile.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.navToggle.classList.remove('active');
    this.navMobile.classList.remove('active');
    document.body.style.overflow = '';
  }

  setupActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 100; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernNavigation();
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});