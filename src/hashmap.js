/**
 * @fileOverview HashMap implementation
 */

///
/// Hash Map implementation
///

/**
 * Hash Map
 * 
 * @class
 * @author Sijie Guo <sijie0413@gmail.com>
 * @constructor
 *
 * @param {Function} compareFunc function used for comparasion
 * @param {Function} hashFunc function used to compute hash value
 * @param {Number} initialCapacity initial map capacity
 * @param {Number} loadFactor load factor
 */
var HashMap = function(compareFunc, hashFunc, initialCapacity, loadFactor) {

  var DEFAULT_INITIAL_CAPACITY = 16;
  var MAXIMUM_CAPACITY = 1 << 30;
  var DEFAULT_LOAD_FACTOR = 0.75;
  
  var that = this;

  var _compareFunc = compareFunc;
  var _hashFunc = hashFunc;

  var _loadFactor = (!loadFactor || loadFactor <= 0) ? DEFAULT_LOAD_FACTOR : loadFactor;
  var _capacity = (!initialCapacity || initialCapacity <= 0) ? DEFAULT_INITIAL_CAPACITY : initilaCapacity;
  var _threshold = _capacity * _loadFactor;
  var _table = new Array(_capacity);
  var _size = 0;
  var _modCnt = 0;


  ///
  /// Private Class
  ///
  var Entry = function(hash, key, value, next) {
    this.key = key;
    this.value = value;
    this.hash = hash;
    this.next = next;
  };

  ///
  /// Private methods
  ///

  function size() {
    return _size;
  }

  function isEmpty() {
    return 0 === _size;
  }

  function getForNullKey() {
    for (var e = _table[0]; e; e = e.next) {
      if (null === e.key) {
        return e.value;
      }
    }
    return null;
  }

  function get(key) {
    if (null === key) {
      return getForNullKey();
    }
    var hash = HashMap.hash(_hashFunc(key));
    for (var e = _table[HashMap.indexFor(hash, _capacity)]; e; e = e.next) {
      var k = e.key;
      if (e.hash === hash && 0 === _compareFunc(k, key)) {
        return e.value;
      }
    }
    return null;
  }

  function getEntry(key) {
    var hash = (null === key) ? 0 : HashMap.hash(_hashFunc(key));
    for (var e = _table[HashMap.indexFor(hash, _capacity)]; e; e = e.next) {
      if (e.hash === hash && 0 === _compareFunc(e.key, key)) {
        return e;
      }
    }
    return null;
  }

  function putForNullKey(value) {
    for (var e = _table[0]; e; e = e.next) {
      if (null === e.key) {
        var oldValue = e.value;
        e.value = value;
        return oldValue;
      }
    }
    ++_modCnt;
    addEntry(0, null, value, 0);
    return null;
  }

  function resize(newCapacity) {
    var oldTable = _table;
    var oldCapacity = _capacity;

    var newTable = new Array(newCapacity);
    newTable = transfer(newTable);

    _table = newTable;
    _capacity = newCapacity;
    _threshold = _capacity * _loadFactor;
  }

  function transfer(newTable) {
    var src = _table;
    var newCapacity = newTable.length;
    var oldCapacity = _table.length;
    for (var i = 0; i < oldCapacity; i++) {
      if (src[i]) {
        var e = src[i];
        do {
          var next = e.next;
          var idx = HashMap.indexFor(e.hash, newCapacity);
          e.next = newTable[i];
          newTable[i] = e;
          e = next;
        } while (e);
      }
    }
    return newTable;
  }

  function addEntry(hash, key, value, bucketIndex) {
    var e = _table[bucketIndex];
    _table[bucketIndex] = new Entry(hash, key, value, e);
    if (_size++ >= _threshold) {
      resize(2 * _table.length); 
    }
  }

  function removeEntryForKey(key){
    var hash = (null === key) ? 0 : HashMap.hash(_hashFunc(key));
    var idx = HashMap.indexFor(hash, _capacity);
    var e = prev = _table[idx];
    while (e) {
      var next = e.next;
      var k = e.key;
      if (hash === e.hash && 0 === _compareFunc(k, key)) {
        ++_modCnt;
        --_size;
        if (e === prev) {
          _table[idx] = next;
        } else {
          prev.next = next;
        }
        return e;
      }
      prev = e;
      e = e.next;
    }
    return null;
  }

  function clear() {
    ++_modCnt;
    var tab = _table;
    for (var i in tab) {
      tab[i] = null;
    }
    _size = 0;
  }
  this.clear = clear;

  ///
  /// Privileged methods
  ///

  this.size = size;

  this.isEmpty = isEmpty;

  this.get = get;

  this.containsKey = function(key) {
    return null !== getEntry(key);
  };

  this.put = function(key, value) {
    if (null === key) {
      return putForNullKey(value);
    }

    var hash = HashMap.hash(_hashFunc(key));
    var i = HashMap.indexFor(hash, _capacity);

    for (var e = _table[i]; e; e = e.next) {
      if (hash === e.hash && 0 === _compareFunc(e.key, key)) {
        var oldValue = e.value;
        e.value = value;
        return oldValue;
      }
    }

    ++_modCnt;
    addEntry(hash, key, value, i);
    return null;
  };

  this.remove = function(key) {
    var e = removeEntryForKey(key);
    return null === e ? null : e.value;
  };
  
};

/**
 * Applies a supplemental hash function to a given hashcode, which defends
 * against poor quality hash functions.
 * 
 * @param {Number} h a given hash code
 *
 * @return hash value
 */
HashMap.hash = function(h) {
  h ^= (h >>> 20) ^ (h >>> 12);
  return h ^ (h >>> 7) ^ (h >>> 4);
};

/**
 * Return index for hash code h
 * 
 * @param {Number} h a given hash code
 * @param {Number} length length of current size
 *
 * @return index
 */
HashMap.indexFor = function(h, length) {
  return h & (length - 1);
};

exports.HashMap = HashMap;


