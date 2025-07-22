import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

// إعدادات Swagger/OpenAPI
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Law Firm API Documentation',
      version,
      description: 'Comprehensive API for managing clients, cases, appointments, and files in a law firm.',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'أدخل رمز JWT بهذا الشكل: Bearer {token}',
        },
      },
      schemas: {
        // مخططات الأخطاء
        Error400: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation error' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        Error401: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Not authorized, token failed' },
          },
        },
        Error403: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'You are not authorized to access this resource.' },
          },
        },
        Error404: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
          },
        },

        // مخططات النماذج
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatarUrl: { type: 'string' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            ownerId: { type: 'string'  },
            contactInfo: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                phone: { type: 'string' },
                address: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Case: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string'},
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['Open', 'Closed', 'Pending', 'In Progress'],
            },
            ownerId: { type: 'string' },
            clientId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            time: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            notes: { type: 'string' },
            status: {
              type: 'string',
              enum: ['Scheduled', 'Completed', 'Cancelled'],
            },
            caseId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        File: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fileName: { type: 'string' },
            fileUrl: { type: 'string' },
            publicId: { type: 'string' },
            fileType: { type: 'string' },
            description: { type: 'string' },
            caseId: { type: 'string' },
            ownerId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    // تفعيل الحماية بشكل افتراضي على جميع المسارات
    security: [{ BearerAuth: [] }],
  },
  // مسارات ملفات تعريف الـ API
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;