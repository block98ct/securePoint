// Import nodemailer module
import  nodemailer from 'nodemailer'
// const baseurl = require('../config').base_url;

import hbs from "nodemailer-express-handlebars";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    // secure: true,
    auth: {
      user: "testing26614@gmail.com",
      pass: "ibxakoguozdwqtav",
    },
  });
  
  const handlebarOptions = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: join(__dirname, '../view/'),
      layoutsDir: join(__dirname, '../view/'),
      defaultLayout: false,
    },
    viewPath: join(__dirname, '../view/'),
    extName: '.handlebars',
  };
  
  transporter.use("compile", hbs(handlebarOptions));


// Define a function named 'mail' to send an email with OTP
export const mail = async function (email, otp, subject, template, imgUrl) {

    // Define email options
    // let mailOptions = {
    //     from: "mkdteamcti@gmail.com", // Sender's email address
    //     to: email, // Recipient's email address
    //     subject: "OTP for verifying user", // Email subject
    //     html: `<p> Your OTP for ${message}: <strong>${otp}</strong></p>`, // Email content with OTP
    // };


    let mailOptions = {
        from: "mkdteamti@gmail.com",
        to: email,
        subject: subject,
        template: template,
        context: {
          otp: otp,
          imgUrl: imgUrl
        },
      };

    // Send email using transporter
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) { // If error occurs while sending email
            console.log("Error " + err); // Log the error
        } else { // If email sent successfully
            console.log("Email sent successfully", info.response); // Log the success message with email response info
        }
    });
};
