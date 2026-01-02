import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import colors from '../../Constant/Color';

const AuctionTimer = ({ SelectedAuction, setAllBoolean }: any) => {
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    if (!SelectedAuction?.keyDates?.auctionBidding?.endDateTime) return;

    const format = 'DD-MM-YYYY HH:mm:ss';
    const endTime = moment(
      SelectedAuction.keyDates.auctionBidding.endDateTime,
      format
    );

    const timer = setInterval(() => {
      const now = moment();
      const diff = moment.duration(endTime.diff(now));

      if (diff.asSeconds() <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(timer);

        setAllBoolean((prev: any) => ({
          ...prev,
          timeEnd: true,
        }));

        return;
      }

      const hours = String(Math.floor(diff.asHours())).padStart(2, '0');
      const minutes = String(diff.minutes()).padStart(2, '0');
      const seconds = String(diff.seconds()).padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [SelectedAuction]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <LottieView
        source={require('../../lottie/clock.json')}
        autoPlay
        loop
        style={{ width: 20, height: 20 }}
      />
      <Text style={{ fontSize: 18, color: colors.black }}>{timeLeft}</Text>
    </View>
  );
};

export default AuctionTimer;
