# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Starter Kit Hearth** is an Eleventy-based static site generator for business websites with:
- Theme-aware SCSS architecture (7 pre-built themes)
- GSAP scroll animations with native View Transitions API
- Decap CMS for blog management
- Responsive image optimization via @11ty/eleventy-img
- PhotoSwipe gallery integration with Masonry layouts

**Tech Stack**: Eleventy 3.x, Sass, PostCSS/Autoprefixer, esbuild, GSAP, View Transitions API, Decap CMS

## Essential Commands

### Development
```bash
npm start                 # Start dev server with live reload (http://localhost:8080)
npm run build            # Full production build (clean, compile, optimize, minify)
npm run clean            # Remove public/ directory
```

### Asset Compilation
```bash
npm run build:scss       # Compile Sass + Autoprefixer to compressed CSS
npm run watch:scss       # Watch Sass files for changes
npm run build:assets     # Bundle JS with esbuild
npm run watch:js         # Watch JS files and rebuild on change
npm run postcss          # Run Autoprefixer on compiled CSS
```

### Eleventy Operations
```bash
npm run build:eleventy   # Build Eleventy site only
npm run start:eleventy   # Start Eleventy dev server only
npm run start:proxy      # Start Decap CMS proxy server for local development
```

## Architecture Overview

### Template System
The project uses **two layout approaches**:

1. **Simple Layout** (most pages): Specify `layout: 'base.html'` in frontmatter
2. **Template Inheritance** (complex pages): Use `{% extends "_layouts/base.html" %}` with block overrides

Base layout includes header/footer and provides blocks for: `head`, `body`, `scripts`

### Theme System Architecture
The theming system is the **most critical architectural pattern** - all components must follow it:

**Location**: `src/assets/css/abstracts/_schemes.scss`

**7 Available Themes**:
- `artisan` (default) - Warm golden with blue-gray
- `modern` - Tech-inspired blue
- `elegant` - Sophisticated brown
- `rustic` - Earthy green
- `vibrant` - Energetic red/blue
- `minimalist` - Clean neutral
- `luxury` - Dark premium

**Switch themes** by changing `$active-scheme` variable in `_schemes.scss`

**Critical Rule**: Never hardcode colors. Always use:
```scss
@use '../abstracts/schemes' as schemes;

.component {
  background-color: schemes.color(medium);
  color: schemes.color(body-text-color-white);
  border: 1px solid schemes.color(border-color);
}
```

**13 Theme Properties**:
- `primary`, `primary-shade`, `primary-dark`, `primary-light`
- `header-color`, `body-text-color`, `body-text-color-white`
- `body-bg-color`, `border-color`, `border-color-subtle`
- `accent`, `dark`, `medium`

### SCSS Architecture (7-1 Pattern)
```
src/assets/css/
├── abstracts/      # Variables, mixins, schemes (theme system)
├── base/           # Reset, typography, CSS custom properties
├── components/     # BEM-style components
├── layout/         # Header, footer, containers
├── utilities/      # Spacing, animations, view transitions
├── vendor/         # PhotoSwipe overrides
└── main.scss       # Main entry point
```

### JavaScript Architecture
**Build System**: `build-assets.js` uses esbuild to bundle JS into `public/assets/js/scripts.min.js`

**Key Files**:
- `main.js` - GSAP animations, PhotoSwipe init, View Transitions support
- `gallery.js` - Masonry layout initialization
- `nav.js` - Mobile navigation toggle (supports View Transitions)

**View Transitions API**:
- Native browser page transitions (cross-fade, 300ms)
- Uses `<meta name="view-transition" content="same-origin">` in base layout
- Scripts reinitialize via `pagereveal` event
- Respects `prefers-reduced-motion`

**Animation System**:
Two timing modes for scroll animations:
- **Standard**: 0.8s duration, 0.15s stagger (content-heavy pages)
- **Fast**: 0.6s duration, 0.08s stagger (content-light pages)

