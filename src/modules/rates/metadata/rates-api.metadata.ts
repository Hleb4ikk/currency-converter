export const ratesApiMetadata = {
  handlers: {
    getRates: {
      queries: {
        base: {
          name: 'base',
          example: 'USD',
          required: false,
          type: String,
        },
        target: {
          name: 'target',
          example: 'USD,EUR,JPY',
          description: 'Some values devided by comma',
          required: true,
          type: String,
        },
      },
      responses: {
        ok: {
          description: 'Rates list for base currency',
          example: {
            base: 'USD',
            rates: {
              AUD: 1.5561302097,
              EUR: 0.8608201003,
              USD: 1,
            },
          },
        },
        notFound: {
          description: 'User not found',
          example: {
            message: 'User not found, even though middleware passed.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
        badRequest: {
          description: 'Bad request',
          example: {
            message: ['Invalid target currency code'],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        internalServerError: {
          description: 'Internal server error',
          example: {
            message: 'Cannot fetch rates',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
      operation: { summary: 'Get rates for base currency' },
    },
  },
};
