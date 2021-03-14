import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import DeviceBattery from 'react-native-device-battery';
import LottieView from 'lottie-react-native';

export default function App() {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryLevelColor, setBatteryLevelColor] = useState('white');
  const [isBatteryCharging, setBatteryCharging] = useState(false);

  onBatteryStateChanged = (batteryStatus) => {
    setBatteryCharging(batteryStatus.charging);
    // setBatteryLevel(Math.round(batteryStatus.level * 100));
    setBatteryLevel(30);

    let color =
      batteryLevel <= 20
        ? '#F0001D'
        : batteryLevel >= 85
        ? '#4A90E2'
        : '#5EAF00';
    setBatteryLevelColor(color);
  };

  DeviceBattery.addListener(onBatteryStateChanged);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={batteryLevelColor} />
      <View style={styles.innerContainer}>
        <Image
          source={require('./assets/battery.png')}
          style={styles.backgroundImg}
        />
        <View
          style={[
            styles.batteryLevelStyle,
            {
              backgroundColor: batteryLevelColor,
              height: batteryLevel + '%',
            },
          ]}
        />

        {batteryLevel <= 20 ? (
          <LottieView
            source={require('./assets/redlayer.json')}
            autoPlay
            loop
            style={{
              position: 'absolute',
              width: '80%',
              bottom: batteryLevel - 4,
              transform: [{rotate: '90deg'}],
            }}
          />
        ) : batteryLevel >= 85 ? (
          <LottieView
            source={require('./assets/bluelayer.json')}
            autoPlay
            loop
            // style={{
            //   // position: 'absolute',
            //   width: '80%',
            //   // bottom: batteryLevel - 4,
            //   transform: [{rotate: '90deg'}],
            // }}
          />
        ) : (
          <LottieView
            source={require('./assets/greenlayer.json')}
            autoPlay
            loop
            style={{
              position: 'absolute',
              width: '80%',
              bottom: batteryLevel - 3,
            }}
          />
        )}

        <Text
          allowFontScaling={false}
          style={{
            color:
              batteryLevel >= 55
                ? 'yellow'
                : batteryLevel <= 20
                ? '#F0001D'
                : batteryLevel > 43
                ? 'black'
                : '#4A90E2',
            fontSize: 55,
            position: 'absolute',
            fontWeight: 'bold',
          }}>
          {batteryLevel}%
        </Text>
        {isBatteryCharging ? (
          <View
            style={{
              height: 70,
              width: 70,
              position: 'absolute',
              bottom: 30,
              backgroundColor: '#1c1c1c',
              borderRadius: 100,
              elevation: 6,
              borderWidth: 0.6,
              borderColor: '#1c1c1c',
            }}>
            <LottieView
              source={require('./assets/charging.json')}
              autoPlay
              loop
            />
          </View>
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
          style={[styles.chargingText, {color: batteryLevelColor}]}>
          Charger Connected
        </Text>
      ) : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backgroundImg: {
    flex: 1,
    resizeMode: 'contain',
    zIndex: 99999,
  },
  chargingText: {
    fontSize: 33,
    fontWeight: '700',
    marginTop: 20,
    elevation: 10,
  },
  batteryLevelStyle: {width: '55%', bottom: 1, position: 'absolute'},
  innerContainer: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'white',
  },
});
