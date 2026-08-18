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
    'c-building': {
        title: 'Project C-Building — Co-op Isometric Action Roguelite',
        role: 'Systems Programmer',
        image: 'assets/img/profile.svg',
        description: 'A 4-player co-op isometric action roguelite built in Unity, spanning 5 distinct biomes and a hero roster of 8 playable characters with fully composable ability kits.',
        features: [
            'Architected a data-driven combat framework (ComposedAbilitySO pipeline) replacing hardcoded per-hero logic, letting designers compose abilities from reusable Effect/Delivery primitives while preserving hooks for bespoke hero mechanics.',
            'Built the multiplayer networking foundation on Unity Netcode for GameObjects (NGO) and UGS Relay/Lobby, including a session state machine, additive scene loading, and per-client camera isolation across 4 concurrent players.',
            'Designed a dual-camera system (fixed isometric plus a free-look "God\'s Eye" observer mode) driving the game\'s asymmetric finale, where one player becomes a stationary tactical overseer for the remaining team.',
            'Implemented a dynamic, branching music system using DSP-time-anchored bar-aligned transitions across 5 biome soundtracks and a 3-state combat/escape sequence, keeping tempo-locked layer switching free of desync.',
            'Collaborated directly with a game designer to translate evolving GDD/LDD specifications into versioned technical architecture, proactively flagging design-implementation gaps before development.'
        ],
        technologies: ['Unity', 'C#', 'Netcode for GameObjects', 'UGS Relay/Lobby', 'URP', 'ScriptableObject Composition', 'OOP']
    },
    'bubbles': {
        title: 'Bubbles — AI-Powered Turkish News Platform',
        role: 'Senior Capstone Project · Backend Lead & Scrum Master',
        image: 'assets/img/profile.svg',
        awards: [
            'Best Senior Project (System Development Award), CTIS Awards 2026',
            "Best Presentation, Startup Studio Demo Day '26"
        ],
        description: 'A production news platform that ingests Turkish news feeds and enriches them with AI: summarization, political and writing perspective scoring, and multilingual semantic search.',
        features: [
            "Led the team's Agile / Scrum process — bi-weekly sprints, backlog grooming and retrospectives — coordinating frontend, backend and AI/ML developers in Jira.",
            'Architected and operated the backend: containerized microservices (Docker) on Railway, PM2 background workers for RSS ingestion and AI processing, and a Redis + BullMQ job queue.',
            'Built CI/CD pipelines with GitHub Actions automating build, test and deployment; added health-check endpoints and external uptime monitoring after diagnosing a production outage.',
            'Managed MongoDB Atlas (indexing, TTL policies, performance tuning) and a Qdrant vector database powering multilingual semantic search.',
            'Integrated AI into production: a fine-tuned mBART Turkish summarizer plus political / writing perspective-score models served on Modal Labs GPUs, with LLM taggers (DeepSeek, Groq) for enrichment.'
        ],
        technologies: ['Node.js', 'Docker', 'MongoDB Atlas', 'Qdrant', 'Redis + BullMQ', 'Modal Labs (GPU)', 'GitHub Actions', 'PM2']
    },
    'bloomwake': {
        title: 'BloomWake — Browser-Based Swarm Survivor',
        role: 'Solo Developer · Published on CrazyGames',
        image: 'assets/img/profile.svg',
        description: 'A high-performance "Vampire Survivors" style bounded-swarm game for the browser, engineered so that hundreds of simultaneous on-screen entities never cost the frame budget.',
        features: [
            'Optimized rendering path that keeps hundreds of concurrent enemies on screen without frame drops.',
            'Object pooling and allocation-free hot paths through the update loop.',
            'Spatial partitioning to keep broadphase collision cost near-linear as the swarm grows.',
            'Bounded-arena wave design tuned so difficulty scales with player power rather than raw entity count.'
        ],
        technologies: ['JavaScript', 'Canvas/WebGL', 'Vector Math', 'Spatial Partitioning', 'Object Pooling']
    },
    'aerodrop': {
        title: 'AeroDrop — Physics-Based Cell-Growing Game',
        role: 'Solo Developer · Published on CrazyGames',
        image: 'assets/img/profile.svg',
        description: 'A physics-driven browser game where the player grows by absorbing mass, built around integrated water physics and a movement system whose cost scales with size.',
        features: [
            'Integrated water physics simulation driving buoyancy, drag and momentum.',
            'Mass-based "Jet Boost" movement system that trades size for acceleration.',
            'Dynamic bot AI simulation producing a populated arena without a server.',
            'Vector-math driven collision and absorption rules tuned for readable feedback.'
        ],
        technologies: ['TypeScript', 'JavaScript', 'Canvas/WebGL', 'Vector Math', 'Bot AI']
    },
    'not-enough-mana': {
        title: 'Not Enough Mana — 2D Browser Card Game',
        role: 'Solo Developer',
        image: 'assets/img/profile.svg',
        description: 'A 2D browser-based card game developed from scratch in PixiJS, with its own rendering pipeline, asset management and turn-based state logic.',
        features: [
            'Modular graphics rendering pipeline built directly on PixiJS and HTML5 Canvas.',
            'Custom asset management layer handling loading, atlases and runtime lookup.',
            'Robust turn-based game state machine covering draw, play, resolve and end-turn phases.',
            'Data-driven card definitions so new cards are content, not code.'
        ],
        technologies: ['PixiJS', 'HTML5 Canvas', 'JavaScript', 'Game State Management']
    },
    'zombie-survival': {
        title: 'Zombie Survival — Unreal Engine 5 Co-op Prototype',
        role: 'Solo Developer',
        image: 'assets/img/zombie-survival.svg',
        video: 'https://youtu.be/PsBm4uJqYyc',
        description: 'A cooperative survival loop prototype featuring round pacing, resource pressure, and health/damage feedback including screen shake, post-process effects and audio cues.',
        features: [
            'Enemy AI authored with Behavior Trees and the Environment Query System (EQS).',
            'NavMesh integration with spawn timer and aggro tuning for balanced difficulty.',
            'Scalable Blueprint systems for pickups, combat and inventory management.',
            'Level blockouts designed for player flow, choke points and sight lines.',
            'Debug tooling including on-screen counters for real-time gameplay analysis.'
        ],
        technologies: ['UE5', 'Blueprints', 'Behavior Trees', 'NavMesh', 'EQS', 'DataTables', 'Perception']
    }
};

// ===== Initialize AOS =====
document.addEventListener('DOMContentLoaded', () => {
    // AOS is loaded from a CDN; the page must still work if it fails to load.
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    
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
        'Software Engineer',
        'Game Developer',
        'Unity & Unreal Engine Developer',
        'Multiplayer Systems Programmer',
        'Backend & AI Systems Developer'
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
    
    const roleHTML = project.role ? `<p class="modal-role">${project.role}</p>` : '';
    const awardsHTML = project.awards
        ? `<ul class="modal-awards">${project.awards.map(a => `<li><i class="fas fa-trophy"></i> ${a}</li>`).join('')}</ul>`
        : '';

    modalBody.innerHTML = `
        ${videoHTML}
        <h3>${project.title}</h3>
        ${roleHTML}
        ${awardsHTML}
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
