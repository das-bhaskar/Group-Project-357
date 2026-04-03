import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Recipe } from "./types";

type RecipeContextType = {
  weeklyRecipes: (Recipe | null)[];
  addRecipe: (recipe: Recipe, dayIndex?: number) => void;
  removeRecipeFromSchedule: (dayIndex: number) => void;
};

const RecipeContext = createContext<RecipeContextType | null>(null);

type RecipeProviderProps = {
  children: ReactNode;
};

// Fixed the array length to match your 7-day schedule
export const RecipeProvider = ({ children }: RecipeProviderProps) => {
  const [weeklyRecipes, setWeeklyRecipes] = useState<(Recipe | null)[]>([
    null, null, null, null, null, null, null // 7 days: Sat-Sun-Mon-Tue-Wed-Thu-Fri
  ]);

  // Add new recipe to weekly schedule at specific day or first available slot
  const addRecipe = (recipe: Recipe, dayIndex?: number) => {
    setWeeklyRecipes(prev => {
      const updated = [...prev];
      
      if (dayIndex !== undefined && dayIndex >= 0 && dayIndex < 7) {
        // Replace specific day if it's empty or overwrite existing
        updated[dayIndex] = recipe;
      } else {
        // Find first available slot (null position)
        const firstEmptyIndex = updated.findIndex(recipe => recipe === null);
        if (firstEmptyIndex !== -1) {
          updated[firstEmptyIndex] = recipe;
        } else {
          // If no empty slots, replace the first one (or handle as needed)
          updated[0] = recipe;
        }
      }
      
      return updated;
    });
  };

  // Debug log
  useEffect(() => {
    console.log("Weekly recipes updated:", weeklyRecipes.map((r, i) => ({
      day: i,
      recipe: r?.name || 'EMPTY'
    })));
  }, [weeklyRecipes]);

  const removeRecipeFromSchedule = (dayIndex: number) => {
    setWeeklyRecipes((prev) => {
      const updated = [...prev];
      updated[dayIndex] = null;
      return updated;
    });
  };

  return (
    <RecipeContext.Provider value={{ 
      weeklyRecipes, 
      addRecipe, 
      removeRecipeFromSchedule 
    }}>
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