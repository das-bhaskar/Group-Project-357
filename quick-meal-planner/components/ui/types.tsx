export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  cost: number;
};

export type Recipe = {
  id: number;
  name: string;
  cuisine: string;
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  image: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
};

export type RecipesApiResponse = {
  recipes: Recipe[];
};

export interface LoginScreenProps {
  onLoginSuccess: (isLoggedIn: boolean, userToken: string) => void;
}

export interface AppProps {
  // Add other props if needed
}

