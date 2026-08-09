import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'title must be a string.' })
  @IsNotEmpty({ message: 'title must not be empty.' })
  readonly title!: string;
  @IsString()
  @Transform(({ value }) => value ?? '')
  readonly description: string = '';
}
