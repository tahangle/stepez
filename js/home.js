// Homepage Slideshow and Grid

// All project images
const allProjectImages = [
    'images/projects/Section80/Section80_1.jpg',
    'images/projects/Section80/Section80_2.jpg',
    'images/projects/Section80/Section80_3.jpg',
    'images/projects/AraPacis/AraPacis_1.jpg',
    'images/projects/AraPacis/AraPacis_2.jpg',
    'images/projects/AraPacis/AraPacis_3.jpg',
    'images/projects/DonatelloHall/DonatelloHall_1.jpeg',
    'images/projects/DonatelloHall/DonatelloHall_2.jpeg',
    'images/projects/DonatelloHall/DonatelloHall_3.jpg',
    'images/projects/Chaumet/Chaumet_1.jpg',
    'images/projects/Chaumet/Chaumet_2.jpg',
    'images/projects/Chaumet/Chaumet_3.jpg',
    'images/projects/Goyard/Goyard_1.png',
    'images/projects/Goyard/Goyard_2.png',
    'images/projects/CaveMonaco/CaveMonaco_1.png',
    'images/projects/CaveMonaco/CaveMonaco_2.jpg',
    'images/projects/FondazionePrada/Prada_1.jpg',
    'images/projects/FondazionePrada/Prada_2.jpg',
    'images/projects/FondazionePrada/Prada_3.jpg'
];

// Project images for mobile slideshow with their brightness classification
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

shuffledImages.forEach((project, index) => {
    const img = document.createElement('img');
    img.src = project.src;
    img.classList.add('slideshow-image');
    img.dataset.isDark = project.isDark;
    if (index === 0) img.classList.add('active');
    container.appendChild(img);
});

const images = document.querySelectorAll('.slideshow-image');

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

// Desktop grid of images
if (window.innerWidth > 768) {
    const gridContainer = document.getElementById('imageGridBackground');
    const gridSize = 48; // 8 columns x 6 rows

    // Function to get random crop position
    function getRandomCrop() {
        // Random position between -50% and 0% (since image is 200% size)
        return {
            top: `${Math.random() * -100}%`,
            left: `${Math.random() * -100}%`
        };
    }

    // Create grid items
    for (let i = 0; i < gridSize; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        // Get random subset of images for this grid item (no duplicates across the grid)
        const itemImages = shuffleArray([...allProjectImages]).slice(0, 8);

        itemImages.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;

            // Random crop position
            const crop = getRandomCrop();
            img.style.top = crop.top;
            img.style.left = crop.left;

            if (index === 0) img.classList.add('active');
            gridItem.appendChild(img);
        });

        gridContainer.appendChild(gridItem);
    }

    // Animate each grid item independently with new random crop on each change
    function animateGridItem(gridItem, delay) {
        const images = gridItem.querySelectorAll('img');
        let currentIdx = 0;

        setInterval(() => {
            const current = images[currentIdx];
            const nextIdx = (currentIdx + 1) % images.length;
            const next = images[nextIdx];

            // Apply new random crop to next image
            const crop = getRandomCrop();
            next.style.top = crop.top;
            next.style.left = crop.left;

            current.classList.remove('active');
            next.classList.add('active');

            currentIdx = nextIdx;
        }, 4000 + delay);
    }

    // Start animations with random delays
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
        const randomDelay = Math.random() * 3000; // 0-3s random delay
        setTimeout(() => {
            animateGridItem(item, 0);
        }, randomDelay);
    });
} else {
    // Mobile: Start slideshow on load
    startSlideshow();

    // Pause on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseSlideshow();
        } else if (!isPaused) {
            resumeSlideshow();
        }
    });
}
