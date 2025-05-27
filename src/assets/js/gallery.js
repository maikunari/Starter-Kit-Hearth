// Gallery functionality with Masonry.js and PhotoSwipe integration
// Masonry will be loaded via CDN in base.html

// Gallery initialization function
function initializeGallery() {
  // Check for both main gallery page and home page gallery
  const galleryGrid = document.querySelector('.gallery-grid');
  const homeGalleryGrid = document.querySelector('.cs-gallery-grid');
  
  // Initialize main gallery page (projects page)
  if (galleryGrid && typeof Masonry !== 'undefined') {
    // Initialize Masonry
    const masonry = new Masonry(galleryGrid, {
      itemSelector: '.gallery-item',
      columnWidth: '.gallery-item',
      gutter: 20,
      percentPosition: true,
      transitionDuration: '0.3s'
    });
    
    // Wait for images to load before laying out
    const images = galleryGrid.querySelectorAll('img');
    let loadedImages = 0;
    
    function imageLoaded() {
      loadedImages++;
      if (loadedImages === images.length) {
        // All images loaded, relayout masonry
        masonry.layout();
        
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
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        masonry.layout();
        // Update PhotoSwipe dimensions after resize
        updatePhotoSwipeDimensions();
      }, 250);
    });
  }
  
  // Initialize home page gallery (CSS columns masonry)
  if (homeGalleryGrid) {
    // Wait for images to load
    const images = homeGalleryGrid.querySelectorAll('img');
    let loadedImages = 0;
    
    function imageLoaded() {
      loadedImages++;
      if (loadedImages === images.length) {
        // Update PhotoSwipe dimensions to match rendered thumbnails
        updateHomeGalleryPhotoSwipeDimensions();
        
        // Add loaded class to items for animation
        const items = homeGalleryGrid.querySelectorAll('.cs-gallery-item');
        items.forEach(function(item, index) {
          setTimeout(function() {
            item.classList.add('masonry-loaded');
          }, index * 100); // Stagger the animations
        });
      }
    }
    
    // Function to update PhotoSwipe dimensions for home gallery
    function updateHomeGalleryPhotoSwipeDimensions() {
      const galleryItems = homeGalleryGrid.querySelectorAll('.cs-gallery-item');
      
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
    window.addEventListener('resize', function() {
      clearTimeout(homeResizeTimer);
      homeResizeTimer = setTimeout(function() {
        // Update PhotoSwipe dimensions after resize
        updateHomeGalleryPhotoSwipeDimensions();
      }, 250);
    });
  }
}

// Expose function globally for Barba.js
window.initializeGallery = initializeGallery;

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGallery);