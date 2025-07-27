import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/request/create-category.dto";
import { Express } from 'express'; // Import Express for Multer File type

// Import Swagger Decorators
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { InventoryService } from "../inventory.service";

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {

  constructor(
    private readonly inventoryService: InventoryService
  ) { }

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories', description: 'Fetches a list of all categories with optional pagination.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved categories.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return await this.inventoryService.findAllCategories(page, limit)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID', description: 'Retrieves a single category by its unique identifier.' })
  @ApiParam({ name: 'id', description: 'The ID of the category', type: String })
  @ApiResponse({ status: 200, description: 'Category found.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async findOne(@Param('id') id: string) {
    return await this.inventoryService.findCategories(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category', description: 'Creates a new category with the provided data.' })
  @ApiBody({ type: CreateCategoryDto, description: 'Data for the new category' })
  @ApiResponse({ status: 201, description: 'Category successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.inventoryService.createNewCategory(createCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing category', description: 'Updates the details of an existing category by its ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the category to update', type: String })
  @ApiBody({ type: UpdateCategoryDto, description: 'Data to update the category' })
  @ApiResponse({ status: 200, description: 'Category successfully updated.' /* , type: CategoryDto */ })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or ID format.' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.inventoryService.updateCategory(id, updateCategoryDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category', description: 'Deletes a category by its unique identifier.' })
  @ApiParam({ name: 'id', description: 'The ID of the category to delete', type: String })
  @ApiResponse({ status: 204, description: 'Category successfully deleted.' }) // 204 No Content for successful deletion
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async remove(@Param('id') id: string) {
    return await this.inventoryService.deleteCategories(id)
  }
}