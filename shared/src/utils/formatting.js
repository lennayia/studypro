/**
 * Formatting utilities
 * Univerzální formátovací funkce pro čísla, ceny, text
 */

export const formatPrice = (price, currency = 'CZK', locale = 'cs-CZ') => {
  if (!price || price === 0) return 'Zdarma';
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
  return formatted;
};

export const formatNumber = (num, locale = 'cs-CZ') => {
  if (num === null || num === undefined) return '';
  return new Intl.NumberFormat(locale).format(num);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatPercent = (value, isDecimal = false, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  const percent = isDecimal ? value * 100 : value;
  return `${percent.toFixed(decimals)}%`;
};

export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};
