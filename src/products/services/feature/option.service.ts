import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Option } from '@prisma/client';

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateOption(code: string): Promise<Option> {
    return await this.prisma.option.upsert({
      where: {
        code,
      },
      create: {
        name: code,
        code,
      },
      update: {},
    });
  }
}
