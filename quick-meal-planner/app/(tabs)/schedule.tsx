import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useRecipeContext } from "@/components/ui/recipeContext";

export default function ScheduleScreen() {
  
  const { weeklyRecipes } = useRecipeContext();

  // Debugging: confirm structure
  useEffect(() => {
    console.log("Weekly recipes in ScheduleScreen:", weeklyRecipes);
  }, [weeklyRecipes]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#519237"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Schedule
          </ThemedText>
        </ThemedView>

        {weeklyRecipes.length === 0 ? (
          <ThemedText style={styles.meta}>No recipes added yet</ThemedText>
        ) : (
          weeklyRecipes.map(recipe => (
            <ThemedView>
            <ThemedText>Recipe</ThemedText>
            <ThemedText key={recipe.id} style={styles.meta}>
              {recipe.name}
            </ThemedText>
            </ThemedView>
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  meta: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
});