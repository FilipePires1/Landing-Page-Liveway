(function () {
  'use strict';

  var CONFIG = {
    WHATSAPP_NUMBER: '5500000000000',
    FORM_ENDPOINT: '',
    WHATSAPP_MESSAGE: 'Olá! Vim pelo site da Liveway Capital e gostaria de conversar com um especialista.'
  };

  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var waFab = document.getElementById('waFab');
  var yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var waDigits = String(CONFIG.WHATSAPP_NUMBER).replace(/\D/g, '');
  var waReady = waDigits.length >= 12 && waDigits.indexOf('000000000') === -1;
  var waLink = waReady
    ? 'https://wa.me/' + waDigits + '?text=' + encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)
    : null;

  if (waFab) {
    waFab.href = waLink || '#contato';
    if (waLink) waFab.setAttribute('aria-label', 'Falar com a Liveway Capital no WhatsApp');
  }

  document.querySelectorAll('[data-link="whatsapp"]').forEach(function (el) {
    if (waLink) {
      el.href = waLink;
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      el.setAttribute('href', '#contato');
    }
  });

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (waFab) waFab.classList.toggle('is-visible', y > 420);
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && nav) {
    var navIcon = navToggle.querySelector('use');

    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      if (navIcon) navIcon.setAttribute('href', open ? '#ico-close' : '#ico-menu');
    }

    navToggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus();
      }
    });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  }

  var faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.querySelectorAll('.faq__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq__item');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        faqList.querySelectorAll('.faq__btn').forEach(function (other) {
          if (other === btn) return;
          other.setAttribute('aria-expanded', 'false');
          other.closest('.faq__item').classList.remove('is-open');
          var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        });

        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        item.classList.toggle('is-open', !isOpen);
        if (panel) panel.hidden = isOpen;
      });
    });
  }

  var form = document.getElementById('leadForm');
  if (!form) return;

  var successBox = document.getElementById('formSuccess');
  var successTitle = document.getElementById('successTitle');
  var successText = document.getElementById('successText');
  var successAction = document.getElementById('successAction');
  var submitBtn = document.getElementById('submitBtn');

  var telInput = document.getElementById('whatsapp');

  function maskPhone(value) {
    var d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  if (telInput) {
    telInput.addEventListener('input', function () {
      var pos = telInput.value.length;
      telInput.value = maskPhone(telInput.value);
      if (pos >= telInput.value.length) return;
    });
  }

  function setError(fieldEl, errorId, message) {
    var errorEl = document.getElementById(errorId);
    if (fieldEl) fieldEl.classList.toggle('is-invalid', Boolean(message));
    if (fieldEl) fieldEl.classList.toggle('is-valid', !message);
    if (errorEl) errorEl.textContent = message || '';
  }

  function validate() {
    var ok = true;

    var nome = document.getElementById('nome');
    var nomeField = nome.closest('.field');
    if (!nome.value.trim() || nome.value.trim().length < 2) {
      setError(nomeField, 'nome-error', 'Informe seu nome.');
      ok = false;
    } else {
      setError(nomeField, 'nome-error', '');
    }

    var digits = telInput.value.replace(/\D/g, '');
    var telField = telInput.closest('.field');
    if (digits.length < 10) {
      setError(telField, 'whatsapp-error', 'Informe um WhatsApp válido com DDD.');
      ok = false;
    } else {
      setError(telField, 'whatsapp-error', '');
    }

    var email = document.getElementById('email');
    var emailField = email.closest('.field');
    var emailOk = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.value.trim());
    if (!emailOk) {
      setError(emailField, 'email-error', 'Informe um e-mail válido.');
      ok = false;
    } else {
      setError(emailField, 'email-error', '');
    }

    var investeGroup = form.querySelector('input[name="investe"]');
    var investeField = investeGroup.closest('.field');
    var investeChecked = form.querySelector('input[name="investe"]:checked');
    if (!investeChecked) {
      setError(investeField, 'investe-error', 'Selecione uma opção.');
      ok = false;
    } else {
      setError(investeField, 'investe-error', '');
    }

    var objetivoGroup = form.querySelector('input[name="objetivo"]');
    var objetivoField = objetivoGroup.closest('.field');
    var objetivoChecked = form.querySelector('input[name="objetivo"]:checked');
    if (!objetivoChecked) {
      setError(objetivoField, 'objetivo-error', 'Selecione seu principal objetivo.');
      ok = false;
    } else {
      setError(objetivoField, 'objetivo-error', '');
    }

    return ok;
  }

  form.querySelectorAll('input').forEach(function (input) {
    input.addEventListener('change', function () {
      var field = input.closest('.field');
      if (field && field.classList.contains('is-invalid')) validate();
    });
    input.addEventListener('blur', function () {
      if (input.value && input.closest('.field')) validate();
    });
  });

  function showSuccess(title, text, actionHref) {
    if (!successBox) return;
    if (successTitle) successTitle.textContent = title;
    if (successText) successText.textContent = text;
    if (successAction) {
      if (actionHref) {
        successAction.href = actionHref;
        successAction.hidden = false;
      } else {
        successAction.hidden = true;
      }
    }
    form.hidden = true;
    successBox.hidden = false;
    successBox.setAttribute('tabindex', '-1');
    successBox.focus({ preventScroll: false });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstInvalid = form.querySelector('.is-invalid input, .field.is-invalid');
      if (firstInvalid) firstInvalid.focus({ preventScroll: false });
      return;
    }

    var payload = {
      nome: document.getElementById('nome').value.trim(),
      whatsapp: telInput.value.trim(),
      email: document.getElementById('email').value.trim(),
      investe: (form.querySelector('input[name="investe"]:checked') || {}).value || '',
      objetivo: (form.querySelector('input[name="objetivo"]:checked') || {}).value || ''
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    function finishWa() {
      if (!waReady) {
        console.warn('Liveway: configure CONFIG.WHATSAPP_NUMBER ou CONFIG.FORM_ENDPOINT em assets/js/main.js para capturar os leads.');
        showSuccess(
          'Tudo certo.',
          'Obrigado pelo interesse. Nossa equipe entrará em contato pelo canal informado em breve.',
          null
        );
        return;
      }
      var msg = [
        'Olá! Vim pelo site da Liveway Capital.',
        '',
        'Nome: ' + payload.nome,
        'WhatsApp: ' + payload.whatsapp,
        'E-mail: ' + payload.email,
        'Já investe em imóveis: ' + payload.investe,
        'Principal objetivo: ' + payload.objetivo
      ].join('\n');
      showSuccess(
        'Quase lá.',
        'Revise os dados e conclua a conversa com nossa equipe pelo WhatsApp. Se preferir, aguarde — retornaremos pelo contato informado.',
        'https://wa.me/' + waDigits + '?text=' + encodeURIComponent(msg)
      );
    }

    if (CONFIG.FORM_ENDPOINT) {
      fetch(CONFIG.FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Falha no envio');
          showSuccess('Tudo certo.', 'Recebemos seus dados. Nossa equipe entrará em contato em breve.', null);
        })
        .catch(function () {
          finishWa();
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Quero conversar com um especialista';
        });
    } else {
      window.setTimeout(function () {
        finishWa();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Quero conversar com um especialista';
      }, 600);
    }
  });
})();
