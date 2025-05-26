import barba from '@barba/core';

// Initialize Barba.js with transitions
barba.init({
  transitions: [{
    name: 'fade',
    leave(data) {
      return new Promise(resolve => {
        data.current.container.classList.add('opacity-0');
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    },
    enter(data) {
      return new Promise(resolve => {
        data.next.container.classList.add('opacity-0');
        setTimeout(() => {
          data.next.container.classList.remove('opacity-0');
          resolve();
        }, 50);
      });
    },
    after(data) {
      // Reinitialize PhotoSwipe after transition
      if (typeof PhotoSwipeLightbox !== 'undefined') {
        const lightbox = new PhotoSwipeLightbox({
          gallery: '.pswp-gallery',
          children: 'a',
          pswpModule: () => import('https://unpkg.com/photoswipe@5.4.4/dist/photoswipe.esm.js')
        });
        lightbox.init();
      }

      // Update meta tags and structured data
      const nextTitle = data.next.container.querySelector('title')?.textContent || document.title;
      const nextDescription = data.next.container.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const nextCanonical = data.next.container.querySelector('link[rel="canonical"]')?.getAttribute('href') || window.location.href;
      const nextJsonLd = data.next.container.querySelector('script[type="application/ld+json"]')?.textContent || '';

      document.title = nextTitle;
      document.querySelector('meta[name="description"]').setAttribute('content', nextDescription);
      document.querySelector('link[rel="canonical"]').setAttribute('href', nextCanonical);
      if (nextJsonLd) {
        let script = document.querySelector('script[type="application/ld+json"]');
        if (script) {
          script.textContent = nextJsonLd;
        } else {
          script = document.createElement('script');
          script.setAttribute('type', 'application/ld+json');
          script.textContent = nextJsonLd;
          document.head.appendChild(script);
        }
      }

      window.scrollTo(0, 0);
    }
  }],
  prevent: ({ el, event }) => {
    // Prevent Barba.js transitions on admin page
    return el.href && el.href.includes('/admin');
  }
});

// Custom transition for gallery if needed
barba.hooks.beforeEnter((data) => {
  if (data.next.namespace === 'gallery') {
    // Optional: Add specific transition logic for gallery page if needed
  }
}); 