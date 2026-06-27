import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AlunoModule } from './aluno/aluno.module';
import { AuthModule } from './auth/auth.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';

@Module({
  imports: [PrismaModule, AlunoModule, AuthModule, DisciplinasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
