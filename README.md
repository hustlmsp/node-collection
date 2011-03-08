# collection.js

Collection is a utility for representing and manipulating collections for nodejs.

## Quick Examples

    var TreeMap = require('src/collection').TreeMap;

    // define compare function
    function compareFunc(k1, k2) {
      return k1 - k2;
    }

    var treemap = new TreeMap(compareFunc);
    treemap.put(1101, {value: "This is a test blob."});
    console.log(treemap.get(1101));

    var submap = treemap.tailMap(1000, false);
    console.log(submap.get(1101));
