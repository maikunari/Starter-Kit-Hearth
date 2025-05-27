# SCSS Architecture Migration Guide

## Overview

We've successfully migrated from a page-based SCSS architecture to a modern component-based system. This new structure follows industry best practices and will make the codebase much more maintainable and scalable.

## New Architecture Structure

```
src/assets/css/
├── abstracts/
│   ├── _variables.scss      # Colors, fonts, breakpoints, z-index scale
│   └── _mixins.scss         # Reusable mixins (responsive fonts, flexbox, etc.)
├── base/
│   └── _reset.scss          # CSS reset, font faces, base typography
├── layout/
│   └── _containers.scss     # Container classes and layout utilities
├── components/
│   ├── _buttons.scss        # All button variations
│   ├── _navigation.scss     # Header navigation (mobile + desktop)
│   ├── _hero.scss           # Hero sections with variants
│   ├── _content-blocks.scss # Side-by-side content sections
│   ├── _gallery.scss        # Gallery components (masonry + PhotoSwipe)
│   ├── _reviews.scss        # Review/testimonial cards
│   ├── _cta.scss           # Call-to-action sections
│   └── _legacy-compatibility.scss # Temporary backward compatibility
├── utilities/
│   └── _spacing.scss        # Margin/padding utility classes
├── pages/
│   └── (future page-specific overrides)
├── main-new.scss           # New main import file
└── main.scss               # Updated to use new architecture
```

## Key Benefits

### 1. **Reusability**
- Components can be used across multiple pages
- No more duplicated CSS for similar elements
- Consistent styling throughout the site

### 2. **Maintainability** 
- Changes to a component affect all instances
- Clear separation of concerns
- Easy to find and modify specific components

### 3. **Scalability**
- Easy to add new components
- Modular structure supports growth
- Better organization for team development

### 4. **Performance**
- Better tree-shaking potential
- Reduced CSS duplication
- More efficient compilation

## Component Usage Examples

### Hero Component
```html
<!-- New component-based approach -->
<section class="hero hero--parallax">
  <div class="hero__picture">
    <img src="hero-image.jpg" alt="Hero">
  </div>
  <div class="hero__container">
    <div class="hero__content">
      <span class="hero__topper">Welcome</span>
      <h1 class="hero__title">Your Title Here</h1>
      <p class="hero__text">Your description text</p>
      <div class="hero__buttons">
        <a href="#" class="btn btn--hero-solid">Get Started</a>
        <a href="#" class="btn btn--hero-transparent">Learn More</a>
      </div>
    </div>
  </div>
</section>
```

### Content Block Component
```html
<!-- Replaces #sbs sections -->
<section class="content-block">
  <div class="content-block__container">
    <div class="content-block__left">
      <picture class="content-block__picture content-block__picture--primary">
        <img src="image1.jpg" alt="Primary">
      </picture>
      <picture class="content-block__picture content-block__picture--secondary">
        <img src="image2.jpg" alt="Secondary">
      </picture>
    </div>
    <div class="content-block__right">
      <span class="content-block__topper">About Us</span>
      <h2 class="content-block__title">Our Story</h2>
      <p class="content-block__text">Content here...</p>
      <a href="#" class="btn btn--solid">Learn More</a>
    </div>
  </div>
</section>

<!-- For reversed layout -->
<section class="content-block content-block--reversed">
  <!-- Same structure, but layout is reversed -->
</section>
```

### Button Components
```html
<!-- Primary solid button -->
<a href="#" class="btn btn--solid">Click Me</a>

<!-- Secondary outline button -->
<a href="#" class="btn btn--secondary">Secondary</a>

<!-- Hero buttons -->
<a href="#" class="btn btn--hero-solid">Hero Solid</a>
<a href="#" class="btn btn--hero-transparent">Hero Transparent</a>

<!-- Button sizes -->
<a href="#" class="btn btn--solid btn--small">Small</a>
<a href="#" class="btn btn--solid btn--large">Large</a>

<!-- Button with icon -->
<a href="#" class="btn btn--solid btn--icon">
  Next <span class="btn__icon">→</span>
</a>
```

