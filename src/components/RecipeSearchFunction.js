const spoonAPIKey = "332d07c641fd4c11af3cf76f666e3666";

export async function pantryRecipeSearch(searchCriteria, page, resultsPerPage) {
  console.log("searchCriteria: ", searchCriteria);
  const query = searchCriteria.query;
  const ingredients = searchCriteria.ingredients;
  const mealType = searchCriteria.mealType;
  const cuisine = searchCriteria.cuisine;
  const diet = searchCriteria.diet;
  let ingredientString = ``;
  let typeString = ``;
  let cuisineString = ``;
  let queryString = ``;
  let dietString = ``;
  if (query.length > 0) {
    queryString = `&query=${query.toLowerCase().replace(/ /g, "%20")}`;
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
  const fetchString = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonAPIKey}${queryString}${ingredientString}&sort=max-used-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true${typeString}${cuisineString}${dietString}&offset=${offset}&number=${resultsPerPage}`;
  console.log(fetchString);
  const response = await fetch(fetchString);
  const recipes = await response.json();
  return recipes;
}
export async function idRecipeSearch(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${spoonAPIKey}`
  );
  const recipe = await response.json();
  return recipe;
}
// https://api.spoonacular.com/recipes/complexSearch?apiKey=332d07c641fd4c11af3cf76f666e3666&query=&includeIngredients=flour,beef,egg%20whites&sort=min-missing-ingredients&addRecipeInformation=true&addRecipeNutrition=false&fillIngredients=true&type=main%20course&excludeIngredients=&number=1
// &sortDirection=asc  desc
