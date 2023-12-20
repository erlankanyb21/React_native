import React, { memo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';

interface Props {
  listings: any;
}

const INITIAL_REGION = {
  latitude: 42.33,
  longitude: 72.4555,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

const ListingsMap = memo(({ listings }: Props) => {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [destinationMarker, setDestinationMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [destinationName, setDestinationName] = useState<string | null>('');

  useEffect(() => {
    onLocateMe();
  }, []);

  const onMarkerSelected = async (event: any) => {
    if (event && event.properties && event.properties.id) {
      const selectedMarker = event.coordinate;
      setDestinationMarker(selectedMarker);

      // Perform reverse geocoding to get the street name
      const reverseGeocodeResult = await Location.reverseGeocodeAsync(selectedMarker);
      const streetName = reverseGeocodeResult[0]?.street || 'Unknown Street';
      setDestinationName(streetName);

      calculateDistance(userLocation, selectedMarker);
      router.push(`/listing/${event.properties.id}`);
    } else {
      // console.error('Invalid marker event:', event);
    }
  };

  const onLocateMe = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setUserLocation(region);
    mapRef.current?.animateToRegion(region);
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setDestinationMarker(coordinate);
    calculateDistance(userLocation, coordinate);
  };

  const calculateDistance = (point1: any, point2: any) => {
    if (!point1 || !point2) {
      // Handle the case where either point is undefined or null
      console.error('Invalid points for distance calculation');
      setDistance(null);
      return;
    }

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(point2.latitude - point1.latitude);
    const dLon = toRadians(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(point1.latitude)) *
        Math.cos(toRadians(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    setDistance(distance);
  };

  const toRadians = (angle: number) => {
    return (angle * Math.PI) / 180;
  };

  const renderRoute = () => {
    if (!userLocation || !destinationMarker) {
      return null;
    }

    return (
      <Polyline
        coordinates={[
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          {
            latitude: destinationMarker.latitude,
            longitude: destinationMarker.longitude,
          },
        ]}
        strokeWidth={3}
        strokeColor={Colors.primary}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        onPress={handleMapPress}
      >
        {userLocation.latitude !== 0 && userLocation.longitude !== 0 && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
          >
            <View style={styles.marker}>
              <Ionicons name="location-sharp" size={24} color={Colors.primary} />
            </View>
          </Marker>
        )}

        {destinationMarker && (
          <Marker
            coordinate={destinationMarker}
            title={`Distance: ${distance?.toFixed(2)} km`}
            onPress={onMarkerSelected}
          />
        )}

        {renderRoute()}
      </MapView>
      <TouchableOpacity style={styles.locateBtn} onPress={onLocateMe}>
        <Ionicons name="navigate" size={24} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  locateBtn: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});

export default ListingsMap;
