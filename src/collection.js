/**
 * @fileOverview An utility of collections
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

  ///
  /// Private methods
  ///

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

  function getLastEntry() {
    var p = _root;
    if (null !== p) {
      while (null !== p.right) {
        p = p.right;
      }
    }
    return p;
  }

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

};

exports.TreeMap = TreeMap;
