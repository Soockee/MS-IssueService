import { IsString, IsNumber, IsNotEmpty, IsDefined } from 'class-validator';

export class ProjectMessage {
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  readonly userid: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly name: string;
}
