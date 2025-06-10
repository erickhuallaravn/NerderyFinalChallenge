import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionValue, RowStatus } from '@prisma/client';
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

    return await this.prisma.optionValue.upsert({
      where: {
        optionId_code: {
          optionId: option.id,
          code: valueCode,
        },
      },
      create: {
        code: valueCode,
        name: valueCode,
        optionId: option.id,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
      update: {},
    });
  }
}
