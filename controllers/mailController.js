import { config } from "dotenv";
config({ path: ".env" });
import { createClient } from "redis";
import otpGen from "otp-generator";
import { createTransport, getTestMessageUrl } from "nodemailer";

// Create and Connect to the Redis Client
const redisClient = createClient({
  port: process.env.REDIS_PORT,
});
await redisClient
  .on("error", (err) => {
    console.log("REDIS CONNECTION ERROR:", err.message);
  })
  .connect();

const transporter = createTransport({
  service: "Ethereal",
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASSWORD,
  },
});

export async function sendMailWithOTP(email) {
  try {
    // Options for OTP
    const otpOptions = {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      digits: true,
      specialChars: false,
    };

    // Generate a OTP and Store it in Redis Key Value Store
    const otp = otpGen.generate(8, otpOptions);
    await redisClient.set("OTP", otp, { EX: process.env.REDIS_KEY_EXPIRY });

    // Setup a Transporter Email
    const mail = await transporter.sendMail({
      from: `TEST ACCOUNT <${process.env.ETHEREAL_USER}>`,
      to: email,
      subject: "CATERING QUOTE MANAGEMENT SYSTEM",
      text: "This message was sent using Ethereal.",
      html: `
          <p>HERE IS YOUR OTP FOR PASSWORD CHANGE.</p>
          <h1>${otp}</h1>
          `,
    });

    return {
      messageUrl: getTestMessageUrl(mail),
    };
  } catch (error) {
    throw error;
  }
}

export async function verifySecret({ secret }) {
  const otpFromRedis = await redisClient.get("OTP");

  if (otpFromRedis === null) {
    throw new Error("OTP Expired");
  } else {
    return secret === (await redisClient.get("OTP"));
  }
}

export async function sendMailForUserWithUpdates({
  email,
  status,
  _id: quoteId,
}) {
  const message = new Map([
    ["Cancel", `Quote with an ID: ${quoteId} has been cancelled.`],
    ["Confirm", `Quote with an ID: ${quoteId} has been confirmed.`],
    ["Waiting List", `Quote with an ID: ${quoteId} has moved to Waiting List`],
    ["In Enquiry", `Quote made with an ID of ${quoteId}`],
  ]);
  try {
    // Setup a Transporter Email
    const mail = await transporter.sendMail({
      from: `TEST ACCOUNT <${process.env.ETHEREAL_USER}>`,
      to: email,
      subject: "Hello from Ethereal!",
      text: "This message was sent using Ethereal.",
      html: `
      <h1>You got something</h1>
      <p>
      ${message.get(status)}
      </p>
      `,
    });

    console.log("Message URL: ", getTestMessageUrl(mail));

    return {
      messageUrl: getTestMessageUrl(mail),
    };
  } catch (error) {
    throw error;
  }
}
