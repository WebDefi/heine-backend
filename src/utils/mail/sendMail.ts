import { transporter } from "./mailUtils";
const sendMail = async (
  email: string,
  phone?: string,
  name?: string,
  message?: string,
  country?: string,
  speciality?: string
) => {
  transporter.sendMail({
    from: "site@vivatec.com.ua",
    to: "office@medigran.com",
    subject: `From heine.com about: ${email} customer`,
    text: `Customer email: ${email}
    ${phone ? `Customer left phone: ${phone}` : ""}
    ${name ? `Customer left name: ${name}` : ""}
    ${message ? `Customer left message: ${message}` : ""}
    ${country ? `Customer left country: ${country}` : ""}
    ${speciality ? `Customer left speciality: ${speciality}` : ""}`,
  });
};

export { sendMail };
