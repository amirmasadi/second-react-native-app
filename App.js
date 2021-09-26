import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
  useDrawerProgress,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DATA from './assets/DATA';
import Screen from './screens/Screen';
import Startup from './screens/Startup';
import Animated, {interpolateNode} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MAIN = '#fff';
const MAIN2 = '#8E9AAF';
const MAIN2_PALE = '#DEE2FF';
import RNBootSplash from 'react-native-bootsplash';

//custom drawer
function CustomDrawer(props) {
  return (
    <DrawerContentScrollView
      style={{top: '50%', transform: [{translateY: -100}]}}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

//screen container for animation
function ScreenContainer({children}) {
  const progress = useDrawerProgress();
  const scale = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const borderRadius = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, 35],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: MAIN,
        transform: [{scale}],
        borderRadius,
        overflow: 'hidden',
      }}>
      {children}
      <StatusBar translucent backgroundColor="transparent" />
    </Animated.View>
  );
}

const Drawer = createDrawerNavigator();
function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        overlayColor: 0,
        headerShown: false,
        drawerType: 'back',
        drawerStyle: {
          backgroundColor: MAIN2,
          width: 150,
        },
        sceneContainerStyle: {
          backgroundColor: MAIN2,
        },
        drawerActiveBackgroundColor: MAIN2_PALE,
        drawerActiveTintColor: MAIN2,
        drawerInactiveTintColor: MAIN2_PALE,
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      {DATA.map(item => (
        <Drawer.Screen name={item.title} key={item.id}>
          {props => (
            <ScreenContainer>
              <Screen id={item.id} {...props} />
            </ScreenContainer>
          )}
        </Drawer.Screen>
      ))}
    </Drawer.Navigator>
  );
}
const Stack = createNativeStackNavigator();

export default function App() {
  const [firstTime, setFirstTime] = useState(null);

  useEffect(() => {
    async function getFirstTime() {
      const initialData = await AsyncStorage.getItem('firstTime');
      if (initialData === null) {
        setFirstTime(true);
        AsyncStorage.setItem('firstTime', 'false');
      } else {
        setFirstTime(false);
      }
    }
    getFirstTime();
  }, []);

  return (
    firstTime != null && (
      <NavigationContainer onReady={() => RNBootSplash.hide({fade: true})}>
        <Stack.Navigator>
          {firstTime && (
            <Stack.Screen
              name="Staetup"
              component={Startup}
              options={{headerShown: false}}
            />
          )}
          <Stack.Screen
            name="Home"
            component={MyDrawer}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  );
}
