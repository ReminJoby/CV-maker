
/**
 * Global Sync Service
 * This service allows Opal CV Studio to persist data across different devices
 * by using a public persistent key-value store.
 */

const BUCKET_ID = 'opal_cv_global_v2';
const BASE_URL = `https://kvdb.io/${BUCKET_ID}/`;

// Helper to obfuscate keys (simple Base64 for demo purposes)
const getCloudKey = (email: string) => btoa(email.toLowerCase()).replace(/=/g, '');

export const syncService = {
  /**
   * Saves user credentials and profile globally
   */
  async saveUser(user: any, password: any) {
    const key = getCloudKey(user.email);
    const payload = { ...user, password, updatedAt: Date.now() };
    try {
      await fetch(`${BASE_URL}user_${key}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return true;
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
      const response = await fetch(`${BASE_URL}user_${key}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  /**
   * Saves all resumes to the cloud
   */
  async saveResumes(email: string, resumes: any[]) {
    const key = getCloudKey(email);
    try {
      await fetch(`${BASE_URL}data_${key}`, {
        method: 'POST',
        body: JSON.stringify(resumes)
      });
      return true;
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
      const response = await fetch(`${BASE_URL}data_${key}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      return [];
    }
  }
};
