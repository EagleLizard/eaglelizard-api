
include .env

# simple file dev server
sfs-dev:
	python3 -m http.server -d ./_local/static ${SFS_PORT}
