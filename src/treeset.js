/**
 * @fileOverview TreeSet implementation
 */
var TreeMap = require ('./treemap').TreeMap;

///
/// Hash Set implementation
///

var TreeSet = function(compareFunc) {
  var DUMMY = {};
  
  var that = this;

  var _map = new TreeMap(compareFunc);

  function size() {
    return _map.size();
  }
  this.size = size;

  function isEmpty() {
    return 0 === _map.size();
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

exports.TreeSet = TreeSet;
