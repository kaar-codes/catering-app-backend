import { config } from "dotenv";
config({ path: ".env" });
import { createClient } from "redis";
import otpGen from "otp-generator";
import nodemailer from "nodemailer";

const redisClient = createClient({
  port: process.env.REDIS_PORT,
});

const transporter = nodemailer.createTransport({
  service: "Ethereal",
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASSWORD,
  },
});

redisClient
  .on("error", () => console.log("REDIS CONNECTION FAILED💥"))
  .connect();

export async function sendMailWithOTP() {
  const otpOptions = {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: true,
    digits: true,
    specialChars: false,
  };
  const otp = otpGen.generate(8, otpOptions);
  await redisClient.set("OTP", otp, { EX: process.env.REDIS_KEY_EXPIRY });

  const mail = await transporter.sendMail({
    from: `TEST ACCOUNT <${process.env.ETHEREAL_USER}>`,
    to: "testrecipient@example.com",
    subject: "Hello from Ethereal!",
    text: "This message was sent using Ethereal.",
    html: `
          <p>HERE IS YOUR OTP FOR PASSWORD CHANGE.</p>
          <h1>${otp}</h1>
          `,
  });
  console.log(nodemailer.getTestMessageUrl(mail));

  return otp;
}
