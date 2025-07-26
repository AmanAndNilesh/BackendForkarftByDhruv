import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { CategoriesController } from './inventory/controllers/categories.controller';
import { ProductsController } from './inventory/controllers/products.controller';
import { FileUploadController } from './inventory/controllers/files.controller';

@Module({
  controllers: [AdminController, InventoryController, CategoriesController, ProductsController, FileUploadController],
  providers: [AdminService, InventoryService],
})
export class AdminModule {}
