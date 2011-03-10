/**
 * @fileOverview An unbounded priority queue implementation based on a priority heap.
 * The elements of the priority queue are ordered by a Comparasion function provided at queue construction time.
 */

var PriorityQueue = function(compareFunc, initialCapacity) {

  var DEFAULT_INITIAL_CAPACITY = 11;
  
  var that = this;

  var _compareFunc = compareFunc;

  var _capacity = !initialCapacity ? DEFAULT_INITIAL_CAPACITY : initialCapacity;

  var _queue = new Array(_capacity);
  var _size = 0;
  var _modCnt = 0;

  function grow(minCapacity) {
    if (minCapacity < 0) {
      throw new Error("Out of memory");
    }

    var oldCapacity = _queue.length;
    var newCapacity = oldCapacity < 64 ? (oldCapacity + 1) * 2 : (oldCapacity / 2) * 3;

    if (newCapacity < minCapacity) {
      newCapacity = minCapacity;
    }
    // grow the array
    _queue[newCapacity - 1] = undefined; 
  }

  function indexOf(e) {
    if (null !== e && undefined !== e) {
      for (var i=0; i<_size; i++) {
        if (0 === _compareFunc(e, _queue[i])) {
          return i;
        }
      }
    }
    return -1;
  }

  function size() {
    return _size;
  }
  this.size = size;

  function siftUp(k, element) {
    while (k > 0) {
      var parent = (k - 1) >>> 1;
      var e = _queue[parent];
      if (_compareFunc(element, e) >= 0) {
        break;
      }
      _queue[k] = e;
      k = parent;
    }
    _queue[k] = element;
  }
  /**
   * Insert item element at position k, maintaining heap by
   * promoting element up the tree until it is greater than
   * or equal to its parent, or is the root.
   * 
   * @param {Number} k the position to fill
   * @param {Object} element the item to insert
   *
   * @return void
   */
  function siftDown(k, x) {
    var half = _size >>> 1;
    while (k < half) {
      var child = (k << 1) + 1;
      var c = _queue[child];
      var right = child + 1;
      if (right < _size &&
          _compareFunc(c, _queue[right]) > 0) {
        c = _queue[child = right];
      }
      if (_compareFunc(x, c) <= 0) {
        break;
      }
      _queue[k] = c;
      k = child;
    }
    _queue[k] = x;
  }

  function heapify() {
    for (var i=(_size>>>1) - 1; i>=0; i--) {
      siftDown(i, _queue[i]);
    }
  }

  function offer(e) {
    ++_modCnt;
    var i = _size;
    if (i >= _queue.length) {
      grow(i+1);
    }
    _size = i+1;
    if (0 === i) {
      _queue[0] = e;
    } else {
      siftUp(i, e);
    }
    return true;
  }
  this.offer = offer;
  this.add = offer;

  function peek() {
    return 0 === _size ? null : _queue[0];
  }
  this.peek = peek;

  function poll() {
    if (0 === _size) {
      return null;
    }
    var s = --_size;
    ++_modCnt;
    var result = _queue[0];
    var x = _queue[s];
    _queue[s] = null;
    if (0 !== s) {
      siftDown(0, x);
    }
    return result;
  }
  this.poll = poll;

  function removeAt(idx) {
    if (idx < 0 || idx >= _size) {
      return null;
    }
    ++_modCnt;
    var s = --_size;
    if (s === idx) {
      _queue[idx] = null;
    } else {
      var moved = _queue[s];
      _queue[s] = null;
      siftDown(idx, moved);
      if (moved === _queue[idx]) {
        siftUp(idx, moved);
        if (moved === _queue[idx]) {
          return moved;
        }
      }
    }
    return null;
  }


  function remove(e) {
    var idx = indexOf(e);
    if (-1 === idx) {
      return false;
    } else {
      removeAt(idx);
      return true;
    }
  }
  this.remove = remove;

};

exports.PriorityQueue = PriorityQueue;
