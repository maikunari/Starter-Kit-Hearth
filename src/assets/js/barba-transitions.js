import barba from 'https://unpkg.com/@barba/core@2.9.7/dist/barba.mjs';

// Initialize Barba.js
barba.init({
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

// Hook to reinitialize scripts after page transition
barba.hooks.after(() => {
  // Re-run any global scripts that need to be reinitialized
  
  // Reinitialize navigation if needed
  if (typeof window.initializeNavigation === 'function') {
    window.initializeNavigation();
  }
  
  // Scroll to top after transition
  window.scrollTo(0, 0);
});