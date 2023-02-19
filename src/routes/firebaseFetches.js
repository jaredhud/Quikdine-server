import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import { auth, db } from "../../firebase.js";
import fetch from "node-fetch";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore/lite";

myConfig.config();
const router = Router();

router.post("/login", async (req, res) => {
  debug("in Firebase fetch route", req.body);
  const submittedEmail = req.body.email;
  const password = req.body.password;
  try {
    const data = await signInWithEmailAndPassword(
      auth,
      submittedEmail,
      password
    );
    const email = data.user.email;

    // retrieve user info
    const userdb = await getDoc(doc(db, "Users", email));

    // set event to last in User's hosted event array
    const eventId = userdb.data().Events[userdb.data().Events.length - 1];

    // set pantry from stored user data
    const pantryList = userdb.data().Pantry;

    // retrieve event info
    const eventdb = await getDoc(doc(db, "Events", eventId));

    // set recipe list from saved event data
    const selectedRecipesList = eventdb.data().AddedRecipes;

    // set invited users from saved event data
    const inviteUserIds = eventdb.data().UserIds;

    // set recipients from saved event data
    const recipients = eventdb.data().Emails;

    res.send({
      msg: "Logged In",
      eventId,
      email,
      pantryList,
      selectedRecipesList,
      recipients,
      inviteUserIds,
    });
    console.log("Successfully logged in");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/register", async (req, res) => {
  debug("in Firebase fetch route", req.body);
  const userId = req.body.userIds;
  const eventID = req.body.eventID;
  try {
    res.send({ msg: "Added Recipes" });
    console.log("Recipes linked to event");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/addPantry", async (req, res) => {
  debug("in Firebase fetch route", req.body);
  const userId = req.body.userIds;
  const eventID = req.body.eventID;
  try {
    res.send({ msg: "Added Recipes" });
    console.log("Recipes linked to event");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/addRecipe", async (req, res) => {
  debug("in Firebase fetch route", req.body);
  const userId = req.body.userIds;
  const eventID = req.body.eventID;
  try {
    res.send({ msg: "Added Recipes" });
    console.log("Recipes linked to event");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/addEvent", async (req, res) => {
  debug("in Firebase fetch route", req.body);
  const userId = req.body.userIds;
  const eventID = req.body.eventID;
  try {
    res.send({ msg: "Added Recipes" });
    console.log("Recipes linked to event");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/addRecipients", async (req, res) => {
  debug("in Firebase fetch route", req.body);
  const userId = req.body.userIds;
  const eventID = req.body.eventID;
  try {
    res.send({ msg: "Added Recipes" });
    console.log("Recipes linked to event");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

export default router;
