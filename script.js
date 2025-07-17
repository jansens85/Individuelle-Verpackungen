// Animation on scroll functionality
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Logo slider animation
function initLogoSlider() {
    const logos = document.querySelectorAll('.logo-item img');
    let currentIndex = 0;

    function activateNextLogo() {
        // Remove active class from all logos
        logos.forEach(logo => logo.classList.remove('active'));
        
        // Add active class to current logo
        if (logos[currentIndex]) {
            logos[currentIndex].classList.add('active');
        }
        
        currentIndex++;
        
        // Reset after showing all logos
        if (currentIndex >= logos.length) {
            setTimeout(() => {
                currentIndex = -1;
            }, 2000);
        }
    }

    // Start the animation
    setInterval(activateNextLogo, 800);
}

// Dynamic USP Section
function initDynamicUSP() {
    const uspSection = document.querySelector('.dynamic-usp');
    if (!uspSection) return;
    
    const uspIcon = document.getElementById('uspIcon');
    const uspSubtitle = document.getElementById('uspSubtitle');
    const uspTitle = document.getElementById('uspTitle');
    const uspDescription = document.getElementById('uspDescription');
    const uspIndicators = document.querySelectorAll('.indicator');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    const usps = [
        {
            icon: '📦',
            iconBg: '#3b82f6',
            title: 'Mehr als nur Verpackung',
            subtitle: 'Schaffen Sie Erlebnisse',
            description: 'Verwandeln Sie das Auspacken in einen unvergesslichen Moment',
            color: '#60a5fa'
        },
        {
            icon: '❤️',
            iconBg: '#ec4899',
            title: 'Ganz nach Ihren Wünschen',
            subtitle: '100% individuell',
            description: 'Jede Verpackung wird exakt nach Ihren Vorstellungen gefertigt',
            color: '#f472b6'
        },
        {
            icon: '👥',
            iconBg: '#22c55e',
            title: 'Persönlicher Ansprechpartner',
            subtitle: 'Betreuung von A bis Z',
            description: 'Ein fester Ansprechpartner für Ihr gesamtes Projekt',
            color: '#4ade80'
        },
        {
            icon: '⚡',
            iconBg: '#eab308',
            title: 'Alles aus einer Hand',
            subtitle: 'Komplettlösung',
            description: 'Von der Idee bis zur fertigen Verpackung - alles bei uns',
            color: '#facc15'
        },
        {
            icon: '🛡️',
            iconBg: '#a855f7',
            title: 'Bereits ab 25 Stück',
            subtitle: 'Kleine Mengen möglich',
            description: 'Auch für kleinere Projekte die perfekte Lösung',
            color: '#c084fc'
        },
        {
            icon: '⭐',
            iconBg: '#f97316',
            title: 'Premium Qualität garantiert',
            subtitle: 'Höchste Standards',
            description: 'Materialien und Verarbeitung auf Premium-Niveau',
            color: '#fb923c'
        }
    ];

    let currentUSP = 0;
    let isAnimating = false;

    function updateUSP(index) {
        if (index < 0 || index >= usps.length) return;
        if (isAnimating) return;
        
        isAnimating = true;
        const usp = usps[index];
        
        // Smooth transition for content updates
        uspIcon.style.transition = 'all 0.7s ease';
        uspSubtitle.style.transition = 'all 0.7s ease';
        uspTitle.style.transition = 'all 0.7s ease';
        uspDescription.style.transition = 'all 0.7s ease';
        
        // Update content with smooth transitions
        uspIcon.textContent = usp.icon;
        uspIcon.style.background = usp.iconBg;
        uspIcon.style.transform = 'scale(1.1)';
        
        uspSubtitle.textContent = usp.subtitle;
        uspSubtitle.style.color = usp.color;
        uspTitle.textContent = usp.title;
        uspDescription.textContent = usp.description;
        
        // Update indicators
        uspIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        // Update progress
        const progressWidth = ((index + 1) / usps.length) * 100;
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.setProperty('--progress-width', `${progressWidth}%`);
        }
        progressText.textContent = `${index + 1} von ${usps.length} USPs`;
        
        currentUSP = index;
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 700);
    }

    function handleScroll() {
        const rect = uspSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if section is in viewport
        const isInViewport = rect.top <= 100 && rect.bottom >= windowHeight - 100;
        
        if (isInViewport) {
            // Calculate progress based on how far we've scrolled through the section
            const scrolledDistance = Math.abs(rect.top);
            const totalScrollDistance = rect.height - windowHeight;
            const progress = Math.max(0, Math.min(scrolledDistance / totalScrollDistance, 1));
            
            // Calculate which USP should be active based on scroll progress
            const uspIndex = Math.floor(progress * usps.length);
            const clampedIndex = Math.max(0, Math.min(usps.length - 1, uspIndex));
            
            if (clampedIndex !== currentUSP) {
                updateUSP(clampedIndex);
            }
            
            // Hide scroll indicator when scrolling starts
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator && progress > 0.1) {
                scrollIndicator.style.opacity = '0';
            } else if (scrollIndicator && progress <= 0.1) {
                scrollIndicator.style.opacity = '1';
            }
        }
    }

    // Initialize with first USP
    updateUSP(0);
    
    // Add scroll listener with throttling for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Timeline animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.querySelector('.timeline-line');
    const timelineContainer = document.querySelector('.timeline-container');
    
    if (!timelineContainer || !timelineLine) return;
    
    let animatedItems = new Set();
    
    let hasLineAnimated = false;
    
    // Create intersection observer for timeline line
    const lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasLineAnimated) {
                timelineLine.classList.add('visible');
                setTimeout(() => {
                    timelineLine.classList.add('animate');
                }, 200);
                hasLineAnimated = true;
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    lineObserver.observe(timelineContainer);
    
    // Create intersection observer for timeline items
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const dot = item.querySelector('.timeline-dot');
                const card = item.querySelector('.timeline-card');
                const isLeft = item.classList.contains('left');
                
                // Animate dot
                setTimeout(() => {
                    if (dot) dot.classList.add('visible');
                }, index * 200);
                
                // Animate card
                setTimeout(() => {
                    if (card) {
                        card.classList.add('visible');
                        if (isLeft) card.classList.add('left');
                        else card.classList.add('right');
                    }
                }, (index * 200) + 300);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all timeline items
    timelineItems.forEach(item => {
        itemObserver.observe(item);
    });
}

