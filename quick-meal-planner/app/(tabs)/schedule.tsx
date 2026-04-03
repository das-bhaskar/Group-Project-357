import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useRecipeContext } from '@/components/ui/recipeContext';
import { Text, View } from 'react-native';

export default function ScheduleScreen() {
const { weeklyRecipes, removeRecipeFromSchedule } = useRecipeContext();
const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const days = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday',];
  // Debugging: confirm structure
  useEffect(() => {
    console.log("Weekly recipes in ScheduleScreen:", weeklyRecipes);
  }, [weeklyRecipes]);

const handleDayPress = (day: string) => {setSelectedDay((current) => (current === day ? null : day));};

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
      headerImage={null}
    >
      <ThemedView style={[styles.contentContainer, { backgroundColor: 'transparent' }]}>
        <ThemedView style={styles.titleContainer}>
         <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>📅 Schedule</ThemedText>
        </ThemedView>

        {days.map((day, index) => {
          const recipe = weeklyRecipes[index];
          const isOpen = selectedDay === day;

          return (
            <Pressable key={day} onPress={() => handleDayPress(day)} style={styles.dayCard}>
              <View style={styles.dayCardRow}>
  <View style={styles.dayIndicator} />
  
  <View style={{ flex: 1 }}>
  </View>
</View>
             <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day}</Text>
                <ThemedText style={styles.tapText}>
                  {isOpen ? 'Hide' : 'View'}
                </ThemedText>
                </View>

              {recipe ? (
                <>
<Text style={styles.recipeText}>{recipe.name}</Text>
<Text style={styles.metaText}>
  {recipe.cuisine} • {recipe.prep_time_minutes + recipe.cook_time_minutes} min
</Text>
             {isOpen && recipe && (
  <View style={styles.detailsContainer}>
    <Text style={styles.detailText}>Cuisine: {recipe.cuisine}</Text>
    <Text style={styles.detailText}>
      Prep Time: {recipe.prep_time_minutes} min
    </Text>
    <Text style={styles.detailText}>
      Cook Time: {recipe.cook_time_minutes} min
    </Text>

    <Text style={styles.ingredientsTitle}>Ingredients</Text>

    {recipe.ingredients.map((ingredient, ingredientIndex) => (
      <Text
        key={`${recipe.id}-${ingredient.name}-${ingredientIndex}`}
        style={styles.ingredientText}
      >
        • {ingredient.name}
      </Text>
    ))}

    <Pressable
      style={styles.removeButton}
      onPress={() => removeRecipeFromSchedule(index)}
    >
      <Text style={styles.removeButtonText}>Remove Meal</Text>
    </Pressable>
  </View>
)}
                </>
              ) : (
<View style={styles.emptyRow}>
  <Text style={styles.emptyText}>No meal planned</Text>
</View>              )}
            </Pressable>
          );
        })}
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
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 50,
  },
  dayCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
dayTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 6,
  color: '#3B2A20',
},
  tapText: {
    fontSize: 13,
    color: '#7A8A85',
  },
  recipeText: {
    fontSize: 14,
    color: '#444',
  },
  emptyText: {
    fontSize: 14,
    color: '#AAA',
    fontStyle: 'italic',
  },
detailsContainer: {
  marginTop: 12,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: '#EAEAEA',
  backgroundColor: 'transparent',
},
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
    color: '#333',
  },
  ingredientText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dayCardRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

dayIndicator: {
  width: 6,
  height: '100%',
  borderRadius: 10,
  backgroundColor: '#4CAF50',
  marginRight: 12,
},
emptyRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

removeButton: {
  marginTop: 16,
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 10,
  backgroundColor: '#FDECEC',
  alignSelf: 'flex-start',
},

removeButtonText: {
  color: '#C94B4B',
  fontSize: 14,
  fontWeight: '600',
},
metaText: {
  fontSize: 12,
  color: '#888',
  marginTop: 2,
},
});