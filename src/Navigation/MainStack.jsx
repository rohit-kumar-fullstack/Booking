import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationString from '../Constant/NavigationString';
import Screens from '../Screens';
import colors from '../Constant/Color';
import BottomTab from './Bottom';

export default function MainStack() {
  const Stack = createStackNavigator();
  const option = { headerShown: false };
   const fadeTransition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: { animation: 'timing', config: { duration: 300 } },
      close: { animation: 'timing', config: { duration: 300 } },
    },
    cardStyleInterpolator: ({ current }) => ({
      cardStyle: {
        opacity: current.progress,
      },
    }),
  };

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.white },
        ...fadeTransition
      }}
    >
      <Stack.Screen name={NavigationString.Splash} component={Screens.Splash} options={option} />
      <Stack.Screen name={NavigationString.Onboarding} component={Screens.Onboarding} options={option} />
      <Stack.Screen name={NavigationString.Login} component={Screens.Login} options={option} />
      <Stack.Screen name={NavigationString.Home} component={BottomTab} options={option} />
      <Stack.Screen name={NavigationString.PurchaseList} component={Screens.PurchaseList} options={option} />
      <Stack.Screen name={NavigationString.Emd} component={Screens.Emd} options={option} />
      <Stack.Screen name={NavigationString.StartBidding} component={Screens.StartBidding} options={option} />
      <Stack.Screen name={NavigationString.PurchaseAuctionList} component={Screens.PurchaseAuctionList} options={option} />
      <Stack.Screen name={NavigationString.StartReverseBidding} component={Screens.StartReverseBidding} options={option} />

    </Stack.Navigator>
  );
}
