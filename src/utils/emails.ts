// @ts-ignore
import multiReplaceAll from "multi-replaceall";
import nodemailer from "nodemailer";
import { EmailTemplate } from "../entity/EmailTemplate";

type ISendEmail = (arg0: {
  from: string;
  to: string;
  subject: string;
  customId: string;
  replaceArray: Array<{
    substr: string;
    to: string;
  }>;
}) => Promise<boolean>;

export const sendEmail: ISendEmail = async ({
  from,
  to,
  subject,
  customId,
  replaceArray,
}) => {
  try {
    const {
      emailCredentials: { host, port, secure, authUser, authPassword },
      html,
    } = await EmailTemplate.findOneOrFail({
      where: { customId, isActive: true },
      relations: { emailCredentials: true },
    });

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: authUser,
        pass: authPassword,
      },
    });

    const replacedHtml = multiReplaceAll(html, replaceArray) as string;

    const mailResponse = await transporter.sendMail({
      from,
      to,
      subject,
      html: replacedHtml,
    });

    return mailResponse.messageId ? true : false;
  } catch (err) {
    return false;
  }
};
