import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainScreen from './screens/main/MainScreen';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <PaperProvider>
          <MainScreen />
        </PaperProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
