import React, { memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {
    Package,
    IndianRupee,
    FileText,
    Download,
    ArrowLeft,
    Info,
} from 'lucide-react-native';
import colors from '../../../Constant/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    visible: boolean;
    onClose: () => void;
    data?: any;
}

const TenderItemDetail: React.FC<Props> = ({ visible, onClose, data }) => {
    const inset = useSafeAreaInsets();

    if (!data) {
        return null;
    }

    const Section = ({ title, icon: Icon, children }: any) => (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <View style={styles.iconCircle}>
                    <Icon size={18} color={colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            {children}
        </View>
    );

    const PriceTile = ({ label, fig, words, full = false }: any) => (
        <View style={[styles.priceTile, full && { width: '100%' }]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.priceFig}>
                ₹{Number(fig || 0).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.priceWords}>{words || '-'}</Text>
        </View>
    );

    return (
        <Modal
            isVisible={visible}
            style={styles.fullModal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            useNativeDriver
            statusBarTranslucent
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: inset.top }]}>
                    <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                        <ArrowLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Item Information</Text>
                        <Text style={styles.headerSub}>Detail View</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Product Specification */}
                    <Section title="Product Specification" icon={Package}>
                        <View style={styles.identityHeader}>
                            <Text style={styles.productNameText}>
                                {data.productName || '-'}
                            </Text>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>
                                    {data.category || '-'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.specGrid}>
                            <View style={styles.specItem}>
                                <Text style={styles.label}>Sub Category</Text>
                                <Text style={styles.specValue}>{data.subCategory || '-'}</Text>
                            </View>
                            <View style={styles.specItem}>
                                <Text style={styles.label}>Duration</Text>
                                <Text style={styles.specValue}>{data.timeDuration || '-'}</Text>
                            </View>
                        </View>
                    </Section>

                    {/* Pricing */}
                    <Section title="Reserve & Bid Values" icon={IndianRupee}>
                        <PriceTile
                            label="Reserve Price"
                            fig={data.reservePriceFig}
                            words={data.reservePriceWords}
                            full
                        />
                        <View style={styles.hDivider} />
                        <PriceTile
                            label="Tender Start Value"
                            fig={data.TenderStartFig}
                            words={data.TenderStartWords}
                            full
                        />
                        <View style={styles.hDivider} />
                        <View style={styles.row}>
                            <PriceTile
                                label="Bid Variation"
                                fig={data.bidVariationFig}
                                words={data.bidVariationWords}
                            />
                            <PriceTile
                                label="EMD Amount"
                                fig={data.emdFig}
                                words={data.emdWords}
                            />
                        </View>
                    </Section>

                    {/* Description */}
                    <Section title="Brief Description" icon={Info}>
                        <Text style={styles.descContent}>
                            {data.description || '-'}
                        </Text>
                    </Section>

                    {/* Documents */}
                    <Section title="Documents" icon={FileText}>
                        <TouchableOpacity style={styles.docRow}>
                            <Text style={styles.docIndex}>1</Text>
                            <View style={{ flex: 2 }}>
                                <Text style={styles.docTitle} numberOfLines={1}>
                                    {data.documentName || 'Document'}
                                </Text>
                            </View>
                            <View style={styles.downloadIconBox}>
                                <Download size={18} color={colors.primary} />
                            </View>
                        </TouchableOpacity>
                    </Section>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    fullModal: { margin: 0, backgroundColor: '#f8fafc' },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backBtn: { padding: 8, marginRight: 8 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
    headerSub: { fontSize: 12, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },

    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 50 },

    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
            android: { elevation: 3 }
        })
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Product Identity
    identityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    productNameText: { fontSize: 20, fontWeight: '900', color: '#1e293b', flex: 1 },
    categoryBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    categoryText: { fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase' },
    specGrid: { flexDirection: 'row', gap: 24, marginTop: 5 },
    specItem: { flex: 1 },
    specValue: { fontSize: 15, fontWeight: '700', color: '#334155', marginTop: 2 },

    // Pricing
    priceTile: { marginBottom: 16 },
    label: { fontSize: 11, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
    priceFig: { fontSize: 22, fontWeight: '900', color: colors.black },
    priceWords: { fontSize: 13, color: '#64748b', fontStyle: 'italic', marginTop: 2 },
    hDivider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },

    // Description
    descContent: { fontSize: 15, color: '#475569', lineHeight: 22, fontWeight: '500' },

    // Table
    docTableHead: { flexDirection: 'row', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', marginBottom: 10 },
    tableLabel: { fontSize: 11, fontWeight: '800', color: '#94a3b8', flex: 1 },
    docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 12, borderRadius: 12 },
    docIndex: { flex: 1, fontSize: 14, fontWeight: '700', color: '#64748b' },
    docTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    downloadIconBox: { backgroundColor: '#fff', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0, width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopWidth: 1, borderTopColor: '#f1f5f9'
    },
    primaryBtn: {
        backgroundColor: colors.primary,
        height: 56, borderRadius: 18,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10
    },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});

export default memo(TenderItemDetail);