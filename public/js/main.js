document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================================
  // MOBILE DRAWER INTERACTION
  // ========================================================
  const mobileToggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawerCloseBtn = document.querySelector('.drawer-close');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  
  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scroll
  }
  
  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scroll
  }
  
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openDrawer);
  }
  
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }
  
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Close drawer if screen resizes past mobile threshold
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeDrawer();
    }
  });

  // ========================================================
  // SCROLL-TO-TOP BUTTON
  // ========================================================
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('active');
      } else {
        scrollTopBtn.classList.remove('active');
      }
    });
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================================
  // HIGHLIGHT ACTIVE LINK IN NAV MENU
  // ========================================================
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === '/' && currentPath === '/') {
      link.classList.add('active');
    } else if (linkPath !== '/' && currentPath.startsWith(linkPath)) {
      link.classList.add('active');
    }
  });

  // ========================================================
  // HIGHLIGHT ACTIVE ADMIN SIDEBAR ITEM
  // ========================================================
  const adminLinks = document.querySelectorAll('.sidebar-menu a');
  adminLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath) {
      link.classList.add('active');
    }
  });
});
