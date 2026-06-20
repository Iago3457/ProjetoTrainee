import { z } from 'zod';
import universidades from '../resources/universities.json'; //importa um JSON com as universidades e seus domínios

const dominiosPermitidos = universidades.flatMap((uni: any) => uni.domains); //coloca todos os dominios de universidades em um array

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
});

export type CadastroDto = z.infer<typeof cadastroSchema>;

export const loginSchema = z.object({
    email: z.email({ error: 'Email inválido' }),
    senha: z.string().min(1, { error: 'Senha é obrigatória' }),
});

export type LoginDto = z.infer<typeof loginSchema>;