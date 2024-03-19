/**
 * ValidationError represents a config validation error in `fieldName`. Message is `message`
 * @extends Error
 */
class ValidationError extends Error {
  constructor(fieldName, message) {
    super(`validation error ${fieldName}: ${message}`);
    this.fieldName = fieldName;
    this.message = message;
  }
}

/**
 * Check whether a input is of type int
 *
 * @param {any} n - The input
 * @returns {boolean} `true` when input is number & int. `false` otherwise
 */
function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

/**
 * Check whether a input is of type float/double
 *
 * @param {any} n - The input
 * @returns {boolean} `true` when input is number & float/double. `false` otherwise
 */
function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

module.exports = {
  ValidationError: ValidationError,
  isInt: isInt,
  isFloat: isFloat,
};
