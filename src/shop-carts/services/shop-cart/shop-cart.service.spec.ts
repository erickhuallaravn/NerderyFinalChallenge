import { Test } from '@nestjs/testing';
import { ShopCartService } from './shop-cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ProductSeeder } from 'src/seeds/products/product.seed';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { AuthModule } from 'src/auth/auth.module';
import { ShopCartsModule } from 'src/shop-carts/shop-carts.module';
import { SeederModule } from 'src/seeds/seeder.module';
import { ProductVariationSeeder } from 'src/seeds/products/product-variation.seed';
import { PromotionalDiscountSeeder } from 'src/seeds/promotional-discounts/promotional-discounts.seed';
import { UserSeeder } from '../../../seeds/users/user.seed';
import { seededCustomerLogInInput } from '../../../seeds/users/user.seed';
import { RoleSeeder } from 'src/seeds/roles/role.seed';
import { OptionValueSeeder } from 'src/seeds/option-value/option-value.seeder';

describe('ShopCartService', () => {
  jest.setTimeout(20000);
  let service: ShopCartService;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;
  let authPayload: JwtPayload;
  let jwtToken: string;
  let productVariationId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule, ShopCartsModule, SeederModule],
      providers: [PrismaService],
    }).compile();

    service = module.get(ShopCartService);
    prisma = module.get(PrismaService);
    authService = module.get(AuthService);
    jwtService = module.get(JwtService);

    const rolesSeeder = module.get(RoleSeeder);
    const usersSeeder = module.get(UserSeeder);
    const optionValueSeeder = module.get(OptionValueSeeder);
    const productsSeeder = module.get(ProductSeeder);
    const variationsSeeder = module.get(ProductVariationSeeder);
    const promosSeeder = module.get(PromotionalDiscountSeeder);

    await prisma.cleanDatabase();
    await rolesSeeder.run();
    await usersSeeder.run();
    await optionValueSeeder.run();
    await productsSeeder.run();
    await variationsSeeder.run();
    await promosSeeder.run();

    productVariationId = (await prisma.productVariation.findFirstOrThrow()).id;
  });

  beforeEach(async () => {
    jwtToken = await authService.login(seededCustomerLogInInput);
    authPayload = await jwtService.verifyAsync(jwtToken);
  });

  it('should get or create a shopping cart header', async () => {
    const header = await service.getOrCreateHeader(authPayload);
    expect(header).toBeDefined();
    expect(header.customerId).toBe(authPayload.customerId);
  });

  it('should return empty items initially', async () => {
    const items = await service.getItems(authPayload);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(0);
  });

  it('should add an item without discount if below threshold', async () => {
    const result = await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 1,
    });
    expect(result).toBe(true);

    const items = await service.getItems(authPayload);
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].itemDiscounts.length).toBe(0);
  });

  it('should update the item and apply discount when quantity threshold is met', async () => {
    const result = await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 2,
    });
    expect(result).toBe(true);

    const items = await service.getItems(authPayload);
    expect(items[0].quantity).toBe(2);
    expect(items[0].itemDiscounts.length).toBe(1);
    expect(items[0].itemDiscounts[0].discountPercentage).toBeDefined();
  });

  it('should recalculate the header total correctly', async () => {
    const header = await service.getOrCreateHeader(authPayload);
    await service.recalculateHeaderTotal(header.id);

    const updatedHeader = await prisma.shopCartHeader.findUniqueOrThrow({
      where: { id: header.id },
    });

    expect(Number(updatedHeader.total)).toBeGreaterThan(0);
  });

  it('should empty the cart', async () => {
    const result = await service.emptyCart(authPayload);
    expect(result).toBe(true);

    const items = await service.getItems(authPayload);
    expect(items.length).toBe(0);

    const header = await service.getOrCreateHeader(authPayload);
    expect(Number(header.total)).toBe(0);
  });
});
