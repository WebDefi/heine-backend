import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "mail.vivatec.com.ua",
  port: 465,
  auth: {
    user: "site@vivatec.com.ua",
    pass: "sjdjpqK3rihjfd92",
  },
});

export { transporter };
