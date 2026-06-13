import { Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';

@Module({
  providers: [AlunoService]
})
export class AlunoModule {}
