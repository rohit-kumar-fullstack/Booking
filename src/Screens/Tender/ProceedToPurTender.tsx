import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { InsideHeader, Loader } from '../../Component/Index';
import colors from '../../Constant/Color';
import { CreditCard, Calendar, User, DollarSign, ArrowRight } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { useOfflineTenderPurchase } from '../../Services/BBPS/Hooks';
import { useNavigation } from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';

const ProceedToPurTender = () => {
    const navigation: any = useNavigation();
    const [loading, setLoading] = useState(false);
    const SelectedPurchaseList = useSelector((state: any) => state.selectPurchaseTender);
  
    const { mutate, isPending } = useOfflineTenderPurchase()
    const calculateTotalAmount = (item: any) => {
        const gstAmount =
            (Number(item.documentFees) + Number(item.portalCharge)) *
            (Number(item.gst) / 100);

        const payableAmount =
            Number(item.documentFees) + Number(item.portalCharge) + gstAmount;
        return payableAmount
    }

    const handleOfflinePurchase = async () => {
        const orderNo = `ORD${Date.now()}`;
        const body = {
            tenderDetails: SelectedPurchaseList.map((item: any, index:number) => ({
                gst: item.gst,
                regId: item.regId || 0,
                deptId: item.deptId || 1,
                gstAmount: item.gst / 100,
                payableAmount: calculateTotalAmount(item),
                portalCharge: item.portalCharge,
                tenderFees: item.documentFees, 
                tenderId: item.tenderId,
                tenderNumber: item.tenderNumber,
                tenderStatus: item.tenderStatus ?? "",
                tenderType: item.tenderType ?? "",
                isPurchased: item.purchaseStatus ?? false,
                totalPayableAmount: calculateTotalAmount(item),
                percentageAmount: calculateTotalAmount(item) / 100,
                newTenderDocumentFees: item.documentFees * index + 1,
            })),
            orderNo: orderNo,
        };

        console.log("tender offline body : ", body)
        try {
            mutate(body, {
                onSuccess: (res) => {
                    console.log(res, '---------------------purchsase response');
                    Alert.alert('Offline Purchase Successful!', `Order No: ${orderNo}`);
                    navigation.goBack()
                },
                onError: (error) => {
                    console.log(error, "================purchse Error");
                }
            })

        } catch (error) {
            console.log("purchase offline error", error);
        }
    }

    const handlePurchase = (type: 'online' | 'offline') => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            type === 'online' ? Alert.alert('Online Purchase Successful!') : handleOfflinePurchase();

        }, 1200);
    };

    const renderItem = ({ item }: { item: any[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.auctionNumber}</Text>
                <Text style={styles.pattern}>{item.auctionPattern}</Text>
            </View>

            <View style={styles.cardRow}>
                <Calendar size={18} color={colors.primary} />
                <Text style={styles.text}>End Date: {item.purchaseEnd}</Text>
            </View>

            <View style={styles.cardRow}>
                <User size={18} color={colors.primary} />
                <Text style={styles.text}>Tender No: {item.tenderNumber}</Text>
            </View>

            <View style={styles.cardRow}>
                <DollarSign size={18} color={colors.primary} />
                <Text style={styles.text}>Tender Fees: ₹{item.documentFees}</Text>
            </View>

            <View style={styles.cardRow}>
                <DollarSign size={18} color={colors.primary} />
                <Text style={styles.text}>GST ({item.gst}%): ₹{item.gst / 100}</Text>
            </View>

            <View style={styles.cardRow}>
                <DollarSign size={18} color={colors.primary} />
                <Text style={styles.text}>Portal Charge: ₹{item.portalCharge}</Text>
            </View>

            <View style={styles.totalRow}>
                <CreditCard size={20} color={colors.white} />
                <Text style={styles.total}>Total: ₹{calculateTotalAmount(item)}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <InsideHeader title="Tender Purchase" showArrow />
            <View style={styles.screen}>
                <FlatList
                    data={SelectedPurchaseList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.tenderId.toString()}
                    contentContainerStyle={styles.container}
                />
            </View>

            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity
                    style={[styles.button, { marginRight: 8 }]}
                    onPress={() => handlePurchase('online')}
                >
                    <Text style={styles.buttonText}>Purchase Online</Text>
                    <ArrowRight size={18} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { marginLeft: 8 }]}
                    onPress={() => handlePurchase('offline')}
                >
                    <Text style={styles.buttonText}>Purchase Offline</Text>
                    <ArrowRight size={18} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <Loader />
                </View>
            )}
        </View>
    );
};

export default ProceedToPurTender;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        padding: 16,
        paddingBottom: 120,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    pattern: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
        color: '#555',
    },
    totalRow: {
        marginTop: 10,
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    total: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        backgroundColor: colors.white,
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10,
        elevation: 5
    },
    button: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});
