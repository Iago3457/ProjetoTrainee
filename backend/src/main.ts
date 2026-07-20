import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('API Matrícula Fácil')
    .setDescription('Documentação da API de Matrícula Fácil')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Cadastro, login de alunos e login de administradores')
    .addTag('Disciplinas', 'Catálogo e detalhes de disciplinas (requer autenticação de aluno)')
    .addTag('Matrículas', 'Inscrição, listagem e cancelamento de matrículas do aluno')
    .addTag('Admin', 'Gestão de disciplinas e aprovação de matrículas (requer autenticação de admin)')
    .addTag('Aluno', 'Perfil e configurações do aluno')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
