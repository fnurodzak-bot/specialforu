/* =========================================================
   UNTIL THE STARS FORGET TO SHINE
   V4 — CINEMATIC LOVE STORY
   SCRIPT.JS — PART 1
========================================================= */

"use strict";

/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   GLOBAL STATE
========================================================= */

const state = {
    musicPlaying: false,
    menuOpen: false,
    activePhoto: 0,
    currentYear: new Date().getFullYear()
};


/* =========================================================
   LOADER
========================================================= */

const loader = $("#loader");
const loaderProgress = $("#loader-progress");
const loaderStatus = $("#loader-status");

const loadingMessages = [
    "Preparing memories...",
    "Gathering little moments...",
    "Finding our favorite stars...",
    "Almost there..."
];

let loadValue = 0;
let loadingMessageIndex = 0;

const updateLoader = () => {

    if (!loaderProgress) return;

    loadValue += Math.random() * 7 + 2;

    if (loadValue > 100) {
        loadValue = 100;
    }

    loaderProgress.style.width = `${loadValue}%`;

    if (
        loadValue > 25 &&
        loadingMessageIndex === 0
    ) {

        loadingMessageIndex = 1;

        if (loaderStatus) {
            loaderStatus.textContent =
                loadingMessages[1];
        }

    }

    if (
        loadValue > 55 &&
        loadingMessageIndex === 1
    ) {

        loadingMessageIndex = 2;

        if (loaderStatus) {
            loaderStatus.textContent =
                loadingMessages[2];
        }

    }

    if (
        loadValue > 80 &&
        loadingMessageIndex === 2
    ) {

        loadingMessageIndex = 3;

        if (loaderStatus) {
            loaderStatus.textContent =
                loadingMessages[3];
        }

    }

    if (loadValue >= 100) {

        clearInterval(loaderTimer);

        setTimeout(hideLoader, 500);
    }
};

const hideLoader = () => {

    if (!loader) return;

    loader.classList.add("hide");

    document.body.classList.add("loaded");

    setTimeout(() => {

        loader.setAttribute(
            "aria-hidden",
            "true"
        );

    }, 1000);
};

const loaderTimer = setInterval(
    updateLoader,
    90
);


/* =========================================================
   FALLBACK LOADER
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (loadValue < 100) {

            loadValue = 100;

            if (loaderProgress) {
                loaderProgress.style.width = "100%";
            }

            if (loaderStatus) {
                loaderStatus.textContent =
                    "Ready.";
            }

            clearInterval(loaderTimer);

            setTimeout(hideLoader, 400);

        }

    }, 1200);

});


/* =========================================================
   OPENING → MAIN CONTENT
========================================================= */

const enterStory = $("#enter-story");
const heroSection = $("#hero");

enterStory?.addEventListener("click", () => {

    heroSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


/* =========================================================
   BEGIN JOURNEY
========================================================= */

const beginJourney = $("#begin-journey");
const timelineSection = $("#timeline");

beginJourney?.addEventListener("click", () => {

    timelineSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


/* =========================================================
   NAVIGATION
========================================================= */

const siteHeader = $("#site-header");
const navMenu = $("#nav-menu");
const menuToggle = $("#menu-toggle");
const navLinks = $$("#nav-menu a");

const closeMenu = () => {

    if (!navMenu || !menuToggle) return;

    navMenu.classList.remove("open");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    state.menuOpen = false;
};

const toggleMenu = () => {

    if (!navMenu || !menuToggle) return;

    state.menuOpen = !state.menuOpen;

    navMenu.classList.toggle(
        "open",
        state.menuOpen
    );

    menuToggle.setAttribute(
        "aria-expanded",
        String(state.menuOpen)
    );
};

menuToggle?.addEventListener(
    "click",
    toggleMenu
);

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        closeMenu();

    });

});


/* =========================================================
   HEADER SCROLL BEHAVIOR
========================================================= */

let lastScrollY = window.scrollY;
let scrollTicking = false;

const handleHeaderScroll = () => {

    const currentY = window.scrollY;

    if (!siteHeader) return;

    if (currentY > 60) {

        siteHeader.classList.add("scrolled");

    } else {

        siteHeader.classList.remove("scrolled");

    }

    lastScrollY = currentY;

    scrollTicking = false;
};

window.addEventListener(
    "scroll",
    () => {

        if (!scrollTicking) {

            window.requestAnimationFrame(
                handleHeaderScroll
            );

            scrollTicking = true;
        }

    },
    { passive: true }
);


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener("click", (event) => {

    if (!state.menuOpen) return;

    const clickedInsideMenu =
        navMenu?.contains(event.target);

    const clickedToggle =
        menuToggle?.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
    }

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeMenu();

    }

});


/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

