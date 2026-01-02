import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {
  Layers,
  Clock,
  ShoppingCart,
  X,
  FileText,
} from 'lucide-react-native';
import { Header } from '../../Component/Index';
import colors from '../../Constant/Color';
import { useWebSocketService } from '../../socket/Socket';
import Variables from '../../Constant/Variable';
import { useFocusEffect } from '@react-navigation/native';
import { useDashboard } from '../../Services/BBPS/Hooks';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const StatCard = ({ item, index, isLoading }: any) => {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(index * 80, withTiming(0, { duration: 400 }));
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 400 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const Icon = item.icon;

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={[styles.badge, { borderColor: item.color }]}>
          <Icon size={14} color={item.color} />
          <Text style={[styles.badgeText, { color: item.color }]}>
            {item.value}
          </Text>
        </View>
      </View>

      {/* VALUE / LOADER */}
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={item.color}
          style={{ marginTop: 12 }}
        />
      ) : (
        <Text style={styles.value}>{item.value}</Text>
      )}

      <Text style={styles.desc}>{item.desc}</Text>
    </Animated.View>
  );
};

const Home = () => {
  const { data, isLoading } = useDashboard();

  const dashboard = data?.data || {};

  const DASHBOARD_CARDS = [
    {
      title: 'Total Auctions',
      value: dashboard.myAuctionCount ?? 0,
      desc: 'Auctions purchased by you',
      icon: Layers,
      color: '#2563EB',
    },
    {
      title: 'Live Auctions',
      value: dashboard.liveAuctionCount ?? 0,
      desc: 'Currently live',
      icon: Clock,
      color: '#0284C7',
    },
    {
      title: 'Participated Auctions',
      value: dashboard.currentBiddingCount ?? 0,
      desc: 'Participated in auction',
      icon: ShoppingCart,
      color: '#7C3AED',
    },
    {
      title: 'Cancelled Auctions',
      value: dashboard.cancelledAuctionCount ?? 0,
      desc: 'Cancelled by department',
      icon: X,
      color: '#DC2626',
    },

    {
      title: 'Total Tenders',
      value: 0,
      desc: 'Tenders assigned',
      icon: FileText,
      color: '#16A34A',
    },
    {
      title: 'Live Tenders',
      value: 0,
      desc: 'Currently live',
      icon: Clock,
      color: '#059669',
    },
    {
      title: 'Participated Tenders',
      value: 0,
      desc: 'Participated in tender',
      icon: ShoppingCart,
      color: '#0EA5E9',
    },
    {
      title: 'Cancelled Tenders',
      value: 0,
      desc: 'Cancelled by authority',
      icon: X,
      color: '#EF4444',
    },
  ];

  /* ---------------- WebSocket ---------------- */
  const { connect } = useWebSocketService(
    Variables.webSocketUrl,
    () => console.log('WebSocket Connected'),
    error => console.log('WebSocket Error:', error),
  );

  useFocusEffect(() => {
    connect();
  });

  return (
    <View style={styles.screen}>
      <Header title="Dashboard" />

      <FlatList
        data={DASHBOARD_CARDS}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <StatCard
            item={item}
            index={index}
            isLoading={isLoading}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },

  list: {
    padding: 16,
    paddingBottom: 24,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    paddingRight: 8,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  value: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 5,
  },

  desc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
});
