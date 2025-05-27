const esbuild = require('esbuild');
const fs = require('fs');

// CSS is now handled by SCSS compilation in build:scss step
// We just need to copy the compiled CSS to the minified location
const cssSource = 'public/assets/css/style.css';
const cssTarget = 'public/css/styles.min.css';

// Ensure the target directory exists
if (!fs.existsSync('public/css')) {
  fs.mkdirSync('public/css', { recursive: true });
}

// Copy the compiled CSS
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, cssTarget);
  console.log('CSS copied to public/css/styles.min.css');
} else {
  console.error('CSS source file not found:', cssSource);
  process.exit(1);
}

// JS Files to Concatenate (only existing files)
const jsFiles = [];

// Check if gallery.js exists and add it
if (fs.existsSync('src/assets/js/gallery.js')) {
  jsFiles.push('src/assets/js/gallery.js');
}

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
fs.writeFileSync('temp-inline-scroll.js', inlineJs);
jsFiles.push('temp-inline-scroll.js');

// Only create JS entry if we have files to bundle
if (jsFiles.length > 0) {
  // Create a temporary JS entry point that imports all JS files
  const jsImports = jsFiles.map(file => `import "./${file}";`).join('\n');
  fs.writeFileSync('temp-js-entry.js', jsImports);
}

// Build JS (legacy scripts)
esbuild.build({
  entryPoints: ['temp-js-entry.js'],
  outfile: 'public/assets/js/scripts.min.js',
  bundle: true,
  minify: true,
  sourcemap: false, // Set to true for debugging
  format: 'iife', // Use IIFE format since scripts are not modules
  globalName: 'app', // Optional: Expose scripts under a global namespace
}).then(() => {
  console.log('JS concatenated and minified into public/assets/js/scripts.min.js');
  // Clean up temporary files
  fs.unlinkSync('temp-js-entry.js');
  fs.unlinkSync('public/assets/js/inline-scroll.js');
}).catch(err => {
  console.error('JS build failed:', err);
  process.exit(1);
});

