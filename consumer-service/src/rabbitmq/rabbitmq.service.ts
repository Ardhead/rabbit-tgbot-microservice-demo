import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private exchange: string;
  private queue: string;

  constructor(
    @Inject('RMQ_CONNECTION') connection: AmqpConnectionManager,
    private configService: ConfigService,
  ) {
    this.exchange = this.configService.get<string>(
      'RABBITMQ_EXCHANGE',
      'messages_exchange',
    );
    this.queue = this.configService.get<string>(
      'RABBITMQ_QUEUE',
      'messages_queue',
    );
    this.connection = connection;
    this.channel = this.connection.createChannel({
      setup: (channel: Channel) => {
        return Promise.all([
          channel.assertExchange(this.exchange, 'direct', { durable: true }),
          channel.assertQueue(this.queue, { durable: true }),
          channel.bindQueue(this.queue, this.exchange, ''),
        ]);
      },
    });
  }

  async publishMessage(routingKey: string, message: any): Promise<boolean> {
    const msg = Buffer.from(JSON.stringify(message));
    return this.channel.publish(this.exchange, routingKey, msg);
  }

  async publishMessageWithHeaders(
    routingKey: string,
    message: any,
    headers: Record<string, any>,
  ): Promise<boolean> {
    const msg = Buffer.from(JSON.stringify(message));
    return this.channel.publish(this.exchange, routingKey, msg, { headers });
  }

  consumeMessages(onMessage: (msg: ConsumeMessage) => void) {
    return this.channel.consume(this.queue, (msg) => onMessage(msg));
  }

  ackMessage(msg: ConsumeMessage) {
    this.channel.ack(msg);
  }

  nackMessage(msg: ConsumeMessage, requeue = false) {
    this.channel.nack(msg, false, requeue);
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
