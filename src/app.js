/**
 * app
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {mongodb} from "steeplejack-mongodb";
import {Restify} from "steeplejack-restify";
import {Server} from "steeplejack/lib/server";
import {Steeplejack} from "steeplejack";


/* Files */
import config from "./config.json";
import env from "./envvars.json";


/* Create and configure the application */
const app = Steeplejack.app({
    config,
    env,
    modules: [
        `${__dirname}/!(node_modules|routes)/**/*.js`,
        mongodb
    ],
    routesDir: `${__dirname}/routes`
});

/* Configure the server strategy */
app.run(($config, $logger) => {

    /* Configure the Restify strategy */
    const restify = new Restify({
        name: $config.server.name
    });

    restify.bodyParser()
        .enableCORS()
        .gzipResponse()
        .queryParser();

    /* Create the server instance */
    const server = new Server($config.server, restify);

    /* Log errors */
    server.on("error_log", (err) => {

        if (err.type === "VALIDATION") {
            $logger.debug("Validation error", err);
            /* Create as separate as error might not have getErrors method so don't lose error */
            $logger.debug("Validation error detail", JSON.stringify(err.getErrors(), null, 2));
        } else if (_.isNumber(err)) {
            /* Promise rejected with just a number - we know nothing else about this error */
            $logger.trace(`HTTP rejected with code: ${err}`);
        } else {
            $logger.error("General error", err);
        }

    });

    return server;

});

export { app };
