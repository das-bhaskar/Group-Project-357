// RecipeCard 
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal, Alert, Button } from "react-native";``
import { Recipe } from "./types";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRecipeContext } from "./types";


type Props = {
  recipe: Recipe;
  onPress?: () => void;
};

const RecipeCard: React.FC<Props> = ({ recipe, onPress }) => {
  const { addRecipe } = useRecipeContext();
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  const totalCost = recipe.ingredients.reduce((accumulator, currentItem) => {
    return accumulator + (currentItem.cost);
  }, 0); // 0 is the initial value

  const handleSelectRecipe = (recipe: any) => {
    addRecipe(recipe);
  };

  const [modalVisible, setModalVisible] = useState(false);
// move recipe modal into own file
  return (
    <SafeAreaProvider>
      <Modal
        animationType='slide'
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Recipe closed")
          setModalVisible(!modalVisible);
        }}
      >
      <Pressable onPress={() => setModalVisible(!modalVisible)} style={styles.centeredView}>
        <View>
          <View style={styles.modalView}>
              <Text style={styles.title}>{recipe.name}</Text>
              <View style={styles.container}>
                <Text style={styles.subtext}>⏱ {totalTime} min</Text>
                <Text style={styles.subtext}>🍽 {recipe.servings}</Text>
              </View>
              {recipe.steps.map((step, index) => (
                <Text key={index}>
                  {index + 1}.{step}
                </Text>
              ))}
            <Text style={styles.title}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index}>
                {ingredient.name} - {ingredient.quantity}{ingredient.unit} - ${ingredient.cost}
              </Text>
              
            ))} 
            <Text style={styles.title}>Total Cost</Text>
            <Text>{totalCost}
            </Text>
            <View style={styles.container}>
              <Button
                title="Add to Schedule"
                onPress={() =>handleSelectRecipe(recipe)}
                color="#329863" 
              />
            </View>
          </View>
        </View>
      </Pressable>
      </Modal>
      <Pressable style={styles.card} onPress={() => setModalVisible(true)}>
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
      </Pressable>
    </SafeAreaProvider>
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
  subtext: {
    margin: 5
  },
  tags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    fontSize: 12,
    color: "#007AFF",
  },
  centeredView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  container: {
    flexDirection: 'row', // Aligns children horizontally
    justifyContent: 'space-between', // Distributes available space between the two texts
    padding: 10,
  },
});