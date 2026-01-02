import React, { useEffect, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import LiveAuctionTile from './LiveAuctionTile';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useFetchPurchaseAuction } from '../../Services/BBPS/Hooks';
import PurchaseAuctionTile from './PurchaseAuctionTile';
import { useDispatch } from 'react-redux';
import { setAuction } from '../../Redux/Slices/SelectedAuction';
import { SearchInput } from '../../Component/Serach/SeacrhInput';
import { Skelton } from '../../Component/Index';
import { allBooleanProps } from './types/types';
import FilterModal from './Modal/FilterModal';


const PurchaseAuction = () => {
    const navigation = useNavigation() as any;
    const Dispatch = useDispatch()
    const { data = {}, isPending } = useFetchPurchaseAuction();
    const [allBoolean, setAllBoolean] = useState<allBooleanProps>({ isShowFilter: false })
    const format = 'DD-MM-YYYY HH:mm:ss';

    function isAuctionActive(item: any): boolean {
        const now = moment();
        const start = moment(item?.keyDates?.auctionBidding?.startDateTime, format);
        const end = moment(item?.keyDates?.auctionBidding?.endDateTime, format);

        if (!start.isValid() || !end.isValid()) return false;

        return now.isBetween(start, end, undefined, '[]');
    }

    function isAuctionEnd(item: any): boolean {
        const now = moment();
        const end = moment(item?.keyDates?.auctionBidding?.endDateTime, format);

        if (!end.isValid()) return false;

        return now.isAfter(end);
    }
    console.log(allBoolean);

    return (
        <View style={{ flex: 1 }}>
            <SearchInput onChange={() => { }} placeholder='Search....' filterPress={() => { setAllBoolean((prev: any) => ({ ...prev, isShowFilter: !prev.isShowFilter })) }} />
            {isPending ? <Skelton /> : <FlatList
                data={data?.data.slice(0, 10) || []}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 10 }}
                renderItem={({ item, index }) => (
                    <PurchaseAuctionTile
                        item={item}
                        onPressDetails={() => {
                            navigation.navigate('AuctionDetail', { item, onAddToPurchase: () => { }, routeFrom: 'PurchasedAuction' });
                        }}
                        onStartBidding={() => {
                            Dispatch(setAuction(item))
                            // navigation.navigate(NavigationString, { data: item })
                        }}
                        buttonEnable={isAuctionActive(item)}
                        isAuctionEnd={isAuctionEnd(item)}
                    />
                )}
            />}
            {allBoolean.isShowFilter && <View style={{ flex: 1 }}>
                <FilterModal visible={allBoolean.isShowFilter} onClose={() => { setAllBoolean((prev: any) => ({ ...prev, isShowFilter: false })) }} onApply={() => { }} />
            </View>}

        </View>
    );
};

export default PurchaseAuction;

