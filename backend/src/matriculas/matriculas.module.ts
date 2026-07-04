import { Module } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { MatriculasController } from './matriculas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [MatriculasService],
  controllers: [MatriculasController],
  imports: [PrismaModule]
})
export class MatriculasModule {}
