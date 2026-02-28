// Optional JavaScript for smooth scrolling and simple interactions

// When any anchor link with a hash is clicked, smoothly scroll to section
const links = document.querySelectorAll('a[href^="#"]');
for (let link of links) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// contact form submission - currently just prevents default and logs data
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            name: this.name.value,
            email: this.email.value,
            message: this.message.value
        };
        console.log('Contact form submitted:', data);
        alert('Message sent (not really, this is a static form).');
        this.reset();
    });
}
