import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { CategoriesController } from './inventory/controllers/categories.controller';
import { ProductsController } from './inventory/controllers/products.controller';
import { FileUploadController } from './inventory/controllers/files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './inventory/entity/categories.entity';
import { Product } from './inventory/entity/products.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Category, Product])],
  controllers: [AdminController, InventoryController, CategoriesController, ProductsController, FileUploadController],
  providers: [AdminService, InventoryService],
})
export class AdminModule {}
