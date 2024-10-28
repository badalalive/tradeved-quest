// src/swagger.ts
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tradved Quest",
      version: "1.0.0",
      description: "Tradved Quest",
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
  apis: ["./dist/routes/*.js", "./dist/controllers/*.js", "./dist/dto/*.js", "./dist/docs/*.js"], // Files containing annotations
};

export default options;
