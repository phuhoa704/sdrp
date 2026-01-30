import { ProductCategory } from "@/types/product";

export const matchCategoryStatus = (category: ProductCategory) => {
  switch (category.is_active) {
    case true:
      return 'Hoạt động';
    case false:
      return 'Không hoạt động';
    default:
      return 'Không xác định';
  }
}

export const matchCategoryStatusColor = (category: ProductCategory) => {
  switch (category.is_active) {
    case true:
      return 'bg-green-500';
    case false:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export const matchCategoryType = (category: ProductCategory) => {
  switch (category.is_internal) {
    case true:
      return 'Nội bộ';
    case false:
      return 'Công khai';
    default:
      return 'Không xác định';
  }
}

export const matchCategoryTypeColor = (category: ProductCategory) => {
  switch (category.is_internal) {
    case true:
      return 'bg-blue-500';
    case false:
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

export const categoryStatusOptions = [
  { value: "active", label: 'Hoạt động' },
  { value: "inactive", label: 'Không hoạt động' },
];

export const categoryTypeOptions = [
  { value: "internal", label: 'Nội bộ' },
  { value: "public", label: 'Công khai' },
];
