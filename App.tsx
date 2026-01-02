import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Alert, Linking, LogBox, StatusBar, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/Redux/Store.js';
import Routes from './src/Navigation/Routes.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from './src/Constant/Color';
import { TextEncoder } from 'text-encoding';
LogBox.ignoreAllLogs(true);

const App = () => {
  const queryClient = new QueryClient();
  global.TextEncoder = TextEncoder;
  return (
    <NavigationContainer >
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AlertNotificationRoot>
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                {/* paddingTop: inset.top + 10, */}
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                  <StatusBar
                    barStyle="dark-content"
                  />
                  <Routes />
                </View>
              </PersistGate>
            </Provider>
          </AlertNotificationRoot>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
