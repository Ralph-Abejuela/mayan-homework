import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TaskEntity } from './entities/task.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class TaskService {
  readonly logger: Logger;
  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(TaskService.name);
  }

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    try {
      const result = await this.prisma.task.create({ data: createTaskDto });
      return result;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new ConflictException(
          `Task with title ${createTaskDto.title} already exists.`,
        );
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<TaskEntity[]> {
    try {
      const result = await this.prisma.task.findMany();
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<TaskEntity> {
    const result = await this.prisma.task.findFirst({ where: { id } });
    if (!result) {
      throw new NotFoundException(`Task with id of ${id} does not exist`);
    }
    return result;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    try {
      const result = await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Task with id of ${id} does not exists.`);
        } else if (error.code == 'P2002') {
          throw new ConflictException(
            `Task with title of ${updateTaskDto.title} already exists.`,
          );
        }
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.prisma.task.deleteMany({
      where: { id },
    });
    if (result.count === 0) {
      throw new NotFoundException(`Task with id of ${id} does not exists.`);
    }
  }
}
