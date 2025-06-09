import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionValueService } from '../option/option-value.service';
import { Feature, RowStatus } from 'generated/prisma';
import { AddVariationFeatureInput } from '../../dtos/requests/variation/add-variation-feature.input';

@Injectable()
export class FeatureService {
  constructor(
    private prisma: PrismaService,
    private optionValueService: OptionValueService,
  ) {}

  async create(input: AddVariationFeatureInput): Promise<Feature> {
    const optionValue = await this.optionValueService.findOrCreateValue(
      input.optionCode,
      input.valueCode,
    );

    const existingVariation = await this.prisma.feature.findFirst({
      where: {
        productVariationId: input.productVariationId,
        optionValueId: optionValue.id,
      },
    });

    if (existingVariation) return existingVariation;

    return this.prisma.feature.create({
      data: {
        productVariationId: input.productVariationId,
        optionValueId: optionValue.id,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
    });
  }

  async delete(featureId: string): Promise<boolean> {
    await this.prisma.feature.update({
      where: { id: featureId },
      data: {
        status: RowStatus.DELETED,
        statusUpdatedAt: new Date(),
      },
    });
    return true;
  }
}
