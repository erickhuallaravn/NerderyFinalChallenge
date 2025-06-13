-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "catalog";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "common";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "identity";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "logs";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sales";

-- CreateEnum
CREATE TYPE "auth"."role_permission" AS ENUM ('READ', 'WRITE', 'DELETE', 'UPDATE', 'MANAGE_USERS');

-- CreateEnum
CREATE TYPE "auth"."user_status" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED', 'PENDING');

-- CreateEnum
CREATE TYPE "auth"."user_type" AS ENUM ('CUSTOMER', 'MANAGER');

-- CreateEnum
CREATE TYPE "catalog"."product_status" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'INVISIBLE', 'DELETED');

-- CreateEnum
CREATE TYPE "common"."row_status" AS ENUM ('ACTIVE', 'INVISIBLE', 'DELETED');

-- CreateEnum
CREATE TYPE "sales"."discount_type" AS ENUM ('PERCENTAGE', 'BONUS', 'BOTH');

-- CreateEnum
CREATE TYPE "sales"."payment_status" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "sales"."promotion_status" AS ENUM ('ACTIVE', 'OUT_OF_STOCK', 'EXPIRED', 'DELETED');

-- CreateEnum
CREATE TYPE "sales"."order_header_status" AS ENUM ('CREATED', 'PENDING_PAYMENT', 'PAID', 'IN_SHIPPING', 'SHIPPED', 'ANULATED');

-- CreateEnum
CREATE TYPE "sales"."currency_code" AS ENUM ('USD', 'PEN');

-- CreateTable
CREATE TABLE "auth"."role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "permissions" "auth"."role_permission"[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "userType" "auth"."user_type" NOT NULL,
    "token_version" VARCHAR DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "auth"."user_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "valid_until" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "catalog"."product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "catalog"."product_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."product_file" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productVariationId" UUID NOT NULL,
    "fileExtension" VARCHAR NOT NULL,
    "url" TEXT NOT NULL,
    "altText" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "product_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."option" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."option_value" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "option_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "common"."row_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "option_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."feature" (
    "optionValueId" UUID NOT NULL,
    "product_variation_id" UUID NOT NULL,
    "status" "common"."row_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL
);

-- CreateTable
CREATE TABLE "identity"."customer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "address" VARCHAR,
    "phone_number" VARCHAR,
    "birthday" DATE,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity"."customer_like_products" (
    "customer_id" UUID NOT NULL,
    "product_variation_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "customer_like_products_pkey" PRIMARY KEY ("customer_id","product_variation_id")
);

-- CreateTable
CREATE TABLE "catalog"."product_variation" (
    "product_variation_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "price" DECIMAL NOT NULL,
    "currency_code" "sales"."currency_code" NOT NULL,
    "available_stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "catalog"."product_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_variation_pkey" PRIMARY KEY ("product_variation_id")
);

-- CreateTable
CREATE TABLE "logs"."order_detail_discount" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_detail_id" UUID NOT NULL,
    "promotional_discount_id" UUID NOT NULL,
    "required_amount" INTEGER NOT NULL,
    "discount_percentage" DECIMAL,
    "bonus_amount" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "common"."row_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "order_detail_discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."order_header_status" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_header_id" UUID NOT NULL,
    "notes" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "sales"."order_header_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "order_header_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."order_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_header_id" UUID NOT NULL,
    "product_name" VARCHAR NOT NULL,
    "product_variation_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" MONEY NOT NULL,
    "currency_code" "sales"."currency_code" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "common"."row_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."order_header" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "total" MONEY NOT NULL,
    "currency_code" "sales"."currency_code" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "order_header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."order_payment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_header_id" UUID NOT NULL,
    "stripe_payment_id" VARCHAR NOT NULL,
    "amount" DECIMAL NOT NULL,
    "currency_code" "sales"."currency_code" NOT NULL,
    "status_message" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "sales"."payment_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "order_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."promotional_discount" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "product_variation_id" UUID NOT NULL,
    "discountType" "sales"."discount_type" NOT NULL,
    "required_amount" INTEGER NOT NULL,
    "bonus_amount" INTEGER,
    "discount_percentage" DECIMAL,
    "valid_since" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(6),
    "available_stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" "sales"."promotion_status" NOT NULL,
    "status_updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "promotional_discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."shop_cart_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shopping_cart_header_id" UUID NOT NULL,
    "product_variation_id" UUID NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" MONEY NOT NULL,
    "currency_code" "sales"."currency_code" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "shop_cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales"."shop_cart_header" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "due_date" TIMESTAMP(6),
    "total" MONEY NOT NULL,
    "currency_code" "sales"."currency_code" NOT NULL,
    "customer_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "shop_cart_header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs"."shop_cart_item_discount" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shop_cart_item_id" UUID NOT NULL,
    "promotional_discount_id" UUID NOT NULL,
    "required_amount" INTEGER NOT NULL,
    "discount_percentage" DECIMAL,
    "bonus_amount" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "shop_cart_item_discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "auth"."role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "auth"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "option_code_key" ON "catalog"."option"("code");

