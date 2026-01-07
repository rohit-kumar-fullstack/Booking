import React, { memo, useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, TextInput } from 'react-native';
import Animated, { FadeInUp, Layout, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import colors from '../../../Constant/Color';
import AuctionItemDetail from '../../Auction/Modal/AuctionItemDetail';
import MainStyle from '../../../Styles/MainStyle';
import axios, { all } from 'axios';
import Variables from '../../../Constant/Variable';
import { useSelector } from 'react-redux';
import { showErrorAlert, showSuccessAlert } from '../../../Constant/ShowDailog';
import { Loader } from '../../../Component/Index';

const ReverseBiddingCard = ({ item, bidValue, onIncrease, onDecrease, onPlaceBid, SelectedAuction, allBoolean, setAllBoolean }: any) => {
    const Token = useSelector((state: any) => state.token.token)
    const [allState, setAllState] = useState({ isLoading: false })
    const [showDetail, setShowDetail] = useState(false);
    const [value, setValue] = useState(`${item.bidAmount}`);
    const canDecrease = bidValue > item.emdAmount;
    const canIncrease = bidValue < item.bidAmount;
    // Animation Part Rohit Start

    const expandedRef = useRef(false);
    const animation = useSharedValue(0);

    const toggleExpand = useCallback(() => {
        expandedRef.current = !expandedRef.current;
        animation.value = withSpring(expandedRef.current ? 1 : 0, {
            damping: 15,
            stiffness: 140,
        });
    }, []);

    const bodyStyle = useAnimatedStyle(() => ({
        height: interpolate(animation.value, [0, 1], [0, 190]),
        opacity: interpolate(animation.value, [0, 0.5, 1], [0, 0, 1]),
        marginTop: interpolate(animation.value, [0, 1], [0, 15]),
    }));
    const bodyStyle2 = useAnimatedStyle(() => ({
        height: interpolate(animation.value, [0, 1], [0, 100]),
        opacity: interpolate(animation.value, [0, 0.5, 1], [0, 0, 1]),
        marginTop: interpolate(animation.value, [0, 1], [0, 15]),
    }));

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg`,
            },
        ],
    }));

    // Animation Part Rohit End

    const MAX_VALUE = Number(item.auctionStartValue);

    const handleChange = (text: string) => {
        let cleaned = text.replace(/[^0-9.]/g, '');
        if ((cleaned.match(/\./g) || []).length > 1) return;
        if (cleaned === '') {
            setValue('');
            return;
        }
        const numericValue = Number(cleaned);
        if (numericValue < 0) return;
        if (numericValue > MAX_VALUE) return;
        setValue(cleaned);
    };

    const oneTimePlaceBid = async () => {
        try {
            setAllState((prev: any) => ({ ...prev, isLoading: true }))
            const payload = {
                itemId: item.id,
                bidAmount: Number(value),
                auctionId: SelectedAuction.auctionId,
                contractorId: Token.contractorId,
                fullName: Token.fullName,
            };


            const res = await axios.post(
                `${Variables.socketUrl}bidding/placeBidForAuction`,
                [payload],
                { headers: { Authentication: `Bearer ${Token.token}` } }
            );

            if (res.data.statusCode === 200) {
                showSuccessAlert(res.data.message);
            }
            setAllBoolean((prev: any) => ({ ...prev, reload: !prev.reload }))
        } catch (error) {
            if (axios.isAxiosError(error)) {
                showErrorAlert(error.response?.data.message)
            } else {
                console.log('UNKNOWN ERROR:', error);
            }

        } finally {
            setAllState((prev: any) => ({ ...prev, isLoading: false }))
        }
    }

    return (
        <View>
            {!showDetail ? (
                <Animated.View
                    layout={Layout.springify()}
                    entering={FadeInUp.delay(100)}
                    style={[
                        styles.card,
                        {
                            borderColor: item.me ? '#22C55E' : '#EF4444',
                            backgroundColor: item.me ? '#F0FDF4' : '#FDF0F0',
                        },
                    ]}
                >
                    {/* HEADER */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowDetail(true)}
                        style={styles.cardHeader}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={styles.productName}>{item.productName}</Text>
                            <Text style={styles.itemIdText}>
                                Initial Amt : ₹{item.auctionStartValue}
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.headerRight} onPress={toggleExpand}>
                            <View style={[MainStyle.flexBetween, { gap: 10 }]}>
                                <View
                                    style={[
                                        styles.badge,
                                        item.me ? styles.meBadge : styles.liveBadge,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            item.me ? styles.meText : styles.liveText,
                                        ]}
                                    >
                                        {item.me ? 'LEADING' : 'LIVE'}
                                    </Text>
                                </View>

                                <Animated.Text style={[styles.arrow, arrowStyle]}>
                                    ▼
                                </Animated.Text>
                            </View>
                            <Text style={styles.itemIdText}>
                                {SelectedAuction?.auctionNumber}
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {/* PRICE INFO */}
                    <View style={styles.priceRow}>
                        <View>
                            <Text style={styles.label}>Current Bid</Text>
                            <Text style={styles.mainPrice}>₹{item.bidAmount || item.auctionStartValue}</Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.label}>Decrement</Text>
                            <Text style={styles.incrementText}>
                                -₹{item.emdAmount}
                            </Text>
                        </View>
                    </View>

                    {/* COLLAPSIBLE BODY */}
                    {/* <Animated.View style={[styles.collapsibleContainer, (allBoolean.oneTimeBid && allBoolean.rebid) ? bodyStyle : (allBoolean.oneTimeBid && !item.me) ? bodyStyle : bodyStyle2]}> */}
                    <Animated.View style={[styles.collapsibleContainer, bodyStyle]}>
                        <View style={styles.divider} />

                        <Text style={styles.bidLabel}>Set Your Bid</Text>

                        <View style={styles.stepperContainer}>
                            {/* DECREASE */}
                            {!allBoolean.oneTimeBid && <TouchableOpacity
                                onPress={onDecrease}
                                disabled={!canDecrease}
                                style={[
                                    styles.stepBtn,
                                    !canDecrease && styles.disabledBtn,
                                ]}
                            >
                                <Text style={styles.stepText}>−</Text>
                            </TouchableOpacity>}

                            {/* VALUE */}
                            {!allBoolean.oneTimeBid && <View style={styles.inputBox}>
                                <Text style={styles.currency}>₹</Text>
                                <Text style={styles.bidValueText}>{bidValue}</Text>
                            </View>}
                            {
                                (allBoolean.oneTimeBid || allBoolean.rebid) && <View style={styles.inputBox2}>
                                    <Text style={styles.currency2}>₹</Text>

                                    <TextInput
                                        value={value}
                                        onChangeText={handleChange}
                                        keyboardType="decimal-pad"
                                        placeholder="0.00"
                                        style={styles.input}
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>
                            }

                            {/* INCREASE */}
                            {!allBoolean.oneTimeBid && <TouchableOpacity
                                onPress={onIncrease}
                                disabled={!canIncrease}
                                style={[
                                    styles.stepBtn,
                                    !canIncrease && styles.disabledBtn,
                                ]}
                            >
                                <Text style={styles.stepText}>+</Text>
                            </TouchableOpacity>}
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn]}
                            onPress={(allBoolean.oneTimeBid || allBoolean.rebid) ? oneTimePlaceBid : onPlaceBid}
                        >
                            {
                                allState.isLoading ? <Loader size='small' color={colors.white} /> : <Text style={styles.submitBtnText}>Confirm Bid</Text>
                            }
                        </TouchableOpacity>

                        {/* {(allBoolean.oneTimeBid && allBoolean.rebid) ?
                            <TouchableOpacity
                                style={[styles.submitBtn]}
                                onPress={(allBoolean.oneTimeBid || allBoolean.rebid) ? oneTimePlaceBid : onPlaceBid}
                            >
                                {
                                    allState.isLoading ? <Loader size='small' color={colors.white} /> : <Text style={styles.submitBtnText}>Confirm Bid</Text>
                                }
                            </TouchableOpacity> :
                            (allBoolean.oneTimeBid && !item.me) ? <TouchableOpacity
                                style={[styles.submitBtn]}
                                onPress={(allBoolean.oneTimeBid || allBoolean.rebid) ? oneTimePlaceBid : onPlaceBid}
                            >
                                {
                                    allState.isLoading ? <Loader size='small' color={colors.white} /> : <Text style={styles.submitBtnText}>Confirm Bid</Text>
                                }
                            </TouchableOpacity> : null
                        } */}
                    </Animated.View>
                </Animated.View>
            ) : (
                <AuctionItemDetail
                    data={item}
                    onClose={() => setShowDetail(false)}
                    visible={showDetail}
                />
            )}
        </View>
    );
};

export default ReverseBiddingCard;

const styles = StyleSheet.create({
    inputBox2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        height: 45,
        paddingHorizontal: 12,
        width: '100%'
    },
    currency2: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#64748B',
        marginRight: 4,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        width: '100%'
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: { elevation: 2 },
        }),
    },
    leadingCard: {
        borderColor: '#22C55E',
        borderWidth: 2,
        backgroundColor: '#F0FDF4',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerRight: { flexDirection: 'column', alignItems: 'center', gap: 8 },
    productName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    itemIdText: { fontSize: 12, color: '#64748B', marginTop: 2 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    liveBadge: { backgroundColor: '#FEE2E2' },
    meBadge: { backgroundColor: '#BBF7D0' },
    badgeText: { fontSize: 10, fontWeight: '900' },
    liveText: { color: '#EF4444' },
    meText: { color: '#15803D' },
    arrow: { fontSize: 10, color: '#94A3B8' },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    label: {
        fontSize: 11,
        color: '#94A3B8',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    mainPrice: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
    incrementText: { fontSize: 16, fontWeight: '700', color: '#3B82F6' },
    collapsibleContainer: { overflow: 'hidden' },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
    bidLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 10 },
    stepperContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    stepBtn: {
        width: 45,
        height: 45,
        backgroundColor: colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBtn: { backgroundColor: '#CBD5E1' },
    stepText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    inputBox: {
        flex: 1,
        height: 45,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currency: { fontSize: 16, fontWeight: 'bold', color: '#64748B', marginRight: 4 },
    bidValueText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
    submitBtn: {
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
