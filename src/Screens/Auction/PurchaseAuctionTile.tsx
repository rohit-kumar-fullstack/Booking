import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import moment from 'moment';
import CountdownTimer from '../../Component/Counter/CountdownTimer';
import colors from '../../Constant/Color';

const PurchaseAuctionTile = ({
  item,
  onPressDetails,
  onStartBidding,
  buttonEnable,
  isAuctionEnd,
}: any) => {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(8);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      elevation: elevation.value, // Android-safe
    };
  }, []);

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 120 });
    elevation.value = withTiming(3, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 160 });
    elevation.value = withTiming(8, { duration: 160 });
  };

  const statusColor = isAuctionEnd
    ? '#EF4444'
    : buttonEnable
    ? colors.primary
    : '#94A3B8';

  const lightStatusBg = isAuctionEnd
    ? '#FEF2F2'
    : buttonEnable
    ? '#EFF6FF'
    : '#F8FAFC';

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      style={[styles.shadowContainer, animatedStyle]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPressDetails}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardInternal}
      >
        <View style={[styles.statusAccent, { backgroundColor: statusColor }]} />

        <View style={styles.mainInfo}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <View style={[styles.statusBadge, { backgroundColor: lightStatusBg }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {isAuctionEnd ? 'ENDED' : buttonEnable ? 'LIVE' : 'PENDING'}
                </Text>
              </View>
              <Text style={styles.title}>{item.auctionNumber}</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amount}>
                ₹{item.auctionFees?.toLocaleString()}
              </Text>
              <Text style={styles.feeLabel}>Auction Fee</Text>
            </View>
          </View>

          {/* Date */}
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>
              <Text style={styles.dateLabel}>Bidding Ends: </Text>
              {moment(item?.keyDates?.auctionBidding?.endDateTime).format(
                'DD MMM, hh:mm A'
              )}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerTop}>
              <Text style={styles.footerLabel}>Remaining Time</Text>
              {buttonEnable && !isAuctionEnd ? (
                <CountdownTimer
                  endDate={item.keyDates.auctionBidding.endDateTime}
                />
              ) : (
                <Text style={styles.endedText}>--:--:--</Text>
              )}
            </View>

            <TouchableOpacity
              disabled={!buttonEnable}
              onPress={onStartBidding}
              activeOpacity={0.85}
              style={[
                styles.actionButton,
                { backgroundColor: statusColor },
                !buttonEnable && styles.disabledButton,
              ]}
            >
              <Text style={styles.addText}>
                {isAuctionEnd
                  ? 'Bidding Closed'
                  : !buttonEnable
                  ? 'Payment Required'
                  : 'Proceed to Start Bidding'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PurchaseAuctionTile;

const styles = StyleSheet.create({
    shadowContainer: {
        marginHorizontal: 5,
        marginTop: 14,
        marginBottom: 6,
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 8,
    },
    cardInternal: {
        borderRadius: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    statusAccent: {
        width: 5,
        height: '100%',
    },
    mainInfo: {
        flex: 1,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginBottom: 6,
        alignSelf: 'flex-start',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    title: {
        fontWeight: '800',
        fontSize: 16,
        color: '#1E293B',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontWeight: '900',
        fontSize: 18,
        color: '#0F172A',
    },
    feeLabel: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '500',
    },
    dateRow: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    dateText: {
        fontSize: 12,
        color: '#334155',
        fontWeight: '600',
    },
    dateLabel: {
        fontWeight: '400',
        color: '#64748B',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
    },
    footerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    footerLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94A3B8',
        textTransform: 'uppercase',
    },
    endedText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#CBD5E1',
    },
    actionButton: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
    },
    disabledButton: {
        backgroundColor: '#E2E8F0',
    },
    addText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
});
