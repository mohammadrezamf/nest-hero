import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  /**
   * Get a task by ID
   */
  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  /**
   * Create a new task
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const newTask = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.IN_PROGRESS, // Default status
    });

    return this.taskRepository.save(newTask);
  }

  /**
   * Delete a task by ID
   */
  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  /**
   * Update a task's status
   */
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id); // Reuse existing method to fetch the task
    task.status = status;

    return this.taskRepository.save(task); // Save updated task
  }
}
