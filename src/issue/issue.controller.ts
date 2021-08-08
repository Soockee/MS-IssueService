import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @UseGuards(JwtAuthGuard)
  @Post('issue')
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issueService.create(createIssueDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('issues')
  findAll(@Query('projectId') projectId: string) {
    if (projectId) {
      return this.issueService.findAllForProject(projectId);
    } else {
      return this.issueService.findAll();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('issue/:issueId')
  findOne(@Param('issueId') issueissueId: string) {
    return this.issueService.findOne(issueissueId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('issue/:issueId')
  update(
    @Param('issueId') issueissueId: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issueService.update(issueissueId, updateIssueDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('issue/:issueId')
  remove(@Param('issueId') issueissueId: string) {
    return this.issueService.remove(issueissueId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('issue/:issueId/commment')
  createComment(
    @Param('issueId') issueId: string,
    @Body() creatCommentDto: CreateCommentDto,
  ) {
    return this.issueService.addComment(issueId, creatCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('issue/:issueId/commments')
  findAllCommentsForIssue(@Param('issueId') issueId: string) {
    return this.issueService.findAllCommentsForIssue(issueId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('comments')
  findAllComments() {
    return this.issueService.findAllComments();
  }
}
