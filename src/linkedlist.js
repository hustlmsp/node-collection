/**
 * @fileOverview Linked List
 */

var LinkedList = function(compareFunc) {
  
  var that = this;

  var Entry = function(e, next, previous) {
    this.element = e;
    this.next = next;
    this.prev = previous;
  };

  var _head = new Entry(null, null, null);
  _head.next = _head.prev = _head;
  
  var _size = 0;
  var _modCnt = 0;
  var _compareFunc = compareFunc;

  function getFirst() {
    if (0 === _size) {
      return null;
    }
    return _head.next.element;
  }
  this.getFirst = getFirst;

  function getLast() {
    if (0 === _size) {
      return null;
    }
    return _head.prev.element;
  }
  this.getLast = getLast;

  
  function removeFirst() {
    return removeByEntry(_head.next);
  }
  this.removeFirst = removeFirst;

  function removeLast() {
    return removeByEntry(_head.prev);
  }
  this.removeLast = removeLast;

  function addFirst(element) {
    addBefore(element, _head.next);
  }
  this.addFirst = addFirst;

  function addLast(element) {
    addBefore(element, _head);
  }
  this.addLast = addLast;

  function size() {
    return _size;
  }
  this.size = size;

  function add(element) {
    addBefore(element, _head);
    return true;
  }
  this.add = add;

  function remove(element) {
    if (null === element) {
      for (var e = _head.next; e !== _head; e = e.next) {
        if (null === e.element) {
          removeByEntry(e);
          return true;
        }
      }
    } else {
      for (var e = _head.next; e !== _head; e = e.next) {
        if (0 === _compareFunc(element, e.element)) {
          removeByEntry(e);
          return true;
        }
      }
    }
    return false;
  }
  this.remove = remove;

  function clear() {
    var e = _head.next;
    while (e !== _head) {
      var next = e.next;
      e.next = e.prev = null;
      e.element = null;
      e = next;
    }
    _head.next = _head.prev = _head;
    _size = 0;
    ++_modCnt;
  }
  this.clear = clear;

  function entry(index) {
    if (index < 0 || index >= _size) {
      return undefined;
    }

    var e = _head;
    if (index < (_size >> 1)) {
      for (var i = 0; i <= index; i++) {
        e = e.next;
      }
    } else {
      for (var j = _size; j > index; j--) {
        e = e.prev;
      }
    }
    return e;
  }

  function getAt(index) {
    var e = entry(index);
    if (e) {
      return e.element;
    } else {
      return undefined;
    }
  }
  this.getAt = getAt;

  function setAt(index, element) {
    var e = entry(index);
    if (undefined === e) {
      return null;
    }
    var oldVal = e.element;
    e.element = element;
    return oldVal;
  }
  this.setAt = setAt;

  function addAt(index, element) {
    addBefore(element, (_size === index ? _head : entry(index)));
  }
  this.addAt = addAt;

  function removeAt(index) {
    return removeByEntry(entry(index));
  }
  this.removeAt = removeAt;

  function indexOf(element) {
    var index = 0;
    if (null === element) {
      for (var e = _head.next; e !== _head; e = e.next) {
        if (null === e.element) {
          return index;
        }
        ++index;
      }
    } else {
      for (var e = _head.next; e !== _head; e = e.next) {
        if (0 === _compareFunc(element, e.element)) {
          return index;
        }
        ++index;
      }
    }
    return -1;
  }
  this.indexOf = indexOf;

  function lastIndexOf(element) {
    var index = _size;
    if (null === element) {
      for (var e = _head.prev; e !== _head; e = e.prev) {
        --index;
        if (null === e.element) {
          return index;
        }
      }
    } else {
      for (var e = _head.prev; e !== _head; e = e.prev) {
        --index;
        if (0 === _compareFunc(element, e.element)) {
          return index;
        }
      }
    }
    return -1;
  }
  this.lastIndexOf = lastIndexOf;

  ///
  /// Deque operations
  ///

  this.offerFirst = function(e) {
    addFirst(e);
    return true;
  };

  this.offerLast = function(e) {
    addLast(e);
    return true;
  };

  function peekFirst() {
    if (0 === _size) { return null; }
    return getFirst();
  }
  this.peekFirst = peekFirst;

  function peekLast() {
    if (0 === _size) { return null; }
    return getLast();
  }
  this.peekLast = peekLast;

  function pollFirst() {
    if (0 === _size) { return null; }
    return removeFirst();
  }
  this.pollFirst = pollFirst;

  function pollLast() {
    if (0 === _size) { return null; }
    return removeLast();
  }
  this.pollLast = pollLast;

  ///
  /// Stack operations
  ///

  this.push = function(e) {
    addFirst(e);
  };

  this.pop = pollFirst;

  ///
  /// Queue operations
  ///

  this.peek = peekFirst;
  this.poll = pollFirst;
  this.offer = this.offerLast;

  function addBefore(element, entry) {
    var newEntry = new Entry(element, entry, entry.prev);
    newEntry.prev.next = newEntry;
    newEntry.next.prev = newEntry;
    ++_size;
    ++_modCnt;
    return newEntry;
  }

  function removeByEntry(entry) {
    if (!entry || _head === entry) {
      return null;
    }

    var result = entry.element;
    entry.prev.next = entry.next;
    entry.next.prev = entry.prev;

    entry.next = entry.prev = null;
    entry.element = null;
    --_size;
    ++_modCnt;
    return result;
  }

  function toArray() {
    var res = new Array(_size);
    var i = 0;
    for (var e = _head.next; e !== _head; e = e.next) {
      res[i++] = e.element;
    }
    return res;
  }
  this.toArray = toArray;

  ///
  /// Private methods
  ///

  ///
  /// Privileged methods
  ///

};

exports.LinkedList = LinkedList;