### Gallery Component
```html
<section class="gallery">
  <div class="gallery__container">
    <div class="gallery__header">
      <span class="gallery__topper">Our Work</span>
      <h2 class="gallery__title">Project Gallery</h2>
      <p class="gallery__text">Description text</p>
    </div>
    <div class="gallery__grid pswp-gallery">
      <a href="large-image1.jpg" class="gallery__item" data-pswp-width="1200" data-pswp-height="800">
        <img src="thumb1.jpg" alt="Project 1">
      </a>
      <!-- More gallery items -->
    </div>
  </div>
</section>

<!-- Home page variant -->
<section class="gallery gallery--home">
  <!-- Smaller, more compact styling -->
</section>
```

## Migration Strategy

### Phase 1: ✅ **COMPLETED**
- [x] Created new component-based architecture
- [x] Extracted reusable components from existing styles
- [x] Set up proper SCSS structure with abstracts, base, components
- [x] Added legacy compatibility layer
- [x] Updated main.scss to use new architecture

### Phase 2: **RECOMMENDED NEXT STEPS**
1. **Update HTML templates** to use new component classes
2. **Test each component** individually
3. **Remove legacy compatibility** once HTML is updated
4. **Migrate remaining page-specific styles** (contact.scss, blog.scss)

### Phase 3: **FUTURE ENHANCEMENTS**
1. Add more utility classes as needed
2. Create additional component variants
3. Implement CSS custom properties for theming
4. Add component documentation

## Backward Compatibility

The current implementation maintains full backward compatibility:
- All existing HTML continues to work
- Legacy ID-based selectors (#hero, #sbs, etc.) still function
- Existing button classes (.button-solid) still work
- No visual changes to the current site

## Utility Classes

New spacing utilities are available:
```html
<!-- Margins -->
<div class="mt-4">Margin top 1rem</div>
<div class="mb-8">Margin bottom 2rem</div>
<div class="mx-auto">Centered horizontally</div>

<!-- Padding -->
<div class="p-6">Padding 1.5rem all sides</div>
<div class="pt-12">Padding top 3rem</div>
```

## Variables and Mixins

### Key Variables
```scss
// Colors
$primary: var(--primary);
$header-color: var(--headerColor);
$body-text-color: var(--bodyTextColor);

// Typography
$topper-font-size: var(--topperFontSize);
$header-font-size: var(--headerFontSize);
$body-font-size: var(--bodyFontSize);

// Spacing
$section-padding: var(--sectionPadding);

// Breakpoints
$tablet: 48em;    // 768px
$desktop: 64em;   // 1024px
$large: 75em;     // 1200px
```

### Useful Mixins
```scss
// Responsive breakpoints
@include mix.tablet-up { /* styles */ }
@include mix.desktop-up { /* styles */ }

// Flexbox utilities
@include mix.flex-center;
@include mix.flex-between;
@include mix.flex-column-center;

// Container
@include mix.container(80rem);

// Image cover
@include mix.image-cover;

// Overlay
@include mix.overlay(#000, 0.7);
```

## File Organization Best Practices

1. **One component per file** - Each component gets its own SCSS file
2. **Use BEM naming** - Block__element--modifier pattern
3. **Group related styles** - Keep variants and states with their base component
4. **Import order matters** - Abstracts → Base → Layout → Components → Utilities
5. **Avoid deep nesting** - Keep selectors shallow for better performance

## Solving the .cs-left/.cs-right Issue

The new `content-block` component fixes the persistent sizing issues:
- **Consistent flexbox layout** across all content blocks
- **Proper flex properties** ensure 50/50 split on desktop
- **Unified responsive behavior** for all side-by-side sections
- **No more conflicting global rules** affecting specific sections

## Next Steps

1. **Test the current implementation** - Verify all pages still work correctly
2. **Plan HTML migration** - Decide which pages to update first
3. **Update templates gradually** - Start with the most frequently used components
4. **Remove legacy code** - Once HTML is updated, clean up old SCSS files
5. **Document components** - Create a style guide for the team

This new architecture provides a solid foundation for future development and will make maintaining and extending the site much easier! 