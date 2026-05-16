/* ╔═══════════════════════════════════════════════════════════╗
   ║  HERO CAROUSEL + MOBILE MENU (jQuery + OwlCarousel)      ║
   ╚═══════════════════════════════════════════════════════════╝ */
$(function () {

  const AUTOPLAY_MS = 6000;
  const TOTAL = 3;

  /* ── Progress bar ── */
  function startProgress() {
    var $bar = $('#progressBar');
    $bar.removeClass('running').css('width', '0%');
    $bar[0].offsetWidth;
    $bar.addClass('running').css({ 'transition-duration': AUTOPLAY_MS + 'ms', 'width': '100%' });
  }

  /* ── Slide counter ── */
  function updateCounter(realIdx) {
    $('#curNum').text(String(realIdx + 1).padStart(2, '0'));
  }

  /* ── Animate the currently-active slide ── */
  function animateActiveSlide() {
    $('.owl-item .slider-item').removeClass('animate-in animate-out');
    $('.owl-item .slide-kicker, .owl-item .slide-title, .owl-item .slide-desc, .owl-item .slide-btn-box')
      .css({ opacity: '', transform: '' });

    var $item = $('.owl-item.active .slider-item');
    if (!$item.length) return;
    $item[0].offsetWidth; /* force reflow so transitions replay */
    $item.addClass('animate-in');
    startProgress();
  }

  /* ── Init OWL ── */
  var $owl = $('#heroCarousel').owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: AUTOPLAY_MS,
    autoplayHoverPause: false,
    smartSpeed: 600,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    mouseDrag: false,
    touchDrag: false,
    nav: true,
    navText: [
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>'
    ],
    dots: true,
    dotsEach: 1,
  });

  /* ── Exit: fade out outgoing content ── */
  $owl.on('translate.owl.carousel', function () {
    $('.owl-item.active .slider-item')
      .removeClass('animate-in')
      .addClass('animate-out');
  });

  /* ── Enter: fade in incoming content (slides 2+) ── */
  $owl.on('translated.owl.carousel', function (e) {
    var realIdx = e.item.index - (e.relatedTarget._clones.length / 2);
    if (realIdx < 0) realIdx += TOTAL;
    if (realIdx >= TOTAL) realIdx -= TOTAL;
    updateCounter(realIdx);
    animateActiveSlide();
  });

  /* ── First slide: animate when the intro loader finishes ──
     `initialized.owl.carousel` fires synchronously during .owlCarousel() init,
     before our $owl.on(...) handlers are attached, so we trigger the first
     animation from the intro-complete event (fallback: window.load + 4s). */
  var firstSlideAnimated = false;
  function kickFirstSlide() {
    if (firstSlideAnimated) return;
    firstSlideAnimated = true;
    requestAnimationFrame(animateActiveSlide);
  }
  document.addEventListener('extrano:intro-complete', kickFirstSlide);
  window.addEventListener('load', function () {
    setTimeout(kickFirstSlide, 4000); /* safety net if intro never fires */
  });

  /* ── Mobile menu ── */
  window.openMobile = function () {
    $('#mobile-menu').addClass('open').attr('aria-hidden', 'false');
    $('#ham').addClass('open').attr('aria-expanded', 'true');
    $('body').css('overflow', 'hidden');
  };
  window.closeMobile = function () {
    $('#mobile-menu').removeClass('open').attr('aria-hidden', 'true');
    $('#ham').removeClass('open').attr('aria-expanded', 'false');
    $('body').css('overflow', '');
  };
  $('#mobile-menu a').on('click', function () { closeMobile(); });
  $(document).on('keydown', function (e) { if (e.key === 'Escape') closeMobile(); });

  /* ── Mobile menu — expandable Collection group ── */
  $('#mobile-menu .mm-trigger').on('click', function (e) {
    e.preventDefault();
    var $group = $(this).parent('.mm-group');
    var isOpen = $group.toggleClass('open').hasClass('open');
    $(this).attr('aria-expanded', isOpen ? 'true' : 'false');
  });

});


/* ╔═══════════════════════════════════════════════════════════╗
   ║  LOGO INTRO LOADER                                       ║
   ║  Flow:                                                    ║
   ║   1. White overlay covers viewport                        ║
   ║   2. Cloned header logo sits dead-centre                  ║
   ║   3. ~2s pause, then clone flies to header logo position  ║
   ║   4. Real header logo fades in, overlay fades out, gone   ║
   ╚═══════════════════════════════════════════════════════════╝ */
