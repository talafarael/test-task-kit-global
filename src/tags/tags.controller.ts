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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { QueryTagDto } from './dto/query-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('tags')
@ApiBearerAuth()
@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'List project tags' })
  @ApiResponse({ status: 200, description: 'List of tags', type: [TagResponseDto] })
  findAll(@Query() query: QueryTagDto, @CurrentUser() user: UserDocument) {
    return this.tagsService.findAll(query.project, user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by id' })
  @ApiResponse({ status: 200, description: 'Tag', type: TagResponseDto })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.tagsService.findOne(id, user._id.toString());
  }

  @Post()
  @ApiOperation({ summary: 'Create tag' })
  @ApiResponse({ status: 201, description: 'Tag created', type: TagResponseDto })
  create(
    @Body() dto: CreateTagDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.tagsService.create(dto, user._id.toString());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tag' })
  @ApiResponse({ status: 200, description: 'Tag updated', type: TagResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTagDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.tagsService.update(id, dto, user._id.toString());
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tag' })
  @ApiResponse({ status: 204, description: 'Tag deleted' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    await this.tagsService.remove(id, user._id.toString());
  }
}
