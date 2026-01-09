import React, { useState, useCallback, memo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useFetchPurchaseTender } from '../../Services/BBPS/Hooks';
import PurchaseTenderTile from './PurchaseTenderTile';
import { useDispatch } from 'react-redux';
import { setTender } from '../../Redux/Slices/SelectedTender';
import { SearchInput } from '../../Component/Serach/SeacrhInput';
import { Skelton } from '../../Component/Index';
import { allBooleanProps } from './types/types';
import FilterModal from './Modal/FilterModal';
import colors from '../../Constant/Color';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import NavigationString from '../../Constant/NavigationString';


const PurchaseTenderAllList = () => {
    const navigation = useNavigation() as any;
    const Dispatch = useDispatch()

    const [allBoolean, setAllBoolean] = useState<allBooleanProps>({ isShowFilter: false })
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isRefetching, refetch }: any = useFetchPurchaseTender();
    const [showRefreshBanner, setShowRefreshBanner] = useState(false);


    console.log("data for tender : ", data)
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
    const format = 'DD-MM-YYYY HH:mm:ss';

    function isTenderActive(item: any): boolean {
        const now = moment();
        const start = moment(item?.keyDates?.TenderBidding?.startDateTime, format);
        const end = moment(item?.keyDates?.TenderBidding?.endDateTime, format);

        if (!start.isValid() || !end.isValid()) return false;

        return now.isBetween(start, end, undefined, '[]');
    }

    function isTenderEnd(item: any): boolean {
        const now = moment();
        const end = moment(item?.keyDates?.TenderBidding?.endDateTime, format);

        if (!end.isValid()) return false;

        return now.isAfter(end);
    }
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
    
    return (
        <View style={{ flex: 1 }}>
            <SearchInput onChange={() => { }} placeholder='Search....' filterPress={() => { setAllBoolean((prev: any) => ({ ...prev, isShowFilter: !prev.isShowFilter })) }} />

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
                        Refreshing tenders
                    </Text>
                </Animated.View>
            )}
            {isLoading ? <Skelton />
                : <FlatList
                    data={data?.result ?? []}
                    keyExtractor={(item) => String(item.tenderId || item.id)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 10 }}
                    renderItem={({ item, index }) => (
                        <PurchaseTenderTile
                            item={item}
                            onPressDetails={() => {
                                navigation.navigate('TenderDetail', { item, onAddToPurchase: () => { }, routeFrom: 'PurchasedTender' });
                            }}
                            onStartBidding={() => {
                                Dispatch(setTender(item))
                                navigation.navigate(NavigationString.TenderBidding, { data: item })
                            }}
                            buttonEnable={isTenderActive(item)}
                            isTenderEnd={isTenderEnd(item)}
                        />
                    )}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={renderFooter}
                    refreshing={isRefetching}
                    onRefresh={refetch}
                />}


            {allBoolean.isShowFilter && <View style={{ flex: 1 }}>
                <FilterModal visible={allBoolean.isShowFilter} onClose={() => { setAllBoolean((prev: any) => ({ ...prev, isShowFilter: false })) }} onApply={() => { }} />
            </View>}

        </View>
    );
};

export default PurchaseTenderAllList;

