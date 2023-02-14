import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import fetch from "node-fetch";


myConfig.config();
const router = Router();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

const sgMail = require('@sendgrid/mail');


router.post("/recepients", async (req, res) => {
    debug("in recepients fetch route", req.body);
    const userId = req.body.ids;
    const recepients = req.body.recepients
const eventID=req.body.eventID
      try {
        
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: `${recepients[i]}`,
  from: 'test@example.com',
  subject: "QuikDine Event",
  text: `http://localhost:3000/?userId=${userId[i]}&eventId=${eventID}`,
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);

      res.send("E-MAILS SENT");
    } catch (error) {
      debug(error);
      res.status(500).send(error);
    }
  });
  