$$('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }

        const target =
            $(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   MUSIC PLAYER
========================================================= */

const backgroundMusic =
    $("#background-music");

const musicToggle =
    $("#music-toggle");

const sceneMusicToggle =
    $("#scene-music-toggle");

const musicProgressFill =
    $("#music-progress-fill");


const setMusicButtonState = (playing) => {

    state.musicPlaying = playing;

    if (musicToggle) {

        musicToggle.classList.toggle(
            "playing",
            playing
        );

        musicToggle.setAttribute(
            "aria-label",
            playing
                ? "Pause music"
                : "Play music"
        );

    }

    if (sceneMusicToggle) {

        sceneMusicToggle.textContent =
            playing ? "❚❚" : "▶";

        sceneMusicToggle.setAttribute(
            "aria-label",
            playing
                ? "Pause Risk It All"
                : "Play Risk It All"
        );

    }

};


const playMusic = async () => {

    if (!backgroundMusic) return;

    try {

        await backgroundMusic.play();

        setMusicButtonState(true);

    } catch (error) {

        /*
         * Browser autoplay restrictions may block
         * playback until the user interacts with
         * the page. This is expected behavior.
         */

        console.info(
            "Music playback requires user interaction."
        );

        setMusicButtonState(false);
    }

};


const pauseMusic = () => {

    if (!backgroundMusic) return;

    backgroundMusic.pause();

    setMusicButtonState(false);

};


const toggleMusic = async () => {

    if (!backgroundMusic) return;

    if (backgroundMusic.paused) {

        await playMusic();

    } else {

        pauseMusic();

    }

};


musicToggle?.addEventListener(
    "click",
    toggleMusic
);

sceneMusicToggle?.addEventListener(
    "click",
    toggleMusic
);


/* =========================================================
   MUSIC PROGRESS
========================================================= */

backgroundMusic?.addEventListener(
    "timeupdate",
    () => {

        if (
            !musicProgressFill ||
            !Number.isFinite(
                backgroundMusic.duration
            ) ||
            backgroundMusic.duration <= 0
        ) {
            return;
        }

        const progress =
            (
                backgroundMusic.currentTime /
                backgroundMusic.duration
            ) * 100;

        musicProgressFill.style.width =
            `${progress}%`;

    }
);


backgroundMusic?.addEventListener(
    "play",
    () => setMusicButtonState(true)
);


backgroundMusic?.addEventListener(
    "pause",
    () => setMusicButtonState(false)
);


/* =========================================================
   START MUSIC AFTER FIRST USER INTERACTION
========================================================= */

let userInteracted = false;

const firstInteraction = async () => {

    if (userInteracted) return;

    userInteracted = true;

    /*
     * We attempt playback after the user's
     * interaction. If the browser still blocks it,
     * the normal play button remains available.
     */

    await playMusic();

    document.removeEventListener(
        "pointerdown",
        firstInteraction
    );

    document.removeEventListener(
        "keydown",
        firstInteraction
    );

};

document.addEventListener(
    "pointerdown",
    firstInteraction,
    { once: false, passive: true }
);

document.addEventListener(
    "keydown",
    firstInteraction,
    { once: false }
);


/* =========================================================
   REDUCE MOTION ACCESSIBILITY
========================================================= */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

if (prefersReducedMotion.matches) {

    document.documentElement.classList.add(
        "reduced-motion"
    );

}

prefersReducedMotion.addEventListener?.(
    "change",
    event => {

        document.documentElement.classList.toggle(
            "reduced-motion",
            event.matches
        );

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * The HTML is now ready.
         * Additional V4 systems will be
         * initialized in the next parts.
         */

        document.body.classList.add(
            "js-ready"
        );

    }
);
/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = $$(".reveal");

const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(
                    entry.target
                );

            }

        });

    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
    }
);

revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const navigationSections = [
    "hero",
    "timeline",
    "gallery",
    "cinema",
    "letter",
    "ending"
];

const navigationMap = new Map();

navLinks.forEach(link => {

    const href =
        link.getAttribute("href");

    if (!href || !href.startsWith("#")) {
        return;
    }

    navigationMap.set(href.slice(1), link);

});


const sectionObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                return;
            }

            navigationMap.forEach(link => {

                link.classList.remove("active");

            });

            const activeLink =
                navigationMap.get(
                    entry.target.id
                );

            activeLink?.classList.add("active");

        });

    },
    {
        threshold: 0.45
    }
);

navigationSections.forEach(id => {

    const section = document.getElementById(id);

    if (section) {

        sectionObserver.observe(section);

    }

});


/* =========================================================
   TIMELINE PROGRESS
========================================================= */

const timeline =
    $("#timeline");

const timelineProgress =
    $(".timeline-progress");

const updateTimelineProgress = () => {

    if (
        !timeline ||
        !timelineProgress
    ) {
        return;
    }

    const rect =
        timeline.getBoundingClientRect();

    const viewportHeight =
        window.innerHeight;

    const total =
        timeline.offsetHeight;

    const travelled =
        viewportHeight - rect.top;

    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                (travelled / total) * 100
            )
        );

    timelineProgress.style.height =
        `${percentage}%`;

};

let timelineTicking = false;

window.addEventListener(
    "scroll",
    () => {

        if (timelineTicking) {
            return;
        }

        window.requestAnimationFrame(() => {

            updateTimelineProgress();

            timelineTicking = false;

        });

        timelineTicking = true;

    },
    { passive: true }
);

updateTimelineProgress();


/* =========================================================
   CURSOR GLOW
========================================================= */

const cursorGlow =
    $(".cursor-glow");

let cursorX = 0;
let cursorY = 0;

let glowX = 0;
let glowY = 0;

const moveCursorGlow = event => {

    cursorX = event.clientX;
    cursorY = event.clientY;

    document.body.classList.add(
        "cursor-active"
    );

};

window.addEventListener(
    "pointermove",
    moveCursorGlow,
    { passive: true }
);


const animateCursorGlow = () => {

    glowX +=
        (cursorX - glowX) * 0.12;

    glowY +=
        (cursorY - glowY) * 0.12;

    if (cursorGlow) {

        cursorGlow.style.left =
            `${glowX}px`;

        cursorGlow.style.top =
            `${glowY}px`;

    }

    requestAnimationFrame(
        animateCursorGlow
    );

};

