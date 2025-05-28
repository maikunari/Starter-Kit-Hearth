// Gallery functionality with Masonry.js and PhotoSwipe integration
import Masonry from 'masonry-layout';

// Store masonry instances for cleanup
let masonryInstance = null;
let resizeHandler = null;
let homeResizeHandler = null;

// Gallery initialization function
function initializeGallery() {
  // Cleanup previous instances
  if (masonryInstance) {
    masonryInstance.destroy();
    masonryInstance = null;
  }
  
  // Remove previous event listeners
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  
  if (homeResizeHandler) {
    window.removeEventListener('resize', homeResizeHandler);
    homeResizeHandler = null;
  }
  
  // Check for both main gallery page and home page gallery
  const galleryGrid = document.querySelector('.gallery-grid');
  const homeGalleryGrid = document.querySelector('.gallery__grid--masonry');
  const cssGalleryGrid = document.querySelector('.gallery__grid:not(.gallery__grid--masonry)');
  
  console.log('Gallery initialization:', {
    galleryGrid: !!galleryGrid,
    homeGalleryGrid: !!homeGalleryGrid,
    cssGalleryGrid: !!cssGalleryGrid,
    masonryImported: !!Masonry
  });
  
  // Initialize Masonry gallery if gallery grid exists (main gallery page)
  if (galleryGrid) {
    initMasonryGallery(galleryGrid);
  }
  
  // Initialize home page gallery with Masonry
  if (homeGalleryGrid) {
    initMasonryGallery(homeGalleryGrid);
  }
  
  // Initialize CSS-only gallery (fallback)
  if (cssGalleryGrid) {
    initCSSGallery(cssGalleryGrid);
  }
}

// Separate function for Masonry gallery initialization
function initMasonryGallery(galleryGrid) {
  // Set up initial item widths before Masonry initialization
  const items = galleryGrid.querySelectorAll('.gallery-item, .gallery__item');
  items.forEach(item => {
    item.style.position = 'absolute';
  });
  
  // Initialize Masonry
  const itemSelector = galleryGrid.classList.contains('gallery__grid--masonry') ? '.gallery__item' : '.gallery-item';
  masonryInstance = new Masonry(galleryGrid, {
    itemSelector: itemSelector,
    columnWidth: itemSelector,
    gutter: 20,
    percentPosition: false,
    transitionDuration: '0.3s',
    horizontalOrder: true
  });
  
  // Wait for images to load before laying out
  const images = galleryGrid.querySelectorAll('img');
  let loadedImages = 0;
  
  function imageLoaded() {
    loadedImages++;
    if (loadedImages === images.length) {
      // All images loaded, relayout masonry
      masonryInstance.layout();
      
      // Update PhotoSwipe dimensions to match rendered thumbnails
      updatePhotoSwipeDimensions();
      
      // Items are ready for scroll-triggered animation
      // The actual animation will be handled by GSAP ScrollTrigger in barba-transitions.js
      const items = galleryGrid.querySelectorAll('.gallery-item, .gallery__item');
      items.forEach(function(item) {
        item.classList.add('masonry-ready');
      });
    }
  }
  
  // Function to update PhotoSwipe dimensions based on actual rendered image sizes
  function updatePhotoSwipeDimensions() {
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item, .gallery__item');
    
    galleryItems.forEach(function(item) {
      const img = item.querySelector('img');
      const link = item;
      
      if (img && link) {
        // Get the actual rendered dimensions of the thumbnail
        const rect = img.getBoundingClientRect();
        const renderedWidth = Math.round(rect.width);
        const renderedHeight = Math.round(rect.height);
        
        // Calculate aspect ratio from rendered thumbnail
        const thumbnailAspectRatio = renderedWidth / renderedHeight;
        
        // Set PhotoSwipe dimensions to match the thumbnail aspect ratio
        // Use a reasonable large size (1200px width as base) and calculate height
        const baseWidth = 1200;
        const calculatedHeight = Math.round(baseWidth / thumbnailAspectRatio);
        
        // Update PhotoSwipe data attributes to match thumbnail aspect ratio
        link.setAttribute('data-pswp-width', baseWidth);
        link.setAttribute('data-pswp-height', calculatedHeight);
      }
    });
  }
  
  // Listen for image load events
  images.forEach(function(img) {
    if (img.complete) {
      imageLoaded();
    } else {
      img.addEventListener('load', imageLoaded);
      img.addEventListener('error', imageLoaded); // Handle broken images
    }
  });
  
  // Handle window resize
  let resizeTimer;
  resizeHandler = function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (masonryInstance) {
        masonryInstance.layout();
      }
      // Update PhotoSwipe dimensions after resize
      updatePhotoSwipeDimensions();
    }, 250);
  };
  window.addEventListener('resize', resizeHandler);
}

// Separate function for CSS-only gallery initialization (fallback)
function initCSSGallery(cssGalleryGrid) {
  // Wait for images to load
  const images = cssGalleryGrid.querySelectorAll('img');
  let loadedImages = 0;
  
  function imageLoaded() {
    loadedImages++;
    if (loadedImages === images.length) {
      // Update PhotoSwipe dimensions to match rendered thumbnails
      updateCSSGalleryPhotoSwipeDimensions();
    }
  }
  
  // Function to update PhotoSwipe dimensions for CSS gallery
  function updateCSSGalleryPhotoSwipeDimensions() {
    const galleryItems = cssGalleryGrid.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(function(item) {
      const img = item.querySelector('img');
      const link = item;
      
      if (img && link) {
        // Get the actual rendered dimensions of the thumbnail
        const rect = img.getBoundingClientRect();
        const renderedWidth = Math.round(rect.width);
        const renderedHeight = Math.round(rect.height);
        
        // Calculate aspect ratio from rendered thumbnail
        const thumbnailAspectRatio = renderedWidth / renderedHeight;
        
        // Set PhotoSwipe dimensions to match the thumbnail aspect ratio
        // Use a reasonable large size (1200px width as base) and calculate height
        const baseWidth = 1200;
        const calculatedHeight = Math.round(baseWidth / thumbnailAspectRatio);
        
        // Update PhotoSwipe data attributes to match thumbnail aspect ratio
        link.setAttribute('data-pswp-width', baseWidth);
        link.setAttribute('data-pswp-height', calculatedHeight);
      }
    });
  }
  
  // Listen for image load events
  images.forEach(function(img) {
    if (img.complete) {
      imageLoaded();
    } else {
      img.addEventListener('load', imageLoaded);
      img.addEventListener('error', imageLoaded); // Handle broken images
    }
  });
}

// Expose function globally for Barba.js
window.initializeGallery = initializeGallery;

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGallery);