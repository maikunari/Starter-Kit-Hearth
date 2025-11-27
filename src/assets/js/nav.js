//
//    Toggle Mobile Navigation
//
function initializeNavigation() {
    const navbarMenu = document.querySelector(".navigation__menu");
    const hamburgerMenu = document.querySelector(".navigation__hamburger");

    if (hamburgerMenu && navbarMenu) {
        // Remove existing listener to prevent duplicates
        const newHamburger = hamburgerMenu.cloneNode(true);
        hamburgerMenu.parentNode.replaceChild(newHamburger, hamburgerMenu);

        newHamburger.addEventListener('click', function() {
            const isNavOpen = navbarMenu.classList.contains("navigation__menu--open");
            if (!isNavOpen) {
                newHamburger.setAttribute("aria-expanded", true);
                newHamburger.classList.add("navigation__hamburger--active");
                navbarMenu.classList.add("navigation__menu--open");
            } else {
                newHamburger.setAttribute("aria-expanded", false);
                newHamburger.classList.remove("navigation__hamburger--active");
                navbarMenu.classList.remove("navigation__menu--open");
            }
        });
    }
}

// Expose globally for Barba.js to call after transitions
window.initializeNavigation = initializeNavigation;

// Initialize on page load
initializeNavigation();