animateCursorGlow();


document.addEventListener(
    "mouseleave",
    () => {

        document.body.classList.remove(
            "cursor-active"
        );

    }
);


/* =========================================================
   SUBTLE HERO PARALLAX
========================================================= */

const heroVisual =
    $(".hero-visual");

const heroPhoto =
    $(".hero-photo-frame");

let targetRotateX = 0;
let targetRotateY = 0;

let currentRotateX = 0;
let currentRotateY = 0;


const handleHeroPointer = event => {

    if (
        !heroVisual ||
        window.innerWidth <= 900
    ) {
        return;
    }

    const rect =
        heroVisual.getBoundingClientRect();

    const x =
        (event.clientX - rect.left)
        / rect.width;

    const y =
        (event.clientY - rect.top)
        / rect.height;

    targetRotateY =
        (x - 0.5) * 8;

    targetRotateX =
        -(y - 0.5) * 8;

};

heroVisual?.addEventListener(
    "pointermove",
    handleHeroPointer,
    { passive: true }
);


heroVisual?.addEventListener(
    "pointerleave",
    () => {

        targetRotateX = 0;
        targetRotateY = 0;

    }
);


const animateHeroParallax = () => {

    currentRotateX +=
        (targetRotateX - currentRotateX)
        * 0.08;

    currentRotateY +=
        (targetRotateY - currentRotateY)
        * 0.08;

    if (
        heroPhoto &&
        window.innerWidth > 900
    ) {

        heroPhoto.style.transform =
            `rotateX(${currentRotateX}deg)
             rotateY(${currentRotateY}deg)`;

    }

    requestAnimationFrame(
        animateHeroParallax
    );

};

animateHeroParallax();


/* =========================================================
   WINDOW RESIZE
========================================================= */

let resizeTimer;

window.addEventListener(
    "resize",
    () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            updateTimelineProgress();

        }, 150);

    },
    { passive: true }
);


/* =========================================================
   STAR PARTICLES
========================================================= */

const starsLayer =
    $(".stars-layer");

const createStar = () => {

    if (!starsLayer) {
        return;
    }

    const star =
        document.createElement("span");

    star.className =
        "generated-star";

    const size =
        Math.random() * 2.4 + 0.8;

    const duration =
        Math.random() * 4 + 2;

    const delay =
        Math.random() * 4;

    star.style.left =
        `${Math.random() * 100}%`;

    star.style.top =
        `${Math.random() * 100}%`;

    star.style.width =
        `${size}px`;

    star.style.height =
        `${size}px`;

    star.style.animationDuration =
        `${duration}s`;

    star.style.animationDelay =
           `${delay}s`;

    star.style.opacity =
        `${Math.random() * 0.7 + 0.2}`;

    starsLayer.appendChild(star);

    setTimeout(() => {

        star.remove();

    }, (duration + delay) * 1000 + 500);
};


/* =========================================================
   INITIAL STAR FIELD
========================================================= */

const generateInitialStars = () => {

    if (!starsLayer) {
        return;
    }

    const count =
        window.innerWidth <= 680
            ? 70
            : 140;

    for (let i = 0; i < count; i++) {
        createStar();
    }

};

generateInitialStars();


/* =========================================================
   CONTINUOUS STAR GENERATION
========================================================= */

setInterval(() => {

    createStar();

}, 900);


/* =========================================================
   GENERATED STAR STYLING
========================================================= */

const starStyle = document.createElement("style");

starStyle.textContent = `
    .generated-star {
        position: absolute;
        display: block;
        border-radius: 50%;
        background: #ffffff;
        box-shadow:
            0 0 6px rgba(255,255,255,.7),
            0 0 14px rgba(244,201,93,.25);
        pointer-events: none;
        animation:
            generatedStarBlink ease-in-out infinite;
    }

    @keyframes generatedStarBlink {
        0%, 100% {
            opacity: .2;
            transform: scale(.7);
        }

        50% {
            opacity: 1;
            transform: scale(1.35);
        }
    }
`;

document.head.appendChild(starStyle);


/* =========================================================
   ACTIVE SECTION URL
========================================================= */

const setActiveSection = () => {

    const scrollPosition =
        window.scrollY + window.innerHeight * 0.35;

    let activeSection = null;

    navigationSections.forEach(id => {

        const section =
            document.getElementById(id);

        if (!section) {
            return;
        }

        if (
            scrollPosition >=
            section.offsetTop
        ) {
            activeSection = section;
        }

    });

    if (!activeSection) {
        return;
    }

    navigationMap.forEach(link => {

        link.classList.remove("active");

    });

    navigationMap
        .get(activeSection.id)
        ?.classList.add("active");

};

window.addEventListener(
    "scroll",
    setActiveSection,
    { passive: true }
);


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (!backgroundMusic) {
            return;
        }

        if (document.hidden) {

            if (!backgroundMusic.paused) {

                backgroundMusic.pause();

                setMusicButtonState(false);

            }

        }

    }
);


/* =========================================================
   OPENING BUTTON MUSIC
========================================================= */

enterStory?.addEventListener(
    "click",
    async () => {

        await playMusic();

    }
);


/* =========================================================
   HORIZONTAL MOTION FOR REDUCED MOTION
========================================================= */

if (document.documentElement.classList.contains("reduced-motion")) {

    const motionStyles =
        document.createElement("style");

    motionStyles.textContent = `
        *,
        *::before,
        *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .001ms !important;
        }
    `;

    document.head.appendChild(
        motionStyles
    );

}


