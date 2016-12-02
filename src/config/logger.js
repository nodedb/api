/**
 * logger
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {_} from "lodash";
import {Bunyan} from "steeplejack-bunyan";
import {Logger} from "steeplejack/lib/logger";


/* Files */


const name = "$logger";


const config = $config => {

    const streams = [];

    const defaultLevel = $config.logging.level;

    _.each($config.logging.streams, (config, name) => {

        const level = config.level || defaultLevel;

        switch (name) {

            // case "papertrail":
            //
            //     if (config.active) {
            //
            //         streams.push({
            //             level,
            //             type: "raw",
            //             stream: bsyslog.createBunyanStream({
            //                 host: config.host,
            //                 port: config.port
            //             })
            //         });
            //
            //     }
            //
            //     break;

            case "stdout":

                if (config.active) {
                    streams.push({
                        level,
                        stream: process.stdout
                    });
                }

                break;

        }

    });

    return new Logger(new Bunyan({
        name: "browserspy-web",
        streams
    }));

};


export const __config = {
    name,
    config
};
