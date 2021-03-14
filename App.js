import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import DeviceBattery from 'react-native-device-battery';
import LottieView from 'lottie-react-native';

export default function App() {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryLevelColor, setBatteryLevelColor] = useState('green');
  const [isBatteryCharging, setBatteryCharging] = useState(false);

  DeviceBattery.getBatteryLevel().then((level) => {
    setBatteryLevel(Math.round(level * 100));
    // setBatteryLevel(10);

    let color =
      batteryLevel <= 20 ? 'red' : batteryLevel >= 85 ? 'dodgerblue' : 'green';
    setBatteryLevelColor(color);
  });

  DeviceBattery.isCharging().then((isCharging) => {
    setBatteryCharging(isCharging);
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={batteryLevelColor} />
      <View
        style={{
          height: '50%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          backgroundColor: 'white',
        }}>
        <Image
          source={require('./assets/battery.png')}
          style={{
            resizeMode: 'cover',
            height: '100%',
            width: '100%',
            zIndex: 99999,
          }}
        />
        <View
          style={{
            backgroundColor: batteryLevelColor,
            height: batteryLevel + '%',
            width: '100%',
            bottom: 1,
            position: 'absolute',
          }}
        />
        <Text
          allowFontScaling={false}
          style={{
            color:
              batteryLevel >= 55
                ? 'yellow'
                : batteryLevel <= 20
                ? 'red'
                : batteryLevel > 43
                ? 'black'
                : 'dodgerblue',
            fontSize: 55,
            position: 'absolute',
            fontWeight: 'bold',
          }}>
          {batteryLevel}%
        </Text>
        {isBatteryCharging ? (
          <LottieView
            source={require('./assets/charging.json')}
            autoPlay
            loop
            style={{
              height: 90,
              width: 90,
              position: 'absolute',
              bottom: 10,
            }}
          />
        ) : null}
      </View>

      <Text
        allowFontScaling={false}
        style={{
          fontSize: 30,
          marginTop: 30,
          fontWeight: 'bold',
          color: 'black',
        }}>
        {' '}
        Battery Level {batteryLevel}%
      </Text>

      {isBatteryCharging ? (
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 33,
            fontWeight: '700',
            color: batteryLevelColor,
            marginTop: 20,
            elevation: 10,
          }}>
          Charger Connected
        </Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
