import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IssueService {

  constructor(
    @Inject('ISSUE_REPOSITORY')
    private issueRepository: Repository<Issue>,
  ){}

  async create(createIssueDto: CreateIssueDto) {
    const newIssue = this.issueRepository.create(createIssueDto);
    await this.issueRepository.save(newIssue);
    return newIssue;
  }

  findAll(): Promise<Issue[]> {
    return this.issueRepository.find()
  }

  async findOne(id: string) {
    const issue = await this.issueRepository.findOne(id);
    
    if (issue) {
      return issue;
    }

    throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateIssueDto: UpdateIssueDto) {
    await this.issueRepository.update(id, updateIssueDto);
    const updatedIssue = await this.issueRepository.findOne(id);

    if (updatedIssue) {
      return updatedIssue;
    }

    throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const deleted = await this.issueRepository.delete(id);
    if (!deleted.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
