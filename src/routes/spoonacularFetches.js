import { Router } from "express";
import { debug } from "../server.js";
import fetch from "node-fetch";

const router = Router();

router.post("/search", async (req, res) => {
  const seasonReq = req.body.timeFilters;
  const weights = req.body.weights;
  const crimeReq = req.body.crimeFilters;
  debug("in fetch route", req.body);

  let months = [];
  for (const i in seasonReq) {
    //season switch
    switch (seasonReq[i]) {
      case "winter":
        months = months.concat(['"DEC"', '"JAN"', '"FEB"']);
        break;
      case "spring":
        months = months.concat(['"MAR"', '"APR"', '"MAY"']);
        break;
      case "summer":
        months = months.concat(['"JUN"', '"JUL"', '"AUG"']);
        break;
      case "fall":
        months = months.concat(['"SEP"', '"OCT"', '"NOV"']);
        break;
      default:
        if (months.length === 0) {
          months = months.concat([
            '"DEC"',
            '"JAN"',
            '"FEB"',
            '"MAR"',
            '"APR"',
            '"MAY"',
            '"JUN"',
            '"JUL"',
            '"AUG"',
            '"SEP"',
            '"OCT"',
            '"NOV"',
          ]);
        }
    }
  }
  months[0] = `month=${months[0]}`;
  const timeString = months.join(" OR month=");
  let crimes = [];
  for (const i in weights) {
    if (weights[i] > 0) {
      switch (i) {
        case "assault":
          crimes.push('"Assault (Non-domestic)"');
          break;
        case "bneStore":
          crimes.push('"Break %26 Enter - Commercial"');
          break;
        case "bneHome":
          crimes.push('"Break %26 Enter - Dwelling"');
          break;
        case "bneOther":
          crimes.push('"Break %26 Enter - Other Premises"');
          break;
        case "robStore":
          crimes.push('"Commercial Robbery"');
          break;
        case "robStreet":
          crimes.push('"Street Robbery"');
          break;
        case "robFromCar":
          crimes.push('"Theft FROM Vehicle"');
          break;
        case "robOfCar":
          crimes.push('"Theft OF Vehicle"');
          break;
        case "violence":
          crimes.push('"Violence Other (Non-domestic)"');
          break;
      }
    }
  }
  crimes[0] = `category=${crimes[0]}`;
  crimes = crimes.join(" OR category=");
  const noGoodTerribleString = `(${crimes}) AND (${timeString})`;
  // console.log(noGoodTerribleString);
  try {
    // fetch request with SoQL query based on outcome of switch statement
    const response = await fetch(
      `https://data.calgary.ca/resource/78gh-n26t.json?$WHERE=${noGoodTerribleString} limit 100000`
    );
    const rawData = await response.json();
    // console.log(rawData);
    const mapResult = await applyMath(rawData, weights, true);
    // console.log(mapResult);
    res.send(mapResult);
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

router.post("/recipe", async (req, res) => {
  const seasonReq = req.body.timeFilters;
  const weights = req.body.weights;
  const crimeReq = req.body.crimeFilters;
  debug("in fetch route", req.body);

  let months = [];
  for (const i in seasonReq) {
    //season switch
    switch (seasonReq[i]) {
      case "winter":
        months = months.concat(['"DEC"', '"JAN"', '"FEB"']);
        break;
      case "spring":
        months = months.concat(['"MAR"', '"APR"', '"MAY"']);
        break;
      case "summer":
        months = months.concat(['"JUN"', '"JUL"', '"AUG"']);
        break;
      case "fall":
        months = months.concat(['"SEP"', '"OCT"', '"NOV"']);
        break;
      default:
        if (months.length === 0) {
          months = months.concat([
            '"DEC"',
            '"JAN"',
            '"FEB"',
            '"MAR"',
            '"APR"',
            '"MAY"',
            '"JUN"',
            '"JUL"',
            '"AUG"',
            '"SEP"',
            '"OCT"',
            '"NOV"',
          ]);
        }
    }
  }
  months[0] = `month=${months[0]}`;
  const timeString = months.join(" OR month=");
  let crimes = [];
  for (const i in weights) {
    if (weights[i] > 0) {
      switch (i) {
        case "assault":
          crimes.push('"Assault (Non-domestic)"');
          break;
        case "bneStore":
          crimes.push('"Break %26 Enter - Commercial"');
          break;
        case "bneHome":
          crimes.push('"Break %26 Enter - Dwelling"');
          break;
        case "bneOther":
          crimes.push('"Break %26 Enter - Other Premises"');
          break;
        case "robStore":
          crimes.push('"Commercial Robbery"');
          break;
        case "robStreet":
          crimes.push('"Street Robbery"');
          break;
        case "robFromCar":
          crimes.push('"Theft FROM Vehicle"');
          break;
        case "robOfCar":
          crimes.push('"Theft OF Vehicle"');
          break;
        case "violence":
          crimes.push('"Violence Other (Non-domestic)"');
          break;
      }
    }
  }
  crimes[0] = `category=${crimes[0]}`;
  crimes = crimes.join(" OR category=");
  const noGoodTerribleString = `(${crimes}) AND (${timeString})`;
  // console.log(noGoodTerribleString);
  try {
    // fetch request with SoQL query based on outcome of switch statement
    const response = await fetch(
      `https://data.calgary.ca/resource/78gh-n26t.json?$WHERE=${noGoodTerribleString} limit 100000`
    );
    const rawData = await response.json();
    // console.log(rawData);
    const mapResult = await applyMath(rawData, weights, true);
    // console.log(mapResult);
    res.send(mapResult);
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});
export default router;
