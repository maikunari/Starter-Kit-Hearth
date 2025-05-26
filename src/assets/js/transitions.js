// Check if the View Transitions API is supported
if ('startViewTransition' in document) {
    console.log('View Transitions API is supported');
  
    // Intercept navigation links
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a');
      if (!target || !target.href || target.target === '_blank' || target.href.includes('#')) return;
  
      // Prevent default navigation and trigger view transition
      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = target.href;
      });
    });
  } else {
    console.log('View Transitions API is not supported; falling back to standard navigation');
  }