Usage:
```html
<!-- Standard -->
<div data-animate-group>
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Fast -->
<div data-animate-group data-animate-fast>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### CSS Custom Properties
Global design tokens in `src/assets/css/base/_reset.scss`:
```css
:root {
  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Image Optimization System
**Shortcode**: `{% image src, alt, className, loading, sizes %}`

**Generated formats**: AVIF, WebP, JPEG at widths [300, 600, 1200]

**Critical Pattern**: The shortcode sets explicit width/height on `<img>` tags. To style images properly:
```scss
.image-container {
  width: calc(120rem / 16);
  height: calc(120rem / 16);

  img {  // Always target the img element
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
```

**Gallery Shortcode**: `{% gallery images %}` - Generates PhotoSwipe-enabled Masonry grid

**Important - Image Loading with View Transitions**:
- Gallery/Masonry images must use `loading="eager"` (not `lazy`)
- Browser lazy loading doesn't re-trigger after View Transitions
- Example: `{% image src, alt, 'gallery__image', 'eager' %}`

### Decap CMS Integration
**Access**: `http://localhost:8080/admin` (local development)

**Configuration**: `src/admin/config.yml`
- Backend: Git Gateway (branch: `develop`)
- Media folder: `src/assets/images/blog/`
- Local backend enabled for development

**Blog Post Schema**:
```yaml
pageName: blog-post-slug          # URL and image filename
blogTitle: Display Title
titleTag: SEO Title
blogDescription: Meta description
author: Author Name
date: ISO date (auto-generated)
tags: [post, optional-tags]       # Must include "post"
image: /images/blog/image.jpg     # Auto-uploaded
imageAlt: Image description
body: Markdown content
```

**Important**: Images are automatically named based on `pageName` field

### Eleventy Configuration (.eleventy.js)
**Key Features**:
- Navigation plugin: `@11ty/eleventy-navigation`
- Image shortcode: `{% image ... %}`
- Gallery shortcode: `{% gallery ... %}`
- Date filters: `postDate` (human-readable), `date` (ISO format for sitemap)
- Critical CSS extraction (production only)
- HTML minification (production only)

**Directory Structure**:
```
input: src/
includes: _includes/
layouts: _layouts/
output: public/
```

### Build Pipeline

**Production Build** (`npm run build`):
1. Clean public/ directory
2. Compile SCSS → CSS (compressed)
3. Autoprefixer adds vendor prefixes
4. Eleventy generates HTML
5. Critical CSS inlined in `<head>`
6. HTML minified
7. esbuild bundles/minifies JS

**Browser Support** (via browserslist):
- Last 2 years of browser versions
- \> 0.5% global usage
- No dead browsers

## Component Development Guidelines

### When Creating/Editing SCSS Components:

1. **Always import schemes**:
```scss
@use '../abstracts/schemes' as schemes;
@use '../abstracts/variables' as vars;
@use '../abstracts/mixins' as mix;
```

2. **Use BEM methodology**:
```scss
.component {
  &__element { }
  &--modifier { }
}
```

3. **Never hardcode colors** - use `schemes.color()` for everything
4. **Test with multiple themes** - switch `$active-scheme` and verify
5. **Use global variables** from `_variables.scss` for spacing, typography, breakpoints
6. **Use CSS custom properties** for runtime-configurable values

### When Adding JavaScript Functionality:

1. **Add to build-assets.js** if creating a new JS file
2. **For page-specific code**, initialize in `DOMContentLoaded` and `pagereveal` events
3. **Gallery/PhotoSwipe code** must be re-initialized after View Transitions
4. **Clean up GSAP ScrollTriggers** before re-initializing: `ScrollTrigger.getAll().forEach(trigger => trigger.kill())`
5. **Expose init functions** on `window` for View Transitions re-initialization

### When Adding Pages:

1. **Simple pages**: Use `layout: 'base.html'` in frontmatter
2. **Complex pages**: Use `{% extends "_layouts/base.html" %}` with block overrides
3. **Add navigation**: Use `eleventyNavigation` plugin syntax in frontmatter
4. **Choose animation speed**: Add `data-animate-group` or `data-animate-group data-animate-fast`

## Development Workflow Best Practices

1. **Always run full build before commits**: `npm run build`
2. **Test responsive behavior** across breakpoints (tablet: 48em, desktop: 64em)
3. **Verify View Transitions work** when adding new interactive elements
4. **Check image optimization output** in `public/images/` after adding images
5. **Test CMS functionality** for blog-related changes

## Critical Files to Know

- `src/_data/client.json` - Business info (name, contact, hours, services)
- `src/assets/css/abstracts/_schemes.scss` - Theme definitions and active theme
- `src/assets/css/abstracts/_variables.scss` - Global spacing, typography, breakpoints
- `src/assets/css/base/_reset.scss` - CSS custom properties, font definitions
- `.eleventy.js` - Eleventy configuration and shortcodes
- `build-assets.js` - JavaScript bundling configuration
- `src/assets/js/main.js` - GSAP animations and View Transitions support
- `netlify.toml` - Netlify deployment config, cache headers, security headers
- `postcss.config.js` - Autoprefixer configuration

## Common Pitfalls to Avoid

1. **Hardcoding colors** instead of using `schemes.color()`
2. **Styling `<picture>` elements** instead of the nested `<img>` tag
3. **Forgetting to re-initialize scripts** after View Transitions (use `pagereveal` event)
4. **Not killing ScrollTriggers** before creating new ones (causes duplicates)
5. **Missing "post" tag** in blog post frontmatter (posts won't appear in collections)
6. **Branch mismatch** in Decap CMS config (must match current Git branch)
7. **Using `loading="lazy"` on gallery images** - breaks with View Transitions, use `eager` instead

## Deployment Notes

**Pre-deployment checklist**:
1. Update `src/_data/client.json` with actual client information
2. Set desired theme in `_schemes.scss`
3. Test all pages with chosen theme
4. Update CMS logo URL in `src/admin/config.yml`
5. Change CMS backend branch to `main` for production
6. Set `local_backend: false` in CMS config
7. Run `npm run build` and verify output

**Netlify deployment** (configured in `netlify.toml`):
- Build command: `npm run build`
- Publish directory: `public`
- Node version: 20
- Cache headers: 1 year for static assets, revalidate for HTML
- Security headers: X-Frame-Options, X-XSS-Protection, etc.
- Enable Netlify Identity for CMS access
- Enable Git Gateway for CMS functionality

**Generated files**:
- `/sitemap.xml` - Auto-generated from all pages

## Form Processing

Basic Netlify form handling is configured. For advanced features (lead scoring, automated follow-ups, seasonal intelligence), see `CUSTOM_API_FORM_PROCESSING.md` for serverless function implementation options.
