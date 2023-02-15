import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import fetch from "node-fetch";

myConfig.config();
const router = Router();

router.post("/searchFirebase", async (req, res) => {
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