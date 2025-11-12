// Project Page Animations

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobile: animate images on scroll
        initMobileScrollAnimations();
    } else {
        // Desktop: smooth scroll and gallery features
        initSmoothGalleryScroll();
        initHeaderSwap();
        initGalleryToggle();
    }

    // Keyboard navigation for all devices
    initKeyboardNavigation();

    // Re-initialize on resize if crossing breakpoint
    let wasDesktop = window.innerWidth > 768;
    window.addEventListener('resize', () => {
        const isDesktop = window.innerWidth > 768;
        if (isDesktop !== wasDesktop) {
            wasDesktop = isDesktop;
            if (isDesktop) {
                initSmoothGalleryScroll();
                initHeaderSwap();
                initGalleryToggle();
            }
        }
    });
});

function initSmoothGalleryScroll() {
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (!galleryScroll) return;

    let scrollTarget = 0;
    let currentScroll = 0;
    let animationId = null;

    // Listen to wheel events on the gallery
    const handleWheel = (e) => {
        // Skip smooth scroll if in fullview mode
        if (galleryScroll.classList.contains('fullview')) {
            return;
        }

        e.preventDefault();
        scrollTarget += e.deltaY * 0.5;

        // Clamp scroll target
        const maxScroll = galleryScroll.scrollHeight - galleryScroll.clientHeight;
        scrollTarget = Math.max(0, Math.min(scrollTarget, maxScroll));
    };

    galleryScroll.addEventListener('wheel', handleWheel, { passive: false });

    // Smooth scroll animation
    function smoothScroll() {
        if (!galleryScroll.classList.contains('fullview')) {
            currentScroll += (scrollTarget - currentScroll) * 0.1;
            galleryScroll.scrollTop = currentScroll;
        }
        animationId = requestAnimationFrame(smoothScroll);
    }

    smoothScroll();
}

function initHeaderSwap() {
    const galleryScroll = document.querySelector('.gallery-scroll');
    const logo = document.querySelector('.header__logo');
    const subtitle = document.querySelector('.header__subtitle');
    const projectNavHeader = document.getElementById('projectNavHeader');

    if (!galleryScroll || !logo || !subtitle || !projectNavHeader) return;

    // Desktop only - on mobile, logo always stays visible
    if (window.innerWidth <= 768) {
        // Ensure logo is always visible on mobile
        gsap.set(logo, { opacity: 1 });
        return;
    }

    galleryScroll.addEventListener('scroll', () => {
        const scrollPosition = galleryScroll.scrollTop;
        const scrollHeight = galleryScroll.scrollHeight;
        const clientHeight = galleryScroll.clientHeight;

        // Check if user has reached the end of the gallery (within 50px)
        const isAtEnd = scrollHeight - scrollPosition - clientHeight < 50;

        if (isAtEnd) {
            // Hide logo and subtitle
            gsap.to([logo, subtitle], {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Show project navigation
            projectNavHeader.classList.add('is-visible');
        } else {
            // Show logo and subtitle
            gsap.to([logo, subtitle], {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Hide project navigation
            projectNavHeader.classList.remove('is-visible');
        }
    });
}

function initGalleryToggle() {
    const galleryScroll = document.querySelector('.gallery-scroll');
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    if (!galleryScroll || !toggleBtns.length) return;

    // Add underline elements to buttons
    toggleBtns.forEach(btn => {
        const underline = document.createElement('div');
        underline.className = 'toggle-btn-underline';
        btn.appendChild(underline);

        // GSAP hover animation
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                gsap.to(underline, {
                    scaleX: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                gsap.to(underline, {
                    scaleX: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });

    const exitFullView = () => {
        galleryScroll.classList.remove('fullview');
        // Update button states
        toggleBtns.forEach(b => {
            b.classList.remove('active');
            if (b.dataset.view === 'vertical') {
                b.classList.add('active');
            }
        });
        // Remove duplicated images
        const duplicates = galleryScroll.querySelectorAll('.image-wrapper-duplicate');
        duplicates.forEach(dup => dup.remove());
        // Reset scroll position
        galleryScroll.scrollTop = 0;
    };

    const enterFullView = () => {
        galleryScroll.classList.add('fullview');

        // Duplicate all images for infinite scroll
        const imageWrappers = galleryScroll.querySelectorAll('.image-wrapper');
        imageWrappers.forEach(wrapper => {
            const clone = wrapper.cloneNode(true);
            clone.classList.add('image-wrapper-duplicate');
            galleryScroll.appendChild(clone);
        });

        // Reset scroll position
        galleryScroll.scrollLeft = 0;

        // Setup infinite scroll
        setupInfiniteScroll();
    };

    const setupInfiniteScroll = () => {
        const imageWrappers = galleryScroll.querySelectorAll('.image-wrapper:not(.image-wrapper-duplicate)');
        const totalWidth = Array.from(imageWrappers).reduce((sum, wrapper) => {
            return sum + wrapper.offsetWidth + 60; // 60px gap
        }, 0);

        galleryScroll.addEventListener('scroll', () => {
            if (!galleryScroll.classList.contains('fullview')) return;

            const scrollLeft = galleryScroll.scrollLeft;
            const maxScroll = totalWidth;

            // When scrolled past original set, jump back to start
            if (scrollLeft >= maxScroll) {
                galleryScroll.scrollLeft = scrollLeft - maxScroll;
            }
        });
    };

    // Main toggle buttons
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Update active state
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle gallery mode
            if (view === 'fullview') {
                enterFullView();
            } else {
                exitFullView();
            }
        });
    });

    // Allow escape key to exit fullview
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galleryScroll.classList.contains('fullview')) {
            exitFullView();
        }
    });

    // Convert vertical scroll to horizontal in fullview mode
    galleryScroll.addEventListener('wheel', (e) => {
        if (galleryScroll.classList.contains('fullview')) {
            e.preventDefault();
            galleryScroll.scrollLeft += e.deltaY;
        }
    }, { passive: false });
}

// Mobile scroll animations
function initMobileScrollAnimations() {
    const imageWrappers = document.querySelectorAll('.gallery-scroll .image-wrapper');

    if (!imageWrappers.length) return;

    // Set initial state for all images
    gsap.set(imageWrappers, {
        opacity: 0,
        y: 30,
        scale: 0.95
    });

    // Animate each image as it enters viewport
    imageWrappers.forEach((wrapper, index) => {
        gsap.to(wrapper, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: wrapper,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Keyboard navigation between projects
function initKeyboardNavigation() {
    const projectNav = document.getElementById('projectNavHeader');
    if (!projectNav) return;

    const links = projectNav.querySelectorAll('.project-nav-header__link');
    const prevLink = links[0]; // Left arrow
    const nextLink = links[1]; // Right arrow

    document.addEventListener('keydown', (e) => {
        // Only navigate if not typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowLeft' && prevLink) {
            window.location.href = prevLink.href;
        } else if (e.key === 'ArrowRight' && nextLink) {
            window.location.href = nextLink.href;
        }
    });
}
