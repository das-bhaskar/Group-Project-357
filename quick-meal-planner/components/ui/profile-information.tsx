import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";
import TextInputExample from "./text-input";
import { Fonts } from "@/constants/theme";


const ProfileInformation = () => {
    return (
      <ThemedView>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Profile
        </ThemedText>
        <TextInputExample></TextInputExample>
      </ThemedView>
    )
}

export default ProfileInformation;

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