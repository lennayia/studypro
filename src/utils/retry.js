/**
 * Retry utility - Retry failed async operations with exponential backoff
 *
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum retry attempts (default: 3)
 * @param {number} options.delay - Initial delay in ms (default: 1000)
 * @param {number} options.backoff - Backoff multiplier (default: 2)
 * @param {Function} options.onRetry - Callback on each retry
 *
 * @returns {Promise} - Result of successful operation
 *
 * @example
 * const data = await retry(
 *   () => supabase.from('courses').select('*'),
 *   {
 *     maxAttempts: 3,
 *     onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error)
 *   }
 * );
 */
export const retry = async (
  fn,
  { maxAttempts = 3, delay = 1000, backoff = 2, onRetry = null } = {}
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        throw new Error(
          `Failed after ${maxAttempts} attempts: ${error.message}`
        );
      }

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt, error);
      }

      // Calculate delay with exponential backoff
      const waitTime = delay * Math.pow(backoff, attempt - 1);

      console.warn(
        `Attempt ${attempt}/${maxAttempts} failed. Retrying in ${waitTime}ms...`,
        error
      );

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};

/**
 * retryWithCondition - Retry with custom condition check
 *
 * @param {Function} fn - Async function to retry
 * @param {Function} shouldRetry - Function to determine if retry should happen
 * @param {Object} options - Same as retry()
 *
 * @example
 * const data = await retryWithCondition(
 *   () => fetchData(),
 *   (error) => error.status === 429 || error.status >= 500,
 *   { maxAttempts: 5 }
 * );
 */
export const retryWithCondition = async (
  fn,
  shouldRetry,
  options = {}
) => {
  let lastError;
  const { maxAttempts = 3, delay = 1000, backoff = 2, onRetry = null } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (!shouldRetry(error) || attempt === maxAttempts) {
        throw error;
      }

      if (onRetry) {
        onRetry(attempt, error);
      }

      const waitTime = delay * Math.pow(backoff, attempt - 1);

      console.warn(
        `Attempt ${attempt}/${maxAttempts} failed. Retrying in ${waitTime}ms...`,
        error
      );

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};

/**
 * isRetryableError - Check if error should be retried
 *
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isRetryableError = (error) => {
  // Network errors
  if (error.message?.includes('Failed to fetch')) return true;
  if (error.message?.includes('Network')) return true;

  // HTTP errors
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  if (error.status && retryableStatuses.includes(error.status)) return true;

  // Supabase specific errors
  if (error.code === 'PGRST301') return true; // Connection error

  return false;
};

/**
 * withRetry - HOF to wrap any async function with retry logic
 *
 * @param {Function} fn - Async function to wrap
 * @param {Object} options - Retry options
 * @returns {Function} - Wrapped function with retry
 *
 * @example
 * const fetchCoursesWithRetry = withRetry(
 *   async () => supabase.from('courses').select('*'),
 *   { maxAttempts: 3 }
 * );
 *
 * const { data, error } = await fetchCoursesWithRetry();
 */
export const withRetry = (fn, options = {}) => {
  return async (...args) => {
    return retry(() => fn(...args), options);
  };
};
