/**
 * Portfolio Website - İlhan Bahadır Yavaş
 * Main JavaScript File
 * Handles navigation, animations, modals, and interactivity
 */

// ===== DOM Elements =====
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const modal = document.getElementById('project-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const projectDetailBtns = document.querySelectorAll('.btn-details, .btn-view-details');

// ===== Project Data =====
const projectData = {
    'vr-showroom': {
        title: 'VR Showroom Project',
        image: 'assets/img/vr-showroom.svg',
        description: 'A virtual showroom built with UE5 VR Template where users freely explore space, examine assets, and trigger contextual interactions. This project showcases immersive VR development skills with a focus on user experience and performance optimization.',
        features: [
            'Modular blueprint components including overlap/trace/grab mechanics for intuitive VR interaction.',
            'Lumen, Nanite, Level of Detail, and visibility culling optimizations with stat unit/GPU profiling.',
            'VR locomotion system with teleport and snap turn functionality; tested ergonomics settings for comfort.',
            'Contextual interaction triggers that respond to user proximity and gaze direction.',
            'Scalable architecture designed for easy addition of new showroom items and experiences.'
        ],
        technologies: ['Unreal Engine 5', 'Blueprint', 'VR Template', 'Motion Controllers', 'Lumen', 'Nanite', 'Git']
    },
    'zombie-survival': {
        title: 'Zombie Survival Game',
        image: 'assets/img/zombie-survival.svg',
        video: 'https://youtu.be/PsBm4uJqYyc',
        description: 'A cooperative survival loop prototype featuring round pacing, resource pressure, and comprehensive health/damage feedback systems including screen shake, post-process effects, and audio cues.',
        features: [
            'Level blockouts designed for optimal player flow, strategic choke points, and sight lines.',
            'Enemy behaviors powered by Behavior Trees and Environment Query System (EQS).',
            'NavMesh integration with spawn timer and aggro tuning for balanced difficulty.',
            'Blueprint-based pickup system with simple inventory and wave logic mechanics.',
            'Debug tools including on-screen counters for real-time gameplay analysis.',
            'Screen shake, post-process effects, and audio feedback for impactful damage visualization.'
        ],
        technologies: ['UE5', 'Blueprints', 'Behavior Trees', 'NavMesh', 'DataTables', 'Perception', 'EQS']
    },
    'hidden-object': {
        title: 'Hidden Object Room Game (IoT-Connected)',
        image: 'assets/img/hidden-object.svg',
        description: 'A room-scale hidden object experience where real physical devices send data to the game via MQTT protocol, creating a unique bridge between physical and digital interaction.',
        features: [
            'MQTT pub/sub integration with defined topic schema, JSON payloads, and debounce/back-pressure logic.',
            'Item Placer actor that spawns objects by size/category and reports provenance for analytics.',
            'UI bar displaying target objects with respawn/replace rules upon discovery.',
            'Real-time synchronization between physical IoT devices and in-game events.',
            'Scalable architecture supporting multiple simultaneous device connections.'
        ],
        technologies: ['UE5', 'Blueprint', 'Mosquitto MQTT', 'JSON', 'IoT Integration']
    },
    'quick-truck': {
        title: 'Quick Truck Mobile Game',
        image: 'assets/img/ChatGPT%20Image%20Feb%201,%202026,%2006_21_51%20PM.png',
        description: 'A mobile truck game developed with Unreal Engine 5, featuring optimized infinite procedural maps and AI-driven police vehicle pursuit system.',
        features: [
            'Infinite procedural mini-planet map generation for endless gameplay variety.',
            'AI-driven police vehicles that pursue and challenge the player.',
            'Intuitive vehicle controls: press left/right to steer, simultaneous press for brake/reverse.',
            'Fuel and cargo health management systems adding strategic depth.',
            'Mission objective: reach 5 military bases across the procedurally generated world.',
            'Curved World shader for unique visual perspective and horizon effect.'
        ],
        technologies: ['UE5', 'Blueprint', 'Procedural Generation', 'AI', 'Curved World Shader', 'Mobile Optimization']
    }
};

// ===== Initialize AOS =====
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
    
    // Initialize Typewriter Effect
    initTypewriter();
    
    // Initialize Counter Animation
    initCounters();
});

// ===== Typewriter Effect =====
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter-text');
    if (!typewriterElement) return;
    
    const roles = [
        'Game Developer',
        'VR Experience Designer',
        'Unreal Engine 5 Specialist',
        'Immersive Tech Creator',
        'Blueprint Developer'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before new word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// ===== Counter Animation =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const duration = 1500;
    const stepTime = duration / 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ===== Header Scroll Effect =====
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
    
    // Back to top button visibility
    if (currentScrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// ===== Close mobile menu when clicking a link =====
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Close mobile menu when clicking outside =====
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Active Navigation Link on Scroll =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Back to Top Button =====
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Project Modal =====
function openModal(projectId) {
    const project = projectData[projectId];
    
    if (!project) return;
    
    const featuresHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
    const techHTML = project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
    
    // Check if project has a video
    let videoHTML = '';
    if (project.video) {
        const videoId = project.video.includes('youtu.be') 
            ? project.video.split('/').pop() 
            : new URLSearchParams(new URL(project.video).search).get('v');
        videoHTML = `
            <div class="modal-video">
                <iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/${videoId}" 
                    title="${project.title} Demo" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        ${videoHTML || `<img src="${project.image}" alt="${project.title}" class="modal-image" loading="lazy">`}
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <h4>Key Features</h4>
        <ul>${featuresHTML}</ul>
        <h4>Technologies Used</h4>
        <div class="modal-tech">${techHTML}</div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for project detail buttons
projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-project');
        openModal(projectId);
    });
});

// Close modal events
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== Form Handling =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Form uses mailto: so we allow default behavior
        // In production, you would handle this with a backend service
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            e.preventDefault();
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert('Please enter a valid email address.');
            return;
        }
    });
}

// ===== Skill Progress Animation =====
const skillItems = document.querySelectorAll('.skill-progress');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = progressBar.style.getPropertyValue('--progress');
            }
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

skillItems.forEach(item => {
    const progressBar = item.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        skillObserver.observe(item);
    }
});

// ===== Lazy Loading for Images =====
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support native lazy loading
    const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                lazyImageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => lazyImageObserver.observe(img));
}

// ===== Typewriter Effect for Hero (Optional Enhancement) =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== Initialize All Features =====
document.addEventListener('DOMContentLoaded', () => {
    // Initial active link update
    updateActiveNavLink();
    
    // Ensure progress bars start at 0
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = '0%';
    });
});

// ===== Console Message =====
console.log('%c Welcome to my portfolio! 🎮', 'color: #64ffda; font-size: 20px; font-weight: bold;');
console.log('%c Built with passion by İlhan Bahadır Yavaş', 'color: #8892b0; font-size: 14px;');
