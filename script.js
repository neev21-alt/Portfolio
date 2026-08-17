/* ─── Custom Cursor ─── */
    (function () {
      const dot = document.getElementById('cur-dot');
      const ring = document.getElementById('cur-ring');
      let rx = 0, ry = 0;

      document.addEventListener('mousemove', e => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        // ring follows with slight lag via lerp
        rx += (e.clientX - rx) * 0.12;
        ry += (e.clientY - ry) * 0.12;
      });

      function lerp() {
        rx += (parseFloat(dot.style.left) - rx) * 0.14;
        ry += (parseFloat(dot.style.top) - ry) * 0.14;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(lerp);
      }
      lerp();
    })();

    /* ─── Scroll Reveal ─── */
    (function () {
      const revEls = document.querySelectorAll('.reveal, .stagger');
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.08 });
      revEls.forEach(el => obs.observe(el));
    })();

    /* ─── Scroll Progress Bar ─── */
    (function () {
      const bar = document.getElementById('progress-bar');
      window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = pct + '%';
      }, { passive: true });
    })();

    /* ─── Back To Top ─── */
    (function () {
      const btn = document.getElementById('back-top');
      window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 450);
      }, { passive: true });
    })();

    /* ─── Active Nav on Scroll ─── */
    (function () {
      const nav = document.getElementById('main-nav');
      const links = document.querySelectorAll('.nav-links a');
      const ids = ['home', 'about', 'projects', 'building', 'experience', 'security', 'achievements', 'certifications', 'education', 'numbers', 'contact'];

      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        let current = '';
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (el && window.scrollY >= el.offsetTop - 120) current = id;
        });
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
      }, { passive: true });
    })();

    /* ─── Hamburger Menu ─── */
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    
    function toggleDrawer() {
      const isOpening = !hamburger.classList.contains('open');
      hamburger.classList.toggle('open', isOpening);
      drawer.classList.toggle('open', isOpening);
      hamburger.setAttribute('aria-expanded', isOpening);
      drawer.setAttribute('aria-hidden', !isOpening);
      
      // Prevent scrolling when menu is open
      document.body.style.overflow = isOpening ? 'hidden' : '';
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });

    function closeDrawer() {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      drawer.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    }

    // Close on click outside (backdrop effect)
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    /* ─── 3D Card Tilt ─── */
    (function () {
      document.querySelectorAll('.tilt').forEach(card => {
        const MAX_TILT = 6;

        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const rx = ((e.clientY - cy) / (r.height / 2)) * -MAX_TILT;
          const ry = ((e.clientX - cx) / (r.width / 2)) * MAX_TILT;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
          card.style.transition = 'transform 0.08s linear';
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
          card.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
        });
      });
    })();

    /* ─── Counter Animation ─── */
    (function () {
      const counters = document.querySelectorAll('.stat-val[data-count], .number-val[data-count]');
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const isInt = Number.isInteger(target);
          const dur = 1600;
          let start;

          function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / dur, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = target * eased;
            el.textContent = (isInt ? Math.floor(val) : val.toFixed(2)) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = (isInt ? target : target.toFixed(2)) + suffix;
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(c => obs.observe(c));
    })();

    /* ─── Certificate Lightbox ─── */
    function openLightbox(src, label, pdfUrl) {
      const lb      = document.getElementById('cert-lightbox');
      const img     = document.getElementById('lb-img');
      const lbl     = document.getElementById('lb-label');
      const pdfBtn  = document.getElementById('lb-pdf-link');
      img.src       = src;
      img.alt       = label;
      lbl.textContent = label;
      
      if (pdfUrl) {
        pdfBtn.href = pdfUrl;
        pdfBtn.style.display = 'inline-flex';
      } else {
        pdfBtn.style.display = 'none';
      }
      
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      const lb = document.getElementById('cert-lightbox');
      lb.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        document.getElementById('lb-img').src = '';
      }, 300);
    }

    function closeLightboxOnBackdrop(e) {
      if (e.target === document.getElementById('cert-lightbox')) closeLightbox();
    }

    /* ESC key closes lightbox */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });

    /* Keyboard: Enter/Space activates cert frames */
    document.querySelectorAll('.cert-frame[tabindex]').forEach(el => {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });




