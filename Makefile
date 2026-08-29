# to run the app, run `make server` in one terminal, and `make run` in another
OPEN=xdg-open
PORT=8080

run: index.html
	${OPEN} http://localhost:${PORT}/index.html

index.html: html-in/instrument.html.in html-in/index.html.in
	m4 html-in/instrument.html.in html-in/index.html.in > index.html

test: test_orchestra test_fm test_keys test_gui test_ops

test_orchestra:
	node test/orchestra_test.js

test_fm:
	node test/fm_test.js

test_keys:
	node test/keys_test.js

test_gui:
	node test/gui_test.js

test_ops:
	node test/ops_test.js

server: index.html
	python3 -m http.server ${PORT}

clean:
	rm -f index.html
