/**
 * Elite Tourism – Main JavaScript
 * Features: Sticky Navbar, Hamburger Menu, Smooth Scroll,
 *           Scroll Animations, Gallery Lightbox, EmailJS Contact Form,
 *           Scroll-to-Top Button
 */

const navbar       = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks     = document.getElementById('nav-links');
const scrollTopBtn = document.getElementById('scroll-top-btn');
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxCap  = document.getElementById('lightbox-caption');
const lbClose      = document.getElementById('lightbox-close');
const lbPrev       = document.getElementById('lightbox-prev');
const lbNext       = document.getElementById('lightbox-next');
const contactForm  = document.getElementById('contact-form');
const formMessage  = document.getElementById('form-message');
const submitBtn    = document.getElementById('submit-btn');

// ============================================================
// 1. STICKY NAVBAR – Add .scrolled class after 60px
// ============================================================
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// ============================================================
// 2. HAMBURGER MENU
// ============================================================
const navMoreBtn = document.getElementById('nav-more-btn');

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  });
}

if (navMoreBtn && navLinks) {
  navMoreBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navMoreBtn.classList.toggle('active');
    const icon = navMoreBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-chevron-down');
      icon.classList.toggle('fa-chevron-up');
    }
  });
}

// Close mobile menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerBtn.classList.remove('active');
    navLinks.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburgerBtn.classList.remove('active');
    navLinks.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});

// ============================================================
// 3. SMOOTH SCROLL – All internal anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================================
// 4. SCROLL ANIMATIONS – Intersection Observer for .fade-in-up
// ============================================================
const fadeElements = document.querySelectorAll('.fade-in-up');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for sibling cards
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in-up')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ============================================================
// 5. GALLERY LIGHTBOX
// ============================================================
const galleryItems = document.querySelectorAll('.gallery-item');
let currentIndex = 0;

// Build an array of { src, caption } from gallery items
const galleryData = [...galleryItems].map(item => ({
  src:     item.dataset.src,
  caption: item.dataset.caption
}));

const lightboxVideo = document.getElementById('lightbox-video');

function updateLightboxMedia() {
  const data = galleryData[currentIndex];
  lightboxCap.textContent = data.caption;
  
  if (data.src.endsWith('.mp4')) {
    lightboxImg.style.display = 'none';
    lightboxImg.src = '';
    lightboxVideo.style.display = 'block';
    lightboxVideo.src = data.src;
  } else {
    lightboxVideo.style.display = 'none';
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxImg.style.display = 'block';
    lightboxImg.src = data.src;
    lightboxImg.alt = data.caption;
  }
}

function openLightbox(index) {
  currentIndex = index;
  updateLightboxMedia();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lightboxImg.src = '';
  lightboxVideo.pause();
  lightboxVideo.src = '';
}

function prevImage() {
  currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
  updateLightboxMedia();
}

function nextImage() {
  currentIndex = (currentIndex + 1) % galleryData.length;
  updateLightboxMedia();
}

// Attach click events to gallery items
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
  item.addEventListener('keypress', (e) => { if (e.key === 'Enter') openLightbox(index); });
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `View ${galleryData[index].caption}`);
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevImage);
lbNext.addEventListener('click', nextImage);

// Click outside image to close
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  prevImage();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'Escape')     closeLightbox();
});

// Video Hover Audio & Mute Button Logic
const galleryVideos = document.querySelectorAll('.gallery-video');
galleryVideos.forEach(container => {
  const video = container.querySelector('video');
  const muteBtn = container.querySelector('.mute-btn');
  const muteIcon = muteBtn.querySelector('i');
  
  let isManuallyUnmuted = false;

  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent lightbox opening
    isManuallyUnmuted = !isManuallyUnmuted;
    video.muted = !isManuallyUnmuted;
    muteIcon.className = isManuallyUnmuted ? 'fas fa-volume-up' : 'fas fa-volume-mute';
  });

  container.addEventListener('mouseenter', () => {
    if (!isManuallyUnmuted) {
      video.muted = false;
      muteIcon.className = 'fas fa-volume-up';
    }
  });

  container.addEventListener('mouseleave', () => {
    if (!isManuallyUnmuted) {
      video.muted = true;
      muteIcon.className = 'fas fa-volume-mute';
    }
  });
});

// ============================================================
// 6. SCROLL-TO-TOP BUTTON
// ============================================================
function handleScrollTopBtn() {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleScrollTopBtn, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 7. WHATSAPP FORM REDIRECT
// ============================================================
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic client-side validation
    const name        = document.getElementById('user_name').value.trim();
    const phone       = document.getElementById('user_phone').value.trim();
    const email       = document.getElementById('user_email').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const duration    = document.getElementById('trip_duration').value.trim();
    const date        = document.getElementById('travel_date').value;
    const message     = document.getElementById('message').value.trim();

    if (!name || !phone || !email) {
      showFormMessage('Please fill in Name, Phone, and Email.', 'error');
      return;
    }

    // WhatsApp Message Formatting
    const waNumber = "918610740388";
    const waMessage = 
      `*New Inquiry - Elite Tourism*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Destination:* ${destination || 'Not specified'}\n` +
      `*Duration:* ${duration || 'Not specified'}\n` +
      `*Travel Date:* ${date || 'Not specified'}\n` +
      `*Message:* ${message || 'No message'}`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    // Show a quick success message and redirect
    showFormMessage('✅ Redirecting to WhatsApp...', 'success');
    
    setTimeout(() => {
      window.open(waLink, '_blank');
      // Reset form after a short delay
      contactForm.reset();
    }, 1000);
  });
}

/**
 * Show a success or error message below the form.
 * @param {string} msg - The message text
 * @param {'success'|'error'} type - Message type
 */
function showFormMessage(msg, type) {
  formMessage.textContent  = msg;
  formMessage.className    = `form-message ${type}`;
  formMessage.style.display = 'block';
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-hide success messages after 7 seconds
  if (type === 'success') {
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 7000);
  }
}

/** Simple delay helper for demo mode */
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// 8. ACTIVE NAV LINK – Highlight current section on scroll
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('a.nav-link');

function highlightActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbar.offsetHeight - 50;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-nav');
    }
  });
}

window.addEventListener('scroll', highlightActiveNav, { passive: true });

// ============================================================
// DOMContentLoaded – Initialize everything
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  handleNavbarScroll();
  handleScrollTopBtn();
  highlightActiveNav();
});
