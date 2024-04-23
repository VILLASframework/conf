/**
 * @typedef {Object} MessagePayload
 * @prop {string} origin - the type of the message origin
 * @prop {string} originId - the node-red id of the message origin
 * @prop {string[]} trace - the trace from the start node [0] to the origin.
 */

/**
 * @typedef {Object} Message
 * @property {MessagePayload} payload - the payload of the message
 */

module.exports = {};