/* =========================================================
   DEBUG MESSAGE
========================================================= */

console.log(
    "%c✦ Until The Stars Forget To Shine",
    `
        color:#f4c95d;
        font-size:18px;
        font-weight:600;
    `
);

console.log(
    "%cV4 cinematic experience initialized.",
    `
        color:#9eabb9;
        font-size:12px;
    `
);
/* =========================================================
   GALLERY DATA
========================================================= */

const galleryItems = $$(".memory-photo");

const galleryData = [
    {
        src: "assets/images/photo1.jpg",
        label: "MEMORY 01",
        title: "The smile I'll always remember."
    },
    {
        src: "assets/images/photo2.jpg",
        label: "MEMORY 02",
        title: "One ordinary day made unforgettable."
    },
    {
        src: "assets/images/photo3.jpg",
        label: "MEMORY 03",
        title: "The little moment that stayed with me."
    },
    {
        src: "assets/images/photo4.jpg",
        label: "MEMORY 04",
        title: "My favorite frame in the whole story."
    }
];


/* =========================================================
   GALLERY LIGHTBOX
========================================================= */

const galleryLightbox =
    $("#gallery-lightbox");

const lightboxImage =
    $("#lightbox-image");

const lightboxNumber =
    $("#lightbox-number");

const lightboxTitle =
    $("#lightbox-title");

const lightboxClose =
    $("#lightbox-close");

const lightboxPrev =
    $("#lightbox-prev");

const lightboxNext =
    $("#lightbox-next");


const updateGalleryLightbox = () => {

    if (
        !galleryLightbox ||
        !lightboxImage
    ) {
        return;
    }

    const item =
        galleryData[state.activePhoto];

    if (!item) {
        return;
    }

    lightboxImage.src =
        item.src;

    lightboxImage.alt =
        item.title;

    if (lightboxNumber) {

        lightboxNumber.textContent =
            item.label;

    }

    if (lightboxTitle) {

        lightboxTitle.textContent =
            item.title;

    }

    lightboxImage.animate(
        [
            {
                opacity: 0,
                transform: "scale(.96)"
            },
            {
                opacity: 1,
                transform: "scale(1)"
            }
        ],
        {
            duration: 350,
            easing: "cubic-bezier(.22,1,.36,1)"
        }
    );
};


const openGalleryLightbox = index => {

    if (!galleryLightbox) {
        return;
    }

    state.activePhoto =
        (index + galleryData.length)
        % galleryData.length;

    updateGalleryLightbox();

    galleryLightbox.classList.add(
        "active"
    );

    galleryLightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

};


const closeGalleryLightbox = () => {

    if (!galleryLightbox) {
        return;
    }

    galleryLightbox.classList.remove(
        "active"
    );

    galleryLightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

};


const nextGalleryPhoto = () => {

    openGalleryLightbox(
        state.activePhoto + 1
    );

};


const previousGalleryPhoto = () => {

    openGalleryLightbox(
        state.activePhoto - 1
    );

};


galleryItems.forEach(
    (item, index) => {

        item.addEventListener(
            "click",
            () => {

                openGalleryLightbox(index);

            }
        );

    }
);


lightboxClose?.addEventListener(
    "click",
    closeGalleryLightbox
);

lightboxPrev?.addEventListener(
    "click",
    previousGalleryPhoto
);

lightboxNext?.addEventListener(
    "click",
    nextGalleryPhoto
);


galleryLightbox?.addEventListener(
    "click",
    event => {

        if (
            event.target === galleryLightbox
        ) {
            closeGalleryLightbox();
        }

    }
);


/* =========================================================
   GALLERY KEYBOARD NAVIGATION
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !galleryLightbox?.classList.contains(
                "active"
            )
        ) {
            return;
        }

        if (event.key === "Escape") {

            closeGalleryLightbox();

        }

        if (event.key === "ArrowRight") {

            nextGalleryPhoto();

        }

        if (event.key === "ArrowLeft") {

            previousGalleryPhoto();

        }

    }
);


/* =========================================================
   GALLERY TOUCH SWIPE
========================================================= */

let touchStartX = 0;
let touchEndX = 0;

galleryLightbox?.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


galleryLightbox?.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0].screenX;

        const distance =
            touchEndX - touchStartX;

        if (Math.abs(distance) < 50) {
            return;
        }

        if (distance < 0) {

            nextGalleryPhoto();

        } else {

            previousGalleryPhoto();

        }

    },
    { passive: true }
);


/* =========================================================
   PREVENT DOUBLE IMAGE DRAG
========================================================= */

$$("img").forEach(image => {

    image.addEventListener(
        "dragstart",
        event => {

            event.preventDefault();

        }
    );

});


/* =========================================================
   VIDEO CONTROLS
========================================================= */

const memoryVideos =
    $$(".memory-video");

const videoCards =
    $$(".movie-card");


const updateVideoCardState =
    (video, playing) => {

        const card =
            video.closest(".movie-card");

        if (!card) {
            return;
        }

        const media =
            card.querySelector(".movie-media");

        media?.classList.toggle(
            "is-playing",
            playing
        );

    };


