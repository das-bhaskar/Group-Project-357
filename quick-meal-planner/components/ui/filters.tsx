import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type Filters = {
  mealType?: string | null;
  maxTime?: number | null;
  servings?: number | null;
  maxCost?: number | null;
};

type Props = {
  onChange: (filters: Filters) => void;
};

const mealTypes = [
    "pasta",
    "main",
    "spicy",
    "quick",
    "street food",
    "vegan",
    "healthy",
    "breakfast",
    "comfort",
    "salad",
    "soup",
    "dessert",
    "fast food",
    "pizza",
    "seafood",
    "noodles",
    "dip"
  ];
  
const timeOptions = [10, 20, 30, 45];
const costOptions = [5, 10, 15];

const ACCENT = "#2D7A53";
const ACCENT_LIGHT = "#EAF4EE";
const BORDER = "#E4E8EC";
const TEXT_MUTED = "#8A95A0";
const TEXT_DARK = "#1A2228";
const CHIP_BG = "#F2F5F7";

export default function Filters({ onChange }: Props) {
  const [filters, setFilters] = useState<Filters>({});
  const [expanded, setExpanded] = useState(false);

  const update = (newValues: Partial<Filters>) => {
    const updated = { ...filters, ...newValues };
    setFilters(updated);
    onChange(updated);
  };

  const activeCount = [filters.mealType, filters.maxTime, filters.maxCost].filter(Boolean).length;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  const clearAll = () => {
    const cleared: Filters = {};
    setFilters(cleared);
    onChange(cleared);
  };

  return (
    <View style={styles.card}>
      {/* Header row */}
      <Pressable onPress={toggle} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>⚙</Text>
          <Text style={styles.headerTitle}>Filters</Text>
          {activeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {activeCount > 0 && (
            <Pressable onPress={clearAll} hitSlop={8}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          )}
          <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
        </View>
      </Pressable>

      {/* Expanded body */}
      {expanded && (
        <View style={styles.body}>
          <Divider />

          <FilterRow label="Type">
            {mealTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                selected={filters.mealType === type}
                onPress={() => update({ mealType: filters.mealType === type ? null : type })}
              />
            ))}
          </FilterRow>

          <FilterRow label="Time">
            {timeOptions.map((t) => (
              <Chip
                key={t}
                label={`${t}m`}
                selected={filters.maxTime === t}
                onPress={() => update({ maxTime: filters.maxTime === t ? null : t })}
              />
            ))}
          </FilterRow>

          <FilterRow label="Cost" last>
            {costOptions.map((c) => (
              <Chip
                key={c}
                label={`$${c}`}
                selected={filters.maxCost === c}
                onPress={() => update({ maxCost: filters.maxCost === c ? null : c })}
              />
            ))}
          </FilterRow>
        </View>
      )}
    </View>
  );
}

function FilterRow({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.filterRow, last && { marginBottom: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.chipSelected,
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerIcon: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
    letterSpacing: 0.1,
  },
  badge: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clearText: {
    fontSize: 12,
    color: ACCENT,
    fontWeight: "600",
  },
  chevron: {
    fontSize: 10,
    color: TEXT_MUTED,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_MUTED,
    width: 34,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 8,
    backgroundColor: CHIP_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipSelected: {
    backgroundColor: ACCENT_LIGHT,
    borderColor: ACCENT,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    color: TEXT_MUTED,
    textTransform: "capitalize",
  },
  chipTextSelected: {
    color: ACCENT,
    fontWeight: "700",
  },
});
