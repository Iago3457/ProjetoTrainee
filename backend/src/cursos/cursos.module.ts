import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';

@Module({
    imports: [PrismaModule],
    providers: [CursosService],
    controllers: [CursosController],
    exports: [CursosService],
})
export class CursosModule {}
