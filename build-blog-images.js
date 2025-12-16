/**
 * Blog Image Processing Script
 *
 * Automatically processes blog images uploaded via Decap CMS:
 * 1. Reads blog post frontmatter to find image paths
 * 2. Renames images to match pageName
 * 3. Crops/resizes to blog header aspect ratio (16:9)
 * 4. Outputs processed images ready for eleventy-img optimization
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  blogDir: './src/blog',
  sourceImageDir: './src/assets/images/blog',
  outputImageDir: './src/assets/images/blog',
  // Target aspect ratio for blog headers (width:height)
  // Based on blog-post.scss: max-width 795px, height 450px at desktop
  aspectRatio: 16 / 9,
  // Maximum width for source images (will be further optimized by eleventy-img)
  maxWidth: 1920,
  // Supported input formats
  supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'],
};

/**
 * Parse frontmatter from a markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let inArray = false;

  for (const line of lines) {
    // Check for array items
    if (line.match(/^\s+-\s+/)) {
      if (currentKey && inArray) {
        const value = line.replace(/^\s+-\s+/, '').trim();
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = [];
        }
        frontmatter[currentKey].push(value);
      }
      continue;
    }

    // Check for key: value pairs
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();

      if (value === '') {
        // Could be start of an array or empty value
        inArray = true;
        frontmatter[currentKey] = [];
      } else {
        inArray = false;
        // Remove quotes if present
        frontmatter[currentKey] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  return frontmatter;
}

/**
 * Get all blog posts and their image info
 */
function getBlogPosts() {
  const posts = [];

  if (!fs.existsSync(CONFIG.blogDir)) {
    console.log('Blog directory not found:', CONFIG.blogDir);
    return posts;
  }

  const files = fs.readdirSync(CONFIG.blogDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(CONFIG.blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (frontmatter && frontmatter.pageName) {
      posts.push({
        file,
        filePath,
        pageName: frontmatter.pageName,
        image: frontmatter.image || null,
        imageAlt: frontmatter.imageAlt || '',
      });
    }
  }

  return posts;
}

/**
 * Find the source image for a blog post
 * Checks both the CMS-uploaded path and existing pageName-based images
 */
function findSourceImage(post) {
  // First, check if there's a CMS-uploaded image referenced in frontmatter
  if (post.image) {
    // CMS stores paths like /images/blog/filename.jpg
    // We need to look in src/assets/images/blog/
    const cmsFilename = path.basename(post.image);
    const cmsPath = path.join(CONFIG.sourceImageDir, cmsFilename);

    if (fs.existsSync(cmsPath)) {
      return { path: cmsPath, filename: cmsFilename };
    }
  }

  // Check for existing pageName-based image
  for (const ext of CONFIG.supportedFormats) {
    const pageNamePath = path.join(CONFIG.sourceImageDir, `${post.pageName}${ext}`);
    if (fs.existsSync(pageNamePath)) {
      return { path: pageNamePath, filename: `${post.pageName}${ext}` };
    }
  }

  // Look for any image that might match (fuzzy match)
  const files = fs.readdirSync(CONFIG.sourceImageDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!CONFIG.supportedFormats.includes(ext)) continue;

    // Check if filename contains pageName or vice versa
    const baseName = path.basename(file, ext).toLowerCase();
    if (baseName.includes(post.pageName.toLowerCase()) ||
        post.pageName.toLowerCase().includes(baseName)) {
      return { path: path.join(CONFIG.sourceImageDir, file), filename: file };
    }
  }

  return null;
}

/**
 * Process a single image: crop to aspect ratio and resize
 */
