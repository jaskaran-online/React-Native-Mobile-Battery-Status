import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import * as Battery from 'expo-battery';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryLevelColor, setBatteryLevelColor] = useState('white');
  const [isBatteryCharging, setBatteryCharging] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    let batterySubscription: { remove: any; } | null = null;
    
    const updateBatteryStatus = async () => {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();

      setBatteryLevel(Math.round(level * 100));
      setBatteryCharging(state === Battery.BatteryState.CHARGING);

      updateBatteryColor(Math.round(level * 100));
    };

    const subscribeToBatteryUpdates = async () => {
      batterySubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
        const level = Math.round(batteryLevel * 100);
        setBatteryLevel(level);
        updateBatteryColor(level);
      });

      Battery.addBatteryStateListener(({ batteryState }) => {
        setBatteryCharging(batteryState === Battery.BatteryState.CHARGING);
      });
    };

    updateBatteryStatus();
    subscribeToBatteryUpdates();

    return () => {
      if (batterySubscription) {
        batterySubscription.remove();
      }
    };
  }, []);

  const updateBatteryColor = (level: number) => {
    let color =
      level <= 20
        ? '#F0001D'
        : level >= 80
        ? '#4A90E2'
        : '#4A8B00';
    setBatteryLevelColor(color);
  };

  if (!loaded) {
    return null;
  }

  const getAnimationStyle = () => {
    const baseStyle = {
      position: 'absolute',
      width: '90%',
      height: '60%',
    };

    if (batteryLevel <= 20) {
      return {
        ...baseStyle,
        bottom: batteryLevel, // Changed from `${batteryLevel}%` to batteryLevel
      };
    } else if (batteryLevel >= 80) {
      return {
        ...baseStyle,
        bottom: batteryLevel - 30, // Changed from `${batteryLevel - 30}%` to batteryLevel - 30
      };
    } else {
      return {
        ...baseStyle,
        bottom: batteryLevel - 15, // Changed from `${batteryLevel - 15}%` to batteryLevel - 15
      };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={batteryLevelColor} style="dark" />
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/battery.png')}
          style={styles.backgroundImg}
        />
        <View
          style={[
            styles.batteryLevelStyle,
            {
              backgroundColor: batteryLevelColor,
              height: `${batteryLevel}%`,
            },
          ]}
        />

        <LottieView
          source={
            batteryLevel <= 20
              ? require('../assets/red.json')
              : batteryLevel >= 80
              ? require('../assets/blue.json')
              : require('../assets/green.json')
          }
          autoPlay
          loop
          style={getAnimationStyle()}
        />

        <Text
          allowFontScaling={false}
          style={{
            color:
              batteryLevel >= 55
                ? 'yellow'
                : batteryLevel <= 20
                ? '#F0001D'
                : batteryLevel > 25
                ? 'black'
                : '#4A90E2',
            fontSize: 55,
            position: 'absolute',
            fontWeight: 'bold',
          }}>
          {batteryLevel}%
        </Text>
        {isBatteryCharging && (
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
              source={require('../assets/charging.json')}
              autoPlay
              loop
              style={{
                width: 70,
                height: 70,
              }}
            />
          </View>
        )}
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

      {isBatteryCharging && (
        <Text
          allowFontScaling={false}
          style={[styles.chargingText, {color: batteryLevelColor}]}>
          Charger Connected
        </Text>
      )}

      <Text style={{position: 'absolute', bottom: 0, fontSize: 15, marginBottom: 30, color: 'gray'}}>Developed by: <Text style={{color: 'blue'}}>@jaskaran_singh</Text></Text>
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
    alignItems: 'center',
    justifyContent: 'center',
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