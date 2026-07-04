import { Controller, Post, UsePipes, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from './zod-validation.pipe';
import { CadastroDto, LoginDto } from './dto/auth.schema';
import { cadastroSchema, loginSchema } from './dto/auth.schema';
import { AuthGuard } from './auth.guard';

import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('cadastro')
    @ApiOperation({ summary: 'Cadastrar um novo aluno' })
    @ApiBody({ type: CadastroDto })
    @ApiResponse({ status: 201, description: 'Aluno cadastrado com sucesso.' })
    @UsePipes(new ZodValidationPipe(cadastroSchema))
    async cadastrar(@Body() dados: CadastroDto) {
        return this.authService.cadastrar(dados);
    }

    @Post('login')
    @ApiOperation({ summary: 'Fazer login na plataforma' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login bem-sucedido.' })
    @UsePipes(new ZodValidationPipe(loginSchema))
    async login(@Body() dados: LoginDto) {
        return this.authService.login(dados);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obter dados do perfil do aluno logado' })
    @ApiResponse({ status: 200, description: 'Dados do perfil.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async getPerfil(@Request() req: any) {
        return this.authService.getPerfil(req.user.sub);
    }
}
