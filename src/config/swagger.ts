import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition: swaggerJsdoc.OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'RiwiMediCare Plus Supply Request API',
    version: '1.0.0',
    description:
      'REST API for managing clinics, warehouses, medications and the full lifecycle of medical supply requests for RiwiMediCare Plus.',
  },
  servers: [{ url: '/', description: 'Current server' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Resource not found' },
          details: { type: 'array', items: {}, nullable: true },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string', example: 'Laura Gomez' },
          email: { type: 'string', format: 'email', example: 'laura.admin@riwimedicare.com' },
          password: { type: 'string', minLength: 6, example: 'Secret123' },
          role: { type: 'string', enum: ['administrator', 'requestManager'], example: 'administrator' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'laura.admin@riwimedicare.com' },
          password: { type: 'string', example: 'Secret123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Laura Gomez' },
              email: { type: 'string', example: 'laura.admin@riwimedicare.com' },
              role: { type: 'string', example: 'administrator' },
            },
          },
        },
      },
      Clinic: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Clinica San Rafael' },
          taxId: { type: 'string', example: 'TAX-900111222' },
          managerName: { type: 'string', example: 'Marta Londono' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateClinicRequest: {
        type: 'object',
        required: ['name', 'taxId', 'managerName'],
        properties: {
          name: { type: 'string', example: 'Clinica San Rafael' },
          taxId: { type: 'string', example: 'TAX-900111222' },
          managerName: { type: 'string', example: 'Marta Londono' },
        },
      },
      UpdateClinicRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Clinica San Rafael' },
          taxId: { type: 'string', example: 'TAX-900111222' },
          managerName: { type: 'string', example: 'Marta Londono' },
        },
      },
      Warehouse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Central Warehouse' },
          location: { type: 'string', example: 'Medellin' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateWarehouseRequest: {
        type: 'object',
        required: ['name', 'location'],
        properties: {
          name: { type: 'string', example: 'Central Warehouse' },
          location: { type: 'string', example: 'Medellin' },
        },
      },
      UpdateWarehouseRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Central Warehouse' },
          location: { type: 'string', example: 'Medellin' },
        },
      },
      Medication: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Ibuprofen 400mg' },
          description: { type: 'string', example: 'Anti-inflammatory painkiller, box of 30 tablets' },
          warehouseId: { type: 'integer', example: 1 },
          availableQuantity: { type: 'integer', example: 500 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateMedicationRequest: {
        type: 'object',
        required: ['name', 'description', 'warehouseId', 'availableQuantity'],
        properties: {
          name: { type: 'string', example: 'Ibuprofen 400mg' },
          description: { type: 'string', example: 'Anti-inflammatory painkiller, box of 30 tablets' },
          warehouseId: { type: 'integer', example: 1 },
          availableQuantity: { type: 'integer', minimum: 0, example: 500 },
        },
      },
      UpdateMedicationRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Ibuprofen 400mg' },
          description: { type: 'string', example: 'Anti-inflammatory painkiller, box of 30 tablets' },
          warehouseId: { type: 'integer', example: 1 },
          availableQuantity: { type: 'integer', minimum: 0, example: 450 },
        },
      },
      SupplyRequest: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          clinicId: { type: 'integer', example: 9 },
          medicationId: { type: 'integer', example: 4 },
          warehouseId: { type: 'integer', example: 3 },
          requestManagerId: { type: 'integer', example: 6 },
          requestedQuantity: { type: 'integer', example: 20 },
          status: {
            type: 'string',
            enum: ['pending', 'approved', 'rejected', 'completed'],
            example: 'pending',
          },
          isDeleted: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          clinic: { $ref: '#/components/schemas/Clinic' },
          warehouse: { $ref: '#/components/schemas/Warehouse' },
          medication: { $ref: '#/components/schemas/Medication' },
          requestManager: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 6 },
              name: { type: 'string', example: 'Diana Torres' },
              email: { type: 'string', example: 'diana.manager@riwimedicare.com' },
              role: { type: 'string', example: 'requestManager' },
            },
          },
        },
      },
      CreateSupplyRequestRequest: {
        type: 'object',
        required: ['clinicId', 'medicationId', 'requestedQuantity'],
        properties: {
          clinicId: { type: 'integer', example: 9 },
          medicationId: { type: 'integer', example: 4 },
          requestedQuantity: { type: 'integer', minimum: 1, example: 20 },
        },
      },
      UpdateSupplyRequestRequest: {
        type: 'object',
        properties: {
          clinicId: { type: 'integer', example: 9 },
          medicationId: { type: 'integer', example: 4 },
          requestedQuantity: { type: 'integer', minimum: 1, example: 25 },
        },
      },
      UpdateSupplyRequestStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'approved', 'rejected', 'completed'],
            example: 'approved',
          },
        },
      },
      SeedSummaryResponse: {
        type: 'object',
        properties: {
          users: { type: 'integer', example: 4 },
          clinics: { type: 'integer', example: 3 },
          warehouses: { type: 'integer', example: 2 },
          medications: { type: 'integer', example: 5 },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
