import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto, UpdateProductDto } from "../dtos/request/create-product.dto";
import { Express } from 'express'; // Import Express for Multer File types

// Import Swagger Decorators
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

// src/products/products.controller.ts
@ApiTags('Products') // Group all endpoints in this controller under the "Products" tag
@Controller('products')
export class ProductsController {

  // GET /products - Get all products with filters
  @Get()
  @ApiOperation({ summary: 'Retrieve all products', description: 'Fetches a list of all products with optional filters for pagination, category, search term, and low stock status.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter products by category ID' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search products by name or description' })
  @ApiQuery({ name: 'lowStock', required: false, type: Boolean, description: 'Filter for products with low stock (true/false)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products.' /* , type: [ProductResponseDto] */ })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') categoryId?: string,
    @Query('search') search?: string,
    @Query('lowStock') lowStock?: boolean
  ) {
    // Your implementation here
    return `Finding all products with page: ${page}, limit: ${limit}, category: ${categoryId}, search: ${search}, lowStock: ${lowStock}`;
  }

  // GET /products/:id - Get product by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID', description: 'Retrieves a single product by its unique identifier.' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String })
  @ApiResponse({ status: 200, description: 'Product found.' /* , type: ProductResponseDto */ })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  findOne(@Param('id') id: string) {
    // Your implementation here
    return `Finding product with ID: ${id}`;
  }

  // POST /products - Create new product
  @Post()
  @ApiOperation({ summary: 'Create a new product', description: 'Creates a new product with the provided data.' })
  @ApiBody({ type: CreateProductDto, description: 'Data for the new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' /* , type: ProductResponseDto */ })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createProductDto: CreateProductDto) {
    // Your implementation here
    return `Creating product: ${JSON.stringify(createProductDto)}`;
  }

  // PUT /products/:id - Update product
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product', description: 'Updates the details of an existing product by its ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the product to update', type: String })
  @ApiBody({ type: UpdateProductDto, description: 'Data to update the product' })
  @ApiResponse({ status: 200, description: 'Product successfully updated.' /* , type: ProductResponseDto */ })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or ID format.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    // Your implementation here
    return `Updating product with ID: ${id} with data: ${JSON.stringify(updateProductDto)}`;
  }

  // DELETE /products/:id - Delete product
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product', description: 'Deletes a product by its unique identifier.' })
  @ApiParam({ name: 'id', description: 'The ID of the product to delete', type: String })
  @ApiResponse({ status: 204, description: 'Product successfully deleted.' }) // 204 No Content for successful deletion
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  remove(@Param('id') id: string) {
    // Your implementation here
    return `Deleting product with ID: ${id}`;
  }

  // GET /products/low-stock - Get products with low stock
  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock', description: 'Retrieves a list of products that are currently marked as low in stock.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved low stock products.' /* , type: [ProductResponseDto] */ })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getLowStockProducts() {
    // Your implementation here
    return 'Getting low stock products';
  }

  // GET /products/:id/inventory-history - Get product inventory history
  @Get(':id/inventory-history')
  @ApiOperation({ summary: 'Get product inventory history', description: 'Retrieves the inventory history (e.g., stock changes) for a specific product.' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved inventory history.' /* , type: [InventoryHistoryDto] */ })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getInventoryHistory(@Param('id') id: string) {
    // Your implementation here
    return `Getting inventory history for product ${id}`;
  }
}