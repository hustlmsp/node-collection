var PriorityQueue = require("../src/priorityqueue").PriorityQueue;

function testCompareFunc(k1, k2) {
  return k1 - k2;
}

exports['PriorityQueue'] = function(test) {
  var pg = new PriorityQueue(testCompareFunc);

  test.ok(0 === pg.size());
  test.ok(null === pg.peek());
  test.ok(null === pg.poll());

  pg.offer(3);
  pg.offer(8);
  pg.offer(4);
  pg.offer(6);

  test.ok(4 === pg.size());
  test.ok(3 === pg.peek());

  test.ok(3 === pg.poll());
  test.ok(3 === pg.size());

  test.ok(4 === pg.peek());

  test.ok(false === pg.remove(7));
  test.ok(true === pg.remove(8));
  test.ok(2 === pg.size());

  test.done();
};
