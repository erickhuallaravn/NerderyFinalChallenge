import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(graphqlUploadExpress({ maxFileSize: Number(process.env.MAX_FILE_SIZE), maxFiles: Number(process.env.MAX_FILES_IN_UPLOAD) }));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
