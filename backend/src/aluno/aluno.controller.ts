import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty, ApiBody } from '@nestjs/swagger';

class AtualizarAvatarDto {
    @ApiProperty({ description: 'URL pública da imagem de perfil', example: 'https://github.com/github.png' })
    avatarUrl!: string;
}

@ApiTags('Aluno')
@ApiBearerAuth()
@Controller('aluno')
export class AlunoController {
    constructor(private readonly alunoService: AlunoService) {}

    @UseGuards(AuthGuard)
    @Patch('avatar')
    @ApiOperation({ summary: 'Atualizar a foto de perfil do aluno logado' })
    @ApiBody({ type: AtualizarAvatarDto })
    @ApiResponse({ status: 200, description: 'Avatar atualizado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async atualizarAvatar(
        @Request() req,
        @Body() body: AtualizarAvatarDto
    ) {
        const alunoId = req.user.sub;
        return this.alunoService.atualizarAvatar(alunoId, body.avatarUrl);
    }
}
