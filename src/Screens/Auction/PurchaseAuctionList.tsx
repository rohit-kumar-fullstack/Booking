import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { InsideHeader, Loader } from '../../Component/Index';
import colors from '../../Constant/Color';
import { CreditCard, Calendar, User, DollarSign, ArrowRight } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useOfflineAuctionPurchase, usePurchaseAuctionList } from '../../Services/BBPS/Hooks';
import { showSuccessAlert } from '../../Constant/ShowDailog';
import { clearPurchaseAuction } from '../../Redux/Slices/selectPurchaseAuction';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';
import Skeleton from '../../Component/Skelton/Skelton';

const dummyAuctionList = [
    {
        auctionId: 1,
        auctionNumber: 'AUC-2025-001',
        auctionPattern: 'Single Stage',
        auctionDispatchDate: '25 Feb 2025',
        auctionDispatcherNumber: 'DISP-001',
        auctionFees: 2500,
        gst: 18,
        gstAmount: 450,
        portalCharge: 100,
        payableAmount: 3050,
    },
];

const PurchaseAuctionList = () => {
    const Navigation = useNavigation()
    const Dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const SelectedPurchaseList = useSelector((state: any) => state.selectPurchaseAuction);
    const LoginUser = useSelector((state: any) => state.token.token);
    const { mutate, isPending } = useOfflineAuctionPurchase()
    const { mutate: purchaseListMutation, isPending: purchaseListPending } = usePurchaseAuctionList();

    const calculateTotalAmount = (item: any) => {
        const gstAmount =
            (Number(item.auctionFees) + Number(item.portalCharge)) *
            (Number(item.gst) / 100);

        const payableAmount =
            Number(item.auctionFees) + Number(item.portalCharge) + gstAmount;
        return payableAmount
    }

    const handleOfflinePurchase = async () => {
        const body = {
            auctionDetails: list.map((b: any) => ({
                auctionDispatchDate: b?.auctionDispatchDate,
                auctionDispatcherNumber: b?.auctionDispatcherNumber,
                auctionFees: b?.auctionFees,
                auctionId: b?.auctionId,
                auctionNumber: b?.auctionNumber,
                auctionPattern: b?.auctionPattern,
                gst: b?.gst,
                gstAmount: b?.gstAmount,
                payableAmount: calculateTotalAmount(b),
                portalCharge: b?.portalCharge
            })),
            orderNo: ''
        };

        try {
            mutate(body, {
                onSuccess: (res) => {
                    if (res.statusCode == 200) {
                        showSuccessAlert(res.message)
                        Dispatch(clearPurchaseAuction())
                        Navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: NavigationString.Home }],
                            })
                        );
                    }
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

    const renderItem = ({ item }: { item: typeof dummyAuctionList[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.auctionNumber}</Text>
                <Text style={styles.pattern}>{item.auctionPattern}</Text>
            </View>

            <View style={styles.cardRow}>
                <Calendar size={18} color={colors.primary} />
                <Text style={styles.text}>Dispatch Date: {item.auctionDispatchDate}</Text>
            </View>

            <View style={styles.cardRow}>
                <User size={18} color={colors.primary} />
                <Text style={styles.text}>Dispatcher No: {item.auctionDispatcherNumber}</Text>
            </View>

            <View style={styles.cardRow}>
                <DollarSign size={18} color={colors.primary} />
                <Text style={styles.text}>Auction Fees: ₹{item.auctionFees}</Text>
            </View>

            <View style={styles.cardRow}>
                <DollarSign size={18} color={colors.primary} />
                <Text style={styles.text}>GST ({item.gst}%): ₹{item.gstAmount}</Text>
            </View>

            <View style={styles.cardRow}>
                <DollarSign size={18} color={colors.primary} />
                <Text style={styles.text}>Portal Charge: ₹{item.portalCharge}</Text>
            </View>

            <View style={styles.totalRow}>
                <CreditCard size={20} color={colors.white} />
                <Text style={styles.total}>Total: ₹{item.payableAmount}</Text>
            </View>
        </View>
    );

    const getPurchaseList = () => {
        const auctionNumbers: string[] = SelectedPurchaseList.map(
            (item: { auctionNumber: string }) => item.auctionNumber
        );
        purchaseListMutation({ auctionNumbers, contractorId: LoginUser.contractorId }, {
            onSuccess: (res) => {
                if (res.statusCode == 200) {
                    setList(res.data)
                }
            },
            onError: (error) => {
                console.log(error, "=================purchase list error");
            }
        })
    }
    useFocusEffect(
        React.useCallback(() => {
            getPurchaseList()
        }, [SelectedPurchaseList])
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <InsideHeader title="Purchase List" showArrow />
            <View style={styles.screen}>
                {purchaseListPending ? <Skeleton /> : <FlatList
                    data={list}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.auctionId.toString()}
                    contentContainerStyle={styles.container}
                />}
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
                    {
                        isPending ? <Loader size='small' color={colors.white} /> : <>
                            <Text style={styles.buttonText}>Purchase Offline</Text>
                            <ArrowRight size={18} color="#fff" style={{ marginLeft: 6 }} />
                        </>
                    }

                </TouchableOpacity>
            </View>

        </View>
    );
};

export default PurchaseAuctionList;

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
