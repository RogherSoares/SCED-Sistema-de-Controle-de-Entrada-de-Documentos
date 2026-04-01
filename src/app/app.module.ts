import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { DocumentosModule } from '../documentos/documentos.module';
import { HistoricoModule } from '../historico/historico.module';
import { StatusDocumentosModule } from '../status-documentos/status-documentos.module';
import { TiposDocumentosModule } from '../tipos-documentos/tipos-documentos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5433),
      username: process.env.DB_USER ?? 'postgres',
      database: process.env.DB_NAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '147852369',
      ssl:
        process.env.DB_SSL === 'true'
          ? {
              rejectUnauthorized:
                process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            }
          : false,
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsuariosModule,
    TiposDocumentosModule,
    StatusDocumentosModule,
    DocumentosModule,
    HistoricoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
