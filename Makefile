.PHONY: clean

SRCS = src/header.js                 \
       src/namespace.js              \
       src/Leaf.js                   \
       src/Node.js

hijos.js: $(LIBS) $(SRCS)
	cat $(SRCS) > hijos.js

clean:
	rm hijos.js
