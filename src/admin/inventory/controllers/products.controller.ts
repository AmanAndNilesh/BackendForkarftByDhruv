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
import { InventoryService } from "../inventory.service";

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly inventoryService: InventoryService
  ) { }
  @Get()
  @ApiOperation({ summary: 'Retrieve all products', description: 'Fetches a list of all products with optional filters for pagination, category, search term, and low stock status.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter products by category ID' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search products by name or description' })
  // @ApiQuery({ name: 'lowStock', required: false, type: Boolean, description: 'Filter for products with low stock (true/false)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products.' /* , type: [ProductResponseDto] */ })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') categoryId?: string,
    @Query('search') search?: string,
    // @Query('lowStock') lowStock?: boolean
  ) {
    return await this.inventoryService.findAllProducts(page, limit, categoryId, search)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID', description: 'Retrieves a single product by its unique identifier.' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String })
  @ApiResponse({ status: 200, description: 'Product found.' /* , type: ProductResponseDto */ })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async findOne(@Param('id') id: string) {
    return await this.inventoryService.findOneProduct(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product', description: 'Creates a new product with the provided data.' })
  @ApiBody({ type: CreateProductDto, description: 'Data for the new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' /* , type: ProductResponseDto */ })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.inventoryService.createProduct(createProductDto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product', description: 'Updates the details of an existing product by its ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the product to update', type: String })
  @ApiBody({ type: UpdateProductDto, description: 'Data to update the product' })
  @ApiResponse({ status: 200, description: 'Product successfully updated.' /* , type: ProductResponseDto */ })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or ID format.' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.inventoryService.updateProduct(id, updateProductDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product', description: 'Deletes a product by its unique identifier.' })
  @ApiParam({ name: 'id', description: 'The ID of the product to delete', type: String })
  @ApiResponse({ status: 204, description: 'Product successfully deleted.' }) // 204 No Content for successful deletion
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  async remove(@Param('id') id: string) {
    return await this.inventoryService.removeProduct(id)
  }
  
  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock', description: 'Retrieves a list of products that are currently marked as low in stock.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved low stock products.'})
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getLowStockProducts() {
    return await this.inventoryService.getLowStockProducts()
  }
}