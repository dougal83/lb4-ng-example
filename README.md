# lb4-ng-example

Simple example combining Loopback 4 /w Angular

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

## Finally

Minor alterations to ng client app /w added simple service to consume ping endpoint.
