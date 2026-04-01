import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import RecipeCard from "./recipe-card";
import { Recipe } from "./types";
import { ThemedText } from "../themed-text";

const { width } = Dimensions.get("window");

type Props = {
  data: Recipe[];
  title: string;
};

const RecipeCarousel: React.FC<Props> = ({ title, data }) => {
  return (
    <View>
      <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
    {title}
  </ThemedText> 
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={width * 0.6 + 32}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 8 }}
      renderItem={({ item }) => (
        <View style={{ width: width * 0.6, marginRight: 32 }}>
          <RecipeCard recipe={item} />
        </View>
      )}
    />
    </View>
  );
};

export default RecipeCarousel;