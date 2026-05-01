// ============================================
// ADVANCED REAL-TIME PORTFOLIO SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initParticles();
    initTypingEffect();
    initScrollNavigation();
    initScrollAnimations();
    initSkillsBars();
    initChat();
    initContactForm();
    initCounterAnimation();
    initMobileMenu();
    initHeroParallax();
    initIntro();
    initFlashEffects();
});

// ============================================
// INTRO OVERLAY CONTROL
// ============================================
function initIntro() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    // allow click to skip
    overlay.addEventListener('click', () => finishIntro(overlay));

    // automatically finish after 3 seconds
    setTimeout(() => finishIntro(overlay), 3000);

    function finishIntro(el) {
        el.classList.add('hidden');
        el.setAttribute('aria-hidden', 'true');
    }
}

// ============================================
// FLASH EFFECTS: occasional 3D face glints
// ============================================
function initFlashEffects() {
    const faces = Array.from(document.querySelectorAll('.feature-cube .f-face, .cube-intro .i-face, .tech-cube .face'));
    if (!faces.length) return;

    // random flashes every few seconds
    setInterval(() => {
        const idx = Math.floor(Math.random() * faces.length);
        const el = faces[idx];
        el.classList.add('flash');
        // remove after animation completes
        setTimeout(() => el.classList.remove('flash'), 800);
    }, 2200 + Math.random() * 1800);

    // also flash on hover for interactivity
    faces.forEach(f => {
        f.addEventListener('mouseenter', () => {
            f.classList.add('flash');
            setTimeout(() => f.classList.remove('flash'), 700);
        });
    });
}

// ============================================
// HERO PARALLAX EFFECT
// ============================================
function initHeroParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const img = hero.querySelector('.hero-img');
    if (!img) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const maxTrans = 20; // pixels
        img.style.transform = `translate(${x * maxTrans}px, ${y * maxTrans}px) scale(1.05)`;

        // also tilt hero content for depth
        const content = hero.querySelector('.hero-content');
        if (content) {
            const tilt = 5; // degrees
            content.style.transform = `rotateY(${x * tilt}deg) rotateX(${y * tilt}deg)`;
        }
    });

    hero.addEventListener('mouseleave', () => {
        img.style.transform = '';
        const content = hero.querySelector('.hero-content');
        if (content) content.style.transform = '';
    });
}

// Theme toggle implementation (single definition located later in file)

function initTypingEffect() {
    const titleElement = document.getElementById('typing-title');
    const taglineElement = document.getElementById('typing-tagline');
    const statusElement = document.getElementById('live-status-text');
    
    const titleText = 'Sachin Raghav';
    const taglineText = 'AI & ML Engineer | Full Stack Developer';
    const statuses = [
        'Building Advanced Solutions',
        'Real-time Portfolio Live',
        'AI, Cloud & Web Fusion',
        'Powered by Python, Node & JS'
    ];
    
    let statusIndex = 0;
    
    typeText(titleElement, titleText, 100);
    
    setTimeout(() => {
        typeText(taglineElement, taglineText, 50);
    }, titleText.length * 100 + 500);
    
    setInterval(() => {
        statusIndex = (statusIndex + 1) % statuses.length;
        statusElement.style.opacity = '0';
        setTimeout(() => {
            statusElement.textContent = statuses[statusIndex];
            statusElement.style.transition = 'opacity 0.3s';
            statusElement.style.opacity = '1';
        }, 300);
    }, 5000);
    
    function typeText(element, text, speed) {
        let index = 0;
        element.innerHTML = '';
        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }
        type();
    }
}

function initScrollNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-menu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            navMenu.classList.remove('active');
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elements = document.querySelectorAll('.project-card, .skill-item, .contact-card, .info-card, .about-content, .education-info');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initSkillsBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.setProperty('--fill-width', width + '%');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    progressFills.forEach(fill => observer.observe(fill));
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalCount = parseInt(target.getAttribute('data-count'));
                animateCounter(target, finalCount);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

let socket = null;