async function processImage(sourcePath, outputPath, pageName) {
  try {
    // Read the image into a buffer first to avoid same-file issues
    const inputBuffer = fs.readFileSync(sourcePath);
    const metadata = await sharp(inputBuffer).metadata();

    const sourceWidth = metadata.width;
    const sourceHeight = metadata.height;
    const sourceRatio = sourceWidth / sourceHeight;

    let cropWidth, cropHeight, cropLeft, cropTop;

    if (sourceRatio > CONFIG.aspectRatio) {
      // Image is wider than target - crop sides
      cropHeight = sourceHeight;
      cropWidth = Math.round(sourceHeight * CONFIG.aspectRatio);
      cropLeft = Math.round((sourceWidth - cropWidth) / 2);
      cropTop = 0;
    } else {
      // Image is taller than target - crop top/bottom
      cropWidth = sourceWidth;
      cropHeight = Math.round(sourceWidth / CONFIG.aspectRatio);
      cropLeft = 0;
      cropTop = Math.round((sourceHeight - cropHeight) / 2);
    }

    // Calculate output dimensions (max width with aspect ratio)
    const outputWidth = Math.min(cropWidth, CONFIG.maxWidth);
    const outputHeight = Math.round(outputWidth / CONFIG.aspectRatio);

    // Process to a buffer first, then write to file (handles same input/output)
    const outputBuffer = await sharp(inputBuffer)
      .extract({
        left: cropLeft,
        top: cropTop,
        width: cropWidth,
        height: cropHeight,
      })
      .resize(outputWidth, outputHeight, {
        fit: 'fill',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
        progressive: true,
      })
      .toBuffer();

    // Write the processed image
    fs.writeFileSync(outputPath, outputBuffer);

    console.log(`  Processed: ${pageName}.jpg (${outputWidth}x${outputHeight})`);
    return true;
  } catch (error) {
    console.error(`  Error processing ${sourcePath}:`, error.message);
    return false;
  }
}

/**
 * Update frontmatter image path to use the processed image
 */
function updateFrontmatter(post, newImagePath) {
  const content = fs.readFileSync(post.filePath, 'utf-8');
  const relativePath = `/images/blog/${post.pageName}.jpg`;

  // Check if image field needs updating
  if (post.image === relativePath) {
    return false; // Already correct
  }

  let updatedContent;
  if (post.image) {
    // Replace existing image path
    updatedContent = content.replace(
      /^image:\s*.+$/m,
      `image: ${relativePath}`
    );
  } else {
    // Add image field after imageAlt or at end of frontmatter
    updatedContent = content.replace(
      /^(imageAlt:\s*.+)$/m,
      `image: ${relativePath}\n$1`
    );
  }

  if (updatedContent !== content) {
    fs.writeFileSync(post.filePath, updatedContent);
    console.log(`  Updated frontmatter: ${post.file}`);
    return true;
  }

  return false;
}

/**
 * Main processing function
 */
async function processBlogImages() {
  console.log('\n📸 Processing blog images...\n');

  const posts = getBlogPosts();
  console.log(`Found ${posts.length} blog posts\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const post of posts) {
    console.log(`\n📝 ${post.pageName}`);

    // Check if processed image already exists and is up to date
    const targetPath = path.join(CONFIG.outputImageDir, `${post.pageName}.jpg`);
    const sourceImage = findSourceImage(post);

    if (!sourceImage) {
      console.log(`  ⚠️  No source image found`);
      errors++;
      continue;
    }

    // Check if we need to process (source newer than target or target doesn't exist)
    const targetExists = fs.existsSync(targetPath);
    const sourceStats = fs.statSync(sourceImage.path);
    const targetStats = targetExists ? fs.statSync(targetPath) : null;

    // If source is already the target (same filename), check if it needs cropping
    const isAlreadyProcessed = sourceImage.filename === `${post.pageName}.jpg`;

    if (isAlreadyProcessed && targetExists) {
      // Check aspect ratio of existing image
      try {
        const metadata = await sharp(targetPath).metadata();
        const currentRatio = metadata.width / metadata.height;
        const ratioDiff = Math.abs(currentRatio - CONFIG.aspectRatio);

        if (ratioDiff < 0.05) {
          console.log(`  ✓ Already processed (correct aspect ratio)`);
          skipped++;
          continue;
        }
      } catch (e) {
        // Continue to process if we can't read metadata
      }
    }

    // Process the image
    const success = await processImage(sourceImage.path, targetPath, post.pageName);

    if (success) {
      processed++;

      // If source was different file, optionally remove original
      if (sourceImage.filename !== `${post.pageName}.jpg`) {
        // Keep original for now - could add cleanup option later
        console.log(`  ℹ️  Original kept: ${sourceImage.filename}`);
      }
    } else {
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Processed: ${processed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log('='.repeat(50) + '\n');
}

// Run if called directly
if (require.main === module) {
  processBlogImages().catch(console.error);
}

module.exports = { processBlogImages };
