/*
 * Copyright (c) 2012, Peter Michaux, http://peter.michaux.ca/
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

/**

@property hijos.Node

@description

A constructor function for creating node objects with ordered children
to be used as part of the composite design pattern.

Node objects have three read-only properties describing the node's
relationships to other objects participating in the composite pattern.

    1. childNodes
    2. firstChild
    3. lastChild

The firstChild and lastChild properties will be undefined or null when
the node has no children. Do not mutate the elements of the childNodes
array directly. Instead use the appendChild, insertBefore, replaceChild,
and removeChild methods to manage the children.

var node = new hijos.Node();

*/
hijos.Node = function() {
    hijos.Leaf.call(this);
    this.childNodes = [];
};

hijos.mixinLeaf(hijos.Node.prototype);

/**

@property hijos.Node.prototype.destroy

@description

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
node object unless this object is not contained by another node.

*/
hijos.Node.prototype.destroy = function() {
    if (Object.prototype.hasOwnProperty.call(this, 'childNodes')) {
        // copy in case one of the destroy methods modifies this.childNodes
        var children = this.childNodes.slice(0);
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            children[i].destroy();
        }
    }
    hijos.Leaf.prototype.destroy.call(this);
};

/**

@property hijos.Node.prototype.hasChildNodes

@description

Returns true if this node has children. Otherwise returns false.

*/
hijos.Node.prototype.hasChildNodes = function() {
    return Object.prototype.hasOwnProperty.call(this, 'childNodes') &&
           (this.childNodes.length > 0);
};

(function() {

    function wouldBeCircular(node, possibleAncestor) {
        while (node) {
            if (node === possibleAncestor) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };

/**

@property hijos.Node.prototype.appendChild

@parameter newChild {object} The leaf or node object to append.

@description

Adds newChild as the last child of this node. If newChild is a child of
another node then newChild is removed from that other node before appending
to this node.

var parent = new hijos.Node();
var child = new hijos.Leaf();
parent.appendChild(child);
var child = new hijos.Node();
parent.appendChild(child);

*/
    hijos.Node.prototype.appendChild = function(newChild) {
        if (arguments.length < 1) {
            throw new Error('hijos.Node.prototype.appendChild: not enough arguments.');
        }
        // do not allow the creation of a circular tree structure
        if (wouldBeCircular(this, newChild)) {
            throw new Error('hijos.Node.prototype.appendChild: Node cannot be inserted at the specified point in the hierarchy.');
        }
        // remove from previous composite
        var parent = newChild.parentNode;
        if (parent) {
            parent.removeChild(newChild);
        }
        // add to this composite
        if (!Object.prototype.hasOwnProperty.call(this, 'childNodes')) {
            this.childNodes = [];
        }
        var children = this.childNodes;
        children.push(newChild);
        this.firstChild = children[0];
        this.lastChild = newChild;
        newChild.parentNode = this;
        var previousSibling = newChild.previousSibling = children[children.length - 2];
        if (previousSibling) {
            previousSibling.nextSibling = newChild;
        }
        newChild.nextSibling = null;
    };

/**

@property hijos.Node.prototype.insertBefore

@parameter newChild {object} The leaf or node object to insert.

@parameter oldChild {object|null} The child object to insert before.

@description

Inserts newChild before oldChild. If oldChild is null then this is equivalent
to appending newChild. If newChild is a child of another node then newChild is
removed from that other node before appending to this node.

var parent = new hijos.Node();
var child0 = new hijos.Leaf();
parent.insertBefore(child0, null);
var child1 = new hijos.Node();
parent.insertBefore(child1, child0);

*/
    hijos.Node.prototype.insertBefore = function(newChild, oldChild) {
        if (arguments.length < 2) {
            throw new Error('hijos.Node.prototype.insertBefore: not enough arguments.');
        }
        // newChild is already in correct position
        if (newChild === oldChild) {
            return;
        }
        // if oldChild is null then want to append to end of children
        if ((oldChild === null) || (oldChild === undefined)) {
            this.appendChild(newChild);
            return;
        }
        // do not allow the creation of a circular tree structure
        if (wouldBeCircular(this, newChild)) {
            throw new Error('hijos.Node.prototype.insertBefore: Node cannot be inserted at the specified point in the hierarchy.');
        }
        // continue with normal insertion
        if (!Object.prototype.hasOwnProperty.call(this, 'childNodes')) {
            this.childNodes = [];
        }
        var children = this.childNodes;
        // find index of oldChild
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            if (children[i] === oldChild) {
                var indexOfOldChild = i;
                break;
            }
        }
        if (typeof indexOfOldChild !== 'number') {
            throw new Error('hijos.Node.prototype.insertBefore: Node was not found.');
        }
        // remove from previous composite
        var parent = newChild.parentNode;
        if (parent) {
            parent.removeChild(newChild);
        }
        // add to this composite
        children.splice(indexOfOldChild, 0, newChild);
        this.firstChild = children[0];
        this.lastChild = children[children.length - 1];
        newChild.parentNode = this;
        var previousSibling = newChild.previousSibling = children[indexOfOldChild - 1];
        if (previousSibling) {
            previousSibling.nextSibling = newChild;
        }
        var nextSibling = newChild.nextSibling = children[indexOfOldChild + 1];
        if (nextSibling) {
            nextSibling.previousSibling = newChild;
        }
    };

/**

@property hijos.Node.prototype.replaceChild

@parameter newChild {object} The leaf or node object to insert.

@parameter oldChild {object} The child object to remove and replace.

@description

Replaces oldChild with newChild. If newChild is a child of another node
then newChild is removed from that other node before appending to this node.

var parent = new hijos.Node();
var child0 = new hijos.Leaf();
parent.appendChild(child0);
var child1 = new hijos.Node();
parent.replaceChild(child1, child0);

*/
    hijos.Node.prototype.replaceChild = function(newChild, oldChild) {
        if (arguments.length < 2) {
            throw new Error('hijos.Node.prototype.replaceChild: not enough arguments.');
        }
        if (!oldChild) {
            throw new Error('hijos.Node.prototype.replaceChild: oldChild must not be falsy.');
        }
        // child is already in correct position
        if (newChild === oldChild) {
            return;
        }
        // do not allow the creation of a circular tree structure
        if (wouldBeCircular(this, newChild)) {
            throw new Error('hijos.Node.prototype.replaceChild: Node cannot be inserted at the specified point in the hierarchy.');
        }
        // continue with normal insertion
        if (!Object.prototype.hasOwnProperty.call(this, 'childNodes')) {
            this.childNodes = [];
        }
        var children = this.childNodes;
        // find index of oldChild
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            if (children[i] === oldChild) {
                var indexOfOldChild = i;
                break;
            }
        }
        if (typeof indexOfOldChild !== 'number') {
            throw new Error('hijos.Node.prototype.replaceChild: Node was not found.');
        }
        children[indexOfOldChild] = newChild;
        this.firstChild = children[0];
        this.lastChild = children[children.length - 1];
        newChild.parentNode = this;
        oldChild.parentNode = null;
        var previousSibling = newChild.previousSibling = oldChild.previousSibling;
        if (previousSibling) {
            previousSibling.nextSibling = newChild;
        }
        oldChild.previousSibling = null;
        var nextSibling = newChild.nextSibling = oldChild.nextSibling;
        if (nextSibling) {
            nextSibling.previousSibling = newChild;
        }
        oldChild.previousSibling = null;
    };

}());

