import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { InsideHeader } from '../../Component/Index'
import colors from '../../Constant/Color'
import { useNavigation } from '@react-navigation/native'

const ProceedToBidDetail = () => {
    // Sample data based on your JSON
    const navigation = useNavigation<any>()
    const tenderData = {
        tenderId: 1372,
        envelopeASubmittStatus: true,
        envelopeBSubmittStatus: true,
        envelopeCSubmittStatus: true,
        envelopeA_Logs: {
            logId: 314,
            contractorId: 1,
            activity: "Bid on Envelope A",
            tenderId: 1372,
            dateTime: "Fri Dec 12 13:07:44 IST 2025",
            osName: "Linux",
            browserName: "Chrome-142.0.0.0",
            ipAddress: "192.168.5.10",
            macAddress: "00:00:00:00:00:00",
            logMessage: "Envelope A bidding is Submitted",
            headingMsg: null,
            status: null,
            envelope: "EA"
        },
        envelopeB_Logs: {
            logId: 315,
            contractorId: 1,
            activity: "Bid on Envelope B",
            tenderId: 1372,
            dateTime: "Fri Dec 12 13:08:00 IST 2025",
            osName: "Linux",
            browserName: "Chrome-142.0.0.0",
            ipAddress: "192.168.5.10",
            macAddress: "00:00:00:00:00:00",
            logMessage: "Envelope B bidding is Submitted",
            headingMsg: null,
            status: null,
            envelope: "EB"
        },
        envelopeC_Logs: {
            logId: 316,
            contractorId: 1,
            activity: "Bid on Envelope C",
            tenderId: 1372,
            dateTime: "Fri Dec 12 13:08:31 IST 2025",
            osName: "Linux",
            browserName: "Chrome-142.0.0.0",
            ipAddress: "192.168.5.10",
            macAddress: "00:00:00:00:00:00",
            logMessage: "Envelope C bidding is Submitted",
            headingMsg: "Percentage Rate Tender",
            status: null,
            envelope: "EC"
        },
        showEB: true,
        showEC: true,
        showQCBS: false,
        showLCS: false,
        viewBid: true,
        proceedtoBid: false,
        tenderNumber: "TN/152",
        emdInFig: "100",
        tenderBidWithdraw: "Allowed",
        tenderRebid: "Allowed",
        nitNo: "NIT-410",
        nameofWork: "Tender is created for Testing Process only",
        reBid: "Allowed",
        bidWithDraw: "Allowed",
        envelopeType: "3",
        biddingStatus: true,
        tenderStages: "1",
        dscStatus: false,
        submittedStartDate: [2025, 3, 4, 10, 0],
        submittedEndDate: [2026, 3, 4, 23, 50],
        bidWithdrawStatus: true
    };

    // Format date from array
    const formatDate = (dateArray: any[]) => {
        if (!dateArray || dateArray.length < 3) return "N/A";
        const [year, month, day, hour = 0, minute = 0] = dateArray;
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    // Status indicator component
    const StatusIndicator = ({ status, label }) => (
        <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: status ? colors.success : colors.error }]} />
            <Text style={[styles.statusText, { color: status ? colors.success : colors.error }]}>
                {label}: {status ? "Submitted" : "Not Submitted"}
            </Text>
        </View>
    );

    // Envelope log card component
    const EnvelopeLogCard = ({ log, title }) => (
        <View style={styles.envelopeCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
                <View style={[styles.envelopeBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.envelopeBadgeText}>{log.envelope}</Text>
                </View>
            </View>

            <View style={styles.logDetailRow}>
                <Text style={styles.label}>Activity:</Text>
                <Text style={styles.value}>{log.activity}</Text>
            </View>

            <View style={styles.logDetailRow}>
                <Text style={styles.label}>Date & Time:</Text>
                <Text style={styles.value}>{log.dateTime}</Text>
            </View>

            <View style={styles.logDetailRow}>
                <Text style={styles.label}>System Info:</Text>
                <Text style={styles.value}>{log.osName} / {log.browserName}</Text>
            </View>

            <View style={styles.logDetailRow}>
                <Text style={styles.label}>IP Address:</Text>
                <Text style={styles.value}>{log.ipAddress}</Text>
            </View>

            <View style={styles.logDetailRow}>
                <Text style={styles.label}>Status Message:</Text>
                <Text style={[styles.value, styles.successText]}>{log.logMessage}</Text>
            </View>

            {log.headingMsg && (
                <View style={styles.logDetailRow}>
                    <Text style={styles.label}>Heading:</Text>
                    <Text style={styles.value}>{log.headingMsg}</Text>
                </View>
            )}
        </View>
    );

    // Information row component
    const InfoRow = ({ label, value, isHighlighted = false }) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={[styles.infoValue, isHighlighted && styles.highlightedValue]}>{value}</Text>
        </View>
    );

    // Feature chip component
    const FeatureChip = ({ label, enabled }) => (
        <View style={[styles.chip, { backgroundColor: enabled ? colors.successLight : colors.lightGray }]}>
            <Text style={[styles.chipText, { color: enabled ? colors.success : colors.darkGray }]}>
                {label} {enabled ? '✓' : '✗'}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
            <InsideHeader title="Tender Detail" showArrow />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Tender Header Section */}
                <View style={styles.headerCard}>
                    <View style={styles.tenderHeader}>
                        <View>
                            <Text style={styles.tenderNumber}>{tenderData.tenderNumber}</Text>
                            <Text style={styles.tenderId}>ID: {tenderData.tenderId}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: tenderData.biddingStatus ? colors.success : colors.warning }]}>
                            <Text style={styles.statusBadgeText}>
                                {tenderData.biddingStatus ? "Active" : "Inactive"}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.workDescription}>{tenderData.nameofWork}</Text>

                    <View style={styles.headerInfoRow}>
                        <View style={styles.headerInfoItem}>
                            <Text style={styles.headerInfoLabel}>NIT No.</Text>
                            <Text style={styles.headerInfoValue}>{tenderData.nitNo}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.headerInfoItem}>
                            <Text style={styles.headerInfoLabel}>EMD Amount</Text>
                            <Text style={styles.headerInfoValue}>₹{tenderData.emdInFig}</Text>
                        </View>
                    </View>
                </View>

                {/* Envelope Submission Status */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Envelope Submission Status</Text>
                    <View style={styles.statusGrid}>
                        <StatusIndicator status={tenderData.envelopeASubmittStatus} label="Envelope A" />
                        <StatusIndicator status={tenderData.envelopeBSubmittStatus} label="Envelope B" />
                        <StatusIndicator status={tenderData.envelopeCSubmittStatus} label="Envelope C" />
                    </View>
                </View>

                {/* Envelope Logs */}
                {tenderData.envelopeA_Logs && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Submission Logs</Text>
                        <EnvelopeLogCard log={tenderData.envelopeA_Logs} title="Envelope A Submission" />
                        <EnvelopeLogCard log={tenderData.envelopeB_Logs} title="Envelope B Submission" />
                        <EnvelopeLogCard log={tenderData.envelopeC_Logs} title="Envelope C Submission" />
                    </View>
                )}

                {/* Tender Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tender Details</Text>
                    <View style={styles.detailsCard}>
                        <InfoRow label="Envelope Type" value={tenderData.envelopeType} />
                        <InfoRow label="Tender Stages" value={tenderData.tenderStages} />
                        <InfoRow label="Bid Withdrawal" value={tenderData.bidWithDraw} isHighlighted={tenderData.bidWithdrawStatus} />
                        <InfoRow label="Re-bid" value={tenderData.reBid} />
                        <InfoRow label="DSC Status" value={tenderData.dscStatus ? "Required" : "Not Required"} />
                    </View>
                </View>

                {/* Time Period */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Submission Time Period</Text>
                    <View style={styles.timeCard}>
                        <View style={styles.timeRow}>
                            <Text style={styles.timeLabel}>Starts On:</Text>
                            <Text style={styles.timeValue}>{formatDate(tenderData.submittedStartDate)}</Text>
                        </View>
                        <View style={styles.timeRow}>
                            <Text style={styles.timeLabel}>Ends On:</Text>
                            <Text style={styles.timeValue}>{formatDate(tenderData.submittedEndDate)}</Text>
                        </View>
                    </View>
                </View>

                {/* Feature Flags */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Features</Text>
                    <View style={styles.chipsContainer}>
                        <FeatureChip label="View Bid" enabled={tenderData.viewBid} />
                        <FeatureChip label="Proceed to Bid" enabled={tenderData.proceedtoBid} />
                        <FeatureChip label="Show Envelope B" enabled={tenderData.showEB} />
                        <FeatureChip label="Show Envelope C" enabled={tenderData.showEC} />
                        <FeatureChip label="QCBS" enabled={tenderData.showQCBS} />
                        <FeatureChip label="LCS" enabled={tenderData.showLCS} />
                    </View>
                </View>

                {/* Final Status */}
                <View style={styles.finalStatusCard}>
                    <Text style={styles.finalStatusTitle}>Overall Status</Text>
                    <View style={styles.finalStatusRow}>
                        <Text style={styles.finalStatusLabel}>All Envelopes Submitted:</Text>
                        <Text style={[styles.finalStatusValue,
                        {
                            color: tenderData.envelopeASubmittStatus && tenderData.envelopeBSubmittStatus && tenderData.envelopeCSubmittStatus
                                ? colors.success : colors.error
                        }]}>
                            {tenderData.envelopeASubmittStatus && tenderData.envelopeBSubmittStatus && tenderData.envelopeCSubmittStatus
                                ? "COMPLETED" : "PENDING"}
                        </Text>
                    </View>
                    <View style={styles.finalStatusRow}>
                        <Text style={styles.finalStatusLabel}>Bidding Status:</Text>
                        <Text style={[styles.finalStatusValue,
                        { color: tenderData.biddingStatus ? colors.success : colors.error }]}>
                            {tenderData.biddingStatus ? "ACTIVE" : "CLOSED"}
                        </Text>
                    </View>
                </View>

                <View style={styles.footerSpace} />
            </ScrollView>
            <View style={styles.footer}> 
                 <TouchableOpacity style={styles.proceedButton} onPress={() => {
                       navigation.navigate('TenderBidding', { tenderData: tenderData });
                    }}>
                        <Text style={styles.proceedButtonText}>Proceed to Bid</Text>
                    </TouchableOpacity>
                 {
                // tenderData?.proceedtoBid && !tenderData?.viewBid && tenderData?.biddingStatus && tenderData?.bidWithdrawStatus === false ? (

                //     <TouchableOpacity style={styles.proceedButton} onPress={() => {
                //        navigation.navigate('TenderBidding', { tenderData: tenderData });
                //     }}>
                //         <Text style={styles.proceedButtonText}>Proceed to Bid</Text>
                //     </TouchableOpacity>

                // ) : <Text style={styles.footerText}>One time bidding is completed</Text>
            } </View>
        </View>

    )
}

