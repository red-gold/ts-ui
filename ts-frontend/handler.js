/**
 * Modified from https://github.com/openfaas/openfaas-cloud/blob/master/dashboard/of-cloud-dashboard/handler.js
 */

'use strict';

const fs = require('fs');
const request = require('request');

module.exports = (event, context) => {
    const { method, path } = event;

    if (!(method == 'GET' || method == 'POST')) {
        context.status(400).fail('Bad Request');
        return;
    }

    if (/^\/logout\/?$/.test(path)) {
        return handleLogout(context);
    }

    let headers = {
        'Content-Type': '',
    };
    if (/.*\.js/.test(path)) {
        headers['Content-Type'] = 'application/javascript';
    } else if (/.*\.css/.test(path)) {
        headers['Content-Type'] = 'text/css';
    } else if (/.*\.svg/.test(path)) {
        headers['Content-Type'] = 'image/svg+xml';
    } else if (/.*\.png/.test(path)) {
        headers['Content-Type'] = 'image/x-icon';
    } else if (/.*\.ico/.test(path)) {
        headers['Content-Type'] = 'image/x-icon';
    } else if (/.*\.json/.test(path)) {
        headers['Content-Type'] = 'application/json';
    } else if (/.*\.map/.test(path)) {
        headers['Content-Type'] = 'application/octet-stream';
    }

    let contentPath = `${__dirname}/dist${path}`;

    if (!headers['Content-Type']) {
        contentPath = `${__dirname}/dist/index.html`;
    }

    fs.readFile(contentPath, (err, data) => {
        if (err) {
            context.headers(headers).status(500).fail(err);

            return;
        }

        let content = data.toString();

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'text/html';
        }

        context.headers(headers).status(200).succeed(content);
    });
};
