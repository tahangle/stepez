// Homepage Slideshow and Grid

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = 'RjS5pFd0O1b89DzmP7xXe8xB0FV4eW_2SZUY8M_T3eA';
const UNSPLASH_TOPICS = ['lighting', 'light-design', 'architecture-lighting', 'interior-lighting'];

// Cache for Unsplash images
let unsplashImageCache = [];
let cacheIndex = 0;

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

// Fetch images from Unsplash
async function fetchUnsplashImages(count = 30) {
    try {
        const query = 'lighting';
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`,
            {
                headers: {
                    'Accept-Version': 'v1'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched images:', data.length);
        return data.map(photo => photo.urls.regular);
    } catch (error) {
        console.error('Error fetching Unsplash images:', error);
        // Fallback to project images if API fails
        return [];
    }
}

// Desktop grid of images
if (window.innerWidth > 768) {
    const gridContainer = document.getElementById('imageGridBackground');
    const gridSize = 32; // 8 columns x 4 rows (removed first and last rows)

    // Function to get random zoom and position
    function getRandomZoom() {
        // Random zoom between 150% and 220%
        const scale = 1.5 + Math.random() * 0.7;
        // Center position with slight random offset
        const offsetX = (Math.random() - 0.5) * 40; // -20% to +20%
        const offsetY = (Math.random() - 0.5) * 40;

        return {
            transform: `translate(${offsetX}%, ${offsetY}%) scale(${scale})`,
            transformOrigin: 'center center'
        };
    }

    // Function to get next unique image from cache
    async function getNextImage() {
        if (cacheIndex >= unsplashImageCache.length) {
            // Fetch more images when cache is depleted
            const newImages = await fetchUnsplashImages(50);
            unsplashImageCache.push(...newImages);
        }
        return unsplashImageCache[cacheIndex++];
    }

    // Initialize grid
    async function initGrid() {
        try {
            // Fetch initial batch of images - do multiple smaller requests
            console.log('Fetching initial images...');
            const batch1 = await fetchUnsplashImages(30);
            const batch2 = await fetchUnsplashImages(30);
            unsplashImageCache = [...batch1, ...batch2];

            console.log('Total images fetched:', unsplashImageCache.length);

            if (unsplashImageCache.length === 0) {
                console.error('No images fetched from Unsplash');
                return;
            }

            // Create grid items with unique images
            for (let i = 0; i < gridSize; i++) {
                const gridItem = document.createElement('div');
                gridItem.className = 'grid-item';

                // Each cell gets one unique image to start
                const img = document.createElement('img');
                const imageUrl = await getNextImage();

                if (!imageUrl) {
                    console.error('No image URL available for grid item', i);
                    continue;
                }

                img.src = imageUrl;
                img.crossOrigin = 'anonymous';

                // Random zoom
                const zoom = getRandomZoom();
                img.style.transform = zoom.transform;
                img.style.transformOrigin = zoom.transformOrigin;
                img.classList.add('active');

                gridItem.appendChild(img);
                gridContainer.appendChild(gridItem);
            }

            console.log('Grid initialized with', gridSize, 'items');
        } catch (error) {
            console.error('Error initializing grid:', error);
        }

        // Animate each grid item independently with new random zoom on each change
        function animateGridItem(gridItem, delay) {
            setInterval(async () => {
                const current = gridItem.querySelector('img.active');

                // Create new image element
                const next = document.createElement('img');
                next.src = await getNextImage();

                // Apply random zoom
                const zoom = getRandomZoom();
                next.style.transform = zoom.transform;
                next.style.transformOrigin = zoom.transformOrigin;

                gridItem.appendChild(next);

                // Fade transition
                setTimeout(() => {
                    next.classList.add('active');
                    current.classList.remove('active');

                    // Remove old image after transition
                    setTimeout(() => {
                        current.remove();
                    }, 800);
                }, 50);
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
    }

    // Initialize the grid
    initGrid();
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
