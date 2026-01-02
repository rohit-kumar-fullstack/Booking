import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../Constant/Color';
import moment from 'moment';

interface CountdownTimerProps {
  endDate: string; // Expected format: "DD-MM-YYYY HH:mm:ss"
}

const CountdownTimer: React.FC<CountdownTimerProps> = React.memo(({ endDate }) => {
  const calculateTimeLeft = useCallback(() => {
    if (!endDate) return null;

    const end = moment(endDate, 'DD-MM-YYYY HH:mm:ss');
    if (!end.isValid()) return null;

    const now = moment();
    const diff = end.diff(now);
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [endDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timerId = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timerId);
  }, [calculateTimeLeft]);

  if (!timeLeft) {
    return (
      <View style={styles.container}>
        <Text style={styles.expiredText}>Time's up!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </Text>
    </View>
  );
});

export default CountdownTimer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  expiredText: {
    fontSize: 12,
    color: 'red',
  },
});