export default ProceedToBidDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginBottom: 60,
    },
    headerCard: {
        backgroundColor: colors.primaryLight,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    tenderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tenderNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
    },
    tenderId: {
        fontSize: 14,
        color: colors.darkGray,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusBadgeText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 12,
    },
    workDescription: {
        fontSize: 16,
        color: colors.darkText,
        lineHeight: 22,
        marginBottom: 16,
    },
    headerInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 12,
    },
    headerInfoItem: {
        flex: 1,
        alignItems: 'center',
    },
    headerInfoLabel: {
        fontSize: 12,
        color: colors.darkGray,
        marginBottom: 4,
    },
    headerInfoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    separator: {
        width: 1,
        height: 30,
        backgroundColor: colors.lightGray,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 12,
        paddingLeft: 4,
    },
    statusGrid: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    statusText: {
        fontSize: 15,
        fontWeight: '500',
    },
    envelopeCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    envelopeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    envelopeBadgeText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    logDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: colors.darkGray,
        flex: 1,
    },
    value: {
        fontSize: 14,
        color: colors.darkText,
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    successText: {
        color: colors.success,
        fontWeight: '600',
    },
    detailsCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightestGray,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.darkGray,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.darkText,
    },
    highlightedValue: {
        color: colors.success,
        fontWeight: '600',
    },
    timeCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightestGray,
    },
    timeLabel: {
        fontSize: 15,
        color: colors.darkGray,
        fontWeight: '500',
    },
    timeValue: {
        fontSize: 15,
        color: colors.primary,
        fontWeight: '600',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 8,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    finalStatusCard: {
        backgroundColor: colors.primaryLight,
        borderRadius: 12,
        padding: 20,
        marginTop: 10,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    finalStatusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    finalStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    finalStatusLabel: {
        fontSize: 16,
        color: colors.darkText,
        fontWeight: '500',
    },
    finalStatusValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerSpace: {
        height: 30,
    },
    success: {
        color: colors.success,
    },
    error: {
        color: colors.error,
    },
    primary: {
        color: colors.primary,
    },
    warning: {
        color: colors.warning,
    },
    successLight: {
        backgroundColor: colors.successLight,
    },
    lightGray: {
        backgroundColor: colors.lightGray,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        elevation: 10,
    },
    proceedButton: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        color: colors.darkGray,
        fontSize: 14,
    },
});