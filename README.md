# Starter Kit Hearth - Modern Eleventy Business Template + Decap CMS

A modern, theme-aware static site generator built with Eleventy, featuring comprehensive SCSS architecture, scroll animations, and a powerful theming system.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Template Inheritance](#template-inheritance)
- [SCSS Architecture](#scss-architecture)
- [Theme System](#theme-system)
- [Component Development](#component-development)
- [Scroll Animations](#scroll-animations)
- [Blog System](#blog-system)
- [Deployment](#deployment)
- [File Structure](#file-structure)
- [Development Workflow](#development-workflow)

## Template Inheritance

Eleventy supports two main approaches for page layouts, each with different use cases and complexity levels.

### Simple Layout Approach (Recommended)

The simplest and most commonly used approach. Perfect for most pages:

```yaml
---
title: 'Page Title'
layout: 'base.html'
description: 'Page description'
---

<!-- Your page content here -->
<section class="page-banner">
  <h1>{{ title }}</h1>
</section>
```

**How it works:**
- Specify the layout in the front matter
- Page content automatically gets inserted into the layout's `{{ content | safe }}` area
- Clean and straightforward

### Template Inheritance Approach (Advanced)

More powerful but complex approach using Nunjucks template inheritance:

```nunjucks
---
title: 'Page Title'
---

{% extends "_layouts/base.html" %}

{% block head %}
  <link rel="stylesheet" href="/custom.css">
{% endblock %}

{% block body %}
  <section class="custom-section">
    <h1>{{ title }}</h1>
  </section>
{% endblock %}
```

**How it works:**
- Uses `{% extends %}` to inherit from a base template
- Allows overriding specific blocks defined in the base layout
- Provides granular control over different sections (head, body, scripts, etc.)

### When to Use Each Approach

**Use Simple Layout when:**
- Building standard pages (About, Contact, Services, etc.)
- Content fits within the standard page structure
- You want clean, maintainable code

**Use Template Inheritance when:**
- Need custom head content (specific CSS, meta tags)
- Require different body structures
- Building complex, unique page layouts
- Need to override multiple sections of the base template

### Base Layout Structure

The base layout (`src/_layouts/base.html`) provides the foundation:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Standard head content -->
  {% block head %}{% endblock %}
</head>
<body>
  {% include "header.html" %}
  
  <main>
    {% block body %}
      {{ content | safe }}
    {% endblock %}
  </main>
  
  {% include "footer.html" %}
  {% block scripts %}{% endblock %}
</body>
</html>
```

This structure allows both approaches to work seamlessly.

## Overview

This starter kit provides everything needed to create modern, responsive websites with a powerful theming system, scroll animations, and client-friendly blog management. Built on Eleventy with modern SCSS architecture and comprehensive component system.

### Live Demo
Coming Soon

## Quick Start

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm start
```

Visit `http://localhost:8080` to view your site.

## Features

### Core Features
- **Modern Eleventy Setup** - Static site generation with Nunjucks templating
- **Comprehensive Theme System** - 7 pre-built themes with easy switching
- **SCSS Architecture** - Modern, scalable component-based styling
- **Scroll Animations** - GSAP-powered scroll-triggered animations
- **Image Optimization** - Automatic image compression and next-gen formats
- **Decap CMS Integration** - Client-friendly blog management
- **Responsive Design** - Mobile-first, fully responsive layouts
- **SEO Optimized** - Meta tags, sitemaps, and performance optimized

### Advanced Features
- **Component Architecture** - BEM methodology with reusable components
- **Dark/Light Theme Support** - Automatic theme detection and switching
- **Performance Optimized** - 90+ Lighthouse scores out of the box
- **Development Tools** - Live reload, SCSS compilation, asset optimization
- **Accessibility Ready** - WCAG compliant components and markup

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Development Setup

1. **Clone and Install**
   ```bash
   git clone [repository-url]
   cd starter-kit-hearth
   npm install
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```
   This compiles SCSS, processes images, and builds the Eleventy site.

3. **Start Development**
   ```bash
   npm start
   ```
   Starts the development server with live reload at `http://localhost:8080`.

### Available Scripts

- `npm run build` - Full production build
- `npm run build:scss` - Compile SCSS only
- `npm run build:eleventy` - Build Eleventy site only
- `npm run build:assets` - Process and copy assets
- `npm start` - Development server with live reload
- `npm run clean` - Clean build directory

## SCSS Architecture

### Architecture Overview

Our SCSS follows a modern, scalable architecture based on the 7-1 pattern:

```
src/assets/css/
├── abstracts/           # Variables, mixins, functions
│   ├── _variables.scss  # Global variables
│   ├── _mixins.scss     # Reusable mixins
│   └── _schemes.scss    # Theme color schemes
├── base/                # Base styles
│   ├── _reset.scss      # CSS reset
│   └── _typography.scss # Typography rules
├── components/          # Component styles
│   ├── _navigation.scss # Navigation component
│   ├── _hero.scss       # Hero sections
│   ├── _services.scss   # Services component
│   └── ...              # Other components
├── layout/              # Layout components
│   ├── _header.scss     # Site header
│   └── _footer.scss     # Site footer
├── utilities/           # Utility classes
│   └── _transitions.scss # Animation utilities
└── main.scss           # Main import file
```

### Global vs Theme-Specific Variables

#### Global Variables (Theme-Independent)
Located in `_variables.scss`, these apply to all themes:

```scss
// Typography Scale
$topper-font-size: clamp(0.8125rem, 1.6vw, 1rem);
$header-font-size: clamp(1.9375rem, 4.5vw, 3.0625rem);
$body-font-size: clamp(1rem, 1.2vw, 1.125rem);

// Spacing Scale
$section-padding: clamp(3.75em, 7.82vw, 6.25em) 1rem;
$button-spacing: 3rem;

// Breakpoints
$tablet: 48em;    // 768px
$desktop: 64em;   // 1024px

// Transitions
$transition-base: 0.3s ease;
$transition-fast: 0.15s ease;
```

#### Theme-Specific Variables
Use the `color()` function for all colors:

```scss
@use '../abstracts/schemes' as schemes;

.component {
  background-color: schemes.color(medium);
  color: schemes.color(body-text-color-white);
  border: 1px solid schemes.color(border-color);
}
```

### Component Development Guidelines

1. **Use BEM Methodology**
   ```scss
   .component {
     &__element {
       // Element styles
     }
     
     &--modifier {
       // Modifier styles
     }
   }
   ```

2. **Import Required Dependencies**
   ```scss
   @use '../abstracts/variables' as vars;
   @use '../abstracts/mixins' as mix;
   @use '../abstracts/schemes' as schemes;
   ```

3. **Use Theme-Aware Colors**
   ```scss
   // ✅ Correct
   color: schemes.color(primary);
   
   // ❌ Incorrect
   color: #FFBA19;
   ```

## Theme System

### Available Themes

The project includes 7 professionally designed themes:

1. **Artisan** (Default) - Warm golden theme with blue-gray accents
2. **Modern** - Sleek, tech-inspired with bold contrasts
3. **Elegant** - Sophisticated, refined, professional
4. **Rustic** - Earthy, natural, organic feeling
5. **Vibrant** - Energetic, youthful, creative
6. **Minimalist** - Clean, simple, understated
7. **Luxury** - Dark, sophisticated, premium

### Switching Themes

To switch themes, update the `$active-scheme` variable in `src/assets/css/abstracts/_schemes.scss`:

```scss
// Change this line to switch themes
$active-scheme: 'luxury';  // or 'artisan', 'modern', etc.
```

### Theme Properties

Each theme provides 13 color properties:

- `primary` - Main brand color
- `primary-shade` - Lighter version of primary
- `primary-dark` - Darker version of primary
- `primary-light` - Very light background version
- `header-color` - Main heading text color
- `body-text-color` - Body text color
- `body-text-color-white` - White text for dark backgrounds
- `body-bg-color` - Main background color
- `border-color` - Standard border color
- `border-color-subtle` - Subtle border/accent color
- `accent` - Secondary accent color
- `dark` - Darkest color (for shadows, overlays)
- `medium` - Medium tone (for cards, sections)

### Using Colors in Components

#### ✅ Correct Usage
```scss
@use '../abstracts/schemes' as schemes;

.my-component {
  background-color: schemes.color(medium);
  color: schemes.color(body-text-color-white);
  border: 1px solid schemes.color(border-color);
  
  &:hover {
    color: schemes.color(primary);
  }
}
```

#### ❌ Incorrect Usage
```scss
.my-component {
  background-color: #2C394B;  // Don't hardcode colors
  color: #ffffff;             // Don't hardcode colors
  border: 1px solid #e9ecef;  // Don't hardcode colors
}
```

### Working with Transparency

```scss
// ✅ Correct - Theme-aware transparency
.overlay {
  background-color: rgba(schemes.color(dark), 0.6);
  color: rgba(schemes.color(body-text-color-white), 0.8);
}

// ❌ Incorrect - Hardcoded rgba values
.overlay {
  background-color: rgba(0, 0, 0, 0.6);
  color: rgba(255, 255, 255, 0.8);
}
```

## Component Development

### Component Checklist

When creating or updating components:

1. **Import schemes**: `@use '../abstracts/schemes' as schemes;`
2. **Use color() function**: `schemes.color(property-name)`
3. **No hardcoded colors**: No hex values, no hardcoded rgba()
4. **Test with multiple themes**: Switch themes and verify appearance
5. **Check transparency**: Ensure rgba() uses theme colors
6. **Verify shadows**: Use theme-aware shadow colors

### Common Patterns

#### Dark Background Sections
```scss
.dark-section {
  background-color: schemes.color(medium);
  
  .title {
    color: schemes.color(body-text-color-white);
  }
  
  .text {
    color: rgba(schemes.color(body-text-color-white), 0.8);
  }
}
```

#### Interactive Elements
```scss
.interactive-element {
  color: schemes.color(body-text-color);
  border: 1px solid schemes.color(border-color);
  
  &:hover {
    color: schemes.color(primary);
    border-color: schemes.color(primary);
    background-color: rgba(schemes.color(primary), 0.1);
  }
}
```

#### Form Elements
```scss
.form-input {
  background-color: schemes.color(primary-light);
  border: 1px solid schemes.color(border-color);
  color: schemes.color(header-color);
  
  &::placeholder {
    color: rgba(schemes.color(body-text-color), 0.7);
  }
  
  &:focus {
    border-color: schemes.color(primary);
  }
}
```

## Scroll Animations

### GSAP ScrollTrigger Integration

The project uses GSAP ScrollTrigger for smooth, performant scroll animations.

#### Current Animations

- **Hero Content** - Staggered fade-up animations
- **Services Cards** - Individual card animations
- **Content Blocks** - Separate image and content animations
- **Reviews Grid** - Header and grid animations
- **CTA Sections** - Individual element animations

#### Animation Configuration

Animations are configured in `src/assets/js/barba-transitions.js`:

```javascript
// Hero animations
gsap.fromTo('.hero__title, .hero__text, .hero__button', {
  y: 50,
  opacity: 0
}, {
  y: 0,
  opacity: 1,
  duration: 1,
  stagger: 0.2,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top 80%'
  }
});
```

#### Adding New Animations

1. Target elements with appropriate selectors
2. Define initial and final states
3. Configure ScrollTrigger settings
4. Test across different screen sizes

## Blog System

### Decap CMS Integration

The blog system uses Decap CMS for client-friendly content management.

#### Blog Post Structure

```markdown
---
pageName: blog-post-slug
blogTitle: Your Blog Post Title
titleTag: SEO Title Tag
blogDescription: Meta description for SEO
author: Author Name
date: 2024-01-01T12:00:00.000Z
tags:
  - post
  - featured
image: /images/blog/featured-image.jpg
imageAlt: Image description
---

Your blog content in Markdown format...
```

#### Featured Posts

Add `featured` to the tags array to display posts in the featured section:

```yaml
tags:
  - post
  - featured
```

#### CMS Configuration

Blog settings are configured in `src/admin/config.yml`. Customize fields, validation, and editor options as needed.

## Deployment

### Pre-Deployment Checklist

1. **Update Client Data**
   - Edit `src/_data/client.json` with actual client information
   - Update contact details, business name, etc.

2. **Configure Theme**
   - Set desired theme in `_schemes.scss`
   - Test all pages with chosen theme

3. **SEO Setup**
   - Add sitemap.xml to `/src` directory
   - Update robots.txt with correct domain
   - Configure meta tags in page frontmatter

4. **CMS Setup**
   - Update logo URL in `src/admin/config.yml`
   - Configure authentication settings
   - Test CMS functionality

### Netlify Deployment

1. **Connect Repository**
   - Link GitHub/GitLab repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `public`

2. **Enable Identity & Git Gateway**
   - Enable Netlify Identity in site settings
   - Enable Git Gateway for CMS access
   - Configure registration settings (invite-only recommended)

3. **Environment Variables**
   - Set any required environment variables
   - Configure domain settings

## File Structure

```
starter-kit-hearth/
├── src/
│   ├── _data/              # Global data files
│   │   └── client.json     # Client information
│   ├── _includes/          # Reusable components
│   │   ├── header.html     # Site header
│   │   ├── footer.html     # Site footer
│   │   └── featured-post.html
│   ├── _layouts/           # Page layouts
│   │   ├── base.html       # Base layout
│   │   └── blog-post.html  # Blog post layout
│   ├── admin/              # Decap CMS config
│   │   ├── index.html      # CMS interface
│   │   └── config.yml      # CMS configuration
│   ├── assets/             # Static assets
│   │   ├── css/            # SCSS source files
│   │   ├── js/             # JavaScript files
│   │   └── images/         # Unoptimized images
│   ├── blog/               # Blog posts (Markdown)
│   ├── images/             # Images for optimization
│   ├── pages/              # Site pages
│   └── index.html          # Homepage
├── public/                 # Built site (auto-generated)
├── .eleventy.js           # Eleventy configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Development Workflow

### Standard Workflow

1. **Make Changes**
   - Edit SCSS, HTML, or content files
   - Changes are automatically detected

2. **Build & Test**
   ```bash
   npm run build  # Full build
   npm start      # Development server
   ```

3. **Theme Testing**
   - Switch themes in `_schemes.scss`
   - Rebuild and verify all components
   - Test responsive behavior

4. **Deploy**
   - Commit changes to repository
   - Netlify automatically builds and deploys

### Best Practices

- **Always use theme-aware colors** - Never hardcode color values
- **Test multiple themes** - Ensure components work across all themes
- **Follow BEM methodology** - Keep CSS organized and maintainable
- **Optimize images** - Use the image shortcode for automatic optimization
- **Test responsively** - Verify layouts on all screen sizes

### Troubleshooting

#### Build Errors
- Check SCSS syntax and imports
- Verify all color references use `schemes.color()`
- Ensure all required dependencies are imported

#### Theme Issues
- Confirm theme name is spelled correctly
- Check that all components use theme-aware colors
- Verify no hardcoded colors remain

#### CMS Issues
- Check Netlify Identity is enabled
- Verify Git Gateway is configured
- Ensure config.yml syntax is correct

---

## Support

For questions or issues:
1. Check this documentation first
2. Review the Color Usage Guide
3. Test with different themes to isolate issues
4. Check browser console for errors

This starter kit provides a solid foundation for modern, maintainable websites with powerful theming capabilities and excellent developer experience.