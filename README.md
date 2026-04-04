# Group-Project-357

| Full Name | Role | Student ID |
|-----------------|------------------|-----------|
| Nicole Antoun  | Frontend | 40284018 |
| Sara Rezene Habte  | Frontend | 40224677 |
| Colton Leblond | Frontend | 40210640 |
| Bhaskar Das  | Backend | 40325270 |

# Welcome to our Quick Meal app 👋

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

# Backend Setup & API Documentation

This backend handles recipe recommendations using a Gemini-powered engine and a local recipe database.

---

### 1. Local Setup (For Frontend Developers)
To run the backend locally while developing the app:

1. **Clone & Navigate:** `cd backend`
2. **Virtual Environment:** * `python -m venv venv`
   * `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
3. **Install Dependencies:** `pip install fastapi uvicorn google-generativeai python-dotenv`
4. **Environment Variables:** Create a `.env` file in the `backend` folder and add:
   * `GEMINI_API_KEY=your_actual_key_here`
5. **Run Server:** `python main.py`
   * The server will start at `http://0.0.0.0:8000`.

---

### 2. Connection Note (CRITICAL)
When calling the API from a physical device or an Android Emulator, **do not use localhost**.
* Use your computer's local IP address (e.g., `192.168.1.50`).
* **Base URL:** `http://<YOUR_LOCAL_IP>:8000`

---

### 3. API Endpoints

#### **[GET] /recipes**
Retrieves the full list of available recipes. Use this to populate a "Browse" or "All Recipes" screen.
* **Returns:** An array of recipe objects.


#### **[POST] /recommend**
The AI-driven search. Send a natural language string of ingredients, and it returns the single best match.


```json
{
  "ingredients": "I have some flour, milk, and eggs"
}
````

**Success Response (200 OK):**

```json
{
  "id": 5,
  "name": "Pancakes",
  "cuisine": "Global",
  "servings": 4,
  "prep_time_minutes": 10,
  "cook_time_minutes": 15,
  "ingredients": [
    { "name": "flour", "quantity": 1.5, "unit": "cups", "cost": 0.80 },
    { "name": "milk", "quantity": 1.25, "unit": "cups", "cost": 1.00 },
    { "name": "egg", "quantity": 1, "unit": "unit", "cost": 0.40 }
  ],
  "steps": ["Mix ingredients.", "Cook on pan.", "Flip and serve."],
  "tags": ["breakfast"]
}
```

---

### 4. Interactive Testing

If the backend is running, you can test all endpoints visually by visiting:

```
http://localhost:8000/docs
```


