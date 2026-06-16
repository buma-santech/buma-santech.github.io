document.addEventListener('DOMContentLoaded', () => {
    // --- MENU RESPONSIVO MOBILE ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click en enlaces
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- SIMULADOR INTERACTIVO DE PANTALLAS ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const simPanels = document.querySelectorAll('.sim-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('aria-controls');

            // Desactivar todas las pestañas
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            // Ocultar todos los paneles
            simPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Activar la pestaña y el panel actual
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // --- CALCULADORA DE MÁRGENES EN TIEMPO REAL ---
    const costInput = document.getElementById('cost-price');
    const saleInput = document.getElementById('sale-price');
    const volumeInput = document.getElementById('volume-sales');

    const unitProfitEl = document.getElementById('unit-profit');
    const profitMarginEl = document.getElementById('profit-margin');
    const monthlyProfitEl = document.getElementById('monthly-profit');
    const marginStatusEl = document.getElementById('margin-status');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function calculateMargins() {
        if (!costInput || !saleInput || !volumeInput) return;

        const cost = parseFloat(costInput.value) || 0;
        const sale = parseFloat(saleInput.value) || 0;
        const volume = parseInt(volumeInput.value) || 0;

        const unitProfit = sale - cost;
        
        let marginPercent = 0;
        if (sale > 0) {
            marginPercent = (unitProfit / sale) * 100;
        } else if (unitProfit > 0) {
            marginPercent = 100; // si cuesta 0 y vende a algo > 0
        }

        const monthlyProfit = unitProfit * volume;

        // Actualizar valores en pantalla
        unitProfitEl.textContent = formatCurrency(unitProfit);
        profitMarginEl.textContent = marginPercent.toFixed(2) + '%';
        monthlyProfitEl.textContent = formatCurrency(monthlyProfit);

        // Estilos y badge de estado según el margen (siguiendo lógica de la app)
        marginStatusEl.className = 'status-badge'; // Limpiar clases
        
        if (marginPercent < 20) {
            marginStatusEl.textContent = 'Low Margin';
            marginStatusEl.classList.add('margin-low');
            profitMarginEl.className = 'result-value text-red';
        } else if (marginPercent >= 20 && marginPercent < 50) {
            marginStatusEl.textContent = 'Healthy Margin';
            marginStatusEl.classList.add('margin-healthy');
            profitMarginEl.className = 'result-value text-green';
        } else {
            marginStatusEl.textContent = 'Excellent Margin';
            marginStatusEl.classList.add('margin-excellent');
            profitMarginEl.className = 'result-value text-cyan';
        }

        // Color de la utilidad mensual
        if (monthlyProfit < 0) {
            monthlyProfitEl.className = 'result-value text-red';
        } else {
            monthlyProfitEl.className = 'result-value text-blue';
        }
    }

    // Eventos para recálculo en tiempo real
    if (costInput && saleInput && volumeInput) {
        costInput.addEventListener('input', calculateMargins);
        saleInput.addEventListener('input', calculateMargins);
        volumeInput.addEventListener('input', calculateMargins);
        
        // Ejecución inicial
        calculateMargins();
    }

    // --- ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) ---
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = trigger.querySelector('.faq-icon');
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Cerrar otros FAQs abiertos para mantener ordenado
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    const otherTrigger = item.querySelector('.faq-trigger');
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherIcon = item.querySelector('.faq-icon');
                    
                    otherTrigger.setAttribute('aria-expanded', 'false');
                    otherAnswer.setAttribute('hidden', '');
                    if (otherIcon) otherIcon.textContent = '＋';
                }
            });

            // Alternar estado actual
            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                answer.setAttribute('hidden', '');
                icon.textContent = '＋';
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                answer.removeAttribute('hidden');
                icon.textContent = '－';
            }
        });
    });

    // --- ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER) ---
    const fadeElements = document.querySelectorAll('.feature-card, .simulator-container, .calculator-wrapper, .faq-item, .cta-banner');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            // Añadir clase inicial de animación a los estilos dinámicamente si no está en CSS
            el.style.opacity = '0';
            el.style.transform = 'translateY(25px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            observer.observe(el);
        });

        // Función para inyectar estilo de visibilidad
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            .feature-card.visible, 
            .simulator-container.visible, 
            .calculator-wrapper.visible, 
            .faq-item.visible, 
            .cta-banner.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(styleSheet);
    } else {
        // Fallback si el navegador no soporta IntersectionObserver
        fadeElements.forEach(el => {
            el.style.opacity = '1';
        });
    }
});
