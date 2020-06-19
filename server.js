'use strict';

const Blankie = require('blankie');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Path = require('path');
const Pino = require('hapi-pino');
const Pug = require('pug');
const Scooter = require('@hapi/scooter');
const Vision = require('@hapi/vision');

const constants = require('./js/constants');
const exitValue = 1;

const server = new Hapi.Server({
    host: 'localhost',
    port: 13000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, '/')
        }
    }
});

const begin = async() => {
    await server.register([
        {
            plugin: Scooter
        },
        {
            plugin: Blankie,
            options: {
                defaultSrc: 'self',
                imgSrc: ['self', 'data:'],
                objectSrc: 'none'
            }
        },
        {
            plugin: Inert
        },
        // ,
        {
            plugin: Pino
        },
        {
            plugin: Vision
        }], {});

    // err => {
    //     if (err) {
    //         console.error(err);
    //         /* eslint-disable no-process-exit */
    //
    //         process.exit(exitValue);
    //         /* eslint-enable */
    //     }

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
            file: (request) => {
                return request.params.filename;
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            return reply.view('index', {
                constants: constants
            });
        }
    });
    // });

    await server.start();

    server.logger().info(` 💻  Server running at ${server.info.uri}`);
};

server.ext('onPreResponse', async(request, reply) => {
    if (!request.response.isBoom) {
        return reply.continue;
    }

    return reply.view('error', request.response).code(request.response.output.statusCode);
});

begin();
