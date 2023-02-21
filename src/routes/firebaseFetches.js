import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import { auth, db } from "../../firebase.js";
import fetch from "node-fetch";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

myConfig.config();
const router = Router();

router.post("/login", async (req, res) => {
  debug("in Firebase login route", req.body);
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

    // set favorites from stored user data
    const favoritesList = userdb.data().FavRecipes;

    // retrieve event info
    const eventdb = await getDoc(doc(db, "Events", eventId));

    // set recipe list from saved event data
    const selectedRecipesList = eventdb.data()?.AddedRecipes || [];
    console.log(selectedRecipesList);
    // set invited users from saved event data
    const inviteUserIds = eventdb.data().UserIds;

    // set recipients from saved event data
    const recipients = eventdb.data().Emails;

    res.status(200).send({
      msg: "Logged In",
      eventId,
      email,
      pantryList,
      selectedRecipesList,
      recipients,
      inviteUserIds,
      favoritesList,
    });
    console.log("Successfully logged in");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/register", async (req, res) => {
  debug("in Firebase registration route", req.body);
  const submittedEmail = req.body.email;
  const password = req.body.password;
  const pantryList = req.body.pantryList;
  const selectedRecipesList = req.body.selectedRecipesList;
  try {
    const data = await createUserWithEmailAndPassword(
      auth,
      submittedEmail,
      password
    );

    let userId = Math.floor(Math.random() * Math.random() * Date.now());
    console.log(userId);

    const email = data.user.email;

    const userdb = await getDoc(doc(db, "Users", email));
    if (userdb.exists()) {
      userId = userdb.data().UserId;
    }

    await setDoc(doc(db, "Users", email), {
      Events: [],
      FavRecipes: [],
      UserId: userId,
      Pantry: pantryList,
    });

    const eventdb = await addDoc(collection(db, "Events"), {
      AddedRecipes: selectedRecipesList,
      VotesCount: new Array(selectedRecipesList.length).fill(0),
      UserVoteIndex: [-1],
      UserIds: [userId],
      Emails: [email],
    });
    const eventId = eventdb.id;

    await updateDoc(doc(db, "Users", email), {
      Events: arrayUnion(eventId),
    });

    const inviteUserIds = [userId];
    const recipients = [email];

    res
      .status(200)
      .send({ msg: "Success!", email, eventId, inviteUserIds, recipients });
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/addPantry", async (req, res) => {
  debug("in Firebase pantry update route", req.body);
  const email = req.body.email;
  const pantryList = req.body.pantryList;
  try {
    updateDoc(doc(db, "Users", email), {
      Pantry: pantryList,
    });
    res.status(200).send({ msg: "Pantry Updated" });
    console.log("Pantry Updated");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/addFavorites", async (req, res) => {
  debug("in Firebase favorites update route", req.body);
  const email = req.body.email;
  const favoritesList = req.body.favoritesList;
  try {
    updateDoc(doc(db, "Users", email), {
      FavRecipes: favoritesList,
    });
    res.status(200).send({ msg: "Favorites Updated" });
    console.log("Favorites Updated");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/addRecipe", async (req, res) => {
  debug("in Firebase addRecipe route", req.body);
  const selectedRecipesList = req.body.selectedRecipesList;
  const eventId = req.body.eventId;
  console.log(selectedRecipesList);

  try {
    updateDoc(doc(db, "Events", eventId), {
      AddedRecipes: selectedRecipesList,
      VotesCount: new Array(selectedRecipesList.length).fill(0),
    });
    res.status(200).send({
      msg: `Added Recipe: ${
        selectedRecipesList[selectedRecipesList.length - 1]
      }`,
    });
    console.log("Recipes linked to event");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/getEvents", async (req, res) => {
  debug("in get events fetch route", req.body);
  const email = req.body.email;
  try {
    const userdb = await getDoc(doc(db, "Users", email));
    const eventList = userdb.data().Events;
    eventList.reverse();

    res.status(200).send({ msg: "Received Events List", eventList });
    console.log("Sent Events List");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});
router.post("/getEvent", async (req, res) => {
  debug("in get event fetch route", req.body);
  const eventId = req.body.eventToView;
  try {
    const eventdb = await getDoc(doc(db, "Events", eventId));
    const votes = eventdb.data().VotesCount;
    const recipes = eventdb.data().AddedRecipes;
    const participants = eventdb.data().Emails;
    const userIds = eventdb.data().UserIds;
    const userVoteIndex = eventdb.data().UserVoteIndex;

    res.status(200).send({
      msg: "Received Events List",
      votes,
      recipes,
      participants,
      userIds,
      userVoteIndex,
    });
    console.log("Sent Events List");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/addRecipients", async (req, res) => {
  debug("in Firebase add recipient route", req.body);
  const recipients = req.body.recipients;
  const eventId = req.body.eventId;
  const inviteUserIds = req.body.inviteUserIds;
  try {
    //a recipient has been removed
    if (recipients.length === inviteUserIds.length) {
      updateDoc(doc(db, "Events", eventId), {
        Emails: recipients,
        UserIds: inviteUserIds,
        UserVoteIndex: new Array(recipients.length).fill(-1),
      });
    }
    // a recipient has been added
    else {
      const userdb = await getDoc(
        doc(db, "Users", recipients[recipients.length - 1])
      );
      // pull existing user's id
      if (userdb.exists()) {
        inviteUserIds.push(userdb.data().UserId);
      }
      // add new user attached to email
      else {
        const newUserId = Math.floor(
          Math.random() * Math.random() * Date.now()
        );

        await setDoc(doc(db, "Users", recipients[recipients.length - 1]), {
          Events: [],
          FavRecipes: [],
          UserId: newUserId,
          Pantry: [],
        });
        inviteUserIds.push(newUserId);
      }

      updateDoc(doc(db, "Events", eventId), {
        Emails: recipients,
        UserIds: inviteUserIds,
        UserVoteIndex: new Array(recipients.length).fill(-1),
      });
    }

    res.status(200).send({ msg: "Updated Recipients", inviteUserIds });
    console.log(`Updated recipients of ${eventId}`);
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/vote", async (req, res) => {
  debug("in Firebase vote update route", req.body);
  const userVoteIndex = req.body.userVoteIndex;
  const eventId = req.body.eventId;
  const votesCount = req.body.votesCount;
  try {
    updateDoc(doc(db, "Events", eventId), {
      VotesCount: votesCount,
      UserVoteIndex: userVoteIndex,
    });
    res.status(200).send({ msg: "Vote recorded" });
    console.log("Vote log updated");
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

export default router;
