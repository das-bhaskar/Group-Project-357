import { createContext, useContext, useEffect, useState } from "react";
import { Recipe } from "./types";


type RecipeContextType = {
  weeklyRecipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: any) => {
    
  const [weeklyRecipes, setWeeklyRecipes] = useState<Recipe[]>([]);

  // Add new recipe to weekly schedule
  const addRecipe = (recipe: Recipe) => {
    setWeeklyRecipes(prev => [...prev, recipe])
  };

  // Debug
//   useEffect(() => {
//     console.log("Weekly recipes changed:", weeklyRecipes);
//   }, [weeklyRecipes]);

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