/**
 * @fileOverview An utility of collections
 */
var sys = require ('sys');

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

///
/// Hash Map implementation
///

var HashMap = function(compareFunc, hashFunc, initialCapacity, loadFactor) {

  var DEFAULT_INITIAL_CAPACITY = 16;
  var MAXIMUM_CAPACITY = 1 << 30;
  var DEFAULT_LOAD_FACTOR = 0.75;
  
  var that = this;

  var _compareFunc = compareFunc;
  var _hashFunc = hashFunc;

  var _loadFactor = (!loadFactor || loadFactor <= 0) ? DEFAULT_LOAD_FACTOR : loadFactor;
  var _capacity = (!intialCapacity || initialCapacity <= 0) ? DEFAULT_INITIAL_CAPACITY : initilaCapacity;
  var _threshold = _capacity * _loadFactor;
  var _table = new Array(_capacity);
  var _size = 0;
  var _modCnt = 0;


  ///
  /// Private Class
  ///
  var Entry = function(hashCode, key, value, next) {
    this.key = key;
    this.value = value;
    this.hashCode = hashCode;
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
      if (!src[i]) {
        var e = src[i];
        do {
          var next = e.next;
          var idx = HashMap.indexFor(e.hash, newCapacity);
          e.next = newTable[i];
          newTable[i] = e;
          e = next;
        } while (!e);
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

///
/// Tree Map implementation
///

/**
 * Tree Map
 * 
 * @class
 * @author Sijie Guo <sijie0413@gmail.com>
 * @constructor
 *
 * @param {Function} comparator comparasion function
 */
var TreeMap = function(comparator) {
  
  var that = this;

  /**@field comparator used to maintain order in tree map*/
  var _compareFunc = comparator;
  /**@field root entry*/
  var _root = null;
  /**@filed number of entries in the tree*/
  var _size = 0;
  var _modCnt = 0;

  /**@constant COLOR*/
  var COLOR = {};
  /**@constant RED COLOR*/
  COLOR.RED = 0;
  /**@constant BLACK COLOR*/
  COLOR.BLACK = 1;
  ///
  /// Private Class
  ///
  var Entry = function(key, value, parent) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.color = COLOR.BLACK;
  };

  function keyOrNull(e) {
    return null === e ? null : e.key;
  }

  function key(e) {
    return e.key;
  }

  ///
  /// Private methods
  ///

  function getComparator() {
    return _compareFunc;
  }

  function size() {
    return _size;
  }

  /**
   * Return the map entry of the given key, or null if the map does not contain an entry for the key.
   * 
   * @param {Object} key given query key
   *
   * @return the map entry of the given key, or null if the map does not contain an entry for the key
   *
   * @public
   */
  function getEntry(key) {
    var p = _root;
    while (null !== p) {
      var cmp = _compareFunc(key, p.key);
      if (cmp < 0) {
        p = p.left;
      } else if (cmp > 0) {
        p = p.right;
      } else {
        return p;
      }
    }
    return null;
  }

  function getCeilingEntry(key) {
    var p = _root;
    while (null !== p) {
      var cmp = _compareFunc(key, p.key);
      if (cmp < 0) {
        if (null !== p.left) {
          p = p.left;
        } else {
          return p;
        }
      } else if (cmp > 0) {
        if (null !== p.right) {
          p = p.right;
        } else {
          var parent = p.parent;
          var ch = p;
          while (null !== parent && ch === parent.right) {
            ch = parent;
            parent = parent.parent;
          }
          return parent;
        }
      } else {
        return p;
      }
    }
    return null;
  }
  this.getCeilingEntry = getCeilingEntry;

  function getFloorEntry(key) {
    var p = _root;
    while (null !== p) {
      var cmp = _compareFunc(key, p.key);
      if (cmp > 0) {
        if (null !== p.right) {
          p = p.right;
        } else {
          return p;
        }
      } else if (cmp < 0) {
        if (null !== p.left) {
          p = p.left;
        } else {
          var parent = p.parent;
          var ch = p;
          while (null !== parent && ch === parent.left) {
            ch = parent;
            parent = parent.parent;
          }
          return parent;
        }
      } else {
        return p;
      }
    }
    return null;
  }
  this.getFloorEntry = getFloorEntry;

  function getHigherEntry(key) {
    var p = _root;
    while (null !== p) {
      var cmp = _compareFunc(key, p.key);
      if (cmp < 0) {
        if (null !== p.left) {
          p = p.left;
        } else {
          return p;
        }
      } else {
        if (null !== p.right) {
          p = p.right;
        } else {
          var parent = p.parent;
          var ch = p;
          while (null !== parent && ch === parent.right) {
            ch = parent;
            parent = parent.parent;
          }
          return parent;
        }
      }
    }
    return null;
  }
  this.getHigherEntry = getHigherEntry;

  function getLowerEntry(key) {
    var p = _root;
    while (null !== p) {
      var cmp = _compareFunc(key, p.key);
      if (cmp > 0) {
        if (null !== p.right) {
          p = p.right;
        } else {
          return p;
        }
      } else {
        if (null !== p.left) {
          p = p.left;
        } else {
          var parent = p.parent;
          var ch = p;
          while (null !== parent && ch === parent.left) {
            ch = parent;
            parent = parent.parent;
          }
          return parent;
        }
      }
    }
    return null;
  }
  this.getLowerEntry = getLowerEntry;

  function put(key, value) {
    if (!key) {
      console.log("TreeMap doesn't support null key now.");
      return;
    }

    var t = _root;
    if (null === t) {
      _root = new Entry(key, value, null);
      _size = 1;
      ++_modCnt;
      return null;
    }

    var cmp, parent;
    do {
      parent = t;
      cmp = _compareFunc(key, t.key);
      if (cmp < 0) {
        t = t.left;
      } else if (cmp > 0) {
        t = t.right;
      } else {
        var oldValue = t.value;
        t.value = value;
        return oldValue;
      }
    } while (null !== t);

    var e = new Entry(key, value, parent);
    if (cmp < 0) {
      parent.left = e;
    } else {
      parent.right = e;
    }
    fixAfterInsertion(e);
    ++_size;
    ++_modCnt;
    return null;
  }


  function deleteEntry(p) {
    ++_modCnt;
    --_size;

    // copy successor's element to p and then make p point to successor
    if (null !== p.left && null !== p.right) {
      var s = successor(p);
      p.key = s.key;
      p.value = s.value;
      p = s;
    }

    var replacement = null !== p.left ? p.left : p.right;

    if (null !== replacement) {
      replacement.parent = p.parent;
      if (null === p.parent) {
        _root = replacment;
      } else if (p === p.parent.left) {
        p.parent.left = replacement;
      } else {
        p.parent.right = replacement;
      }

      p.left = p.right = p.parent = null;

      if (COLOR.BLACK === p.color) {
        fixAfterDeletion(replacement);
      }
    } else if (null === p.parent) {
      _root = null;
    } else {
      if (COLOR.BLACK === p.color) {
        fixAfterDeletion(p);
      }

      if (null !== p.parent) {
        if (p === p.parent.left) {
          p.parent.left = null;
        } else if (p === p.parent.right) {
          p.parent.right = null;
        }
        p.parent = null;
      }
    }
  }
  this.deleteEntry = deleteEntry;

  function clear() {
    ++_modCnt;
    _size = 0;
    _root = null;
  }

  ///
  /// Red-Black-Tree Blance Operations
  ///
  
  function colorOf(p) {
    return null === p ? COLOR.BLACK : p.color;
  }

  function setColor(p, color) {
    if (null !== p) {
      p.color = color;
    }
  }

  function parentOf(p) {
    return null === p ? null : p.parent;
  }

  function leftOf(p) {
    return null === p ? null : p.left;
  }

  function rightOf(p) {
    return null === p ? null : p.right;
  }

  function rotateLeft(p) {
    if (null === p) {
      return;
    }
    var r = p.right;
    p.right = r.left;
    if (null !== r.left) {
      r.left.parent = p;
    }
    r.parent = p.parent;
    if (null === p.parent) {
      _root = r;
    } else if (p.parent.left === p) {
      p.parent.left = r;
    } else {
      p.parent.right = r;
    }
    r.left = p;
    p.parent = r;
  }

  function rotateRight(p) {
    if (null === p) {
      return;
    }
    var l = p.left;
    p.left = l.right;
    if (null !== l.right) {
      l.right.parent = p;
    }
    l.parent = p.parent;
    if (null === p.parent) {
      _root = l;
    } else if (p.parent.left === p) {
      p.parent.left = l;
    } else {
      p.parent.right = l;
    }
    l.right = p;
    p.parent = l;
  }

  function fixAfterInsertion(x) {
    x.color = COLOR.RED;

    var y;
    while (null !== x && _root !== x && COLOR.RED == x.parent.color) {
      if (parentOf(x) == leftOf(parentOf(parentOf(x)))) {
        y = rightOf(parentOf(parentOf(x)));
        if (COLOR.RED === colorOf(y)) {
          setColor(parentOf(x), COLOR.BLACK);
          setColor(y, COLOR.BLACK);
          setColor(parentOf(parentOf(x)), COLOR.RED);
          x = parentOf(parentOf(x));
        } else {
          if (rightOf(parent(x)) === x) {
            x = parentOf(x);
            rotateLeft(x);
          }
          setColor(parentOf(x), COLOR.BLACK);
          setColor(parentOf(parentOf(x)), COLOR.RED);
          rotateRight(parentOf(parentOf(x)));
        }
      } else {
        y = leftOf(parentOf(parentOf(x)));
        if (COLOR.RED === colorOf(y)) {
          setColor(parentOf(x), COLOR.BLACK);
          setColor(y, COLOR.BLACK);
          setColor(parentOf(parentOf(x)), COLOR.RED);
          x = parentOf(parentOf(x));
        } else {
          if (leftOf(parentOf(x)) === x) {
            x = parentOf(x);
            rotateRight(x);
          }
          setColor(parentOf(x), COLOR.BLACK);
          setColor(parentOf(parentOf(x)), COLOR.RED);
          rotateLeft(parentOf(parentOf(x)));
        }
      }
    }
    _root.color = COLOR.BLACK;
  }

  function fixAfterDeletion(x) {
    var sib;
    while (_root !== x && COLOR.BLACK === colorOf(x)) {
      if (leftOf(parentOf(x)) === x) {
        sib = rightOf(parentOf(x));

        if (COLOR.RED === colorOf(sib)) {
          setColor(sib, COLOR.BLACK);
          setColor(parentOf(x), COLOR.RED);
          rotateLeft(parentOf(x));
          sib = rightOf(parentOf(x));
        }

        if (COLOR.BLACK === colorOf(rightOf(sib)) &&
            COLOR.BLACK === colorOf(leftOf(sib))) {
          setColor(sib, COLOR.RED);
          x = parentOf(x);
        } else {
          if (COLOR.BLACK === colorOf(rightOf(sib))) {
            setColor(leftOf(sib), BLACK);
            setColor(sib, COLOR.RED);
            rotateRight(sib);
            sib = rightOf(parentOf(x));
          }

          setColor(sib, colorOf(parentOf(x)));
          setColor(parentOf(x), COLOR.BLACK);
          setColor(rightOf(sib), COLOR.BLACK);
          rotateLeft(parentOf(x));
          x = _root;
        }
      } else {
        sib = leftOf(parentOf(x));

        if (COLOR.RED === colorOf(sib)) {
          setColor(sib, COLOR.BLACK);
          setColor(parentOf(x), COLOR.RED);
          rotateRight(parentOf(x));
          sib = leftOf(parentOf(x));
        }

        if (COLOR.BLACK === colorOf(rightOf(sib)) &&
            COLOR.BLACK === colorOf(leftOf(sib))) {
          setColor(sib, COLOR.RED);
          x = parentOf(x);
        } else {
          if (COLOR.BLACK === colorOf(leftOf(sib))) {
            setColor(rightOf(sib), BLACK);
            setColor(sib, COLOR.RED);
            rotateLeft(sib);
            sib = leftOf(parentOf(x));
          }

          setColor(sib, colorOf(parentOf(x)));
          setColor(parentOf(x), COLOR.BLACK);
          setColor(leftOf(sib), COLOR.BLACK);
          rotateRight(parentOf(x));
          x = _root;
        }
      }
    }

    setColor(x, COLOR.BLACK);
  }

  ///
  /// Navigation methods
  ///

  function getFirstEntry() {
    var p = _root;
    if (null !== p) {
      while (null !== p.left) {
        p = p.left;
      }
    }
    return p;
  }
  this.getFirstEntry = getFirstEntry;

  function getLastEntry() {
    var p = _root;
    if (null !== p) {
      while (null !== p.right) {
        p = p.right;
      }
    }
    return p;
  }
  this.getLastEntry = getLastEntry;

  function successor(p) {
    var t, ch;
    if (null === p) {
      return null;
    } else if (null !== p.right) {
      t = p.right;
      while (null !== t.left) {
        t = t.left;
      }
      return t;
    } else {
      t = p.parent;
      ch = p;
      while (null !== t && ch === t.right) {
        ch = t;
        t = t.parent;
      }
      return t;
    }
  }

  function predecessor(p) {
    var t, ch;
    if (null === p) {
      return null;
    } else if (null !== p.left) {
      t = p.right;
      while (null !== t.right) {
        t = t.right;
      }
      return t;
    } else {
      t = p.parent;
      ch = p;
      while (null !== t && ch === t.left) {
        ch = t;
        t = t.parent;
      }
      return t;
    }
  }

  function exportEntry(p) {
    if (null !== p) {
      return new Map.Entry(p.key, p.value);
    } else {
      return null;
    }
  }

  ///
  /// Privileged methods
  ///

  /**
   * Return the comparasion function used in this map
   * @return comparasion function
   */
  this.comparator = getComparator;

  /**
   * Return the number of key-value mapping in this map
   * 
   * @return number of key-value mapping
   */
  this.size = size;

  /**
   * Associate the specified value with the specified key in this map.
   * If the map previously contained a mapping entry for the key, the old value is replaced.
   * 
   * @param {object} key key with which the specified value is to be associated
   * @param {object} value value to be associated with the specified key
   *
   * @return the previous value associated with key
   */
  this.put = put;

  /**
   * Removes the mapping entry for this key from this map if present.
   * 
   * @param {Object} key key for which mapping should be removed
   *
   * @return the previous value associated with key, or null if there was no mapping entry for this key.
   */
  this.remove = function(key) {
    var p = getEntry(key);
    if (null === p) {
      return p;
    }

    var oldValue = p.value;
    deleteEntry(p);
    return oldValue;
  };

  /**
   * Remove all the mapping entries from this map.
   * @return void
   */
  this.clear = clear;

  /**
   * Returns true if this map contains a mapping entry for the given key
   * 
   * @param {Object} key whose presence in this map is to be tested
   *
   * @return true if this map contains a mapping entry for the given key
   */
  this.containsKey = function(key) {
    return getEntry(key) !== null;
  };

  /**
   * Get the value to which the specified key is mapped,
   * or null if this map contains no mapping for the key
   * 
   * @param {Object} key the query key
   *
   * @return the value or null
   */
  this.get = function(key) {
    var p = getEntry(key);
    return null === p ? null : p.value;
  };

  /**
   * Get the first key in this map
   * @return the first key
   */
  this.firstKey = function() {
    var e = getFirstEntry();
    return null === e ? null : e.key;
  };

  /**
   * Get the last key in this map
   * @return the last key
   */
  this.lastKey = function() {
    var e = getLastEntry();
    return null === e ? null : e.key;
  };

  /**
   * Get the first entry in this map
   * @return the first entry
   */
  this.firstEntry = function() {
    return exportEntry(getFirstEntry());
  };

  /**
   * Get the last entry in this map
   * @return the last entry
   */
  this.lastEntry = function() {
    return exportEntry(getLastEntry());
  };
 
  /**
   * Get the first entry and remove it
   * @return the first entry
   */
  this.pollFirstEntry = function() {
    var p = getFirstEntry();
    var res = exportEntry(p);
    if (null !== p) {
      deleteEntry(p);
    }
    return res;
  };

  /**
   * Get the last entry and remove it
   * @return the last entry
   */
  this.pollLastEntry = function() {
    var p = getLastEntry();
    var res = exportEntry(p);
    if (null !== p) {
      deleteEntry(p);
    }
    return res;
  };

  /**
   * Get the largest entry whose key is lower than the specified key.
   * 
   * @param {Object} key the specified key
   *
   * @return lower entry
   */
  this.lowerEntry = function(key) {
    return exportEntry(getLowerEntry(key));
  };

  /**
   * Get the largest entry's whose key is lower than the specified key.
   * 
   * @param {Object} key the specfied key
   *
   * @return lower key
   */
  this.lowerKey = function(key) {
    var e = getLowerEntry(key);
    return null === e ? null : e.key;
  };
  
  ///
  /// views
  ///

  var AscendingSubMap = function(m, fromStart, lo, loInclusive, toEnd, hi, hiInclusive) {
    
    var _asm = this;
  
    if (!fromStart && !toEnd) {
      if (m.comparator()(lo, hi) > 0) {
        throw new Error("fromKey > toKey");
      }
    } 

    /**
     * Endpoints are represented as triples (fromStart, lo,   loInclusive) and (toEnd, hi, hiInclusive).
     */
    var _map = m;
    var _fromStart = fromStart;
    var _lo = lo;
    var _loInclusive = loInclusive;
    var _toEnd = toEnd;
    var _hi = hi;
    var _hiInclusive = hiInclusive;
    var _compareFunc = m.comparator();

    this.comparator = _compareFunc;
  
    ///
    /// Private methods
    ///

    function tooLow(key) {
      if (!_fromStart) {
        var cmp = _asm.comparator(key, _lo);
        if (cmp < 0 || (0 === cmp && !_loInclusive)) {
          return true;
        }
      }
      return false;
    }

    function tooHigh(key) {
      if (!_toEnd) {
        var cmp = _asm.comparator(key, _hi);
        if (cmp > 0 || (0 === cmp && !_hiInclusive)) {
          return true;
        }
      }
      return false;
    }

    function inRange(key, inclusive) {
      if (false === inclusive) {
        return inClosedRange(key);
      }
      return !tooLow(key) && !tooHigh(key);
    }

    function inClosedRange(key) {
      return (_fromStart || _asm.comparator(key, _lo) >= 0) &&
             (_toEnd || _asm.comparator(_hi, key) >= 0);
    }

    function absLowest() {
      var e = _fromStart ? _map.getFirstEntry() : (_loInclusive ? _map.getCeilingEntry(_lo) : _map.getHigherEntry(_lo));
      return null === e || tooHigh(e.key) ? null : e;
    }
    this.absLowest = absLowest;

    function absHighest() {
      var e = _toEnd ? _map.getLastEntry() : (_hiInclusive ? _map.getFloorEntry(_hi) : _map.getLowerEntry(_hi));
      return null === e || tooLow(e.key) ? null : e;
    }
    this.absHighest = absHighest;

    function absCeiling(key) {
      if (tooLow(key)) {
        return absLowest();
      }
      var e = _map.getCeilingEntry(key);
      return null === e || tooHigh(e.key) ? null : e;
    }
    this.absCeiling = absCeiling;

    function absHigher(key) {
      if (tooLow(key)) {
        return absLowest();
      }
      var e = _map.getHigherEntry(key);
      return null === e || tooHigh(e.key) ? null : e;
    }
    this.absHigher = absHigher;

    function absFloor(key) {
      if (tooHigh(key)) {
        return absHighest();
      }
      var e = _map.getFloorEntry(key);
      return null === e || tooLow(e.key) ? null : e;
    }
    this.absFloor = absFloor;

    function absLower(key) {
      if (tooHigh(key)) {
        return absHighest();
      }
      var e = _map.getLowerEntry(key);
      return null === e || tooLow(e.key) ? null : e;
    }
    this.absLower = absLower;

    function absHighFence() {
      return _toEnd ? null : (_hiInclusive ? _map.getHigherEntry(_hi) : _map.getCeilingEntry(_hi));
    }
    this.absHighFence = absHighFence;

    function absLowFence() {
      return _fromStart ? null : (_loInclusive ? _map.getLowerEntry(_lo) : _map.getFloorEntry(_lo));
    }
    this.absLowFence = absLowFence;

    this.subLowest  = absLowest;
    this.subHighest = absHighest;
    this.subCeiling = absCeiling;
    this.subHigher  = absHigher;
    this.subFloor   = absFloor;
    this.subLower   = absLower;

    this.ceilingEntry = function(key) {
      return exportEntry(this.subCeiling(key));
    };
    this.ceilingKey = function(key) {
      return keyOrNull(this.subCeiling(key));
    };
    this.higherEntry = function(key) {
      return exportEntry(this.subHigher(key));
    };
    this.higherKey = function(key) {
      return keyOrNull(this.subHigher(key));
    };
    this.floorEntry = function(key) {
      return exportEntry(this.subFloor(key));
    };
    this.floorKey = function(key) {
      return keyOrNull(this.subFloor(key));
    };
    this.lowerEntry = function(key) {
      return exportEntry(this.subLower(key));
    };
    this.lowerKey = function(key) {
      return keyOrNull(this.subLower(key));
    };
    this.firstKey = function() {
      return key(this.subLowest());
    };
    this.lastKey = function() {
      return key(this.subHighest());
    };
    this.firstEntry = function() {
      return exportEntry(this.subLowest());
    };
    this.lastEntry = function() {
      return exportEntry(this.subHighest());
    };
    this.pollFirstEntry = function() {
      var e = this.subLowest();
      var result = exportEntry(e);
      if (null !== e) {
        _map.deleteEntry(e);
      }
      return result;
    };
    this.pollLastEntry = function() {
      var e = this.subHighest();
      var result = exportEntry(e);
      if (null !== e) {
        _map.deleteEntry(e);
      }
      return result;
    };

    function containsKey(key) {
      return inRange(key) && _map.containsKey(key);
    }
    this.containsKey = containsKey;

    function put(key, value) {
      if (inRange(key)) {
        _map.put(key, value);
      }
    }
    this.put = put;

    function get(key) {
      return !inRange(key) ? null : _map.get(key);
    }
    this.get = get;

    function remove(key) {
      return !inRange(key) ? null : _map.remove(key);
    }
    this.remove = remove;
  
  };
  
  var DescendingSubMap = function(m, fromStart, lo, loInclusive, toEnd, hi, hiInclusive) {
    AscendingSubMap.apply(this, m, fromStart, lo, loInclusive, toEnd, hi, hiInclusive);

    var _compareFunc = m.comparator();
    this.comparator = function(k1, k2) {
      var res = _compareFunc(k1, k2);
      return -res;
    };

    this.subLowest  = this.absHighest;
    this.subHighest = this.absLowest;
    this.subCeiling = this.absFloor;
    this.subHigher  = this.absLower;
    this.subFloor   = this.absCeiling;
    this.subLower   = this.absHigher;
  
  };

  sys.inherits(DescendingSubMap, AscendingSubMap);
  
  this.subMap = function(fromKey, fromInclusive, toKey, toInclusive) {
    return new AscendingSubMap(that, false, fromKey, fromInclusive, false, toKey, toInclusive);
  };

  this.headMap = function(toKey, toInclusive) {
    return new AscendingSubMap(that, true, null, true, false, toKey, !toInclusive ? false : true);
  };

  this.tailMap = function(fromKey, inclusive) {
    return new AscendingSubMap(that, false, fromKey, !inclusive ? false : true, true, null, true);
  };

};

exports.TreeMap = TreeMap;
