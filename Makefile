.PHONY: clean

SRCS = src/header.js                 \
       src/namespace.js              \
       src/Leaf.js                   \
       src/Node.js

build: $(LIBS) $(SRCS)
	mkdir -p build
	cat $(SRCS) > build/hijos.js
	jsmin <build/hijos.js >build/hijos-tmp.js
	cat src/header.js build/hijos-tmp.js > build/hijos-min.js
	rm build/hijos-tmp.js

clean:
	rm -rf build
