import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Option } from 'generated/prisma';

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateOption(code: string): Promise<Option> {
    let option = await this.prisma.option.findUnique({ where: { code } });

    if (!option) {
      option = await this.prisma.option.create({
        data: {
          code,
          name: code,
        },
      });
    }

    return option;
  }
}
