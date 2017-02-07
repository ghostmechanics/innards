'use strict';

const Blankie = require('blankie');
const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Pino = require('hapi-pino');
const Pug = require('pug');
const Scooter = require('scooter');
const Vision = require('vision');

const server = new Hapi.Server();
const exitValue = 1;

server.connection({
    host: 'localhost',
    port: 13000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, '/')
        }
    }
});

server.ext('onPreResponse', (request, reply) => {
    if (!request.response.isBoom) {
        return reply.continue();
    }

    return reply.view('error', request.response).code(request.response.output.statusCode);
});

server.register([Scooter, {
    register: Blankie,
    options: {
        defaultSrc: 'self',
        imgSrc: ['self', 'data:']
    }
}, Inert, Pino, Vision], err => {
    if (err) {
        console.error(err);
        /* eslint-disable no-process-exit */
        process.exit(exitValue);
        /* eslint-enable */
    }

    server.views({
        engines: {
            pug: Pug
        },
        path: `${__dirname}/views`,
        compileOptions: {
            pretty: true
        },
        isCached: false
    });

    // default file handler via Inert
    server.route({
        method: 'GET',
        path: '/{filename*}',
        handler: {
            file: function file(request) {
                return request.params.filename;
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function handler(request, reply) {
            reply.view('index');
        }
    });

    server.start(error => {
        if (error) {
            console.error(error);
            /* eslint-disable no-process-exit */
            process.exit(exitValue);
            /* eslint-enable */
        }
        server.logger().info(` 💻  Server running at ${server.info.uri}`);
    });
});
