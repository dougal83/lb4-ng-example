# lb4-ng-example

Simple example combining Loopback 4 /w Angular. See [Part 2](#part-2---further-tooling-dbng-service-generation) for additional features. See [Part 3](#part-3---introduce-jwt-authorisation) for auth features.

Just run repo:

```
git clone https://github.com/dougal83/lb4-ng-example.git
cd lb4-ng-example
npm run setup
npm run dev
```

## Repo creation guide

Simple base instructions (rough guide).

```
mkdir lb4-ng-example
git init
npm init

lb4 app (to reside in /server folder)
ng new client (to reside in /client folder)
```

### Wire up lb4 to host ng client

Basically(see files in this repo or source):

- create express server to host lb4 app @ /server/src/server.ts
- mount express server @ /server/src/index.ts
- amend acceptance tests @ /server/src/\_\_tests\_\_/acceptance

[Source: Integrate express /w lb4](https://github.com/strongloop/loopback-next/tree/master/examples/express-composition)

### Install dev packages

`npm install --save-dev rimraf concurrently wait-on nodemon`

### Add scripts to package.json

```
"setup:server": "cd server && npm i",
"setup:client": "cd client && npm i",
"setup": "npm i && npm run setup:server && npm run setup:client",
"clean": "npx rimraf server/dist",
"prewatch:client": "npx rimraf server/public",
"watch:client": "cd client && start /min ng build --watch --output-path ../server/public",
"watch:server": "start /min npm run --prefix server build:watch",
"predev": "npm run clean",
"dev": "npx concurrently --success first --kill-others \"npm run watch:client\" \"npx wait-on -d 3000 server/public && npm run watch:server\"  \"npx wait-on server/dist && cd server && npx nodemon --watch dist index.js\" ",
"prebuild:client": "npx rimraf server/public",
"build:client": "cd client && ng build --prod --output-path ../server/public",
"build:server": "npm run --prefix server build",
"prebuild": "npm run clean",
"build": "npm run build:client && npm run build:server"
```

### Alter script in /server/package.json

`"build:watch": "lb-tsc --watch --outDir dist",`

## Part 2 - Further tooling db/ng service generation

Now we add:

- database for development(script to deploy docker postgres image)
- simple model(e.g. [todos](https://github.com/strongloop/loopback-next/tree/master/examples/todo), follow tutorial instructions)
- ng api module generator(automatic creation of services to consume the lb4 api)

### Add Database scripts

You can skip this section and use a different datasource in your lb4 server app. This is just an example afterall. See /bin folder for scripts(tested on Win 10 with Unix compatability). These require that you install [Docker](https://docs.docker.com/) onto your computer. It's worth exposing yourself to docker if you're unfamiliar.

N.b. You can run `npm run start:db` to restart the db has been added incase the docker instance has stopped.

### Install dev packages

`npm i --save-dev @openapitools/openapi-generator-cli`

### Add/Amend scripts to package.json

```
"setup:db": "sh ./bin/setup.sh && node server/dist/migrate",
"setup": "npm i && npm run setup:server && npm run setup:client && npm run setup:db",
"start:db": "docker start POSTGRES_LB4NGEX",
"start:server": "npm run --prefix server start",
"build:api": "npx openapi-generator generate -i http://127.0.0.1:3000/api/openapi.json -g typescript-angular -o client/src/app/api",
"pregen:apimodule": "npx rimraf client/src/app/api",
"gen:apimodule": "npx concurrently --success first --kill-others \"npm run start:server\" \"npx wait-on http://127.0.0.1:3000/api/openapi.json && npm run build:api\""
```

### Generate Ng Api Module

We are using the [OpenAPI Tools - OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator)

You will need to run `npm run gen:apimodule` after making changes to lb4 server models/controllers/etc to reflect changes on client. Afterward you will need to confirm the ng client references are correct where the module is used. Remember to use lb4's db migration tool as necessary to update the database schema.

N.b. You can actually integrate prettier for the generated code but that is beyond the scope of this repo. A starting point(Win) would be:

```
"build:api": "npx openapi-generator generate -i http://127.0.0.1:3000/api/openapi.json -g typescript-angular -o client/src/app/api --enable-post-process-file",
"build:apimodule": "cross-env TS_POST_PROCESS_FILE=\"%APPDATA%/npm/prettier.cmd --write\" npm run build:api",
"pregen:apimodule": "npx rimraf client/src/app/api",
"gen:apimodule": "npx concurrently --success first --kill-others \"npm run start:server\" \"npx wait-on http://127.0.0.1:3000/api/openapi.json && npm run build:apimodule\""
```

## Part 3 - Introduce JWT authorisation

- Copy server implementation WIP, [Source](https://github.com/strongloop/loopback4-example-shopping/).
- Regenerate ng api module. `npm run gen:apimodule`
- Implement user registration/login forms, enable jwt transport /w http requests.

See commit history for file changes.

### Install packages

```
cd server
npm install --save @loopback/authentication bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

```
cd client
npm --save install @auth0/angular-jwt
```

#####

Any questions? Feel free to raise an issue to discuss. Happy to recieve pull requests or improvements. This repo is a bare bones example and the project structure should not be followed for production.
