// src/common/dto/paginated-response.dto.ts
export class PaginatedResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  // src/inventory/dto/dashboard-response.dto.ts
  export class DashboardResponseDto {
    totalProducts: number;
    totalCategories: number;
    lowStockProducts: number;
    totalStockValue: number;
    topSellingProducts: any[];
    stockAlerts: any[];
  }
  