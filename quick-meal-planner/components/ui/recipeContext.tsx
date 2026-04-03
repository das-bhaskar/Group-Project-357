import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Recipe } from "./types";


type RecipeContextType = {
  weeklyRecipes: (Recipe | null)[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipeFromSchedule: (dayIndex: number) => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

type RecipeProviderProps = {
  children: ReactNode;
};

export const RecipeProvider = ({ children }: RecipeProviderProps) => {
const [weeklyRecipes, setWeeklyRecipes] = useState<(Recipe | null)[]>([]);

  // Add new recipe to weekly schedule
  const addRecipe = (recipe: Recipe) => {
    setWeeklyRecipes(prev => [...prev, recipe])
  };

  // Debug
//   useEffect(() => {
//     console.log("Weekly recipes changed:", weeklyRecipes);
//   }, [weeklyRecipes]);

  const removeRecipeFromSchedule = (dayIndex: number) => {
    setWeeklyRecipes((prev) => {
      const updated = [...prev];
      updated[dayIndex] = null;
      return updated;
    });
  };

  return (
    <RecipeContext.Provider value={{ weeklyRecipes, addRecipe,removeRecipeFromSchedule,}}>
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