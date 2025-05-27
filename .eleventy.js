// imports for the various eleventy plugins (navigation & image)
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const { DateTime } = require('luxon');
const Image = require('@11ty/eleventy-img');
const path = require('path');

// allows the use of {% image... %} to create responsive, optimised images
async function imageShortcode(src, alt, className, loading = 'lazy', sizes = '(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px') {
  // don't pass an alt? chuck it out. passing an empty string is okay though
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  // create the metadata for an optimised image
  let metadata = await Image(`${src}`, {
    widths: [300, 600, 1200],
    formats: ['avif', 'webp', 'jpeg'],
    urlPath: '/images/',
    outputDir: './public/images/',
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    },
  });

  // get the smallest and biggest image for picture/image attributes
  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  // when {% image ... %} is used, this is what's returned
  return `<picture class="${className || ''}">
    ${Object.values(metadata)
      .map((imageFormat) => {
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat
          .map((entry) => entry.srcset)
          .join(', ')}" sizes="${sizes}">`;
      })
      .join('\n')}
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="${loading}"
        decoding="async">
    </picture>`;
}

module.exports = function (eleventyConfig) {
  // Adds the navigation plugin for easy navs
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Allows css, assets, robots.txt, and CMS config files to be passed into /public
  eleventyConfig.addPassthroughCopy('./src/css/**/*.css');
  eleventyConfig.addPassthroughCopy('./src/assets');
  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPassthroughCopy('./src/_redirects');
  eleventyConfig.addPassthroughCopy({ './src/robots.txt': '/robots.txt' });

  // Passthrough copy for Barba.js and GSAP
  eleventyConfig.addPassthroughCopy('src/assets/js/**/*.js');
  eleventyConfig.addPassthroughCopy({ 'js/barba.js': 'js/barba.js' });
  eleventyConfig.addPassthroughCopy({ 'node_modules/@barba/core/dist/barba.mjs': 'js/barba.mjs' });

  // Open on npm start and watch CSS files for changes - doesn't trigger 11ty rebuild
  eleventyConfig.setBrowserSyncConfig({
    open: true,
    files: './public/css/**/*.css',
  });

  // Allows the {% image %} shortcode to be used for optimised images (in webp if possible)
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);

  // Normally, 11ty will render dates on blog posts in full JSDate format (Fri Dec 02 18:00:00 GMT-0600). That's ugly
  // This filter allows dates to be converted into a normal, locale format
  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  // Critical CSS transform - disabled for development
  // eleventyConfig.addTransform('criticalCss', async function(content, outputPath) {
  //   if (outputPath && outputPath.endsWith('.html')) {
  //     try {
  //       const criticalModule = await import('critical');
  //       const critical = criticalModule.default || criticalModule;
  //       const result = await critical.generate({
  //         inline: true,
  //         base: 'public/',
  //         html: content,
  //         width: 1280,
  //         height: 800,
  //         css: ['public/assets/css/style.css']
  //       });
  //       return result.html;
  //     } catch (err) {
  //       console.error(`Critical CSS transform failed for ${outputPath}:`, err);
  //       return content;
  //     }
  //   }
  //   return content;
  // });

  // Gallery Shortcode for PhotoSwipe
  eleventyConfig.addNunjucksAsyncShortcode("gallery", async function (images) {
    if (!images || !Array.isArray(images)) return '';

    const galleryItems = await Promise.all(images.map(async (item, index) => {
      const src = item.image;
      const alt = item.alt || `Gallery image ${index + 1}`;

      const metadata = await Image(`./${src}`, {
        widths: [600, 1200],
        formats: ['avif', 'webp', 'jpeg'],
        outputDir: './public/images/',
        urlPath: '/images/',
      });

      const thumb = metadata.jpeg.find(img => img.width === 600);
      const full = metadata.jpeg.find(img => img.width === 1200);

      return `
        <a href="${full.url}" data-pswp-width="1200" data-pswp-height="auto" class="pswp-gallery__item">
          <img src="${thumb.url}" alt="${alt}" class="w-full h-auto object-cover" />
        </a>
      `;
    }));

    return `
      <div class="masonry-grid pswp-gallery" id="gallery">
        ${galleryItems.join('')}
      </div>
    `;
  });

  // Filter to conditionally apply Barba container (already present)
  eleventyConfig.addFilter('barbaContainer', function(content, url) {
    if (url === '/admin/') {
      return content;
    }
    return `<div data-barba="container" data-barba-namespace="${this.ctx.page.fileSlug}">${content}</div>`;
  });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_layouts',
      output: 'public',
    },
    htmlTemplateEngine: 'njk',
  };
};