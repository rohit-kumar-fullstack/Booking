import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { InsideHeader } from '../../Component/Index';
import colors from '../../Constant/Color';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProceedToBid } from '../../Services/BBPS/Hooks';
import { format } from '../../Helper/DateFormat';
import FontsFamily from '../../Constant/FontsFamily';

const ProceedToBidDetail = () => {
    const route: any = useRoute();
    const tenderData = route.params?.tender;
    const navigation = useNavigation<any>();
    const { data, refetch } = useProceedToBid(tenderData?.tenderId);

    const handleStartBidding = () => {
        refetch();
        if (data) {
            navigation.navigate('TenderBidding', { tenderData: tenderData, bidData: data.data });
        }
    };

    // Status indicator component
    const StatusIndicator = ({ status, label }: { status: any, label: string }) => (
        <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: status ? colors.success : colors.error }]} />
            <Text style={[styles.statusText, { color: status ? colors.success : colors.error, fontFamily: FontsFamily.poppinsSemiBold }]}>
                {label}: {status ? "Submitted" : "Not Submitted"}
            </Text>
        </View>
    );

    // Envelope log card component
    const EnvelopeLogCard = ({ log, title }: { log: any, title: string }) => {
        
        return (
            <View style={styles.envelopeCard}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { fontFamily: FontsFamily.poppinsSemiBold }]}>{title}</Text>
                    <View style={[styles.envelopeBadge, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.envelopeBadgeText, { fontFamily: FontsFamily.poppinsSemiBold }]}>{log?.envelope}</Text>
                    </View>
                </View>

                <View style={styles.logDetailRow}>
                    <Text style={[styles.label, { fontFamily: FontsFamily.poppinsMedium }]}>Activity:</Text>
                    <Text style={[styles.value, { fontFamily: FontsFamily.poppinsRegular }]}>{log?.activity}</Text>
                </View>

                <View style={styles.logDetailRow}>
                    <Text style={[styles.label, { fontFamily: FontsFamily.poppinsMedium }]}>Date & Time:</Text>
                    <Text style={[styles.value, { fontFamily: FontsFamily.poppinsRegular }]}>{format.date6(log?.dateTime)}</Text>
                </View>

                <View style={styles.logDetailRow}>
                    <Text style={[styles.label, { fontFamily: FontsFamily.poppinsMedium }]}>System Info:</Text>
                    <Text style={[styles.value, { fontFamily: FontsFamily.poppinsRegular }]}>{log?.osName} / {log?.browserName}</Text>
                </View>

                <View style={styles.logDetailRow}>
                    <Text style={[styles.label, { fontFamily: FontsFamily.poppinsMedium }]}>IP Address:</Text>
                    <Text style={[styles.value, { fontFamily: FontsFamily.poppinsRegular }]}>{log?.ipAddress}</Text>
                </View>

                <View style={styles.logDetailRow}>
                    <Text style={[styles.label, { fontFamily: FontsFamily.poppinsMedium }]}>Status Message:</Text>
                    <Text style={[styles.value, styles.successText, { fontFamily: FontsFamily.poppinsSemiBold }]}>{log?.logMessage}</Text>
                </View>

                {log?.headingMsg && (
                    <View style={styles.logDetailRow}>
                        <Text style={[styles.label, { fontFamily: FontsFamily.poppinsMedium }]}>Heading:</Text>
                        <Text style={[styles.value, { fontFamily: FontsFamily.poppinsRegular }]}>{log?.headingMsg}</Text>
                    </View>
                )}
            </View>
        )
    }

    // Information row component
    const InfoRow = ({ label, value, isHighlighted = false }: { label: string, value: string, isHighlighted?: boolean }) => (
        <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { fontFamily: FontsFamily.poppinsMedium }]}>{label}:</Text>
            <Text style={[styles.infoValue, isHighlighted && styles.highlightedValue, { fontFamily: FontsFamily.poppinsSemiBold }]}>{value}</Text>
        </View>
    );

    // Feature chip component
    const FeatureChip = ({ label, enabled }: { label: string, enabled: boolean }) => (
        <View style={[styles.chip, { backgroundColor: enabled ? colors.successLight : colors.lightGray }]}>
            <Text style={[styles.chipText, { color: enabled ? colors.success : colors.darkGray, fontFamily: FontsFamily.poppinsSemiBold }]}>
                {label} {enabled ? '✓' : '✗'}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <InsideHeader title="Tender Detail" showArrow />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Tender Header */}
                <View style={styles.headerCard}>
                    <View style={styles.tenderHeader}>
                        <View>
                            <Text style={[styles.tenderNumber, { fontFamily: FontsFamily.poppinsSemiBold }]}>{tenderData.tenderNumber}</Text>
                            <Text style={[styles.tenderId, { fontFamily: FontsFamily.poppinsRegular }]}>ID: {tenderData.tenderId}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: tenderData.biddingStatus ? colors.success : colors.warning }]}>
                            <Text style={[styles.statusBadgeText, { fontFamily: FontsFamily.poppinsSemiBold }]}>
                                {tenderData.biddingStatus ? "Active" : "Inactive"}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.workDescription, { fontFamily: FontsFamily.poppinsRegular }]} numberOfLines={1}>{tenderData.nameofWork}</Text>

                    <View style={styles.headerInfoRow}>
                        <View style={styles.headerInfoItem}>
                            <Text style={[styles.headerInfoLabel, { fontFamily: FontsFamily.poppinsMedium }]}>NIT No.</Text>
                            <Text style={[styles.headerInfoValue, { fontFamily: FontsFamily.poppinsSemiBold }]}>{tenderData.nitNo}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.headerInfoItem}>
                            <Text style={[styles.headerInfoLabel, { fontFamily: FontsFamily.poppinsMedium }]}>EMD Amount</Text>
                            <Text style={[styles.headerInfoValue, { fontFamily: FontsFamily.poppinsSemiBold }]}>₹{tenderData.emdInFig}</Text>
                        </View>
                    </View>
                </View>

                {/* Envelope Status */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.black }]}>{`Envelope Submission Status`}</Text>
                    <View style={styles.statusGrid}>
                        <StatusIndicator status={tenderData.envelopeASubmittStatus} label="Envelope A" />
                        <StatusIndicator status={tenderData.envelopeBSubmittStatus} label="Envelope B" />
                        <StatusIndicator status={tenderData.envelopeCSubmittStatus} label="Envelope C" />
                    </View>
                </View>

                {/* Logs */}
                {tenderData.envelopeA_Logs && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.black }]}>Submission Logs</Text>
                        <EnvelopeLogCard log={tenderData.envelopeA_Logs} title="Envelope A Submission" />
                        <EnvelopeLogCard log={tenderData.envelopeB_Logs} title="Envelope B Submission" />
                        <EnvelopeLogCard log={tenderData.envelopeC_Logs} title="Envelope C Submission" />
                    </View>
                )}

                {/* Tender Details */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.black }]}>Tender Details</Text>
                    <View style={styles.detailsCard}>
                        <InfoRow label="Envelope Type" value={tenderData.envelopeType} />
                        <InfoRow label="Tender Stages" value={tenderData.tenderStages} />
                        <InfoRow label="Bid Withdrawal" value={tenderData.bidWithDraw} isHighlighted={tenderData.bidWithdrawStatus} />
                        <InfoRow label="Re-bid" value={tenderData.reBid} />
                        <InfoRow label="DSC Status" value={tenderData.dscStatus ? "Required" : "Not Required"} />
                    </View>
                </View>

                {/* Submission Time */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.black }]}>Submission Time Period</Text>
                    <View style={styles.timeCard}>
                        <View style={styles.timeRow}>
                            <Text style={[styles.timeLabel, { fontFamily: FontsFamily.poppinsSemiBold }]}>Starts On:</Text>
                            <Text style={[styles.timeValue, { fontFamily: FontsFamily.poppinsSemiBold }]}>{format.date6(tenderData.submittedStartDate)}</Text>
                        </View>
                        <View style={styles.timeRow}>
                            <Text style={[styles.timeLabel, { fontFamily: FontsFamily.poppinsSemiBold }]}>Ends On:</Text>
                            <Text style={[styles.timeValue, { fontFamily: FontsFamily.poppinsSemiBold }]}>{format.date6(tenderData.submittedEndDate)}</Text>
                        </View>
                    </View>
                </View>

                {/* Feature Chips */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.black }]}>Available Features</Text>
                    <View style={styles.chipsContainer}>
                        <FeatureChip label="View Bid" enabled={tenderData.viewBid} />
                        <FeatureChip label="Proceed to Bid" enabled={tenderData.proceedtoBid} />
                        <FeatureChip label="Show Envelope B" enabled={tenderData.showEB} />
                        <FeatureChip label="Show Envelope C" enabled={tenderData.showEC} />
                        <FeatureChip label="QCBS" enabled={tenderData.showQCBS} />
                        <FeatureChip label="LCS" enabled={tenderData.showLCS} />
                    </View>
                </View>

                {/* Overall Status */}
                <View style={styles.finalStatusCard}>
                    <Text style={[styles.finalStatusTitle, { fontFamily: FontsFamily.poppinsSemiBold }]}>Overall Status</Text>
                    <View style={styles.finalStatusRow}>
                        <Text style={[styles.finalStatusLabel, { fontFamily: FontsFamily.poppinsMedium }]}>All Envelopes Submitted:</Text>
                        <Text style={[styles.finalStatusValue, {
                            color: tenderData.envelopeASubmittStatus && tenderData.envelopeBSubmittStatus && tenderData.envelopeCSubmittStatus
                                ? colors.success : colors.error, fontFamily: FontsFamily.poppinsSemiBold
                        }]}>
                            {tenderData.envelopeASubmittStatus && tenderData.envelopeBSubmittStatus && tenderData.envelopeCSubmittStatus ? "COMPLETED" : "PENDING"}
                        </Text>
                    </View>
                    <View style={styles.finalStatusRow}>
                        <Text style={[styles.finalStatusLabel, { fontFamily: FontsFamily.poppinsMedium }]}>Bidding Status:</Text>
                        <Text style={[styles.finalStatusValue, { color: tenderData.biddingStatus ? colors.success : colors.error, fontFamily: FontsFamily.poppinsSemiBold }]}>
                            {tenderData.biddingStatus ? "ACTIVE" : "CLOSED"}
                        </Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                {
                    tenderData?.proceedtoBid && !tenderData?.viewBid && tenderData?.biddingStatus && tenderData?.bidWithdrawStatus === false ? (
                        <TouchableOpacity style={styles.proceedButton} onPress={handleStartBidding}>
                            <Text style={[styles.proceedButtonText, { fontFamily: FontsFamily.poppinsSemiBold }]}>Start Bidding</Text>
                        </TouchableOpacity>
                    ) : <Text style={[styles.footerText, { fontFamily: FontsFamily.poppinsMedium }]}>One time bidding is completed</Text>
                }
            </View>
        </View>
    );
};

