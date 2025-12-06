// main.js - behavior extracted from the original inline script

// 1) Inject JSON-LD file into head as <script type="application/ld+json">
fetch('jsonld_1.json').then(r => r.text()).then(txt => {
    try {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = txt;
        document.head.appendChild(s);
    } catch (e) { console.warn('Could not inject JSON-LD', e); }
}).catch(()=>{});

// 2) reCAPTCHA site key and insert recaptcha script
const recaptchaSiteKey = '6LfCWCMsAAAAAEM6BF2k_GCEGBIzwahFpoRZmntm';
(function(){
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    recaptchaScript.async = true; recaptchaScript.defer = true;
    document.head.appendChild(recaptchaScript);
})();

// Setup UI helpers (toasts, confetti loader)
(function setupUIHelpers(){
    if (window._uiHelpersInstalled) return;
    const s = document.createElement('style');
    s.textContent = '\n#global-toast-container{position:fixed;right:0;left:0;bottom:24px;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:99999;pointer-events:none}\n.global-toast{pointer-events:auto;min-width:220px;max-width:420px;padding:12px 16px;border-radius:12px;color:#fff;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,0.5);opacity:0;transform:translateY(10px);transition:all .28s cubic-bezier(.2,.9,.3,1)}\n.global-toast.show{opacity:1;transform:translateY(0)}\n.global-toast.info{background:linear-gradient(90deg,#6b7280,#111827)}\n.global-toast.success{background:linear-gradient(90deg,#10b981,#059669)}\n.global-toast.error{background:linear-gradient(90deg,#ef4444,#b91c1c)}\n.btn-spinner{display:inline-block;width:18px;height:18px;border:2px solid rgba(255,255,255,0.25);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite;vertical-align:middle;margin-right:8px}\n@keyframes spin{to{transform:rotate(360deg)}}\n';
    document.head.appendChild(s);
    const container = document.createElement('div'); container.id = 'global-toast-container'; document.body.appendChild(container);
    window.showToast = function (message, type = 'info', ms = 3500) {
        try {
            const toast = document.createElement('div');
            toast.className = 'global-toast ' + (type || 'info');
            toast.innerHTML = String(message);
            document.getElementById('global-toast-container').appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('show'));
            setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, ms);
            return toast;
        } catch (e) { console.warn('showToast failed', e); }
    };
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    confettiScript.async = true;
    confettiScript.onload = () => {};
    document.head.appendChild(confettiScript);
    window._uiHelpersInstalled = true;
})();

// The rest of page JS (navigation, animations, cart, etc.)

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
    if (menu.classList.contains('active')) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; }
}
// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const menuButton = document.querySelector('[onclick="toggleMobileMenu()"]');
    if (menu && menu.classList.contains('active') && !menu.contains(e.target) && !menuButton.contains(e.target)) {
        toggleMobileMenu();
    }
});

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            const menu = document.getElementById('mobileMenu');
            if (menu && menu.classList.contains('active')) toggleMobileMenu();
        }
    });
});

// Hero button shortcuts
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    if (!button.closest('form') && button.textContent.includes('Comenzar')) {
        button.addEventListener('click', (e) => { e.preventDefault(); const contactSection = document.querySelector('#contacto'); if (contactSection) { const headerOffset = 80; const elementPosition = contactSection.getBoundingClientRect().top; const offsetPosition = elementPosition + window.pageYOffset - headerOffset; window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); } });
    } else if (button.textContent.includes('Explorar servicios')) {
        button.addEventListener('click', (e) => { e.preventDefault(); document.querySelector('#servicios').scrollIntoView({ behavior: 'smooth' }); });
    } else if (button.textContent.includes('Ver proyectos')) {
        button.addEventListener('click', (e) => { e.preventDefault(); const gallerySection = document.querySelector('#proyectos'); if (gallerySection) { const headerOffset = 80; const elementPosition = gallerySection.getBoundingClientRect().top; const offsetPosition = elementPosition + window.pageYOffset - headerOffset; window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); } });
    } else if (button.textContent.includes('Contactar')) {
        button.addEventListener('click', (e) => { e.preventDefault(); document.querySelector('#contacto').scrollIntoView({ behavior: 'smooth' }); });
    }
});

