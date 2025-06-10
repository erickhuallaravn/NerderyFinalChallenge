import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { GlobalExceptionFilter } from './common/filters/prisma-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 5_242_880; // 5MB by default
  const maxFiles = Number(process.env.MAX_FILES_IN_UPLOAD) || 5;

  app.use(
    graphqlUploadExpress({
      maxFileSize,
      maxFiles,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(helmet());

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}`);
}

void bootstrap();
