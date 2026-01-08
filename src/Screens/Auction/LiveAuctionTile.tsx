import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import colors from '../../Constant/Color';
import { LiveAuctionTileProps } from './types/types';
import AuctionDetail from './Modal/AuctionDetail';
import { Calendar, Tag, Info, ArrowRight } from 'lucide-react-native';

const LiveAuctionTile: React.FC<LiveAuctionTileProps> = ({
  data,
  isPurchased = false,
  onPurchasePress,
  auctionDispatchDate,
  auctionOfWork,
  purchaseEnd,
  auctionFees,
  auctionNumber,
}) => {
  const [showDetail, setShowDetail] = React.useState(false);
  const purchaseEnded = moment().isAfter(moment(purchaseEnd, 'DD-MM-YYYY HH:mm:ss'));

  return (
    <View style={styles.cardWrapper}>
      {
        !showDetail ?
          <>
            <View
              style={[
                styles.statusTag,
                { backgroundColor: isPurchased ? colors.error : purchaseEnded ? '#94a3b8' : '#4ade80' },
              ]}
            />
            <View
              style={styles.container}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.badge} onPress={() => setShowDetail(true)}>
                  <Tag size={14} color={colors.primary} />
                  <Text style={styles.badgeText}>#{auctionNumber}</Text>
                </TouchableOpacity>
                <Text style={styles.priceText}>₹{auctionFees}</Text>
              </View>

              {/* Work Title */}
              <Text style={styles.workTitle} numberOfLines={2}>
                {auctionOfWork ?? 'General Auction Work'}
              </Text>

              {/* Info Grid */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Calendar size={16} color="#64748b" />
                  <View style={styles.infoTextGroup}>
                    <Text style={styles.infoLabel}>Start</Text>
                    <Text style={styles.infoValue}>{auctionDispatchDate ?? '-'}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Calendar size={16} color={purchaseEnded ? "#ef4444" : "#22c55e"} />
                  <View style={styles.infoTextGroup}>
                    <Text style={styles.infoLabel}>Deadline</Text>
                    <Text style={[styles.infoValue, purchaseEnded && { color: '#ef4444' }]}>
                      {moment(purchaseEnd, 'DD-MM-YYYY HH:mm:ss').format('DD MMM, YY')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Bar */}
              <View style={styles.actionBar}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => setShowDetail(true)}>
                  <Info size={18} color={colors.primary} />
                  <Text style={styles.iconBtnText}>Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.mainButton,
                    purchaseEnded
                      ? styles.btnDisabled
                      : !data.active ? { backgroundColor: 'lightgray' } : isPurchased
                        ? styles.btnPurchased
                        : styles.btnActive,
                  ]}
                  onPress={onPurchasePress}
                  disabled={purchaseEnded ? true : data.active ? false : true}
                >
                  <Text
                    style={[
                      styles.mainButtonText,
                      isPurchased && !purchaseEnded ? { color: colors.white } : { color: '#fff' },
                    ]}
                  >
                    {purchaseEnded ? 'Expired' : !data.active ? 'Purchased' : isPurchased ? 'Remove' : 'Add to Cart'}
                  </Text>
                  {!purchaseEnded && (
                    <ArrowRight size={16} color={isPurchased ? colors.white : '#fff'} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Auction Detail Modal */}
            </View>
          </>
          : <AuctionDetail visible={showDetail} data={data} onClose={() => setShowDetail(false)} />
      }

    </View>
  );
};

export default memo(LiveAuctionTile);

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    overflow: 'hidden',

    // Modern shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  statusTag: {
    width: 6,
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '25',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  workTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 24,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f4f8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 18,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoTextGroup: {
    flexDirection: 'column',
  },
  infoLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
  },
  iconBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  mainButton: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnActive: {
    backgroundColor: '#4ade80', // light green
  },
  btnPurchased: {
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.error,
  },
  btnDisabled: {
    backgroundColor: '#e2e8f0',
  },
  mainButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
