import jwt from "jsonwebtoken";
import { EventEmitter } from "events";
import { sendEmail } from "../service/sendEmails.js";

export const eventEmitter = new EventEmitter();


eventEmitter.on("sendEmail", async (data) => {
    const { email } = data;

    // sending confirmation email
    const token = jwt.sign({ email }, process.env.SIGNATURE_CONFIRMATION);
    const link = `http://localhost:3000/users/confirmEmail/${token}`;


    await sendEmail(email, "Confirmation Email", `<a href='${link}' >Confirm me</a>`);
});