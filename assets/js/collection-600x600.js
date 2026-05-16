/* ╔══════════════════════════════════════════════════════╗
   ║  COLLECTION 600×600MM — list ↔ detail toggle         ║
   ║  Plain JS (no jQuery dependency, no new libraries).  ║
   ╚══════════════════════════════════════════════════════╝ */
(function () {
  var items  = document.querySelectorAll('.cc-list-item');
  var panels = document.querySelectorAll('.cc-detail-panel');
  if (!items.length || !panels.length) return;

  function activate(target) {
    items.forEach(function (b) {
      var active = b.getAttribute('data-target') === target;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
      b.setAttribute('tabindex', active ? '0' : '-1');
    });
    panels.forEach(function (p) {
      p.classList.toggle('is-active', p.id === 'cc-panel-' + target);
    });
  }

  var list = Array.prototype.slice.call(items);

  items.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activate(btn.getAttribute('data-target'));
    });

    /* Arrow-key navigation between tabs */
    btn.addEventListener('keydown', function (e) {
      var idx = list.indexOf(btn);
      var next;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        next = list[(idx + 1) % list.length];
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        next = list[(idx - 1 + list.length) % list.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        next = list[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        next = list[list.length - 1];
      } else {
        return;
      }
      activate(next.getAttribute('data-target'));
      next.focus();
    });
  });
})();