export default ProceedToBidDetail;

// Styles remain mostly unchanged but improved shadows, spacing, and rounded corners
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    headerCard: { backgroundColor: colors.white, borderRadius: 14, padding: 20, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: colors.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
    tenderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    tenderNumber: { fontSize: 22, fontWeight: 'bold', color: colors.primary },
    tenderId: { fontSize: 14, color: colors.darkGray, marginTop: 4 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statusBadgeText: { color: colors.white, fontWeight: '600', fontSize: 12 },
    workDescription: { fontSize: 13, color: colors.black, marginBottom: 16, fontFamily: FontsFamily.poppinsMedium },
    headerInfoRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.lightestGray, borderRadius: 8, padding: 12 },
    headerInfoItem: { flex: 1, alignItems: 'center' },
    headerInfoLabel: { fontSize: 12, color: colors.darkGray, marginBottom: 4 },
    headerInfoValue: { fontSize: 16, fontWeight: '600', color: colors.primary },
    separator: { width: 1, height: 30, backgroundColor: colors.lightGray },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, paddingLeft: 4 },
    statusGrid: { backgroundColor: colors.white, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    statusContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
    statusText: { fontSize: 15, fontWeight: '500' },
    envelopeCard: { backgroundColor: colors.white, borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: colors.black },
    envelopeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    envelopeBadgeText: { color: colors.white, fontWeight: 'bold', fontSize: 12 },
    logDetailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    label: { fontSize: 14, color: colors.black, flex: 1, fontFamily: FontsFamily.poppinsSemiBold },
    value: { fontSize: 14, color: colors.darkText, flex: 2, textAlign: 'right' },
    successText: { color: colors.success, fontWeight: '600' },
    detailsCard: { backgroundColor: colors.white, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.lightestGray },
    infoLabel: { fontSize: 14, color: colors.black, fontFamily: FontsFamily.poppinsSemiBold },
    infoValue: { fontSize: 15, fontWeight: '500', color: colors.darkText },
    highlightedValue: { color: colors.success, fontWeight: '600' },
    timeCard: { backgroundColor: colors.white, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.lightestGray },
    timeLabel: { fontSize: 15, color: colors.black, },
    timeValue: { fontSize: 15, color: colors.grayText, },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 8 },
    chipText: { fontSize: 14, fontWeight: '500' },
    finalStatusCard: { backgroundColor: colors.white, borderRadius: 14, padding: 20, marginTop: 10, borderWidth: 2, borderColor: colors.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
    finalStatusTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    finalStatusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
    finalStatusLabel: { fontSize: 14, color: colors.black, fontFamily: FontsFamily.poppinsSemiBold },
    finalStatusValue: { fontSize: 13, },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, padding: 16, borderTopWidth: 1, borderTopColor: colors.lightGray, elevation: 10 },
    proceedButton: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
    proceedButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
    footerText: { textAlign: 'center', color: colors.darkGray, fontSize: 14 },
});
