/**
 * Validation utilities
 * Univerzální validační funkce použitelné napříč všemi moduly
 */

/**
 * Validace emailové adresy
 * @param {string} email - Email k validaci
 * @returns {boolean} - True pokud je email validní
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validace URL
 * @param {string} url - URL k validaci
 * @returns {boolean} - True pokud je URL validní
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validace telefonního čísla (české formáty)
 * @param {string} phone - Telefonní číslo k validaci
 * @returns {boolean} - True pokud je číslo validní
 */
export const validatePhone = (phone) => {
  const re = /^(\+420)?[0-9\s]{9,13}$/;
  return re.test(phone?.replace(/\s/g, ''));
};

/**
 * Validace minimální délky
 * @param {string} value - Hodnota k validaci
 * @param {number} minLength - Minimální délka
 * @returns {boolean} - True pokud splňuje min. délku
 */
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Validace maximální délky
 * @param {string} value - Hodnota k validaci
 * @param {number} maxLength - Maximální délka
 * @returns {boolean} - True pokud splňuje max. délku
 */
export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

/**
 * Validace povinného pole
 * @param {any} value - Hodnota k validaci
 * @returns {boolean} - True pokud není prázdné
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validace číselného rozsahu
 * @param {number} value - Hodnota k validaci
 * @param {number} min - Minimální hodnota
 * @param {number} max - Maximální hodnota
 * @returns {boolean} - True pokud je v rozsahu
 */
export const validateRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validace hesla (alespoň 8 znaků, obsahuje číslo a písmeno)
 * @param {string} password - Heslo k validaci
 * @returns {boolean} - True pokud je heslo dostatečně silné
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  return hasNumber && hasLetter;
};
