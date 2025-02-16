import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromMail = process.env.FROM_MAIL_ADDRESS!;
if (!fromMail) throw new Error('from address not found');

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resend.emails.send({
      from: fromMail,
      to: [to],
      subject,
      html,
    });
    console.log(response);
  } catch (error) {
    console.log(error);

    throw error;
  }
};
