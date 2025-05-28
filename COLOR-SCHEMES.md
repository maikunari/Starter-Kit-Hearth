# Color Schemes Documentation

This project includes a comprehensive color scheme system with 7 carefully crafted themes. Each theme contains 10 color properties designed to work harmoniously together while maintaining proper contrast ratios for accessibility.

## How to Switch Themes

To change the active color scheme:

1. Open `src/assets/css/abstracts/_schemes.scss`
2. Find the line: `$active-scheme: 'artisan' !default;`
3. Change `'artisan'` to any of the available scheme names
4. Run `npm run build` to compile the changes

**Available schemes:** `artisan`, `modern`, `elegant`, `rustic`, `vibrant`, `minimalist`, `luxury`

## Color Properties

Each scheme includes these 10 color properties:

- **primary**: Main brand color (buttons, links, highlights)
- **primary-shade**: Lighter version of primary (hover states, backgrounds)
- **primary-dark**: Darker version of primary (active states, emphasis)
- **primary-light**: Very light version of primary (subtle backgrounds)
- **header-color**: Color for all headings (h1, h2, h3, etc.)
- **body-text-color**: Color for body text and paragraphs
- **body-text-color-white**: White/light text for dark backgrounds
- **accent**: Secondary brand color (accents, highlights, icons)
- **dark**: Darkest color in the palette (deep backgrounds, strong contrast)
- **medium**: Medium tone color (borders, dividers, subtle elements)

## Available Color Schemes

### 1. Artisan (Current Default)
**Personality**: Warm, crafted, premium, approachable
**Best for**: Craftspeople, artisans, premium services, warm brands, fireplace retailers

**Colors:**
- Primary: `#FFBA19` (Golden Yellow)
- Primary Shade: `#ffd675` (Light Golden)
- Primary Dark: `#805d0d` (Dark Golden)
- Primary Light: `#fff3d6` (Very Light Golden)
- Header Color: `#1a1a1a` (Dark Charcoal)
- Body Text: `#4E4B66` (Muted Purple-Gray)
- Body Text White: `#FAFBFC` (Off-White)
- Accent: `#334756` (Blue-Gray)
- Dark: `#082032` (Deep Navy)
- Medium: `#2C394B` (Medium Blue-Gray)

### 2. Modern
**Personality**: Sleek, tech-inspired, bold, contemporary
**Best for**: Tech companies, startups, digital agencies, modern brands

**Colors:**
- Primary: `#2b6cb0` (Deep Blue)
- Primary Shade: `#4299e1` (Bright Blue)
- Primary Dark: `#1e4a73` (Dark Blue)
- Primary Light: `#e6f3ff` (Very Light Blue)
- Header Color: `#1a202c` (Dark Slate)
- Body Text: `#4a5568` (Medium Gray)
- Body Text White: `#ffffff` (Pure White)
- Accent: `#00b7eb` (Bright Cyan)
- Dark: `#1a365d` (Dark Navy)
- Medium: `#2d3748` (Dark Gray)

### 3. Elegant
**Personality**: Refined, luxurious, professional, sophisticated
**Best for**: Law firms, consulting, high-end services, professional brands

**Colors:**
- Primary: `#2c5282` (Navy Blue)
- Primary Shade: `#4299e1` (Bright Blue)
- Primary Dark: `#1e3a5f` (Dark Navy)
- Primary Light: `#e6f3ff` (Very Light Blue)
- Header Color: `#2d3748` (Dark Gray)
- Body Text: `#4a4a4a` (Warm Gray)
- Body Text White: `#ffffff` (Pure White)
- Accent: `#d4af37` (Gold)
- Dark: `#1a202c` (Charcoal)
- Medium: `#4a5568` (Medium Gray)

### 4. Rustic
**Personality**: Earthy, organic, natural, warm
**Best for**: Outdoor brands, organic products, eco-friendly companies, natural brands

