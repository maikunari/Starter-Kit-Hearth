const esbuild = require('esbuild');
const fs = require('fs');

// CSS Files to Concatenate
const cssFiles = [
  'public/css/root.css',
  'public/css/dark.css',
  'public/css/critical.css',
  'public/css/home.css',
  'public/css/about.css',
  'public/css/gallery.css',
  'public/css/blog.css',
  'public/css/contact.css',
  'public/css/reviews.css'
];

// JS Files to Concatenate (excluding PhotoSwipe, which uses ES modules via CDN)
const jsFiles = [
  'public/assets/js/nav.js',
  'public/assets/js/dark.js',
];

// Inline JS (the scroll script)
const inlineJs = `
document.addEventListener('scroll', (e) => {
    const scroll = document.documentElement.scrollTop;
    if (scroll >= 100) {
        document.querySelector('body').classList.add('scroll');
    } else {
        document.querySelector('body').classList.remove('scroll');
    }
});
`;

// Write inline JS to a temporary file
fs.writeFileSync('public/assets/js/inline-scroll.js', inlineJs);
jsFiles.push('public/assets/js/inline-scroll.js');

// Create a temporary CSS entry point that imports all CSS files
const cssImports = cssFiles.map(file => `@import "${file}";`).join('\n');
fs.writeFileSync('temp-css-entry.css', cssImports);

// Create a temporary JS entry point that imports all JS files
const jsImports = jsFiles.map(file => `import "${file}";`).join('\n');
fs.writeFileSync('temp-js-entry.js', jsImports);

// Build CSS
esbuild.build({
  entryPoints: ['temp-css-entry.css'],
  outfile: 'public/css/styles.min.css',
  bundle: true,
  minify: true,
  sourcemap: false, // Set to true for debugging
}).then(() => {
  console.log('CSS concatenated and minified into public/css/styles.min.css');
  // Clean up temporary CSS entry file
  fs.unlinkSync('temp-css-entry.css');
}).catch(err => {
  console.error('CSS build failed:', err);
  process.exit(1);
});

// Build JS
esbuild.build({
  entryPoints: ['temp-js-entry.js'],
  outfile: 'public/js/scripts.min.js',
  bundle: true,
  minify: true,
  sourcemap: false, // Set to true for debugging
  format: 'iife', // Use IIFE format since scripts are not modules
  globalName: 'app', // Optional: Expose scripts under a global namespace
}).then(() => {
  console.log('JS concatenated and minified into public/js/scripts.min.js');
  // Clean up temporary files
  fs.unlinkSync('temp-js-entry.js');
  fs.unlinkSync('public/assets/js/inline-scroll.js');
}).catch(err => {
  console.error('JS build failed:', err);
  process.exit(1);
});