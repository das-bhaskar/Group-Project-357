export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  cuisine: string;
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
};

export type RecipeResponse = {
  recipes: Recipe[];
};