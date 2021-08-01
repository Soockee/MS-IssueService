import { Injectable, Logger } from '@nestjs/common';
import { RabbitRPC,Nack } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MessagingService {

    private readonly logger = new Logger(MessagingService.name);

    @RabbitRPC({
        exchange: 'issue-service',
        routingKey: '*',
        queue: 'issues-main'
      })
      public async rpcHandler(msg: {}) {
        this.logger.log(`Received message from RabbitMQ: ${JSON.stringify(msg)}`);
        return new Nack();
      }
}
