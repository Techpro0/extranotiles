(function () {

  /* ── Scroll reveal ──────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  window.addEventListener('load', function () {
    setTimeout(function () {
      reveals.forEach(function (el) { revealObserver.observe(el); });
    }, 200);
  });

  /* ── Count-up for .who-stats ────────────────────── */
  var counters = document.querySelectorAll('.c-num');
  var counted  = false;

  var countObserver = new IntersectionObserver(function (entries) {
    if (counted) return;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      counted = true;
      counters.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-t'), 10);
        var dur    = 1800;
        var start  = performance.now();
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
          el.textContent = Math.floor(e * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        })(performance.now());
      });
      countObserver.disconnect();
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.who-stats');
  if (statsSection) countObserver.observe(statsSection);

  /* ── Hero image subtle zoom-in on load ─────────── */
  window.addEventListener('load', function () {
    var img = document.querySelector('.hero-right img');
    if (img) img.style.transform = 'scale(1)';
  });

  /* ── Mobile menu toggle ─────────────────────────── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var mmClose    = document.getElementById('mm-close');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) closeMenu(); else openMenu();
    });
    mmClose.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });

    /* Expandable Collection group inside the mobile menu */
    mobileMenu.querySelectorAll('.mm-trigger').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var group = btn.parentElement;
        var isOpen = group.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

})();


/* ═══════════════════════════════════════════════════════════
   MOBILE HEADER HIDE/SHOW ON SCROLL
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('nav');
  if (!header) return;
  
  var lastScrollTop = 0;
  var scrollThreshold = 10;
  var isHidden = false;
  
  function isMobile() {
    return window.innerWidth <= 640;
  }
  
  function handleScroll() {
    if (!isMobile()) {
      if (isHidden) {
        header.classList.remove('header-hidden');
        isHidden = false;
      }
      return;
    }
    
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var diff = scrollTop - lastScrollTop;
    
    if (Math.abs(diff) < scrollThreshold) {
      return;
    }
    
    if (diff > 0 && !isHidden) {
      // Scrolling down — hide header
      header.classList.add('header-hidden');
      isHidden = true;
    } else if (diff < 0 && isHidden) {
      // Scrolling up — show header
      header.classList.remove('header-hidden');
      isHidden = false;
    }
    
    lastScrollTop = scrollTop;
  }
  
  function handleResize() {
    if (!isMobile() && isHidden) {
      header.classList.remove('header-hidden');
      isHidden = false;
    }
  }
  
  window.addEventListener('scroll', handleScroll, false);
  window.addEventListener('resize', handleResize);
});
