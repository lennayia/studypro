/**
 * LocalStorage utilities
 * Univerzální funkce pro práci s localStorage
 */

/**
 * Uložení dat do localStorage
 * @param {string} key - Klíč pod kterým se data uloží
 * @param {any} value - Hodnota k uložení (automaticky JSON.stringify)
 * @returns {boolean} - True pokud se podařilo uložit
 */
export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Načtení dat z localStorage
 * @param {string} key - Klíč pod kterým jsou data uložená
 * @param {any} defaultValue - Výchozí hodnota pokud klíč neexistuje
 * @returns {any} - Načtená a parsovaná hodnota nebo defaultValue
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Odstranění dat z localStorage
 * @param {string} key - Klíč k odstranění
 * @returns {boolean} - True pokud se podařilo odstranit
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Vymazání celého localStorage
 * @returns {boolean} - True pokud se podařilo vymazat
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Kontrola existence klíče v localStorage
 * @param {string} key - Klíč ke kontrole
 * @returns {boolean} - True pokud klíč existuje
 */
export const hasInLocalStorage = (key) => {
  return localStorage.getItem(key) !== null;
};
