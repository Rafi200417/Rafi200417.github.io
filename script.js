// Typing Animation
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.getElementById('typing-name');
    const text = 'Mohammad Rafi';
    let index = 0;
    let isTyping = false;

    function typeWriter() {
        if (index < text.length && isTyping) {
            typingElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 60);
        } else {
            isTyping = false;
        }
    }

// Scroll Animation Observer - Optimized for smooth performance
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'typing-name' && !isTyping) {
                    index = 0;
                    typingElement.innerHTML = '';
                    isTyping = true;
                    setTimeout(typeWriter, 500);
                }
                // Add animate class and stop observing - animation plays only once
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Observe the typing element
    observer.observe(typingElement);

    // Stagger animation for project cards
    const projectCards = document.querySelectorAll('.stagger-animation');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Contact Form Handling with EmailJS
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Initialize EmailJS
        emailjs.init('bh3f1LKiuys7HknbN');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const name = document.querySelector('input[placeholder="Your Name"]').value.trim();
            const email = document.querySelector('input[placeholder="Your Email"]').value.trim();
            const subject = document.querySelector('input[placeholder="Subject"]').value.trim();
            const message = document.querySelector('textarea[placeholder="Your Message"]').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Prepare email parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: `From: ${email}\n\n${message}`,
                to_name: 'Mohammad Rafi', // Your name
            };

            // Send email using EmailJS
            emailjs.send('service_m38647e', 'template_x5ihyxo', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);

                    // Reset form
                    contactForm.reset();

                    // Show success message
                    showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');

                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, function(error) {
                    console.log('FAILED...', error);

                    // Show error message
                    showFormMessage('Sorry, there was an error sending your message. Please try again later or contact me directly.', 'error');

                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;

        // Style the message
        messageDiv.style.cssText = `
            padding: 12px 16px;
            margin-top: 1rem;
            border-radius: 5px;
            font-weight: 500;
            text-align: center;
            animation: fadeIn 0.3s ease;
        `;

        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        }

        // Insert message after form
        contactForm.appendChild(messageDiv);

        // Auto remove success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
});

// Mobile navigation (hamburger) behavior
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('active');
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (ev) => {
            if (!navMenu.contains(ev.target) && !hamburger.contains(ev.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Ensure menu is closed when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Handle smooth scroll for all navigation links (including footer)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                if (hamburger) {
                    hamburger.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
});