(function () {
  var MIN_SHOW_MS = 400; /* floor so the logo never just flashes on fast loads */
  var MAX_WAIT_MS = 6000;/* ceiling so a stuck asset can't trap the user */
  var FLIGHT_MS   = 950; /* must match .logo-loader-clone transition */
  var FADE_MS     = 600; /* must match #logo-loader transition */

  function runIntro() {
    var loader     = document.getElementById('logo-loader');
    var headerLogo = document.querySelector('#site-header .nav-logo-img');
    if (!loader || !headerLogo) return;

    var startedAt = Date.now();
    document.body.classList.add('intro-active');

    /* Clone the real header logo so the DOM original stays put */
    var clone = headerLogo.cloneNode(true);
    clone.removeAttribute('id');
    clone.className = 'logo-loader-clone';
    clone.alt = '';
    clone.setAttribute('aria-hidden', 'true');
    loader.appendChild(clone);

    /* Wait for the clone img to decode, then for full page load,
       so getBoundingClientRect() reads stable positions. */
    function whenReady(cb) {
      var imgReady  = clone.complete && clone.naturalWidth > 0;
      var pageReady = document.readyState === 'complete';
      if (imgReady && pageReady) return cb();
      if (!imgReady) {
        clone.addEventListener('load',  function () { whenReady(cb); }, { once: true });
        clone.addEventListener('error', function () { whenReady(cb); }, { once: true });
        return;
      }
      window.addEventListener('load', function () { cb(); }, { once: true });
    }

    function finish() {
      /* Clone has landed: reveal real header logo, fade overlay, then remove */
      document.body.classList.remove('intro-active');
      loader.classList.add('fade-out');
      document.dispatchEvent(new CustomEvent('extrano:intro-complete'));
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, FADE_MS + 50);
    }

    function fly() {
      var target = headerLogo.getBoundingClientRect();
      var origin = clone.getBoundingClientRect();
      var dx = (target.left + target.width  / 2) - (origin.left + origin.width  / 2);
      var dy = (target.top  + target.height / 2) - (origin.top  + origin.height / 2);

      /* Match the header logo's rendered height so the landing is seamless */
      clone.style.height    = target.height + 'px';
      clone.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';

      setTimeout(finish, FLIGHT_MS);
    }

    /* Behave like a real loader: fly the moment the page is ready,
       but keep a small floor so it never just flashes, and a ceiling so
       a slow/stuck asset can't keep the user stranded forever. */
    var flown = false;
    function launch() {
      if (flown) return;
      flown = true;
      var elapsed   = Date.now() - startedAt;
      var remaining = Math.max(0, MIN_SHOW_MS - elapsed);
      setTimeout(fly, remaining);
    }
    whenReady(launch);
    setTimeout(launch, MAX_WAIT_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }
})();


/* ╔═══════════════════════════════════════════════════════════╗
   ║  SCROLL ANIMATION — pure JS, no jQuery dependency        ║
   ╚═══════════════════════════════════════════════════════════╝ */
