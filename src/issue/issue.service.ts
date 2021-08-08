import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(createIssueDto: CreateIssueDto) {
    const newIssue = this.issueRepository.create(createIssueDto);
    await this.issueRepository.save(newIssue);

    await this.amqpConnection.publish(
      'direct-exchange',
      'project.issue.created',
      { uuid: newIssue.id },
    );

    return newIssue;
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

  async findOne(issueId: string) {
    const issue = await this.issueRepository.findOne(issueId);

    if (issue) {
      return issue;
    }

    throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
  }

  async update(issueId: string, updateIssueDto: UpdateIssueDto) {
    await this.issueRepository.update(issueId, updateIssueDto);
    const updatedIssue = await this.issueRepository.findOne(issueId);

    if (updatedIssue) {
      return updatedIssue;
    }

    throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
  }

  async remove(issueId: string) {
    const deleted = await this.issueRepository.delete(issueId);

    if (!deleted.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    await this.amqpConnection.publish(
      'direct-exchange',
      'project.issue.created',
      { uuid: issueId },
    );
  }

  async addComment(issueId: string, createCommentDto: CreateCommentDto) {
    const issue = await this.findOne(issueId);

    const newComment = await this.commentRepository.create({
      ...createCommentDto,
      issue: issue,
    });
    await this.commentRepository.save(newComment);
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
}
