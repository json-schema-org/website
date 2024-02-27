install:
	docker build -t app .
run:
	docker run --rm -it -v "$PWD":/app -p 3002:3000 app