// Animations, IntersectionObserver
let lastScrollY = window.pageYOffset; const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;
    if (currentScrollY > lastScrollY && currentScrollY > 100) { nav && (nav.style.transform = 'translateY(-100%)'); } else { nav && (nav.style.transform = 'translateY(0)'); }
    lastScrollY = currentScrollY;
    const hero = document.querySelector('#inicio');
    const touchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (hero && !touchDevice && window.innerWidth > 768 && currentScrollY < window.innerHeight) { hero.style.transform = `translateY(${currentScrollY * 0.5}px)`; hero.style.opacity = 1 - (currentScrollY / window.innerHeight) * 0.5; } else if (hero) { hero.style.transform = ''; hero.style.opacity = ''; }
});

const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -80px 0px' };
const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const observer = new IntersectionObserver((entries) => { entries.forEach((entry, index) => { if (entry.isIntersecting) { setTimeout(() => { entry.target.classList.add('animate-in'); entry.target.classList.remove('pre-animate'); if (entry.target.classList.contains('image-container')) { if (!isTouch && window.innerWidth > 768) entry.target.classList.add('float-animation'); } else { entry.target.classList.add('animate-move'); } }, index * 90); observer.unobserve(entry.target); } }); }, observerOptions);
document.querySelectorAll('.card, .image-container, .section-title, .project-item').forEach(el => { el.classList.add('pre-animate'); observer.observe(el); });

const animateNumbers = () => { const numbers = document.querySelectorAll('.feature-number'); numbers.forEach(num => { const target = parseInt(num.textContent); let current = 0; const increment = target / 50; const timer = setInterval(() => { current += increment; if (current >= target) { num.textContent = target.toString().padStart(2, '0'); clearInterval(timer); } else { num.textContent = Math.floor(current).toString().padStart(2, '0'); } }, 30); }); };
const numberObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { animateNumbers(); numberObserver.unobserve(entry.target); } }); }, { threshold: 0.5 });
document.querySelectorAll('.feature-number').forEach(num => { numberObserver.observe(num); });

// Button hover effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => { button.addEventListener('mouseenter', function(e) { this.style.transform = 'scale(1.05)'; }); button.addEventListener('mouseleave', function(e) { this.style.transform = 'scale(1)'; }); });

// Progress bar
const progressBar = document.createElement('div'); progressBar.style.cssText = `position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(135deg, #ff006e 0%, #8338ec 100%); width: 0%; z-index: 9999; transition: width 0.1s ease;`; document.body.appendChild(progressBar);
window.addEventListener('scroll', () => { const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; const scrolled = (window.pageYOffset / windowHeight) * 100; progressBar.style.width = scrolled + '%'; });

