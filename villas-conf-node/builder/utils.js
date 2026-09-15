/**
 *
 * @class BidirecitonalMap is a very simple bidirectional (hash)map using two maps.
 * @constructor
 * @classdesc Fast lookuptable. Not that it's needed but nice to have
 * @template T1
 * @template T2
 */
class BidirecitonalMap {
  constructor() {
    this.map = new Map();
    this.reverseMap = new Map();
  }
  /**
   * @param {T1} key
   * @param {T2} value
   */
  set(key, value) {
    this.map.set(key, value);
    this.reverseMap.set(value, key);
  }

  /**
   * @param {T1} key
   * @returns {T2}
   */
  get(key) {
    return this.map.get(key);
  }

  /**
   * @param {T2} key
   * @returns {T1}
   */
  revGet(key) {
    return this.reverseMap.get(key);
  }

  clear() {
    this.map.clear();
    this.reverseMap.clear();
  }
}

module.exports = {
  BidirecitonalMap: BidirecitonalMap,
};
