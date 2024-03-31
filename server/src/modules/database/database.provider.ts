import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

const DatabaseOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const isOnDev =
      configService.getOrThrow<'prod' | 'dev'>('NODE_ENV') === 'dev';
    const port = configService.getOrThrow('DB_PORT')
      ? Number.parseInt(configService.getOrThrow('DB_PORT'))
      : 1433;

    return {
      type: 'mssql',
      host: configService.getOrThrow('DB_HOST'),
      port,
      username: configService.getOrThrow('DB_USERNAME'),
      password: configService.getOrThrow('DB_PASSWORD'),
      database: configService.getOrThrow('DB_NAME'),
      autoLoadEntities: true,
      entities: ['../../src/modules/**/entities/*.entity.ts'],
      synchronize: isOnDev,
      logging: isOnDev,
      logger: 'advanced-console',
      extra: {
        trustServerCertificate: true,
      },
    };
  },
};

export default DatabaseOptions;
