/* ===========================================
   FORGET WHITE UK - Theme JS
   - Adds products to localStorage on Buy Now click
   - Redirects to /cart for review + disclosure
   =========================================== */

(function() {
  'use strict';

  // ========== CART STORAGE ==========
  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem('fw_cart') || '[]');
    } catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem('fw_cart', JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cart = loadCart();
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = total;
    });
  }

  // ========== ADD TO CART ON BUY NOW CLICK ==========
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-affiliate-buy]');
    if (!btn) return;
    e.preventDefault();

    const productId    = btn.dataset.productId;
    const productName  = btn.dataset.productName;
    const productPrice = parseFloat(btn.dataset.productPrice) || 0;
    const productImage = btn.dataset.productImage || '';

    if (!productId) {
      console.warn('No product ID on Buy Now button');
      return;
    }

    const cart = loadCart();
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        qty: 1
      });
    }
    saveCart(cart);

    // Redirect to cart page
    window.location.href = btn.getAttribute('href') || '/cart';
  });

  // ========== FAQ ACCORDION ==========
  document.addEventListener('click', function(e) {
    const q = e.target.closest('.faq-question');
    if (!q) return;
    const item = q.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
  });

  // ========== MOBILE NAV ==========
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.mobile-menu-btn');
    if (btn) {
      const nav = document.querySelector('.main-nav');
      if (nav) nav.classList.toggle('mobile-open');
      return;
    }
    const link = e.target.closest('.main-nav a');
    if (link) {
      const nav = document.querySelector('.main-nav');
      if (nav) nav.classList.remove('mobile-open');
    }
  });

  // ========== SMOOTH SCROLL ==========
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ========== INIT ==========
  updateCartCount();
})();
