import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API de análise de dados na Steam')
    .setDescription('API para análise de dados de tempo de jogo na Steam.')
    .setVersion('1.0')
    .addTag('Weekly-steam-report')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();

  await app.listen(3000);
}

void bootstrap();
