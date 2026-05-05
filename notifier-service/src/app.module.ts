import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { TelegramService } from './telegram/telegram.service';
import { MessagesRepository } from './messages/messages.repository';
import { TelegramNotifierCron } from './messages/telegram-notifier.cron';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, '../../.env'),
        path.resolve(__dirname, '../.env'),
      ],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule.forRoot(),
  ],
  controllers: [],
  providers: [TelegramService, MessagesRepository, TelegramNotifierCron],
})
export class AppModule {}
