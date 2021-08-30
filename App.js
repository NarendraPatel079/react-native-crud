import React, { useState } from 'react';
import RootStack from './v1/navigators/RootStack';

// App Loading
import AppLoading from 'expo-app-loading';

// Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials Context
import { CredentialsContext } from './v1/components/CredentialsContext';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storeCredentials, setStoreCredentials] = useState("");

  const checkLoginCredentials = () => {
    AsyncStorage
    .getItem('reactNativeCRUDCredentials')
    .then((result) => {
      // console.log('reactNativeCRUDCredentials', result);
      if (result && result !== null) {
        setStoreCredentials(JSON.parse(result));
      } else {
        setStoreCredentials(null);
      }
    })
    .catch(error => console.error(error));
  }

  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    )
  }

  return (
    <CredentialsContext.Provider
      value={
        { storeCredentials, setStoreCredentials }
      }
    >
      <RootStack/>
    </CredentialsContext.Provider>
  );
}
