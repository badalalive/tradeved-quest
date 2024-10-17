"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Spedit Quest",
            version: "1.0.0",
            description: "Spedit Quest",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./dist/routes/*.js", "./dist/controllers/*.js", "./dist/dtos/*.js"], // Files containing annotations
};
exports.default = options;
