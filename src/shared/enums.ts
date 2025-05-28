export type CurrencyCode = 'PEN' | 'USD';

export type RolePermission =
  | 'READ'
  | 'WRITE'
  | 'DELETE'
  | 'UPDATE'
  | 'MANAGE_USERS';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'PENDING';

export type UserType = 'CUSTOMER' | 'MANAGER';

export type ProductStatus =
  | 'AVAILABLE'
  | 'OUT_OF_STOCK'
  | 'INVISIBLE'
  | 'DELETED';

export type RowStatus = 'ACTIVE' | 'INVISIBLE' | 'DELETED';

export type DiscountType = 'PERCENTAGE' | 'BONUS';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type PromotionStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'EXPIRED' | 'DELETED';
