// Homepage Slideshow

// Project images with their brightness classification
const projectImages = [
    { src: 'images/projects/Section80/Section80_1.jpg', isDark: true },
    { src: 'images/projects/AraPacis/AraPacis_1.jpg', isDark: false },
    { src: 'images/projects/DonatelloHall/DonatelloHall_1.jpeg', isDark: true },
    { src: 'images/projects/Chaumet/Chaumet_1.jpg', isDark: false },
    { src: 'images/projects/Goyard/Goyard_1.png', isDark: false },
    { src: 'images/projects/CaveMonaco/CaveMonaco_1.png', isDark: true },
    { src: 'images/projects/FondazionePrada/Prada_1.jpg', isDark: false }
];

// Shuffle array for random order
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const shuffledImages = shuffleArray(projectImages);
let currentIndex = 0;
let slideInterval = null;
let isPaused = false;

// Create image elements
const container = document.querySelector('.slideshow-container');
console.log('Container found:', container);
console.log('Creating images from:', shuffledImages);

shuffledImages.forEach((project, index) => {
    const img = document.createElement('img');
    img.src = project.src;
    img.classList.add('slideshow-image');
    img.dataset.isDark = project.isDark;
    if (index === 0) img.classList.add('active');
    container.appendChild(img);
    console.log('Added image:', img.src, 'active:', index === 0);
});

const images = document.querySelectorAll('.slideshow-image');
console.log('Total images:', images.length);

// GSAP animation for crossfade
function showNextImage() {
    if (isPaused) return;

    const current = images[currentIndex];
    const nextIndex = (currentIndex + 1) % images.length;
    const next = images[nextIndex];

    gsap.to(current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
    });

    gsap.to(next, {
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            current.classList.remove('active');
            next.classList.add('active');
        }
    });

    currentIndex = nextIndex;
}

// Start slideshow
function startSlideshow() {
    slideInterval = setInterval(showNextImage, 3000);
}

function pauseSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function resumeSlideshow() {
    if (!slideInterval && !isPaused) {
        startSlideshow();
    }
}

// Mobile menu background effect - only on homepage
if (window.innerWidth <= 768) {
    const menuIcon = document.getElementById('menuIcon');
    const menuBackground = document.getElementById('menuBackground');
    const body = document.body;

    // Use MutationObserver to watch for menu open/close
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isOpen = menuIcon.classList.contains('is-open');

                if (isOpen) {
                    // Menu just opened - show background
                    const activeImage = images[currentIndex];
                    const imageSrc = activeImage.src;
                    const isDark = activeImage.dataset.isDark === 'true';

                    // Set background image
                    menuBackground.style.backgroundImage = `url(${imageSrc})`;

                    // Add body class
                    body.classList.add('menu-open');

                    // Show background with slight delay
                    setTimeout(() => {
                        menuBackground.classList.add('active');
                    }, 50);

                    // Set text color based on image brightness
                    if (isDark) {
                        body.classList.add('dark-background');
                        body.classList.remove('light-background');
                    } else {
                        body.classList.add('light-background');
                        body.classList.remove('dark-background');
                    }

                    // Pause slideshow
                    isPaused = true;
                    pauseSlideshow();
                } else {
                    // Menu just closed - hide background
                    menuBackground.classList.remove('active');

                    // Remove classes after transition
                    setTimeout(() => {
                        body.classList.remove('menu-open', 'dark-background', 'light-background');
                    }, 300);

                    // Resume slideshow after menu closes
                    setTimeout(() => {
                        isPaused = false;
                        resumeSlideshow();
                    }, 500);
                }
            }
        });
    });

    observer.observe(menuIcon, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Start slideshow on load
startSlideshow();

// Pause on visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseSlideshow();
    } else if (!isPaused) {
        resumeSlideshow();
    }
});
