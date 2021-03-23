# express-server-template

## Install
```
$ npm install
```

## Configure

### `.babelrc`

from:
```
  "alias": {
    "@est": "./",
  }
```

to:
```
  "alias": {
    "@app": "./"
  }
```

### `config.js`

from :
```
const port = process.env.APP_PORT === undefined ? 80 : process.env.EST_PORT;
```

to:
```
const port = process.env.APP_PORT === undefined ? 80 : process.env.YOUR_APP_SCOPENAME_PORT;
```

### `./src/generators/model`

#### `package.json`

from:
```
"name": "generator-est-model",
```

to:
```
"name": "generator-app-model",
```

#### `app/templates/index.js`

Match to your scope and file format

### `./static/index.html`

Update `<title>` and content in `<main>`.

### `index.js`

Update all imports to match your new project scope name, for instance:
```
const Log = require('@est/bin/log');
```

## Create models

```
$ cd ./src/generator/model
$ npm i
$ npm link
$ cd ../../../
$ yo app-model
``` 
