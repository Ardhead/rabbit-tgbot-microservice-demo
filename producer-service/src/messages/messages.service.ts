import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { MessagePayload } from '../interfaces/message-payload.interface';
import * as uuid from 'uuid';

@Injectable()
export class MessagesService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  createAndPublish(createMessageDto: CreateMessageDto) {
    const messageId = uuid.v4();
    const payload: MessagePayload = {
      externalId: messageId,
      content: createMessageDto.text,
      timestamp: Date.now(),
    };

    void this.rabbitMQService.publishMessage('', payload);
    return { messageId, status: 'published' };
  }
}
