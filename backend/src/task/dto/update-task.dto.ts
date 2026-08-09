import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString({ message: 'status must be string.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : undefined,
  )
  readonly status?: string;
}
