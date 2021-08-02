import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entities/issue.entity';
import { Comment } from './entities/comment.entity';
import { RabbitMQModule,RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingService } from './messaging/messaging.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Issue, Comment]),
    RabbitMQModule.forRoot(RabbitMQModule, 
      {
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
          },
        ],
        uri: 'amqp://guest:guest@localhost:5672',
        connectionInitOptions: { wait: false },
      }
    ),
  IssueModule,
],
  controllers: [IssueController],
  providers: [IssueService, MessagingService]
})
export class IssueModule {}
