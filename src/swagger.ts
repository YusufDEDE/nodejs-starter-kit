import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition for OpenAPI 3.0
const swaggerOptions: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js Starter Kit API',
            description: 'A simple CRUD API with Node.js, PostgreSQL, and TypeScript',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                Bearer: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',  // Your API base URL
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],  // Paths to your route/controller files for JSDoc parsing
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
