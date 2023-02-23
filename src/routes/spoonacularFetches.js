import { Router } from "express";
import { debug } from "../server.js";
import myConfig from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

import {
  recipesSearch,
  bulkRecipes,
  recipeResult,
  emptyPantry,
  beefNcheese,
  pg1CheeseBeefSalmonTomato,
  pg2CheeseBeefSalmonTomato,
  pg3CheeseBeefSalmonTomato,
  mainCourseCheeseSalmon,
  individualFetaBurger,
  listFetaSalmonSalmonNoodlesFetaBurgers,
  listMeatballSlidersFetaSalmonSalmonPasta,
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
    if (
      fetchString ===
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=332d07c641fd4c11af3cf76f666e3666&sort=max-used-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true&offset=0&number=10"
    ) {
      // empty pantry
      res.send(emptyPantry);
    } else if (
      fetchString ===
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=332d07c641fd4c11af3cf76f666e3666&includeIngredients=cheese,beef&sort=max-used-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true&offset=0&number=10"
    ) {
      // ground beef and cheese
      res.send(beefNcheese);
    } else if (
      fetchString ===
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=332d07c641fd4c11af3cf76f666e3666&includeIngredients=cheese,beef,salmon,tomato&sort=max-used-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true&offset=0&number=10"
    ) {
      // page 1 cheese, beef, salmon, and tomato
      res.send(pg1CheeseBeefSalmonTomato);
    } else if (
      fetchString ===
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=332d07c641fd4c11af3cf76f666e3666&includeIngredients=cheese,beef,salmon,tomato&sort=max-used-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true&offset=10&number=10"
    ) {
      // page 2 cheese, beef, salmon, and tomato
      res.send(pg2CheeseBeefSalmonTomato);
    } else if (
      fetchString ===
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=332d07c641fd4c11af3cf76f666e3666&includeIngredients=cheese,beef,salmon,tomato&sort=max-used-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true&offset=20&number=10"
    ) {
      // page 3 cheese, beef, salmon, and tomato
      res.send(pg3CheeseBeefSalmonTomato);
    } else if (
      fetchString ===
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=332d07c641fd4c11af3cf76f666e3666&includeIngredients=cheese,salmon&sort=max-used-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true&type=main%20course&offset=0&number=10"
    ) {
      // Advanced Search: Cheese Salmon Main Course
      res.send(mainCourseCheeseSalmon);
    } else {
      const response = await fetch(fetchString);
      const recipes = await response.json();
      res.send(recipes);

      // res.send(recipesSearch);
    }
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

//pull up individual recipe
router.post("/recipe", async (req, res) => {
  debug("in recipe fetch route", req.body);
  const id = req.body.id;
  try {
    const fetchString = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${spoonAPIKey}`;
    console.log(fetchString);

    if (
      fetchString ===
      "https://api.spoonacular.com/recipes/642695/information?apiKey=332d07c641fd4c11af3cf76f666e3666"
    ) {
      res.send(individualFetaBurger);
    } else if (
      fetchString ===
      "https://api.spoonacular.com/recipes/651341/information?apiKey=332d07c641fd4c11af3cf76f666e3666"
    ) {
      res.send(recipeResult);
    } else {
      const response = await fetch(fetchString);
      const recipe = await response.json();
      res.send(recipe);
    }
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

    if (
      fetchString ===
      "https://api.spoonacular.com/recipes/informationBulk?apiKey=332d07c641fd4c11af3cf76f666e3666&ids=642619,660370,642695"
    ) {
      res.send(listFetaSalmonSalmonNoodlesFetaBurgers);
    } else if (
      fetchString ===
      "https://api.spoonacular.com/recipes/informationBulk?apiKey=332d07c641fd4c11af3cf76f666e3666&ids=651341,642619,660382"
    ) {
      res.send(listMeatballSlidersFetaSalmonSalmonPasta);
    } else {
      const response = await fetch(fetchString);
      const recipe = await response.json();
      res.send(recipe);
    }
  } catch (error) {
    debug(error);
    res.status(500).send(error);
  }
});

//how to grab results
// const response = await fetch(fetchString);
// const recipe = await response.json();
// let recipe2 = JSON.stringify(recipe);
// fs.writeFile("beef_cheese_salmon_tomato_pg3.txt", recipe2, function (err) {
//   if (err) {
//     console.log(err);
//   }
// });
// res.send(recipe)
export default router;
