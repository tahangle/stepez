// Loading Screen Animation
(function() {
    const loader = document.getElementById('loader');
    const loaderName = document.querySelector('.loader__name');
    const loaderPercentage = document.querySelector('.loader__percentage');
    const imagesContainer = document.querySelector('.loader__images');

    // Get header elements that will be revealed
    const headerLogo = document.querySelector('.header__logo h1');
    const headerSubtitle = document.querySelector('.header__subtitle h1');

    // Project images for loader - mix from different projects
    const loaderImages = [
        'images/projects/Section80/Section80_1.jpg',
        'images/projects/AraPacis/AraPacis_1.jpg',
        'images/projects/DonatelloHall/DonatelloHall_1.jpeg',
        'images/projects/Chaumet/Chaumet_1.jpg',
        'images/projects/CaveMonaco/CaveMonaco_1.png',
        'images/projects/FondazionePrada/Prada_1.jpg',
        'images/projects/Section80/Section80_2.jpg',
        'images/projects/AraPacis/AraPacis_2.jpg',
        'images/projects/DonatelloHall/DonatelloHall_2.jpeg',
        'images/projects/Chaumet/Chaumet_2.jpg',
        'images/projects/CaveMonaco/CaveMonaco_2.jpg',
        'images/projects/FondazionePrada/Prada_2.jpg',
        'images/projects/Section80/Section80_3.jpg',
        'images/projects/AraPacis/AraPacis_3.jpg',
        'images/projects/DonatelloHall/DonatelloHall_3.jpg',
        'images/projects/Chaumet/Chaumet_3.jpg',
        'images/projects/CaveMonaco/CaveMonaco_3.jpg',
        'images/projects/FondazionePrada/Prada_3.jpg'
    ];

    // Create image elements and add to container
    const imageElements = [];
    loaderImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('loader__image');
        // Start each image below viewport, staggered
        // Using y instead of yPercent since images are centered with transform
        const spacing = 600; // Space between images in pixels
        gsap.set(img, {
            y: (index * spacing) + 1000, // Start below viewport
            x: '-50%', // Maintain horizontal centering
            opacity: 1
        });
        imagesContainer.appendChild(img);
        imageElements.push(img);
    });

    // Track loading progress
    let currentProgress = 0;
    let targetProgress = 0;
    let loadedResources = 0;
    const totalResources = loaderImages.length;

    // Minimum loading time - longer for smoother animation
    const minLoadTime = 4000;
    const startTime = Date.now();

    // Smooth counter animation using GSAP
    const counter = { value: 0 };
    let hasStartedCounting = false;
    let imageTimeline = null;

    function updateCounter(target) {
        // On first update, switch from "Lighting Designer" to "0%"
        if (!hasStartedCounting) {
            gsap.to(loaderPercentage, {
                opacity: 0,
                duration: 0.3,
                onComplete: function() {
                    loaderPercentage.textContent = '0%';
                    gsap.to(loaderPercentage, { opacity: 1, duration: 0.3 });
                }
            });
            hasStartedCounting = true;

            // Start synchronized image animation
            startImageAnimation();
        }

        targetProgress = target;
        gsap.to(counter, {
            value: target,
            duration: 1.2,
            ease: 'power1.inOut',
            onUpdate: function() {
                loaderPercentage.textContent = Math.round(counter.value) + '%';
            }
        });
    }

    // Accelerating image scroll animation
    function startImageAnimation() {
        // Kill any existing timeline
        if (imageTimeline) {
            imageTimeline.kill();
        }

        // Calculate total distance to scroll
        const spacing = 600;
        const totalDistance = spacing * imageElements.length + 1000;

        // Create timeline with accelerating speed that syncs with percentage
        imageTimeline = gsap.timeline();

        imageElements.forEach((img, index) => {
            const startY = (index * spacing) + 1000;

            // Animate with power1.in easing to accelerate gradually
            imageTimeline.to(img, {
                y: -totalDistance,
                duration: minLoadTime / 1000,
                ease: 'power1.in', // Accelerates as it goes
                onComplete: function() {
                    // Loop: reset position and restart animation
                    gsap.set(img, { y: startY });
                    gsap.to(img, {
                        y: -totalDistance,
                        duration: minLoadTime / 1000,
                        ease: 'power1.in',
                        repeat: -1,
                        repeatRefresh: true
                    });
                }
            }, 0);
        });
    }

    // Preload images
    loaderImages.forEach((src) => {
        const img = new Image();
        img.onload = img.onerror = () => {
            loadedResources++;
            const loadProgress = (loadedResources / totalResources) * 100;
            updateCounter(loadProgress);

            // Check if all resources are loaded
            if (loadedResources === totalResources) {
                finishLoading();
            }
        };
        img.src = src;
    });

    // Finish loading and transition to main site
    function finishLoading() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);

        setTimeout(() => {
            // Ensure we're at 100%
            updateCounter(100);

            // Wait briefly at 100% before animating out
            setTimeout(() => {
                const timeline = gsap.timeline({
                    onComplete: () => {
                        loader.remove();
                    }
                });

                // Animate loader elements to their final positions with blur transition
                timeline
                    // First, blur the images
                    .to(imageElements, {
                        filter: 'grayscale(100%) blur(30px)',
                        duration: 0.5,
                        ease: 'power2.inOut'
                    }, 0)
                    // Then fade them out
                    .to(imageElements, {
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.inOut'
                    }, 0.3)
                    // Blur the entire loader background
                    .to(loader, {
                        backdropFilter: 'blur(30px)',
                        webkitBackdropFilter: 'blur(30px)',
                        duration: 0.6,
                        ease: 'power2.inOut'
                    }, 0.2)
                    // Start changing text from "100%" to "Lighting Designer"
                    .to(loaderPercentage, {
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.inOut',
                        onComplete: function() {
                            loaderPercentage.textContent = 'Lighting Designer';
                        }
                    }, 0.5)
                    .to(loaderPercentage, {
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    }, 0.8)
                    // Move name to bottom left (header logo position)
                    .to(loaderName, {
                        x: () => {
                            const loaderRect = loaderName.getBoundingClientRect();
                            const headerRect = headerLogo.getBoundingClientRect();
                            return headerRect.left - loaderRect.left;
                        },
                        y: () => {
                            const loaderRect = loaderName.getBoundingClientRect();
                            const headerRect = headerLogo.getBoundingClientRect();
                            return headerRect.top - loaderRect.top;
                        },
                        color: '#000000',
                        duration: 1.2,
                        ease: 'power3.inOut'
                    }, 0.8)
                    // Move percentage to bottom right (subtitle position)
                    .to(loaderPercentage, {
                        x: () => {
                            const loaderRect = loaderPercentage.getBoundingClientRect();
                            const headerRect = headerSubtitle.getBoundingClientRect();
                            return headerRect.left - loaderRect.left;
                        },
                        y: () => {
                            const loaderRect = loaderPercentage.getBoundingClientRect();
                            const headerRect = headerSubtitle.getBoundingClientRect();
                            return headerRect.top - loaderRect.top;
                        },
                        color: '#000000',
                        duration: 1.2,
                        ease: 'power3.inOut'
                    }, 0.8)
                    // Gradually fade background from black to white
                    .to(loader, {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        duration: 0.6,
                        ease: 'power2.inOut'
                    }, 0.8)
                    .to(loader, {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        duration: 0.6,
                        ease: 'power2.inOut'
                    }, 1.4)
                    // Remove blur and fade out completely
                    .to(loader, {
                        backdropFilter: 'blur(0px)',
                        webkitBackdropFilter: 'blur(0px)',
                        backgroundColor: '#ffffff',
                        duration: 0.5,
                        ease: 'power2.inOut'
                    }, 2.0)
                    // Final fade out
                    .to(loader, {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.inOut'
                    }, 2.4);

            }, 400);
        }, remainingTime);
    }

    // Fallback: force finish after 10 seconds
    setTimeout(() => {
        if (loader && loader.parentNode) {
            updateCounter(100);
            finishLoading();
        }
    }, 10000);
})();
