import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Go up one level to the project root where recipes.json lives
RECIPE_PATH = os.path.join(BASE_DIR, "..", "recipes.json")

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash-lite')

app = FastAPI()

# Enable CORS for React Native development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_recipes():
    try:
        with open(RECIPE_PATH, "r") as f:
            return json.load(f)["recipes"]
    except FileNotFoundError:
        print(f"Error: Could not find recipes.json at {RECIPE_PATH}")
        return []

RECIPES = load_recipes()

# Data Models
class IngredientInput(BaseModel):
    ingredients: str

class RecipeResponse(BaseModel):
    id: int
    name: str
    cuisine: str
    servings: int
    prep_time_minutes: int
    cook_time_minutes: int
    ingredients: List[dict]
    steps: List[str]
    tags: List[str]

@app.get("/recipes", response_model=List[RecipeResponse])
async def get_all_recipes():
    return RECIPES

@app.post("/recommend")
async def recommend_recipe(user_input: IngredientInput):
    # Prepare a condensed version of recipes for the prompt to save tokens
    recipe_context = [{"id": r["id"], "name": r["name"], "ingredients": [i["name"] for i in r["ingredients"]]} for r in RECIPES]
    
    prompt = f"""
    You are a professional chef assistant. 
    User has these ingredients: {user_input.ingredients}
    
    Available Recipes: {json.dumps(recipe_context)}
    
    Instruction: Based on the user's available ingredients, pick the ONE best matching recipe ID from the list.
    If multiple match, pick the most relevant one.
    Respond ONLY with the raw integer ID. No text, no explanation.
    """

    try:
        response = model.generate_content(prompt)
        recipe_id_str = response.text.strip()
        
        # Clean response in case Gemini adds markdown or extra spaces
        recipe_id = int(''.join(filter(str.isdigit, recipe_id_str)))
        
        # Find the full recipe details
        recommended = next((r for r in RECIPES if r["id"] == recipe_id), None)
        
        if not recommended:
            raise HTTPException(status_code=404, detail="Recipe ID returned by AI not found in local database")
            
        return recommended

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Recommendation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)