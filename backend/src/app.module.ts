import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AlunoModule } from './aluno/aluno.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AlunoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
