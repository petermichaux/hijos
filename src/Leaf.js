/**

A constructor function for creating `Leaf` objects to be used as part
of the composite design pattern.

    var leaf = new hijos.Leaf();

To attach a `Leaf` to a `Node`, use the `Node`'s child
manipulation methods: `appendChild`, `insertBefore`, `replaceChild`.
To remove a `Leaf` from a `Node` use the `Node`'s `removeChild` method.

@constructor

*/
hijos.Leaf = function() {
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

/**

@property hijos.Leaf.superConstructor

*/
hijos.Leaf.superConstructor = Object;

/**

The parent `Node` of this object. Null if this object is not the child of
any `Node`.

@member hijos.Leaf.prototype.parentNode

@type {hijos.Leaf}

@readonly

*/

/**

The previous sibling `Leaf` of this object. Null if this object is not the child of
any `Node` or this object is the first child of a `Node`.

@member hijos.Leaf.prototype.previousSibling

@type {hijos.Leaf}

@readonly

*/

/**

The next sibling `Leaf` of this object. Null if this object is not the child of
any `Node` or this object is the last child of a `Node`.

@member hijos.Leaf.prototype.nextSibling

@type {hijos.Leaf}

@readonly

*/

/**

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
`Node` object unless this `Leaf` object is not contained by a `Node`.

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

Mixes in the `Leaf` methods into any object. Be sure to call the `hijos.Leaf`
constructor to initialize the `Leaf`'s properties.

    app.MyView = function() {
        hijos.Leaf.call(this);
    };
    hijos.Leaf.mixin(app.MyView.prototype);

@param {Object} obj The object to become a `Leaf`.

*/
hijos.Leaf.mixin = function(obj) {
    obj.destroy = hijos.Leaf.prototype.destroy;
    hijos.Leaf.call(obj);
};
