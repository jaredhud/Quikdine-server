import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

import {
  recipesSearch,
  bulkRecipes,
  recipeResult,
} from "../../placeholderRecipes.js";

myConfig.config();
const router = Router();
const spoonAPIKey = process.env.SPOONACULAR_API_KEY;

//pull up array of recipes
router.post("/search", async (req, res) => {
  debug("in search recipes fetch route", req.body);

  const searchQuery = req.body.searchQuery;
  const ingredients = req.body.ingredientList;
  const mealType = req.body.mealType;
  const cuisine = req.body.cuisine;
  const diet = req.body.diet;
  const page = req.body.page;
  const resultsPerPage = req.body.resultsPerPage;

  let ingredientString = ``;
  let typeString = ``;
  let cuisineString = ``;
  let searchQueryString = ``;
  let dietString = ``;

  if (searchQuery.length > 0) {
    searchQueryString = `&query=${searchQuery
      .toLowerCase()
      .replace(/ /g, "%20")}`;
  }
  if (ingredients.length > 0) {
    ingredientString = `&includeIngredients=${ingredients
      .join()
      .toLowerCase()
      .replace(/ /g, "%20")}`;
  }
  if (mealType.length > 0) {
    typeString = `&type=${mealType.replace(/ /g, "%20")}`;
  }
  if (cuisine.length > 0) {
    cuisineString = `&cuisine=${cuisine.replace(/ /g, "%20")}`;
  }
  if (diet.length > 0) {
    dietString = `&diet=${diet.replace(/ /g, "%20")}`;
  }
  const offset = (page - 1) * resultsPerPage;

  const fetchString = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonAPIKey}${searchQueryString}${ingredientString}&sort=max-used-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true${typeString}${cuisineString}${dietString}&offset=${offset}&number=${resultsPerPage}`;

  try {
    // fetch request with SoQL query based on outcome of switch statement
    console.log(fetchString);
    // const response = await fetch(fetchString);
    // const recipes = await response.json();
    // res.send(recipes);

    res.send(recipesSearch);
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

//pull up individual recipe
router.post("/recipe", async (req, res) => {
  console.log("f");
  debug("in recipe fetch route", req.body);
  const id = req.body.id;
  try {
    const fetchString = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${spoonAPIKey}`;
    console.log(fetchString);
    console.log("vjsg");
    // const response = await fetch(fetchString);
    // const recipe = await response.json();
    // res.send(recipe);

    res.send(recipeResult);
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

//
router.post("/recipebulk", async (req, res) => {
  debug("in bulk recipe fetch route", req.body);
  const ids = req.body.selectedRecipesList;
  let idsString = `&ids=${ids.join()}`;
  console.log(idsString);
  try {
    const fetchString = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${spoonAPIKey}${idsString}`;
    console.log(fetchString);
    // const response = await fetch(fetchString);
    // const recipe = await response.json();
    // res.send(recipe);

    res.send(bulkRecipes);
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

export default router;
