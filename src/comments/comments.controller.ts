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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'List task comments' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  findAll(@Query() query: QueryCommentDto, @CurrentUser() user: UserDocument) {
    return this.commentsService.findAll(query.task, user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by id' })
  @ApiResponse({ status: 200, description: 'Comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.commentsService.findOne(id, user._id.toString());
  }

  @Post()
  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  create(
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentsService.create(dto, user._id.toString());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({ status: 200, description: 'Comment updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentsService.update(id, dto, user._id.toString());
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 204, description: 'Comment deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    await this.commentsService.remove(id, user._id.toString());
  }
}
