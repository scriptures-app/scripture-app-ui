# Static Bible Web App Generator

The goal of this project is to generate a Bible app that is a [progressive web app](https://en.wikipedia.org/wiki/Progressive_web_applications) and does not require any backend to run, just a static file server.

## How to generate your Bible app

First, clone this repository

```
git clone https://github.com/bible-reader/static-web-app-generator.git
```

Go to the cloned directory

```
cd static-web-app-generator
```

Install dependencies either by running `yarn install` or `npm install`.

### Generating data files for Bible versions

At the end of the installation step the Bible data files are generated. These files are generated based on configuration in [`src/config.ts`](https://github.com/bible-reader/static-web-app-generator/blob/master/src/config.ts). You can use this configuration file to transform OpenSong or Unbound Bible formats to the JSON format used by this generator. Use your prefered Bible versions.

After you change [`src/config.ts`](https://github.com/bible-reader/static-web-app-generator/blob/master/src/config.ts), generate the new Bible files again by running either `yarn generate` or `npm run generate`.

### Own logo icon

Replace `logo.png` with your own icon that will be used for generating both favicon and shortcut icons.

### Running locally in development mode

Run either `yarn start` or `npm start` to start the application in itneractive development mode. As you change your code, the changes are watched and the app is automatically reloaded with each change.

### Build for production

Run either `yarn build` or `npm build` to build the production static files. They are found in `buid/` directory. The contents of the directory can be copied to your webhosting www root directory.

You can use [serve](https://www.npmjs.com/package/serve) to test production build locally:

```
serve -d build/
```

### Custom app name

Instead of Bible Reader, you can use your own app name, like "My Bible App". Use `APP_NAME` environment variable for setting your custom app name like this:

In development:

```
APP_NAME="My Bible App" yarn start
```

In production

```
APP_NAME="My Bible App" yarn build
```
