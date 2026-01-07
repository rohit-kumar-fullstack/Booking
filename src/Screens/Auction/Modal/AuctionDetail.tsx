import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import { Briefcase, Calendar, FileText, Download, Eye, Layers, ArrowLeft, Clock } from 'lucide-react-native';
import colors from '../../../Constant/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuctionItemDetail from './AuctionItemDetail';

interface Props {
  visible: boolean;
  onClose: () => void;
  data?: any;
}

const AuctionFullDetail: React.FC<Props> = ({ visible, onClose, data }) => {
  const inset = useSafeAreaInsets()
  const [allBoolean, setAllBoolean] = useState({ showItemDetail: false })
  const formatDate = (date?: string) => {
    if (!date) return '-';
    return moment(date, 'DD-MM-YYYY HH:mm:ss').format('DD MMM YYYY, hh:mm A');
  };

  const isLive = data?.purchaseEnd
    ? moment().isBefore(moment(data.purchaseEnd, 'DD-MM-YYYY HH:mm:ss'))
    : false;

  // Internal Components
  const Section = ({ title, icon: Icon, children }: any) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Icon size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const InfoBox = ({ label, value, full = false }: any) => (
    <View style={[styles.infoBox, full ? { width: '100%' } : { width: '48%' }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );

  return (
    <Modal
      isVisible={visible}
      style={styles.fullModal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={360}
      animationOutTiming={280}
      statusBarTranslucent
      backdropColor="transparent"
      backdropOpacity={0}
    >
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Full Header */}
        <View style={[styles.header, { paddingTop: inset.top }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <ArrowLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleText}>Auction Overview</Text>
            <Text style={styles.headerIdText}>Ref: {data?.auctionNumber || 'N/A'}</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={[styles.dot, { backgroundColor: isLive ? '#22c55e' : '#94a3b8' }]} />
            <Text style={styles.liveText}>{isLive ? 'LIVE' : 'CLOSED'}</Text>
          </View>
        </View>

        {/* Scrollable Body */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* 1. Basic Info Grid */}
          <Section title="Details" icon={Layers}>
            <View style={styles.grid}>
              <InfoBox label="Auction No." value={data?.auctionNumber} />
              <InfoBox label="Pattern" value={data?.auctionPattern || 'Forward'} />
              <InfoBox label="Mode" value={data?.auctionMode || 'Open'} />
              <InfoBox label="Category" value={data?.categoryOfAuction || 'General'} />
              <InfoBox label="EMD Type" value={data?.emd || 'Online'} />
              <InfoBox label="EMD Figure" value={data?.emdFigure || 'Item Wise'} />
            </View>
          </Section>

          {/* 2. Work Description */}
          <Section title="Auction Details" icon={Briefcase}>
            <View style={styles.grid}>
              <InfoBox label="Auction Name" value={'Auction of cars'} />
              <InfoBox label="Category Of Auction " value={'Live'} />
              <InfoBox label="Auto Time Increment " value={'yes'} />
              <InfoBox label="Auction Fees (In Figure) " value={'500'} />
              <InfoBox label="Auction Fees (In Words)" value={'Five Hundred'} />
              <InfoBox label="Auction Keyword" value={'Dev Furniture, Furnture'} />
            </View>
          </Section>

          {/* 3. Timeline Section */}
          <Section title="Key Dates" icon={Calendar}>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineRow}>
                <View style={styles.iconCircle}><Clock size={16} color="#64748b" /></View>
                <View>
                  <Text style={styles.label}>Auction Purchase (Start)</Text>
                  <Text style={styles.value}>{formatDate(data?.auctionDispatchDate)}</Text>
                </View>
              </View>
              <View style={styles.timelineConnector} />
              <View style={styles.timelineRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}><Clock size={16} color="#ef4444" /></View>
                <View>
                  <Text style={styles.label}>Purchase Deadline (End)</Text>
                  <Text style={styles.value}>{formatDate(data?.purchaseEnd)}</Text>
                </View>
              </View>
            </View>
          </Section>

          {/* 4. Item Table Section */}
          <Section title="Auction Items" icon={FileText}>
            <View style={styles.tableWrapper}>
              <View style={styles.tableHead}>
                <Text style={[styles.tableLabel, { flex: 2 }]}>Item</Text>
                <Text style={styles.tableLabel}>Qty</Text>
                <Text style={[styles.tableLabel, { textAlign: 'right' }]}>View</Text>
              </View>
              {/* Dummy Item Row */}
              <View style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.itemMain}>Sick Sari / Laundry</Text>
                  <Text style={styles.itemSub}>Category: Sari</Text>
                </View>
                <Text style={styles.itemQty}>120,000</Text>
                <TouchableOpacity style={styles.actionIcon} onPress={() => { setAllBoolean((prev: any) => ({ ...prev, showItemDetail: true })) }}>
                  <Eye size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </Section>

          {/* 5. Downloads */}
          <Section title="Downloads" icon={Download}>
            <TouchableOpacity style={styles.fileCard}>
              <View style={styles.fileIcon}><FileText size={20} color="#ef4444" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>Auction_Notice_Main.pdf</Text>
                <Text style={styles.fileSize}>1.2 MB • PDF</Text>
              </View>
              <Download size={20} color="#94a3b8" />
            </TouchableOpacity>
          </Section>

        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.mainBtn, !isLive && styles.btnDisabled]}
            disabled={!isLive}
          >
            <Text style={styles.mainBtnText}>
              {isLive ? 'Add to Cart / Purchase' : 'Auction Closed'}
            </Text>
          </TouchableOpacity>
        </View>

        <AuctionItemDetail
          data={{
            productName: "sick sari",
            timeDuration: "112 YEAR",
            category: "laundry",
            subCategory: "sari",
            reservePriceFig: "120000",
            reservePriceWords: "One Lakh Twenty Thousand",
            auctionStartFig: "120000",
            auctionStartWords: "One Lakh Twenty Thousand",
            bidVariationFig: "200",
            bidVariationWords: "Two Hundred",
            emdFig: "2000",
            emdWords: "Two Thousand",
            description: "Auction of cars",
            documentName: "BBPS screens.pdf"
          }} onClose={() => { setAllBoolean((prev: any) => ({ ...prev, showItemDetail: false })) }} visible={allBoolean.showItemDetail} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullModal: {
    margin: 0,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerIdText: {
    fontSize: 13,
    color: '#64748b',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: 11, fontWeight: '800', color: '#475569' },

  scrollView: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 16, paddingBottom: 100 },

  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoBox: { marginBottom: 16 },
  label: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginBottom: 4 },
  value: { fontSize: 15, fontWeight: '700', color: '#334155' },
  spacer: { height: 12 },

  timelineContainer: { paddingLeft: 8 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  timelineConnector: { width: 2, height: 20, backgroundColor: '#f1f5f9', marginLeft: 16 },

  tableWrapper: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12 },
  tableHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 8, marginBottom: 12 },
  tableLabel: { fontSize: 11, fontWeight: '800', color: '#94a3b8', flex: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center' },
  itemMain: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  itemSub: { fontSize: 12, color: '#64748b' },
  itemQty: { flex: 1, fontSize: 14, fontWeight: '700', color: '#334155' },
  actionIcon: { padding: 6 },

  fileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12 },
  fileIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
  fileName: { fontSize: 14, fontWeight: '700', color: '#334155' },
  fileSize: { fontSize: 12, color: '#94a3b8' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  mainBtn: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: { backgroundColor: '#cbd5e1' },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default memo(AuctionFullDetail);