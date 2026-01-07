import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import colors from '../../Constant/Color';
import { LiveTenderTileProps } from './types/types';
import { Calendar, Tag, Info, ArrowRight } from 'lucide-react-native';
import TenderDetail from './Modal/TenderDetail';

const LiveTenderTile: React.FC<LiveTenderTileProps> = ({
  data,
  isPurchased = false,
  onPurchasePress,
  tenderDispatchDate,
  tenderOfWork,
  purchaseEnd,
  tenderFees,
  tenderNumber,
}) => {
  const [showDetail, setShowDetail] = React.useState(false);
  const purchaseEnded = moment().isAfter(moment(purchaseEnd, 'DD-MM-YYYY HH:mm:ss'));

  return (
    <View style={styles.cardWrapper}>
      {/* Status Tag */}
      <View
        style={[
          styles.statusTag,
          { backgroundColor: isPurchased ? colors.error : purchaseEnded ? '#94a3b8' : '#4ade80' },
        ]}
      />

      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.9}
        onPress={() => setShowDetail(true)}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Tag size={14} color={colors.primary} />
            <Text style={styles.badgeText}>#{tenderNumber}</Text>
          </View>
          <Text style={styles.priceText}>₹{tenderFees}</Text>
        </View>

        {/* Work Title */}
        <Text style={styles.workTitle} numberOfLines={2}>
          {tenderOfWork ?? 'General Tender Work'}
        </Text>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Calendar size={16} color="#64748b" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Start</Text>
              <Text style={styles.infoValue}>{tenderDispatchDate ?? '-'}</Text>
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
                : isPurchased
                  ? styles.btnPurchased
                  : styles.btnActive,
            ]}
            onPress={onPurchasePress}
            disabled={purchaseEnded}
          >
            <Text
              style={[
                styles.mainButtonText,
                isPurchased && !purchaseEnded ? { color: colors.white } : { color: '#fff' },
              ]}
            >
              {purchaseEnded ? 'Expired' : isPurchased ? 'Remove' : 'Add to Cart'}
            </Text>
            {!purchaseEnded && (
              <ArrowRight size={16} color={isPurchased ? colors.white : '#fff'} />
            )}
          </TouchableOpacity>
        </View>

        {/* Tender Detail Modal */}
        <TenderDetail visible={showDetail} data={data} onClose={() => setShowDetail(false)} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(LiveTenderTile);

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
