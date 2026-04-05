
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, StatusBar, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { persistor, store } from './src/Redux/Store';
import Routes from './src/Navigation/Routes.jsx';
import { NavigationContainer } from '@react-navigation/native';
import colors from './src/Constant/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-reanimated'
import 'react-native-gesture-handler'
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
              <PaperProvider>
                <PersistGate persistor={persistor}>
                  <View style={{ flex: 1, backgroundColor: colors.white, paddingBottom: insets.bottom }}>
                    <StatusBar barStyle="dark-content" />
                    <Routes />
                  </View>
                </PersistGate>
              </PaperProvider>
            </Provider>
          </AlertNotificationRoot>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
