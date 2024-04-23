/**
 *
 * @class UndefinedHookPathError
 * @constructor
 * @classdesc The error occurs when a hook has multiple outputs. This results in undefined behaviour.
 * @extends Error
 */
class UndefinedHookPathError extends Error {
  /**
   * @param {string} redId The node-red id of the hook
   * @param {string} hookType The type of the hook
   */
  constructor(redId, hookType) {
    super(`hook ${hookType} with multiple outputs`);
    this.redId = redId;
    this.hookType = hookType;
  }
}

/**
 *
 * @class NodeAlreadyExistsError
 * @classdesc The error occurs when a node with the given name was already registered
 * @extends Error
 */
class NodeAlreadyExistsError extends Error {
  /**
   * @param {string} redId The node-red id of the node.
   * @param {string} nodeName The name of the duplicate node
   */
  constructor(redId, nodeName) {
    super(`node with the name ${nodeName} already exists`);
    this.nodeName = nodeName;
    this.redId = redId;
  }
}

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
  UndefinedHookPathError: UndefinedHookPathError,
  NodeAlreadyExistsError: NodeAlreadyExistsError,
  ValidationError: ValidationError,
  isInt: isInt,
  isFloat: isFloat,
};
