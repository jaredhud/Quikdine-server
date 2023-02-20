import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import sgMail from "@sendgrid/mail";
import fetch from "node-fetch";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { db } from "../../firebase.js";

myConfig.config();
const router = Router();

router.post("/sendmail", async (req, res) => {
  debug("in mailer fetch route", req.body);
  const eventId = req.body.eventId;
  try {
    // retrieve event info
    const eventdb = await getDoc(doc(db, "Events", eventId));

    const emailaddresses = eventdb.data().Emails;
    const userIds = eventdb.data().UserIds;

    // send emails
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    for (const i in emailaddresses) {
      console.log("to: ", emailaddresses[i]);
      console.log(
        `http://localhost:3000/vote?userId=${userIds[i]}&eventId=${eventId}`
      );
      // const msg = {
      //   to: `${emailaddresses[i]}`,
      //   from: "kshitija.0811@gmail.com",
      //   subject: "QuikDine Event",
      //   text: `http://localhost:3000/?userId=${userIds[i]}&eventId=${eventId}`,
      //   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      // };
      // sgMail.send(msg);
    }

    // create new Event
    const newEventdb = await addDoc(collection(db, "Events"), {
      AddedRecipes: [],
      VotesCount: [],
      UserVoteIndex: [-1],
      UserIds: [userIds[0]],
      Emails: [emailaddresses[0]],
    });
    const newEventId = newEventdb.id;

    //add event to host user
    await updateDoc(doc(db, "Users", emailaddresses[0]), {
      Events: arrayUnion(newEventId),
    });

    const inviteUserIds = [userIds[0]];
    const recipients = [emailaddresses[0]];

    res.send({
      msg: "E-MAILS SENT",
      newEventId,
      recipients,
      inviteUserIds,
    });
    console.log("sent");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

export default router;
