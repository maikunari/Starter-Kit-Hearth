# Scroll Animation Guide

## Overview
This project uses a systematic approach to scroll animations with GSAP ScrollTrigger. Instead of manually coding animations for each component, we use reusable CSS classes and data attributes.

## How to Add Animations

### Single Element Animation
For individual elements that should fade up when scrolled into view:

```html
<!-- Using data attribute (recommended) -->
<h1 data-animate="fade-up">This title will animate</h1>

<!-- Using CSS class -->
<p class="animate-fade-up">This paragraph will animate</p>
```

### Group Animation (Staggered)
For groups of elements that should animate with a stagger effect:

```html
<!-- Using data attribute (recommended) -->
<div data-animate-group>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Using CSS class -->
<div class="animate-group">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## Animation Behavior

- **Single elements**: Fade up with 0.8s duration
- **Group elements**: Fade up with 0.6s duration and 0.15s stagger between items
- **Trigger point**: Animations start when element reaches 80% from top of viewport
- **Reversible**: Animations reverse when scrolling back up

## Examples

### Hero Section
```html
<section class="hero">
  <div class="hero__content" data-animate-group>
    <span class="hero__topper">Welcome</span>
    <h1 class="hero__title">Main Title</h1>
    <p class="hero__text">Description text</p>
    <a href="#" class="btn">Call to Action</a>
  </div>
</section>
```

### Services Grid
```html
<section class="services" data-animate-group>
  <div class="services__item">Service 1</div>
  <div class="services__item">Service 2</div>
  <div class="services__item">Service 3</div>
</section>
```

### Individual Elements
```html
<h2 data-animate="fade-up">Section Title</h2>
<p data-animate="fade-up">Standalone paragraph</p>
```

## Benefits

1. **Scalable**: Add animations to any new page without touching JavaScript
2. **Consistent**: All animations use the same timing and easing
3. **Maintainable**: Changes to animation behavior happen in one place
4. **Flexible**: Works with any HTML structure
5. **Performance**: Automatically cleans up ScrollTriggers on page transitions

## Technical Details

- Animations are initialized by `initScrollAnimations()` in `barba-transitions.js`
- CSS pre-hiding is handled in `utilities/_animations.scss`
- Fallback for no-JS users shows content normally
- Compatible with Barba.js page transitions 