import React, { FC, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import colors from '../../Constant/Color';

interface CardProps {
  title: string;
  leftLabel: string;
  leftValue: React.ReactNode;
  rightLabel: string;
  rightValue: React.ReactNode;
  buttonText: string;
  onPress: () => void;
}

const Card: FC<CardProps> = ({
  title,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  buttonText,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.outer, { transform: [{ scale }] }]}>
      {/* Glass Base */}
      {Platform.OS === 'ios' && (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="#ffffff"
        />
      )}

      {/* Card Body */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.85)',
          'rgba(255,255,255,0.65)',
        ]}
        style={styles.card}
      >
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{leftValue}</Text>
            <Text style={styles.statLabel}>{leftLabel}</Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{rightValue}</Text>
            <Text style={styles.statLabel}>{rightLabel}</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>{buttonText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

export default Card;


const styles = StyleSheet.create({
  outer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },

  card: {
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#020617',
  },

  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
    marginTop: 4,
  },

  verticalDivider: {
    width: 1,
    height: 42,
    backgroundColor: 'rgba(15,23,42,0.15)',
  },

  ctaButton: {
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ctaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
