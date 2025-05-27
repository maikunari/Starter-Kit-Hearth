// Gallery functionality with Masonry.js and PhotoSwipe integration
// Masonry will be loaded via CDN in base.html

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
  const homeGalleryGrid = document.querySelector('.cs-gallery-grid, .gallery__grid');
  
  console.log('Gallery initialization:', {
    galleryGrid: !!galleryGrid,
    homeGalleryGrid: !!homeGalleryGrid,
    masonryAvailable: typeof Masonry !== 'undefined'
  });
  
  // Wait for Masonry to be available if gallery grid exists
  if (galleryGrid) {
    if (typeof Masonry !== 'undefined') {
      initMasonryGallery(galleryGrid);
    } else {
      // Wait for Masonry to load
      const checkMasonry = setInterval(() => {
        if (typeof Masonry !== 'undefined') {
          clearInterval(checkMasonry);
          initMasonryGallery(galleryGrid);
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkMasonry);
        console.error('Masonry failed to load within 5 seconds');
      }, 5000);
    }
  }
  
  // Initialize home page gallery (CSS columns)
  if (homeGalleryGrid) {
    initHomeGallery(homeGalleryGrid);
  }
}

// Separate function for Masonry gallery initialization
function initMasonryGallery(galleryGrid) {
  // Set up initial item widths before Masonry initialization
  const items = galleryGrid.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.style.position = 'absolute';
  });
  
  // Initialize Masonry
  masonryInstance = new Masonry(galleryGrid, {
    itemSelector: '.gallery-item',
    columnWidth: '.gallery-item',
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
      
      // Add loaded class to items for animation
      const items = galleryGrid.querySelectorAll('.gallery-item');
      items.forEach(function(item, index) {
        setTimeout(function() {
          item.classList.add('masonry-loaded');
        }, index * 100); // Stagger the animations
      });
    }
  }
  
  // Function to update PhotoSwipe dimensions based on actual rendered image sizes
  function updatePhotoSwipeDimensions() {
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    
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

// Separate function for home gallery initialization
function initHomeGallery(homeGalleryGrid) {
  // Wait for images to load
  const images = homeGalleryGrid.querySelectorAll('img');
  let loadedImages = 0;
  
  function imageLoaded() {
    loadedImages++;
    if (loadedImages === images.length) {
      // Update PhotoSwipe dimensions to match rendered thumbnails
      updateHomeGalleryPhotoSwipeDimensions();
      
      // Add loaded class to items for animation
      const items = homeGalleryGrid.querySelectorAll('.cs-gallery-item, .gallery__item');
      items.forEach(function(item, index) {
        setTimeout(function() {
          item.classList.add('masonry-loaded');
        }, index * 100); // Stagger the animations
      });
    }
  }
  
  // Function to update PhotoSwipe dimensions for home gallery
  function updateHomeGalleryPhotoSwipeDimensions() {
    const galleryItems = homeGalleryGrid.querySelectorAll('.cs-gallery-item, .gallery__item');
    
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
  
  // Handle window resize for home gallery
  let homeResizeTimer;
  homeResizeHandler = function() {
    clearTimeout(homeResizeTimer);
    homeResizeTimer = setTimeout(function() {
      // Update PhotoSwipe dimensions after resize
      updateHomeGalleryPhotoSwipeDimensions();
    }, 250);
  };
  window.addEventListener('resize', homeResizeHandler);
}

// Expose function globally for Barba.js
window.initializeGallery = initializeGallery;

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGallery);