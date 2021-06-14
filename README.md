# eaglelizard-api

## Getting Started

install dependencies:
```sh
npm i
```

## Local Dev
This project uses Typescript.

### dotenv
config and secrets can be stored in a `.env` file locally for testing:
```sh
touch .env
```

add the following to specify port for the config:
```
PORT=4369
```

### TS Compilation
Compile with typescript:
```sh
tsc
```
or to run in watch mode, open a separate terminal and run:
```sh
npm run dev
```
Or with your global ts compiler:
```sh
tsc -w
```

### Running the server
run:
```sh
npm start
```

This will run `nodemon` to watch for changes in the compiled assets under `/dist`

### Testing your dev environment
This project has a `/healthcheck` endpoing that you can hit to test your environment. From Postman/Insomnia, or in the browser:
```
GET localhost:4369/healthcheck
```
You should see output in the console, and in the `logs/<logfile>` via:
```sh
tail -f logs/eaglelizard-api.log
```