// Have some boilerplate

'use strict';

const constants = require('./constants');
const app = {};

app.init = function init() {
    console.info('app has been initialized. here it is:', app, constants);
};

app.init();

module.exports = app;
