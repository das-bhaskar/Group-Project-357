import { Recipe } from "@/components/ui/types";

type GroupedRecipes = Record<string, Recipe[]>;

const groupByCuisine = (recipes: Recipe[]): GroupedRecipes => {
  return recipes.reduce((acc: GroupedRecipes, recipe) => {
    if (!acc[recipe.cuisine]) {
      acc[recipe.cuisine] = [];
    }
    acc[recipe.cuisine].push(recipe);
    return acc;
  }, {});
};

export default groupByCuisine;