import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.MailHost,
    port: Number(process.env.MailPort),
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.UserMail,
      pass: process.env.UserMailPW,
    },
  }); 


  const  sendVerificationMail = async (email,subject,content)=> {
    // send mail with defined transport object

    try{
        // console.log(process.env.UserMail)
        const info = await transporter.sendMail({
          from: process.env.UserMail,
          to: email, // list of receivers
          subject: subject, // Subject line
          html: content, // html body
        });
      console.log("Message sent: %s", info.messageId);
    }
    catch(error){
        console.log("error in sending email",error.message);
    }
  }
 
  export default sendVerificationMail;