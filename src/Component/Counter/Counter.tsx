import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import colors from '../../Constant/Color';

const Counter = ({ toValue = 1000, duration = 2000 }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue,
            duration,
            useNativeDriver: false, 
        }).start();

        const listener = animatedValue.addListener(({ value }) => {
            setDisplayValue(Math.floor(value));
        });

        return () => {
            animatedValue.removeListener(listener);
        };
    }, [toValue]);

    return (
        <View style={styles.container}>
            <Text style={styles.counterText}>{displayValue}</Text>
        </View>
    );
};

export default Counter

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        padding: 5,
        borderRadius: 5,
    },
    counterText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
});
