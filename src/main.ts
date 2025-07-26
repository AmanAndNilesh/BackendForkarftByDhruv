import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Karft by druv') // Set your API title
    .setDescription('backend api documentation for kraft by dhruv') // Set your API description
    .setVersion('1.0') // Set your API version
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' is the path where Swagger UI will be served

  
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('APP_PORT') || 3000;
  
  await app.listen(appPort);
  
  Logger.log(`Check app docs here: http://localhost:${appPort}/api`);
}
bootstrap();
