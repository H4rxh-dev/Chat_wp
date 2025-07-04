import { PermissionsAndroid } from 'react-native';

export const requestSMSPermissions = async () => {
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    PermissionsAndroid.PERMISSIONS.READ_SMS,
  ]);
  return (
    granted['android.permission.RECEIVE_SMS'] === 'granted' &&
    granted['android.permission.READ_SMS'] === 'granted'
  );
};
