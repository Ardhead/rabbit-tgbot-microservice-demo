import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @IsString()
  @ApiProperty({ description: 'Message text content', example: 'Hello World' })
  text: string;
}
