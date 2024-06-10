import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (data) => {
  const email = { ...data, from: "nazar.dia@gmail.com" };
  await sgMail.send(email);
  return true;
};
