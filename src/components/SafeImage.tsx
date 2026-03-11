import { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Fallback element when image fails to load */
  fallback: React.ReactNode;
}

/**
 * Image that shows fallback on load error so broken images don't appear on any page.
 */
const SafeImage = ({ src, alt, className, fallback, ...props }: SafeImageProps) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
};

export default SafeImage;
