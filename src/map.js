/**
 * @fileOverview Abstract Map
 */

/**
 * Abstract Map
 * 
 * @class
 * @author Sijie Guo <sijie0413@gmail.com>
 */
var Map = function(){};

/**
 * Entry for map
 * 
 * @class
 * @author Sijie Guo <sijie0413@gmail.com>
 * @constructor
 *
 * @param {Object} key key
 * @param {Object} value value
 */
Map.Entry = function(key, value) {
  this.key = key;
  this.value = value;
};

exports.Map = Map;
