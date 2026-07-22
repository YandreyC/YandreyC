/**
 * ================================================================
 * assets/js/main.js — Lógica principal e interactividad del sitio
 * Framework: Tailwind CSS (vía CDN)
 * Autor: YandreyC
 * ================================================================
 */

'use strict';

// ================================================================
// ESPERA A QUE EL DOM ESTÉ COMPLETAMENTE CARGADO
// ================================================================
document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. NAVBAR — Cambio de estilo al hacer scroll
    // ============================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    let lastScrollY = 0;

    /**
     * Actualiza la clase 'scrolled' en el navbar según el scroll.
     * También oculta el menú móvil al hacer scroll si está abierto.
     */
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Cerrar menú móvil si está abierto al hacer scroll
        if (currentScrollY > lastScrollY && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }

        lastScrollY = currentScrollY;
    }

    // Throttle para optimizar rendimiento del scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ============================================================
    // 2. MENÚ MÓVIL — Toggle y cierre al hacer clic en un enlace
    // ============================================================
    /**
     * Alterna la visibilidad del menú móvil y cambia el ícono del botón.
     */
    function toggleMobileMenu() {
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileMenuBtn.querySelector('i').className = 'fas fa-times text-xl';
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
            document.body.style.overflow = ''; // Restaurar scroll
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Cerrar menú móvil al hacer clic en un enlace
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });

    // Cerrar menú móvil al redimensionar la ventana a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
            document.body.style.overflow = '';
        }
    });

    // ============================================================
    // 3. SCROLL SUAVE — Navegación interna con offset
    // ============================================================
    /**
     * Realiza scroll suave hacia la sección destino respetando la altura del navbar.
     * @param {string} targetId - ID de la sección destino (ej: '#about')
     */
    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Para enlaces de navegación (incluye nav-links y mobile-nav-links)
    const allNavLinks = [...navLinks, ...mobileNavLinks];
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                smoothScrollTo(href);
            }
        });
    });

    // ============================================================
    // 4. ANIMACIONES AL HACER SCROLL (Intersection Observer)
    // ============================================================
    /**
     * Inicializa el Intersection Observer para animar elementos
     * cuando entran en el viewport.
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .animate-on-scroll-left, ' +
            '.animate-on-scroll-right, .animate-scale-in'
        );

        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Dejar de observar el elemento ya animado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    initScrollAnimations();

    // ============================================================
    // 5. ACTUALIZAR AÑO EN EL FOOTER
    // ============================================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ============================================================
    // 6. DESTAQUE DEL ENLACE DE NAVEGACIÓN ACTIVO
    // ============================================================
    /**
     * Actualiza la clase 'active' en los enlaces de navegación
     * según la sección visible en el viewport.
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.id;
            }
        });

        // Actualizar enlaces de escritorio
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('text-indigo-400');
                link.classList.remove('text-slate-200');
            } else {
                link.classList.remove('text-indigo-400');
                link.classList.add('text-slate-200');
            }
        });
    }

    // Usar throttle para el scroll
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateActiveNavLink();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Ejecutar al cargar para estado inicial
    updateActiveNavLink();

    // ============================================================
    // 7. FORMULARIO DE CONTACTO — Validación y feedback
    // ============================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            // Validación básica
            if (!name || !email || !message) {
                showFormStatus('error', 'Por favor completa todos los campos.');
                return;
            }

            if (!isValidEmail(email)) {
                showFormStatus('error', 'Por favor ingresa un correo electrónico válido.');
                return;
            }

            // Mostrar estado de carga
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
            submitBtn.disabled = true;

            try {
                // Simulación de envío (reemplazar con servicio real: EmailJS, Formspree, etc.)
                await simulateEmailSend({ name, email, message });

                showFormStatus('success', '✅ Mensaje enviado con éxito. ¡Gracias por contactarme!');
                contactForm.reset();
            } catch (error) {
                showFormStatus('error', '❌ Ocurrió un error al enviar el mensaje. Intenta de nuevo.');
                console.error('Error al enviar formulario:', error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    /**
     * Valida un correo electrónico con expresión regular.
     * @param {string} email
     * @returns {boolean}
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Muestra un mensaje de estado en el formulario.
     * @param {'success' | 'error'} type
     * @param {string} message
     */
    function showFormStatus(type, message) {
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.className = `text-sm mt-2 ${
            type === 'success' ? 'text-green-400' : 'text-red-400'
        }`;
        formStatus.classList.remove('hidden');

        // Ocultar después de 5 segundos
        setTimeout(() => {
            formStatus.classList.add('hidden');
        }, 5000);
    }

    /**
     * Simula el envío de un correo (resolución después de 1.5s).
     * Para producción, reemplazar con EmailJS, Formspree o backend propio.
     * @param {object} data
     * @returns {Promise<void>}
     */
    function simulateEmailSend(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('📬 Datos del formulario:', data);
                resolve();
            }, 1500);
        });
    }

    // ============================================================
    // 8. EFECTO DE TIPEO EN EL HERO (Opcional)
    // ============================================================
    /**
     * Efecto de máquina de escribir para un texto secundario.
     * Descomentar para activar.
     */
    /*
    function typeWriter(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    const typingElement = document.querySelector('#hero .typing-text');
    if (typingElement) {
        typeWriter(typingElement, 'Full-Stack Developer · QA · Mobile Enthusiast');
    }
    */

    // ============================================================
    // 9. LOG DE BIENVENIDA EN CONSOLA
    // ============================================================
    console.log('%c🚀 YandreyC Portfolio', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cHecho con ❤️ desde Colombia', 'font-size: 14px; color: #94a3b8;');
    console.log('%c🔧 Explora el código: https://github.com/YandreyC', 'font-size: 12px; color: #64748b;');

}); // Fin de DOMContentLoaded

