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

@property hijos.Leaf

@description

A constructor function for creating leaf objects to be used as part
of the composite design pattern.

Leaf objects have three read-only properties describing the Leaf's
relationships to other objects participating in the composite pattern.

    1. parentNode
    2. previousSibling
    3. nextSibling

These properties may be undefined or null when the leaf is not a child
of a node object. To attach a leaf to a node, use the node's child
manipulation methods: appendChild, insertBefore, replaceChild.
To remove a leaf from a node use the node's removeChild method.

var leaf = new hijos.Leaf();

*/
hijos.Leaf = function() {};

/**

@property hijos.Leaf.prototype.destroy

@description

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
node object unless this object is not contained by a node.

*/
hijos.Leaf.prototype.destroy = function() {
    // Deleting references to relations may help garbage collection.
    delete this.parentNode;
    delete this.nextSibling;
    delete this.previousSibling;
};

/**

@property hijos.mixinLeaf

@parameter obj {object} The object to become a leaf.

@description

Mixes in the leaf methods into any object.

var o = {};
hijos.mixinLeaf(o);

*/
hijos.mixinLeaf = function(obj) {
    obj.destroy = hijos.Leaf.prototype.destroy;
};
