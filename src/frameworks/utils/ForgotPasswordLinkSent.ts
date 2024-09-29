import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();
import {ForgetPass} from "../../usecase/interfaces/users/inNodemailer";

class ForgotPasswordLink implements ForgetPass {
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

    sendMail(email: string, token: string): void {
        const mailOptions: nodemailer.SendMailOptions = {
            from: "shoukathot77@gmail.com",
            to: email,
            subject: "Reset password",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
             <h2 style="color: #1b2a6b;">Password Reset Request</h2>
             <p>Hello,</p>
             <p>We received a request to reset your password. Please click the button below to reset your password:</p>
             <a href="http://localhost:5000/reset-password?Id=${token}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #3b82f6; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
             <p style="margin-top: 20px;">If you did not request a password reset, please ignore this email.</p>
             <p>Thank you,<br/>The Team</p>
            </div>
        `,
        };

        this._transporter.sendMail(mailOptions, (err: Error | null) => {
            if (err) {
                console.log(err); 
            } else {
                console.log("Verification code sent successfully");
            }
        });
    }

}

export default ForgotPasswordLink 