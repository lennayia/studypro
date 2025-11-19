/**
 * Image optimization utilities
 */

/**
 * Resize and compress an image file
 * @param {File} file - Original image file
 * @param {Object} options - Resize options
 * @returns {Promise<Blob>} - Optimized image blob
 */
export const resizeImage = async (file, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.85,
    format = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          format,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

/**
 * Generate a placeholder blur image (base64)
 * @param {File} file - Original image file
 * @returns {Promise<string>} - Base64 blur placeholder
 */
export const generatePlaceholder = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = 20; // Very small for blur effect
        const height = Math.round((img.height * width) / img.width);

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.filter = 'blur(10px)';
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

/**
 * Validate image file
 * @param {File} file - Image file
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result { valid: boolean, error?: string }
 */
export const validateImage = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    minWidth = 100,
    minHeight = 100,
  } = options;

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Nepodporovaný formát. Povolené: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Soubor je příliš velký. Maximální velikost je ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Convert image to WebP format (if supported)
 * @param {File} file - Original image file
 * @param {number} quality - WebP quality (0-1)
 * @returns {Promise<Blob>} - WebP blob
 */
export const convertToWebP = async (file, quality = 0.85) => {
  // Check if WebP is supported
  const canvas = document.createElement('canvas');
  const supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

  if (!supported) {
    // Fallback to JPEG
    return resizeImage(file, { format: 'image/jpeg', quality });
  }

  return resizeImage(file, { format: 'image/webp', quality });
};

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => reject(new Error('Failed to load image'));
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

/**
 * Create multiple sizes of an image (for responsive images)
 * @param {File} file - Original image file
 * @param {Array<number>} sizes - Array of widths [400, 800, 1200]
 * @returns {Promise<Array<{size: number, blob: Blob}>>}
 */
export const createResponsiveSizes = async (file, sizes = [400, 800, 1200]) => {
  const promises = sizes.map(async (size) => {
    const blob = await resizeImage(file, {
      maxWidth: size,
      maxHeight: size,
    });
    return { size, blob };
  });

  return Promise.all(promises);
};

/**
 * Lazy image component with placeholder
 */
export const LazyImage = ({ src, alt, placeholder, className, style, onLoad }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoaded(true);
      if (onLoad) onLoad();
    };
    img.onerror = () => setError(true);
  }, [src, onLoad]);

  if (error) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#999' }}>Obrázek nenalezen</span>
      </div>
    );
  }

  return (
    <>
      {placeholder && !loaded && (
        <img
          src={placeholder}
          alt={alt}
          className={className}
          style={{
            ...style,
            filter: 'blur(10px)',
            transition: 'filter 0.3s',
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
        loading="lazy"
      />
    </>
  );
};
