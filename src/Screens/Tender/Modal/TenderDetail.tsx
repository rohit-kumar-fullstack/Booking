import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import {
  Briefcase,
  Calendar,
  FileText,
  Download,
  Eye,
  Layers,
  ArrowLeft,
  Clock,
} from 'lucide-react-native';
import colors from '../../../Constant/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFetchTenderById } from '../../../Services/BBPS/Hooks';

interface Props {
  visible: boolean;
  onClose: () => void;
  data?: any;
}

const TenderFullDetail: React.FC<Props> = ({ visible, onClose, data }) => {
  const inset = useSafeAreaInsets();
  const { data: tenderResponse }: any = useFetchTenderById(data?.tenderId);
  const tender = tenderResponse?.data?.[0];

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return moment(date, 'DD-MM-YYYY HH:mm:ss').format('DD MMM YYYY, hh:mm A');
  };

  if (!tender) return null;

  const isLive = tender?.liveStatus === true;

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
    <View style={[styles.infoBox, full && { width: '100%' }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );

  return (
    <Modal
      isVisible={visible}
      style={styles.fullModal}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      useNativeDriver
      statusBarTranslucent
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={[styles.header, { paddingTop: inset.top }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <ArrowLeft size={24} color="#1e293b" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Tender Overview</Text>
            <Text style={styles.headerSub}>Ref: {tender?.tenderNumber}</Text>
          </View>

          <View style={styles.liveBox}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isLive ? '#22c55e' : '#94a3b8' },
              ]}
            />
            <Text style={styles.liveText}>{isLive ? 'LIVE' : 'CLOSED'}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Basic Details */}
          <Section title="Basic Details" icon={Layers}>
            <View style={styles.grid}>
              <InfoBox label="Tender No" value={tender?.tenderNumber} />
              <InfoBox label="Type" value={tender?.typeOfTender} />
              <InfoBox label="Category" value={tender?.tenderCategory} />
              <InfoBox label="Mode" value={tender?.selectiveTender} />
              <InfoBox label="Tender Status" value={tender?.tenderStatus} />
            </View>
          </Section>

          {/* Work & Estimate */}
          <Section title="Work & Estimate" icon={Briefcase}>
            <View style={styles.grid}>
              <InfoBox label="Name of Work" value={tender?.nameOfWork} full />
              <InfoBox label="Area of Work" value={tender?.areaOfWork} />
              <InfoBox label="Estimate (Fig)" value={tender?.estimateValueInFig} />
              <InfoBox label="Estimate (Words)" value={tender?.estimateValueInWord} />
              <InfoBox
                label="Completion Period"
                value={`${tender?.workCompletionPeriod} ${tender?.workCompletionType}`}
              />
              <InfoBox label="Rainy Season" value={tender?.rainySeason} />
            </View>
          </Section>

          {/* Department & Location */}
          <Section title="Department & Location" icon={Layers}>
            <View style={styles.grid}>
              <InfoBox label="Department" value={tender?.deptName} full />
              <InfoBox label="Circle" value={tender?.circle} />
              <InfoBox label="Division" value={tender?.tenderSelectedDivision} />
              <InfoBox label="Sub Division" value={tender?.tenderSelectedSubDivision} />
            </View>
          </Section>

          {/* Fee & Charges */}
          <Section title="Fee & Charges" icon={FileText}>
            <View style={styles.grid}>
              <InfoBox label="Tender Fee" value={tender?.tenderFeeInFig} />
              <InfoBox label="EMD" value={tender?.emdInFig} />
              <InfoBox label="Portal Charge" value={tender?.portalCharge} />
              <InfoBox label="GST (%)" value={tender?.gst} />
              <InfoBox label="GST Amount" value={tender?.gstAmmount} />
            </View>
          </Section>

          {/* Bid Info */}
          <Section title="Bid Information" icon={Eye}>
            <View style={styles.grid}>
              <InfoBox label="Envelope Type" value={tender?.envelopeType} />
              <InfoBox label="Contractor Class" value={tender?.contractorClass} />
              <InfoBox label="Bid Validation" value={`${tender?.bidValidatePeriod} ${tender?.bidValidateType}`} />
              <InfoBox label="Re-Bid Allowed" value={tender?.tenderRebid} />
              <InfoBox label="Bid Withdraw" value={tender?.tenderBidWithdraw} />
            </View>
          </Section>

          {/* Key Dates */}
          <Section title="Key Dates" icon={Calendar}>
            <View style={styles.grid}>
              <InfoBox
                label="Purchase Start"
                value={formatDate(
                  tender?.tenderKeyDatesAmendment?.tenderPurchaseDate?.startDateTime
                )}
                full
              />
              <InfoBox
                label="Purchase End"
                value={formatDate(
                  tender?.tenderKeyDatesAmendment?.tenderPurchaseDate?.endDateTime
                )}
                full
              />
              <InfoBox
                label="Bid Submission Start"
                value={formatDate(
                  tender?.tenderKeyDatesAmendment?.bidSubmissionDate?.startDateTime
                )}
                full
              />
              <InfoBox
                label="Bid Submission End"
                value={formatDate(
                  tender?.tenderKeyDatesAmendment?.bidSubmissionDate?.endDateTime
                )}
                full
              />
            </View>
          </Section>

          {/* Documents */}
          <Section title="Documents" icon={Download}>
            {tender?.tenderDocuments?.map((doc: any) => (
              <View key={doc.docId} style={styles.fileRow}>
                <FileText size={18} color={colors.primary} />
                <Text style={styles.fileName}>{doc.fileName}</Text>
                <Download size={18} color="#94a3b8" />
              </View>
            ))}
          </Section>

        </ScrollView>
      </SafeAreaView>
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
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    width: '80%',
  },
  liveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
});

export default memo(TenderFullDetail);