import { UserUpdateDto } from '../dto/user-update.dto';

export const userApiMetadata = {
  handlers: {
    getUser: {
      responses: {
        ok: {
          description: 'Current user data',
          example: {
            id: '41f48447-6fe9-42d3-be5f-2a4f6533bae7',
            base_currency: 'USD',
            favorites: [],
            created_at: '2025-08-22T12:50:32.393Z',
            updated_at: '2025-08-22T17:38:39.800Z',
          },
        },
        internalServerError: {
          description: 'Internal server error',
          example: {
            message: 'Error getting user',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
      operation: {
        summary: 'Get user',
      },
    },
    updateUser: {
      requestBody: {
        required: false,
        type: UserUpdateDto,
        examples: {
          user: { value: { base_currency: 'USD', favorites: ['USD', 'EUR'] } },
        },
      },
      responses: {
        ok: {
          description: 'User updated',
          example: {
            id: '64bf3713-fda1-4b5c-82bd-e8cbf85506ad',
            base_currency: 'USD',
            favorites: ['USD', 'EUR'],
            created_at: '2025-08-22T13:19:14.986Z',
            updated_at: '2025-08-22T22:49:47.164Z',
          },
        },
        internalServerError: {
          description: 'Internal server error',
          example: {
            message: 'Error updating user',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
      operation: {
        summary: 'Update user',
      },
    },
  },
};
