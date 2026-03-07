import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto, QueryTaskFiltersDto } from './dto/query-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks with filters' })
  @ApiQuery({
    name: 'project',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks',
    type: [TaskResponseDto],
  })
  findAll(
    @Query('project', ParseMongoIdPipe) project: string,
    @Query() filters: QueryTaskFiltersDto,
    @CurrentUser() user: UserDocument,
  ) {
    const query: QueryTaskDto = { ...filters, project };
    return this.tasksService.findAll(user._id.toString(), query);
  }

  @Get(':id/subtasks')
  @ApiOperation({ summary: 'Get subtasks' })
  @ApiResponse({
    status: 200,
    description: 'List of subtasks',
    type: [TaskResponseDto],
  })
  findSubtasks(
    @Param('id', ParseMongoIdPipe) id: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.tasksService.findSubtasks(id, user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  @ApiResponse({ status: 200, description: 'Task', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.tasksService.findOne(id, user._id.toString());
  }

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({
    status: 201,
    description: 'Task created',
    type: TaskResponseDto,
  })
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: UserDocument) {
    return this.tasksService.create(dto, user._id.toString());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated',
    type: TaskResponseDto,
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.tasksService.update(id, dto, user._id.toString());
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  async remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    await this.tasksService.remove(id, user._id.toString());
  }
}
