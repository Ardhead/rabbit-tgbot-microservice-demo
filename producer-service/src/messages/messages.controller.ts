import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('v1/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create and publish a new message' })
  @ApiResponse({
    status: 201,
    description: 'Message created and published successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createAndPublish(createMessageDto);
  }
}
