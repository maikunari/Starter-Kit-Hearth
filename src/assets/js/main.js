/**
 * Main JavaScript - Modernized without Barba.js
 * Uses native View Transitions API for page transitions
 */

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// =============================================================================
// PhotoSwipe Initialization
// =============================================================================
function initPhotoSwipe() {
  // Destroy any existing PhotoSwipe instances
  if (window.photoSwipeLightbox) {
    window.photoSwipeLightbox.destroy();
  }

  // Only initialize if gallery elements exist
  const galleries = document.querySelectorAll('.pswp-gallery');
  if (galleries.length === 0) return;

  window.photoSwipeLightbox = new PhotoSwipeLightbox({
    gallery: '.pswp-gallery',
    children: 'a',
    pswpModule: PhotoSwipe,
  });
  window.photoSwipeLightbox.init();
}

// =============================================================================
// Scroll Animations
// =============================================================================
function initScrollAnimations() {
  // Clear any existing ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Animate single elements with data-animate="fade-up" or .animate-fade-up
  const singleElements = document.querySelectorAll('[data-animate="fade-up"], .animate-fade-up');
  singleElements.forEach(element => {
    gsap.fromTo(element,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animate groups with staggered timing
  const animateGroups = document.querySelectorAll('[data-animate-group], .animate-group');
  animateGroups.forEach(group => {
    const children = group.children;
    if (children.length > 0) {
      const isFast = group.hasAttribute('data-animate-fast') || group.classList.contains('animate-fast');

      gsap.fromTo(children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: isFast ? 0.6 : 0.8,
          stagger: isFast ? 0.08 : 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: group,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  // Animate Masonry gallery items
  const masonryGalleries = document.querySelectorAll('.gallery__grid--masonry');
  masonryGalleries.forEach(gallery => {
    const readyItems = gallery.querySelectorAll('.masonry-ready');
    if (readyItems.length > 0) {
      gsap.fromTo(readyItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gallery,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });
}

// =============================================================================
// Brand Hover Animations
// =============================================================================
function initBrandHoverAnimations() {
  // Clear any existing brand hover timelines
  if (window.brandHoverTimelines) {
    window.brandHoverTimelines.forEach(tl => tl.kill());
  }
  window.brandHoverTimelines = [];

  const brandCards = document.querySelectorAll('.content-block__brand');
  brandCards.forEach(brand => {
    const hoverTl = gsap.timeline({ paused: true });

    hoverTl.to(brand, {
      y: -4,
      boxShadow: "0px 25px 45px 0px rgba(0, 0, 0, 0.1)",
      duration: 0.2,
      ease: "power2.out"
    });

    window.brandHoverTimelines.push(hoverTl);

    brand.addEventListener('mouseenter', () => hoverTl.play());
    brand.addEventListener('mouseleave', () => hoverTl.reverse());
  });
}

// =============================================================================
// Header Scroll Effect (using ScrollTrigger instead of scroll listener)
// =============================================================================
function initHeaderScroll() {
  ScrollTrigger.create({
    start: 100,
    onEnter: () => document.body.classList.add('scroll'),
    onLeaveBack: () => document.body.classList.remove('scroll')
  });
}

// =============================================================================
// Initialize All
// =============================================================================
function initAll() {
  initPhotoSwipe();
  initScrollAnimations();
  initBrandHoverAnimations();
  initHeaderScroll();

  // Initialize gallery if function exists
  if (typeof window.initializeGallery === 'function') {
    window.initializeGallery();
  }
}

// Track if we've initialized to prevent double-init
let hasInitialized = false;

// Initialize on DOM ready (initial page load)
document.addEventListener('DOMContentLoaded', () => {
  if (!hasInitialized) {
    hasInitialized = true;
    initAll();
  }
});

// Re-initialize after View Transitions (for browsers that support it)
// pagereveal fires when a page is revealed - either initial load, bfcache restore, or view transition
document.addEventListener('pagereveal', (event) => {
  // For view transitions, wait for the transition to be ready
  if (event.viewTransition) {
    event.viewTransition.ready.then(() => {
      // Reset the flag since this is a new page
      hasInitialized = true;
      setTimeout(() => {
        initAll();
        if (typeof window.initializeNavigation === 'function') {
          window.initializeNavigation();
        }
      }, 100);
    });
  } else if (!hasInitialized) {
    // Handle bfcache restore or fallback cases
    hasInitialized = true;
    initAll();
    if (typeof window.initializeNavigation === 'function') {
      window.initializeNavigation();
    }
  }
});

// Handle back/forward cache restoration (pagehide + pageshow pattern)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from bfcache, need to reinitialize
    initAll();
    if (typeof window.initializeNavigation === 'function') {
      window.initializeNavigation();
    }
  }
});
