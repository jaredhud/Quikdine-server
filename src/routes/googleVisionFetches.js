import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import fetch from "node-fetch";

myConfig.config();
const router = Router();
const visionAPIKey = process.env.GOOGLEVISION_API_KEY;

router.post("/", async (req, res) => {
  debug("in vision fetch route", req.body);
  const visionRequest = req.body.visionRequest;
  console.log(visionRequest);
  try {
    const fetchString = `https://vision.googleapis.com/v1/images:annotate?key=${visionAPIKey}`;
    const response = await fetch(fetchString, {
      method: "POST",
      body: JSON.stringify(visionRequest),
    });

    const results = await response.json();
    res.send(results);
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});
export default router;
