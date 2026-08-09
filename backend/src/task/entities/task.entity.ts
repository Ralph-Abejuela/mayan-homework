import { Task } from '../../prisma/generated/client';

export class TaskEntity implements Task {
  readonly id!: number;
  readonly title!: string;
  readonly description: string = '';
  readonly status: string = 'inactive';
}
