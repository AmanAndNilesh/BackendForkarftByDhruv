import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <<<--- IMPORT APIPROPERTY HERE

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
    type: String, // Explicitly define type for clarity in Swagger UI
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the category',
    required: false, // Mark as optional in Swagger UI
    example: 'Devices and gadgets such as smartphones, laptops, etc.',
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL or path to the category image',
    required: false,
    example: 'https://example.com/images/electronics.jpg',
    type: String,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Whether the category is active or not',
    required: false,
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// For UpdateCategoryDto, PartialType from @nestjs/mapped-types
// will automatically inherit and make all properties optional.
// Swagger will also automatically pick up the ApiProperty decorators
// from the base CreateCategoryDto.
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}