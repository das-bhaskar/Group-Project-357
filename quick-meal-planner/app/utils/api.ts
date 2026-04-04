import { Recipe } from "@/components/ui/types";

// Change this to your local IP (e.g. 'http://192.168.1.50:8000') when running on a
// physical device or Android emulator. For Android emulator use 'http://10.0.2.2:8000'.
const API_BASE_URL = 'http://localhost:8000';

export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
}

export async function getRecommendation(ingredients: string): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients }),
  });
  if (!response.ok) throw new Error('Failed to get recommendation');
  return response.json();
}
