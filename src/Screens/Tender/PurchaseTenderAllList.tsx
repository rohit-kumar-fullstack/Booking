import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import LiveTenderTile from './LiveTenderTile';
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


const PurchaseTenderAllList = () => {
    const navigation = useNavigation() as any;
    const Dispatch = useDispatch()

    const [allBoolean, setAllBoolean] = useState<allBooleanProps>({ isShowFilter: false })
    const [page, setPage] = useState(1);
    const { data: data, isPending, isFetching } = useFetchPurchaseTender(page);

    console.log("data my data : ", data);
    const [allData, setAllData] = useState<any[]>([]);
    const format = 'DD-MM-YYYY HH:mm:ss';

    const tenderList = data?.data || [];
    const totalCount = data?.totalCount || 0;

    // Append new page data
    React.useEffect(() => {
        if (tenderList.length) {
            setAllData(prev => {
                const merged = [...prev, ...tenderList];
                const unique = merged.filter(
                    (v, i, a) => a.findIndex(t => t.tenderId === v.tenderId) === i
                );
                return unique;
            });
        }
    }, [tenderList]);
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
    console.log(allBoolean);

    const loadMore = () => {
        if (allData.length < totalCount && !isFetching) {
            setPage(prev => prev + 1);
        }
    };
      const renderFooter = () => {
    if (!isFetching) return null;
    return (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={{ marginVertical: 16 }}
      />
    );
  };

  console.log("all data : ", allData)
    return (
        <View style={{ flex: 1 }}>
            <SearchInput onChange={() => { }} placeholder='Search....' filterPress={() => { setAllBoolean((prev: any) => ({ ...prev, isShowFilter: !prev.isShowFilter })) }} />
            {isPending ? <Skelton /> : <FlatList
                data={allData || []}
                keyExtractor={(_, index) => index.toString()}
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
                            // navigation.navigate(NavigationString, { data: item })
                        }}
                        buttonEnable={isTenderActive(item)}
                        isTenderEnd={isTenderEnd(item)}
                    />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.6}
                ListFooterComponent={renderFooter}
            />}


            {allBoolean.isShowFilter && <View style={{ flex: 1 }}>
                <FilterModal visible={allBoolean.isShowFilter} onClose={() => { setAllBoolean((prev: any) => ({ ...prev, isShowFilter: false })) }} onApply={() => { }} />
            </View>}

        </View>
    );
};

export default PurchaseTenderAllList;