// Alternative scroll-based timeline animation
function initScrollBasedTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.querySelector('.timeline-line');
    const timelineContainer = document.querySelector('.timeline-container');
    
    if (!timelineContainer || !timelineLine) return;
    
    function handleTimelineScroll() {
        const containerRect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Show timeline line when container comes into view
        if (containerRect.top < windowHeight && containerRect.bottom > 0) {
            timelineLine.classList.add('visible');
            
            // Calculate line animation progress
            const scrollProgress = Math.max(0, Math.min(1, 
                (windowHeight - containerRect.top) / (windowHeight + containerRect.height * 0.5)
            ));
            
            if (scrollProgress > 0.1) {
                timelineLine.classList.add('animate');
            }
        }
        
        // Animate timeline items
        timelineItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const isVisible = itemRect.top < windowHeight * 0.8 && itemRect.bottom > 0;
            
            if (isVisible) {
                const dot = item.querySelector('.timeline-dot');
                const card = item.querySelector('.timeline-card');
                const isLeft = item.classList.contains('left');
                
                setTimeout(() => {
                    if (dot) dot.classList.add('visible');
                }, index * 100);
                
                setTimeout(() => {
                    if (card) {
                        card.classList.add('visible');
                        if (isLeft) card.classList.add('left');
                        else card.classList.add('right');
                    }
                }, (index * 100) + 200);
            }
        });
    }
    
    // Throttled scroll handler
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleTimelineScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Initial check
    handleTimelineScroll();
    window.addEventListener('scroll', requestTick);
}

// Einfache Scroll-Animationen
function initScrollAnimations() {
    console.log('Initialisiere Scroll-Animationen...');
    
    // Alle Elemente mit Animation-Klassen finden
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .animate-scale, .stagger-children');
    console.log('Gefundene Elemente:', animatedElements.length);
    
    // Intersection Observer erstellen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Element wird sichtbar:', entry.target.className);
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });
    
    // Alle Elemente beobachten
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth scrolling für Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Progress Bar Styles
function addProgressStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .progress-fill::after {
            width: var(--progress-width, 16.67%);
        }
    `;
    document.head.appendChild(style);
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLogoSlider();
    initDynamicUSP();
    initTimelineAnimations();
    initScrollAnimations();
    initSmoothScrolling();
    addProgressStyles();
});

// Handle window resize
window.addEventListener('resize', function() {
    // Recalculate any size-dependent animations if needed
});
