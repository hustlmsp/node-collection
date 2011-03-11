var HashSet = require("../src/hashset").HashSet;

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

function getTestHashSet(size) {
  var hashset = new HashSet(testCompareFunc, testHashFunc);
  for (var i = 0; i < size; i++) {
    var testKey = new TestKey(i);
    hashset.add(testKey);
  }
  return hashset;
}

exports['HashSet.emptyset'] = function(test) {
  var hashset = getTestHashSet(0);

  test.ok(0 === hashset.size());
  test.ok(true === hashset.isEmpty());
  test.ok(false === hashset.contains(new TestKey(1)));

  test.done();
};

exports['HashSet.add'] = function(test) {
  var hashset = getTestHashSet(10);

  test.ok(10 === hashset.size());
  test.ok(false === hashset.isEmpty());
  test.ok(true === hashset.contains(new TestKey(1)));

  test.ok(false === hashset.add(new TestKey(1)));
  test.ok(true === hashset.add(new TestKey(20)));

  test.ok(true === hashset.remove(new TestKey(1)));
  test.ok(false === hashset.remove(new TestKey(11)));

  hashset.clear();
  test.ok(0 === hashset.size());
  test.ok(true === hashset.isEmpty());

  test.done();
};
