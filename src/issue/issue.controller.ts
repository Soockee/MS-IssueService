import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post('issue')
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issueService.create(createIssueDto);
  }

  @Get('issues')
  findAll() {
    return this.issueService.findAll();
  }

  @Get('issue/:issueId')
  findOne(@Param('issueId') issueissueId: string) {
    return this.issueService.findOne(issueissueId);
  }

  @Patch('issue/:issueId')
  update(@Param('issueId') issueissueId: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issueService.update(issueissueId, updateIssueDto);
  }

  @Delete('issue/:issueId')
  remove(@Param('issueId') issueissueId: string) {
    return this.issueService.remove(issueissueId);
  }

  @Post('issue/:issueId/commment')
  createComment(@Param('issueId') issueId: string, @Body() creatCommentDto: CreateCommentDto) {
    return this.issueService.addComment(issueId, creatCommentDto);
  }

  @Get('issue/:issueId/commments')
  findAllComments(@Param('issueId') issueId: string) {
    return this.issueService.findAllComments(issueId);
  }
  
}
