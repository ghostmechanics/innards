// Here, have some boilerplate

'use strict';

const constants = require('./constants');
const app = {};

app.init = function init() {
    console.info('Your app has been initialized. Here it is:', app, constants);
};

app.init();

module.exports = app;
