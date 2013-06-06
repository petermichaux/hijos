(function() {

    buster.testCase('leafSuite', {

        "test Leaf has superConstructor Object": function() {
            assert.same(Object, hijos.Leaf.superConstructor);
        },

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

        "test Leaf.mixin adds destroy method and null props": function() {
            var obj = {};
            hijos.Leaf.mixin(obj);
            assert.same('function', typeof obj.destroy);
            assert.same(null, obj.parentNode);
            assert.same(null, obj.previousSibling);
            assert.same(null, obj.nextSibling);
        },

        "test Leaf.prototype is initialized correctly": function() {
            assert.same(null, hijos.Leaf.prototype.parentNode);
            assert.same(null, hijos.Leaf.prototype.previousSibling);
            assert.same(null, hijos.Leaf.prototype.nextSibling);
        }

    });

}());
