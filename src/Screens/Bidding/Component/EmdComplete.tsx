import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import colors from '../../../Constant/Color';

const EmdComplete = ({ onNext }: { onNext?: () => void }) => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../../lottie/confetti.json')}
                autoPlay
                loop={true}
                style={styles.confetti}
            />

            <LottieView
                source={require('../../../lottie/Success.json')}
                autoPlay
                loop={true}
                style={styles.success}
            />

            <Animated.Text entering={FadeInUp.delay(400).duration(700)} style={styles.title}>
                EMD Complete
            </Animated.Text>

            <Animated.Text entering={FadeInUp.delay(700).duration(700)} style={styles.subText} >
                Your submission was successful
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(900).duration(700)} style={styles.nextWrapper}  >
                <TouchableOpacity activeOpacity={0.85} style={styles.nextBtn} onPress={onNext}   >
                    <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default EmdComplete;

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },

    confetti: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
    },

    success: {
        width: 220,
        height: 220,
        marginTop: -100
    },

    title: {
        marginTop: 16,
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: 0.5,
    },

    subText: {
        marginTop: 8,
        fontSize: 14,
        color: '#475569',
    },

    /* ---------- Floating Next Button ---------- */
    nextWrapper: {
        position: 'absolute',
        right: 20,
        bottom: 30,
    },

    nextBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 26,
        paddingVertical: 14,
        borderRadius: 28,

        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 6,
    },

    nextText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.4,
    },
});
