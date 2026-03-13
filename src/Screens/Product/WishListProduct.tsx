import React, { useCallback } from 'react';
import { Header } from '../../Component/Index';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import colors from '../../Constant/Color';
import Header2 from '../../Component/Header/Header2';
const WishListProduct = ({ route }: any) => {


  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header2 title={'Wishlist'} arrow={true} />
    </View>
  );
};

export default WishListProduct;
