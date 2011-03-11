var TreeSet = require("../src/treeset").TreeSet;

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

function getTestTreeSet(size) {
  var treeset = new TreeSet(testCompareFunc);
  for (var i = 0; i < size; i++) {
    var testKey = new TestKey(i);
    treeset.add(testKey);
  }
  return treeset;
}

exports['TreeSet.emptyset'] = function(test) {
  var treeset = getTestTreeSet(0);

  test.ok(0 === treeset.size());
  test.ok(true === treeset.isEmpty());
  test.ok(false === treeset.contains(new TestKey(1)));

  test.done();
};

exports['TreeSet.add'] = function(test) {
  var treeset = getTestTreeSet(10);

  test.ok(10 === treeset.size());
  test.ok(false === treeset.isEmpty());
  test.ok(true === treeset.contains(new TestKey(1)));

  test.ok(false === treeset.add(new TestKey(1)));
  test.ok(true === treeset.add(new TestKey(20)));

  test.ok(true === treeset.remove(new TestKey(1)));
  test.ok(false === treeset.remove(new TestKey(11)));

  treeset.clear();
  test.ok(0 === treeset.size());
  test.ok(true === treeset.isEmpty());

  test.done();
};
