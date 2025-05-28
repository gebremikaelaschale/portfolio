
document.addEventListener('DOMContentLoaded', () => {
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const mainNavPanel = document.getElementById('main-navigation-panel');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-item-link, .nav-trigger');
    const contentSections = document.querySelectorAll('.content-section');
    
    const navBriefInfoElement = document.getElementById('nav-brief-info');
    const navSubtitleElement = document.querySelector('.nav-panel-header .nav-subtitle');

    const briefInfoContent = {
        home: "Welcome! Exploring my digital canvas and projects.",
        about: "Delving into my journey, aspirations, and background in CS.",
        skills: "A showcase of my technical skills and development tools.",
        projects: "Discover the projects I've passionately built and contributed to.",
        contact: "Let's connect! Reach out for collaborations or a friendly chat."
    };
    
    function updateNavBriefInfo(pageId) {
        if (navBriefInfoElement && briefInfoContent[pageId]) {
            navBriefInfoElement.textContent = briefInfoContent[pageId];
            navBriefInfoElement.classList.add('visible');
            if (navSubtitleElement) navSubtitleElement.style.display = 'none';
        } else if (navBriefInfoElement) {
            navBriefInfoElement.textContent = ''; 
            navBriefInfoElement.classList.remove('visible');
            if (navSubtitleElement) navSubtitleElement.style.display = 'block';
        }
    }
    
    function toggleNavigation() {
        const isNavOpen = document.body.classList.toggle('nav-open');
        menuToggleButton.innerHTML = isNavOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        menuToggleButton.setAttribute('aria-expanded', isNavOpen.toString());

        if (isNavOpen) {
            const currentActiveLink = document.querySelector('.nav-item-link.active-nav-item');
            if (currentActiveLink && currentActiveLink.dataset.page) {
                updateNavBriefInfo(currentActiveLink.dataset.page);
            } else {
                const initialSection = window.location.hash.substring(1) || 'home';
                updateNavBriefInfo(initialSection);
            }
        } else {
            if (navBriefInfoElement) {
                navBriefInfoElement.textContent = '';
                navBriefInfoElement.classList.remove('visible');
            }
            if (navSubtitleElement) navSubtitleElement.style.display = 'block';
        }
    }

    if (menuToggleButton) {
        menuToggleButton.addEventListener('click', toggleNavigation);
    }
    if (navOverlay) {
        navOverlay.addEventListener('click', toggleNavigation);
    }

    function showSection(sectionId, isInitialLoad = false) {
        contentSections.forEach(section => {
            section.classList.remove('active-section');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active-section');
        }

        document.querySelectorAll('.nav-item-link').forEach(link => {
            link.classList.remove('active-nav-item');
            if (link.dataset.page === sectionId) {
                link.classList.add('active-nav-item');
            }
        });
        
        if (document.body.classList.contains('nav-open') && !isInitialLoad) {
            updateNavBriefInfo(sectionId);
        }
        
        if (!isInitialLoad) { 
            window.scrollTo(0,0);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.page;
            if (sectionId) {
                showSection(sectionId);
                history.pushState(null, null, `#${sectionId}`);
            }
            if (document.body.classList.contains('nav-open')) {
                 if (mainNavPanel && mainNavPanel.contains(link) && !link.classList.contains('nav-trigger')) { 
                    toggleNavigation();
                }
            }
        });
    });

    function handleInitialLoad() {
        const hash = window.location.hash.substring(1);
        const sectionToLoad = (hash && document.getElementById(hash)) ? hash : 'home';
        
        showSection(sectionToLoad, true); 

        if (!hash || hash !== sectionToLoad) { 
             history.replaceState(null, null, `#${sectionToLoad}`);
        }

        if (document.body.classList.contains('nav-open')) {
             updateNavBriefInfo(sectionToLoad);
        } else {
            if (navSubtitleElement) navSubtitleElement.style.display = 'block';
            if (navBriefInfoElement) navBriefInfoElement.classList.remove('visible');
        }
    }
    handleInitialLoad(); 

    window.addEventListener('popstate', handleInitialLoad); 

    // Contact Form Validation
    const contactForm = document.getElementById('main-contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const passwordInput = document.getElementById('contact-password'); // Get password input
    const messageInput = document.getElementById('contact-message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error'); // Get password error span
    const messageError = document.getElementById('message-error');

    function setFieldError(field, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
        if (field) {
            field.classList.add('error');
        }
    }

    function clearFieldError(field, errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
        if (field) {
            field.classList.remove('error');
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            let isValid = validateForm();

            if (isValid) {
                alert('Thank you for your message! (This is a demo submission)');
                contactForm.reset();
                // Clear all errors after successful submission
                clearFieldError(nameInput, nameError);
                clearFieldError(emailInput, emailError);
                clearFieldError(passwordInput, passwordError); // Clear password error
                clearFieldError(messageInput, messageError);
            }
        });
    }

    function validateForm() {
        let valid = true;
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value; // Don't trim password value typically
        const messageValue = messageInput.value.trim();

        // Clear previous errors
        clearFieldError(nameInput, nameError);
        clearFieldError(emailInput, emailError);
        clearFieldError(passwordInput, passwordError); // Clear password error
        clearFieldError(messageInput, messageError);

        // Name validation
        if (nameValue === '') {
            setFieldError(nameInput, nameError, 'Name is required.');
            valid = false;
        }

        // Email validation
        if (emailValue === '') {
            setFieldError(emailInput, emailError, 'Email is required.');
            valid = false;
        } else if (!isValidEmail(emailValue)) {
            setFieldError(emailInput, emailError, 'Please enter a valid email address.');
            valid = false;
        }

        // Password validation
        if (passwordValue === '') {
            setFieldError(passwordInput, passwordError, 'Password is required.');
            valid = false;
        } else if (passwordValue.length < 8) {
            setFieldError(passwordInput, passwordError, 'Password must be at least 8 characters long.');
            valid = false;
        }
        
        // Message validation
        if (messageValue === '') {
            setFieldError(messageInput, messageError, 'Message is required.');
            valid = false;
        }
        
        return valid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const footerYear = document.getElementById('footer-current-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    const canvas = document.getElementById('interactive-canvas-background');
    if (canvas) { 
        const ctx = canvas.getContext('2d');
        let particlesArray;

        function setupCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particlesArray = [];
            const numberOfParticles = (canvas.width * canvas.height) / 18000; 
            const maxParticles = 75;

            for (let i = 0; i < Math.min(numberOfParticles, maxParticles); i++) {
                let size = Math.random() * 2.8 + 1.2;
                let x = Math.random() * (innerWidth - size * 2) + size;
                let y = Math.random() * (innerHeight - size * 2) + size;
                let directionX = (Math.random() * 0.3) - 0.15; 
                let directionY = (Math.random() * 0.3) - 0.15;
                const colorChoice = Math.random() > 0.5 ? 
                                    `rgba(106, 13, 173, ${Math.random() * 0.35 + 0.15})` : 
                                    `rgba(0, 212, 255, ${Math.random() * 0.45 + 0.2})`; 
                particlesArray.push({ x, y, directionX, directionY, size, color: colorChoice });
            }
        }
        
        let animationFrameId;
        function animateParticles() {
            animationFrameId = requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                let p = particlesArray[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
                ctx.fillStyle = p.color;
                ctx.fill();

                if (p.x + p.size > canvas.width || p.x - p.size < 0) {
                    p.directionX = -p.directionX;
                }
                if (p.y + p.size > canvas.height || p.y - p.size < 0) {
                    p.directionY = -p.directionY;
                }
                p.x += p.directionX;
                p.y += p.directionY;
            }
        }
        
        let resizeTimeout;
        function debouncedResize() {
            clearTimeout(resizeTimeout);
            if (animationFrameId) {
                 cancelAnimationFrame(animationFrameId); 
            }
            resizeTimeout = setTimeout(() => {
                setupCanvas();
                animateParticles(); 
            }, 250);
        }

        setupCanvas();
        animateParticles();
        window.addEventListener('resize', debouncedResize);
    }
});