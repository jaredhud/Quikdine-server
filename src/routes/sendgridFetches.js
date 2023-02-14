import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import sgMail from "@sendgrid/mail";
import fetch from "node-fetch";

myConfig.config();
const router = Router();

router.post("/recipients", async (req, res) => {
  debug("in recipients fetch route", req.body);
  const userId = req.body.ids;
  const recipients = req.body.recipients;
  const eventID = req.body.eventID;
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    for (const i in recipients) {
      console.log(recipients[i]);
      const msg = {
        to: `${recipients[i]}`,
        from: "test@example.com",
        subject: "QuikDine Event",
        text: `http://localhost:3000/?userId=${userId[i]}&eventId=${eventID}`,
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      };
      sgMail.send(msg);
    }

    res.send({ msg: "E-MAILS SENT" });
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

export default router;