memoryVideos.forEach(video => {

    video.addEventListener(
        "play",
        () => {

            memoryVideos.forEach(
                otherVideo => {

                    if (
                        otherVideo !== video &&
                        !otherVideo.paused
                    ) {

                        otherVideo.pause();

                    }

                }
            );

            updateVideoCardState(
                video,
                true
            );

            if (
                backgroundMusic &&
                !backgroundMusic.paused
            ) {

                backgroundMusic.pause();

                setMusicButtonState(false);

            }

        }
    );


    video.addEventListener(
        "pause",
        () => {

            updateVideoCardState(
                video,
                false
            );

        }
    );


    video.addEventListener(
        "ended",
        () => {

            updateVideoCardState(
                video,
                false
            );

        }
    );

});


/* =========================================================
   CUSTOM VIDEO PLAY BUTTON
========================================================= */

$$(".video-play-button").forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const card =
                    button.closest(".movie-card");

                const video =
                    card?.querySelector(
                        ".memory-video"
                    );

                if (!video) {
                    return;
                }

                if (video.paused) {

                    video.play().catch(
                        () => {}
                    );

                } else {

                    video.pause();

                }

            }
        );

    }
);


/* =========================================================
   VIDEO VISIBILITY
========================================================= */

const videoVisibilityObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                const video =
                    entry.target;

                if (!entry.isIntersecting) {

                    if (!video.paused) {
                        video.pause();
                    }

                }

            });

        },
        {
            threshold: 0.2
        }
    );


memoryVideos.forEach(video => {

    videoVisibilityObserver.observe(
        video
    );

});
/* =========================================================
   LOVE NOTES
========================================================= */

const loveNotes = $$(".love-note");

const noteModal =
    $("#note-modal");

const noteModalClose =
    $("#note-modal-close");

const noteModalNumber =
    $("#note-modal-number");

const noteModalTitle =
    $("#note-modal-title");

const noteModalText =
    $("#note-modal-text");


const openNote = note => {

    if (!noteModal) {
        return;
    }

    const number =
        note.querySelector(
            ".note-number"
        )?.textContent || "NOTE";

    const title =
        note.querySelector(
            "strong"
        )?.textContent || "";

    const text =
        note.querySelector(
            "small"
        )?.textContent || "";

    if (noteModalNumber) {
        noteModalNumber.textContent =
            `NOTE ${number}`;
    }

    if (noteModalTitle) {
        noteModalTitle.textContent =
            title;
    }

    if (noteModalText) {
        noteModalText.textContent =
            text;
    }

    noteModal.classList.add("active");

    noteModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

};


const closeNote = () => {

    if (!noteModal) {
        return;
    }

    noteModal.classList.remove(
        "active"
    );

    noteModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
};


loveNotes.forEach(note => {

    note.addEventListener(
        "click",
        () => openNote(note)
    );

});


noteModalClose?.addEventListener(
    "click",
    closeNote
);


noteModal?.addEventListener(
    "click",
    event => {

        if (
            event.target === noteModal
        ) {
            closeNote();
        }

    }
);


/* =========================================================
   NOTE KEYBOARD CLOSE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            noteModal?.classList.contains(
                "active"
            )
        ) {

            closeNote();

        }

    }
);


/* =========================================================
   LETTER ELEMENTS
========================================================= */

const envelope =
    $("#envelope");

const letterPaper =
    $("#letter-paper");


/* =========================================================
   LETTER OPEN
========================================================= */

const openLetter = () => {

    if (!envelope || !letterPaper) {
        return;
    }

    envelope.classList.add(
        "opened"
    );

    setTimeout(() => {

        letterPaper.classList.add(
            "open"
        );

        letterPaper.setAttribute(
            "aria-hidden",
            "false"
        );

    }, 650);

};


/* =========================================================
   LETTER CLOSE / RESET
========================================================= */

const closeLetter = () => {

    if (!envelope || !letterPaper) {
        return;
    }

    letterPaper.classList.remove(
        "open"
    );

    letterPaper.setAttribute(
        "aria-hidden",
        "true"
    );

    setTimeout(() => {

        envelope.classList.remove(
            "opened"
        );

    }, 450);

};


/* =========================================================
   ENVELOPE CLICK
========================================================= */

envelope?.addEventListener(
    "click",
    () => {

        const isOpened =
            envelope.classList.contains(
                "opened"
            );

        if (!isOpened) {

            openLetter();

        } else if (
            letterPaper?.classList.contains(
                "open"
            )
        ) {

            closeLetter();

        }

    }
);


/* =========================================================
   LETTER TYPING EFFECT
========================================================= */

const typeLetterContent = () => {

    const paragraphs =
        $$(".letter-body p", letterPaper);

    const heading =
        $(".letter-body h3", letterPaper);

    const emphasis =
        $(".letter-emphasis", letterPaper);

    const signature =
        $(".letter-signature", letterPaper);

    const elements = [
        heading,
        ...paragraphs,
        emphasis,
        signature
    ].filter(Boolean);

    elements.forEach(
        element => {

            element.style.opacity = "0";

        }
    );


    let delay = 180;


    elements.forEach(
        element => {

            setTimeout(() => {

                element.animate(
                    [
                        {
                            opacity: 0,
                            transform:
                                "translateY(12px)"
                        },
                        {
                            opacity: 1,
                            transform:
                                "translateY(0)"
                        }
                    ],
                    {
                        duration: 650,
                        easing:
                            "cubic-bezier(.22,1,.36,1)",
                        fill: "forwards"
                    }
                );

            }, delay);

            delay += 550;

        }
    );

};


/* =========================================================
   RUN LETTER ANIMATION ON OPEN
========================================================= */

let letterAnimationPlayed = false;