// Carrito simple (persistente en localStorage)
(function () {
    const STORAGE_KEY = 'voltxe_cart_v1'; let cart = [];
    function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { console.warn(e); } }
    function load() { try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { cart = []; } }
    function formatPrice(n) { return '$' + Number(n || 0).toLocaleString(); }
    function updateBadge() { const count = cart.reduce((s, it) => s + (it.qty || 1), 0); const badge = document.getElementById('cartBadge'); if (badge) { badge.textContent = count; badge.style.display = count ? 'inline-flex' : 'none'; } const navBadge = document.getElementById('cartBadgeNav'); if (navBadge) { navBadge.textContent = count; navBadge.style.display = count ? 'inline-flex' : 'none'; } const cartCountBadge = document.getElementById('cartCountBadge'); if (cartCountBadge) cartCountBadge.textContent = count + (count === 1 ? ' item' : ' items'); }
    function renderCart() { const container = document.getElementById('cartItems'); const totalEl = document.getElementById('cartTotal'); if (!container || !totalEl) return; container.innerHTML = ''; if (!cart || cart.length === 0) { container.innerHTML = '<div style="color:#9CA3AF;padding:12px 0">Tu carrito está vacío</div>'; totalEl.textContent = formatPrice(0); updateBadge(); return; }
        let total = 0; cart.forEach((it, idx) => {
            const row = document.createElement('div'); row.className = 'cart-item'; row.style.padding = '10px 0';
            const thumb = document.createElement('div'); thumb.style.width = '56px'; thumb.style.height = '56px'; thumb.style.flex = '0 0 56px'; thumb.style.borderRadius = '8px'; thumb.style.overflow = 'hidden';
            const img = document.createElement('img'); img.src = it.image || 'https://via.placeholder.com/120?text=img'; img.alt = it.name; img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover'; thumb.appendChild(img);
            const meta = document.createElement('div'); meta.style.display = 'flex'; meta.style.flexDirection = 'column'; meta.style.marginLeft = '12px'; meta.style.gap = '6px'; meta.style.minWidth = '0';
            const nameEl = document.createElement('div'); nameEl.className = 'name'; nameEl.textContent = it.name; nameEl.style.fontWeight = '600'; nameEl.style.color = '#fff';
            const controls = document.createElement('div'); controls.style.display = 'flex'; controls.style.alignItems = 'center'; controls.style.gap = '8px';
            const qtyWrap = document.createElement('div'); qtyWrap.style.display = 'inline-flex'; qtyWrap.style.alignItems = 'center'; qtyWrap.style.background = 'rgba(255,255,255,0.03)'; qtyWrap.style.border = '1px solid rgba(255,255,255,0.04)'; qtyWrap.style.padding = '6px'; qtyWrap.style.borderRadius = '999px';
            const minus = document.createElement('button'); minus.textContent = '-'; minus.style.width = '28px'; minus.style.height = '28px'; minus.style.border = 'none'; minus.style.background = 'transparent'; minus.style.color = '#fff'; minus.style.fontWeight = '700'; minus.style.cursor = 'pointer';
            const qty = document.createElement('div'); qty.textContent = String(it.qty || 1); qty.style.minWidth = '18px'; qty.style.textAlign = 'center'; qty.style.color = '#fff';
            const plus = document.createElement('button'); plus.textContent = '+'; plus.style.width = '28px'; plus.style.height = '28px'; plus.style.border = 'none'; plus.style.background = 'transparent'; plus.style.color = '#fff'; plus.style.fontWeight = '700'; plus.style.cursor = 'pointer';
            qtyWrap.appendChild(minus); qtyWrap.appendChild(qty); qtyWrap.appendChild(plus);
            const removeBtn = document.createElement('button'); removeBtn.textContent = 'Eliminar'; removeBtn.style.border = 'none'; removeBtn.style.background = 'transparent'; removeBtn.style.color = '#9CA3AF'; removeBtn.style.cursor = 'pointer'; removeBtn.style.fontSize = '13px';
            controls.appendChild(qtyWrap); controls.appendChild(removeBtn);
            meta.appendChild(nameEl); meta.appendChild(controls);
            const priceEl = document.createElement('div'); priceEl.className = 'price'; priceEl.textContent = formatPrice(it.price * (it.qty || 1)); priceEl.style.marginLeft = 'auto'; priceEl.style.fontWeight = '800';
            row.appendChild(thumb); row.appendChild(meta); row.appendChild(priceEl); container.appendChild(row);
            minus.addEventListener('click', () => { if ((it.qty||1) > 1) { it.qty = (it.qty||1) - 1; qty.textContent = it.qty; priceEl.textContent = formatPrice(it.price * it.qty); save(); renderCart(); } });
            plus.addEventListener('click', () => { it.qty = (it.qty||1) + 1; qty.textContent = it.qty; priceEl.textContent = formatPrice(it.price * it.qty); save(); renderCart(); });
            removeBtn.addEventListener('click', () => { cart.splice(idx,1); save(); renderCart(); try{window.showToast(it.name + ' eliminado','info',1500);}catch(e){} });
            total += Number(it.price || 0) * (it.qty || 1);
        });
        total = Math.round(total * 100) / 100; totalEl.textContent = formatPrice(total); updateBadge();
    }
    function animateAdd(el, imgSrc){ try{ const fly = document.getElementById('flyElm'); if(!fly) return; const fromRect = el.getBoundingClientRect(); fly.style.display='block'; fly.style.left=(fromRect.left+fromRect.width/2)+'px'; fly.style.top=(fromRect.top+fromRect.height/2)+'px'; fly.style.opacity='1'; fly.style.width='44px'; fly.style.height='44px'; fly.style.borderRadius='10px'; fly.innerHTML = `<img src="${imgSrc||'https://via.placeholder.com/120?text=img'}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`; fly.getBoundingClientRect(); const to = document.getElementById('cartButton') || document.getElementById('contactNavBtn'); const toRect = to ? to.getBoundingClientRect() : {left:window.innerWidth-40, top:40, width:24, height:24}; fly.style.transition='transform 600ms cubic-bezier(.2,.9,.3,1), opacity 600ms'; fly.style.transform = `translate(${toRect.left + toRect.width/2 - (fromRect.left + fromRect.width/2)}px, ${toRect.top + toRect.height/2 - (fromRect.top + fromRect.height/2)}px) scale(0.2)`; fly.style.opacity='0'; setTimeout(()=>{ fly.style.display='none'; fly.style.transition=''; fly.style.transform='translate(-50%,-50%) scale(1)'; fly.innerHTML=''; },700); }catch(e){console.warn(e);} }
    function findIndex(name){ return cart.findIndex(i => i.name === name); }
    function addToCart(name, price, image, fromEl){ const p = Number(price || 0); const idx = findIndex(name); if(idx >=0){ cart[idx].qty = (cart[idx].qty || 1) + 1; } else { cart.push({ name, price: p, qty: 1, image: image || '' }); } save(); renderCart(); try{ window.showToast(name + ' añadido al carrito', 'success', 1600); }catch(e){} animateAdd(fromEl, image); }
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => { if (btn.dataset.cartBound) return; btn.dataset.cartBound = '1'; btn.addEventListener('click', (e) => { e.preventDefault(); const name = btn.getAttribute('data-product-name') || 'Producto'; const price = btn.getAttribute('data-product-price') || '0'; const img = btn.getAttribute('data-product-image') || ''; addToCart(name, price, img, btn); }); });
    const cartSidebar = document.getElementById('cartSidebar'); const cartButton = document.getElementById('cartButton'); const closeCart = document.getElementById('closeCart');
    function openCart(){ if(cartSidebar) { cartSidebar.classList.add('open'); cartSidebar.setAttribute('aria-hidden','false'); try{ document.querySelectorAll('.cart-toggle, #cartButton').forEach(t=>t&&t.setAttribute('aria-expanded','true')); }catch(e){} } }
    function closeCartFn(){ if(cartSidebar){ cartSidebar.classList.remove('open'); cartSidebar.setAttribute('aria-hidden','true'); try{ document.querySelectorAll('.cart-toggle, #cartButton').forEach(t=>t&&t.setAttribute('aria-expanded','false')); }catch(e){} } }
    if (cartButton) cartButton.addEventListener('click', (e)=>{ e.preventDefault(); openCart(); });
    document.querySelectorAll('.cart-toggle').forEach(t => { if (!t.dataset.cartBound) { t.dataset.cartBound = '1'; t.addEventListener('click', (e)=>{ e.preventDefault(); openCart(); }); } });
    if (closeCart) closeCart.addEventListener('click', (e)=>{ e.preventDefault(); closeCartFn(); });
    document.getElementById('continueShopping')?.addEventListener('click', (e)=>{ e.preventDefault(); closeCartFn(); });
    document.getElementById('clearCart')?.addEventListener('click', (e)=>{ e.preventDefault(); cart = []; save(); renderCart(); try{window.showToast('Carrito vaciado','info',1200);}catch(e){} });
    document.getElementById('checkoutBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); if(!cart || cart.length===0){ try{window.showToast('Tu carrito está vacío','info');}catch(e){} return; } const productList = cart.map(it => `${it.name}${it.qty && it.qty>1 ? ' x'+it.qty : ''}${it.price?` (${formatPrice(it.price)})`:''}`).join(', '); const total = cart.reduce((s,it)=>s + (Number(it.price||0)*(it.qty||1)),0); const asuntoInput = document.getElementById('contact-asunto'); if(asuntoInput) asuntoInput.value = `Me interesa: ${productList} — Total: ${formatPrice(Math.round(total*100)/100)}`; closeCartFn(); const contactSection = document.querySelector('#contacto'); if(contactSection){ const headerOffset = 80; const elementPosition = contactSection.getBoundingClientRect().top; const offsetPosition = elementPosition + window.pageYOffset - headerOffset; window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); try{window.showToast('Formulario relleno. Completa tus datos para enviar.','info',2200);}catch(e){} } });
    load(); renderCart();
})();

// data-target buttons
document.querySelectorAll('[data-target]').forEach(btn => { btn.addEventListener('click', (e) => { e.preventDefault(); const sel = btn.getAttribute('data-target'); const target = document.querySelector(sel); if (target) { const headerOffset = 80; const elementPosition = target.getBoundingClientRect().top; const offsetPosition = elementPosition + window.pageYOffset - headerOffset; window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); } }); });

console.log('[v0] Sitio web Voltxe cargado con todas las funcionalidades activas');