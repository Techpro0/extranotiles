/* ╔══════════════════════════════════════════════════════╗
   ║  CONTACT FORM                                        ║
   ║  - Client-side validation                            ║
   ║  - EmailJS submission                                ║
   ║  - Loading / success / error states                  ║
   ║  - Double-submit guard                               ║
   ╚══════════════════════════════════════════════════════╝ */
(function () {

  /* ─── EmailJS configuration ───────────────────────────
     Fill in the three placeholders below from your
     EmailJS dashboard (https://dashboard.emailjs.com/).

     IMPORTANT: configure the template's "To Email" field
     to: yashaghara1234@gmail.com

     The template should expect these variables (the names
     match the <input name="..."> attributes in contact.html):
       - from_name
       - from_email
       - phone
       - subject
       - message
     A suggested template body:
       New inquiry from {{from_name}} ({{from_email}})
       Phone:   {{phone}}
       Subject: {{subject}}
       --
       {{message}}
  ──────────────────────────────────────────────────────── */
  var EMAILJS_PUBLIC_KEY  = 'doznozbS8H9Y_lS37';
  var EMAILJS_SERVICE_ID  = 'service_cuimvuk';
  var EMAILJS_TEMPLATE_ID = 'template_9olm1so';

  /* Initialize EmailJS once the SDK has loaded */
  if (typeof emailjs !== 'undefined') {
    try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); }
    catch (e) { /* older v3 fallback */ try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (_) {} }
  }

  var form = document.getElementById('contactForm');
  if (!form) return;

  var submitBtn = form.querySelector('.form-submit');
  var labelEl   = submitBtn.querySelector('.label');
  var statusEl  = form.querySelector('.form-status');
  var sending   = false;

  var fields = {
    name:    form.querySelector('[name="from_name"]'),
    email:   form.querySelector('[name="from_email"]'),
    phone:   form.querySelector('[name="phone"]'),
    subject: form.querySelector('[name="subject"]'),
    message: form.querySelector('[name="message"]')
  };

  /* Validation patterns */
  var EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  /* Indian 10-digit mobile, optional +91 / 91 / 0 prefix, optional space or dash */
  var PHONE_RX = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/;

  /* ─── helpers ─────────────────────────────────────── */
  function setError(name, msg) {
    var input = fields[name];
    var errEl = form.querySelector('[data-error="' + name + '"]');
    if (msg) {
      input.classList.add('is-error');
      input.setAttribute('aria-invalid', 'true');
      if (errEl) errEl.textContent = msg;
    } else {
      input.classList.remove('is-error');
      input.removeAttribute('aria-invalid');
      if (errEl) errEl.textContent = '';
    }
  }

  function setStatus(type, msg) {
    statusEl.classList.remove('is-success', 'is-error');
    if (type) {
      statusEl.classList.add('is-' + type);
      statusEl.textContent = msg;
    } else {
      statusEl.textContent = '';
    }
  }

  function setSending(s) {
    sending = s;
    submitBtn.disabled = s;
    submitBtn.classList.toggle('sending', s);
    if (labelEl) labelEl.textContent = s ? 'Sending…' : 'Send Message';
  }

  function validate() {
    var ok      = true;
    var name    = fields.name.value.trim();
    var email   = fields.email.value.trim();
    var phone   = fields.phone.value.trim();
    var message = fields.message.value.trim();

    if (!name) {
      setError('name', 'Please enter your name.'); ok = false;
    } else if (name.length < 2) {
      setError('name', 'Name looks too short.'); ok = false;
    } else { setError('name', ''); }

    if (!email) {
      setError('email', 'Email is required.'); ok = false;
    } else if (!EMAIL_RX.test(email)) {
      setError('email', 'Enter a valid email address.'); ok = false;
    } else { setError('email', ''); }

    var cleanedPhone = phone.replace(/[\s-]/g, '');
    if (!phone) {
      setError('phone', 'Phone number is required.'); ok = false;
    } else if (!PHONE_RX.test(cleanedPhone)) {
      setError('phone', 'Enter a valid 10-digit Indian number.'); ok = false;
    } else { setError('phone', ''); }

    if (!message) {
      setError('message', 'Please write a message.'); ok = false;
    } else if (message.length < 10) {
      setError('message', 'Message looks too short.'); ok = false;
    } else { setError('message', ''); }

    return ok;
  }

  /* ─── live-validate on blur (after the user has touched a field) ─── */
  Object.keys(fields).forEach(function (key) {
    var input = fields[key];
    if (!input) return;
    input.addEventListener('blur', function () {
      /* Only re-validate if the field already has an error showing —
         avoids being aggressive on first focus. */
      if (input.classList.contains('is-error')) validate();
    });
    input.addEventListener('input', function () {
      if (input.classList.contains('is-error')) {
        /* Clear inline error as the user fixes it */
        var errEl = form.querySelector('[data-error="' + key + '"]');
        input.classList.remove('is-error');
        input.removeAttribute('aria-invalid');
        if (errEl) errEl.textContent = '';
      }
    });
  });

  /* ─── submit handler ──────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;          /* Double-submit guard */
    setStatus('', '');
    if (!validate()) return;

    if (typeof emailjs === 'undefined') {
      setStatus('error', 'Email service is not available right now. Please email us directly at extranotiles@gmail.com.');
      return;
    }

    setSending(true);

    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(function () {
        setStatus('success', "Thank you! Your message has been sent. We'll get back to you soon.");
        form.reset();
      })
      .catch(function (err) {
        // eslint-disable-next-line no-console
        console.error('EmailJS error:', err);
        setStatus('error', 'Something went wrong. Please try again or email us directly at extranotiles@gmail.com.');
      })
      .finally(function () {
        setSending(false);
      });
  });

})();
