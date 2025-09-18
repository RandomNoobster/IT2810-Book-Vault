/**
 * Formats a number by adding spaces as thousand separators.
 *
 * @param {number} number - The input number to format
 * @returns {string} The formatted number string with space separators
 *
 * @example
 * // returns '1 000'
 * formatNumberWithSpaces(1000);
 *
 * @example
 * // returns '1 000 000'
 * formatNumberWithSpaces(1000000);
 */
export const formatNumberWithSpaces = (number: number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// The regular expression used in the replace method:
// \B - matches a non-word boundary to avoid adding spaces at the start of the string.
// (?=(\d{3})+(?!\d)) - positive lookahead to find positions followed by a group of three digits not followed by another digit.

/**
 * Formats a given name into an abbreviation suitable for an avatar.
 * The abbreviation consists of the first letter of the first two words in the name.
 *
 * @param name - The full name to be abbreviated.
 * @returns The abbreviation formed by the first letters of the first two words.
 */
export const formatAvatarAbbreviation = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
};
