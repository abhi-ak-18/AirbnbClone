import { StyleSheet, Text, View } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { defaultStyles } from "../constants/Styles";
import * as Permission from "expo-permissions";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import MapView from "react-native-map-clustering";

interface Props {
  listings: any;
}
const INTIAL_REGION = {
  latitude: 52.520008,
  longitude: 13.404954,
  latitudeDelta: 0.8,
  longitudeDelta: 0.8,
};

const ListingsMap = memo(({ listings }: Props) => {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onMarkerSeleted = (item: any) => {
    router.push(`/listing/${item.properties.id}`);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;
    const points = properties.point_count;

    return (
      <Marker
        key={`cluster-${id}`}
        onPress={onPress}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
      >
        <View style={styles.marker}>
          <Text style={styles.markerText}>{points}</Text>
        </View>
      </Marker>
    );
  };

  return (
    <View style={defaultStyles.container}>
      <MapView
        animationEnabled={false}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={INTIAL_REGION}
        clusterColor="#fff"
        clusterTextColor="#000"
        clusterFontFamily="mon-sb"
        renderCluster={renderCluster}
        provider={PROVIDER_GOOGLE}
      >
        {listings.features.map((item: any) => (
          <Marker
            key={item.properties.id}
            onPress={() => onMarkerSeleted(item)}
            coordinate={{
              latitude: +item.properties.latitude,
              longitude: +item.properties.longitude,
            }}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>
                ₹ {item.properties.price * 80}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
});

export default ListingsMap;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: "mon-sb",
  },
  locateBtn: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});
