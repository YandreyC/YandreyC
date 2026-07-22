/**
 * ================================================================
 * assets/js/certificates-modal.js — Visor interactivo de certificados
 * Renderiza las tarjetas de certificaciones y gestiona el modal
 * con navegación (anterior/siguiente), visualización de PDF/Imagen
 * y descarga directa.
 *
 * Dependencias: main.js (debe cargarse después)
 * Autor: YandreyC
 * ================================================================
 */

'use strict';

// ================================================================
// ESPERA A QUE EL DOM ESTÉ LISTO
// ================================================================
document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. CONFIGURACIÓN — Catálogo de certificados
    // ============================================================
    const CERT_BASE_PATH = 'assets/certificates/';

    /**
     * Array de objetos con la información de cada certificado.
     * Los títulos provienen del CV y los archivos existen en assets/certificates/
     */
    const certificates = [
        {
            id: 'bachiller',
            title: 'Bachiller Técnico en Explotaciones Ecológicas Agropecuarias',
            institution: 'Institución Educativa',
            category: 'Formación Académica',
            file: 'Bachiller Técnico en Explotaciones Ecológicas Agropecuarias.pdf',
            type: 'pdf',
            icon: 'fa-graduation-cap'
        },
        {
            id: 'matlab-fundamentals',
            title: 'MATLAB Fundamentals',
            institution: 'MathWorks',
            category: 'Programación Técnica',
            file: 'MATLAB Fundamentals.pdf',
            type: 'pdf',
            icon: 'fa-square-root-variable'
        },
        {
            id: 'deep-learning-matlab',
            title: 'Deep Learning with MATLAB',
            institution: 'MathWorks',
            category: 'Inteligencia Artificial',
            file: 'Deep Learning with MATLAB.pdf',
            type: 'pdf',
            icon: 'fa-brain'
        },
        {
            id: 'machine-learning-matlab',
            title: 'Machine Learning with MATLAB',
            institution: 'MathWorks',
            category: 'Inteligencia Artificial',
            file: 'Machine Learning with MATLAB.pdf',
            type: 'pdf',
            icon: 'fa-robot'
        },
        {
            id: 'cisco-cybersecurity',
            title: 'Introduction to Cybersecurity',
            institution: 'Cisco Networking Academy',
            category: 'Ciberseguridad',
            file: 'Introduction_to_Cybersecurity_certificate_caicedoyeison067-gmail-com_3f98693e-8698-41a2-a857-368e03c8de3e.pdf',
            type: 'pdf',
            icon: 'fa-shield-halved'
        }
    ];

    // Referencias al DOM
    const certificatesGrid = document.getElementById('certificates-grid');
    const modal = document.getElementById('certificate-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCounter = document.getElementById('modal-counter');
    const modalPrevBtn = document.getElementById('modal-prev-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');
    const modalDownloadBtn = document.getElementById('modal-download-btn');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Estado del modal
    let currentCertificateIndex = 0;
    let isModalOpen = false;

    // ============================================================
    // 2. RENDERIZAR TARJETAS DE CERTIFICADOS
    // ============================================================
    function renderCertificates() {
        if (!certificatesGrid) {
            console.error('No se encontro el contenedor #certificates-grid');
            return;
        }

        certificatesGrid.innerHTML = '';

        if (certificates.length === 0) {
            certificatesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-file-circle-exclamation text-4xl text-slate-600 mb-4"></i>
                    <p class="text-slate-400">No hay certificados disponibles por el momento.</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();

        certificates.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'cert-card';
            card.setAttribute('data-index', index);
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', 'Abrir certificado: ' + cert.title);
            card.setAttribute('title', 'Haz clic para ver ' + cert.title);

            card.innerHTML = `
                <div class="flex items-start gap-4">
                    <div class="cert-icon flex-shrink-0">
                        <i class="fas ${cert.icon}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="text-base font-semibold text-white truncate">${cert.title}</h3>
                        <p class="text-xs text-slate-400 mt-0.5">${cert.institution}</p>
                        <span class="cert-badge">${cert.category}</span>
                    </div>
                <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span><i class="fas fa-file-${cert.type === 'pdf' ? 'pdf' : 'image'} mr-1"></i>${cert.type.toUpperCase()}</span>
                    <span class="text-indigo-400/70 transition-colors">
                        <i class="fas fa-eye mr-1"></i>Ver
                    </span>
                </div>
            `;

            card.addEventListener('click', function() { openModal(index); });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(index);
                }
            });

            fragment.appendChild(card);
        });

        certificatesGrid.appendChild(fragment);
    }

    // ============================================================
    // 3. FUNCIONES DEL MODAL
    // ============================================================

    function openModal(index) {
        if (index < 0 || index >= certificates.length) return;

        currentCertificateIndex = index;
        const cert = certificates[currentCertificateIndex];

        modalTitle.textContent = cert.title;
        modalCounter.textContent = (index + 1) + ' / ' + certificates.length;
        updateNavButtons();

        modalDownloadBtn.href = CERT_BASE_PATH + encodeURIComponent(cert.file);
        modalDownloadBtn.download = cert.file;

        renderCertificateContent(cert);

        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.add('show');
        isModalOpen = true;

        document.body.style.overflow = 'hidden';
        modal.focus();
    }

    function closeModal() {
        modal.classList.remove('show');
        isModalOpen = false;

        setTimeout(function() {
            modal.classList.add('hidden');
            modalBody.innerHTML = '<p class="text-slate-500"><i class="fas fa-spinner fa-spin mr-2"></i>Cargando...</p>';
        }, 300);

        document.body.style.overflow = '';
        modal.blur();
    }

    function goToPrev() {
        if (currentCertificateIndex > 0) {
            openModal(currentCertificateIndex - 1);
        }
    }

    function goToNext() {
        if (currentCertificateIndex < certificates.length - 1) {
            openModal(currentCertificateIndex + 1);
        }
    }

    function updateNavButtons() {
        modalPrevBtn.disabled = currentCertificateIndex === 0;
        modalNextBtn.disabled = currentCertificateIndex === certificates.length - 1;

        modalPrevBtn.classList.toggle('opacity-30', currentCertificateIndex === 0);
        modalPrevBtn.classList.toggle('cursor-not-allowed', currentCertificateIndex === 0);
        modalNextBtn.classList.toggle('opacity-30', currentCertificateIndex === certificates.length - 1);
        modalNextBtn.classList.toggle('cursor-not-allowed', currentCertificateIndex === certificates.length - 1);
    }

    /**
     * Renderiza el contenido del certificado dentro del modal.
     * Para PDF usa <embed> (funciona con archivos locales, evita CORS).
     * Para imagenes usa <img>.
     */
    function renderCertificateContent(cert) {
        var filePath = CERT_BASE_PATH + encodeURIComponent(cert.file);

        // Mostrar estado de carga
        modalBody.innerHTML = '<div class="flex flex-col items-center justify-center py-12">' +
            '<i class="fas fa-spinner fa-spin text-3xl text-indigo-400 mb-4"></i>' +
            '<p class="text-slate-400 text-sm">Cargando certificado...</p>' +
            '</div>';

        var fileExtension = cert.file.split('.').pop().toLowerCase();

        setTimeout(function() {
            if (fileExtension === 'pdf') {
                // Usar <embed> para PDFs locales (sin restricciones CORS)
                modalBody.innerHTML = '<embed src="' + filePath + '" type="application/pdf" title="' + cert.title + '" class="w-full h-[70vh] rounded-lg" onerror="this.outerHTML=\'<div class=\\\\\'text-center py-12\\\\\'><i class=\\\\\'fas fa-exclamation-triangle text-4xl text-red-400 mb-4\\\\\'></i><p class=\\\\\'text-red-400\\\\\'>Error al cargar el PDF.</p><a href=\\\\\'' + filePath + '\\\\\' target=\\\\\'_blank\\\\\' class=\\\\\'mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500 transition-colors\\\\\'><i class=\\\\\'fas fa-download mr-2\\\\\'></i>Descargar PDF</a></div>\'">';
            } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].indexOf(fileExtension) !== -1) {
                // Usar imagen
                modalBody.innerHTML = '<img src="' + filePath + '" alt="' + cert.title + '" loading="lazy" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" onerror="this.outerHTML=\'<div class=\\\\\'text-center py-12\\\\\'><i class=\\\\\'fas fa-image text-4xl text-slate-600 mb-4\\\\\'></i><p class=\\\\\'text-red-400\\\\\'>Error al cargar la imagen.</p></div>\'">';
            } else {
                // Tipo no soportado
                modalBody.innerHTML = '<div class="text-center py-12">' +
                    '<i class="fas fa-file-circle-question text-4xl text-slate-600 mb-4"></i>' +
                    '<p class="text-slate-400">Formato de archivo no soportado.</p>' +
                    '<a href="' + filePath + '" target="_blank" class="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500 transition-colors">' +
                    '<i class="fas fa-download mr-2"></i>Descargar archivo' +
                    '</a></div>';
            }
        }, 400);
    }

    // ============================================================
    // 4. EVENTOS DEL MODAL
    // ============================================================

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    if (modalPrevBtn) {
        modalPrevBtn.addEventListener('click', goToPrev);
    }

    if (modalNextBtn) {
        modalNextBtn.addEventListener('click', goToNext);
    }

    modal.addEventListener('keydown', function(e) {
        if (!isModalOpen) return;

        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                goToPrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNext();
                break;
        }
    });

    // ============================================================
    // 5. INICIALIZACION
    // ============================================================
    renderCertificates();
    console.log('Visor de certificados listo (' + certificates.length + ' documentos)');

});