**Colors:**
- Primary: `#2f855a` (Forest Green)
- Primary Shade: `#48bb78` (Bright Green)
- Primary Dark: `#22543d` (Dark Green)
- Primary Light: `#f0fff4` (Very Light Green)
- Header Color: `#3c2f2f` (Dark Brown)
- Body Text: `#553c3c` (Brown-Gray)
- Body Text White: `#ffffff` (Pure White)
- Accent: `#d69e2e` (Mustard Yellow)
- Dark: `#2d1b1b` (Very Dark Brown)
- Medium: `#4a3636` (Medium Brown)

### 5. Vibrant
**Personality**: Bold, energetic, lively, dynamic
**Best for**: Creative agencies, entertainment, youth brands, energetic brands

**Colors:**
- Primary: `#00a3ff` (Electric Blue)
- Primary Shade: `#38b2ff` (Bright Blue)
- Primary Dark: `#0077cc` (Dark Blue)
- Primary Light: `#e6f7ff` (Very Light Blue)
- Header Color: `#1a202c` (Dark Slate)
- Body Text: `#2d3748` (Dark Gray)
- Body Text White: `#ffffff` (Pure White)
- Accent: `#ff4b5c` (Coral Red)
- Dark: `#1a1a1a` (Black)
- Medium: `#4a5568` (Medium Gray)

### 6. Minimalist
**Personality**: Simple, clean, professional, understated
**Best for**: Architecture, design studios, minimal brands, clean aesthetics

**Colors:**
- Primary: `#4a5568` (Slate Gray)
- Primary Shade: `#718096` (Light Gray)
- Primary Dark: `#2d3748` (Dark Gray)
- Primary Light: `#f7fafc` (Very Light Gray)
- Header Color: `#1a202c` (Charcoal)
- Body Text: `#4a5568` (Slate Gray)
- Body Text White: `#ffffff` (Pure White)
- Accent: `#4fd1c5` (Soft Teal)
- Dark: `#1a1a1a` (Black)
- Medium: `#2d3748` (Dark Gray)

### 7. Luxury
**Personality**: Sophisticated, dark, opulent, exclusive
**Best for**: Luxury brands, high-end products, exclusive services, premium brands

**Colors:**
- Primary: `#b89778` (Antique Gold)
- Primary Shade: `#d4b896` (Light Gold)
- Primary Dark: `#8b6f56` (Dark Gold)
- Primary Light: `#f0e8df` (Very Light Gold)
- Header Color: `#f1edeb` (Ivory)
- Body Text: `#c4c0bb` (Light Gray)
- Body Text White: `#ffffff` (Pure White)
- Accent: `#2a6041` (Emerald Green)
- Dark: `#1a1a1a` (Deep Charcoal)
- Medium: `#2d2d2d` (Medium Charcoal)

## Technical Implementation

### File Structure
```
src/assets/css/abstracts/
├── _schemes.scss      # Color scheme definitions and functions
└── _variables.scss    # Variables that use the active scheme
```

### Functions Available

#### `color($key)`
Retrieves a color from the currently active scheme.
```scss
.button {
  background-color: schemes.color(primary);
  color: schemes.color(body-text-color-white);
}
```

#### `scheme-color($scheme-name, $key)`
Retrieves a color from a specific scheme (useful for testing).
```scss
.special-element {
  background-color: schemes.scheme-color('luxury', 'primary');
}
```

### Error Handling
The system includes comprehensive error handling:
- Invalid scheme names will show available options
- Invalid color keys will show available keys for the current scheme
- Clear error messages help with debugging

## Accessibility Considerations

All color schemes have been designed with accessibility in mind:
- Proper contrast ratios between text and background colors
- Multiple shades of primary colors for different use cases
- Dedicated white text color for dark backgrounds
- Clear distinction between primary and accent colors

## Adding New Schemes

To add a new color scheme:

1. Open `src/assets/css/abstracts/_schemes.scss`
2. Add your new scheme to the `$color-schemes` map
3. Include all 10 required color properties
4. Test the scheme by setting it as the active scheme
5. Update this documentation with the new scheme details

## Best Practices

- Always use the `schemes.color()` function instead of hardcoded colors
- Test your chosen scheme across all pages before deployment
- Consider your brand personality when choosing a scheme
- Ensure sufficient contrast for accessibility compliance
- Use the primary color sparingly for maximum impact 