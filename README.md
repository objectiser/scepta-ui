# SCEPTA UI

SCEPTA is an open source project for policy authoring, deployment, execution and monitoring.

This repository provides the UI for the project, built using the [hawt.io framework](http://hawt.io/), [angular](https://angularjs.org/) and [typescript](http://www.typescriptlang.org/).



## Building from source

The first step is to fork and clone the project. Navigate to the [project repository](https://github.com/scepta/scepta-ui) and press the Fork button to create a fork of the project under your own github account. Then create a local clone of your fork using:

```
git clone git@github.com:<your-username>/scepta-ui.git
```

Using a command window, go into the _scepta-ui_ folder and issue the following commands:

```
npm install
bower install
```

Note: See [installing npm]() for instructions on how to install _npm_, and [installing bower](http://bower.io/#install-bower) if _bower_ is not on your system.


## Locally testing

Run the following command to start up a test web server:

```
gulp
```

and when ready, it will indicate that a browser should be opened at: http://localhost:2772

However to properly develop and test the UI you will also need to startup a SCEPTA server to respond to the REST calls.


