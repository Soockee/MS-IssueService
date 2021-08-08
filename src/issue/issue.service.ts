import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UpdateScope } from './enum/update-scope';
// import { ProjectOperationResponse } from './dto/project-operation-response.dto';

@Injectable()
export class IssueService {
  private readonly logger = new Logger(IssueService.name);

  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(createIssueDto: CreateIssueDto) {
    const newIssue = this.issueRepository.create(createIssueDto);

    try {
      await this.issueRepository.save(newIssue);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Could not save issue to databse',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      // const projectOperationResponse =
      //   await this.amqpConnection.request<ProjectOperationResponse>({
      //     exchange: 'direct-exchange',
      //     routingKey: 'project.issue.created',
      //     payload: {
      //       issueId: newIssue.id,
      //       projectId: newIssue.projectId,
      //     },
      //     timeout: 5000,
      //   });

      if (true) {
        try {
          await this.amqpConnection.publish('news', 'news.issue.create', {
            ...createIssueDto,
            issueId: newIssue.id,
          });
        } catch (error) {
          this.logger.error(error);
        }
        return newIssue;
      } else {
        throw new Error(
          'Could not publish issue-creation to project-service; role back creation;',
        );
      }
    } catch (error) {
      await this.issueRepository.delete(newIssue.id);
      throw new HttpException(
        'Could not publish issue-creation to project-service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll(): Promise<Issue[]> {
    return this.issueRepository.find();
  }

  findAllForProject(projectId: string): Promise<Issue[]> {
    return this.issueRepository
      .createQueryBuilder('issue')
      .where('issue.projectId = :projectId', { projectId: projectId })
      .getMany();
  }

  async findOne(issueId: string): Promise<Issue> {
    const issue = await this.issueRepository.findOne(issueId);

    if (issue) {
      return issue;
    }

    throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
  }

  async update(
    issueId: string,
    updateIssueDto: UpdateIssueDto,
  ): Promise<Issue> {
    await this.issueRepository.update(issueId, updateIssueDto);
    const updatedIssue = await this.issueRepository.findOne(issueId);

    if (updatedIssue) {
      const updateScopes: UpdateScope[] = [];

      if ('title' in updateIssueDto) {
        updateScopes.push(UpdateScope.TITLE);
      }
      if ('description' in updateIssueDto) {
        updateScopes.push(UpdateScope.DESCRIPTION);
      }
      if ('status' in updateIssueDto) {
        updateScopes.push(UpdateScope.STATUS);
      }

      await this.amqpConnection.publish('news', 'news.issue.update', {
        ...updateIssueDto,
        projectId: updatedIssue.projectId,
        issueId: updatedIssue.id,
        updateScopes: updateScopes,
      });
      return updatedIssue;
    }

    throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
  }

  async remove(issueId: string): Promise<void> {
    const issue = await this.issueRepository.findOne(issueId, {
      relations: ['comments'],
    });
    //this.logger.log(JSON.stringify(issue))

    const deleted = await this.issueRepository.delete(issueId);

    if (!deleted.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.amqpConnection.publish(
        'direct-exchange',
        'project.issue.deleted',
        { uuid: issue.id },
      );
      try {
        await this.amqpConnection.publish('news', 'news.issue.delete', {
          title: issue.title,
          description: issue.description,
          projectId: issue.projectId,
          issueId: issue.id,
        });
      } catch (error) {
        this.logger.error(error);
      }
      return;
    } catch (error) {
      await this.issueRepository.save(issue);
      for (const comment of issue.comments) {
        comment.issue = issue;
        await this.commentRepository.save(comment);
      }
      throw new HttpException(
        'Could not publish issue-deletion to project-service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeForProject(projectId: string): Promise<void> {
    await this.issueRepository.delete({ projectId: projectId });
  }

  async addComment(
    issueId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const issue = await this.findOne(issueId);

    const newComment = await this.commentRepository.create({
      ...createCommentDto,
      issue: issue,
    });
    await this.commentRepository.save(newComment);

    await this.amqpConnection.publish('news', 'news.issue.update', {
      issueId: issue.id,
      projectId: issue.projectId,
      updateScopes: [UpdateScope.COMMENT],
      ...createCommentDto,
    });

    return newComment;
  }

  async findAllCommentsForIssue(issueId: string): Promise<Issue> {
    const issue = this.issueRepository.findOne(issueId, {
      relations: ['comments'],
    });

    if (issue) {
      return issue;
    }

    throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
  }

  findAllComments(): Promise<Comment[]> {
    return this.commentRepository.find();
  }
}
