(function() {

    buster.testCase('leafSuite', {

        "test leaf starts with null relationships": function() {
            var leaf = new hijos.Leaf();
            assert.same(null, leaf.parentNode);
            assert.same(null, leaf.previousSibling);
            assert.same(null, leaf.nextSibling);
        },

        "test leaf has a destroy method": function() {
            // all nodes and leaves need a destroy function
            var leaf = new hijos.Leaf();
            assert.same('function', typeof leaf.destroy);
        },

        "test mixinLeaf adds destroy method": function() {
            var obj = {};
            hijos.mixinLeaf(obj);
            assert.same('function', typeof obj.destroy);
        }

    });

}());
