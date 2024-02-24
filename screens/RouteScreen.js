import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
  StyleSheet, Text, View, Dimensions, TouchableOpacity,
  SafeAreaView, Image} from 'react-native';
import { FontAwesome, Entypo, MaterialIcons, MaterialCommunityIcons, Ionicons, Foundation }
  from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import HomeScreen from "./HomeScreen";
import WorldCup from "./WorldCup";
import Series from "./Series";
import Predictions from './Predictions';
import MoreMenus from './MoreMenu';
import HP from '../screen_presenter/Home_Presenter';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const TitlebarHeight = "9%";

export default function RouteScreen({ navigation, route }) {
  const [isServerError, set_isServerError] = React.useState(false);
  const [HomeAct, Set_HomeAct] = React.useState(true)
  const [WorldCAct, Set_WorldC] = React.useState(false)
  const [SeriesAct, Set_Series] = React.useState(false)
  const [PredictionsAct, Set_Predictions] = React.useState(false)
  const [MoreAct, Set_More] = React.useState(false)
  const [SName, Set_SName] = React.useState("ICC CRICKET")
  const [isfirst, set_isfirst] = React.useState(0);
  const [isSecond, set_Second] = React.useState(0);
  const [statusbarHeight, set_statusbarHeight] = React.useState("6%");
  const [BodyHeight, set_BodyHeight] = React.useState("85%");
  const [MargTopSwepScreen12, set_MargTopSwepScreen12] = React.useState("10%");
  
  function handlePress(mess, typ) {
    showMessage({
      message: "Error",
      description: "Server error, try after some time.",
      type: "success",
      duration: 5000,
      autoHide: true,
      backgroundColor: "#444444",
      color: "#FFFFFF",
    });
  }
  const FetchData = async () => {
    let FA;
    if(DEVICEHEIGHT <= 708){
      set_statusbarHeight("6%");
      set_BodyHeight("85%");
      set_MargTopSwepScreen12("10%");
    }
    if(DEVICEHEIGHT <= 734 && DEVICEHEIGHT > 708){
      set_statusbarHeight("8.4%");
      set_BodyHeight("87.5%");
      set_MargTopSwepScreen12("20%");
    }
    if(DEVICEHEIGHT > 734){
      set_statusbarHeight("8.4%");
      set_BodyHeight("89%");
      set_MargTopSwepScreen12("30%");
    }
    
    FA = await HP.Get_FeaturedArticles('posts?categories=2&per_page=1&page=1');
    if(!FA || FA == "undefined" || !FA.length){
      set_isServerError(true);
      handlePress("Server is not responding, try after some time.", "success");
      console.log("RouteScreen.js, FA : ", "Server is not responding, try after some time.");
    }else{
      set_isServerError(false);
    }
  }

  async function firstTime() {
    await SplashScreen.preventAutoHideAsync();
    try {
      const value = await AsyncStorage.getItem('FirstTime');
      if (value == null) {
        set_isfirst(1);
        set_Second(1);
        await AsyncStorage.setItem('FirstTime', "true");
      } else {
        set_isfirst(0);
        set_Second(0);
      }
    } catch (err) {
      alert(err)
    }
    setTimeout(async ()=>{await SplashScreen.hideAsync()}, 2000);
  }
  React.useEffect(() => {
    FetchData();
    firstTime();
  }, []);
  function ActiveHome() {
    Set_HomeAct(true);
    Set_Series(false);
    Set_WorldC(false);
    Set_Predictions(false);
    Set_More(false);
    Set_SName("ICC CRICKET");
  }
  function ActiveWorldC() {
    Set_HomeAct(false);
    Set_Series(false);
    Set_WorldC(true);
    Set_Predictions(false);
    Set_More(false);
    Set_SName("World Cup");
  }
  function ActiveSeries() {
    Set_HomeAct(false);
    Set_Series(true);
    Set_WorldC(false);
    Set_Predictions(false);
    Set_More(false);
    Set_SName("SERIES");
  }
  function ActivePrediction() {
    Set_HomeAct(false);
    Set_Series(false);
    Set_WorldC(false);
    Set_Predictions(true);
    Set_More(false);
    Set_SName("Predictions");
  }
  function ActiveMore() {
    Set_HomeAct(false);
    Set_Series(false);
    Set_WorldC(false);
    Set_Predictions(false);
    Set_More(true);
    Set_SName("More");
  }
  //---------------------------------------------
  function Swep1Skip() {
    set_isfirst(0);
    set_Second(0);
  }
  function Swep1Next() {
    set_isfirst(0);
    set_Second(1);
  }
  //---------------------------------------------
  function Swep2Start() {
    set_Second(0);
  }
  //---------------------------------------------
  const SwepScreen1 = () => {
    return (
      <View>
        <View style={{height: DEVICEHEIGHT, width: DEVICEWIDTH,
          backgroundColor: "#000000", alignItems: "center",
          justifyContent: "center", flexDirection: "column"}}>
          <Image source={require('../assets/SwepScreen1.png')} style={{ width: 360, height: 400,
                marginTop: "20%" }} />
          <Text style={{ color: "#FFFFFF", fontSize: 14, marginTop: 20 }}>
            Batting, bowling, and a love for the game
          </Text>
          <Text style={{ color: "#FFFFFF", fontSize: 14, }}>
            Proud to be a cricket fan!
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}>
            <View style={{
              backgroundColor: "#7B94EC", width: 20, height: 10,
              borderRadius: 40,
            }} />
            <View style={{ width: 20 }} />
            <View style={{
              backgroundColor: "#FFFFFF", width: 20, height: 10,
              borderRadius: 40,
            }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center',
               marginTop: MargTopSwepScreen12, width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.07}}>
            <TouchableOpacity onPress={() => Swep1Skip()}
              style={{width: DEVICEWIDTH * 0.25, height: DEVICEHEIGHT * 0.08,
                alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{ color: "#FFFFFF", fontSize: 19, fontWeight: "800",
                  height: DEVICEHEIGHT * 0.06 }}>
                Skip
              </Text>
            </TouchableOpacity>
            <View style={{ width: DEVICEWIDTH * 0.45 }} />
            <TouchableOpacity onPress={() => Swep1Next()}
              style={{width: DEVICEWIDTH * 0.25, height: DEVICEHEIGHT * 0.08,
                alignItems: 'center', justifyContent: 'center'}}>

              <Text style={{ color: "#FFFFFF", fontSize: 19, fontWeight: "800",
                  height: DEVICEHEIGHT * 0.06 }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

  }
  //---------------------------------------------
  const SwepScreen2 = () => {
    return (
      <View>
        <SafeAreaView>
          <View style={{
            height: DEVICEHEIGHT, width: DEVICEWIDTH,
            backgroundColor: "#000000", alignItems: "center",
            justifyContent: "center", flexDirection: "column"
          }}>
            <Image source={require('../assets/SwepScreen2.png')} style={{ width: 360, height: 400 }} />
            <Text style={{ color: "#FFFFFF", fontSize: 14, marginTop: 20 }}>
              The game is not just played on the field,
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 14, }}>
              but cherished in the soul.
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}>
              <View style={{
                backgroundColor: "#FFFFFF", width: 20, height: 10,
                borderRadius: 40,
              }} />
              <View style={{ width: 20 }} />
              <View style={{backgroundColor: "#7B94EC", width: 20, height: 10,
                            borderRadius: 40,}} />
            </View>
            <TouchableOpacity onPress={() => Swep2Start()}
              style={{width: DEVICEWIDTH * 0.7, height: DEVICEWIDTH * 0.2,
                justifyContent: 'center', alignItems: 'center', marginTop: MargTopSwepScreen12}}>
              <View style={{width: DEVICEWIDTH * 0.7, height: "70%",
                backgroundColor: "#5EB9FE", borderRadius: 30,
                justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ color: "#000000", fontSize: 17, fontWeight: "800" }}>
                  Get Started
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );

  }
  //---------------------------------------
  return (
    <SafeAreaView>
      <StatusBar style='auto' />
      <View style={{height: DEVICEHEIGHT, width: DEVICEWIDTH * 0.958, marginTop: statusbarHeight }}>
        {
          isfirst == 1 ? (
            <SwepScreen1 />
          ) : (
            isSecond == 1 ? (
              <SwepScreen2 />
            ) : (
              <View style={styles.container}>
                <View style={{flexDirection: 'row', height: TitlebarHeight, width: DEVICEWIDTH,
                  backgroundColor: "#2574EB", alignItems: 'center',}}>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {
                      HomeAct ? (
                        <View style={{ flexDirection: 'column', marginStart: 10 }}>
                          <Image source={require('../assets/iccLogo.png')}
                            style={{ width: 220, height: 55 }} />
                        </View>
                      ) : (
                        <Text style={{
                          color: "#FFFFFF", marginStart: 10, fontSize: 20,
                          fontWeight: 'bold'
                        }}>{SName}</Text>
                      )
                    }
                  </View>
                </View>
                {/* Body */}
                <View style={{height: BodyHeight, width: DEVICEWIDTH,}}>
                {
                    isServerError ? (
                      <Image source={require('../assets/Welcome_icc.png')}
                        style={{width: "100%", height: "96%",}}
                      />
                    ):(
                  <View>
                <View style={{height: "92%", width: DEVICEWIDTH,
                    backgroundColor: "#000000",}}>
                  {
                    HomeAct ? (
                      <HomeScreen />
                    ) : (
                      WorldCAct ? (
                        <WorldCup />
                      ) : (
                        SeriesAct ? (
                          <Series />
                        ) : (
                          PredictionsAct ? (
                            <Predictions />
                          ) : (
                            MoreAct ? (
                              <MoreMenus />
                            ) : (
                              <View></View>
                            )
                          )
                        )
                      )
                    )
              
                  }
                </View>
                {/* Bottom tab */}
                <View style={{height: DEVICEHEIGHT * 0.085, width: DEVICEWIDTH,
                              backgroundColor: "#FFFFFF", flexDirection: 'row',
                              justifyContent: 'center', alignItems: 'center', paddingTop: 7}}>
                  <TouchableOpacity onPress={() => ActiveHome()} style={{ width: DEVICEWIDTH * 0.20,
                          height: DEVICEHEIGHT * 0.085 }}>
                    <View style={{ flexDirection: 'column', justifyContent: HomeAct ? 'flex-start':'center',
                          alignItems: 'center', height: DEVICEHEIGHT * 0.085 }}>
                      <FontAwesome name="home" size={HomeAct ? 33 : 24} color={HomeAct ? "#7B94EC" : "black"} />
                      <Text style={{ fontSize: HomeAct ? 12 : 11, color: HomeAct ? "#7B94EC" : "black" }}>
                        HOME</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => ActiveSeries()} style={{ width: DEVICEWIDTH * 0.20,
                          height: DEVICEHEIGHT * 0.085 }}>
                    <View style={{ flexDirection: 'column', justifyContent: SeriesAct ? 'flex-start':'center',
                          alignItems: 'center', height: DEVICEHEIGHT * 0.085 }}>
                      <Entypo name="trophy" size={SeriesAct ? 31 : 24} color={SeriesAct ? "#7B94EC" : "black"} />
                      <Text style={{ fontSize: SeriesAct ? 12 : 11, color: SeriesAct ? "#7B94EC" : "black" }}>
                        SERIES</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => ActiveWorldC()} style={{ width: DEVICEWIDTH * 0.21,
                          height: DEVICEHEIGHT * 0.085 }}>
                  <View style={{ flexDirection: 'column', justifyContent: WorldCAct ? 'flex-start':'center',
                          alignItems: 'center', height: DEVICEHEIGHT * 0.085 }}>
                      <MaterialIcons name="sports-cricket" size={WorldCAct ? 31 : 24}
                        color={WorldCAct ? "#7B94EC" : "black"} />
                      <Text style={{ fontSize: WorldCAct ? 12 : 11, color: WorldCAct ? "#7B94EC" : "black" }}>
                        WORLD CUP</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => ActivePrediction()} style={{ width: DEVICEWIDTH * 0.23,
                          height: DEVICEHEIGHT * 0.085 }}>
                    <View style={{ flexDirection: 'column',
                          justifyContent: PredictionsAct ? 'flex-start':'center',
                          alignItems: 'center', height: DEVICEHEIGHT * 0.085 }}>
                      <Foundation name="graph-trend" size={PredictionsAct ? 37 : 24}
                        color={PredictionsAct ? "#7B94EC" : "black"} />
                      <Text style={{ fontSize: PredictionsAct ? 11 : 11, color: PredictionsAct ? "#7B94EC" : "black" }}>
                        PREDICTIONS</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => ActiveMore()} style={{ width: DEVICEWIDTH * 0.20,
                          height: DEVICEHEIGHT * 0.085 }}>
                  <View style={{ flexDirection: 'column', justifyContent: MoreAct ? 'flex-start':'center',
                          alignItems: 'center', height: DEVICEHEIGHT * 0.085 }}>
                      <MaterialCommunityIcons name="sort-variant" size={MoreAct ? 33 : 24}
                        color={MoreAct ? "#7B94EC" : "black"} />
                      <Text style={{ fontSize: MoreAct ? 12 : 11, color: MoreAct ? "#7B94EC" : "black" }}>
                        MORE</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                </View>
                    )}
            </View>
            </View>
            )
          )
        }
        <FlashMessage/>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: "100%",
    height: "100%",
  },
});