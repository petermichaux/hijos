/**

@property hijos.Leaf

@description

A constructor function for creating Leaf objects to be used as part
of the composite design pattern.

Leaf objects have three read-only properties describing the Leaf object's
relationships to other Leaf and Node objects participating in
the composite pattern.

    1. parentNode
    2. previousSibling
    3. nextSibling

These properties will be null when the Leaf is not a child
of a Node object. To attach a Leaf to a Node, use the Node's child
manipulation methods: appendChild, insertBefore, replaceChild.
To remove a Leaf from a Node use the Node's removeChild method.

var leaf = new hijos.Leaf();

*/
hijos.Leaf = function() {
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

/**

@property hijos.Leaf.prototype.destroy

@description

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
Node object unless this Leaf object is not contained by a Node.

*/
hijos.Leaf.prototype.destroy = function() {
    // Loosing references to relations may help garbage collection.
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

// insure prototype object is initialized properly
hijos.Leaf.call(hijos.Leaf.prototype);

/**

@property hijos.Leaf.mixin

@parameter obj {object} The object to become a Leaf.

@description

Mixes in the Leaf methods into any object. Be sure to call the hijos.Leaf
constructor to initialize the Leaf's properties.

app.MyView = function() {
    hijos.Leaf.call(this);
};
hijos.Leaf.mixin(app.MyView.prototype);

*/
hijos.Leaf.mixin = function(obj) {
    obj.destroy = hijos.Leaf.prototype.destroy;
    hijos.Leaf.call(obj);
};
