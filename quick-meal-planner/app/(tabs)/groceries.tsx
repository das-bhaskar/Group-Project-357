import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SectionList,
} from "react-native";
import { useRecipeContext } from "@/components/ui/recipeContext";
import { Ingredient } from "@/components/ui/types";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

const CATEGORY_RULES: { keywords: string[]; category: string; icon: string }[] = [
  {
    keywords: ["tomato", "onion", "garlic", "spinach", "pepper", "carrot", "celery", "lettuce", "lemon", "lime", "mushroom", "zucchini", "broccoli", "avocado"],
    category: "Produce",
    icon: "🥦",
  },
  {
    keywords: ["chicken", "beef", "pork", "lamb", "salmon", "tuna", "shrimp", "turkey", "mince", "ground"],
    category: "Meat & Fish",
    icon: "🥩",
  },
  {
    keywords: ["milk", "yogurt", "cheese", "butter", "cream", "parmesan", "mozzarella", "egg"],
    category: "Dairy",
    icon: "🧀",
  },
  {
    keywords: ["pasta", "spaghetti", "rice", "flour", "oil", "olive", "vinegar", "sauce", "can", "tin", "stock", "broth", "sugar", "salt", "pepper", "spice", "herb", "bread", "noodle"],
    category: "Pantry",
    icon: "🥫",
  },
];

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  "Produce":    { icon: "🥦", color: "#2A7A52", bg: "#EBF7F2" },
  "Meat & Fish":{ icon: "🥩", color: "#A0462A", bg: "#FAF0ED" },
  "Dairy":      { icon: "🧀", color: "#9A6E1A", bg: "#FDF6E8" },
  "Pantry":     { icon: "🥫", color: "#4A5568", bg: "#F0F2F5" },
  "Other":      { icon: "🛍️", color: "#6B7280", bg: "#F5F5F5" },
};

const DEFAULT_CATEGORY = "Other";
const CATEGORY_ORDER = ["Produce", "Meat & Fish", "Dairy", "Pantry", "Other"];
const GREEN = "#1D9E75";

function categorize(name: string): string {
  const lower = name.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) return rule.category;
  }
  return DEFAULT_CATEGORY;
}

type GroceryItem = Ingredient & { recipeId: number; key: string; checked: boolean };
type SectionData = { title: string; data: GroceryItem[] };

