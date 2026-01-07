import React, { useCallback, useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import LiveAuctionTile from './LiveAuctionTile';
import { useNavigation } from '@react-navigation/native';
import { useFetchLiveAuction } from '../../Services/BBPS/Hooks';
import { SearchInput } from '../../Component/Serach/SeacrhInput';
import { Skelton } from '../../Component/Index';
import colors from '../../Constant/Color';
import { useDispatch, useSelector } from 'react-redux';
import { selectPurchaseAuctionSlice, togglePurchaseAuction } from '../../Redux/Slices/selectPurchaseAuction';
import { apiCall } from '../../Axios/Axios';
import { GET_MY_AUCTION, LIVE_AUCTION } from '../../Services/BBPS/ApiUrls';
import moment from 'moment';

const LiveAuction = () => {
    const navigation: any = useNavigation();
    const Dispatch = useDispatch()
    const SelectedPurchaseList = useSelector((state: any) => state.selectPurchaseAuction);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isRefetching, refetch }: any = useFetchLiveAuction();
    const [showRefreshBanner, setShowRefreshBanner] = useState(false);
    const [allBoolean, setAllBoolean] = useState({ liveAuctionData: [] })

    useEffect(() => {
        if (isRefetching) {
            setShowRefreshBanner(true);
        } else {
            const timer = setTimeout(() => {
                setShowRefreshBanner(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isRefetching]);

    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage]);

    const renderFooter = useCallback(() => {
        if (!isFetchingNextPage) return null;
        return (
            <View style={{ paddingVertical: 12 }}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    }, [isFetchingNextPage]);

    const renderItem = useCallback(
        ({ item, index }: any) => {
            const isPurchase = SelectedPurchaseList.findIndex((prev: any) => prev.auctionNumber === item.auctionNumber)
            return <LiveAuctionTile
                data={item}
                index={index}
                auctionId={item.auctionId}
                auctionDispatchDate={item.auctionDispatchDate}
                isPurchased={isPurchase !== -1 ? true : false}
                purchaseEnd={item.purchaseEnd}
                auctionOfWork={item.auctionOfWork}
                auctionFees={item.auctionFees}
                auctionNumber={item.auctionNumber}
                onPurchasePress={() => { Dispatch(togglePurchaseAuction(item)) }}
                onDetailsPress={() => { }}
            />
        },
        [SelectedPurchaseList]
    );

    const getMyAuction = async () => {
        try {

            const res = await apiCall<any>('get', `${GET_MY_AUCTION}`,);

            if (res?.statusCode === 200) {
                const purchasedIds = new Set(
                    res.data.map((item: any) => item.auctionId),
                );

                const filteredLive = data?.result.map((item: any) => ({
                    ...item,
                    active: !purchasedIds.has(item.auctionId), // false if match, true otherwise
                }));

                setAllBoolean(prev => ({
                    ...prev,
                    liveAuctionData: filteredLive
                }));
            }
        } catch (error) {
            console.error('getMyAuction error', error);
        } finally {
            setAllBoolean(prev => ({ ...prev, isLoading: false }));
        }
    };

    useEffect(() => {
        if (data?.result?.length > 0) {
            getMyAuction()
        }
    }, [data])

    if (isLoading) {
        return <Skelton />;
    }

    return (
        <View style={{ flex: 1 }}>
            <SearchInput onChange={() => { }} placeholder="Search...." />

            {showRefreshBanner && (
                <Animated.View
                    entering={FadeInDown.duration(200)}
                    exiting={FadeOutUp.duration(500)}
                    style={{
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        marginTop: 6,
                        borderRadius: 20,
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 4,
                        zIndex: 10, // Ensure it stays on top
                        position: 'absolute',
                        top: 60, // Adjust based on your SearchInput height
                    }}
                >
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text
                        style={{
                            fontSize: 13,
                            color: '#374151',
                            fontWeight: '500',
                        }}
                    >
                        Refreshing auctions
                    </Text>
                </Animated.View>
            )}

            <FlatList
                data={allBoolean.liveAuctionData ?? []}
                keyExtractor={(item: any) => String(item.auctionNumber)}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor="transparent" // Set to transparent if you only want your custom banner to show
                        colors={[colors.primary]}
                    />
                }
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={7}
                removeClippedSubviews
                updateCellsBatchingPeriod={50}
            />
        </View>
    );
};

export default LiveAuction;