// imports for the various eleventy plugins (navigation & image)
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const { DateTime } = require('luxon');
const Image = require('@11ty/eleventy-img');
const path = require('path');

// allows the use of {% image... %} to create responsive, optimised images
// CHANGE DEFAULT MEDIA QUERIES AND WIDTHS
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
  // adds the navigation plugin for easy navs
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // allows css, assets, robots.txt and CMS config files to be passed into /public
  eleventyConfig.addPassthroughCopy('./src/css/**/*.css');
  eleventyConfig.addPassthroughCopy('./src/assets');
  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPassthroughCopy('./src/_redirects');
  eleventyConfig.addPassthroughCopy({ './src/robots.txt': '/robots.txt' });

  // open on npm start and watch CSS files for changes - doesn't trigger 11ty rebuild
  eleventyConfig.setBrowserSyncConfig({
    open: true,
    files: './public/css/**/*.css',
  });

  // allows the {% image %} shortcode to be used for optimised iamges (in webp if possible)
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);

  // normally, 11ty will render dates on blog posts in full JSDate format (Fri Dec 02 18:00:00 GMT-0600). That's ugly
  // this filter allows dates to be converted into a normal, locale format. view the docs to learn more (https://moment.github.io/luxon/api-docs/index.html#datetime)
  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addTransform('criticalCss', async function(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      try {
        const criticalModule = await import('critical');
        const critical = criticalModule.default || criticalModule;
        const result = await critical.generate({
          inline: true,
          base: 'public/',
          html: content,
          width: 1280,
          height: 800,
          css: ['public/css/style.css']
        });
        return result.html;
      } catch (err) {
        console.error(`Critical CSS transform failed for ${outputPath}:`, err);
        return content;
      }
    }
    return content;
  });

  // Gallery Shortcode for PhotoSwipe
  eleventyConfig.addShortcode("gallery", async function (images) {
    if (!images || !Array.isArray(images)) return "<p>No images provided for gallery.</p>";

    console.log("Gallery images:", images);

    const galleryItems = await Promise.all(
      images.map(async (img) => {
        if (!img.path) {
          console.log("No path for image:", img);
          return "";
        }

        try {
          // Generate optimized images
          let stats = await Image(img.path, {
            widths: [600, 1200],
            formats: ["avif", "webp", "jpeg"],
            outputDir: "./public/images/generated/",
            urlPath: "/images/generated/",
            useCache: true,
          });

          console.log("Image stats for", img.path, ":", stats);

          // Get thumbnail (600px or any available) and full-size (1200px or any available) URLs
          const thumb = stats.avif.find((s) => s.width === 600) || stats.webp.find((s) => s.width === 600) || stats.jpeg.find((s) => s.width === 600) || stats.avif[0] || stats.webp[0] || stats.jpeg[0];
          const full = stats.avif.find((s) => s.width === 1200) || stats.webp.find((s) => s.width === 1200) || stats.jpeg.find((s) => s.width === 1200) || stats.avif[stats.avif.length - 1] || stats.webp[stats.webp.length - 1] || stats.jpeg[stats.jpeg.length - 1];

          if (!thumb || !full) {
            console.log("No thumb or full image found for", img.path);
            return "";
          }

          // Calculate aspect ratio for PhotoSwipe data attributes
          const aspectRatio = full.height / full.width;
          const displayHeight = Math.round(1200 * aspectRatio);

          return `
            <a href="${full.url}" 
               data-pswp-width="1200" 
               data-pswp-height="${displayHeight}" 
               target="_blank" 
               class="gallery-item">
              <img src="${thumb.url}" 
                   alt="${img.alt || 'Gallery image'}" 
                   loading="lazy" 
                   decoding="async" />
            </a>
          `;
        } catch (error) {
          console.error("Error processing image", img.path, ":", error);
          return "";
        }
      })
    );

    return `<div class="gallery-grid pswp-gallery">${galleryItems.join("")}</div>`;
  });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_layouts',
      output: 'public',
    },
    // allows .html files to contain nunjucks templating language
    htmlTemplateEngine: 'njk',
  };
};
