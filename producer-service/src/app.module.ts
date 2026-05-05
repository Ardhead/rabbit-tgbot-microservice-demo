import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { EventsGeneratorCron } from './messages/events-generator.cron';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
    RabbitMQModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, EventsGeneratorCron],
})
export class AppModule {}
