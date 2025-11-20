// ========================================
// HATechLabs - Global JavaScript
// Modern, Futuristic, 2025 Edition
// ========================================

// Smooth initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initCounters();
    initTestimonialSlider();
    initPortfolioFilter();
    initContactForm();
    initMagneticButtons();
});

// ========================================
// Navigation
// ========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// Counter Animation
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// ========================================
// Testimonial Slider
// ========================================
function initTestimonialSlider() {
    const slider = document.getElementById('testimonialsSlider');
    if (!slider) return;
    
    const track = slider.querySelector('.testimonial-track');
    const slides = slider.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Create dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }
    
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        goToSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        goToSlide(currentIndex);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-play
    let autoplayInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });
}

// ========================================
// Portfolio Filter
// ========================================
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-card-detailed');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Case study modal
    const caseStudyButtons = document.querySelectorAll('.view-case-study');
    const modal = document.getElementById('caseStudyModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    
    if (modal && modalBody) {
        caseStudyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.getAttribute('data-project');
                loadCaseStudy(projectId, modalBody);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        modalClose?.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modal.querySelector('.modal-overlay')?.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

function loadCaseStudy(projectId, container) {
    // Mock case study data - replace with actual data/API
    const caseStudies = {
        '1': {
            title: 'NextGen Banking Platform',
            description: 'Complete digital transformation of legacy banking systems',
            challenge: 'The client needed to modernize their 20-year-old banking infrastructure while maintaining 100% uptime.',
            solution: 'We implemented a phased migration strategy using microservices architecture on AWS, with zero-downtime deployment.',
            results: ['500K+ active users', '99.99% uptime achieved', '40% cost reduction', '60% faster transaction processing'],
            technologies: ['AWS', 'React', 'Node.js', 'PostgreSQL', 'Kubernetes', 'Redis']
        },
        '2': {
            title: 'SmartRetail AI Platform',
            description: 'AI-powered e-commerce transformation',
            challenge: 'Low conversion rates and poor personalization led to lost revenue opportunities.',
            solution: 'Deployed machine learning models for personalized recommendations and dynamic pricing.',
            results: ['35% conversion increase', '2M+ monthly orders', '$50M+ revenue impact', '92% customer satisfaction'],
            technologies: ['Python', 'TensorFlow', 'Vue.js', 'MongoDB', 'Apache Kafka', 'Docker']
        },
        // Add more case studies as needed
    };
    
    const study = caseStudies[projectId] || caseStudies['1'];
    
    container.innerHTML = `
        <h2>${study.title}</h2>
        <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 30px;">${study.description}</p>
        
        <h3>The Challenge</h3>
        <p style="color: var(--text-secondary); margin-bottom: 25px;">${study.challenge}</p>
        
        <h3>Our Solution</h3>
        <p style="color: var(--text-secondary); margin-bottom: 25px;">${study.solution}</p>
        
        <h3>Results</h3>
        <ul style="list-style: none; margin-bottom: 25px;">
            ${study.results.map(result => `<li style="padding: 10px 0; color: var(--text-secondary); border-bottom: 1px solid var(--glass-border);">✓ ${result}</li>`).join('')}
        </ul>
        
        <h3>Technologies Used</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
            ${study.technologies.map(tech => `<span style="padding: 8px 18px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50px; font-size: 0.9rem;">${tech}</span>`).join('')}
        </div>
    `;
}

// ========================================
// Contact Form Validation & Submission
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual endpoint)
        try {
            await simulateFormSubmission(data);
            
            // Show success message
            const successMsg = document.getElementById('formSuccess');
            if (successMsg) {
                successMsg.classList.add('active');
            }
            
            // Reset form
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMsg?.classList.remove('active');
            }, 5000);
            
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('.form-input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let errorMsg = '';
    
    // Required check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMsg = 'This field is required';
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMsg = 'Please enter a valid email address';
        }
    }
    
    // Select validation
    if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) {
        isValid = false;
        errorMsg = 'Please select an option';
    }
    
    // Show/hide error
    const errorSpan = field.parentElement.querySelector('.form-error');
    if (isValid) {
        field.classList.remove('error');
        if (errorSpan) errorSpan.textContent = '';
    } else {
        field.classList.add('error');
        if (errorSpan) errorSpan.textContent = errorMsg;
    }
    
    return isValid;
}

function clearFormErrors() {
    const errors = document.querySelectorAll('.form-error');
    errors.forEach(error => error.textContent = '');
    
    const errorInputs = document.querySelectorAll('.form-input.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

async function simulateFormSubmission(data) {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 1500);
    });
}

// ========================================
// Magnetic Button Effect
// ========================================
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.2;
            const moveY = y * 0.2;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ========================================
// Smooth Scroll to Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Parallax Effect for Hero Elements
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

// ========================================
// Add CSS class for error state
// ========================================
const style = document.createElement('style');
style.textContent = `
    .form-input.error {
        border-color: var(--error) !important;
    }
`;
document.head.appendChild(style);