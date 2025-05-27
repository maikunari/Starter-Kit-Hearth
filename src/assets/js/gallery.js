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
        
        // Add loaded class to items for animation
        const items = galleryGrid.querySelectorAll('.gallery-item');
        items.forEach(function(item, index) {
          setTimeout(function() {
            item.classList.add('masonry-loaded');
          }, index * 100); // Stagger the animations
        });
      }
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
      }, 250);
    });
  }
}); 