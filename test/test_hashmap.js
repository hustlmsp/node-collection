var HashMap = require("../src/hashmap").HashMap;

var TestKey = function(key) {
  this.key = key;
};

function testCompareFunc(k1, k2) {
  if (null === k1 && null === k2) {
    return 0;
  } else if (null === k1) {
    return -1;
  } else if (null === k2) {
    return 1;
  } else {
    return k1.key - k2.key;
  }
}

function testHashFunc(k) {
  return k.key % 10;
}

function getTestHashMap(size) {
  var hashmap = new HashMap(testCompareFunc, testHashFunc);
  for (var i = 0; i < size; i++) {
    var testKey = new TestKey(i);
    hashmap.put(testKey, testKey);
  }
  return hashmap;
}

exports['HashMap.emptymap'] = function(test) {
  var hashmap = getTestHashMap(0);

  test.ok(0 === hashmap.size());
  test.ok(true === hashmap.isEmpty());
  test.ok(null === hashmap.get(new TestKey(1)));
  test.ok(null === hashmap.get(null));
  test.ok(false === hashmap.containsKey(new TestKey(1)));

  test.done();
};

exports['HashMap.put'] = function(test) {
  var hashmap = getTestHashMap(20);

  test.ok(20 === hashmap.size());
  test.ok(false === hashmap.isEmpty());
  test.deepEqual(hashmap.get(new TestKey(1)), new TestKey(1));
  test.deepEqual(hashmap.get(new TestKey(11)), new TestKey(11));
  test.ok(true === hashmap.containsKey(new TestKey(1)));

  hashmap.put(null, new TestKey(2011));
  test.deepEqual(hashmap.get(null), new TestKey(2011));

  test.done();
};

exports['HashMap.remove'] = function(test) {
  var hashmap = getTestHashMap(20);

  test.ok(20 === hashmap.size());
  test.deepEqual(hashmap.get(new TestKey(11)), new TestKey(11));
  test.deepEqual(hashmap.remove(new TestKey(11)), new TestKey(11));
  test.deepEqual(hashmap.get(new TestKey(11)), null);

  hashmap = getTestHashMap(20);
  test.deepEqual(hashmap.remove(new TestKey(11)), new TestKey(11));
  test.deepEqual(hashmap.get(new TestKey(11)), null);

  hashmap.put(null, new TestKey(2011));
  test.deepEqual(hashmap.get(null), new TestKey(2011));
  hashmap.put(null, new TestKey(2012));
  test.deepEqual(hashmap.get(null), new TestKey(2012));
  test.deepEqual(hashmap.remove(null), new TestKey(2012));
  test.deepEqual(hashmap.get(null), null);
  
  test.deepEqual(hashmap.remove(new TestKey(2013)), null);

  test.done();
};

exports['HashMap.clear'] = function(test) {
  var hashmap = getTestHashMap(20);

  test.ok(20 === hashmap.size());
  test.ok(hashmap.containsKey(new TestKey(12)));
  hashmap.clear();
  test.ok(0 === hashmap.size());
  test.ok(!hashmap.containsKey(new TestKey(12)));

  test.done();
};
