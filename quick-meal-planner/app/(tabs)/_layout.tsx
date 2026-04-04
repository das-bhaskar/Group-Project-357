import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RecipeProvider } from "@/components/ui/recipeContext";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <RecipeProvider>
      <SafeAreaProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="groceries"
            options={{
              title: 'Groceries',
              tabBarIcon: ({ color }) => <MaterialIcons name="local-grocery-store" size={28} color={color} />,
            }}
          />
          <Tabs.Screen
            name="schedule"
            options={{
              title: 'Schedule',
              tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={28} color={color} />,
            }}
          />
        </Tabs>
        </SafeAreaProvider>
    </RecipeProvider>

  );
}
