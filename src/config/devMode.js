/**
 * Development Mode Configuration
 *
 * Set DEV_MODE to true to skip authentication and use a fake user
 * This is useful for development when you don't want to set up Google OAuth
 */

export const DEV_MODE = true;

// UUID pro dev uživatele - pevný UUID aby fungoval s databází
const DEV_USER_UUID = '00000000-0000-0000-0000-000000000001';

export const FAKE_USER = {
  id: DEV_USER_UUID,
  email: 'dev@studypro.test',
  user_metadata: {
    full_name: 'Dev User',
    avatar_url: null,
  },
};

export const FAKE_PROFILE = {
  id: DEV_USER_UUID,
  email: 'dev@studypro.test',
  full_name: 'Dev User',
  created_at: new Date().toISOString(),
};
