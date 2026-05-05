import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { TelegramService } from '../telegram/telegram.service';
import { MessagesRepository } from './messages.repository';
import { MessageEntity } from '../interfaces/message-entity.interface';

@Injectable()
export class TelegramNotifierCron implements OnModuleInit {
  private readonly logger = new Logger(TelegramNotifierCron.name);

  constructor(
    private readonly telegramService: TelegramService,
    private readonly messagesRepository: MessagesRepository,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const cronInterval = this.configService.get<string>(
      'NOTIFIER_CRON_INTERVAL',
      '*/5 * * * * *',
    );
    const job = new CronJob(cronInterval, () => this.handleCron());
    this.schedulerRegistry.addCronJob('telegramNotifier', job);
    job.start();
  }

  async handleCron() {
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID', '');
    const messages = await this.messagesRepository.findUnsentMessages(10);
    this.logger.log(`Found ${messages.rows.length} unsent messages`);

    for (const message of messages.rows as MessageEntity[]) {
      const sent = await this.telegramService.sendMessage(chatId, message.content);

      if (sent) {
        await this.messagesRepository.markAsSent(message.external_id);
        this.logger.log(`Message ${message.external_id} marked as sent`);
      }
    }
  }
}
