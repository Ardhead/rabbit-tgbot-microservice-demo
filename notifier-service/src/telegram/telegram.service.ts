import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;

  constructor(private readonly configService: ConfigService) {
    this.bot = new Telegraf(
      this.configService.get<string>('TELEGRAM_BOT_TOKEN', ''),
    );
  }

  async sendMessage(chatId: string, text: string): Promise<boolean> {
    try {
      await this.bot.telegram.sendMessage(chatId, text);
      this.logger.log(`Message sent to chat ${chatId}`);
      return true;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to send message: ${err?.message ?? String(error)}`,
      );
      console.log(error);
      return false;
    }
  }
}
