import { useState, useEffect } from 'react';
import { Recipe } from '@/components/ui/types';

interface RecommendationInput {
  ingredients: string;
}

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recipe | null>(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  // Fetch all recipes from backend
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.0.0.106:8000/recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get recipe recommendation
  const getRecommendation = async (ingredients: string) => {
    try {
      setRecommendationLoading(true);
      const response = await fetch('http://10.0.0.106:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      
      if (!response.ok) {
        throw new Error('Recommendation failed');
      }
      
      const recommendedRecipe = await response.json();
      setRecommendation(recommendedRecipe);
      return recommendedRecipe;
    } catch (error) {
      console.error('Error getting recommendation:', error);
      return null;
    } finally {
      setRecommendationLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return {
    recipes,
    loading,
    recommendation,
    recommendationLoading,
    getRecommendation,
    refetch: fetchRecipes,
  };
};