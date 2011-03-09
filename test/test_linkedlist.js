var LinkedList = require("../src/linkedlist").LinkedList;

function testCompareFunc(k1, k2) {
  return k1 - k2;
}

exports['LinkedList.emptylist'] = function(test) {
  var list = new LinkedList(testCompareFunc);

  test.deepEqual(list.getFirst(), null);
  test.deepEqual(list.getLast(), null);

  test.deepEqual(list.removeFirst(), null);
  test.deepEqual(list.removeLast(), null);

  test.ok(0 === list.size());

  test.deepEqual(list.remove(null), false);
  test.deepEqual(list.remove(3), false);

  list.clear();
  test.ok(0 === list.size());

  test.deepEqual(list.getAt(1), undefined);
  test.deepEqual(list.indexOf(1), -1);
  test.deepEqual(list.lastIndexOf(1), -1);

  test.deepEqual(list.peekFirst(), null);
  test.deepEqual(list.peekLast(), null);
  test.deepEqual(list.pollFirst(), null);
  test.deepEqual(list.pollLast(), null);

  test.deepEqual(list.pop(), null);
  test.deepEqual(list.peek(), null);
  test.deepEqual(list.poll(), null);

  test.deepEqual(list.toArray(), new Array());

  test.done();
};
