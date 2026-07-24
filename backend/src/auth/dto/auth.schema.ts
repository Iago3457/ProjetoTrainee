import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import universidades from '../resources/universities.json';

const dominiosPermitidos = universidades.flatMap((uni: any) => uni.domains);

export const cadastroSchema = z.object({
  nome: z.string().min(3, { error: 'O Nome deve ter no mínimo 3 caracteres' }),
  email: z.email({ error: 'Email inválido' }).refine((email) => {
        const partes = email.split('@');
        // Se não tiver '@', já falha
        if (partes.length !== 2) return false; 
        
        const dominioEmail = partes[1]; 
        return dominiosPermitidos.some(dominioPermitido => dominioPermitido === dominioEmail || dominioEmail.endsWith('.' + dominioPermitido));
      },
      { error: 'Por favor, utilize um e-mail válido de uma instituição de ensino reconhecida.' }
  ),
  senha: z.string().min(6, { error: 'Senha deve ter no mínimo 6 caracteres' }),
  cursoId: z.string().uuid({ error: 'cursoId deve ser um UUID válido' }).optional(),
});

export const loginSchema = z.object({
    email: z.email({ error: 'Email inválido' }),
    senha: z.string().min(1, { error: 'Senha é obrigatória' }),
});

export class CadastroDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do aluno' })
  nome!: string;

  @ApiProperty({ example: 'joao.silva@unicamp.br', description: 'E-mail acadêmico válido' })
  email!: string;

  @ApiProperty({ example: 'senha123', description: 'Senha com mínimo de 6 caracteres' })
  senha!: string;

  @ApiPropertyOptional({ example: 'uuid-do-curso', description: 'ID do curso escolhido (opcional)' })
  cursoId?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'joao.silva@unicamp.br', description: 'E-mail cadastrado' })
  email!: string;

  @ApiProperty({ example: 'senha123', description: 'Senha cadastrada' })
  senha!: string;
}