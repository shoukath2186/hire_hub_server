"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class sendOtp {
    constructor() {
        this._transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "shoukathot77@gmail.com",
                pass: process.env.MAILER,
            },
        });
    }
    sendMail(email, otp) {
        const mailOptions = {
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
        this._transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Verification code sent successfully");
            }
        });
    }
}
exports.default = sendOtp;
