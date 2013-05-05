(function() {

    buster.testCase('nodeSuite', {

        "test node starts with null relationships": function() {
            var node = new hijos.Node();
            assert.same(0, node.childNodes.length);
            assert.same(null, node.firstChild);
            assert.same(null, node.lastChild);
            assert.same(null, node.parentNode);
            assert.same(null, node.previousSibling);
            assert.same(null, node.nextSibling);
            assert.same(false, node.hasChildNodes());
        },

        "test Leaf.prototype is initialized correctly": function() {
            var node = hijos.Node.prototype;
            assert.same(null, node.firstChild);
            assert.same(null, node.lastChild);
            assert.same(null, node.parentNode);
            assert.same(null, node.previousSibling);
            assert.same(null, node.nextSibling);
            assert.same(false, node.hasChildNodes());
        },

        "test node has required methods": function() {
            var node = new hijos.Node();
            assert.same('function', typeof node.destroy);
            assert.same('function', typeof node.hasChildNodes);
            assert.same('function', typeof node.insertBefore);
            assert.same('function', typeof node.appendChild);
            assert.same('function', typeof node.replaceChild);
            assert.same('function', typeof node.removeChild);
        },

        "test Node.mixin adds required methods": function() {
            var obj = {}
            hijos.Node.mixin(obj);
            assert.same('function', typeof obj.destroy);
            assert.same('function', typeof obj.hasChildNodes);
            assert.same('function', typeof obj.insertBefore);
            assert.same('function', typeof obj.appendChild);
            assert.same('function', typeof obj.replaceChild);
            assert.same('function', typeof obj.removeChild);
            assert.isArray(obj.childNodes);
            assert.same(0, obj.childNodes.length);
            assert.same(null, obj.firstChild);
            assert.same(null, obj.lastChild);
            assert.same(null, obj.parentNode);
            assert.same(null, obj.previousSibling);
            assert.same(null, obj.nextSibling);
        },

        "test appendChild on empty Node": function() { // also tests insertBefore with oldChild = null
            var parent = new hijos.Node();
            var child = new hijos.Node();
            parent.appendChild(child);
            assert.same(true, parent.hasChildNodes());
            assert.same(1, parent.childNodes.length);
            assert.same(child, parent.childNodes[0]);
            assert.same(child, parent.firstChild);
            assert.same(child, parent.lastChild);
            assert.same(parent, child.parentNode);
            assert.same(null, child.previousSibling, 'previousSibling');
            assert.same(null, child.nextSibling, 'nextSibling');
        },

        "test appendChild on non empty Node": function() {
            var parent = new hijos.Node();
            var child0 = new hijos.Node();
            parent.appendChild(child0);
            var child1 = new hijos.Node();
            parent.appendChild(child1);
            assert.same(2, parent.childNodes.length);
            assert.same(child0, parent.childNodes[0]);
            assert.same(child1, parent.childNodes[1]);
            assert.same(child0, parent.firstChild);
            assert.same(child1, parent.lastChild);
            assert.same(parent, child0.parentNode);
            assert.same(parent, child1.parentNode);
            assert.same(null, child0.previousSibling);
            assert.same(child1, child0.nextSibling);
            assert.same(child0, child1.previousSibling);
            assert.same(null, child1.nextSibling);
        },

        "test appendChild to move a node within the same parent": function() {
            var parent = new hijos.Node();
            var child0 = new hijos.Node();
            parent.appendChild(child0);
            var child1 = new hijos.Node();
            parent.appendChild(child1);

            assert.same(2, parent.childNodes.length);
            assert.same(child0, parent.childNodes[0]);
            assert.same(child1, parent.childNodes[1]);
            assert.same(child0, parent.firstChild);
            assert.same(child1, parent.lastChild);
            assert.same(parent, child0.parentNode);
            assert.same(parent, child1.parentNode);
            assert.same(null, child0.previousSibling);
            assert.same(child1, child0.nextSibling);
            assert.same(child0, child1.previousSibling);
            assert.same(null, child1.nextSibling);

            parent.appendChild(child0); // swaps the order of the child nodes

            assert.same(2, parent.childNodes.length);
            assert.same(child1, parent.childNodes[0]);
            assert.same(child0, parent.childNodes[1]);
            assert.same(child1, parent.firstChild);
            assert.same(child0, parent.lastChild);
            assert.same(parent, child0.parentNode);
            assert.same(parent, child1.parentNode);
            assert.same(null, child1.previousSibling);
            assert.same(child0, child1.nextSibling);
            assert.same(child1, child0.previousSibling);
            assert.same(null, child0.nextSibling);
        },

        "test insertBefore on non empty Node": function() {
            var parent = new hijos.Node();
            var child0 = new hijos.Node();
            parent.appendChild(child0);
            var child2 = new hijos.Node();
            parent.appendChild(child2);
            var child1 = new hijos.Node();
            parent.insertBefore(child1, child2);
            assert.same(3, parent.childNodes.length);
            assert.same(child0, parent.childNodes[0]);
            assert.same(child1, parent.childNodes[1]);
            assert.same(child2, parent.childNodes[2]);
            assert.same(child0, parent.firstChild);
            assert.same(child2, parent.lastChild);
            assert.same(parent, child0.parentNode);
            assert.same(null, child0.previousSibling);
            assert.same(child1, child0.nextSibling);
            assert.same(parent, child1.parentNode);
            assert.same(child0, child1.previousSibling);
            assert.same(child2, child1.nextSibling);
            assert.same(parent, child2.parentNode);
            assert.same(child1, child2.previousSibling);
            assert.same(null, child2.nextSibling);
        },

        "test replaceChild": function() {
            var parent = new hijos.Node();
            var child0 = new hijos.Node();
            parent.appendChild(child0);
            var child1 = new hijos.Node();
            parent.replaceChild(child1, child0);
            assert.same(1, parent.childNodes.length);
            assert.same(child1, parent.childNodes[0]);
            assert.same(child1, parent.firstChild);
            assert.same(child1, parent.lastChild);
            assert.same(null, child0.parentNode);
            assert.same(null, child0.previousSibling);
            assert.same(null, child0.nextSibling);
            assert.same(parent, child1.parentNode);
            assert.same(null, child1.previousSibling);
            assert.same(null, child1.nextSibling);
        },

        "test removeChild": function() {
            var parent = new hijos.Node();
            var child0 = new hijos.Node();
            parent.appendChild(child0);
            var child1 = new hijos.Node();
            parent.appendChild(child1);
            var child2 = new hijos.Node();
            parent.appendChild(child2);
            parent.removeChild(child1);
            assert.same(2, parent.childNodes.length);
            assert.same(child0, parent.childNodes[0]);
            assert.same(child2, parent.childNodes[1]);
            assert.same(child0, parent.firstChild);
            assert.same(child2, parent.lastChild);
            assert.same(parent, child0.parentNode);
            assert.same(null, child0.previousSibling);
            assert.same(child2, child0.nextSibling);
            assert.same(null, child1.parentNode);
            assert.same(null, child1.previousSibling);
            assert.same(null, child1.nextSibling);
            assert.same(parent, child2.parentNode);
            assert.same(child0, child2.previousSibling);
            assert.same(null, child2.nextSibling);
        },

        "test last removeChild": function() {
            var parent = new hijos.Node();
            var child0 = new hijos.Node();
            parent.appendChild(child0);
            parent.removeChild(child0);
            assert.same(false, parent.hasChildNodes());
            assert.same(0, parent.childNodes.length);
            assert.same(null, parent.firstChild);
            assert.same(null, parent.lastChild);
            assert.same(null, child0.parentNode);
            assert.same(null, child0.previousSibling);
            assert.same(null, child0.nextSibling);
        }

    });

}());
