import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MessagesService } from './messages.service';

@Injectable()
export class EventsGeneratorCron implements OnModuleInit {
  private readonly logger = new Logger(EventsGeneratorCron.name);
  private readonly timezones = [
    'Europe/Kaliningrad',
    'Europe/Moscow',
    'Asia/Yekaterinburg',
    'Asia/Krasnoyarsk',
    'Asia/Vladivostok',
  ];

  constructor(
    private readonly messagesService: MessagesService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const cronInterval = this.configService.get<string>(
      'PRODUCER_CRON_INTERVAL',
      '*/30 * * * * *',
    );
    const job = new CronJob(cronInterval, () => this.handleCron());
    this.schedulerRegistry.addCronJob('eventsGenerator', job);
    job.start();
  }

  handleCron() {
    const timezone =
      this.timezones[Math.floor(Math.random() * this.timezones.length)];
    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());

    const text = `Event generated at ${formattedDate} (${timezone})`;

    try {
      this.messagesService.createAndPublish({ text });
      this.logger.log(`Generated and published message: ${text}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to publish message: ${err?.message || error}`);
    }
  }
}
