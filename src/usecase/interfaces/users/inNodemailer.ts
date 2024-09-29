export interface ForgetPass {
    sendMail(email: string, token: string): void;
  }


interface Nodemailer{
    sendMail(email:string,otp:number):void
}
export default Nodemailer