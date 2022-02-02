import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import styled from 'styled-components/native';

const FlexView = styled.View`
  flex: 1;
`;

const requestPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      return await Geolocation.requestAuthorization('always');
    } else if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (hasPermission) {
        return 'granted';
      } else {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (status === 'granted') {
          return status;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const Main = () => {
  const [location, setLocation] = useState<GeoCoordinates>();

  useEffect(() => {
    console.log(Platform.OS);
    getCurrentPosition();
  }, []);

  const getCurrentPosition = () => {
    requestPermission().then((result) => {
      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          (pos) => {
            setLocation({ ...pos.coords });
          },
          (error) => {
            console.error(error);
          },
        );
      } else {
        console.log('permission denied');
      }
    });
  };

  return (
    <FlexView>
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="marker"
            description="this is marker"
          />
        </MapView>
      ) : (
        <View>
          <Text>Loading...</Text>
        </View>
      )}
    </FlexView>
  );
};

export default Main;