-- CreateIndex
CREATE UNIQUE INDEX "option_value_option_id_code_key" ON "catalog"."option_value"("option_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "feature_product_variation_id_optionValueId_key" ON "catalog"."feature"("product_variation_id", "optionValueId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_user_id_key" ON "identity"."customer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "shop_cart_header_customer_id_key" ON "sales"."shop_cart_header"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "shop_cart_item_discount_shop_cart_item_id_promotional_disco_key" ON "logs"."shop_cart_item_discount"("shop_cart_item_id", "promotional_discount_id");

-- AddForeignKey
ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth"."role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."product_file" ADD CONSTRAINT "product_file_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "catalog"."product_variation"("product_variation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."option_value" ADD CONSTRAINT "option_value_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "catalog"."option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."feature" ADD CONSTRAINT "feature_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES "catalog"."option_value"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."feature" ADD CONSTRAINT "feature_product_variation_id_fkey" FOREIGN KEY ("product_variation_id") REFERENCES "catalog"."product_variation"("product_variation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity"."customer" ADD CONSTRAINT "customer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity"."customer_like_products" ADD CONSTRAINT "customer_like_products_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "identity"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity"."customer_like_products" ADD CONSTRAINT "customer_like_products_product_variation_id_fkey" FOREIGN KEY ("product_variation_id") REFERENCES "catalog"."product_variation"("product_variation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."product_variation" ADD CONSTRAINT "product_variation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs"."order_detail_discount" ADD CONSTRAINT "order_detail_discount_order_detail_id_fkey" FOREIGN KEY ("order_detail_id") REFERENCES "sales"."order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs"."order_detail_discount" ADD CONSTRAINT "order_detail_discount_promotional_discount_id_fkey" FOREIGN KEY ("promotional_discount_id") REFERENCES "sales"."promotional_discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs"."order_header_status" ADD CONSTRAINT "order_header_status_order_header_id_fkey" FOREIGN KEY ("order_header_id") REFERENCES "sales"."order_header"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."order_item" ADD CONSTRAINT "order_item_order_header_id_fkey" FOREIGN KEY ("order_header_id") REFERENCES "sales"."order_header"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."order_item" ADD CONSTRAINT "order_item_product_variation_id_fkey" FOREIGN KEY ("product_variation_id") REFERENCES "catalog"."product_variation"("product_variation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."order_header" ADD CONSTRAINT "order_header_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "identity"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."order_payment" ADD CONSTRAINT "order_payment_order_header_id_fkey" FOREIGN KEY ("order_header_id") REFERENCES "sales"."order_header"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."promotional_discount" ADD CONSTRAINT "promotional_discount_product_variation_id_fkey" FOREIGN KEY ("product_variation_id") REFERENCES "catalog"."product_variation"("product_variation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."shop_cart_item" ADD CONSTRAINT "shop_cart_item_product_variation_id_fkey" FOREIGN KEY ("product_variation_id") REFERENCES "catalog"."product_variation"("product_variation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."shop_cart_item" ADD CONSTRAINT "shop_cart_item_shopping_cart_header_id_fkey" FOREIGN KEY ("shopping_cart_header_id") REFERENCES "sales"."shop_cart_header"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"."shop_cart_header" ADD CONSTRAINT "shop_cart_header_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "identity"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs"."shop_cart_item_discount" ADD CONSTRAINT "shop_cart_item_discount_shop_cart_item_id_fkey" FOREIGN KEY ("shop_cart_item_id") REFERENCES "sales"."shop_cart_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs"."shop_cart_item_discount" ADD CONSTRAINT "shop_cart_item_discount_promotional_discount_id_fkey" FOREIGN KEY ("promotional_discount_id") REFERENCES "sales"."promotional_discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
