/* eslint-disable prettier/prettier */
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import startupData from '../assets/STARTUP';
import Svg1 from '../assets/Svg1';
import Svg2 from '../assets/Svg2';
import Svg3 from '../assets/Svg3';
import MyBtn from '../screens/MyBtn';

const BG = '#333';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const renderItem = ({item}) => (
  <View style={styles.pages}>
    {item.id === 1 && <Svg1 />}
    {item.id === 2 && <Svg2 />}
    {item.id === 3 && <Svg3 />}
    <View style={styles.wrapper}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  </View>
);

export default function Startup({navigation}) {
  const [scrollIndex, scrollIndexSet] = useState(0);
  const scrollRef = useRef(null);

  function updateIndex(e) {
    const scrollOffset = e.nativeEvent.contentOffset.x;
    const currentSlide = Math.round(scrollOffset / WIDTH);
    scrollIndexSet(currentSlide);
  }
  function nextBtn() {
    if (scrollIndex < startupData.length - 1) {
      scrollIndexSet(scrollIndex + 1);
      scrollRef?.current?.scrollToOffset({
        offset: (scrollIndex + 1) * WIDTH,
        animated: true,
      });
    }
  }
  function skipBtn() {
    scrollIndexSet(startupData.length - 1);
    scrollRef?.current?.scrollToOffset({
      offset: (scrollIndex + 2) * WIDTH,
      animated: true,
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        source={require('../assets/img/1.jpg')}
        style={styles.background}
        blurRadius={4}
      />
      <FlatList
        ref={scrollRef}
        data={startupData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{height: HEIGHT * 0.75}}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={updateIndex}
      />
      <View style={styles.footer}>
        <View
          style={{
            flexDirection: 'row',
            width: 50,
            justifyContent: 'space-around',
          }}>
          {startupData.map((_, index) => (
            <View
              style={[
                styles.indicate,
                scrollIndex === index && {width: 16, backgroundColor: '#fff'},
              ]}
              key={index}
            />
          ))}
        </View>
        <View style={styles.buttons}>
          {scrollIndex === 2 ? (
            <>
              <View style={{width: 120}} />
              <MyBtn
                text="GET STARTED"
                handler={() => navigation.replace('Home')}
              />
            </>
          ) : (
            <>
              <MyBtn text="SKIP" handler={() => skipBtn()} outline />
              <MyBtn text="NEXT" handler={() => nextBtn()} />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG,
    flex: 1,
  },
  pages: {
    width: WIDTH,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 80,
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
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    maxWidth: '75%',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 23,
    color: '#c1c1c1',
    fontFamily: 'Montserrat-Medium',
  },
  footer: {
    height: HEIGHT * 0.25,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
  },
  indicate: {
    width: 8,
    height: 2.5,
    borderRadius: 5,
    backgroundColor: '#c1c1c1',
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
