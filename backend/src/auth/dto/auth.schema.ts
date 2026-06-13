import { z } from 'zod';

export const cadastroSchema = z.object({
  nome: z.string().min(3, { error: 'O Nome deve ter no mínimo 3 caracteres' }),
  email: z.email({ error: 'Email inválido' }),
  senha: z.string().min(6, { error: 'Senha deve ter no mínimo 6 caracteres' }),
});

export type CadastroDto = z.infer<typeof cadastroSchema>;

export const loginSchema = z.object({
    email: z.email({ error: 'Email inválido' }),
    senha: z.string().min(1, { error: 'Senha é obrigatória' }),
});

export type LoginDto = z.infer<typeof loginSchema>;