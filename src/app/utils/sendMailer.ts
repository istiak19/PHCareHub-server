import nodemailer from 'nodemailer'
import config from '../../config';

const sendMailer = async (email: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: config.emailSender.SMTP_USER,
            pass: config.emailSender.SMTP_PASS, // app password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"PH Health Care" <istiakahamed219@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Password Link", // Subject line
        //text: "Hello world?", // plain text body
        html, // html body
    });
};

export default sendMailer;