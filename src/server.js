import express from "express";
import myConfig from "dotenv";
import DEBUG from "debug";

// import userRouter from "./routes/userRouter.js";
import spoonacularRouter from "./routes/spoonacularFetches.js";
import emailRouter from "./routes/sendgridFetches.js";
import firebaseRouter from "./routes/firebaseFetches.js";
import visionRouter from "./routes/googleVisionFetches.js";

myConfig.config();
export const debug = DEBUG("server:routes");
debug.enabled = true;
const port = process.env.PORT || 5000;
const app = express();

// 1 mebibyte size limit on data
app.use(express.json({ limit: 1048576 }));
app.use(express.static("build"));
app.use("/api/firebase", firebaseRouter);
app.use("/api/spoonacular", spoonacularRouter);
app.use("/api/email", emailRouter);
app.use("/api/googlevision", visionRouter);

app.use("*", (req, res) => {
  res.sendFile(path.resolve("build", "index.html"));
});
app.listen(port, () => console.log(`Server listening on port ${port}!`));
