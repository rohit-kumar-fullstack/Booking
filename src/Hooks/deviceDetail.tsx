import { Platform } from 'react-native';
import * as Network from 'expo-network';

export const getDeviceDetails = async () => {
  const ipAddress = await Network.getIpAddressAsync();

  const detail = [
    { name: 'IMEI', value: '356938035643809' }, 
    { name: 'IP', value: ipAddress },
    { name: 'OS', value: Platform.OS },
    { name: 'APP', value: 'Globots' },
  ];

  return {detail};
};
