import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
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
      console.log('This function is not available in android.');
    }
  } catch (e) {
    console.error(e);
  }
};

const Main = () => {
  const [location, setLocation] = useState<GeoCoordinates>();

  useEffect(() => {
    requestPermission().then((result) => {
      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          (pos) => {
            setLocation(pos.coords);
            console.log(pos.coords);
          },
          (error) => {
            console.error(error);
          },
        );
      } else {
        console.log('permission denied');
      }
    });
  }, []);

  console.log(location);
  return (
    <FlexView>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.383062,
          longitude: 126.959814,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.383062, longitude: 126.959814 }}
          title="marker"
          description="this is marker"
        />
      </MapView>
    </FlexView>
  );
};

export default Main;
