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

// an ordered composite for the composite design pattern
//
hijos.Node = function() {};

hijos.mixinLeaf(hijos.Node.prototype);

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

hijos.mixinNode = function(obj) {
    for (var p in hijos.Node.prototype) {
        if (Object.prototype.hasOwnProperty.call(hijos.Node.prototype, p) &&
            (typeof hijos.Node.prototype[p] === 'function')) {
            obj[p] = hijos.Node.prototype[p];
        }
    }
};
