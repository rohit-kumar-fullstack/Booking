import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ChevronDown, Trash2, Info } from 'lucide-react-native';
import { InsideHeader } from '../../Component/Index';
import colors from '../../Constant/Color';
import { useNavigation } from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';
import { useDispatch, useSelector } from 'react-redux';
import { togglePurchaseAuction } from '../../Redux/Slices/selectPurchaseAuction';

const PurchaseList = () => {
  const Navigation: any = useNavigation()
  const Dispatch = useDispatch()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const SelectedPurchaseList = useSelector((state: any) => state.selectPurchaseAuction);
  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <View style={styles.screen}>
      <InsideHeader title="Purchase" showArrow />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Purchase List</Text>
          <Info size={20} color="#0F172A" />
        </View>

        {/* Cards */}
        {SelectedPurchaseList.map((item: any, index: any) => {
          const expanded = expandedIndex === index;
          return (
            <Animated.View
              key={item.auctionId}
              layout={Layout.springify()}
              style={styles.card}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => toggleExpand(index)}
              >
                <CardHeader
                  title={item.auctionOfWork}
                  expanded={expanded}
                />

                <Text style={styles.subTitle}>
                  Auction No: {item.auctionNumber}
                </Text>

                <Text style={styles.subTitle}>
                  Status:{' '}
                  <Text
                    style={{
                      color: item.status ? '#16A34A' : '#DC2626',
                      fontWeight: '700',
                    }}
                  >
                    {item.status ? 'Open' : 'Closed'}
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Expanded Content */}
              {expanded && (
                <Animated.View
                  entering={FadeIn.duration(220)}
                  exiting={FadeOut.duration(180)}
                  layout={Layout.springify()}
                  style={styles.details}
                >
                  {renderRow('Auction Mode', item.auctionMode)}
                  {renderRow('Pattern', item.auctionPattern)}
                  {renderRow('Fees', `₹ ${item.auctionFees}`)}
                  {renderRow('Department', item.deptName)}
                  {renderRow('Purchase End', item.purchaseEnd)}

                  <TouchableOpacity style={styles.removeButton} onPress={() => { Dispatch(togglePurchaseAuction(item)) }}>
                    <Trash2 size={18} color="#fff" />
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <TouchableOpacity disabled={Boolean(!SelectedPurchaseList.length)} style={[styles.proceedButton, { backgroundColor: Boolean(!SelectedPurchaseList.length) ? colors.lightText : colors.primary }]} onPress={() => { Navigation.navigate(NavigationString.PurchaseAuctionList) }}>
        <Text style={styles.proceedText}>Proceed to Purchase</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PurchaseList;

const CardHeader = ({ title, expanded }: {
  title: string;
  expanded: boolean;
}) => {
  const rotation = useSharedValue(expanded ? 1 : 0);
  rotation.value = withTiming(expanded ? 1 : 0, { duration: 220 });
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  return (
    <View style={styles.cardHeader}>
      <Text style={styles.title}>{title}</Text>
      <Animated.View style={arrowStyle}>
        <ChevronDown size={22} color={colors.black} />
      </Animated.View>
    </View>
  );
};

const renderRow = (label: string, value: string) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 16,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.black,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 12,
  },
  subTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
  },
  details: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  row: {
    marginVertical: 6,
  },
  label: {
    fontSize: 13,
    color: '#64748B',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  removeButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  removeText: {
    color: '#fff',
    fontWeight: '700',
  },
  proceedButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  proceedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
