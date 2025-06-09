import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerSignUpInput } from '../../auth/dtos/requests/signup/customerSignup.input';
import { UserService } from 'src/user/services/user.service';
import { Prisma } from 'generated/prisma';

const customerInclude = {
  user: true,
};

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(
    customerInfo: CustomerSignUpInput,
  ): Promise<Prisma.CustomerGetPayload<{ include: typeof customerInclude }>> {
    const { id } = await this.userService.createCustomer(customerInfo);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    const customer = await this.prisma.customer.create({
      data: {
        userId: user!.id,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        address: customerInfo.address,
        phoneNumber: customerInfo.phoneNumber,
        birthday: customerInfo.birthday
          ? new Date(customerInfo.birthday)
          : null,
      },
      include: customerInclude,
    });

    return customer;
  }
}
