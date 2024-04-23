/**
 * @readonly
 * @enum {string}
 * See villas docs
 */
const PathMode = {
  ANY: "any",
  ALL: "all",
};

/**
 * @typedef {Object} Path
 * @property {string} in
 * @property {string} out
 * @property {boolean} enabled
 * @property {boolean} reverse
 * @property {PathMode} mode
 * @property {string[]} mask
 * @property {number} rate - `>= 0`
 * @property {boolean} original_sequence_no
 * @property {any} hooks
 * @property {uuid} uuid
 * @property {any} affinity
 * @property {boolean} poll
 * @property {boolean} builtin
 * @property {number} queuelen
 */

/**
 * @typedef {Object} InternalPath
 * @property {string} _startRedId
 * @property {import("crypto").UUID} _pendingId
 * @property {string} _next
 * @property {string} in
 * @property {string} out
 * @property {boolean} enabled
 * @property {boolean} reverse
 * @property {PathMode} mode
 * @property {string[]} mask
 * @property {number} rate - `>= 0`
 * @property {boolean} original_sequence_no
 * @property {any} hooks
 * @property {uuid} uuid
 * @property {any} affinity
 * @property {boolean} poll
 * @property {boolean} builtin
 * @property {number} queuelen
 */

/**
 * @typedef {Object} ConfBuilderConfig
 * @property {Object.<string, any>} nodes
 * @property {Path[]} paths
 * @property {Object} http
 * @property {Object} logging
 * @property {Object} stats
 * @property {Object} priority
 * @property {Object} affinity
 * @property {Object} hugepages
 */

module.exports = {
  PathMode: PathMode,
};
