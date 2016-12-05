/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export const route = () => {

    return {

        "/": {

            get: () => ([{
                key: "6df9cda1-a47c-4016-b3de-ea8b390e9c47",
                driver: "mysql",
                connection: {
                    name: "MySQL Stored",
                    password: "q1w2e3r4",
                    port: 32770,
                    user: "root"
                }
            }, {
                key: "b8f54424-6d59-497b-8345-6136759bad4b",
                driver: "mongodb",
                connection: {
                    name: "MongoDB Stored",
                    url: "mongodb://localhost:32769"
                }
            }])

        }

    };

};
