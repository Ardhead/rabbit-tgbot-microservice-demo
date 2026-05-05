import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { MessagesService } from './messages/messages.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, '../../.env'),
        path.resolve(__dirname, '../.env'),
      ],
    }),
    DatabaseModule.forRoot(),
    RabbitMQModule.forRoot(),
  ],
  controllers: [HealthController],
  providers: [DatabaseService, MessagesService],
})
export class AppModule {}
