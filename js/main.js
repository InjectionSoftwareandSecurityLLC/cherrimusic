// ── Loading Overlay ──
(function () {
  var overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        overlay.classList.add('fade-out');
        setTimeout(function () { overlay.remove(); }, 800);
      }, 2800);
    });
  }
})();

// ── Navigation ──
(function () {
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('mobileNav');
  const nav = document.querySelector('.site-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav when a link is tapped
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Hide nav on scroll down, show on scroll up
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var st = window.scrollY;
    if (st > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    if (st > lastScroll && st > 120) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
    lastScroll = st <= 0 ? 0 : st;
  });

  // Active page highlight
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
})();
