import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionValue } from 'generated/prisma';
import { OptionService } from './option.service';

@Injectable()
export class OptionValueService {
  constructor(
    private prisma: PrismaService,
    private optionService: OptionService,
  ) {}

  async findOrCreateValue(
    optionCode: string,
    valueCode: string,
  ): Promise<OptionValue> {
    const option = await this.optionService.findOrCreateOption(optionCode);

    let value = await this.prisma.optionValue.findUnique({
      where: {
        optionId_code: {
          optionId: option.id,
          code: valueCode,
        },
      },
    });

    if (!value) {
      value = await this.prisma.optionValue.create({
        data: {
          code: valueCode,
          name: valueCode,
          optionId: option.id,
          status: 'ACTIVE',
          statusUpdatedAt: new Date(),
        },
      });
    }

    return value;
  }
}
