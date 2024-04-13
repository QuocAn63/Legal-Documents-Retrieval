import { ConfigService } from '@nestjs/config';
import { configDotenv } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

configDotenv({ path: '.env' });

const configService = new ConfigService();

export const typeormConfig = {
  type: 'mssql',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT')
    ? Number.parseInt(configService.getOrThrow('DB_PORT'))
    : 1433,
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_NAME'),
  autoLoadEntities: true,
  synchronize: configService.getOrThrow<'prod' | 'dev'>('NODE_ENV') === 'dev',
  logging: configService.getOrThrow<'prod' | 'dev'>('NODE_ENV') === 'dev',
  extra: {
    trustServerCertificate: true,
  },
  migrations: [join(__dirname, 'migrations/**/*.{js,ts}')],
};

export default new DataSource(typeormConfig as DataSourceOptions);
