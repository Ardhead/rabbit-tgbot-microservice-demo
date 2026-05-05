import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { RabbitMQService } from './rabbitmq.service';

const CONNECTION_PROVIDER: Provider = {
  provide: 'RMQ_CONNECTION',
  useFactory: (configService: ConfigService) => {
    return amqp.connect(
      {
        hostname: configService.get<string>('RABBITMQ_HOST', 'localhost'),
        port: parseInt(configService.get<string>('RABBITMQ_PORT', '5672')),
        username: configService.get<string>('RABBITMQ_USER', 'guest'),
        password: configService.get<string>('RABBITMQ_PASS', 'guest'),
      },
      {
        reconnectTimeInSeconds: 5,
      },
    );
  },
  inject: [ConfigService],
};

@Module({})
export class RabbitMQModule {
  static forRoot(): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: [CONNECTION_PROVIDER, RabbitMQService],
      exports: [RabbitMQService],
    };
  }
}
