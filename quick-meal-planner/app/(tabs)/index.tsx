import { Image } from 'expo-image';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import RecipeCarousel from "@/components/ui/recipe-carousel";
import RecipeCard from "@/components/ui/recipe-card";
import data from "@/recipes.json";
import { Recipe, RecipeResponse } from "@/components/ui/types";
import groupByCuisine from '../utils/groupByCuisine';
import { useState } from "react";
import Filters, { Filters as FilterType } from "@/components/ui/filters";
import { getRecommendation } from "../utils/api";


const recipes = (data as RecipeResponse).recipes;
const HEADER_HEIGHT = 200; 
const CARD_WIDTH = Dimensions.get('window').width * 0.6;


export default function HomeScreen() {

const [filters, setFilters] = useState<FilterType>({});
const [ingredients, setIngredients] = useState('');
const [recommendation, setRecommendation] = useState<Recipe | null>(null);
const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState<string | null>(null);

const handleRecommend = async () => {
  if (!ingredients.trim()) return;
  setAiLoading(true);
  setAiError(null);
  setRecommendation(null);
  try {
    const result = await getRecommendation(ingredients.trim());
    setRecommendation(result);
  } catch {
    setAiError('Could not connect to backend. Make sure the server is running.');
  } finally {
    setAiLoading(false);
  }
};

const filtered = recipes.filter((recipe) => {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const totalCost = recipe.ingredients.reduce((sum, i) => sum + i.cost, 0);

  if (filters.mealType && !recipe.tags.includes(filters.mealType)) return false;
  if (filters.maxTime && totalTime > filters.maxTime) return false;
  if (filters.maxCost && totalCost > filters.maxCost) return false;

  return true;
});

const grouped = groupByCuisine(filtered);
  const cuisines = Object.keys(grouped);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
      headerImage={
        <Image
          source={require('@/assets/images/quick-meal-header.png')} 
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={{ paddingTop: 16, paddingHorizontal: 8 }}>
        <ThemedText type="title" style={{ marginBottom: 8 }}>
          Quick Meal Planner
        </ThemedText>
        <ThemedText style={{ fontSize: 15, color: '#7A8A85', marginBottom: 16 }}>
          Browse recipes by cuisine and plan your week.
        </ThemedText>

        {/* AI Ingredient Search */}
        <View style={styles.aiSection}>
          <ThemedText style={styles.aiTitle}>What's in your fridge?</ThemedText>
          <ThemedText style={styles.aiSubtitle}>Describe your ingredients and let AI find the best recipe.</ThemedText>
          <View style={styles.aiInputRow}>
            <TextInput
              style={styles.aiInput}
              placeholder="e.g. eggs, milk, flour..."
              placeholderTextColor="#A8B8B2"
              value={ingredients}
              onChangeText={setIngredients}
              onSubmitEditing={handleRecommend}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={[styles.aiButton, aiLoading && { opacity: 0.6 }]}
              onPress={handleRecommend}
              activeOpacity={0.8}
              disabled={aiLoading}
            >
              <ThemedText style={styles.aiButtonText}>Find</ThemedText>
            </TouchableOpacity>
          </View>
          {aiLoading && <ActivityIndicator style={{ marginTop: 12 }} color="#0a7ea4" />}
          {aiError && <ThemedText style={styles.aiError}>{aiError}</ThemedText>}
          {recommendation && (
            <View style={{ marginTop: 12 }}>
              <ThemedText style={styles.aiResultLabel}>✨ AI Recommendation</ThemedText>
              <View style={{ width: CARD_WIDTH }}>
                <RecipeCard recipe={recommendation} />
              </View>
            </View>
          )}
        </View>

        {/* Filters UI */}
        <Filters onChange={setFilters} />

        {cuisines.map((item) => (
          <RecipeCarousel key={item} title={item} data={grouped[item]} />
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: HEADER_HEIGHT,
    width: '100%',
    resizeMode: 'cover', 
    alignSelf: 'center',
  },
  aiSection: {
    backgroundColor: '#F0F7F4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  aiTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D4A3E',
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 13,
    color: '#7A8A85',
    marginBottom: 12,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8DDD6',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#2D4A3E',
  },
  aiButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    paddingHorizontal: 18,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  aiError: {
    color: '#C0392B',
    fontSize: 13,
    marginTop: 8,
  },
  aiResultLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D4A3E',
    marginBottom: 8,
  },
});