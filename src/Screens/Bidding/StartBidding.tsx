import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Platform, Alert, BackHandler, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { InsideHeader } from '../../Component/Index';
import colors from '../../Constant/Color';
import { useWebSocketService } from '../../socket/Socket';
import Variables from '../../Constant/Variable';
import { useSelector } from 'react-redux';
import { apiCall } from '../../Axios/Axios';
import { FORWARD_AUCTION_ITEM, REVERSE_AUCTION_ITEM, SELECTED_AUCTION_ITEM } from '../../Services/BBPS/ApiUrls';
import BiddingCard from './Component/BiddingCard';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';
import CountdownTimer from '../../Component/Counter/CountdownTimer';
import FontsFamily from '../../Constant/FontsFamily';

const StartBidding = () => {
  const SelectedAuction = useSelector((state: any) => state.auction.auction);
  const loginUser = useSelector((state: any) => state.token.token)
  const Navigation: any = useNavigation()
  const [items, setItems] = useState<any>([]);
  const [bidValues, setBidValues] = useState<Record<number, number>>({});
  const [allBoolean, setAllBoolean] = useState({ showSuccess: false, showDialog: false, bidPayload: {} })
  const { subscribe, createRoom, placeBid } = useWebSocketService(
    Variables.webSocketUrl,
    () => console.log('Connected!'),
    (error) => console.log('WebSocket Error:', error),
    loginUser.token,
  );

  const getAllAcutionItems = async () => {
    try {
      const payload = { auctionNumber: SelectedAuction.auctionNumber };
      let auctionItem: any[] = [];

      if (SelectedAuction.auctionPattern === 'Forward') {
        const res = await apiCall<any>('get', FORWARD_AUCTION_ITEM, {}, payload);
        if (res?.statusCode === 200) auctionItem = res.data || [];
      } else {
        const res = await apiCall<any>('get', REVERSE_AUCTION_ITEM, {}, payload);
        if (res?.statusCode === 200) auctionItem = res.data || [];
      }

      const selectedRes = await apiCall<any>('get', SELECTED_AUCTION_ITEM, {}, payload);
console.log(selectedRes,'jhhhhhhhhhh');

      const uniqueArray: number[] = Array.from(
        new Set(selectedRes?.data || [])
      );

      const filteredItems = auctionItem.filter(item =>
        uniqueArray.includes(item.id)
      );


      const result = await createRoom(SelectedAuction.auctionNumber);

      subscribe(`/topic/room/${SelectedAuction.auctionNumber}`, data => {
        console.log('🔥 BID UPDATE:', data);
      });

      const bidAmountMap2 = new Map<number, { bidAmount: number; contractorId: number }>();

      (result || []).forEach((r: any) => {
        bidAmountMap2.set(r.auctionItemId, {
          bidAmount: r.bidAmount,
          contractorId: r.contractorId,
        });
      });



      const bidAmountMap = new Map<number, number>();

      (result || []).forEach((r: any) => {
        bidAmountMap.set(r.auctionItemId, r.bidAmount);
      });

      const updatedFilteredItems = filteredItems.map(item => {
        const bidData = bidAmountMap2.get(item.id);
        return {
          ...item,
          bidAmount: bidData?.bidAmount ?? item.auctionStartValueFigure,
          bidAvilable: bidData?.bidAmount ?? 0,
          me: bidData?.contractorId == loginUser.contractorId ? true : false
        };
      });

      const initialBids: Record<number, number> = {};
      updatedFilteredItems.forEach(item => {
        initialBids[item.id] = item.bidAmount;
      });
      setBidValues(initialBids);
      setItems(updatedFilteredItems);

    } catch (error) {
      console.error('Error fetching auction items:', error);
    }
  };

  subscribe(`/topic/room/${SelectedAuction.auctionNumber}`, async (message) => {
    // console.log('RAW MESSAGE:', message[message.length - 1]);
    const result = message[message.length - 1]

    const updatedBidItem = (prev: any[]) =>
      prev.map(item =>
        item.id === result.auctionItemId
          ? { ...item, bidAmount: result.bidAmount, me: result.contractorId == loginUser.contractorId ? true : false }
          : item
      );

    setItems(updatedBidItem);

    setBidValues(prev => ({
      ...prev,
      [result.auctionItemId]: result.bidAmount,
    }));
    try {

    } catch (err) {
      console.log('JSON parse error:', err);
    }
  });

  useEffect(() => {
    getAllAcutionItems();
    subscribe(`/topic/room/${SelectedAuction.auctionNumber}`, (data) => { });
  }, []);


  useEffect(() => {
    const initial: Record<number, number> = {};
    items.forEach((item: any) => {
      initial[item.id] = item.bidAmount + item.bidVariationValue;
    });
    setBidValues(initial);
  }, []);

  const handleUpdate = (id: number, val: number) => {
    setBidValues(prev => ({ ...prev, [id]: prev[id] + val }));
  };

  const submitBid = async (item: any) => {
    const payload = {
      itemId: item.id,
      bidAmount: bidValues[item.id],
      auctionId: SelectedAuction.auctionId,
      contractorId: loginUser.contractorId,
      fullName: loginUser.fullName,
      roomId: SelectedAuction.auctionNumber,
    };
    setAllBoolean((prev: any) => ({ ...prev, bidPayload: payload, }));
    Alert.alert(
      'Confirm Bid',
      `Are you sure you want to place a bid of ₹${payload.bidAmount}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: () => {

            placeBidSubmit(payload);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const placeBidSubmit = async (data: any) => {
    try {
      const result: any = await placeBid(data);

      if (result?.status && result.data) {
        const updatedBidItem = (prev: any[]) =>
          prev.map(item =>
            item.id === result.data.auctionItemId
              ? { ...item, bidAmount: result.data.bidAmount, me: result.data?.contractorId == loginUser.contractorId ? true : false }
              : item
          );

        // setItems(updatedBidItem);


        // setBidValues((prev: any) => ({
        //   ...prev,
        //   [result.data.auctionItemId]: {
        //     ...prev[result.data.auctionItemId],
        //     bidAmount: result.data.bidAmount,
        //   },
        // }));
        getAllAcutionItems()
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Confirm',
          'Do you want to go back to Dashboard?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Yes',
              onPress: () => {
                Navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: NavigationString.Home }],
                  })
                );
              },
            },
          ],
          { cancelable: true }
        );

        return true; // block default back action
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [Navigation])
  );
  return (
    <View style={styles.container}>
      <InsideHeader title="Bidding Panel" showArrow />
      <View style={styles.container2}>
        <Text style={styles.title}>
          {SelectedAuction.deptName}
        </Text>

        <View style={styles.timerWrapper}>
          <CountdownTimer
            endDate={SelectedAuction.keyDates.auctionBidding.endDateTime}
            myStyle={{ fontSize: 30 }}
            size={30}
          />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <BiddingCard
            item={{ ...item, index }}
            bidValue={bidValues[item.id] || 0}
            onIncrease={() => handleUpdate(item.id, item.bidVariationValue)}
            onDecrease={() => handleUpdate(item.id, -item.bidVariationValue)}
            onPlaceBid={() => { submitBid(item) }}
            SelectedAuction={SelectedAuction}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />

      {allBoolean.showSuccess && (
        <View style={styles.overlay}>
          <LottieView
            source={require('../../lottie/Success.json')}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
    </View>
  );
};

export default StartBidding;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  container2: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: FontsFamily.poppinsSemiBold,
    color: colors.black,
    marginBottom: 6,
    // textAlign:'center'
  },
  timerWrapper: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 2 } }),
  },
  leadingCard: { borderColor: '#22C55E', borderWidth: 2, backgroundColor: '#F0FDF4' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  label: { fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', fontWeight: '600' },
  mainPrice: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  incrementText: { fontSize: 16, fontWeight: '700', color: '#3B82F6' },
  collapsibleContainer: { overflow: 'hidden' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  bidLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 10 },
  stepperContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  stepBtn: { width: 45, height: 45, backgroundColor: colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  stepText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  inputBox: { flex: 1, height: 45, backgroundColor: '#F1F5F9', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  currency: { fontSize: 16, fontWeight: 'bold', color: '#64748B', marginRight: 4 },
  bidValueText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  submitBtn: { height: 50, backgroundColor: colors.primary, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 99 },
});