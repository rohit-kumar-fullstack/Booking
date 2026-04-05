/**
 * @format
 */
import './wdyr';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetworkProvider } from 'react-native-offline';
const Root = () => (
  <SafeAreaProvider>
    <NetworkProvider>
      <App />
    </NetworkProvider>
  </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => Root);
