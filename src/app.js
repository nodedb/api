/**
 * app
 */

"use strict";


/* Node modules */
import path from "path";


/* Third-party modules */
import {_} from "lodash";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import {Express, expressLib} from "steeplejack-express";
import {mongodb} from "steeplejack-mongodb";
import {Server} from "steeplejack/lib/server";
import {Steeplejack} from "steeplejack";
import uuid from "uuid";
import {View} from "steeplejack/lib/view";


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

    /* Configure the HTTP strategy */
    const express = new Express();

    /* Configure express options */
    express
        .use((req, res, next) => {
            /* Add an id to the req */
            req.id = uuid.v4();
            next();
        })
        .set("etag", "strong")
        .set("view engine", "pug")
        .set("views", path.join(__dirname, "views"))
        .set("x-powered-by", void 0)
        .use(bodyParser.urlencoded({
            extended: false
        }))
        .use(compression())
        .use(cookieParser($config.datastores.cookies.secret))
        .use(csrf({
            cookie: true
        }));

    /* Pretty or minified HTML? */
    express.getServer().locals.pretty = $config.server.prettyOutput;

    /* Create the server instance */
    const server = new Server($config.server, express);

    /* Get the output handler */
    const $outputHandler = app.createOutputHandler(server);

    /* Log errors */
    server.on("error_log", err => {

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

    server
        .use(expressLib.static(`${__dirname}/public`))
        .after((req, res) => {
            /* 404 page */
            $outputHandler(req, res, () => {
                return View.render("error/404", {
                    url: req.url
                }, 404);
            }, false);
        })
        .uncaughtException((req, res, err) => {
            /* Handle uncaught errors */
            $outputHandler(req, res, () => {
                return View.render("error/uncaught", {
                    displayDetail: $config.server.displayErrorDetail,
                    err
                }, 500);
            }, false);
        });

    return server;

});

export { app };
