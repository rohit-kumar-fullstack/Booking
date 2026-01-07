import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { InsideHeader } from '../../Component/Index';
import { useFetchLiveAuction, useFetchPurchaseAuction } from '../../Services/BBPS/Hooks';
import colors from '../../Constant/Color';
import LiveAuction from './LiveAuction';
import PurchaseAuction from './PurchaseAuction';
import { ShoppingCart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';
import FontsFamily from '../../Constant/FontsFamily';
import { useSelector } from 'react-redux';
const TAB_WIDTH = 140;
const TAB_HEIGHT = 44;

const Auction = () => {
  const Navigation = useNavigation() as any
  const { data: liveAuctionData = {} }: any = useFetchLiveAuction();
  const { data: purchaseAuctionData = {} } = useFetchPurchaseAuction();
  const SelectedPurchaseList = useSelector((state: any) => state.selectPurchaseAuction);

  const liveCount = Array.isArray(liveAuctionData?.result)
    ? liveAuctionData?.pages[0]?.totalCount
    : 0;

  const purchaseCount = Array.isArray(purchaseAuctionData?.data)
    ? purchaseAuctionData.data.length
    : 0;

  const [selectedTab, setSelectedTab] = useState<'live' | 'purchase'>('live');

  const translateX = useRef(new Animated.Value(0)).current;

  const onTabPress = (tab: 'live' | 'purchase', index: number) => {
    setSelectedTab(tab);
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <View style={styles.container}>
      <InsideHeader title="Auction" showArrow />

      {/* Switch Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={styles.switchWrapper}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeTab,
              {
                transform: [{ translateX }],
              },
            ]}
          />

          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => onTabPress('live', 0)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'live' && styles.activeText,
              ]}
            >
              Live ({liveCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => onTabPress('purchase', 1)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'purchase' && styles.activeText,
              ]}
            >
              Purchased ({purchaseCount})
            </Text>
          </TouchableOpacity>
        </View>
        {/* Cart */}
        <View>
          {SelectedPurchaseList.length && <View style={{ borderWidth: 2, borderColor: colors.white, backgroundColor: colors.primaryLight, position: 'absolute', borderRadius: 50, zIndex: 20, right: 0, top: -10, paddingHorizontal: 2 }}>
            <Text style={{ fontSize: 12, color: colors.black }}>{SelectedPurchaseList.length}</Text>
          </View>}
          <TouchableOpacity style={{ padding: 10, backgroundColor: colors.primaryLight, borderRadius: 20 }} onPress={() => { Navigation.navigate(NavigationString.PurchaseList) }}>
            <ShoppingCart size={22} color={colors.black} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Content */}
      {selectedTab === 'live' ? <LiveAuction /> : <PurchaseAuction />}
    </View>
  );
};

export default Auction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  /* ---------- Switch UI ---------- */

  switchWrapper: {
    flexDirection: 'row',
    marginVertical: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 18,
    padding: 2,
    height: TAB_HEIGHT,
  },

  tab: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT - 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  tabText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 18,
    fontFamily: FontsFamily.poppinsSemiBold
  },

  activeText: {
    color: colors.primary,
  },

  activeTab: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: TAB_WIDTH,
    height: TAB_HEIGHT - 4,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
