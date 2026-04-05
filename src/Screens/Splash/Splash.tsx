import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import FontsFamily from '../../Constant/FontsFamily';
import { useNavigation } from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { mmkvStorage } from '../../Utils/Storage/Storage';

const Splash = () => {
  const navigation: any = useNavigation();

  const handleSplashNavigation = async () => {
    try {
      const Token = await mmkvStorage.getItem('token')
      const isOnboardingDone = await mmkvStorage.getItem('onBoarding')
      if (isOnboardingDone != 'true') {
        navigation.replace(NavigationString.Onboarding);
      } else if (Token) {
        navigation.replace(NavigationString.Home);
      } else {
        navigation.replace(NavigationString.Login);
      }
    } catch (error) {
      navigation.replace(NavigationString.Onboarding);
    }
  };
  useEffect(() => {
    handleSplashNavigation()
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: FontsFamily.poppinsBlack }}>
        Splash
      </Text>
    </View>
  );
};

export default Splash;
