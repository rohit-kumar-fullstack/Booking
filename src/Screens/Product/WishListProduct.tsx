import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import XMenu from '../../Component/AnimatedHamburger';
import { useIsConnected } from 'react-native-offline';

// Main component
const WishListProduct = () => {
  const isConnected = useIsConnected();

  // 🔹 Local state to trigger re-render
  const [count, setCount] = useState(0);

  const getData = () => {
    console.log(isConnected, 'isConnected');
    // Trigger re-render
    setCount(prev => prev + 1);
  };

  const setData = () => {
    // Another re-render
    setCount(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <XMenu />
      <Pressable style={styles.button} onPress={getData}>
        <Text style={styles.buttonText}>Get Data (Re-render)</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={setData}>
        <Text style={styles.buttonText}>Set Data (Re-render)</Text>
      </Pressable>

      <Text style={{ marginTop: 20 }}>Render Count: {count}</Text>
    </View>
  );
};

// 🔹 why-did-you-render tracking
WishListProduct.whyDidYouRender = true;

export default memo(WishListProduct);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});