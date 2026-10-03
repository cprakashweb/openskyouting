/**
 * Open Sky Outing - Lightweight High Performance App Logic
 * Zero heavy dependencies. Instant execution. PWA enabled.
 */

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initHeaderScroll();
  initMobileNavigation();
  initVibeFilterPills();
  initMoreThanFilterPills();
  initVenueTabs();
  initFAQAccordion();
  initContactForm();
  initPWAInstallPrompt();
});

/* ==========================================================================
   1. Progressive Web App (PWA) Service Worker Registration
   ========================================================================== */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
        })
        .catch(err => {
          console.log('[PWA] ServiceWorker registration failed:', err);
        });
    });
  }
}

/* ==========================================================================
   2. Sticky Header Elevation on Scroll
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Mobile Navigation Drawer & Sub-menu toggles
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navItemsWithSub = document.querySelectorAll('.nav-item.has-dropdown');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link click if anchor
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && !link.closest('.has-dropdown')) {
          navMenu.classList.remove('open');
          toggleBtn.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // Mobile Accordion for Submenus
  navItemsWithSub.forEach(item => {
    const parentLink = item.querySelector('.nav-link');
    if (parentLink) {
      parentLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const wasOpen = item.classList.contains('open-sub');
          navItemsWithSub.forEach(i => i.classList.remove('open-sub'));
          if (!wasOpen) {
            item.classList.add('open-sub');
          }
        }
      });
    }
  });
}

/* ==========================================================================
   4. Category Vibe Pills Filter (goSTOPS style)
   ========================================================================== */
function initVibeFilterPills() {
  const pills = document.querySelectorAll('.vibe-pill');
  const cards = document.querySelectorAll('.experience-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterVal = pill.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || category.includes(filterVal)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initMoreThanFilterPills() {
  const pills = document.querySelectorAll('[data-more-filter]');
  const cards = document.querySelectorAll('.more-than-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterVal = pill.getAttribute('data-more-filter') || 'all';

      cards.forEach(card => {
        const audience = card.getAttribute('data-audience') || '';
        if (filterVal === 'all' || audience.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Venues Filter Tabs
   ========================================================================== */
function initVenueTabs() {
  const tabBtns = document.querySelectorAll('.venue-tab-btn');
  const venueCards = document.querySelectorAll('.venue-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabCategory = btn.getAttribute('data-category');

      venueCards.forEach(card => {
        const itemCat = card.getAttribute('data-type');
        if (tabCategory === 'all' || itemCat === tabCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. FAQ Accordion (AEO Optimized)
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   7. Creative Contact Form with WhatsApp Integration
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('outingEnquiryForm');
  const waDirectBtn = document.getElementById('sendWhatsAppDirectBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const mobileInput = document.getElementById('contactMobile');
      const nameInput = document.getElementById('contactName');
      const occasionInput = document.getElementById('contactOccasion');
      const queryInput = document.getElementById('contactQuery');

      const mobileVal = mobileInput ? mobileInput.value.trim() : '';
      const nameVal = nameInput ? nameInput.value.trim() : 'Guest';
      const occasionVal = occasionInput ? occasionInput.value : 'General Outing';
      const queryVal = queryInput ? queryInput.value.trim() : 'Please share details and availability.';

      // Mobile number validation (Indian 10-digit number)
      const cleanPhone = mobileVal.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        showFeedbackMessage('Please enter a valid 10-digit mobile number.', 'error');
        if (mobileInput) mobileInput.focus();
        return;
      }

      // Success feedback
      showFeedbackMessage('Thank you! Your inquiry has been received. Our team (+91 8950905116) will contact you shortly.', 'success');
      
      // Auto open WhatsApp with the details if desired
      const waMessage = `Hi Open Sky Outing!%0A*Name:* ${encodeURIComponent(nameVal)}%0A*Mobile:* ${encodeURIComponent(mobileVal)}%0A*Occasion:* ${encodeURIComponent(occasionVal)}%0A*Query:* ${encodeURIComponent(queryVal)}`;
      const waUrl = `https://wa.me/919896348696?text=${waMessage}`;
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 800);

      form.reset();
    });
  }

  if (waDirectBtn) {
    waDirectBtn.addEventListener('click', () => {
      const mobileInput = document.getElementById('contactMobile');
      const nameInput = document.getElementById('contactName');
      const occasionInput = document.getElementById('contactOccasion');
      const queryInput = document.getElementById('contactQuery');

      const mobileVal = mobileInput && mobileInput.value.trim() ? mobileInput.value.trim() : 'Not specified';
      const nameVal = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Traveler';
      const occasionVal = occasionInput ? occasionInput.value : 'Outing / Event';
      const queryVal = queryInput && queryInput.value.trim() ? queryInput.value.trim() : 'I would like to inquire about booking Open Sky Outing.';

      const waMessage = `Hi Open Sky Outing!%0A*Name:* ${encodeURIComponent(nameVal)}%0A*Mobile:* ${encodeURIComponent(mobileVal)}%0A*Occasion:* ${encodeURIComponent(occasionVal)}%0A*Query:* ${encodeURIComponent(queryVal)}`;
      window.open(`https://wa.me/919896348696?text=${waMessage}`, '_blank');
    });
  }
}

function showFeedbackMessage(message, type) {
  let toast = document.getElementById('formToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'formToast';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      transition: all 0.3s ease;
      color: #FFFFFF;
      max-width: 90vw;
    `;
    document.body.appendChild(toast);
  }

  if (type === 'error') {
    toast.style.background = '#C62828';
  } else {
    toast.style.background = '#16422D';
    toast.style.border = '1px solid #DFB15B';
  }

  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 4500);
}

/* ==========================================================================
   8. PWA Install Prompt Banner
   ========================================================================== */
let deferredPrompt;
function initPWAInstallPrompt() {
  const installBanner = document.getElementById('pwaInstallBanner');
  const installBtn = document.getElementById('pwaInstallBtn');
  const dismissBtn = document.getElementById('pwaDismissBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBanner) {
      setTimeout(() => {
        installBanner.classList.add('show');
      }, 3000);
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        if (installBanner) installBanner.classList.remove('show');
      }
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      if (installBanner) installBanner.classList.remove('show');
    });
  }
}
