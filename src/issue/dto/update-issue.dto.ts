import { PartialType } from '@nestjs/mapped-types';
import { CreateIssueDto } from './create-issue.dto';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Status } from '../enum/status';

export class UpdateIssueDto extends PartialType(CreateIssueDto) {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
