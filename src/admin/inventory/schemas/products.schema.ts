// src/products/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './categories.schema';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column()
  sku: string; // Stock Keeping Unit

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: 0 })
  minStockLevel: number; // For low stock alerts

  @Column({ default: true })
  isCustomizable: boolean;

  @Column('jsonb', { nullable: true })
  customizationOptions: {
    allowText?: boolean;
    allowImages?: boolean;
    allowQuotes?: boolean;
    maxImages?: number;
    textFields?: string[];
    additionalFields?: { name: string; type: 'text' | 'number' | 'select'; options?: string[] }[];
  };

  @Column({ default: true })
  isActive: boolean;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
