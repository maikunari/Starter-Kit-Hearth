// Gallery functionality with Masonry.js and PhotoSwipe integration
// Masonry will be loaded via CDN in base.html

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const galleryGrid = document.querySelector('.gallery-grid');
  
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
          
          // Update the data attributes for PhotoSwipe
          // We'll use the original large image dimensions for the full size
          // but ensure the aspect ratio matches the thumbnail
          const originalWidth = parseInt(link.getAttribute('data-pswp-width')) || 1200;
          const originalHeight = parseInt(link.getAttribute('data-pswp-height')) || 800;
          
          // Calculate aspect ratio from rendered thumbnail
          const thumbnailAspectRatio = renderedWidth / renderedHeight;
          
          // Adjust the PhotoSwipe dimensions to match thumbnail aspect ratio
          let pswpWidth = originalWidth;
          let pswpHeight = Math.round(originalWidth / thumbnailAspectRatio);
          
          // If the calculated height is larger than original, scale down
          if (pswpHeight > originalHeight) {
            pswpHeight = originalHeight;
            pswpWidth = Math.round(originalHeight * thumbnailAspectRatio);
          }
          
          // Update PhotoSwipe data attributes
          link.setAttribute('data-pswp-width', pswpWidth);
          link.setAttribute('data-pswp-height', pswpHeight);
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
}); 