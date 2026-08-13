test: test_pure

test_pure:
	node test/pure_test.js

server:
	python3 -m http.server 8000

# on a osx you can symlink or alias open to xdg-open
run:
	xdg-open http://localhost:8000/index.html
