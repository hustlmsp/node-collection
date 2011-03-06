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
