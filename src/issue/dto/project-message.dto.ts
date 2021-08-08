import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class ProjectMessage {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly projectId: string;
}