function initChat() {
    socket = io();
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const onlineCountEl = document.getElementById('online-count');
    
    let welcomeShown = true;
    
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        
        if (msg.length > 0 && msg.length <= 200) {
            if (welcomeShown) {
                const welcome = chatBox.querySelector('.chat-welcome');
                if (welcome) welcome.remove();
                welcomeShown = false;
            }
            
            socket.emit('chat message', {
                text: msg,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            
            chatInput.value = '';
            chatInput.focus();
        }
    });
    
    socket.on('chat message', (msg) => {
        if (welcomeShown) {
            const welcome = chatBox.querySelector('.chat-welcome');
            if (welcome) welcome.remove();
            welcomeShown = false;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<strong>${msg.timestamp || 'Now'}:</strong> ${escapeHtml(msg.text)}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
    
    socket.on('user count', (count) => {
        onlineCountEl.textContent = count;
    });
    
    socket.on('connect', () => {
        showNotification('Connected to chat', 'success');
    });
    
    socket.on('disconnect', () => {
        showNotification('Disconnected from chat', 'error');
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formStatus = document.getElementById('form-status');
    
    nameInput.addEventListener('blur', () => validateField('name'));
    emailInput.addEventListener('blur', () => validateField('email'));
    messageInput.addEventListener('blur', () => validateField('message'));
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isNameValid = validateField('name');
        const isEmailValid = validateField('email');
        const isMessageValid = validateField('message');
        
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            showNotification('Please fix the errors', 'error');
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        formStatus.textContent = '';
        
        try {
            // Send email using Formspree (no setup required)
            const formDataToSend = new FormData();
            formDataToSend.append('name', nameInput.value.trim());
            formDataToSend.append('email', emailInput.value.trim());
            formDataToSend.append('message', messageInput.value.trim());
            formDataToSend.append('_next', window.location.href);
            formDataToSend.append('_captcha', 'false');
            
            const response = await fetch('https://formspree.io/f/xdkqzqnl', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('Message sent successfully! Check your email.', 'success');
                contactForm.reset();
                formStatus.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                console.log('Email sent successfully');
                showThankYouModal();
            } else {
                const responseData = await response.json();
                throw new Error(responseData.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form error:', error);
            showNotification('Error: ' + error.message, 'error');
            formStatus.textContent = 'Error sending message: ' + error.message;
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = btnText;
        }
    });
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    let isValid = true;
    let errorMsg = '';
    
    switch (fieldId) {
        case 'name':
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMsg = 'Name must be at least 2 characters';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMsg = 'Please enter a valid email';
            }
            break;
        case 'message':
            if (field.value.trim().length < 10) {
                isValid = false;
                errorMsg = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (isValid) {
        errorEl.classList.remove('show');
        errorEl.textContent = '';
    } else {
        errorEl.classList.add('show');
        errorEl.textContent = errorMsg;
    }
    
    return isValid;
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutNotif 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showThankYouModal() {
    const modal = document.getElementById('thank-you-modal');
    const closeBtn = document.getElementById('modal-close');
    const confirmBtn = document.getElementById('modal-confirm');
    
    console.log('showThankYouModal called');
    console.log('Modal element:', modal);
    console.log('Close button:', closeBtn);
    console.log('Confirm button:', confirmBtn);
    
    if (!modal) {
        console.error('Thank you modal not found in DOM');
        return;
    }
    
    // Ensure modal is visible
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    
    // Trigger reflow and then fade in
    setTimeout(() => {
        modal.classList.add('show');
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
    }, 10);
    
    function closeModal() {
        console.log('closeModal called');
        modal.classList.remove('show');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
        }, 300);
        
        // Remove event listeners
        if (closeBtn) closeBtn.removeEventListener('click', closeModal);
        if (confirmBtn) confirmBtn.removeEventListener('click', closeModal);
        document.removeEventListener('keydown', escapeHandler);
        modal.removeEventListener('click', backgroundClickHandler);
    }
    
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            console.log('Escape pressed');
            closeModal();
        }
    };
    
    const backgroundClickHandler = (e) => {
        if (e.target === modal) {
            console.log('Background clicked');
            closeModal();
        }
    };
    
    // Attach event listeners
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (confirmBtn) confirmBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', escapeHandler);
    modal.addEventListener('click', backgroundClickHandler);
    
    console.log('Modal event listeners attached');
}


const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutNotif {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ============================================
// THEME TOGGLE (Dark/Light Mode)
// ============================================
function initThemeToggle() {
    console.debug('initThemeToggle called');
    let themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
        // fallback selector in case markup uses different element
        themeToggle = document.querySelector('button.theme-btn, [id="theme-toggle"]');
        console.debug('themeToggle fallback used:', themeToggle);
    }
    const savedTheme = localStorage.getItem('portfolio-theme');

    // Apply saved theme or system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

    if (initialTheme === 'dark') document.body.classList.add('dark-mode');

    if (themeToggle) {
        // set accessible state and icon
        const isDarkNow = document.body.classList.contains('dark-mode');
        themeToggle.setAttribute('aria-pressed', isDarkNow);
        themeToggle.innerHTML = isDarkNow ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        const toggleHandler = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-pressed', isDark);
            console.debug('theme toggled, isDark=', isDark);
        };

        themeToggle.removeEventListener('click', toggleHandler);
        themeToggle.addEventListener('click', toggleHandler);
        // keyboard accessibility: Enter/Space
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleHandler();
            }
        });
    } else {
        // ensure we still store a preference if no toggle present
        localStorage.setItem('portfolio-theme', initialTheme === 'dark' ? 'dark' : 'light');
    }
}