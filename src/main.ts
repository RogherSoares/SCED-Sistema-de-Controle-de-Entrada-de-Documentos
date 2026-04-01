import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port);
  });
}

async function getAvailablePort(preferredPort: number): Promise<number> {
  let port = preferredPort;

  while (!(await isPortAvailable(port))) {
    port += 1;
  }

  return port;
}

async function bootstrap() {
  const httpsEnabled = process.env.HTTPS_ENABLED === 'true';
  const httpsKeyPath = process.env.HTTPS_KEY_PATH;
  const httpsCertPath = process.env.HTTPS_CERT_PATH;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    ...(httpsEnabled && httpsKeyPath && httpsCertPath
      ? {
          httpsOptions: {
            key: readFileSync(httpsKeyPath),
            cert: readFileSync(httpsCertPath),
          },
        }
      : {}),
  });

  if (httpsEnabled && (!httpsKeyPath || !httpsCertPath)) {
    console.warn(
      'HTTPS habilitado sem caminho de chave/certificado. Iniciando em HTTP.',
    );
  }

  app.useStaticAssets(join(process.cwd()), { index: false });
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const preferredPort = Number(process.env.PORT ?? 3000);
  const availablePort = await getAvailablePort(preferredPort);

  if (availablePort !== preferredPort) {
    console.warn(
      `Porta ${preferredPort} ocupada. Iniciando servidor na porta ${availablePort}.`,
    );
  }

  await app.listen(availablePort);

  const protocolo =
    httpsEnabled && httpsKeyPath && httpsCertPath ? 'https' : 'http';
  console.log(`Servidor iniciado em ${protocolo}://localhost:${availablePort}`);
}

void bootstrap();
