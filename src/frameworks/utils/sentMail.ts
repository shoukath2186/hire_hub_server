
import Nodemailer from "../../usecase/interfaces/users/inNodemailer";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

class sendOtp implements Nodemailer {
  private _transporter: nodemailer.Transporter;
  constructor() {
    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shoukathot77@gmail.com",
        pass: process.env.MAILER,
      },
    });
  }

  sendMail(email: string, otp: number): void {
    const mailOptions: nodemailer.SendMailOptions = {
      from: "shoukathot77@gmail.com",
      to: email,
      subject: "HireHub email verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">Thank you for registering with HireHub. To complete your registration, please use the verification code below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; color: #333; font-weight: bold; border: 1px solid #ccc; padding: 10px 20px; border-radius: 5px; background-color: #f9f9f9;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 16px; color: #333;">If you did not request this code, please ignore this email.</p>
          <p style="font-size: 16px; color: #333;">Thank you,<br/>HireHub Team</p>
        </div>
      `,
    };

    this._transporter.sendMail(mailOptions, (err: Error| null) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Verification code sent successfully");
      }
    });
  }
}

export default sendOtp;