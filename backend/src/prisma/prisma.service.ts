import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    const adapter = new PrismaPg({ connectionString });

    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Setup initial config if missing
    const hasAno = await this.config.findUnique({ where: { chave: 'anoAtual' } });
    if (!hasAno) {
      await this.config.create({ data: { chave: 'anoAtual', valor: '2026' } });
    }
    const hasSemestre = await this.config.findUnique({ where: { chave: 'semestreAtual' } });
    if (!hasSemestre) {
      await this.config.create({ data: { chave: 'semestreAtual', valor: '1' } });
    }
  }

  async getSemestreAtual(): Promise<{ ano: number, semestre: number }> {
    const [anoConfig, semConfig] = await Promise.all([
      this.config.findUnique({ where: { chave: 'anoAtual' } }),
      this.config.findUnique({ where: { chave: 'semestreAtual' } })
    ]);

    return {
      ano: anoConfig ? parseInt(anoConfig.valor, 10) : 2026,
      semestre: semConfig ? parseInt(semConfig.valor, 10) : 1
    };
  }
}
