var collection = require("../src/collection");

var TreeMap = collection.TreeMap;

var TestKey = function(key) {
  this.key = key;
};

function testCompareFunc(k1, k2) {
  return k1.key - k2.key;
}

function getTestTreeMap(size) {
  var treemap = new TreeMap(testCompareFunc);
  for (var i = 0; i < size; i++) {
    var testKey = new TestKey(i);
    treemap.put(testKey, testKey);
  };
  return treemap;
}

exports['TreeMap.firstKey'] = function(test) {
  var treemap = getTestTreeMap(0);
  test.ok(null === treemap.firstKey());

  treemap = getTestTreeMap(10);
  test.deepEqual(treemap.firstKey(), new TestKey(0));

  test.done();
};

exports['TestMap.lastKey'] = function(test) {
  var treemap = getTestTreeMap(0);
  test.ok(null === treemap.lastKey());

  treemap = getTestTreeMap(10);
  test.deepEqual(treemap.lastKey(), new TestKey(9));

  test.done();
};

exports['TreeMap.firstEntry'] = function(test) {
  var treemap = getTestTreeMap(0);
  test.ok(null === treemap.firstEntry());

  treemap = getTestTreeMap(10);
  test.deepEqual(treemap.firstEntry().key, new TestKey(0));
  test.deepEqual(treemap.firstEntry().value, new TestKey(0));

  test.done();
};

exports['TreeMap.lastEntry'] = function(test) {
  var treemap = getTestTreeMap(0);
  test.ok(null === treemap.firstEntry());

  treemap = getTestTreeMap(10);
  test.deepEqual(treemap.lastEntry().key, new TestKey(9));
  test.deepEqual(treemap.lastEntry().value, new TestKey(9));

  test.done();
};

exports['TreeMap.pollFirstEntry'] = function(test) {
  var treemap = getTestTreeMap(0);
  test.ok(null === treemap.pollFirstEntry());

  treemap = getTestTreeMap(10);
  test.deepEqual(treemap.pollFirstEntry().key, new TestKey(0));
  test.deepEqual(treemap.firstEntry().key, new TestKey(1));

  test.done();
};

exports['TreeMap.pollLastEntry'] = function(test) {
  var treemap = getTestTreeMap(0);
  test.ok(null === treemap.pollLastEntry());

  treemap = getTestTreeMap(10);
  test.deepEqual(treemap.pollLastEntry().key, new TestKey(9));
  test.deepEqual(treemap.lastEntry().key, new TestKey(8));

  test.done();
};

exports['TreeMap.lowerEntry'] = function(test) {
  var treemap = getTestTreeMap(10);
  test.ok(null === treemap.lowerEntry(new TestKey(0)));
  test.deepEqual(treemap.lowerEntry(new TestKey(3)).key, new TestKey(2));

  test.done();
};

exports['TreeMap.lowerKey'] = function(test) {
  var treemap = getTestTreeMap(10);
  test.ok(null === treemap.lowerKey(new TestKey(0)));
  test.deepEqual(treemap.lowerKey(new TestKey(3)), new TestKey(2));

  test.done();
};

exports['TreeMap.get'] = function(test) {
  var treemap = getTestTreeMap(10);

  test.ok(null === treemap.get(new TestKey(10)));
  test.deepEqual(treemap.getKey(new TestKey(3)), new TestKey(3));

  test.done();
};

exports['TreeMap.get'] = function(test) {
  var treemap = getTestTreeMap(10);

  test.ok(!treemap.containsKey(new TestKey(10)));
  test.ok(treemap.containsKey(new TestKey(8)));

  test.done();
};

exports['TreeMap.clear'] = function(test) {
  var treemap = getTestTreeMap(10);

  test.ok(treemap.containsKey(new TestKey(8)));
  treemap.clear();
  test.ok(!treemap.containsKey(new TestKey(8)));

  test.done();
};

exports['TreeMap.remove'] = function(test) {
  var treemap = getTestTreeMap(10);

  test.ok(null === treemap.remove(new TestKey(10)));
  test.deepEqual(treemap.remove(new TestKey(6)), new TestKey(6));
  test.ok(!treemap.containsKey(new TestKey(6)));

  test.done();
};

exports['TreeMap.size'] = function(test) {
  var treemap = getTestTreeMap(10);

  test.ok(10 === treemap.size());

  test.done();
};

exports['TreeMap.subMap.error'] = function(test) {
  var treemap = getTestTreeMap(10);

  try {
    var submap = treemap.subMap(new TestKey(8), false, new TestKey(6), false);
    test.fail("Should throw error when start > end");
  } catch (e) {
  }

  test.done();
};

exports['TreeMap.subMap.non_inclusive'] = function(test) {
  var treemap = getTestTreeMap(10);
  var submap = treemap.subMap(new TestKey(3), false, new TestKey(6), false);
  // lowest & highest
  test.deepEqual(submap.absLowest().key, new TestKey(4));
  test.deepEqual(submap.absHighest().key, new TestKey(5));

  // ceiling
  test.deepEqual(submap.absCeiling(new TestKey(0)).key, new TestKey(4));
  test.ok(null === submap.absCeiling(new TestKey(6)));
  test.deepEqual(submap.absCeiling(new TestKey(5)).key, new TestKey(5));
  test.deepEqual(submap.absCeiling(new TestKey(4.2)).key, new TestKey(5));
  
  // higher
  test.deepEqual(submap.absHigher(new TestKey(0)).key, new TestKey(4));
  test.ok(null === submap.absHigher(new TestKey(5)));
  test.deepEqual(submap.absHigher(new TestKey(4)).key, new TestKey(5));
  test.deepEqual(submap.absHigher(new TestKey(4.2)).key, new TestKey(5));

  // floor 
  test.ok(null === submap.absFloor(new TestKey(0)));
  test.deepEqual(submap.absFloor(new TestKey(6)).key, new TestKey(5));
  test.deepEqual(submap.absFloor(new TestKey(5.2)).key, new TestKey(5));
  test.deepEqual(submap.absFloor(new TestKey(4)).key, new TestKey(4));
 
  // lower
  test.ok(null === submap.absLower(new TestKey(0)));
  test.deepEqual(submap.absLower(new TestKey(6)).key, new TestKey(5));
  test.deepEqual(submap.absLower(new TestKey(5.2)).key, new TestKey(5));
  test.deepEqual(submap.absLower(new TestKey(5)).key, new TestKey(4));

  test.done();
};
