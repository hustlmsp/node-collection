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

exports['LinkedList.asList'] = function(test) {
  var list = new LinkedList(testCompareFunc);

  for (var i=0; i<20; i++) {
    list.add(i);
  }

  test.deepEqual(list.getFirst(), 0);
  test.deepEqual(list.getLast(), 19);
  test.ok(20 === list.size());

  // remove first
  test.deepEqual(list.removeFirst(), 0);
  test.deepEqual(list.getFirst(), 1);
  test.deepEqual(list.getLast(), 19);
  test.ok(19 === list.size());

  // remove last
  test.deepEqual(list.removeLast(), 19);
  test.deepEqual(list.getFirst(), 1);
  test.deepEqual(list.getLast(), 18);
  test.ok(18 === list.size());

  // add first
  list.addFirst(20);
  test.ok(19 === list.size());
  test.deepEqual(list.getFirst(), 20);
  test.deepEqual(list.getLast(), 18);

  // add last
  list.addLast(22);
  test.ok(20 === list.size());
  test.deepEqual(list.getFirst(), 20);
  test.deepEqual(list.getLast(), 22);

  // remove
  test.deepEqual(list.remove(null), false);
  test.deepEqual(list.remove(10), true);
  test.ok(19 === list.size());

  list.clear();
  test.ok(0 === list.size());

  test.done();
};

exports['LinkedList.asArray'] = function(test) {
  var list = new LinkedList(testCompareFunc);

  for (var i=0; i<20; i++) {
    list.add(i);
  }

  test.deepEqual(list.getAt(3), 3);
  test.deepEqual(list.getAt(20), undefined);

  test.deepEqual(list.setAt(4, 24), 4);
  test.deepEqual(list.getAt(4), 24);

  test.deepEqual(list.setAt(20, 40), null);
  
  list.addAt(0, -1);
  test.deepEqual(list.getAt(0), -1);
  test.deepEqual(list.getAt(1), 0);
  test.deepEqual(list.getAt(20), 19);

  list.addAt(21, 20);
  test.deepEqual(list.getAt(0), -1);
  test.deepEqual(list.getAt(20), 19);
  test.deepEqual(list.getAt(21), 20);

  list.addAt(10, 11);
  test.deepEqual(list.getAt(9), 8);
  test.deepEqual(list.getAt(10), 11);
  test.deepEqual(list.getAt(11), 9);

  list.removeAt(0);
  test.deepEqual(list.getAt(0), 0);
  test.deepEqual(list.getAt(21), 20);

  list.removeAt(21);
  test.deepEqual(list.getAt(0), 0);
  test.deepEqual(list.getAt(20), 19);

  test.deepEqual(list.indexOf(null), -1);
  test.deepEqual(list.indexOf(20), -1);
  test.deepEqual(list.indexOf(0), 0);
  test.deepEqual(list.indexOf(19), 20);
  test.deepEqual(list.indexOf(17), 18);
  
  test.deepEqual(list.lastIndexOf(null), -1);
  test.deepEqual(list.lastIndexOf(20), -1);
  test.deepEqual(list.lastIndexOf(0), 0);
  test.deepEqual(list.lastIndexOf(19), 20);
  test.deepEqual(list.lastIndexOf(17), 18);

  test.done();
};

exports['LinkedList.asStack'] = function(test) {
  var list = new LinkedList(testCompareFunc);

  list.push(0);
  list.push(1);

  test.deepEqual(list.pop(), 1);
  test.deepEqual(list.pop(), 0);
  test.deepEqual(list.pop(), null);
  test.ok(0 === list.size());

  test.done();
};

exports['LinkedList.asQueue'] = function(test) {
  var list = new LinkedList(testCompareFunc);

  list.offer(0);
  list.offer(1);

  test.deepEqual(list.peek(), 0);
  test.deepEqual(list.poll(), 0);
  test.deepEqual(list.peek(), 1);
  test.deepEqual(list.poll(), 1);
  test.deepEqual(list.poll(), null);

  test.ok(0 === list.size());

  test.done();
};

exports['LinkedList.asDeque'] = function(test) {
  var list = new LinkedList(testCompareFunc);

  list.offerFirst(0);
  list.offerFirst(1);
  list.offerLast(3);
  list.offerLast(4);

  test.deepEqual(list.peekFirst(), 1);
  test.deepEqual(list.peekLast(), 4);

  test.deepEqual(list.pollFirst(), 1);
  test.deepEqual(list.peekFirst(), 0);
  test.deepEqual(list.peekLast(), 4);

  test.deepEqual(list.pollLast(), 4);
  test.deepEqual(list.peekFirst(), 0);
  test.deepEqual(list.peekLast(), 3);

  test.ok(2 === list.size());

  test.done();
};
