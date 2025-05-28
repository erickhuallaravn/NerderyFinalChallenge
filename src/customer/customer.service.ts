import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpInput } from '../auth/dtos/requests/signup/signup.input';
import { UserService } from 'src/user/user.service';
import { customer as Customer } from 'generated/prisma';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(
    newCustomerInfo: SignUpInput,
  ): Promise<{ customer: Customer; token_version: string }> {
    const { user_id } = await this.userService.create({
      newUserInfo: newCustomerInfo,
    });
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    const customer = await this.prisma.customer.create({
      data: {
        user_id: user!.user_id,
        first_name: newCustomerInfo.first_name,
        last_name: newCustomerInfo.last_name,
        address: newCustomerInfo.address,
        phone_number: newCustomerInfo.phone_number,
        birthday: newCustomerInfo.birthday
          ? new Date(newCustomerInfo.birthday)
          : null,
      },
    });

    return { customer: customer, token_version: user!.token_version! };
  }
}
