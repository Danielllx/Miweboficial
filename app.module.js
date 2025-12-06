// Firebase module (extracted from original inline module)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// reCAPTCHA site key used by contact form (kept here for clarity)
const RECAPTCHA_SITE_KEY = '6LfCWCMsAAAAAEM6BF2k_GCEGBIzwahFpoRZmntm';

const firebaseConfig = {
    apiKey: "AIzaSyCTa_tWYXZHUWtEuPa4F11wzHQ9MuBu8iU",
    authDomain: "miweb-7522e.firebaseapp.com",
    projectId: "miweb-7522e",
    storageBucket: "miweb-7522e.firebasestorage.app",
    messagingSenderId: "1085379663104",
    appId: "1:1085379663104:web:46faa67189689fb2a84fe5",
    measurementId: "G-KEFZR0DRWM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wire contact form submission to Firestore
const contactForm = document.querySelector('#contacto form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = contactForm.querySelector('input[placeholder="Nombre"]').value.trim();
        const telefono = (contactForm.querySelector('input[placeholder="Teléfono"]') && contactForm.querySelector('input[placeholder="Teléfono"]').value.trim()) || null;
        const email = contactForm.querySelector('input[placeholder="Email"]').value.trim();
        const asunto = contactForm.querySelector('input[placeholder="Asunto"]').value.trim();
        const mensaje = contactForm.querySelector('textarea').value.trim();

        if (!nombre || !email || !mensaje) {
            window.showToast('Por favor completa todos los campos', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            window.showToast('Por favor ingresa un email válido', 'error');
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="btn-spinner"></span>Enviando...';

        // Obtener token de reCAPTCHA (si está disponible). Si no, continuar sin token.
        let recaptchaToken = null;
        try {
            if (window.grecaptcha && typeof grecaptcha.execute === 'function') {
                await grecaptcha.ready();
                recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
            }
        } catch (err) {
            console.warn('reCAPTCHA error or not ready, proceeding without token', err);
        }

        try {
            const payload = {
                nombre,
                telefono: telefono || null,
                email,
                asunto: asunto || null,
                mensaje,
                created_at: serverTimestamp(),
                recaptchaToken: recaptchaToken || null
            };

            const docRef = await addDoc(collection(db, 'messages'), payload);

            try {
                window.showToast('Mensaje enviado. ¡Gracias!', 'success');
                if (window.confetti) {
                    window.confetti({ particleCount: 60, spread: 120 });
                }
            } catch (e) { console.warn(e); }

            submitButton.innerHTML = '\u2713 Enviado';
            setTimeout(() => {
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
            }, 2200);

            contactForm.reset();
        } catch (err) {
            console.error('Error guardando en Firestore', err);
            window.showToast('Error enviando mensaje. Revisa la consola.', 'error');
            submitButton.disabled = false;
            submitButton.innerHTML = originalHTML;
        }
    });
}
