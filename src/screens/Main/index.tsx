import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';

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

  return (
    <View>
      <Text>{location?.latitude}</Text>
      <Text>{location?.longitude}</Text>
    </View>
  );
};

export default Main;
