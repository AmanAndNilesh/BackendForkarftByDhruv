import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/categories.entity';
import { FindManyOptions, ILike, LessThan, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/request/create-category.dto';
import { Product } from './entity/products.entity';
import { CreateProductDto, UpdateProductDto } from './dtos/request/create-product.dto';
import { PaginatedProducts } from './interfaces/product.interface';

@Injectable()
export class InventoryService {
    private readonly logger = new Logger(InventoryService.name);

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async findAllCategories(page, limit) {
        try {
            page = Math.max(1, page);
            limit = Math.max(1, limit);
            const skip = (page - 1) * limit;
            return await this.categoryRepo.find({ skip: skip, take: limit })
        } catch (error) {
            this.logger.log(`Error while fetching categories ${error}`);
        }
    }

    async findCategories(id: string) {
        try {
            return await this.categoryRepo.findOne({ where: { id: id } })
        } catch (error) {
            this.logger.log(`Error while fetching categories ${error}`);
        }
    }

    async createNewCategory(createCategoryDto: CreateCategoryDto) {
        try {
            const newCategory = await this.categoryRepo.create(createCategoryDto);
            return await this.categoryRepo.save(newCategory);
        } catch (error) {
            this.logger.log(`Error while creating a new category ${error}`)
        }
    }

    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
        try {
            const categoryToUpdate = await this.categoryRepo.findOne({ where: { id } });

            if (!categoryToUpdate) {
                throw new NotFoundException(`Category with ID "${id}" not found`);
            }
            this.categoryRepo.merge(categoryToUpdate, updateCategoryDto);

            return await this.categoryRepo.save(categoryToUpdate);

        } catch (error) {
            this.logger.error(`Error updating category with ID "${id}": ${error.message}`, error.stack);

            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update category with ID "${id}"`);
        }
    }

    async deleteCategories(id: string) {
        try {
            const result = await this.categoryRepo.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Category with ID "${id}" not found`);
            }
            return { deleted: true, message: `Category with ID "${id}" has been successfully deleted.` };
        } catch (error) {
            this.logger.error(`Error deleting category with ID "${id}": ${error.message}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete category with ID "${id}"`);
        }
    }

    // product endpoints 

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        try {
            // Check if a product with the same SKU already exists
            const existingProduct = await this.productsRepository.findOne({
                where: { sku: createProductDto.sku },
            });
            if (existingProduct) {
                throw new BadRequestException(`Product with SKU "${createProductDto.sku}" already exists.`);
            }

            const newProduct = this.productsRepository.create(createProductDto);
            return await this.productsRepository.save(newProduct);
        } catch (error) {
            this.logger.error(`Error creating product: ${error.message}`, error.stack);
            // Re-throw specific exceptions or wrap generic ones
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error('Failed to create product.'); // Generic error for unexpected issues
        }
    }

    async findAllProducts(
        page: number = 1,
        limit: number = 10,
        categoryId?: string,
        search?: string,
        lowStock?: boolean,
    ): Promise<PaginatedProducts> {
        page = Math.max(1, page);
        limit = Math.max(1, limit);
        const skip = (page - 1) * limit;

        const findOptions: FindManyOptions<Product> = {
            skip: skip,
            take: limit,
            order: {
                name: 'ASC',
            },
            relations: ['category'],
            where: {},
        };

        if (categoryId) {
            findOptions.where = { ...findOptions.where, categoryId: categoryId };
        }

        if (search) {
            findOptions.where = {
                ...findOptions.where,
                name: ILike(`%${search}%`),
            };
        }

        try {
            const [data, total] = await this.productsRepository.findAndCount(findOptions);

            return {
                data,
                total,
                page,
                limit,
            };
        } catch (error) {
            this.logger.error(`Error fetching products: ${error.message}`, error.stack);
            throw new Error('Failed to retrieve products.');
        }
    }

    async findOneProduct(id: string): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category'], // Load related category
        });
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        try {
            const productToUpdate = await this.productsRepository.findOne({ where: { id } });

            if (!productToUpdate) {
                throw new NotFoundException(`Product with ID "${id}" not found`);
            }

            // Check if SKU is being updated to an existing one (and it's not the current product's SKU)
            if (updateProductDto.sku && updateProductDto.sku !== productToUpdate.sku) {
                const existingSkuProduct = await this.productsRepository.findOne({
                    where: { sku: updateProductDto.sku },
                });
                if (existingSkuProduct) {
                    throw new BadRequestException(`Product with SKU "${updateProductDto.sku}" already exists.`);
                }
            }

            this.productsRepository.merge(productToUpdate, updateProductDto);
            return await this.productsRepository.save(productToUpdate);
        } catch (error) {
            this.logger.error(`Error updating product with ID "${id}": ${error.message}`, error.stack);
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to update product with ID "${id}".`);
        }
    }

    async removeProduct(id: string): Promise<{ deleted: boolean; message?: string }> {
        try {
            const result = await this.productsRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Product with ID "${id}" not found`);
            }
            return { deleted: true, message: `Product with ID "${id}" has been successfully deleted.` };
        } catch (error) {
            this.logger.error(`Error deleting product with ID "${id}": ${error.message}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete product with ID "${id}".`);
        }
    }

    async getLowStockProducts(): Promise<Product[]> {
        try {
            return await this.productsRepository.find({
                where: { stockQuantity: LessThan(5) },
                order: {
                    name: 'ASC'
                }
            });
        } catch (error) {
            this.logger.error(`Error fetching low stock products: ${error.message}`, error.stack);
            throw new Error('Failed to retrieve low stock products.');
        }
    }
} 