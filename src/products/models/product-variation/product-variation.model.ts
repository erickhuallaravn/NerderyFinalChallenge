import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product.model';
import { ProductFile } from '../product-file/product-file.model';
// import { OrderDetail } from '../../orders/entities/order-detail';
// import { PromotionalDiscount } from '../../discounts/entities/promotional-discount';
// import { ShoppingCartDetail } from '../../cart/entities/shopping-cart-detail';
// import { CustomerLikedProduct } from '../../likes/entities/customer-liked-product';
import { ProductStatus, CurrencyCode } from 'src/shared/enums';
import { Feature } from '../feature/feature.model';

@ObjectType()
export class ProductVariation {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  currencyCode: CurrencyCode;

  @Field()
  availableStock: number;

  @Field(() => Product)
  product: Product;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field()
  status: ProductStatus;

  @Field()
  statusUpdatedAt: Date;

  @Field(() => [ProductFile])
  productFiles: ProductFile[];

  @Field(() => [Feature])
  features: Feature[];

  // @Field(() => [CustomerLikedProduct])
  // customer_liked_products: CustomerLikedProduct[];

  // @Field(() => [OrderDetail])
  // order_detail: OrderDetail[];

  // @Field(() => [PromotionalDiscount])
  // promotional_discount: PromotionalDiscount[];

  // @Field(() => [ShoppingCartDetail])
  // shopping_cart_detail: ShoppingCartDetail[];
}
