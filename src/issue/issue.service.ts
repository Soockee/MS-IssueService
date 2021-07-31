import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
@Injectable()
export class IssueService {

  constructor(    
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ){}

  async create(createIssueDto: CreateIssueDto) {
    const newIssue = this.issueRepository.create(createIssueDto);
    
    await this.issueRepository.save(newIssue);
    return newIssue;
  }

  findAll(): Promise<Issue[]> {
    return this.issueRepository.find()
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
  }

  async addComment(issueId: string, createCommentDto: CreateCommentDto) {
      const issue = await this.findOne(issueId);

      const newComment = await this.commentRepository.create({
        ...createCommentDto,
        issue: issue
      });
      await this.commentRepository.save(newComment);
      return newComment;
  }

  async findAllComments(issueId: string): Promise<Issue> {
    const issue = this.issueRepository.findOne(issueId, {relations: ['comments']});

    if (issue) {
      return issue;
    }

    throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
  }
}
