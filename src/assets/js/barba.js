import barba from '/js/barba.mjs';

// Reinitialize PhotoSwipe after each transition
function initPhotoSwipe() {
  console.log('Initializing PhotoSwipe...');
  import('https://unpkg.com/photoswipe@5/dist/photoswipe-lightbox.esm.js').then(({ default: PhotoSwipeLightbox }) => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '.pswp-gallery',
      children: 'a',
      pswpModule: () => import('https://unpkg.com/photoswipe@5/dist/photoswipe.esm.js'),
    });
    lightbox.init();
    console.log('PhotoSwipe initialized');
  });
}

// Initialize Barba.js with a fade transition
console.log('Initializing Barba.js...');
barba.init({
  transitions: [{
    name: 'fade',
    // Prevent running on admin page
    before({ next }) {
      console.log('Before transition - Next URL:', next.url.path);
      if (next.url.path.startsWith('/admin')) {
        console.log('Skipping transition for admin page');
        return false;
      }
    },
    leave(data) {
      console.log('Leaving current page:', data.current.url.path);
      return new Promise(resolve => {
        gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            console.log('Leave transition complete');
            resolve();
          }
        });
      });
    },
    enter(data) {
      console.log('Entering next page:', data.next.url.path);
      return new Promise(resolve => {
        gsap.from(data.next.container, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            console.log('Enter transition complete');
            resolve();
          }
        });
      });
    },
    after(data) {
      console.log('After transition - Current URL:', data.next.url.path);
      // Update meta tags
      document.title = data.next.html.querySelector('title').innerText;
      const description = data.next.html.querySelector('meta[name="description"]');
      if (description) {
        document.querySelector('meta[name="description"]').setAttribute('content', description.getAttribute('content'));
      }
      const canonical = data.next.html.querySelector('link[rel="canonical"]');
      if (canonical) {
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
          existingCanonical.setAttribute('href', canonical.getAttribute('href'));
        } else {
          document.head.appendChild(canonical);
        }
      }
      // Update JSON-LD structured data
      const jsonLd = data.next.html.querySelector('script[type="application/ld+json"]');
      if (jsonLd) {
        const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
        if (existingJsonLd) {
          existingJsonLd.remove();
        }
        document.head.appendChild(jsonLd);
      }
      // Reinitialize PhotoSwipe
      initPhotoSwipe();
    }
  }]
});

console.log('Barba.js initialized');

// Initial PhotoSwipe setup on page load
document.addEventListener('DOMContentLoaded', initPhotoSwipe);