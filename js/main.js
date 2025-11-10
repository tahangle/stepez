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
    initProjectHover();
});

// Animate page load
function initPageLoad() {
    const isMobile = window.innerWidth <= 768;
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

    if (isMobile) {
        // Check if we're on work/about page
        const hasActiveClass = document.querySelector('.nav__item--active');

        if (hasActiveClass) {
            // Work/About page: Show logo and icon immediately (no animation)
            gsap.set('.header__logo', { opacity: 1 });
            gsap.set('.header__menu-icon', { opacity: 1 });

            // Only animate the active nav item
            timeline.to('.nav__item--active', {
                opacity: 1,
                duration: 1.2,
                delay: 0.2
            });

            // Animate project list if exists
            const projectItems = document.querySelectorAll('.project-item');
            if (projectItems.length > 0) {
                projectItems.forEach((item, index) => {
                    timeline.to(item, {
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, '-=0.55');
                });
            }
        } else {
            // Home page: Everything fades in quickly on mobile
            // Logo and menu icon appear together
            timeline.to('.header__logo', {
                opacity: 1,
                duration: 0.6,
                delay: 0.1
            });

            timeline.to('.header__menu-icon', {
                opacity: 1,
                duration: 0.6,
                delay: 0.1
            }, 0);

            // Show all nav items and subtitle
            timeline.to('.nav__item', {
                opacity: 1,
                duration: 0.6
            }, '-=0.4');

            timeline.to('.header__subtitle', {
                opacity: 1,
                duration: 0.6
            }, '-=0.4');
        }
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

            // If on work page, animate project list sequentially
            const projectNames = document.querySelectorAll('.project-name');
            if (projectNames.length > 0) {
                projectNames.forEach((name, index) => {
                    timeline.to(name, {
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, '-=0.55'); // Tiny overlap for smooth sequential appearance
                });
            }
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
    const inactiveNavItem = document.querySelector('.nav__item--inactive');
    const isWorkOrAboutPage = document.querySelector('.nav__item--active') !== null;

    if (!menuIcon || !nav) return;

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

            if (isWorkOrAboutPage) {
                // Work/About page: show inactive nav item at 20% opacity
                nav.classList.add('is-visible');
                if (inactiveNavItem) {
                    gsap.to(inactiveNavItem, {
                        opacity: 0.2,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                }
            } else {
                // Home page: hide subtitle and show nav
                if (subtitle) {
                    gsap.to(subtitle, {
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            subtitle.classList.add('is-hidden');
                        }
                    });
                }

                gsap.to(nav, {
                    opacity: 1,
                    duration: 0.3,
                    delay: 0.15,
                    ease: 'power2.inOut',
                    onStart: () => {
                        nav.classList.add('is-visible');
                    }
                });
            }

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

            if (isWorkOrAboutPage) {
                // Work/About page: hide inactive nav item
                if (inactiveNavItem) {
                    gsap.to(inactiveNavItem, {
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            nav.classList.remove('is-visible');
                        }
                    });
                }
            } else {
                // Home page: hide nav and show subtitle
                gsap.to(nav, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        nav.classList.remove('is-visible');
                    }
                });

                if (subtitle) {
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

// Project hover animations (Desktop only)
function initProjectHover() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach((item, index) => {
        const projectName = item.querySelector('.project-name');
        const preview = item.querySelector('.project-preview');
        const category = item.querySelector('.project-category');
        const otherItems = Array.from(projectItems).filter(p => p !== item);
        const otherNames = otherItems.map(p => p.querySelector('.project-name'));

        if (!preview || !category || !projectName) {
            return;
        }

        // Create timeline for this project
        const hoverTimeline = gsap.timeline({
            paused: true,
            defaults: { ease: 'power2.out' }
        });

        // Set initial states for preview and category
        gsap.set(preview, {
            opacity: 0,
            visibility: 'hidden',
            scale: 0.9
        });

        gsap.set(category, {
            opacity: 0,
            visibility: 'hidden',
            x: 20
        });

        // Animate preview and category in, fade others (current name stays at 1)
        hoverTimeline
            .to(preview, {
                opacity: 1,
                visibility: 'visible',
                scale: 1,
                duration: 0.5
            }, 0)
            .to(category, {
                opacity: 1,
                visibility: 'visible',
                x: 0,
                duration: 0.5
            }, 0.1)
            .to(otherNames, {
                opacity: 0.1,
                duration: 0.4,
                ease: 'power2.inOut'
            }, 0);

        // Mouse enter on entire row
        item.addEventListener('mouseenter', () => {
            hoverTimeline.restart();
        });

        // Mouse leave from entire row
        item.addEventListener('mouseleave', () => {
            hoverTimeline.reverse();
        });
    });
}
