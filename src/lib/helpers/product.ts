import { ProductStatus } from "@/types/product";

export const matchProductStatus = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.DRAFT:
      return 'Bản nháp';
    case ProductStatus.PROPOSED:
      return 'Đề xuất';
    case ProductStatus.PUBLISHED:
      return 'Công khai';
    case ProductStatus.REJECTED:
      return 'Từ chối';
    default:
      return 'Không xác định';
  }
}

export const matchProductStatusColor = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.DRAFT:
      return 'bg-gray-500';
    case ProductStatus.PROPOSED:
      return 'bg-yellow-500';
    case ProductStatus.PUBLISHED:
      return 'bg-green-500';
    case ProductStatus.REJECTED:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}