import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, StatusBar, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/Redux/Store.js';
import Routes from './src/Navigation/Routes.jsx';
import { NavigationContainer } from '@react-navigation/native';
import colors from './src/Constant/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
LogBox.ignoreAllLogs(true);

const App = () => {
  const queryClient = new QueryClient();
  const insets = useSafeAreaInsets()
  return (
    <NavigationContainer >
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AlertNotificationRoot>
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                <View style={{ flex: 1, backgroundColor: colors.white, paddingBottom: insets.bottom }}>
                  <StatusBar barStyle="dark-content" />
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
