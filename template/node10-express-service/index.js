// Copyright (c) Alex Ellis 2017. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

"use strict"

const express = require('express')
const app = express()
const handler = require('./function/handler');

async function init() {
    await handler({"app": app});

    const port = process.env.http_port || 3000;
    app.disable('x-powered-by');

    app.listen(port, () => {
        console.log(`node10-express-service, listening on port: ${port}`)
    });    
}

init();