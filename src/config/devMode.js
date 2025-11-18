/**
 * Development Mode Configuration
 *
 * Set DEV_MODE to true to skip authentication and use a fake user
 * This is useful for development when you don't want to set up Google OAuth
 */

export const DEV_MODE = true;

export const FAKE_USER = {
  id: 'dev-user-123',
  email: 'dev@studypro.test',
  user_metadata: {
    full_name: 'Dev User',
    avatar_url: null,
  },
};

export const FAKE_PROFILE = {
  id: 'dev-user-123',
  email: 'dev@studypro.test',
  full_name: 'Dev User',
  created_at: new Date().toISOString(),
};
