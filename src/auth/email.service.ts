import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT ?? 587),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async enviarCodigoAutenticacao(
    destinatario: string,
    nome: string,
    codigo: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM ?? process.env.MAIL_USER,
        to: destinatario,
        subject: 'Código de autenticação do SCED',
        text: [
          `Olá, ${nome}.`,
          '',
          `Seu código de autenticação é: ${codigo}`,
          '',
          'O código expira em 5 minutos.',
          'Caso você não tenha solicitado este acesso, ignore este e-mail.',
        ].join('\n'),
        html: `
          <h2>Autenticação do SCED</h2>
          <p>Olá, ${nome}.</p>
          <p>Seu código de autenticação é:</p>
          <h1>${codigo}</h1>
          <p>O código expira em 5 minutos.</p>
          <p>Caso você não tenha solicitado este acesso, ignore este e-mail.</p>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);

      throw new InternalServerErrorException(
        'Não foi possível enviar o código de autenticação.',
      );
    }
  }
}