envelope?.addEventListener(
    "click",
    () => {

        if (
            !letterAnimationPlayed &&
            envelope.classList.contains(
                "opened"
            )
        ) {

            letterAnimationPlayed = true;

            setTimeout(
                typeLetterContent,
                850
            );

        }

    }
);


/* =========================================================
   RESET LETTER ANIMATION
========================================================= */

const resetLetterAnimation = () => {

    letterAnimationPlayed = false;

    const elements = [
        $(".letter-body h3", letterPaper),
        ...$$(".letter-body p", letterPaper),
        $(".letter-emphasis", letterPaper),
        $(".letter-signature", letterPaper)
    ].filter(Boolean);

    elements.forEach(
        element => {

            element.style.opacity = "1";

        }
    );

};


/* =========================================================
   DOUBLE CLICK LETTER TO RESET
========================================================= */

letterPaper?.addEventListener(
    "dblclick",
    () => {

        closeLetter();

        setTimeout(
            resetLetterAnimation,
            700
        );

    }
);


/* =========================================================
   LOCK PAGE SCROLL WHEN LETTER MODAL
========================================================= */

const letterObserver =
    new MutationObserver(
        () => {

            if (
                letterPaper?.classList.contains(
                    "open"
                )
            ) {

                /*
                 * The letter itself is scrollable,
                 * so we don't lock body scrolling
                 * here.
                 */

            }

        }
    );


if (letterPaper) {

    letterObserver.observe(
        letterPaper,
        {
            attributes: true,
            attributeFilter: [
                "class"
            ]
        }
    );

}


/* =========================================================
   LOVE NOTE MICRO-ANIMATION
========================================================= */

loveNotes.forEach(
    (note, index) => {

        note.addEventListener(
            "pointerenter",
            () => {

                note.animate(
                    [
                        {
                            transform:
                                "translateY(0) rotate(0deg)"
                        },
                        {
                            transform:
                                "translateY(-5px) rotate(-1deg)"
                        },
                        {
                            transform:
                                "translateY(0) rotate(0deg)"
                        }
                    ],
                    {
                        duration: 500,
                        easing:
                            "cubic-bezier(.22,1,.36,1)"
                    }
                );

            }
        );

    }
);
/* =========================================================
   MEMORY VAULT
========================================================= */

const vaultContainer =
    $(".vault-container");

const vaultOpen =
    $("#vault-open");

const vaultClose =
    $("#vault-close");

const vaultContent =
    $("#vault-content");

const vaultMemories =
    $$(".vault-memory");


const openVault = () => {

    if (
        !vaultContainer ||
        !vaultContent
    ) {
        return;
    }

    vaultContainer.classList.add(
        "open"
    );

    vaultOpen?.setAttribute(
        "aria-expanded",
        "true"
    );

    vaultContent.setAttribute(
        "aria-hidden",
        "false"
    );

    showToast(
        "Memory Vault opened ✦"
    );

};


const closeVault = () => {

    if (
        !vaultContainer ||
        !vaultContent
    ) {
        return;
    }

    vaultContainer.classList.remove(
        "open"
    );

    vaultOpen?.setAttribute(
        "aria-expanded",
        "false"
    );

    vaultContent.setAttribute(
        "aria-hidden",
        "true"
    );

};


vaultOpen?.addEventListener(
    "click",
    openVault
);


vaultClose?.addEventListener(
    "click",
    closeVault
);


/* =========================================================
   VAULT MEMORY → GALLERY LIGHTBOX
========================================================= */

vaultMemories.forEach(memory => {

    memory.addEventListener(
        "click",
        () => {

            const index =
                Number(
                    memory.dataset.vaultIndex
                );

            if (
                Number.isInteger(index)
            ) {

                openGalleryLightbox(
                    index
                );

            }

        }
    );

});


/* =========================================================
   CLOSE VAULT WITH ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            vaultContainer?.classList.contains(
                "open"
            )
        ) {

            closeVault();

        }

    }
);


/* =========================================================
   LOVE COUNTER
========================================================= */

const loveDays =
    $("#love-days");


/*
 * Start date:
 * 29 June 2026
 *
 * The counter is based on calendar days,
 * not hours, so it stays stable throughout
 * the day.
 */

const relationshipStart =
    new Date(
        2026,
        5,
        29
    );


const getCalendarDayDifference = (
    startDate,
    endDate
) => {

    const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    const end = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    );

    const oneDay =
        1000 *
        60 *
        60 *
        24;

    return Math.max(
        0,
        Math.floor(
            (end - start) /
            oneDay
        )
    );

};


const updateLoveCounter = () => {

    if (!loveDays) {
        return;
    }

    const today =
        new Date();

    const days =
        getCalendarDayDifference(
            relationshipStart,
            today
        );

    loveDays.textContent =
        days.toLocaleString(
            "en-US"
        );

};


updateLoveCounter();


/*
 * Update once per minute in case
 * the page remains open overnight.
 */

setInterval(
    updateLoveCounter,
    60000
);


/* =========================================================
   TOAST SYSTEM
========================================================= */

const toast =
    $("#toast");

let toastTimer;


const showToast = message => {

    if (!toast) {
        return;
    }

    clearTimeout(toastTimer);

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    toastTimer = setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2600
    );

};


/* =========================================================
   HEART PARTICLE
========================================================= */

