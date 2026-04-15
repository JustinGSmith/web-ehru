test: test_pure

test_pure:
	node test/pure_test.js

server:
	python3 -m http.server 8000
