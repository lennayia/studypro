import { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';

/**
 * Lazy loaded image component with intersection observer
 * Only loads images when they're about to enter viewport
 * Shows skeleton loader while loading
 *
 * Performance benefit: Saves bandwidth and improves initial page load
 */
export const LazyImage = ({
  src,
  alt,
  width,
  height,
  aspectRatio = '16/9',
  borderRadius = 2,
  objectFit = 'cover',
  placeholder = null,
  onLoad,
  sx = {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <Box
      ref={imgRef}
      sx={{
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        aspectRatio,
        borderRadius,
        overflow: 'hidden',
        bgcolor: 'action.hover',
        ...sx,
      }}
      {...props}
    >
      {/* Skeleton/Placeholder while loading */}
      {!isLoaded && (
        <Box sx={{ position: 'absolute', inset: 0 }}>
          {placeholder || (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
            />
          )}
        </Box>
      )}

      {/* Actual image - only render when in viewport */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
    </Box>
  );
};

/**
 * Avatar image with lazy loading
 * Optimized for profile pictures
 */
export const LazyAvatar = ({ src, alt, size = 48, ...props }) => {
  return (
    <LazyImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      aspectRatio="1/1"
      borderRadius="50%"
      objectFit="cover"
      {...props}
    />
  );
};

/**
 * Background image with lazy loading
 * Useful for hero sections, cards, etc.
 */
export const LazyBackgroundImage = ({ src, children, height = 400, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [isInView, src]);

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        height,
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        bgcolor: 'action.hover',
        transition: 'background-image 0.3s ease-in-out',
        ...props.sx,
      }}
      {...props}
    >
      {!isLoaded && <Skeleton variant="rectangular" width="100%" height="100%" />}
      {children}
    </Box>
  );
};
