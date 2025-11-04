// Main JavaScript file

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Mobile menu state
let menuIsOpen = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initPageLoad();
    initMobileMenu();
    initAnimations();
});

// Animate page load
function initPageLoad() {
    const isMobile = window.innerWidth <= 768;
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

    if (isMobile) {
        // Mobile: Everything fades in
        // Logo and menu icon appear together
        timeline.to('.header__logo', {
            opacity: 1,
            duration: 1.2,
            delay: 0.2
        });

        timeline.to('.header__menu-icon', {
            opacity: 1,
            duration: 1.2,
            delay: 0.2
        }, 0);

        timeline.to('.nav__item', {
            opacity: 1,
            duration: 1.2
        }, '-=0.8');

        timeline.to('.header__subtitle', {
            opacity: 1,
            duration: 1.2
        }, '-=0.8');
    } else {
        // Desktop: Different behavior
        const hasActiveClass = document.querySelector('.nav__item--active');

        if (hasActiveClass) {
            // Work or About page
            // Logo is already visible, no animation needed

            // Active page: dramatic fade-in
            timeline.to('.nav__item--active', {
                opacity: 1,
                duration: 1.2,
                delay: 0.2
            });

            // Inactive nav items: smooth transition to 0.2
            timeline.to('.nav__item--inactive', {
                opacity: 0.2,
                duration: 0.8,
                ease: 'power2.inOut'
            }, '-=0.8');

            // Subtitle (Lighting Designer): smooth transition to 0.2
            timeline.to('.header__subtitle--inactive', {
                opacity: 0.2,
                duration: 0.8,
                ease: 'power2.inOut'
            }, '-=0.8');
        } else {
            // Home page - fade in all nav items
            timeline.to('.nav__item', {
                opacity: 1,
                duration: 1.2,
                delay: 0.2
            });
        }
    }
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const menuIcon = document.getElementById('menuIcon');
    const nav = document.querySelector('.header__nav');
    const subtitle = document.getElementById('subtitle');

    if (!menuIcon || !nav || !subtitle) return;

    menuIcon.addEventListener('click', toggleMenu);

    function toggleMenu() {
        menuIsOpen = !menuIsOpen;

        if (menuIsOpen) {
            // Open menu
            menuIcon.classList.add('is-open');

            // Animate menu icon rotation with GSAP
            gsap.to('.menu-icon__line--1', {
                rotation: 45,
                duration: 0.3,
                ease: 'power2.inOut'
            });
            gsap.to('.menu-icon__line--2', {
                rotation: -45,
                duration: 0.3,
                ease: 'power2.inOut'
            });

            // Hide subtitle and show nav
            gsap.to(subtitle, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut',
                onComplete: () => {
                    subtitle.classList.add('is-hidden');
                }
            });

            gsap.to(nav, {
                opacity: 1,
                duration: 0.3,
                delay: 0.15,
                ease: 'power2.inOut',
                onStart: () => {
                    nav.classList.add('is-visible');
                }
            });

        } else {
            // Close menu
            menuIcon.classList.remove('is-open');

            // Animate menu icon back to plus
            gsap.to('.menu-icon__line--1', {
                rotation: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            });
            gsap.to('.menu-icon__line--2', {
                rotation: 90,
                duration: 0.3,
                ease: 'power2.inOut'
            });

            // Hide nav and show subtitle
            gsap.to(nav, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut',
                onComplete: () => {
                    nav.classList.remove('is-visible');
                }
            });

            gsap.to(subtitle, {
                opacity: 1,
                duration: 0.3,
                delay: 0.15,
                ease: 'power2.inOut',
                onStart: () => {
                    subtitle.classList.remove('is-hidden');
                }
            });
        }
    }
}

// Initialize GSAP animations
function initAnimations() {
    // Fade in elements on scroll
    gsap.utils.toArray('.fade-in').forEach((element) => {
        gsap.from(element, {
            opacity: 0,
            y: 30,
            duration: 1,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Slide in from left
    gsap.utils.toArray('.slide-in-left').forEach((element) => {
        gsap.from(element, {
            opacity: 0,
            x: -50,
            duration: 1,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Slide in from right
    gsap.utils.toArray('.slide-in-right').forEach((element) => {
        gsap.from(element, {
            opacity: 0,
            x: 50,
            duration: 1,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Custom animation helper functions
function animateIn(element, options = {}) {
    const defaults = {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out'
    };

    return gsap.from(element, { ...defaults, ...options });
}

function animateOut(element, options = {}) {
    const defaults = {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power2.in'
    };

    return gsap.to(element, { ...defaults, ...options });
}
