# Next Steps: Sidebar Component Standardization

## Overview

We're standardizing the sidebar component to replace the blog-specific sidebar with a reusable component that can be used across the site (blog, contact, and future pages).

## ⚠️ Important: Review Project Documentation

**Before making changes, please review the README.md file** to familiarize yourself with:
- Project file structure and organization
- SCSS architecture and component methodology
- Included packages and dependencies
- Build processes and development workflow
- Component naming conventions

## Required Changes

### 1. Create New Standardized Sidebar Component

**File:** `src/assets/css/components/_sidebar.scss`

- Copy content from `_blog-sidebar.scss`
- Update all class names from `blog-sidebar__*` to `sidebar__*`
- Update component header comment to reflect new purpose
- Ensure hover states reference new class names (e.g., `.sidebar__featured-item:hover &`)

### 2. Update Featured Posts Include

**File:** `src/_includes/featured-post.html`

- Change wrapper class from `blog-sidebar` to `sidebar`
- Update all child classes:
  - `blog-sidebar__section` → `sidebar__section`
  - `blog-sidebar__title` → `sidebar__title`
  - `blog-sidebar__featured-list` → `sidebar__featured-list`
  - `blog-sidebar__featured-item` → `sidebar__featured-item`
  - `blog-sidebar__featured-image` → `sidebar__featured-image`
  - `blog-sidebar__featured-content` → `sidebar__featured-content`
  - `blog-sidebar__featured-title` → `sidebar__featured-title`
  - `blog-sidebar__featured-date` → `sidebar__featured-date`

### 3. Update Main Stylesheet

**File:** `src/assets/css/main.scss`

- Change import from `@use 'components/blog-sidebar';` to `@use 'components/sidebar';`
- Ensure proper alphabetical ordering of component imports

### 4. Clean Up Old Files

**File:** `src/assets/css/components/_blog-sidebar.scss`

- Remove this file after confirming new sidebar component works correctly

### 5. Verify Contact Page Compatibility

**Files to check:**
- `src/pages/contact.html`
- Any contact-specific sidebar includes

Ensure contact page sidebar sections can use the new standardized `sidebar__section` class structure.

## Testing Checklist

After implementing changes:

- [ ] Run `npm run build` to ensure no build errors
- [ ] Test blog page sidebar functionality
- [ ] Test contact page sidebar (if applicable)
- [ ] Verify featured posts display correctly
- [ ] Check responsive behavior on mobile/tablet/desktop
- [ ] Confirm hover states work properly
- [ ] Validate CSS class naming consistency

## Benefits of This Change

1. **Reusability**: Single sidebar component for all pages
2. **Consistency**: Unified styling and behavior
3. **Maintainability**: One component to update instead of multiple
4. **Scalability**: Easy to extend for future sidebar needs

## Current Working State

This branch (`working-blog-fix`) is based on commit `5d154b5` which has:
- ✅ Working blog functionality
- ✅ Proper image shortcode syntax (`+` concatenation)
- ✅ Successful build process
- ✅ All blog posts rendering correctly

## Notes

- The current blog sidebar styling is excellent and should be preserved
- The `+` concatenation syntax in image shortcodes is working correctly
- Featured posts collection is functioning properly
- All responsive breakpoints are well-designed

---

**Remember**: Always test changes in development before committing, and refer to the README.md for detailed project information and conventions. 