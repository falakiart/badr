import { BundleOffer, CODOrder, GalleryImage, Review, SiteData, ThemeConfig } from '../types';

/**
 * Fetches the shared site configuration from the server.
 * This guarantees that changes made by the admin are loaded for ANY visitor
 * on any device or new browser session.
 */
export async function fetchSiteData(): Promise<SiteData | null> {
  try {
    const res = await fetch('/api/site-data', {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) {
      console.warn('API /api/site-data returned status', res.status);
      return null;
    }
    const json = await res.json();
    if (json && json.success && json.data) {
      return json.data as SiteData;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch site data from server:', err);
    return null;
  }
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
 * Uploads a photo or video file directly to the server's public /uploads directory.
 * Returns the public URL (e.g. /uploads/product_photo_123.jpg) which will load
 * seamlessly for ANY visitor who enters the site!
 */
export async function uploadMediaToServer(file: File): Promise<string> {
  // Method 1: Multipart FormData (optimal for large files & videos)
  try {
    const formData = new FormData();
    formData.append('file', file);

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
        reject(new Error('Server did not return a valid upload URL'));
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsDataURL(file);
  });
}
