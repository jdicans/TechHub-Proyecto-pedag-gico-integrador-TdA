import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechHub API',
      version: '1.0.0',
      description: 'Documentación OpenAPI de la API REST de TechHub',
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
