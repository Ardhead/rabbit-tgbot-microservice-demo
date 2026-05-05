import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { RabbitMQService } from './../src/rabbitmq/rabbitmq.service';

describe('MessagesController (e2e)', () => {
  let app: INestApplication;
  let rabbitMQServiceMock: any;

  beforeEach(async () => {
    rabbitMQServiceMock = {
      publishMessage: jest.fn().mockResolvedValue(true),
      publishMessageWithHeaders: jest.fn().mockResolvedValue(true),
      consumeMessages: jest.fn(),
      ackMessage: jest.fn(),
      nackMessage: jest.fn(),
      onModuleDestroy: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RabbitMQService)
      .useValue(rabbitMQServiceMock)
      .overrideProvider('RMQ_CONNECTION')
      .useValue({
        close: jest.fn().mockResolvedValue(undefined),
        createChannel: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('POST /v1/messages - should create and publish a message', () => {
    return request(app.getHttpServer())
      .post('/v1/messages')
      .send({ text: 'Test message' })
      .expect(201);
  });

  it('POST /v1/messages - should return 400 for invalid data', () => {
    return request(app.getHttpServer())
      .post('/v1/messages')
      .send({})
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
