import nodemailer from 'nodemailer';

const options = {
  host: String(process.env.NODEMAILER_HOST),
  port:  Number(process.env.NODEMAILER_PORT) || 2525,
  secure: true, // use SSL
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
};

let transport = nodemailer.createTransport(options);

export default transport;
