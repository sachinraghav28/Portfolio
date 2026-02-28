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
});

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

function initParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = window.innerWidth > 768 ? 50 : 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

function initTypingEffect() {
    const titleElement = document.getElementById('typing-title');
    const taglineElement = document.getElementById('typing-tagline');
    const statusElement = document.getElementById('live-status-text');
    
    const titleText = 'Sachin Raghav';
    const taglineText = 'AI & ML Engineer | Full Stack Developer';
    const statuses = ['Building Advanced Solutions', 'Real-time Portfolio Live', 'Always Learning & Growing'];
    
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
        
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        formStatus.textContent = '';
        
        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
                formStatus.textContent = 'Message sent successfully!';
                formStatus.className = 'form-status success';
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form error:', error);
            showNotification('Error: ' + error.message, 'error');
            formStatus.textContent = 'Error sending message. Please try again.';
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
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    });
}\n\n// ============================================\n// PARTICLE BACKGROUND ANIMATION\n// ============================================\nfunction initParticles() {\n    const container = document.getElementById('particles-container');\n    const particleCount = window.innerWidth > 768 ? 50 : 20;\n    \n    for (let i = 0; i < particleCount; i++) {\n        const particle = document.createElement('div');\n        particle.className = 'particle';\n        particle.style.left = Math.random() * 100 + '%';\n        particle.style.top = Math.random() * 100 + '%';\n        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';\n        particle.style.animationDelay = Math.random() * 5 + 's';\n        container.appendChild(particle);\n    }\n}\n\n// ============================================\n// TYPING EFFECT FOR HERO SECTION\n// ============================================\nfunction initTypingEffect() {\n    const titleElement = document.getElementById('typing-title');\n    const taglineElement = document.getElementById('typing-tagline');\n    const statusElement = document.getElementById('live-status-text');\n    \n    const titleText = 'Sachin Raghav';\n    const taglineText = 'AI & ML Engineer | Full Stack Developer';\n    const statuses = ['Building Advanced Solutions', 'Real-time Portfolio Live', 'Always Learning & Growing'];\n    \n    let statusIndex = 0;\n    \n    // Type title\n    typeText(titleElement, titleText, 100);\n    \n    // Type tagline after title\n    setTimeout(() => {\n        typeText(taglineElement, taglineText, 50);\n    }, titleText.length * 100 + 500);\n    \n    // Rotate status\n    setInterval(() => {\n        statusIndex = (statusIndex + 1) % statuses.length;\n        statusElement.style.opacity = '0';\n        setTimeout(() => {\n            statusElement.textContent = statuses[statusIndex];\n            statusElement.style.transition = 'opacity 0.3s';\n            statusElement.style.opacity = '1';\n        }, 300);\n    }, 5000);\n    \n    function typeText(element, text, speed) {\n        let index = 0;\n        element.innerHTML = '';\n        \n        function type() {\n            if (index < text.length) {\n                element.innerHTML += text.charAt(index);\n                index++;\n                setTimeout(type, speed);\n            }\n        }\n        type();\n    }\n}\n\n// ============================================\n// SMOOTH SCROLL NAVIGATION\n// ============================================\nfunction initScrollNavigation() {\n    const navLinks = document.querySelectorAll('.nav-link');\n    const hamburger = document.getElementById('hamburger');\n    const navMenu = document.querySelector('.nav-menu');\n    \n    navLinks.forEach(link => {\n        link.addEventListener('click', (e) => {\n            e.preventDefault();\n            \n            // Remove active class from all links\n            navLinks.forEach(l => l.classList.remove('active'));\n            link.classList.add('active');\n            \n            // Close mobile menu\n            navMenu.classList.remove('active');\n            \n            // Smooth scroll to section\n            const targetId = link.getAttribute('href');\n            const targetSection = document.querySelector(targetId);\n            \n            if (targetSection) {\n                targetSection.scrollIntoView({ behavior: 'smooth' });\n            }\n        });\n    });\n    \n    // Update active link on scroll\n    window.addEventListener('scroll', () => {\n        let current = '';\n        const sections = document.querySelectorAll('section');\n        \n        sections.forEach(section => {\n            const sectionTop = section.offsetTop;\n            if (pageYOffset >= sectionTop - 200) {\n                current = section.getAttribute('id');\n            }\n        });\n        \n        navLinks.forEach(link => {\n            link.classList.remove('active');\n            if (link.getAttribute('href').slice(1) === current) {\n                link.classList.add('active');\n            }\n        });\n    });\n}\n\n// ============================================\n// MOBILE MENU TOGGLE\n// ============================================\nfunction initMobileMenu() {\n    const hamburger = document.getElementById('hamburger');\n    const navMenu = document.querySelector('.nav-menu');\n    \n    hamburger.addEventListener('click', () => {\n        navMenu.classList.toggle('active');\n    });\n}\n\n// ============================================\n// SCROLL ANIMATIONS (Intersection Observer)\n// ============================================\nfunction initScrollAnimations() {\n    const observerOptions = {\n        threshold: 0.15,\n        rootMargin: '0px 0px -100px 0px'\n    };\n    \n    const observer = new IntersectionObserver((entries) => {\n        entries.forEach(entry => {\n            if (entry.isIntersecting) {\n                entry.target.style.opacity = '1';\n                entry.target.style.transform = 'translateY(0)';\n                observer.unobserve(entry.target);\n            }\n        });\n    }, observerOptions);\n    \n    // Observe all animatable elements\n    const elements = document.querySelectorAll(\n        '.project-card, .skill-item, .contact-card, .info-card, .about-content, .education-info'\n    );\n    \n    elements.forEach(el => {\n        el.style.opacity = '0';\n        el.style.transform = 'translateY(20px)';\n        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';\n        observer.observe(el);\n    });\n}\n\n// ============================================\n// SKILLS PROGRESS BARS ANIMATION\n// ============================================\nfunction initSkillsBars() {\n    const progressFills = document.querySelectorAll('.progress-fill');\n    \n    const observer = new IntersectionObserver((entries) => {\n        entries.forEach(entry => {\n            if (entry.isIntersecting) {\n                const width = entry.target.getAttribute('data-width');\n                entry.target.style.setProperty('--fill-width', width + '%');\n                observer.unobserve(entry.target);\n            }\n        });\n    }, { threshold: 0.5 });\n    \n    progressFills.forEach(fill => {\n        observer.observe(fill);\n    });\n}\n\n// ============================================\n// COUNTER ANIMATION\n// ============================================\nfunction initCounterAnimation() {\n    const counters = document.querySelectorAll('.stat-number');\n    \n    const observer = new IntersectionObserver((entries) => {\n        entries.forEach(entry => {\n            if (entry.isIntersecting) {\n                const target = entry.target;\n                const finalCount = parseInt(target.getAttribute('data-count'));\n                animateCounter(target, finalCount);\n                observer.unobserve(target);\n            }\n        });\n    }, { threshold: 0.5 });\n    \n    counters.forEach(counter => observer.observe(counter));\n}\n\nfunction animateCounter(element, target) {\n    let current = 0;\n    const increment = target / 30;\n    const timer = setInterval(() => {\n        current += increment;\n        if (current >= target) {\n            element.textContent = target;\n            clearInterval(timer);\n        } else {\n            element.textContent = Math.floor(current);\n        }\n    }, 50);\n}\n\n// ============================================\n// REAL-TIME CHAT WITH SOCKET.IO\n// ============================================\nlet socket = null;\nlet onlineCount = 1;\n\nfunction initChat() {\n    // Connect to socket.io server\n    socket = io();\n    \n    const chatForm = document.getElementById('chat-form');\n    const chatInput = document.getElementById('chat-input');\n    const chatBox = document.getElementById('chat-box');\n    const onlineCountEl = document.getElementById('online-count');\n    \n    // Remove welcome message on first real message\n    let welcomeShown = true;\n    \n    // Handle form submission\n    chatForm.addEventListener('submit', (e) => {\n        e.preventDefault();\n        const msg = chatInput.value.trim();\n        \n        if (msg.length > 0 && msg.length <= 200) {\n            // Remove welcome message\n            if (welcomeShown) {\n                const welcome = chatBox.querySelector('.chat-welcome');\n                if (welcome) welcome.remove();\n                welcomeShown = false;\n            }\n            \n            socket.emit('chat message', {\n                text: msg,\n                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })\n            });\n            \n            chatInput.value = '';\n            chatInput.focus();\n        }\n    });\n    \n    // Receive messages\n    socket.on('chat message', (msg) => {\n        if (welcomeShown) {\n            const welcome = chatBox.querySelector('.chat-welcome');\n            if (welcome) welcome.remove();\n            welcomeShown = false;\n        }\n        \n        const messageDiv = document.createElement('div');\n        messageDiv.className = 'message';\n        messageDiv.innerHTML = `\n            <strong>${msg.timestamp || 'Now'}:</strong> ${escapeHtml(msg.text)}\n        `;\n        chatBox.appendChild(messageDiv);\n        chatBox.scrollTop = chatBox.scrollHeight;\n    });\n    \n    // Update online count\n    socket.on('user count', (count) => {\n        onlineCount = count;\n        onlineCountEl.textContent = count;\n    });\n    \n    // Connection handlers\n    socket.on('connect', () => {\n        showNotification('Connected to chat', 'success');\n    });\n    \n    socket.on('disconnect', () => {\n        showNotification('Disconnected from chat', 'error');\n    });\n    \n    socket.on('error', (error) => {\n        showNotification('Chat error: ' + error, 'error');\n    });\n}\n\nfunction escapeHtml(text) {\n    const div = document.createElement('div');\n    div.textContent = text;\n    return div.innerHTML;\n}\n\n// ============================================\n// CONTACT FORM SUBMISSION\n// ============================================\nfunction initContactForm() {\n    const contactForm = document.getElementById('contact-form');\n    const nameInput = document.getElementById('name');\n    const emailInput = document.getElementById('email');\n    const messageInput = document.getElementById('message');\n    const formStatus = document.getElementById('form-status');\n    \n    // Real-time validation\n    nameInput.addEventListener('blur', () => validateField('name'));\n    emailInput.addEventListener('blur', () => validateField('email'));\n    messageInput.addEventListener('blur', () => validateField('message'));\n    \n    // Form submission\n    contactForm.addEventListener('submit', async (e) => {\n        e.preventDefault();\n        \n        // Validate all fields\n        if (!validateField('name') | !validateField('email') | !validateField('message')) {\n            showNotification('Please fix the errors', 'error');\n            return;\n        }\n        \n        const formData = {\n            name: nameInput.value.trim(),\n            email: emailInput.value.trim(),\n            message: messageInput.value.trim()\n        };\n        \n        // Show loading state\n        const submitBtn = contactForm.querySelector('button[type=\"submit\"]');\n        const btnText = submitBtn.innerHTML;\n        submitBtn.disabled = true;\n        submitBtn.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Sending...';\n        formStatus.textContent = '';\n        \n        try {\n            const response = await fetch('/send-email', {\n                method: 'POST',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify(formData)\n            });\n            \n            const result = await response.json();\n            \n            if (result.success) {\n                showNotification('Message sent successfully!', 'success');\n                contactForm.reset();\n                formStatus.textContent = 'Message sent successfully!';\n                formStatus.className = 'form-status success';\n            } else {\n                throw new Error(result.error || 'Failed to send message');\n            }\n        } catch (error) {\n            console.error('Form error:', error);\n            showNotification('Error: ' + error.message, 'error');\n            formStatus.textContent = 'Error sending message. Please try again.';\n            formStatus.className = 'form-status error';\n        } finally {\n            submitBtn.disabled = false;\n            submitBtn.innerHTML = btnText;\n        }\n    });\n}\n\nfunction validateField(fieldId) {\n    const field = document.getElementById(fieldId);\n    const errorEl = document.getElementById(fieldId + '-error');\n    let isValid = true;\n    let errorMsg = '';\n    \n    switch (fieldId) {\n        case 'name':\n            if (field.value.trim().length < 2) {\n                isValid = false;\n                errorMsg = 'Name must be at least 2 characters';\n            }\n            break;\n        case 'email':\n            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n            if (!emailRegex.test(field.value.trim())) {\n                isValid = false;\n                errorMsg = 'Please enter a valid email';\n            }\n            break;\n        case 'message':\n            if (field.value.trim().length < 10) {\n                isValid = false;\n                errorMsg = 'Message must be at least 10 characters';\n            }\n            break;\n    }\n    \n    if (isValid) {\n        errorEl.classList.remove('show');\n        errorEl.textContent = '';\n    } else {\n        errorEl.classList.add('show');\n        errorEl.textContent = errorMsg;\n    }\n    \n    return isValid;\n}\n\n// ============================================\n// NOTIFICATION SYSTEM\n// ============================================\nfunction showNotification(message, type = 'info') {\n    const container = document.getElementById('notification-container');\n    const notification = document.createElement('div');\n    notification.className = `notification ${type}`;\n    notification.textContent = message;\n    \n    container.appendChild(notification);\n    \n    // Auto remove after 5 seconds\n    setTimeout(() => {\n        notification.style.animation = 'slideOutNotif 0.3s ease-out';\n        setTimeout(() => notification.remove(), 300);\n    }, 5000);\n}\n\n// Add slideout animation\nconst style = document.createElement('style');\nstyle.textContent = `\n    @keyframes slideOutNotif {\n        from {\n            opacity: 1;\n            transform: translateX(0);\n        }\n        to {\n            opacity: 0;\n            transform: translateX(100px);\n        }\n    }\n`;\ndocument.head.appendChild(style);\n\n// ============================================\n// UTILITY: Performance Optimization\n// ============================================\n\n// Lazy load images\nif ('IntersectionObserver' in window) {\n    const imageObserver = new IntersectionObserver((entries) => {\n        entries.forEach(entry => {\n            if (entry.isIntersecting) {\n                const img = entry.target;\n                img.src = img.dataset.src;\n                img.classList.remove('lazy');\n                imageObserver.unobserve(img);\n            }\n        });\n    });\n    \n    document.querySelectorAll('img.lazy').forEach(img => {\n        imageObserver.observe(img);\n    });\n}\n\n// ============================================\n// ERROR HANDLING\n// ============================================\nwindow.addEventListener('error', (e) => {\n    console.error('Global error:', e.error);\n});\n\nwindow.addEventListener('unhandledrejection', (e) => {\n    console.error('Unhandled promise rejection:', e.reason);\n});\n\n// ============================================\n// ANALYTICS PLACEHOLDER\n// ============================================\nfunction trackEvent(eventName, eventData = {}) {\n    console.log('Event tracked:', eventName, eventData);\n}\n\n// Track page views\ntrackEvent('page_view', {\n    page_title: document.title,\n    page_location: window.location.href\n});
