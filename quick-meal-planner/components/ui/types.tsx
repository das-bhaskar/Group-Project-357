import { createContext, useContext, useEffect, useState } from "react";

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
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
};

export type RecipeResponse = {
  recipes: Recipe[];
};

export interface LoginScreenProps {
  onLoginSuccess: (isLoggedIn: boolean, userToken: string) => void;
}

export interface AppProps {
  // Add other props if needed
}

type RecipeContextType = {
  weeklyRecipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: any) => {
  const [weeklyRecipes, setWeeklyRecipes] = useState<Recipe[]>([]);

  const addRecipe = (recipe: Recipe) => {
    setWeeklyRecipes(prev => [...prev, recipe])
  };

  useEffect(() => {
    console.log("Weekly recipes changed:", weeklyRecipes);
  }, [weeklyRecipes]);

  return (
    <RecipeContext.Provider value={{ weeklyRecipes, addRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipeContext must be used within RecipeProvider");
  }
  return context;
};