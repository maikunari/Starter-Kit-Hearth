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

// JS Files to bundle
const jsFiles = [];

// Check if nav.js exists and add it
if (fs.existsSync('src/assets/js/nav.js')) {
  jsFiles.push('src/assets/js/nav.js');
}

// Check if gallery.js exists and add it
if (fs.existsSync('src/assets/js/gallery.js')) {
  jsFiles.push('src/assets/js/gallery.js');
}

// Check if main.js exists and add it (replaces barba-transitions.js)
if (fs.existsSync('src/assets/js/main.js')) {
  jsFiles.push('src/assets/js/main.js');
}

// Only create JS entry if we have files to bundle
if (jsFiles.length > 0) {
  // Create a temporary JS entry point that imports all JS files
  const jsImports = jsFiles.map(file => `import "./${file}";`).join('\n');
  fs.writeFileSync('temp-js-entry.js', jsImports);
}

// Only build JS if we have files to bundle
if (jsFiles.length > 0) {
  // Build JS
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
    // Clean up temporary files safely
    if (fs.existsSync('temp-js-entry.js')) {
      fs.unlinkSync('temp-js-entry.js');
    }
  }).catch(err => {
    console.error('JS build failed:', err);
    // Clean up temporary files even on error
    if (fs.existsSync('temp-js-entry.js')) {
      fs.unlinkSync('temp-js-entry.js');
    }
    process.exit(1);
  });
} else {
  console.log('No JS files to bundle');
}
