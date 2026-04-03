import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import RecipeCarousel from "@/components/ui/recipe-carousel";
import data from "@/recipes.json";
import groupByCuisine from '../utils/groupByCuisine';
import { useState } from "react";
import Filters, { Filters as FilterType } from "@/components/ui/filters";
import { useRecipes } from "@/hooks/userRecipes";

const HEADER_HEIGHT = 200; 



export default function HomeScreen() {

  const {
    recipes,
    recommendation,
    getRecommendation,
    recommendationLoading,
  } = useRecipes();

  const [filters, setFilters] = useState<FilterType>({});

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
});