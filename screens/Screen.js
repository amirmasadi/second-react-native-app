/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import DATA from '../assets/DATA';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDrawerStatus} from '@react-navigation/drawer';
import useSound from 'react-native-use-sound';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';

export default function Screen({id, navigation}) {
  const page = DATA.filter(item => item.id === id);

  //for play and pausing song
  const [play, pause, stop, data] = useSound(page[0].song);
  const handlePlay = () => {
    if (data.isPlaying) {
      stop();
    } else {
      play();
    }
  };
  //stop song and animations when drawer is open
  const isDrawerOpen = useDrawerStatus() === 'open';
  useEffect(() => {
    if (mplay) {
      buttonHandler();
    }
  }, [isDrawerOpen]);

  //for lottie animation play & pause
  const btnAnimation = useRef();
  const [mplay, setPlay] = useState(false);

  useEffect(() => {
    btnAnimation.current.play(0, 30);
  }, []);

  //this func handle the song and animations on btn press
  function buttonHandler() {
    setPlay(!mplay);
    //breatheAnimation.current.play();
    mplay
      ? btnAnimation.current.play(0, 30)
      : btnAnimation.current.play(30, 60);
    mplay ? (opa.value = 0) : (opa.value = 1);
    handlePlay();
  }

  //basically reset the animations when song is over
  useEffect(() => {
    if (data.isPlaying === false && mplay) {
      setPlay(false);
      //breatheAnimation.current.play();
      btnAnimation.current.play(0, 30);
      opa.value = 0;
    }
  }, [data.isPlaying]);

  //animations
  const opa = useSharedValue(0);
  const breathStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opa.value),
      transform: [{translateY: opa.value ? withTiming(0) : withTiming(50)}],
    };
  });
  const inStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(withTiming(opa.value, {duration: 3200}), 26, true),
    };
  });
  const outStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(
        3000,
        withRepeat(withTiming(opa.value, {duration: 3200}), 26, true),
      ),
    };
  });

  return (
    <>
      <Image
        source={page[0].img}
        style={styles.background} //blurRadius={2}
      />
      <View style={styles.container}>
        <View style={styles.headerCon}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{zIndex: 10}}>
            <Icon name="sort" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.header}>{page[0].title}</Text>
        </View>
        <Animated.View style={breathStyle}>
          <Text style={[styles.breathe ,{color: page[0].textColor}]}>
            {page[0].id === 2 ? 'This is' : 'Breathe'}
          </Text>
          <Animated.Text style={[styles.in, inStyle ,{color: page[0].textColor}]}>
            {page[0].id === 2 ? 'Self' : 'In'}
          </Animated.Text>
          <Animated.Text style={[styles.out, outStyle ,{color: page[0].textColor}]}>
            {page[0].id === 2 ? 'Destruction' : 'Out'}
          </Animated.Text>
        </Animated.View>
        <TouchableOpacity style={styles.btn} onPress={() => buttonHandler()}>
          <LottieView
            source={require('../assets/img/button.json')}
            ref={btnAnimation}
            loop={false}
            autoPlay={false}
            style={{opacity: 0.92}}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCon: {
    width: '100%',
    paddingTop: 70,
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 30,
    letterSpacing: 10,
    color: '#fff',
    marginTop: 30,
    opacity: 0.8,
    fontFamily: 'Montserrat-Medium',
  },
  img: {
    width: 150,
    height: 150,
  },
  btn: {
    width: 200,
    height: 200,
  },
  breathe: {
    fontSize: 40,
    fontFamily: 'Montserrat-Bold',
  },
  in: {
    fontSize: 40,
    fontFamily: 'Montserrat-Bold',
  },
  out: {
    fontSize: 40,
    fontFamily: 'Montserrat-Bold',
  },
});