/**

@property hijos.Node.prototype.removeChild

@parameter oldChild {object} The child object to remove.

@description

Removes oldChild.

var parent = new hijos.Node();
var child = new hijos.Leaf();
parent.appendChild(child);
parent.removeChild(child);

*/
hijos.Node.prototype.removeChild = function(oldChild) {
    if (arguments.length < 1) {
        throw new Error('hijos.Node.prototype.removeChild: not enough arguments.');
    }
    if (Object.prototype.hasOwnProperty.call(this, 'childNodes')) {
        var children = this.childNodes;
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            if (children[i] === oldChild) {
                var previousSibling = children[i - 1];
                if (previousSibling) {
                    previousSibling.nextSibling = oldChild.nextSibling;
                }
                var nextSibling = children[i + 1];
                if (nextSibling) {
                    nextSibling.previousSibling = oldChild.previousSibling;
                }
                oldChild.parentNode = null;
                oldChild.previousSibling = null;
                oldChild.nextSibling = null;
                children.splice(i, 1);
                this.firstChild = children[0];
                this.lastChild = children[children.length - 1];
                return; // stop looking
            }
        }
    }
    throw new Error('hijos.Node.prototype.removeChild: node not found.');
};

/**

@property hijos.mixinNode

@parameter obj {object} The object to become a node.

@description

Mixes in the node methods into any object. Be sure to call the hijos.Node
constructor to initialize the node's properties.

app.MyView = function() {
    hijos.Node.call(this);
};
hijos.mixinNode(app.MyView.prototype);

*/
hijos.mixinNode = function(obj) {
    for (var p in hijos.Node.prototype) {
        if (Object.prototype.hasOwnProperty.call(hijos.Node.prototype, p) &&
            (typeof hijos.Node.prototype[p] === 'function')) {
            obj[p] = hijos.Node.prototype[p];
        }
    }
};
