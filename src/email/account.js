import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


const sendWelcomeEmail = async(email) => {
  
    console.log(email)
   
   // create reusable transporter object using the default SMTP transport
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USEREMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: "LegacyKennels.org" ,
    to: `${email}`,
    subject: 'You have Created an account',
    text: `Welcome to Legacy Kennels. Let me know how you get along with the app.`
  };
// send mail with defined transport object
  transporter.sendMail(mailOptions , (err ,data)=>{
      if(err){
        console.log(err);
      }else{

          console.log('Email sent: ' + data.response);
      }
  })
 
}


const sendCancellationEmail = async(email) => {
  
    console.log(email)
   
   // create reusable transporter object using the default SMTP transport
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USEREMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: "LegacyKennels.org" ,
    to: `${email}`,
    subject: 'Your Account has been Deleted',
    text: `we would like to know why you feel enclined to delete your account`
  };
// send mail with defined transport object
  transporter.sendMail(mailOptions , (err ,data)=>{
      if(err){
        console.log(err);
      }else{

          console.log('Email sent: ' + data.response);
      }
  })
 
}


export {
    sendWelcomeEmail,
    sendCancellationEmail
}