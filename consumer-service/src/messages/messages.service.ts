import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { DatabaseService } from '../database/database.service';
import { MessagePayload } from '../interfaces/message-payload.interface';

const MAX_RETRIES = 3;

@Injectable()
export class MessagesService implements OnModuleInit {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly databaseService: DatabaseService,
  ) {}

  onModuleInit() {
    this.startConsuming();
  }

  private startConsuming() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.rabbitMQService.consumeMessages((msg: ConsumeMessage): void => {
      void (async () => {
        try {
          const payload = JSON.parse(msg.content.toString()) as MessagePayload;
          const { externalId, content } = payload;

          const existing = await this.databaseService.query(
            'SELECT id FROM messages WHERE external_id = $1',
            [externalId],
          );

          if (existing.rows.length > 0) {
            this.logger.log(
              `Message ${externalId} already processed, skipping`,
            );
            this.rabbitMQService.ackMessage(msg);
            return;
          }

          await this.databaseService.query(
            'INSERT INTO messages (external_id, content, created_at) VALUES ($1, $2, NOW())',
            [externalId, content],
          );

          this.rabbitMQService.ackMessage(msg);
          this.logger.log(`Message ${externalId} saved to database`);
        } catch (error: unknown) {
          const err = error as Error;
          const retryCount = this.getRetryCount(msg);

          if (retryCount < MAX_RETRIES) {
            this.logger.warn(
              `Failed to process message, retrying (${retryCount + 1}/${MAX_RETRIES}): ${err?.message ?? String(error)}`,
            );
            await this.retryMessage(msg, retryCount + 1);
          } else {
            this.logger.error(
              `Failed to process message after ${MAX_RETRIES} retries, discarding: ${err?.message ?? String(error)}`,
            );
            this.rabbitMQService.nackMessage(msg, false);
          }
        }
      })();
    });
  }

  private getRetryCount(msg: ConsumeMessage): number {
    try {
      const headers = msg.properties?.headers;
      return headers?.['x-retry-count']
        ? parseInt(headers['x-retry-count'] as string, 10)
        : 0;
    } catch {
      return 0;
    }
  }

  private async retryMessage(
    msg: ConsumeMessage,
    retryCount: number,
  ): Promise<void> {
    const headers = {
      ...msg.properties?.headers,
      'x-retry-count': retryCount,
    };

    const published = await this.rabbitMQService.publishMessageWithHeaders(
      '',
      JSON.parse(msg.content.toString()),
      headers,
    );

    if (published) {
      this.rabbitMQService.ackMessage(msg);
    } else {
      this.rabbitMQService.nackMessage(msg, false);
    }
  }
}
