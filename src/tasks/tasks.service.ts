import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      description: 'no common',
      status: TaskStatus.DONE,
      title: 'title one',
    },
    {
      id: '3',
      description: 'no common',
      status: TaskStatus.DONE,
      title: 'title one',
    },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: Math.random().toFixed(1),
      title,
      description,
      status: TaskStatus.IN_PROGRESS,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.tasks.find((task) => task.id === id);
    task.status = status;
    return task;
  }
}
