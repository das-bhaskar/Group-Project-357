import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import RecipeCard from "./recipe-card";
import { Recipe } from "./types";

const { width } = Dimensions.get("window");

type Props = {
  data: Recipe[];
};

const RecipeCarousel: React.FC<Props> = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={true}
      snapToInterval={width * 0.8 + 16}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => (
        <View style={{ width: width * 0.8, marginRight: 16 }}>
          <RecipeCard recipe={item} />
        </View>
      )}
    />
  );
};

export default RecipeCarousel;