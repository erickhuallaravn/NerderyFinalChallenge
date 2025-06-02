import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpInput } from '../../auth/dtos/requests/signup/signup.input';
import { UserService } from 'src/user/services/user.service';
import { Customer } from 'generated/prisma';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(
    newCustomerInfo: SignUpInput,
  ): Promise<{ customer: Customer; tokenVersion: string }> {
    const { id } = await this.userService.create({
      newUserInfo: newCustomerInfo,
    });
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    const customer = await this.prisma.customer.create({
      data: {
        userId: user!.id,
        firstName: newCustomerInfo.first_name,
        lastName: newCustomerInfo.last_name,
        address: newCustomerInfo.address,
        phoneNumber: newCustomerInfo.phone_number,
        birthday: newCustomerInfo.birthday
          ? new Date(newCustomerInfo.birthday)
          : null,
      },
    });

    return { customer: customer, tokenVersion: user!.tokenVersion! };
  }
}
