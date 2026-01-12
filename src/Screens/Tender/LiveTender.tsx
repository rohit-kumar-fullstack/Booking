import React, { useCallback, useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useFetchLiveAuction, useFetchLiveTender } from '../../Services/BBPS/Hooks';
import { SearchInput } from '../../Component/Serach/SeacrhInput';
import { Skelton } from '../../Component/Index';
import colors from '../../Constant/Color';
import { useDispatch, useSelector } from 'react-redux';
import { togglePurchaseTender } from '../../Redux/Slices/SelectedPurchaseTender';
import LiveTenderTile from './LiveTenderTile';

const LiveTender = () => {
    const navigation: any = useNavigation();
    const Dispatch = useDispatch()
    const SelectedPurchaseList = useSelector((state: any) => state.selectPurchaseTender);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isRefetching, refetch }: any = useFetchLiveTender();
    const [showRefreshBanner, setShowRefreshBanner] = useState(false);

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
            const isPurchase = SelectedPurchaseList.findIndex((prev: any) => prev.tenderId === item.tenderId)
            return <LiveTenderTile
                data={item}
                index={index}
                tenderId={item.tenderId}
                tenderDispatchDate={item.purchaseStart}
                isPurchased={isPurchase !== -1 ? true : false}
                purchaseEnd={item.purchaseEnd}
                tenderOfWork={item.departmentName}
                tenderFees={item.documentFees}
                tenderNumber={item.tenderNumber}
                onPurchasePress={() => { Dispatch(togglePurchaseTender(item)) }}
                onDetailsPress={() => navigation.navigate('LiveTenderDetail', { item })}
            />
        },
        [SelectedPurchaseList]
    );

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
                        Refreshing Tender
                    </Text>
                </Animated.View>
            )}

            <FlatList
                data={data?.data ?? []}
                keyExtractor={(item) => String(item.auctionId)}
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
                        tintColor="transparent"
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

export default LiveTender;