
import { Text, View, SafeAreaView } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import ExploreHeader from "../../components/ExploreHeader";
import Listings from "../../components/Listings";
import { useState, useMemo } from "react";
import listingsData from "../../assets/data/airbnb-listings.json";
import ListingsMap from "../../components/ListingsMap";
import listingsDataGeo from "../../assets/data/airbnb-listings.geo.json";
import ListingsBottomSheet from "../../components/ListingsBottomSheet";

const Page = () => {
 // State to store the selected category
 const [category, setCategory] = useState("Tiny homes");

 // Memoize the listings data to avoid unnecessary re-renders
 const items = useMemo(() => listingsData as any, []);

 // Function to handle category changes
 const onDataChanged = (category: string) => {
    setCategory(category);
 };

 return (
    <View style={{ flex: 1}}>
      <Stack.Screen
        options={
          {
            // Set the header component for the screen
            header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
          }
        }
      />
      {/* <Listings listings={items} category={category} /> */}
      <ListingsMap listings={listingsDataGeo} />
      <ListingsBottomSheet listings={items} category={category} />
    </View>
 );
};

export default Page;

