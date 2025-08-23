import { ConfigService } from '@nestjs/config';

//function that returns data from config.
export function getDataFromConfig<T>(
  configService: ConfigService,
  propertyPath: string,
): T {
  const result = configService.get<T>(propertyPath);
  if (!result) {
    throw new Error(`Config ${propertyPath} is not set`);
  }

  return result;
}
