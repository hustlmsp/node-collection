/**
 * @fileOverview HashSet implementation
 */
var HashMap = require ('./hashmap').HashMap;

///
/// Hash Set implementation
///

var HashSet = function(compareFunc, hashFunc, initialCapacity, loadFactor) {
  var DUMMY = {};
  
  var that = this;

  var _map = new HashMap(compareFunc, hashFunc, initialCapacity, loadFactor); 

  function size() {
    return _map.size();
  }
  this.size = size;

  function isEmpty() {
    return _map.isEmpty();
  }
  this.isEmpty = isEmpty;

  function contains(element) {
    return _map.containsKey(element);
  }
  this.contains = contains;

  function add(element) {
    return null === _map.put(element, DUMMY);
  }
  this.add = add;

  function remove(element) {
    return DUMMY == _map.remove(element);
  }
  this.remove = remove;

  function clear() {
    _map.clear();
  }
  this.clear = clear;

};

exports.HashSet = HashSet;