const createHeartParticle = (
    x,
    y
) => {

    const heart =
        document.createElement("span");

    heart.className =
        "interaction-heart";

    heart.textContent =
        "♡";

    heart.style.left =
        `${x}px`;

    heart.style.top =
        `${y}px`;

    heart.style.setProperty(
        "--heart-x",
        `${(Math.random() - 0.5) * 100}px`
    );

    heart.style.setProperty(
        "--heart-rotate",
        `${(Math.random() - 0.5) * 35}deg`
    );

    document.body.appendChild(
        heart
    );

    setTimeout(
        () => {
            heart.remove();
        },
        1600
    );

};


/* =========================================================
   HEART BURST
========================================================= */

const heartBurst = (
    x,
    y,
    amount = 8
) => {

    for (let i = 0; i < amount; i++) {

        setTimeout(
            () => {

                createHeartParticle(
                    x,
                    y
                );

            },
            i * 55
        );

    }

};


/* =========================================================
   INTERACTIVE HEARTS
========================================================= */

$$(".primary-button").forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                heartBurst(
                    event.clientX,
                    event.clientY,
                    6
                );

            }
        );

    }
);


/* =========================================================
   PHOTO HEART EFFECT
========================================================= */

galleryItems.forEach(
    item => {

        item.addEventListener(
            "dblclick",
            event => {

                heartBurst(
                    event.clientX,
                    event.clientY,
                    12
                );

            }
        );

    }
);


/* =========================================================
   ENDING REPLAY
========================================================= */

const restartStory =
    $("#restart-story");

restartStory?.addEventListener(
    "click",
    async () => {

        closeMenu();

        closeNote();

        closeLetter();

        closeVault();

        closeGalleryLightbox();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        showToast(
            "Starting our story again ✦"
        );

    }
);


/* =========================================================
   ENDING OBSERVER
========================================================= */

const endingSection =
    $("#ending");

const endingObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    !entry.isIntersecting
                ) {
                    return;
                }

                /*
                 * Pause every memory video
                 * before the final scene.
                 */

                memoryVideos.forEach(
                    video => {

                        if (!video.paused) {
                            video.pause();
                        }

                    }
                );

                /*
                 * Give the ending a small
                 * cinematic emphasis.
                 */

                if (
                    !document.documentElement
                        .classList
                        .contains(
                            "reduced-motion"
                        )
                ) {

                    heartBurst(
                        window.innerWidth / 2,
                        window.innerHeight / 2,
                        10
                    );

                }

            });

        },
        {
            threshold: 0.6
        }
    );


if (endingSection) {

    endingObserver.observe(
        endingSection
    );

}


/* =========================================================
   CREDITS YEAR
========================================================= */

const footerYear =
    $("#footer");

if (footerYear) {

    const yearText =
        footerYear.querySelector(
            ".footer-meta"
        );

    /*
     * Keep the explicit story year in the markup,
     * but expose current year for future updates.
     */

    footerYear.dataset.currentYear =
        String(
            state.currentYear
        );

}


/* =========================================================
   BUTTON PRESS FEEDBACK
========================================================= */

$$(
    "button:not(.menu-toggle)"
).forEach(
    button => {

        button.addEventListener(
            "pointerdown",
            () => {

                button.classList.add(
                    "button-pressed"
                );

            }
        );

        button.addEventListener(
            "pointerup",
            () => {

                setTimeout(
                    () => {

                        button.classList.remove(
                            "button-pressed"
                        );

                    },
                    120
                );

            }
        );

        button.addEventListener(
            "pointerleave",
            () => {

                button.classList.remove(
                    "button-pressed"
                );

            }
        );

    }
);


/* =========================================================
   DISABLE CONTEXT MENU ON DECORATIVE ELEMENTS
========================================================= */

$$(
    ".hero-orbit, .music-disc, .opening-stars"
).forEach(
    element => {

        element.addEventListener(
            "contextmenu",
            event => {

                event.preventDefault();

            }
        );

    }
);
/* =========================================================
   ASSET ERROR HANDLING
========================================================= */

const handleImageErrors = () => {

    $$("img").forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "asset-error"
                );

                /*
                 * Keep the layout intact when
                 * an image is missing.
                 */

                image.alt =
                    "Memory image unavailable";

            }
        );

    });

};


const handleVideoErrors = () => {

    memoryVideos.forEach(video => {

        video.addEventListener(
            "error",
            () => {

                const card =
                    video.closest(
                        ".movie-card"
                    );

                if (!card) {
                    return;
                }

                card.classList.add(
                    "asset-error"
                );

                showToast(
                    "One memory video could not be loaded."
                );

            }
        );

    });

};


handleImageErrors();

handleVideoErrors();


/* =========================================================
   IMAGE LOADING
========================================================= */

const lazyImages =
    $$("img[loading='lazy']");

if (
    "IntersectionObserver" in window &&
    lazyImages.length
) {

    const imageObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }

                    const image =
                        entry.target;

                    image.classList.add(
                        "image-visible"
                    );

                    imageObserver.unobserve(
                        image
                    );

                });

            },
            {
                rootMargin:
                    "100px 0px"
            }
        );

    lazyImages.forEach(image => {

        imageObserver.observe(
            image
        );

    });

} else {

    lazyImages.forEach(image => {

        image.classList.add(
            "image-visible"
        );

    });

}


/* =========================================================
   PAGE SCROLL LOCK HELPER
========================================================= */

let scrollLockCount = 0;

const lockScroll = () => {

    scrollLockCount++;

    document.body.dataset.scrollLocked =
        "true";

    document.body.style.overflow =
        "hidden";

};


