/* ╔════════════════════════════════════════════════════════════╗
   ║  EXTRANO TILES — CONTACT WIDGET JS                        ║
   ║  Builds the widget DOM and handles interactions.          ║
   ║  Self-contained so it works on file:// and over HTTP.     ║
   ╚════════════════════════════════════════════════════════════╝ */

(function () {
  'use strict';

  // Avoid double-init if the script is included more than once
  if (window.__extWidgetLoaded) return;
  window.__extWidgetLoaded = true;

  const WIDGET_HTML = `
<div class="ext-widget-container" role="complementary" aria-label="Contact support widget">

  <button class="ext-widget-fab" aria-label="Open contact options" aria-expanded="false" aria-controls="ext-widget-panel">
    <span class="ext-widget-fab-ring"></span>
    <span class="ext-widget-fab-ring ext-widget-fab-ring-2"></span>
    <span class="ext-widget-live-dot" aria-hidden="true"></span>
    <svg class="ext-widget-fab-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      <circle cx="8.5" cy="12" r="0.9" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/>
      <circle cx="15.5" cy="12" r="0.9" fill="currentColor" stroke="none"/>
    </svg>
  </button>

  <div class="ext-widget-panel" id="ext-widget-panel" role="dialog" aria-labelledby="ext-widget-title" aria-hidden="true">

    <div class="ext-widget-header">
      <div>
        <h3 class="ext-widget-title" id="ext-widget-title">Need help?</h3>
        <p class="ext-widget-subtitle">Contact us now</p>
      </div>
      <button class="ext-widget-close" aria-label="Close contact panel">&times;</button>
    </div>

    <ul class="ext-widget-list" role="list">

      <li role="listitem">
        <a href="https://wa.me/917226855653" target="_blank" rel="noopener noreferrer" class="ext-widget-option" aria-label="Chat with us on WhatsApp">
          <span class="ext-widget-icon ext-widget-icon-whatsapp" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.298-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.015-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.488 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785a9.86 9.86 0 0 1-5.022-1.378l-.36-.214-3.74.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.992c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/>
            </svg>
          </span>
          <div class="ext-widget-text">
            <strong>WhatsApp</strong>
            <span>Chat with us instantly</span>
          </div>
        </a>
      </li>

      <li role="listitem">
        <a href="tel:+917226855653" class="ext-widget-option" aria-label="Call us at +91 72268 55653">
          <span class="ext-widget-icon ext-widget-icon-phone" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <div class="ext-widget-text">
            <strong>Call Us</strong>
            <span>+91 72268 55653</span>
          </div>
        </a>
      </li>

      <li role="listitem">
        <a href="mailto:extranotiles@gmail.com" class="ext-widget-option" aria-label="Email us at extranotiles@gmail.com">
          <span class="ext-widget-icon ext-widget-icon-email" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </span>
          <div class="ext-widget-text">
            <strong>Email Us</strong>
            <span>extranotiles@gmail.com</span>
          </div>
        </a>
      </li>

      <li role="listitem">
        <a href="https://www.instagram.com/extranotiles" target="_blank" rel="noopener noreferrer" class="ext-widget-option" aria-label="Follow us on Instagram">
          <span class="ext-widget-icon ext-widget-icon-instagram" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </span>
          <div class="ext-widget-text">
            <strong>Instagram</strong>
            <span>Follow our work</span>
          </div>
        </a>
      </li>

      <li role="listitem">
        <a href="https://www.facebook.com/share/1EFcHT2ivU/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" class="ext-widget-option" aria-label="Visit us on Facebook">
          <span class="ext-widget-icon ext-widget-icon-facebook" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 1 0-11.563 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988A10.002 10.002 0 0 0 22 12"/>
            </svg>
          </span>
          <div class="ext-widget-text">
            <strong>Facebook</strong>
            <span>Visit our page</span>
          </div>
        </a>
      </li>

      <li role="listitem">
        <a href="https://x.com/extranotiles" target="_blank" rel="noopener noreferrer" class="ext-widget-option" aria-label="Follow us on X (Twitter)">
          <span class="ext-widget-icon ext-widget-icon-twitter" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </span>
          <div class="ext-widget-text">
            <strong>X (Twitter)</strong>
            <span>Latest updates</span>
          </div>
        </a>
      </li>

      <li role="listitem">
        <a href="contact.html" class="ext-widget-option" aria-label="Go to contact form page">
          <span class="ext-widget-icon ext-widget-icon-form" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </span>
          <div class="ext-widget-text">
            <strong>Contact Form</strong>
            <span>Send us a message</span>
          </div>
        </a>
      </li>

    </ul>
  </div>
</div>`;

  function injectMarkup() {
    if (document.querySelector('.ext-widget-container')) return;
    const mount = document.getElementById('widget-mount');
    if (mount) {
      mount.innerHTML = WIDGET_HTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', WIDGET_HTML);
    }
  }

  function init() {
    injectMarkup();

    const fab = document.querySelector('.ext-widget-fab');
    const panel = document.getElementById('ext-widget-panel');
    const closeBtn = document.querySelector('.ext-widget-close');
    const optionLinks = document.querySelectorAll('.ext-widget-option');

    if (!fab || !panel) {
      console.warn('Widget elements not found.');
      return;
    }

    let isOpen = false;

    function openPanel() {
      if (isOpen) return;
      isOpen = true;
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      fab.setAttribute('aria-expanded', 'true');

      const firstOption = panel.querySelector('.ext-widget-option');
      if (firstOption) setTimeout(() => firstOption.focus(), 100);

      document.body.style.overflow = 'hidden';
    }

    function closePanel() {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      fab.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      fab.focus();
    }

    function togglePanel() {
      if (isOpen) closePanel(); else openPanel();
    }

    function handleKeydown(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { closePanel(); return; }

      if (e.key === 'Tab') {
        const focusable = panel.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    }

    function handleClickOutside(e) {
      if (!isOpen) return;
      if (!panel.contains(e.target) && !fab.contains(e.target)) closePanel();
    }

    function handleOptionClick(e) {
      const href = e.currentTarget.getAttribute('href');
      if (href && (href.startsWith('http') || href.startsWith('wa.me') || href.startsWith('tel:') || href.startsWith('mailto:'))) {
        setTimeout(() => closePanel(), 100);
      } else {
        closePanel();
      }
    }

    fab.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', closePanel);
    optionLinks.forEach((link) => link.addEventListener('click', handleOptionClick));
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleClickOutside);

    window.extWidget = { open: openPanel, close: closePanel, toggle: togglePanel };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
