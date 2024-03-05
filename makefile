install:
	docker build -t app .
run:
	docker run --rm -it -v "$PWD":/app -p 3000:3000 app