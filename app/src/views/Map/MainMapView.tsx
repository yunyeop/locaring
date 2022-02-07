import NaverMapView, { Circle, Marker, Path, Polyline, Polygon } from 'react-native-nmap';
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
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

const MainMapView = () => {
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
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
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
        <NMap />
      ) : (
        <View>
          <Text>Loading...</Text>
        </View>
      )}
    </FlexView>
  );
};

const NMap = () => {
  const P0 = { latitude: 37.564362, longitude: 126.977011 };
  const P1 = { latitude: 37.565051, longitude: 126.978567 };
  const P2 = { latitude: 37.565383, longitude: 126.976292 };

  return (
    <NaverMapView
      style={{ width: '100%', height: '100%' }}
      showsMyLocationButton={true}
      center={{ ...P0, zoom: 16 }}
      // onTouch={(e) => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
      onCameraChange={(e) => console.warn('onCameraChange', JSON.stringify(e))}
      onMapClick={(e) => console.warn('onMapClick', JSON.stringify(e))}
    >
      <Marker coordinate={P0} onClick={() => console.warn('onClick! p0')} />
      <Marker coordinate={P1} pinColor="blue" onClick={() => console.warn('onClick! p1')} />
      <Marker coordinate={P2} pinColor="red" onClick={() => console.warn('onClick! p2')} />
      <Path coordinates={[P0, P1]} onClick={() => console.warn('onClick! path')} width={10} />
      <Polyline coordinates={[P1, P2]} onClick={() => console.warn('onClick! polyline')} />
      <Circle
        coordinate={P0}
        color={'rgba(255,0,0,0.3)'}
        radius={200}
        onClick={() => console.warn('onClick! circle')}
      />
      <Polygon
        coordinates={[P0, P1, P2]}
        color={'rgba(0, 0, 0, 0.5)'}
        onClick={() => console.warn('onClick! polygon')}
      />
    </NaverMapView>
  );
};

export default MainMapView;
