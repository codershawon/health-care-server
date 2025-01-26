import nodemailer from "nodemailer";
import config from "../../../config";

export const emailSender=async(email: string, p0: string, html: string)=>{
    
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
        rejectUnauthorized: false
    }
  });
  
    const info = await transporter.sendMail({
      from: '"Health Care" <shawonb500@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Reset Password Link", // Subject line
    //   text: "Hello world?", // plain text body
      html,
    });
  
    console.log("Message sent: %s", info.messageId);
}
