# to run the app, run `make server` in one terminal, and `make run` in another
test: test_pure test_fm

test_pure:
	node test/pure_test.js

test_fm:
	node test/fm_test.js

server:
	python3 -m http.server 8000

# on a osx you can symlink or alias open to xdg-open
run: index.html
	xdg-open http://localhost:8000/index.html

index.html: index.html.in
	m4 index.html.in > index.html

clean:
	rm -f index.html
