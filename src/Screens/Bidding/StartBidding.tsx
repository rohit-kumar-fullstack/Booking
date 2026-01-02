import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Layout,
  interpolate,
} from 'react-native-reanimated';
import { InsideHeader } from '../../Component/Index';
import colors from '../../Constant/Color';

/* ---------------- Types ---------------- */
interface AuctionItem {
  id: number;
  productName: string;
  auctionStartValueFigure: number;
  bidVariationValue: number;
  bidAmount: number;
  bidAvilable: number;
  me: boolean;
}

/* ---------------- Dummy Data ---------------- */
const DUMMY_AUCTION = { auctionNumber: 'AUC-2025-001' };
const DUMMY_ITEMS: AuctionItem[] = [
  { id: 1, productName: 'Iron Scrap Lot', auctionStartValueFigure: 20000, bidVariationValue: 500, bidAmount: 20000, bidAvilable: 20000, me: false },
  { id: 2, productName: 'Steel Rod Bundle', auctionStartValueFigure: 35000, bidVariationValue: 1000, bidAmount: 35000, bidAvilable: 35000, me: true },
  { id: 3, productName: 'Copper Wire Roll', auctionStartValueFigure: 15000, bidVariationValue: 250, bidAmount: 15000, bidAvilable: 0, me: false },
];

/* ---------------- Bidding Card ---------------- */
const BiddingCard = ({ item, bidValue, onIncrease, onDecrease, onPlaceBid }: any) => {
  const [expanded, setExpanded] = useState(false);
  const isMin = bidValue <= item.bidAmount;

  const animation = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
    animation.value = withSpring(expanded ? 0 : 1, { damping: 15 });
  };

  const bodyStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(animation.value, [0, 1], [0, 190]),
      opacity: interpolate(animation.value, [0, 0.5, 1], [0, 0, 1]),
      marginTop: interpolate(animation.value, [0, 1], [0, 15]),
    };
  });

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInUp.delay(item.id * 100)}
      style={[styles.card, item.me && styles.leadingCard]}
    >
      {/* Header - Always Visible */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpand}
        style={styles.cardHeader}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.itemIdText}>{DUMMY_AUCTION.auctionNumber}</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={[styles.badge, item.me ? styles.meBadge : styles.liveBadge]}>
            <Text style={[styles.badgeText, item.me ? styles.meText : styles.liveText]}>
              {item.me ? 'LEADING' : 'LIVE'}
            </Text>
          </View>
          <Animated.Text style={[styles.arrow, arrowStyle]}>▼</Animated.Text>
        </View>
      </TouchableOpacity>

      {/* Main Price Info - Always Visible */}
      <View style={styles.priceRow}>
        <View>
          <Text style={styles.label}>Current Bid</Text>
          <Text style={styles.mainPrice}>₹{item.bidAmount.toLocaleString()}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>Increment</Text>
          <Text style={styles.incrementText}>+₹{item.bidVariationValue}</Text>
        </View>
      </View>

      {/* Collapsible Section */}
      <Animated.View style={[styles.collapsibleContainer, bodyStyle]}>
        <View style={styles.divider} />

        <Text style={styles.bidLabel}>Set Your Bid</Text>
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            onPress={onDecrease}
            disabled={isMin}
            style={[styles.stepBtn, isMin && styles.disabledBtn]}
          >
            <Text style={styles.stepText}>−</Text>
          </TouchableOpacity>

          <View style={styles.inputBox}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.bidValueText}>{bidValue.toLocaleString()}</Text>
          </View>

          <TouchableOpacity onPress={onIncrease} style={styles.stepBtn}>
            <Text style={styles.stepText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={onPlaceBid}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>Confirm Bid</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

/* ---------------- Main Screen ---------------- */
const StartBidding = () => {
  const [items, setItems] = useState<AuctionItem[]>(DUMMY_ITEMS);
  const [bidValues, setBidValues] = useState<Record<number, number>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const initial: Record<number, number> = {};
    items.forEach(item => {
      initial[item.id] = item.bidAmount + item.bidVariationValue;
    });
    setBidValues(initial);
  }, []);

  const handleUpdate = (id: number, val: number) => {
    setBidValues(prev => ({ ...prev, [id]: prev[id] + val }));
  };

  const handlePlaceBid = (item: AuctionItem) => {
    Alert.alert('Confirm', `Place bid for ₹${bidValues[item.id]}?`, [
      { text: 'No' },
      {
        text: 'Yes, Bid',
        onPress: () => {
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, bidAmount: bidValues[item.id], me: true } : i));
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <InsideHeader title="Bidding Panel" showArrow />
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BiddingCard
            item={item}
            bidValue={bidValues[item.id] || 0}
            onIncrease={() => handleUpdate(item.id, item.bidVariationValue)}
            onDecrease={() => handleUpdate(item.id, -item.bidVariationValue)}
            onPlaceBid={() => handlePlaceBid(item)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      {showSuccess && (
        <View style={styles.overlay}>
          <LottieView
            source={require('../../lottie/Success.json')}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
    </View>
  );
};

export default StartBidding;

/* ---------------- Modern Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 2 } }),
  },
  leadingCard: { borderColor: '#22C55E', borderWidth: 2, backgroundColor: '#F0FDF4' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  itemIdText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  liveBadge: { backgroundColor: '#FEE2E2' },
  meBadge: { backgroundColor: '#BBF7D0' },
  badgeText: { fontSize: 10, fontWeight: '900' },
  liveText: { color: '#EF4444' },
  meText: { color: '#15803D' },
  arrow: { fontSize: 10, color: '#94A3B8' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  label: { fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', fontWeight: '600' },
  mainPrice: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  incrementText: { fontSize: 16, fontWeight: '700', color: '#3B82F6' },
  collapsibleContainer: { overflow: 'hidden' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  bidLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 10 },
  stepperContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  stepBtn: { width: 45, height: 45, backgroundColor: colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  stepText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  inputBox: { flex: 1, height: 45, backgroundColor: '#F1F5F9', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  currency: { fontSize: 16, fontWeight: 'bold', color: '#64748B', marginRight: 4 },
  bidValueText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  submitBtn: { height: 50, backgroundColor: colors.primary, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 99 },
});