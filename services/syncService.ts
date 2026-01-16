
/**
 * Global Sync Service
 * This service allows Opal CV Studio to persist data across different devices
 * by using a public persistent key-value store.
 */

const BUCKET_ID = 'opal_cv_global_v2';
const BASE_URL = `https://kvdb.io/${BUCKET_ID}/`;

// Helper to obfuscate keys and ensure consistency across devices
const getCloudKey = (email: string) => {
  const normalized = email.trim().toLowerCase();
  return btoa(normalized).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (e) {
      console.error('Cloud Sync Error (User):', e);
      return false;
    }
  },

  /**
   * Fetches user credentials from the cloud
   */
  async getUser(email: string) {
    const key = getCloudKey(email);
    try {
      const response = await fetch(`${BASE_URL}user_${key}`, {
        cache: 'no-store'
      });
      if (!response.ok) return null;
      const text = await response.text();
      return JSON.parse(text);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumes)
      });
      return response.ok;
    } catch (e) {
      console.error('Cloud Sync Error (Data):', e);
      return false;
    }
  },

  /**
   * Fetches all resumes from the cloud
   */
  async getResumes(email: string) {
    const key = getCloudKey(email);
    try {
      const response = await fetch(`${BASE_URL}data_${key}`, {
        cache: 'no-store'
      });
      if (!response.ok) return [];
      const text = await response.text();
      return JSON.parse(text);
    } catch (e) {
      console.error('Cloud Retrieval Error (Data):', e);
      return [];
    }
  }
};
