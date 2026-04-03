import React, { useState } from "react";
import {
  View, Text, StyleSheet, Image, Pressable, Modal,
  ScrollView, TouchableOpacity, FlatList,
} from "react-native";
import { Recipe } from "./types";
import { useRecipeContext } from "@/components/ui/recipeContext";
import { recipeImages } from "@/app/utils/recipeImages";

type Props = { recipe: Recipe };

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  const { addRecipe } = useRecipeContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [dayModalVisible, setDayModalVisible] = useState(false);

  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const totalCost = recipe.ingredients.reduce((sum, i) => sum + i.cost, 0);
  const sourceImage = recipeImages[recipe.image];

  // Days of the week matching your schedule order
  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleAddToSchedule = (dayIndex: number) => {
    addRecipe(recipe, dayIndex);
    setDayModalVisible(false);
    setConfirmVisible(true);
  };

  return (
    <>
      {/* ---- Card ---- */}
      <Pressable
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.cardTitle}>{recipe.name}</Text>
        <Text style={styles.cardCuisine}>{recipe.cuisine}</Text>
  
        <View style={styles.row}>
          <Text style={styles.chip}>⏱ {totalTime} min</Text>
          <Text style={styles.chip}>🍽 {recipe.servings} servings</Text>
        </View>
  
        <View style={styles.row}>
          {recipe.tags.slice(0, 2).map((tag) => (
            <Text key={tag} style={styles.tag}>#{tag}</Text>
          ))}
        </View>
      </Pressable>
  
      {/* ---- Detail Modal ---- */}
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          {/* Close */}
          <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </Pressable>
  
          <Image source={sourceImage} style={styles.modalImage} />
          <Text style={styles.modalTitle}>{recipe.name}</Text>
  
          {/* Quick stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalTime}</Text>
              <Text style={styles.statLabel}>min</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{recipe.servings}</Text>
              <Text style={styles.statLabel}>servings</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>${totalCost.toFixed(2)}</Text>
              <Text style={styles.statLabel}>total</Text>
            </View>
          </View>
  
          {/* Steps */}
          <Text style={styles.sectionTitle}>Steps</Text>
          {recipe.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
  
          {/* Ingredients */}
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ing, i) => (
            <View key={i} style={styles.ingredientRow}>
              <Text style={styles.ingredientName}>{ing.name}</Text>
              <Text style={styles.ingredientDetail}>
                {ing.quantity}{ing.unit} · ${ing.cost.toFixed(2)}
              </Text>
            </View>
          ))}
  
          {/* CTA */}
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => {
              setModalVisible(false);
              setDayModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>Add to Schedule</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* ---- Day Selection Modal ---- */}
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={dayModalVisible}
        onRequestClose={() => setDayModalVisible(false)}
      >
        <View style={styles.dayModalContainer}>
          {/* Header */}
          <View style={styles.dayModalHeader}>
            <Text style={styles.dayModalTitle}>Add "{recipe.name}" to Schedule</Text>
            <Pressable 
              onPress={() => setDayModalVisible(false)}
              style={styles.dayModalClose}
            >
              <Text style={styles.dayModalCloseText}>✕</Text>
            </Pressable>
          </View>

          {/* Recipe preview */}
          <View style={styles.recipePreview}>
            <Text style={styles.recipePreviewTitle}>{recipe.name}</Text>
            <Text style={styles.recipePreviewTime}>{totalTime} min • {recipe.servings} servings</Text>
          </View>

          {/* Day selection */}
          <Text style={styles.daySelectionTitle}>Choose a day:</Text>
          
          <FlatList
            data={daysOfWeek}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.dayOption,
                  index === 0 && styles.dayOptionHighlighted // Highlight Saturday
                ]}
                activeOpacity={0.7}
                onPress={() => handleAddToSchedule(index)}
              >
                <Text style={styles.dayOptionText}>{item}</Text>
                <Text style={styles.dayOptionIcon}>➤</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.dayList}
            showsVerticalScrollIndicator={false}
          />

          {/* Cancel button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setDayModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  
      {/* ---- Confirmation Popup ---- */}
      <Modal
        transparent
        animationType="fade"
        visible={confirmVisible}
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>Added to your schedule!</Text>
  
            <Pressable
              style={styles.confirmButton}
              onPress={() => setConfirmVisible(false)}
            >
              <Text style={styles.confirmButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const BRAND = "#2E8B63";

const styles = StyleSheet.create({
  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  cardCuisine: { fontSize: 13, color: "#999", marginTop: 2, marginBottom: 10 },
  row: { flexDirection: "row", gap: 8, marginTop: 4 },
  chip: {
    fontSize: 12, color: "#555", backgroundColor: "#F2F2F2",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: "hidden",
  },
  tag: { fontSize: 12, color: BRAND },

  /* Modal */
  modalContent: { padding: 24, paddingTop: 16, paddingBottom: 60 },
  closeBtn: {
    alignSelf: "flex-end", width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#F2F2F2", alignItems: "center", justifyContent: "center",
  },
  closeBtnText: { fontSize: 16, color: "#666" },
  modalImage: {
    width: "100%", height: 220, borderRadius: 16, marginTop: 12, marginBottom: 16,
  },
  modalTitle: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", marginBottom: 16 },

  /* Stats */
  statsRow: {
    flexDirection: "row", backgroundColor: "#F8FAF9", borderRadius: 12,
    padding: 16, justifyContent: "space-around", marginBottom: 24,
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  statLabel: { fontSize: 12, color: "#999", marginTop: 2 },
  divider: { width: 1, backgroundColor: "#E5E5E5" },

  /* Steps */
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  stepBadge: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: BRAND,
    alignItems: "center", justifyContent: "center", marginRight: 12, marginTop: 2,
  },
  stepBadgeText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  stepText: { flex: 1, fontSize: 15, color: "#333", lineHeight: 22 },

  /* Ingredients */
  ingredientRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  ingredientName: { fontSize: 15, color: "#1A1A1A" },
  ingredientDetail: { fontSize: 14, color: "#999" },

  /* CTA */
  addButton: {
    backgroundColor: BRAND, borderRadius: 14, paddingVertical: 16,
    alignItems: "center", marginTop: 32,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  /* Confirmation */
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 14,
    width: "75%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  confirmButton: {
    backgroundColor: BRAND,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  /* NEW: Day Selection Modal Styles */
  dayModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dayModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  dayModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayModalCloseText: {
    fontSize: 16,
    color: '#666',
  },
  recipePreview: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#F8FAF9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  recipePreviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recipePreviewTime: {
    fontSize: 14,
    color: '#666',
  },
  daySelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    margin: 24,
    marginBottom: 12,
  },
  dayList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  dayOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  dayOptionHighlighted: {
    backgroundColor: '#E8F5E8',
    borderColor: BRAND,
  },
  dayOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dayOptionIcon: {
    fontSize: 16,
    color: BRAND,
  },
  cancelButton: {
    margin: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default RecipeCard;