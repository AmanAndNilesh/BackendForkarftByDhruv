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
  ApiConsumes, // For simpler file upload documentation
} from '@nestjs/swagger';

@ApiTags('Categories') // Group all endpoints in this controller under the "Categories" tag
@Controller('categories')
export class CategoriesController {

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories', description: 'Fetches a list of all categories with optional pagination.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved categories.' /* , type: [CategoryDto] if you have a response DTO */ })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    // Your implementation here
    return `Finding all categories with page: ${page}, limit: ${limit}`;
  }

  // GET /categories/:id - Get category by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID', description: 'Retrieves a single category by its unique identifier.' })
  @ApiParam({ name: 'id', description: 'The ID of the category', type: String })
  @ApiResponse({ status: 200, description: 'Category found.' /* , type: CategoryDto */ })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  findOne(@Param('id') id: string) {
    // Your implementation here
    return `Finding category with ID: ${id}`;
  }

  // POST /categories - Create new category
  @Post()
  @ApiOperation({ summary: 'Create a new category', description: 'Creates a new category with the provided data.' })
  @ApiBody({ type: CreateCategoryDto, description: 'Data for the new category' })
  @ApiResponse({ status: 201, description: 'Category successfully created.' /* , type: CategoryDto */ })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    // Your implementation here
    return `Creating category: ${JSON.stringify(createCategoryDto)}`;
  }

  // PUT /categories/:id - Update category
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing category', description: 'Updates the details of an existing category by its ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the category to update', type: String })
  @ApiBody({ type: UpdateCategoryDto, description: 'Data to update the category' })
  @ApiResponse({ status: 200, description: 'Category successfully updated.' /* , type: CategoryDto */ })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or ID format.' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    // Your implementation here
    return `Updating category with ID: ${id} with data: ${JSON.stringify(updateCategoryDto)}`;
  }

  // DELETE /categories/:id - Delete category
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category', description: 'Deletes a category by its unique identifier.' })
  @ApiParam({ name: 'id', description: 'The ID of the category to delete', type: String })
  @ApiResponse({ status: 204, description: 'Category successfully deleted.' }) // 204 No Content for successful deletion
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  remove(@Param('id') id: string) {
    // Your implementation here
    return `Deleting category with ID: ${id}`;
  }

  // GET /categories/:id/products - Get products in category
  @Get(':id/products')
  @ApiOperation({ summary: 'Get products by category', description: 'Retrieves a list of products belonging to a specific category.' })
  @ApiParam({ name: 'id', description: 'The ID of the category', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products for the category.' /* , type: [ProductDto] */ })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getCategoryProducts(@Param('id') id: string) {
    // Your implementation here
    return `Getting products for category with ID: ${id}`;
  }
}