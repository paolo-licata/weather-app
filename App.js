import React from 'react';
import { View } from 'react-native';
import { WeatherApp } from './MainPage';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <WeatherApp />
    </View>
  );
}