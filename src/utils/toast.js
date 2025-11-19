import toast from 'react-hot-toast';

/**
 * Custom toast notifications with consistent styling
 * Based on react-hot-toast but with app-specific defaults
 */

const defaultOptions = {
  duration: 4000,
  position: 'bottom-center',
  style: {
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 500,
  },
};

export const showToast = {
  /**
   * Success toast
   */
  success: (message, options = {}) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      icon: '✅',
      style: {
        ...defaultOptions.style,
        background: '#10b981',
        color: '#fff',
        ...options.style,
      },
    });
  },

  /**
   * Error toast
   */
  error: (message, options = {}) => {
    return toast.error(message, {
      ...defaultOptions,
      duration: 5000, // Errors stay longer
      ...options,
      icon: '❌',
      style: {
        ...defaultOptions.style,
        background: '#ef4444',
        color: '#fff',
        ...options.style,
      },
    });
  },

  /**
   * Info toast
   */
  info: (message, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: 'ℹ️',
      style: {
        ...defaultOptions.style,
        background: '#3b82f6',
        color: '#fff',
        ...options.style,
      },
    });
  },

  /**
   * Warning toast
   */
  warning: (message, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: '⚠️',
      style: {
        ...defaultOptions.style,
        background: '#f59e0b',
        color: '#fff',
        ...options.style,
      },
    });
  },

  /**
   * Achievement unlocked toast (special)
   */
  achievement: (achievementName, options = {}) => {
    return toast.success(`Achievement odemčen: ${achievementName}!`, {
      ...defaultOptions,
      duration: 6000,
      ...options,
      icon: '🏆',
      style: {
        ...defaultOptions.style,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontWeight: 600,
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
        ...options.style,
      },
    });
  },

  /**
   * Points earned toast (special)
   */
  points: (points, options = {}) => {
    return toast.success(`+${points} bodů získáno!`, {
      ...defaultOptions,
      duration: 3000,
      ...options,
      icon: '⭐',
      style: {
        ...defaultOptions.style,
        background: '#fbbf24',
        color: '#1f2937',
        fontWeight: 600,
        ...options.style,
      },
    });
  },

  /**
   * Loading toast (promise-based)
   */
  promise: (promise, messages = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Načítání...',
        success: messages.success || 'Hotovo!',
        error: messages.error || 'Něco se pokazilo',
      },
      {
        ...defaultOptions,
        style: {
          ...defaultOptions.style,
        },
      }
    );
  },

  /**
   * Custom toast
   */
  custom: (message, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
    });
  },

  /**
   * Dismiss toast
   */
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

// Export base toast for advanced usage
export { toast };
