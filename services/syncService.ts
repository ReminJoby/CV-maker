
/**
 * Global Sync Service
 * This service allows Opal CV Studio to persist data across different devices
 * by using a public persistent key-value store.
 */

// Unique bucket ID for fresh deployment
const BUCKET_ID = 'opal_cv_v4_resilient_sync';
const BASE_URL = `https://kvdb.io/${BUCKET_ID}/`;

/**
 * Creates a safe, URL-friendly key from an email
 */
const getCloudKey = (email: string) => {
  const normalized = email.trim().toLowerCase();
  // Safe Base64 variant
  return btoa(normalized)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export const syncService = {
  /**
   * Saves user credentials and profile globally
   */
  async saveUser(user: any, password: any) {
    const key = getCloudKey(user.email);
    const payload = { ...user, password, updatedAt: Date.now() };
    try {
      const response = await fetch(`${BASE_URL}user_${key}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (e) {
      console.error('Cloud Sync Error (User):', e);
      return false;
    }
  },

  /**
   * Fetches user credentials from the cloud with cache busting
   */
  async getUser(email: string) {
    const key = getCloudKey(email);
    const timestamp = Date.now();
    try {
      const response = await fetch(`${BASE_URL}user_${key}?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) return null;
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        return null;
      }
    } catch (e) {
      console.error('Cloud Retrieval Error (User):', e);
      return null;
    }
  },

  /**
   * Saves all resumes to the cloud
   */
  async saveResumes(email: string, resumes: any[]) {
    const key = getCloudKey(email);
    try {
      const response = await fetch(`${BASE_URL}data_${key}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resumes)
      });
      return response.ok;
    } catch (e) {
      console.error('Cloud Sync Error (Data):', e);
      return false;
    }
  },

  /**
   * Fetches all resumes from the cloud with cache busting
   */
  async getResumes(email: string) {
    const key = getCloudKey(email);
    const timestamp = Date.now();
    try {
      const response = await fetch(`${BASE_URL}data_${key}?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) return [];
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        return [];
      }
    } catch (e) {
      console.error('Cloud Retrieval Error (Data):', e);
      return [];
    }
  }
};
