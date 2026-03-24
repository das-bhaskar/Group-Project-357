import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Recipe } from "./types";

type Props = {
  recipe: Recipe;
  onPress?: () => void;
};

const RecipeCard: React.FC<Props> = ({ recipe, onPress }) => {
  const totalTime =
    recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.name}</Text>

        <Text style={styles.subtitle}>{recipe.cuisine}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>⏱ {totalTime} min</Text>
          <Text style={styles.meta}>🍽 {recipe.servings}</Text>
        </View>

        <View style={styles.tags}>
          {recipe.tags.slice(0, 2).map((tag) => (
            <Text key={tag} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
  },
  content: {},
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: "#999",
  },
  tags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    fontSize: 12,
    color: "#007AFF",
  },
});