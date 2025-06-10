import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { Feature } from '../../models/feature/feature.model';
import { FeatureService } from '../../services/feature/feature.service';
import { AddVariationFeatureInput } from '../../dtos/requests/variation/add-variation-feature.input';
import { Feature as FeatureEntity } from '@prisma/client';

@Resolver(() => Feature)
@Resolver(() => Feature)
export class FeatureResolver {
  constructor(private readonly featureService: FeatureService) {}

  @Mutation(() => Feature)
  async addFeature(
    @Args('input') input: AddVariationFeatureInput,
  ): Promise<FeatureEntity> {
    return this.featureService.create(input);
  }

  @Mutation(() => Boolean)
  async deleteFeature(
    @Args('featureId', { type: () => ID }) featureId: string,
  ): Promise<boolean> {
    return this.featureService.delete(featureId);
  }
}
