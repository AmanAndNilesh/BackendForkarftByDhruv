import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <<<--- IMPORT APIPROPERTY HERE
import { CategoriesEnum } from '../../enums/categories.enum';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Decor'
  })
  @IsString()
  name: CategoriesEnum;

  @ApiProperty({
    description: 'A brief description of the category',
    required: false,
    example: 'Devices and gadgets such as smartphones, laptops, etc.',
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string;

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
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }