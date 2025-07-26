import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsObject, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger'; // <<<--- IMPORT APIPROPERTY HERE

// Define nested DTOs for better Swagger schema generation and validation clarity
export class CustomizationOptionDto {
  @ApiProperty({ description: 'Allow text customization', example: true, required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  allowText?: boolean;

  @ApiProperty({ description: 'Allow image uploads for customization', example: false, required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  allowImages?: boolean;

  @ApiProperty({ description: 'Allow predefined quotes for customization', example: true, required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  allowQuotes?: boolean;

  @ApiProperty({ description: 'Maximum number of images allowed for customization', example: 5, required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxImages?: number;

  @ApiProperty({ description: 'List of text fields available for customization', example: ['Name', 'Message'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  textFields?: string[];

  @ApiProperty({
    description: 'Additional custom fields for the product',
    required: false,
    type: [Object], // Can be more specific with a nested DTO if complex
    example: [
      { name: 'Size', type: 'select', options: ['S', 'M', 'L'] },
      { name: 'Engraving', type: 'text' }
    ]
  })
  @IsOptional()
  @IsArray()
  // Note: For complex nested arrays of objects like this, if you want full
  // schema details in Swagger, you'd typically define a dedicated DTO
  // for the array elements and use @Type(() => YourNestedDto) and @ValidateNested({ each: true })
  additionalFields?: { name: string; type: 'text' | 'number' | 'select'; options?: string[] }[];
}

export class ProductImageDto {
  @ApiProperty({ description: 'URL of the product image', example: 'https://example.com/product-a-main.jpg', type: String })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Alt text for the image', required: false, example: 'Main image of Product A', type: String })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({ description: 'Is this the primary image for the product?', required: false, example: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Premium Wireless Headphones', type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: 'A detailed description of the product', example: 'High-fidelity wireless headphones with noise-cancellation and long battery life.', type: String })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The base price of the product', example: 199.99, type: Number, format: 'float' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  basePrice: number;

  @ApiProperty({ description: 'Stock Keeping Unit (unique identifier)', example: 'HW-HP-001', type: String })
  @IsString()
  sku: string;

  @ApiProperty({ description: 'Current quantity of product in stock', example: 150, type: Number })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ description: 'Minimum stock level to trigger reorder alerts', required: false, example: 20, type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStockLevel?: number;

  @ApiProperty({ description: 'The ID of the category this product belongs to', example: '60c72b2f9b1d8d0015f8e3a0', type: String })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Whether the product is customizable by the customer', required: false, example: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  isCustomizable?: boolean;

  @ApiProperty({
    description: 'Options for product customization',
    required: false,
    type: CustomizationOptionDto, // Link to the nested DTO
    example: {
      allowText: true,
      allowImages: false,
      textFields: ['engraving_text'],
    }
  })
  @IsOptional()
  @IsObject()
  @ValidateNested() // Important for validating nested objects
  @Type(() => CustomizationOptionDto) // Important for class-transformer
  customizationOptions?: CustomizationOptionDto; // Use the DTO type here

  @ApiProperty({ description: 'Tags associated with the product', required: false, example: ['audio', 'headphones', 'wireless'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'List of product images',
    required: false,
    type: [ProductImageDto], // Link to the nested DTO array
    example: [
      { url: 'https://example.com/img/hp-main.jpg', altText: 'Main view', isPrimary: true },
      { url: 'https://example.com/img/hp-side.jpg', altText: 'Side view' }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Important for validating nested arrays of objects
  @Type(() => ProductImageDto) // Important for class-transformer
  images?: ProductImageDto[]; // Use the DTO type here

  @ApiProperty({ description: 'Whether the product is active/available', required: false, example: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}