import env from '@/config';
import EmailInterface from '@/interfaces/Email.interface';
import nodemailer from 'nodemailer';
import { getErrorMessage } from './response.collection';

class Mailer {
    private transporter;

    constructor () {
        if(!env?.MAIL_SENDER_REFUND) throw Error(getErrorMessage('missconfiguredService', 'Envio de email [Sender]'));
        if(!env?.MAIL_SENDER_PWD_REFUND) throw Error(getErrorMessage('missconfiguredService', 'Envio de email [SenderP]'));

        this.transporter = nodemailer.createTransport({
            host: "email-ssl.com.br",
            port: 587,
            secure: false,                // true for 465, false for other ports
            auth: {
              user: env.MAIL_SENDER_REFUND,      // generated ethereal user
              pass: env.MAIL_SENDER_PWD_REFUND,  // generated ethereal password
            }, 
        });
    }

    async send (mail: EmailInterface) {
      const result = await this.transporter.sendMail(mail);

      console.log({result});
    }
}

export default new Mailer;