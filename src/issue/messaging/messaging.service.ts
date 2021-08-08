import { Injectable, Logger } from '@nestjs/common';
import { RabbitRPC, Nack } from '@golevelup/nestjs-rabbitmq';
import { ProjectMessage } from '../dto/project-message.dto';
import { transformAndValidate } from 'class-transformer-validator';
import { IssueService } from '../issue.service';
@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(private readonly issueService: IssueService) {}

  @RabbitRPC({
    exchange: 'direct-exchange',
    routingKey: 'project.deleted',
    queue: 'issues-main',
  })
  public async rpcHandler(msg: any) {
    try {
      await transformAndValidate(ProjectMessage, msg).then(
        (projectMessage: ProjectMessage) => {
          this.issueService.removeForProject(projectMessage.projectId);
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
    return new Nack(false);
  }
}
