import { Injectable, Logger } from '@nestjs/common';
import { RabbitRPC, Nack } from '@golevelup/nestjs-rabbitmq';
import { ProjectMessage } from '../dto/project-message.dto';
import { transformAndValidate } from 'class-transformer-validator';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  @RabbitRPC({
    exchange: 'issue-service',
    routingKey: '*',
    queue: 'issues-main',
  })
  public async rpcHandler(msg: any) {
    try {
      const projectMessage = await transformAndValidate(ProjectMessage, msg);
      this.logger.log(
        `Received message from RabbitMQ: ${JSON.stringify(projectMessage)}`,
      );
    } catch (error) {
      this.logger.error(error);
    }
    return new Nack();
  }
}
