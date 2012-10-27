Hijos
=====

Composite design pattern mixins for building tree structures.


Examples
--------

For example, the composite design pattern is used in the view layer
as one of the three fundamental design patterns of an MVC application.

```javascript
app.SimpleControlView = function() {
    hijos.Leaf.call(this);
    this.buttonEl = document.createElement('button');
};

hijos.Leaf.mixin(app.SimpleControlView.prototype);

app.SimpleControlView.prototype.disable = function() {
    this.buttonEl.disabled = true;
};

// ---

app.MultiControlsView = function() {
    hijos.Node.call(this);
};

// mixin the appendChild, insertBefore, replaceChild,
// and removeChild methods
hijos.Node.mixin(app.MultiControlsView.prototype);

app.MultiControlsView.prototype.disable = function() {
    // this.childNodes is a real JavaScript array
    this.childNodes.forEach(function(child) {
        child.disable();
    });
};

// ----

var multi = new app.MultiControlsView();
multi.appendChild(new app.SimpleControlView());
multi.appendChild(new app.MultiControlsView());
multi.disable(); // disables the entire tree with one call!

// You can work with a tree using the same functions that you use to work
// with a tree of DOM elements because hijos node and leaf objects implement
// the same interface as the DOM elements. For example, Crockford's walkTheDom:

function walkTheDOM(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        walkTheDOM(node, func);
        node = node.nextSibling;
    }
}

var nodeCount = 0;
walkTheDOM(multi, function() {
    nodeCount++;
});
alert('There are ' + nodeCount + ' nodes in the tree.');
```


Downloads
---------

See http://peter.michaux.ca/downloads/hijos/ for production ready builds.


Status
------

Ready.


Browser Support
---------------

Tested working in IE6 and newer browsers by a variety of manufacturers.


Dependencies
------------

None.


Source Code
-----------

GitHub: https://github.com/petermichaux/hijos


Build
-----

To build the production ready files, you need [JSMin](http://www.crockford.com/javascript/jsmin.html) or any other tool with the same command line interface. Then just type "make" at the command line and look in the build directory for the results.

For the record, this is how I installed JSMin. Note that I have /Users/peter/bin in my PATH.

```sh
$ cd ~/tmp
$ curl -O https://raw.github.com/douglascrockford/JSMin/master/jsmin.c
$ gcc -o jsmin jsmin.c
$ mv jsmin ~/bin
$ rm jsmin.c
$ which jsmin
/Users/peter/bin/jsmin
```


Tests
-----

To run the automated tests, open tst/runner.html in a web browser.


Author
------

Peter Michaux<br>
petermichaux@gmail.com<br>
http://peter.michaux.ca/<br>
[@petermichaux](https://twitter.com/petermichaux)


License
-------

Simplified BSD License. See the included LICENSE file for details.
