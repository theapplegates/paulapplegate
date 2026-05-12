/**
 * Cloudinary URL builder
 *
 * Every URL produced here includes `f_auto` and `q_auto` by default:
 *   f_auto — serves WebP to Chrome, AVIF where supported, JPEG as fallback
 *   q_auto — picks the lowest quality level the human eye won't notice
 *
 * Set PUBLIC_CLOUDINARY_CLOUD_NAME in your .env file.
 * Falls back to Cloudinary's public "demo" cloud so the site works out of the box.
 */

const CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'demo';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  /** How to fit the image into the given dimensions */
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  /** Where to anchor the crop */
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south';
  /** Gaussian blur strength (e.g. 300 for a hero backdrop) */
  blur?: number;
  grayscale?: boolean;
}

function buildTransformations(options: CloudinaryOptions): string {
  const t: string[] = ['f_auto', 'q_auto'];

  if (options.width)     t.push(`w_${options.width}`);
  if (options.height)    t.push(`h_${options.height}`);
  if (options.crop)      t.push(`c_${options.crop}`);
  if (options.gravity)   t.push(`g_${options.gravity}`);
  if (options.blur)      t.push(`e_blur:${options.blur}`);
  if (options.grayscale) t.push('e_grayscale');

  return t.join(',');
}

/** Returns a single optimized Cloudinary URL */
export function getImageUrl(publicId: string, options: CloudinaryOptions = {}): string {
  return `${BASE_URL}/${buildTransformations(options)}/${publicId}`;
}

/**
 * Returns a srcset string for responsive images.
 * Each entry is the same image re-encoded at a different pixel width —
 * the browser picks the best one based on the current viewport.
 */
export function getSrcSet(
  publicId: string,
  widths: number[] = [400, 800, 1200, 1600],
  options: Omit<CloudinaryOptions, 'width'> = {},
): string {
  return widths
    .map(w => `${getImageUrl(publicId, { ...options, width: w })} ${w}w`)
    .join(', ');
}
