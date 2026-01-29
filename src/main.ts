import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedExerciseTemplates } from './database/seeds/exercise-templates.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['*'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);

  // Run seed after app starts
  try {
    const dataSource = app.get(DataSource);
    await seedExerciseTemplates(dataSource);
  } catch (error) {
    console.error('❌ Error seeding exercise templates:', error);
  }
}
void bootstrap();
