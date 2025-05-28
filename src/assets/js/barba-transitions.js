import barba from '@barba/core';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Barba.js
barba.init({
  // Prevent Barba from intercepting gallery links and other external links
  prevent: ({ el }) => {
    // Ignore gallery links (PhotoSwipe) - both main gallery and home gallery
    if (el.closest('.gallery-item') || el.closest('.cs-gallery-item') || el.closest('.pswp-gallery')) {
      return true;
    }
    // Ignore external links
    if (el.getAttribute('href') && el.getAttribute('href').startsWith('http')) {
      return true;
    }
    // Ignore links with data-no-barba attribute
    if (el.hasAttribute('data-no-barba')) {
      return true;
    }
    return false;
  },
  
  // Define transitions
  transitions: [
    {
      name: 'cross-fade',
      async leave(data) {
        // Start fading out the current page
        data.current.container.style.transition = 'opacity 0.4s ease-in-out';
        data.current.container.style.opacity = '0';
        
        // Don't wait for the full fade out - return immediately for overlap
        return Promise.resolve();
      },
      async enter(data) {
        // Set up the new page to be invisible and positioned
        data.next.container.style.opacity = '0';
        data.next.container.style.transition = 'none';
        data.next.container.style.position = 'absolute';
        data.next.container.style.top = '0';
        data.next.container.style.left = '0';
        data.next.container.style.width = '100%';
        data.next.container.style.zIndex = '1';
        
        // Force a reflow
        data.next.container.offsetHeight;
        
        // Start fading in the new page
        return new Promise(resolve => {
          data.next.container.style.transition = 'opacity 0.4s ease-in-out';
          data.next.container.style.opacity = '1';
          
          setTimeout(() => {
            // Clean up positioning after transition
            data.next.container.style.position = '';
            data.next.container.style.top = '';
            data.next.container.style.left = '';
            data.next.container.style.width = '';
            data.next.container.style.zIndex = '';
            resolve();
          }, 400);
        });
      }
    }
  ],
  
  // Views for specific pages (optional)
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        // Re-initialize any home page specific scripts
        console.log('Entering home page');
      }
    },
    {
      namespace: 'gallery',
      beforeEnter() {
        // Re-initialize gallery scripts (Masonry, PhotoSwipe)
        if (typeof window.initializeGallery === 'function') {
          window.initializeGallery();
        }
        console.log('Entering gallery page');
      }
    }
  ]
});

// PhotoSwipe initialization function
function initPhotoSwipe() {
  // Destroy any existing PhotoSwipe instances
  if (window.photoSwipeLightbox) {
    window.photoSwipeLightbox.destroy();
  }
  
  // Initialize PhotoSwipe with npm imports
  window.photoSwipeLightbox = new PhotoSwipeLightbox({
    gallery: '.pswp-gallery',
    children: 'a',
    pswpModule: PhotoSwipe,
  });
  window.photoSwipeLightbox.init();
}

// Initialize scroll animations
function initScrollAnimations() {
  // Clear any existing ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Animate single elements with data-animate="fade-up" or .animate-fade-up
  const singleElements = document.querySelectorAll('[data-animate="fade-up"], .animate-fade-up');
  singleElements.forEach(element => {
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 30
      },
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
      gsap.fromTo(children,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
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
  
  console.log('Scroll animations initialized');
}

// Hook to reinitialize scripts after page transition
barba.hooks.after(() => {
  // Re-run any global scripts that need to be reinitialized
  
  // Reinitialize navigation if needed
  if (typeof window.initializeNavigation === 'function') {
    window.initializeNavigation();
  }
  
  // Always reinitialize gallery scripts (both home and gallery pages have galleries)
  if (typeof window.initializeGallery === 'function') {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      window.initializeGallery();
    }, 100);
  }
  
  // Reinitialize PhotoSwipe
  setTimeout(() => {
    initPhotoSwipe();
  }, 200);
  
  // Initialize scroll animations
  setTimeout(() => {
    initScrollAnimations();
  }, 300);
  
  // Scroll to top after transition
  window.scrollTo(0, 0);
});

// Initialize PhotoSwipe and scroll animations on initial page load
document.addEventListener('DOMContentLoaded', () => {
  initPhotoSwipe();
  
  // Initialize scroll animations after a short delay to ensure DOM is ready
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
});