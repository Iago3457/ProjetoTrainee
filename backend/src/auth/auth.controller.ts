import { Controller, Post, UsePipes, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from './zod-validation.pipe';
import type { CadastroDto, LoginDto } from './dto/auth.schema';
import { cadastroSchema, loginSchema } from './dto/auth.schema';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('cadastro')
    @UsePipes(new ZodValidationPipe(cadastroSchema))
    async cadastrar(@Body() dados: CadastroDto) {
        return this.authService.cadastrar(dados);
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(loginSchema))
    async login(@Body() dados: LoginDto) {
        return {mensagem: 'Dados validados com sucesso no login!', dados};
    }
}
