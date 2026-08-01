document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav){
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen){
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  initVerification();
  initContactForm();
  autoVerifyFromPath();
});

const SLUG_TO_CERTIFICATE_ID = {
  '3f9b2c7d1e4a': '62731-94516-71892'
};

function autoVerifyFromPath(){
  const match = window.location.pathname.match(/^\/verify\/([a-zA-Z0-9]+)\/?$/);
  if (!match) return;
  const certId = SLUG_TO_CERTIFICATE_ID[match[1]];
  const input = document.querySelector('#cert-id');
  const form = document.querySelector('#verify-form');
  if (certId && input && form){
    input.value = certId;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
  }
}

const CERTIFICATE_RECORDS = {
  '62731-94516-71892': {
    name: 'Francis Dennis Wakaba Ndirangu',
    course: 'Foundations of ITIL 4 for Service Management',
    issued: '01 August 2026',
    status: 'Active',
    issuer: 'ITSM Training Alliance',
    id: '62731-94516-71892'
  },
  'CV-2024-88213': {
    name: 'Amara Odhiambo',
    course: 'Diploma in Project Management',
    issued: '14 March 2024',
    status: 'Active',
    issuer: 'Nairobi Institute of Technology',
    id: 'CV-2024-88213'
  },
  'CV-2023-40217': {
    name: 'Daniel Kip Cheruiyot',
    course: 'Certificate in Digital Marketing',
    issued: '02 September 2023',
    status: 'Active',
    issuer: 'Nairobi Institute of Technology',
    id: 'CV-2023-40217'
  },
  'CV-2025-10099': {
    name: 'Grace Wanjiru',
    course: 'Diploma in Data Analysis',
    issued: '28 January 2025',
    status: 'Active',
    issuer: 'Nairobi Institute of Technology',
    id: 'CV-2025-10099'
  }
};

function lookupCertificate(rawId){
  const id = rawId.trim().toUpperCase();
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(CERTIFICATE_RECORDS[id] || null);
    }, 900);
  });
}

function initVerification(){
  const form = document.querySelector('#verify-form');
  if (!form) return;

  const input = form.querySelector('#cert-id');
  const loadingEl = document.querySelector('#verify-loading');
  const resultEl = document.querySelector('#verify-result');
  const sealWrap = document.querySelector('.seal-wrap');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }

    resultEl.classList.remove('show', 'verified', 'invalid');
    loadingEl.classList.add('show');
    if (sealWrap) sealWrap.classList.remove('locked');

    const record = await lookupCertificate(value);

    loadingEl.classList.remove('show');

    if (record){
      resultEl.classList.add('show', 'verified');
      resultEl.innerHTML = `
        <div class="result-head">
          <span class="result-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Certificate Verified
          </span>
        </div>
        <dl class="result-grid">
          <div><dt>Certificate Holder</dt><dd>${escapeHtml(record.name)}</dd></div>
          <div><dt>Certificate ID</dt><dd>${escapeHtml(record.id)}</dd></div>
          <div><dt>Course / Credential</dt><dd>${escapeHtml(record.course)}</dd></div>
          <div><dt>Date Issued</dt><dd>${escapeHtml(record.issued)}</dd></div>
          <div><dt>Issuing Partner</dt><dd>${escapeHtml(record.issuer)}</dd></div>
        </dl>
      `;
      if (sealWrap) sealWrap.classList.add('locked');
    } else {
      resultEl.classList.add('show', 'invalid');
      resultEl.innerHTML = `
        <div class="result-head">
          <span class="result-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            Not Found
          </span>
        </div>
        <p>We couldn't match "<strong>${escapeHtml(value)}</strong>" to a record. Double-check the certificate ID for typos, or contact the issuing institution if you believe this is an error.</p>
      `;
    }
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initContactForm(){
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = document.querySelector('#form-status');

  const fields = {
    name: {
      el: form.querySelector('#name'),
      validate: (v) => {
        v = v.trim();
        if (!v) return 'Enter your full name.';
        if (v.length < 2) return 'Name must be at least 2 characters.';
        return '';
      }
    },
    email: {
      el: form.querySelector('#email'),
      validate: (v) => {
        v = v.trim();
        if (!v) return 'Enter your email address.';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v)) return 'Enter a valid email address.';
        return '';
      }
    },
    reason: {
      el: form.querySelector('#reason'),
      validate: (v) => {
        if (!v) return 'Select a reason for contact.';
        return '';
      }
    },
    message: {
      el: form.querySelector('#message'),
      validate: (v) => {
        v = v.trim();
        if (!v) return 'Enter a message.';
        if (v.length < 10) return 'Message should be at least 10 characters.';
        return '';
      }
    }
  };

  const setError = (key, msg) => {
    const field = fields[key];
    if (!field || !field.el) return;
    const wrapper = field.el.closest('.form-field');
    const errorEl = document.querySelector(`#${key}-error`);
    if (msg){
      if (wrapper) wrapper.classList.add('has-error');
      field.el.setAttribute('aria-invalid', 'true');
      if (errorEl) errorEl.textContent = msg;
    } else {
      if (wrapper) wrapper.classList.remove('has-error');
      field.el.removeAttribute('aria-invalid');
      if (errorEl) errorEl.textContent = '';
    }
  };

  const validateField = (key) => {
    const field = fields[key];
    if (!field || !field.el) return true;
    const msg = field.validate(field.el.value);
    setError(key, msg);
    return !msg;
  };

  Object.keys(fields).forEach(key => {
    const el = fields[key].el;
    if (!el) return;
    el.addEventListener('blur', () => validateField(key));
    el.addEventListener('input', () => {
      const wrapper = el.closest('.form-field');
      if (wrapper && wrapper.classList.contains('has-error')) {
        validateField(key);
      }
    });
    if (el.tagName === 'SELECT'){
      el.addEventListener('change', () => validateField(key));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalidEl = null;

    Object.keys(fields).forEach(key => {
      const valid = validateField(key);
      if (!valid){
        allValid = false;
        if (!firstInvalidEl) firstInvalidEl = fields[key].el;
      }
    });

    status.classList.remove('show', 'ok', 'error');

    if (!allValid){
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.add('show', 'error');
      if (firstInvalidEl) firstInvalidEl.focus();
      return;
    }

    status.textContent = "Message sent. We'll get back to you within 1 to 2 business days.";
    status.classList.add('show', 'ok');
    form.reset();
    Object.keys(fields).forEach(key => setError(key, ''));
  });
}
