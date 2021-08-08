import { IsNotEmpty, IsDefined, IsBoolean } from 'class-validator';

export class ProjectOperationResponse {
  @IsBoolean()
  @IsNotEmpty()
  @IsDefined()
  readonly success: boolean;
}