const unlockScroll = () => {

    scrollLockCount =
        Math.max(
            0,
            scrollLockCount - 1
        );

    if (scrollLockCount === 0) {

        document.body.removeAttribute(
            "data-scroll-locked"
        );

        document.body.style.overflow =
            "";

    }

};


/* =========================================================
   ORIENTATION / MOBILE CHANGE
========================================================= */

const handleViewportChange = () => {

    /*
     * Reset hero 3D effect on small screens.
     */

    if (
        window.innerWidth <= 900 &&
        heroPhoto
    ) {

        heroPhoto.style.transform =
            "";

    }

    updateTimelineProgress();

};


window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(
            handleViewportChange,
            250
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   DOUBLE TAP PROTECTION
========================================================= */

let lastTouchTime = 0;

document.addEventListener(
    "touchend",
    event => {

        const now =
            Date.now();

        if (
            now - lastTouchTime < 280
        ) {

            /*
             * Prevent accidental zooming on
             * interactive UI elements.
             */

            const target =
                event.target;

            if (
                target.closest(
                    ".photo-inner, .movie-media, .love-note"
                )
            ) {

                event.preventDefault();

            }

        }

        lastTouchTime = now;

    },
    {
        passive: false
    }
);


/* =========================================================
   TOUCH FEEDBACK
========================================================= */

const touchTargets = $$(
    ".memory-photo, .movie-card, .love-note, .vault-memory"
);

touchTargets.forEach(
    element => {

        element.addEventListener(
            "touchstart",
            () => {

                element.classList.add(
                    "touch-active"
                );

            },
            {
                passive: true
            }
        );

        element.addEventListener(
            "touchend",
            () => {

                setTimeout(
                    () => {

                        element.classList.remove(
                            "touch-active"
                        );

                    },
                    180
                );

            },
            {
                passive: true
            }
        );

        element.addEventListener(
            "touchcancel",
            () => {

                element.classList.remove(
                    "touch-active"
                );

            },
            {
                passive: true
            }
        );

    }
);


/* =========================================================
   PAGE FOCUS
========================================================= */

window.addEventListener(
    "focus",
    () => {

        document.body.classList.add(
            "page-focused"
        );

    }
);


window.addEventListener(
    "blur",
    () => {

        document.body.classList.remove(
            "page-focused"
        );

    }
);


/* =========================================================
   FINAL CTA
========================================================= */

const finalCTA =
    $("#restart-story");

finalCTA?.addEventListener(
    "mouseenter",
    () => {

        if (
            document.documentElement
                .classList
                .contains(
                    "reduced-motion"
                )
        ) {
            return;
        }

        heartBurst(
            window.innerWidth / 2,
            window.innerHeight * 0.72,
            4
        );

    }
);


/* =========================================================
   PAGE LOAD PERFORMANCE
========================================================= */

window.addEventListener(
    "load",
    () => {

        document.documentElement.classList.add(
            "page-ready"
        );

        /*
         * Remove any temporary focus
         * states after the page settles.
         */

        setTimeout(
            () => {

                document.body.classList.add(
                    "experience-ready"
                );

            },
            700
        );

    }
);


/* =========================================================
   HANDLE BROKEN MUSIC
========================================================= */

backgroundMusic?.addEventListener(
    "error",
    () => {

        showToast(
            "Music file is unavailable. Add Risk It All to assets/music."
        );

        if (musicToggle) {

            musicToggle.disabled =
                true;

        }

        if (sceneMusicToggle) {

            sceneMusicToggle.disabled =
                true;

        }

    }
);


/* =========================================================
   HANDLE MISSING VIDEO SOURCE
========================================================= */

memoryVideos.forEach(
    video => {

        video.addEventListener(
            "loadedmetadata",
            () => {

                const card =
                    video.closest(
                        ".movie-card"
                    );

                if (!card) {
                    return;
                }

                card.classList.add(
                    "video-ready"
                );

            }
        );

    }
);


/* =========================================================
   PREFERS REDUCED MOTION
========================================================= */

const applyMotionPreference = () => {

    if (
        prefersReducedMotion.matches
    ) {

        document.documentElement.classList.add(
            "reduced-motion"
        );

    } else {

        document.documentElement.classList.remove(
            "reduced-motion"
        );

    }

};

applyMotionPreference();


/* =========================================================
   CLEANUP ON PAGE HIDE
========================================================= */

window.addEventListener(
    "pagehide",
    () => {

        memoryVideos.forEach(
            video => {

                video.pause();

            }
        );

        if (
            backgroundMusic &&
            !backgroundMusic.paused
        ) {

            backgroundMusic.pause();

        }

    }
);


/* =========================================================
   FINAL KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
         * M = music
         */

        if (
            event.key.toLowerCase() === "m" &&
            !["INPUT", "TEXTAREA"].includes(
                document.activeElement?.tagName
            )
        ) {

            toggleMusic();

        }

        /*
         * Home = return to beginning
         */

        if (
            event.key === "Home" &&
            !event.ctrlKey
        ) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

setMusicButtonState(false);

updateLoveCounter();

updateTimelineProgress();

setActiveSection();


/* =========================================================
   FINAL READY MESSAGE
========================================================= */

console.log(
    "%c✦ UNTIL THE STARS FORGET TO SHINE",
    `
        color:#f4c95d;
        font-size:20px;
        font-weight:700;
    `
);

console.log(
    "%cV4 is ready.",
    `
        color:#9da9b8;
        font-size:13px;
    `
);