import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import colors from '../../../Constant/Color';
import FontsFamily from '../../../Constant/FontsFamily';

type AuctionStatus = 'RUNNING' | 'ENDED' | 'NOT_STARTED' | null;

interface Props {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: {
        fromDate: Date | null;
        toDate: Date | null;
        status: AuctionStatus;
    }) => void;
}

const FilterModal: React.FC<Props> = ({ visible, onClose, onApply }) => {
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [status, setStatus] = useState<AuctionStatus>(null);

    const [openPicker, setOpenPicker] = useState(false);
    const [pickerType, setPickerType] = useState<'FROM' | 'TO'>('FROM');

    const openDatePicker = (type: 'FROM' | 'TO') => {
        setPickerType(type);
        setOpenPicker(true);
    };

    const handleConfirm = (date: Date) => {
        if (pickerType === 'FROM') {
            setFromDate(date);
        } else {
            setToDate(date);
        }
        setOpenPicker(false);
    };

    const handleApply = () => {
        onApply({ fromDate, toDate, status });
        onClose();
    };

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                transparent
                statusBarTranslucent
                onRequestClose={onClose}
            >
                {/* Overlay */}
                <Pressable style={styles.overlay} onPress={onClose} />

                {/* Content */}
                <View style={styles.container}>
                    <Text style={styles.title}>Filter Auctions</Text>

                    {/* ===== DATE RANGE ===== */}
                    <Text style={styles.sectionTitle}>Date Range</Text>

                    <View style={styles.dateRow}>
                        <TouchableOpacity
                            style={styles.dateBox}
                            onPress={() => openDatePicker('FROM')}
                        >
                            <Text style={styles.dateLabel}>From</Text>
                            <Text style={styles.dateValue}>
                                {fromDate
                                    ? moment(fromDate).format('DD MMM YYYY')
                                    : 'Select date'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.dateBox}
                            onPress={() => openDatePicker('TO')}
                        >
                            <Text style={styles.dateLabel}>To</Text>
                            <Text style={styles.dateValue}>
                                {toDate
                                    ? moment(toDate).format('DD MMM YYYY')
                                    : 'Select date'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ===== STATUS ===== */}
                    <Text style={styles.sectionTitle}>Auction Status</Text>

                    <View style={styles.statusRow}>
                        {[
                            { label: 'Running', value: 'RUNNING' },
                            { label: 'Ended', value: 'ENDED' },
                            { label: 'Not Started', value: 'NOT_STARTED' },
                        ].map(item => {
                            const active = status === item.value;
                            return (
                                <TouchableOpacity
                                    key={item.value}
                                    onPress={() => setStatus(item.value as AuctionStatus)}
                                    style={[
                                        styles.statusPill,
                                        active && styles.statusActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            active && styles.statusActiveText,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ===== FOOTER ===== */}
                    <View style={styles.footer}>
                        {/* <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity> */}

                        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                            <Text style={styles.applyText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ===== DATE PICKER ===== */}
            <DatePicker
                modal
                open={openPicker}
                date={
                    pickerType === 'FROM'
                        ? fromDate || new Date()
                        : toDate || new Date()
                }
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setOpenPicker(false)}
            />
        </>
    );
};

export default FilterModal;


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        color: '#475569',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dateBox: {
        width: '48%',
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dateLabel: {
        fontSize: 11,
        color: '#64748B',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    statusRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statusPill: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        backgroundColor: '#F8FAFC',
    },
    statusActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    statusText: {
        fontSize: 13,
        color: '#334155',
        fontFamily:FontsFamily.poppinsSemiBold
    },
    statusActiveText: {
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    cancelBtn: {
        padding: 12,
    },
 
    applyBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        width: '100%'
    },
    applyText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: FontsFamily.poppinsSemiBold
    },
});
