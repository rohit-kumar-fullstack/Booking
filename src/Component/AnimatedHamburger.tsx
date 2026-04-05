import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

type Props = {
    size?: number;
    color?: string;
    onToggle?: (open: boolean) => void;
};

const Hamburger = ({ size = 24, color = '#000', onToggle }: Props) => {
    const open = useSharedValue(0);

    const toggle = () => {
        const newValue = open.value === 0 ? 1 : 0;
        open.value = withTiming(newValue, { duration: 300 });
        onToggle?.(!!newValue);
    };

    const LINE_HEIGHT = 2.5;
    const SPACING = 8; // adjust if needed

    // 🔥 TOP LINE
    const topStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            transform: [
                { translateY: withTiming(open.value ? 0 : -SPACING) },
                { rotate: `${open.value * 45}deg` },
            ],
        };
    });

    // 🔥 MIDDLE LINE
    const middleStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            opacity: withTiming(open.value ? 0 : 1),
        };
    });

    // 🔥 BOTTOM LINE
    const bottomStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            transform: [
                { translateY: withTiming(open.value ? 0 : SPACING) },
                { rotate: `${open.value * -45}deg` },
            ],
        };
    });

    return (
        <Pressable
            onPress={toggle}
            style={({ pressed }) => [
                styles.container,
                {
                    width: size + 20,
                    height: size + 20,
                    transform: [{ scale: pressed ? 0.9 : 1 }],
                },
            ]}
        >
            <View style={[styles.wrapper, { width: size, height: size }]}>

                {/* 🔥 TOP */}
                <Animated.View
                    style={[
                        styles.line,
                        {
                            width: size,
                            height: LINE_HEIGHT,
                            backgroundColor: color,
                        },
                        topStyle,
                    ]}
                />

                {/* 🔥 MIDDLE */}
                <Animated.View
                    style={[
                        styles.line,
                        {
                            width: size,
                            height: LINE_HEIGHT,
                            backgroundColor: color,
                        },
                        middleStyle,
                    ]}
                />

                {/* 🔥 BOTTOM */}
                <Animated.View
                    style={[
                        styles.line,
                        {
                            width: size,
                            height: LINE_HEIGHT,
                            backgroundColor: color,
                        },
                        bottomStyle,
                    ]}
                />

            </View>
        </Pressable>
    );
};

export default Hamburger;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        borderRadius: 2,
    },
});