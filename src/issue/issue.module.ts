import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entities/issue.entity';
import { Comment } from './entities/comment.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingService } from './messaging/messaging.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Issue, Comment]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'news',
            type: 'topic',
          },
          {
            name: 'issue-service',
            type: 'topic',
          },
          {
            name: 'direct-exchange',
            type: 'direct',
            options: {
              durable: true
            }
          },
        ],
        uri: `amqp://${configService.get('RABBIT_USER')}:${configService.get(
          'RABBIT_PASSWD',
        )}@${configService.get('RABBIT_HOST')}:${configService.get(
          'RABBIT_PORT',
        )}`,
        connectionInitOptions: { wait: false },
      }),
    }),
    IssueModule,
  ],
  controllers: [IssueController],
  providers: [IssueService, MessagingService],
})
export class IssueModule {}
