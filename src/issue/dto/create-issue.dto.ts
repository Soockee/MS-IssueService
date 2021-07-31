import { IsNotEmpty } from 'class-validator';

export class CreateIssueDto {
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    description: string;
    
    @IsNotEmpty()
    projectId: string;
}
