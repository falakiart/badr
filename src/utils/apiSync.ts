import { BundleOffer, CODOrder, GalleryImage, Review, SiteData, ThemeConfig } from '../types';

/**
 * Fetches the shared site configuration from the server.
 * This guarantees that changes made by the admin are loaded for ANY visitor
 * on any device or new browser session.
 */
export async function fetchSiteData(): Promise<SiteData | null> {
  // Method 1: Try Express API endpoint (Dev / Full-stack environment)
  try {
    const res = await fetch(`/api/site-data?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data as SiteData;
      }
    }
  } catch (err) {
    console.warn('API /api/site-data not available (static host), attempting static fallback...', err);
  }

  // Method 2: Fallback to static /site-data.json (Vercel, GitHub Pages, Netlify CDN)
  try {
    const res = await fetch(`/site-data.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json) {
        // If wrapped in { success, data } or raw SiteData
        if (json.data) return json.data as SiteData;
        return json as SiteData;
      }
    }
  } catch (err) {
    console.warn('Static /site-data.json fallback also failed:', err);
  }

  return null;
}

/**
 * Persists site data changes (gallery photos, theme, bundles, reviews, orders)
 * to the central server so that all visitors see the new changes instantly.
 */
export async function saveSiteData(partial: Partial<SiteData>): Promise<boolean> {
  try {
    const res = await fetch('/api/site-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partial),
    });
    if (!res.ok) {
      console.warn('Failed to persist site data to server:', res.status);
      return false;
    }
    const result = await res.json();
    return !!result.success;
  } catch (err) {
    console.error('Error saving site data to server:', err);
    return false;
  }
}

/**
 * Submits a new customer COD order to the server so that it is visible
 * in the admin dashboard across all devices.
 */
export async function submitOrderToServer(order: CODOrder): Promise<boolean> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to submit order to server:', err);
    return false;
  }
}

/**
 * Resizes and compresses an image file to max 1280px to ensure fast upload
 * and flawless rendering across all devices.
 */
async function compressImageForUpload(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    return file;
  }
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            'image/jpeg',
            0.88
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a photo or video file directly to the server's public /uploads directory.
 * Returns the public URL (e.g. /uploads/product_photo_123.jpg) which will load
 * seamlessly for ANY visitor who enters the site!
 */
export async function uploadMediaToServer(file: File): Promise<string> {
  try {
    // Compress image first if it's an image file
    const uploadBlob = await compressImageForUpload(file);
    const formData = new FormData();
    formData.append('file', uploadBlob, file.name.replace(/\.[^/.]+$/, '') + '.jpg');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.url) {
        return json.url;
      }
    }
  } catch (err) {
    console.warn('Multipart upload failed, trying base64 fallback:', err);
  }

  // Method 2: Base64 JSON fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file for upload'));
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64Data,
            filename: file.name,
            mimeType: file.type,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json && json.url) {
            resolve(json.url);
            return;
          }
        }
        // If even server upload fails, return the base64 data directly so the image still works!
        resolve(base64Data);
      } catch (e) {
        // Fallback to base64 data directly
        resolve(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
}
