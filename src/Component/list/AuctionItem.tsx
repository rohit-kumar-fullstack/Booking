import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import colors from '../../Constant/Color';

interface AuctionItemProps {
  item: any;
  index: number;
}

const AuctionItem: React.FC<AuctionItemProps> = ({ item, index }) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
      delay: index * 50,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.itemCard, { transform: [{ scale }] }]}>
      <Text style={styles.itemTitle}>{item.title || `${item.auctionNumber}`}</Text>
      <Text style={styles.itemDate}>End Date: {item.purchaseEnd || 'N/A'} </Text>
    </Animated.View>
  );
};

export default AuctionItem;

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#020617',
  },
  itemDate: {
    fontSize: 13,
    color: '#64748b',
  },
});
