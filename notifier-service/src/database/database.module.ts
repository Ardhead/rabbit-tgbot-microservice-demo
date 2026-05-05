import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

const POOL_PROVIDER: Provider = {
  provide: 'PG_POOL',
  useFactory: (configService: ConfigService) => {
    return new Pool({
      host: configService.get<string>('POSTGRES_HOST', 'localhost'),
      port: parseInt(configService.get<string>('POSTGRES_PORT', '5432')),
      user: configService.get<string>('POSTGRES_USER', 'postgres'),
      password: configService.get<string>('POSTGRES_PASSWORD', 'postgres'),
      database: configService.get<string>('POSTGRES_DB', 'messages_db'),
      max: 20,
      idleTimeoutMillis: 30000,
    });
  },
  inject: [ConfigService],
};

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [POOL_PROVIDER],
      exports: [POOL_PROVIDER],
    };
  }
}
