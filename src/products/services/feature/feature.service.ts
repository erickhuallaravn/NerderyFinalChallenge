import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionValueService } from './option-value.service';
import { Feature, RowStatus } from '@prisma/client';
import { AddVariationFeatureInput } from '../../dtos/requests/variation/add-variation-feature.input';
import { Prisma } from '@prisma/client';
import { DeleteVariationFeatureInput } from 'src/products/dtos/requests/variation/delete-variation-feature.input';

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

  async createWithTx(
    tx: Prisma.TransactionClient,
    input: AddVariationFeatureInput,
  ): Promise<Feature> {
    const optionValue = await this.optionValueService.findOrCreateValue(
      input.optionCode,
      input.valueCode,
    );

    const existingVariation = await tx.feature.findFirst({
      where: {
        productVariationId: input.productVariationId,
        optionValueId: optionValue.id,
      },
    });

    if (existingVariation) return existingVariation;

    return tx.feature.create({
      data: {
        productVariationId: input.productVariationId,
        optionValueId: optionValue.id,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
    });
  }

  async delete(input: DeleteVariationFeatureInput): Promise<boolean> {
    const optionValue = await this.prisma.optionValue.findUniqueOrThrow({
      where: {
        id: input.optionValueId,
      },
    });
    await this.prisma.feature.update({
      where: {
        productVariationId_optionValueId: {
          productVariationId: input.productVariationId,
          optionValueId: optionValue.id,
        },
      },
      data: {
        status: RowStatus.DELETED,
        statusUpdatedAt: new Date(),
      },
    });
    return true;
  }
}
