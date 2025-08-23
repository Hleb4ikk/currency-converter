export type SwaggerRequestMetadata = {
  handlers?: Record<
    string,
    {
      requestBody?: any;
      responses?: Record<
        string,
        {
          description?: string;
          example?: any;
        }
      >;
      operation?: {
        summary: string;
      };
    }
  >;
};
