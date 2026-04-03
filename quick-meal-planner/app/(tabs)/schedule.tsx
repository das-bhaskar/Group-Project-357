import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useRecipeContext } from '@/components/ui/recipeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ScheduleScreen() {
  const { weeklyRecipes, removeRecipeFromSchedule } = useRecipeContext();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const days = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  // Unique color for each day
const dayColors: Record<string, string> = {
  Saturday:   '#D8EED1', // light herb green
  Sunday:     '#C7E8C1', // soft mint green
  Monday:     '#B5E0B0', // muted fresh green
  Tuesday:    '#A3D89F', // natural leafy green
  Wednesday:  '#92D08F', // mid-tone garden green
  Thursday:   '#7FC87D', // warm plant green
  Friday:     '#6BBF6A', // deeper botanical green
};


  useEffect(() => {
    console.log('Weekly recipes in ScheduleScreen:', weeklyRecipes);
  }, [weeklyRecipes]);

  const handleDayPress = (day: string) => {
    setSelectedDay((current) => (current === day ? null : day));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
      headerImage={null}
    >
      <ThemedView style={[styles.contentContainer, { backgroundColor: 'transparent' }]}>
      <ThemedView style={styles.titleContainer}>
  <Icon name="calendar-month-outline" size={30} color="#4CAF50" />
  <ThemedText type="title" style={{ fontFamily: Fonts.rounded, marginLeft: 8 }}>
    Schedule
  </ThemedText>
</ThemedView>

        {days.map((day, index) => {
          const recipe = weeklyRecipes[index];
          const isOpen = selectedDay === day;

          return (
            <Pressable
              key={day}
              onPress={() => handleDayPress(day)}
              style={[
                styles.dayCard,
                { borderLeftColor: dayColors[day], borderLeftWidth: 5 },
              ]}
            >
              <View style={styles.dayHeaderRow}>
                <View
                  style={[
                    styles.dayIndicator,
                    { backgroundColor: dayColors[day] },
                  ]}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.dayTitle}>{day}</Text>

                  {recipe ? (
                    <>
                      <Text style={styles.recipeName}>{recipe.name}</Text>
                      <Text style={styles.metaText}>
                        {recipe.cuisine} •{' '}
                        {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.emptyText}>No meal planned</Text>
                  )}
                </View>

                <Text style={styles.viewToggle}>{isOpen ? 'Hide' : 'View'}</Text>
              </View>

              {isOpen && recipe && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.sectionTitle}>Meal Details</Text>

                  <Text style={styles.detailText}>Cuisine: {recipe.cuisine}</Text>
                  <Text style={styles.detailText}>
                    Prep Time: {recipe.prep_time_minutes} min
                  </Text>
                  <Text style={styles.detailText}>
                    Cook Time: {recipe.cook_time_minutes} min
                  </Text>

                  <Text style={styles.sectionTitle}>Ingredients</Text>

                  {recipe.ingredients.map((ingredient, i) => (
                    <Text key={i} style={styles.ingredientText}>
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
            </Pressable>
          );
        })}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  dayCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  dayIndicator: {
    width: 6,
    height: '100%',
    borderRadius: 8,
    marginRight: 14,
  },

  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
  },

  recipeName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
  },

  metaText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  emptyText: {
    fontSize: 14,
    color: '#AAA',
    fontStyle: 'italic',
  },

  viewToggle: {
    fontSize: 13,
    color: '#6C7A7A',
    fontWeight: '500',
    paddingLeft: 10,
  },

  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 4,
  },

  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },

  ingredientText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },

  removeButton: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FFE5E5',
    alignSelf: 'flex-start',
  },

  removeButtonText: {
    color: '#C94B4B',
    fontSize: 14,
    fontWeight: '600',
  },
});