export default function GroceriesScreen() {
  const { weeklyRecipes } = useRecipeContext();

  const rawItems = useMemo<GroceryItem[]>(() => {
    const seen: Record<string, GroceryItem> = {};
    weeklyRecipes.forEach((recipe) => {
            if(!recipe) return;
      recipe.ingredients.forEach((ing) => {
        const keyName = ing.name.toLowerCase().trim();
        if (seen[keyName]) {
          if (seen[keyName].unit === ing.unit) {
            seen[keyName] = {
              ...seen[keyName],
              quantity: seen[keyName].quantity + ing.quantity,
              cost: seen[keyName].cost + ing.cost,
            };
          }
        } else {
          seen[keyName] = { ...ing, recipeId: recipe.id, key: keyName, checked: false };
        }
      });
    });
    return Object.values(seen);
  }, [weeklyRecipes]);

  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  const toggleCheck = (key: string) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const sections: SectionData[] = useMemo(() => {
    const groups: Record<string, GroceryItem[]> = {};
    rawItems.forEach((item) => {
      const cat = categorize(item.name);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ ...item, checked: checkedKeys.has(item.key) });
    });
    return CATEGORY_ORDER.filter((cat) => groups[cat]?.length > 0).map((cat) => ({
      title: cat,
      data: groups[cat],
    }));
  }, [rawItems, checkedKeys]);

  const totalItems = rawItems.length;
  const checkedCount = checkedKeys.size;
  const totalCost = rawItems
  .filter((i) => !checkedKeys.has(i.key))   // only un-checked items
  .reduce((s, i) => s + i.cost, 0);
  const progress = totalItems > 0 ? checkedCount / totalItems : 0;

  return (
    <ThemedView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scroll}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Title row */}
            <View style={styles.titleRow}>
              <ThemedText style={styles.pageTitle}>Groceries</ThemedText>
              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  {checkedCount}/{totalItems} done
                </Text>
              </View>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>${totalCost.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Est. total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{weeklyRecipes.length}</Text>
                <Text style={styles.statLabel}>
                  {weeklyRecipes.length === 1 ? "Recipe" : "Recipes"}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{totalItems - checkedCount}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressWrap}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              {progress === 1 && totalItems > 0 && (
                <Text style={styles.doneLabel}>✓ All picked up!</Text>
              )}
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => {
          const meta = CATEGORY_META[section.title] ?? CATEGORY_META["Other"];
          const remaining = section.data.filter((i) => !checkedKeys.has(i.key)).length;
          return (
            <View style={styles.sectionHeader}>
              <View style={[styles.catIconWrap, { backgroundColor: meta.bg }]}>
                <Text style={styles.catIcon}>{meta.icon}</Text>
              </View>
              <Text style={[styles.catLabel, { color: meta.color }]}>{section.title}</Text>
              <View style={styles.catCountWrap}>
                <Text style={styles.catCount}>{remaining}</Text>
              </View>
            </View>
          );
        }}
        renderItem={({ item }) => {
          const checked = checkedKeys.has(item.key);
          return (
            <Pressable
              style={({ pressed }) => [styles.grocItem, pressed && styles.grocItemPressed]}
              onPress={() => toggleCheck(item.key)}
            >
              {/* Checkbox */}
              <View style={[styles.check, checked && styles.checkDone]}>
                {checked && (
                  <View style={styles.checkMark} />
                )}
              </View>

              {/* Name + qty */}
              <View style={styles.grocBody}>
                <Text
                  style={[styles.grocName, checked && styles.grocNameChecked]}
                  numberOfLines={1}
                >
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Text>
              </View>

              <Text style={[styles.grocQty, checked && styles.grocQtyChecked]}>
                {item.quantity}{item.unit}
              </Text>
            </Pressable>
          );
        }}
        SectionSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <ThemedText style={styles.emptyText}>
              Add meals to your plan to build your list.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 48 },

  // ── Header ────────────────────────────────────
  header: {
    paddingHorizontal: 16,
    paddingTop: 100,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  pill: {
    backgroundColor: "#EBF7F2",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D7A55",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#E6A36A",   // dark card
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",   
    letterSpacing: -0.3,
  },
  
  statLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",   
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#3A3A3C",   // subtle divider
    marginHorizontal: 8,
    borderRadius: 1,
  },
  

  // Progress
  progressWrap: {
    marginBottom: 8,
  },
progressTrack: {
  height: 3,
  backgroundColor: "#3A3A3C",
  borderRadius: 2,
  overflow: "hidden",
},

progressFill: {
  height: 3,
  backgroundColor: "#30D158",   
  borderRadius: 2,
},

  doneLabel: {
    fontSize: 11,
    color: GREEN,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "right",
  },

  // ── Section header ─────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  catIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  catIcon: { fontSize: 14 },
  catLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  catCountWrap: {
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  catCount: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },

  // ── Grocery item ───────────────────────────────
  grocItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginHorizontal: 16,
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECEEF1",
  },
  grocItemPressed: {
    opacity: 0.7,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#CDD2DA",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkDone: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  checkMark: {
    width: 7,
    height: 4.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "#fff",
    transform: [{ rotate: "-45deg" }, { translateY: -0.5 }],
  },
  grocBody: { flex: 1 },
  grocName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  grocNameChecked: {
    color: "#C0C5CC",
    textDecorationLine: "line-through",
  },
  grocQty: {
    fontSize: 12,
    color: "#9AA0AB",
    fontWeight: "500",
  },
  grocQtyChecked: {
    color: "#D0D5DC",
  },

  // ── Empty ──────────────────────────────────────
  empty: {
    alignItems: "center",
    paddingTop: 64,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 38 },
  emptyText: {
    fontSize: 14,
    color: "#9AA0AB",
    textAlign: "center",
    lineHeight: 21,
  },
});