(function () {
  function initScrollAnim() {
    var isMobile = window.innerWidth <= 640;
    var featCards = Array.from(document.querySelectorAll('.feat-card'));
    var catCards  = Array.from(document.querySelectorAll('.blog-one__single'));
    var cards     = featCards.concat(catCards);

    /* About section — left/right panels + stat blocks */
    var aboutPanels = Array.from(document.querySelectorAll('.about-left, .about-right'));
    var aboutStats  = Array.from(document.querySelectorAll('.about-stat'));

    /* ── General slide-in observer (feat + cat cards) ── */
    if (cards.length && window.IntersectionObserver) {
      var cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var card     = entry.target;
          var siblings = Array.from(card.parentElement.children);
          var idx      = siblings.indexOf(card);
          var cols  = window.innerWidth <= 640 ? 1 : window.innerWidth <= 960 ? 2 : 3;
          var delay = cols === 1 ? idx * 100 : cols === 2 ? (idx % 2) * 120 : (idx % 3) * 110;
          card.style.transition =
            'opacity 0.6s ease ' + delay + 'ms, ' +
            'transform 0.6s cubic-bezier(0.22,0.61,0.36,1) ' + delay + 'ms';
          card.classList.add('in-view');
          cardObserver.unobserve(card);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
      cards.forEach(function (c) { cardObserver.observe(c); });
    }

    /* ── About panels observer ── */
    if (aboutPanels.length && window.IntersectionObserver) {
      var panelObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          panelObserver.unobserve(entry.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      aboutPanels.forEach(function (p) { panelObserver.observe(p); });
    }

    /* ── Stat counters: fade up + count-up number ── */
    if (aboutStats.length && window.IntersectionObserver) {
      var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var stat  = entry.target;
          var idx   = aboutStats.indexOf(stat);
          var delay = idx * 120;
          stat.style.transition =
            'opacity 0.6s ease ' + delay + 'ms, ' +
            'transform 0.6s ease ' + delay + 'ms';
          stat.classList.add('in-view');

          /* Count-up animation */
          var el     = stat.querySelector('.count-num');
          var target = parseInt(el.getAttribute('data-target'), 10);
          var dur    = 1800;
          var start  = performance.now();
          (function tick(now) {
            var elapsed = now - start - delay;
            if (elapsed < 0) { requestAnimationFrame(tick); return; }
            var progress = Math.min(elapsed / dur, 1);
            /* ease-out cubic */
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
          })(performance.now());

          statObserver.unobserve(stat);
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
      aboutStats.forEach(function (s) { statObserver.observe(s); });
    }

    window.addEventListener('resize', function () { isMobile = window.innerWidth <= 640; });
  }

  /* Wait for page to fully load before setting up observer —
     prevents cards already on screen firing immediately on load */
  window.addEventListener('load', function () {
    setTimeout(initScrollAnim, 300);
  });
})();


/* ╔═══════════════════════════════════════════════════════════╗
   ║  BACKGROUND GEOMETRY — grid lines + spider-web ornaments  ║
   ║  Fixed canvas behind all content, pointer-events:none     ║
   ╚═══════════════════════════════════════════════════════════╝ */
(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return; // Exit if canvas doesn't exist on this page
  
  var ctx    = canvas.getContext('2d');
  var W, H;
  var rotation = 0;
  var rafId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Draw one frame ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* ── 1. Subtle dot-grid across the whole canvas ── */
    var gridStep = 55;
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (var gx = 0; gx < W; gx += gridStep) {
      for (var gy = 0; gy < H; gy += gridStep) {
        ctx.beginPath();
        ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* ── 2. Faint grid lines (vertical + horizontal) ── */
    ctx.lineWidth   = 0.4;
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (var lx = 0; lx < W; lx += gridStep) {
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
    }
    for (var ly = 0; ly < H; ly += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke();
    }

    /* ── 3. Spider-web ornaments (slowly rotating) ── */
    drawWeb(W * 0.06,  H * 0.82, 260, rotation);        /* bottom-left  */
    drawWeb(W * 0.94,  H * 0.18, 180, -rotation * 0.7); /* top-right    */
    drawWeb(W * 0.50,  H * 0.50, 130, rotation * 0.4);  /* centre (tiny)*/

    rotation += 0.0008; /* very slow spin */
    rafId = requestAnimationFrame(draw);
  }

  /* ── Draw one spider-web centred at (cx,cy) with maxRadius ── */
  function drawWeb(cx, cy, maxR, rot) {
    var rings  = 7;
    var spokes = 16;
    var goldA  = 'rgba(158,122,74,';   /* --gold base */

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    /* Concentric rings */
    for (var r = 1; r <= rings; r++) {
      var radius = (r / rings) * maxR;
      var alpha  = 0.14 - (r / rings) * 0.10; /* fade outward */
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = goldA + alpha + ')';
      ctx.lineWidth   = 0.6;
      ctx.stroke();
    }

    /* Radial spokes */
    for (var s = 0; s < spokes; s++) {
      var angle = (s / spokes) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * maxR, Math.sin(angle) * maxR);
      ctx.strokeStyle = goldA + '0.07)';
      ctx.lineWidth   = 0.5;
      ctx.stroke();
    }

    /* Centre dot */
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = goldA + '0.25)';
    ctx.fill();

    ctx.restore();
  }

  window.addEventListener('resize', function () {
    cancelAnimationFrame(rafId);
    resize();
    draw();
  });

  resize();
  draw();
})();


/* ╔═══════════════════════════════════════════════════════════╗
   ║  MOBILE HEADER HIDE/SHOW ON SCROLL                       ║
   ╚═══════════════════════════════════════════════════════════╝ */
document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('site-header');
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
