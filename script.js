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
            setTimeout(typeWriter, 60); // Faster speed
        } else {
            isTyping = false;
        }
    }

// Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'typing-name' && !isTyping) {
                    // Reset typing state
                    index = 0;
                    typingElement.innerHTML = '';
                    isTyping = true;
                    setTimeout(typeWriter, 500); // Start typing after short delay
                }
                entry.target.classList.add('animate');
            } else {
                // Remove animate class when element leaves viewport to allow re-animation
                entry.target.classList.remove('animate');
                if (entry.target.id === 'typing-name') {
                    isTyping = false; // Stop typing if out of view
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animateElements.forEach(element => {
        // Check if element is already in viewport on load
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top >= 0 && rect.left >= 0 &&
                            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                            rect.right <= (window.innerWidth || document.documentElement.clientWidth);

        if (isInViewport) {
            element.classList.add('animate');
        }
        // Always observe elements to handle scroll in/out
        observer.observe(element);
    });

    // Observe the typing element
    observer.observe(typingElement);

    // Stagger animation for project cards
    const projectCards = document.querySelectorAll('.stagger-animation');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        // Check if card is already in viewport on load
        const rect = card.getBoundingClientRect();
        const isInViewport = rect.top >= 0 && rect.left >= 0 &&
                            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                            rect.right <= (window.innerWidth || document.documentElement.clientWidth);

        if (isInViewport) {
            setTimeout(() => card.classList.add('animate'), index * 100);
        }
        // Always observe cards to handle scroll in/out
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
