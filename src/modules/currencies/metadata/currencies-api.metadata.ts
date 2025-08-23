export const currenciesApiMetadata = {
  handlers: {
    getSupportedCurrencies: {
      responses: {
        ok: {
          description: 'List of supported currencies',
          example: [
            'AFN',
            'ALL',
            'AMD',
            'ANG',
            'AOA',
            'ARS',
            'AUD',
            'AWG',
            'AZN',
            'BAM',
            'BBD',
            'BDT',
            'BGN',
            'BHD',
            'BIF',
          ],
        },

        internalServerError: {
          description: 'Internal server error',
          example: {
            message: 'Cannot fetch supported currencies',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
      operation: { summary: 'Get all supported currencies' },
    },
  },
};
