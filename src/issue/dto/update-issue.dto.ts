import { PartialType } from '@nestjs/mapped-types';
import { CreateIssueDto } from './create-issue.dto';
import { IsOptional,IsNotEmpty } from 'class-validator';

export class UpdateIssueDto extends PartialType(CreateIssueDto) {
    @IsOptional()
    @IsNotEmpty()
    title: string;
    
    @IsOptional()
    @IsNotEmpty()
    description: string;
}
