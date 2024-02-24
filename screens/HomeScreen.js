//You can try starting the emulator manually from the terminal with: C:\Users\admin\AppData\Local\Android\Sdk/emulator/emulator @Pixel_XL_API_33
import React from "react";
import {View, Text, RefreshControl, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity,
  ActivityIndicator, Platform, FlatList} from "react-native";
import { Entypo, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import axios from 'axios';

import HP from '../screen_presenter/Home_Presenter';
import SMR from "../repository/SMenu_Repository";
import config from "../AppConfig";

const useProxy = Platform.select({ web: true, default: true });

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const HomeScreen = ({ route }) => {

  const navigation = useNavigation();
  const [isServerError, set_isServerError] = React.useState(false);
  const [isLoading, set_isLoading] = React.useState(true);
  const [RefreshFArt, set_RefreshFArt] = React.useState(false);
  const [RefreshCTeam, set_RefreshCTeam] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoadingCR, set_isLoadingCR] = React.useState(true);
  const MonthNm = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const isCarousel = React.useRef(null);
  const [page, setPage] = React.useState(0);
  const [Totalpage, setTotalPage] = React.useState(0);
  const [DATAFeaturedArt, Set_DATAFeaturedArt] = React.useState([]);
  const [DATACricketCov, Set_DATACricketCov] = React.useState([]);
  const [DATATop5, Set_DATATop5] = React.useState([]);
  const [DataCricketNews, Set_DataCricketNews] = React.useState([]);
  const [DataCricketSchdule, Set_DataCricketSchdule] = React.useState([]);
  const [DataCricketTeam, Set_DataCricketTeam] = React.useState([]);
  const [CurrentSeriesTop5, Set_CurrentSeriesTop5] = React.useState([]);

  const [isCTeamShow, set_isCTeamShow] = React.useState(false);
  const [isTop5Show, set_isisTop5Show] = React.useState(false);
  const [isCSchdShow, set_isCSchdShow] = React.useState(false);

  const DummyData = [{id: 1}, {id: 2}, {id: 3}];
  let day, month, year, CTeamActiveNo = 0;

  function handlePress(mess, typ) {
    showMessage({
      message: "Server is not responding, try after some time.",
      type: "success",
    });
  }

  const FetchData = async () => {
    let FA, CV, Top5, CNws, CSchdule, CTeam, CurrentSeries5;
    console.log("*************************************************************************************************************");

    console.log("----------------------------------D W : ", DEVICEWIDTH);
    console.log("----------------------------------D H : ", DEVICEHEIGHT);

    FA = await HP.Get_FeaturedArticles('posts?categories=2&per_page=5&page=1');
    console.log("HomeScreen.js, FA data : ", FA);
    if(!FA || FA == "undefined" || !FA.length){
      set_isServerError(true);
      handlePress("Server error, try after some time.", "success");
    }else{
      console.log("HomeScreen.js, FA : ", FA);

      set_isServerError(false);
      Set_DATAFeaturedArt(FA);
        setTimeout(() => {
          set_isLoading(false);
          setRefreshing(false);
        }, 10);
      //CV = await HP.Get_CricketCovrage('posts?categories=2&per_page=5&page=1');
      Set_DATACricketCov(FA);

      // CurrentSeries5 = await SMR.Get_SeriesFirstM("menu/primary");
      // Set_CurrentSeriesTop5(CurrentSeries5);
      //   setTimeout(() => {
      //   set_isLoadingCR(false);
      //   }, 880);
      //-----------------------
      for(l=0; l<FA.length; l++){
        console.log("-----------------------------------------------------------------------------------");
        console.log("HomeScreen.js, GETData",FA[l]._links['wp:featuredmedia'][0].href, ", l : ",l);

        let resUrl = await axios.get(FA[l]._links['wp:featuredmedia'][0].href,);
          console.log("HomeScreen.js, Get_FeaturedArticles, sub data ",
            resUrl.data.media_details.sizes.medium.source_url, ", l : ", l);

          ImgUrl = resUrl.data.media_details.sizes.medium.source_url;
          FA[l]._links['wp:featuredmedia'][0].href = ImgUrl;
          //console.log("HomeScreen.js, GETData, ImgUrl : ",res[l]._links['wp:featuredmedia'][0].href);

        if(l>=FA.length-1){
          console.log("HomeScreen.js, Get_FeaturedArticles, res ",FA);
          Set_DATAFeaturedArt(FA);
          Set_DATACricketCov(FA);
          set_RefreshFArt(!RefreshFArt);
        }

      }

      //****************************** */
      CTeam = await HP.Get_FeaturedArticles("posts?categories=3&per_page=5&page=1");
      Set_DataCricketTeam(CTeam);
      console.log("HomeScreen.js, CTeam : ",CTeam);
      setTimeout(() => {
        set_isCTeamShow(true);
        setTotalPage(CTeam.length);
      }, 1000);
      Set_DataCricketNews(CTeam);
      //------------------
      let l = 0, ImgUrl='';
      for(l=0; l<CTeam.length; l++){
        try {
          let resUrl = await fetch(CTeam[l]._links['wp:featuredmedia'][0].href, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          resUrl = await resUrl.json();
          ImgUrl = resUrl.media_details.sizes.medium.source_url;
        } catch (e) {
          console.error(e);
        }
        CTeam[l]._links['wp:featuredmedia'][0].href = ImgUrl;
        if(l>=CTeam.length-1){
          Set_DataCricketTeam(CTeam);
          Set_DataCricketNews(CTeam);
          set_RefreshCTeam(!RefreshCTeam);
        }
      }
      //****************************** */
      Top5 = await HP.Get_FeaturedArticles('posts?categories=1405&per_page=3&page=1');
      Set_DATATop5(Top5);
      console.log("HomeScreen.js, Top5 Data : ", Top5);
      if(Top5.length > 0)
        set_isisTop5Show(true);
      //------------------
      l = 0, ImgUrl='';
      for(l=0; l<Top5.length; l++){
        try {
          let resUrl = await fetch(Top5[l]._links['wp:featuredmedia'][0].href, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          resUrl = await resUrl.json();
          ImgUrl = resUrl.media_details.sizes.medium.source_url;
        } catch (e) {
          console.error(e);
        }
        Top5[l]._links['wp:featuredmedia'][0].href = ImgUrl;
        if(l>=Top5.length-1){
          console.log("HomeScreen.js, Top5 : ", Top5);
          Set_DATATop5(Top5);
        }
      }
      //****************************** */
      //CNws = await HP.Get_MoreView('posts?categories=3&per_page=3&page=1');
      //Set_DataCricketNews(CNws);
      CSchdule = await HP.Get_FeaturedArticles('posts?categories=1&per_page=3&page=1');
      Set_DataCricketSchdule(CSchdule);
      if(CSchdule.length > 0)
        set_isCSchdShow(true)
      //------------------
      l = 0, ImgUrl='';
      for(l=0; l<CSchdule.length; l++){
        try {
          let resUrl = await fetch(CSchdule[l]._links['wp:featuredmedia'][0].href, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          resUrl = await resUrl.json();
          ImgUrl = resUrl.media_details.sizes.medium.source_url;
        } catch (e) {
          console.error(e);
        }
        CSchdule[l]._links['wp:featuredmedia'][0].href = ImgUrl;
        if(l>=CSchdule.length-1){
          Set_DataCricketSchdule(CSchdule);
        }
      }
      //****************************** */
    }
  }

  React.useEffect(() => {
    if(DATAFeaturedArt.length == 0){
      FetchData();
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    FetchData();
  }
  //--------------------------------------
  const FeatArtRenderItem = ({ item }) => {
    let title = item.title.rendered, desc = item.excerpt.rendered, dt = item.date, month, ftitle;
    title = title.replace(/<\/?[^>]+>/gi, '');
    ftitle = title;
    desc = desc.replace(/<\/?[^>]+>/gi, '');
    title = title.substring(0, 55);
    desc = desc.substring(0, 80);
    year = dt.substring(0, 4);
    month = dt.substring(5, 7);
    day = dt.substring(8, 10);

    return (
      <View style={styles.FeatArtcardContainer}>
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate("ShowDetail1",
          { title: ftitle, PageID: item.id })}>
          <View style={{ alignItems: 'center', }}>
            <Image source={{ uri: item._links['wp:featuredmedia'][0].href }}
              style={styles.FeatArtcard} resizeMode="contain" />
          </View>
          <Text style={styles.FeatArtLabel}>{title}...</Text>
          <Text style={styles.FeatArtLabelText}>{desc}...</Text>
          <View style={{
            flexDirection: "row", paddingLeft: 10, paddingBottom: 10,
            alignItems: "center"
          }}>
            <AntDesign name="calendar" size={24} color="grey" />
            <Text style={{ color: "grey", fontSize: 12, marginLeft: 7 }}>
              {day} {MonthNm[month - 1]} {year}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  //-------------------------------
  const CricketCovRenderItem = ({ item }) => {
    let title = item.title.rendered, desc = item.excerpt.rendered, ftitle;
    title = title.replace(/<\/?[^>]+>/gi, '');
    ftitle = title;
    desc = desc.replace(/<\/?[^>]+>/gi, '');
    title = title.substring(0, 51);
    desc = desc.substring(0, 80);
    return (
      <View style={styles.CricketCovCardContainer}>
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate("ShowDetail1",
          { title: ftitle, PageID: item.id })}>
          <View style={{ alignItems: 'center', }}>
            <Image source={{ uri: item._links['wp:featuredmedia'][0].href }}
              style={styles.CricketCovCard} resizeMode="contain" />
          </View>
          <Text style={styles.CricketCovLabel}>{title}...</Text>
          <Text style={styles.CricketCovLabelText}>{desc}...</Text>
        </TouchableOpacity>
      </View>
    );
  }
  //-------------------------------
  const CricketTeams = ({ item, index }) => {
    let title = item.title.rendered, desc = item.excerpt.rendered, dt = item.date, month, ftitle;
    title = title.replace(/<\/?[^>]+>/gi, '');
    ftitle = title;
    desc = desc.replace(/<\/?[^>]+>/gi, '');
    title = title.substring(0, 55);
    desc = desc.substring(0, 80);
    year = dt.substring(0, 4);
    month = dt.substring(5, 7);
    day = dt.substring(8, 10);

    return (
    <View style={styles.CTeamscardContainer}>
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate("ShowDetail1",
          { title: ftitle, PageID: item.id })}>
          <View style={{ alignItems: 'center', }}>
            <Image source={{ uri: item._links['wp:featuredmedia'][0].href }}
              style={styles.CTeamscard} resizeMode="contain" />
          </View>
          <View style={{backgroundColor: "#FFFFFF", borderRadius: 8,
              width: DEVICEWIDTH * 0.28, alignContent: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 14, color: "#2574EB", padding: 5}}>
              Cricket Appeal</Text>
          </View>
          <Text style={[styles.FeatArtLabel, { marginBottom: 0 }]}>{title}...</Text>
        </TouchableOpacity>
        </View>
    );
  }
  //-------------------------------
  const Top5Top10 = (item) => {
    let st = item._links['wp:featuredmedia'][0].href;
    st = st.substring(st.lastIndexOf(".")+1);
    st = st.substring(st.lastIndexOf(".")+1, 3);
    //console.log("ICCWCupList, Img Url : ", item._links['wp:featuredmedia'][0].href);
    if(st == 'png' || st == 'jpg' || st == 'jpe'){
        st=1;
    }else{
        st=0;
    }
    let title = item.title.rendered, desc = item.excerpt.rendered, dt = item.date, time, month, ftitle;
    title = title.replace(/<\/?[^>]+>/gi, '');
    ftitle = title;
    desc = desc.replace(/<\/?[^>]+>/gi, '');
    title = title.substring(0, 60);
    desc = desc.substring(0, 80);
    year = dt.substring(0, 4);
    month = dt.substring(5, 7);
    day = dt.substring(8, 10);
    time = dt.substring(11, 19);

    return (
      <TouchableOpacity key={item.id} onPress={() => navigation.navigate("ShowDetail1",
        { title: ftitle, PageID: item.id })}>
        <View style={[styles.cardview2, {
          flexDirection: "row", marginTop: 10,
          width: DEVICEWIDTH * 0.95, padding: 10
        }]}>
        {
            st == 1 ? (
                <Image source={{uri: item._links['wp:featuredmedia'][0].href}} 
                style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
                        borderRadius: 8}} resizeMode="contain"/>
            ):(
                <Image source={require('../assets/SwepScreen2.png')} 
                style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
                    borderRadius: 8}} resizeMode="contain"/>
            )
        }
          <View style={{ flexDirection: "column", marginLeft: 10 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, width: DEVICEWIDTH * 0.7, paddingRight: 8 }}>
              {title}...</Text>
            {/* <Text style={{color: "white", fontSize: 8, width: DEVICEWIDTH * 0.7}}>{desc}...</Text> */}
            <View style={{ flexDirection: "row", marginTop: 8, paddingBottom: 5, alignItems: "center" }}>
              <AntDesign name="calendar" size={24} color="#A2A2A2" />
              <Text style={{ color: "#A2A2A2", fontSize: 12, marginLeft: 7 }}>
                {day} {MonthNm[month - 1]} {year}</Text>
              <MaterialCommunityIcons name="credit-card-edit-outline" size={24}
                color="#A2A2A2" style={{ marginLeft: 10 }}/>
              <Text style={{ color: "#A2A2A2", fontSize: 12, marginLeft: 7 }}>
                {time}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  //-------------------------------
  const CricketNews = (item) => {
    let st = item._links['wp:featuredmedia'][0].href;
    st = st.substring(st.lastIndexOf(".")+1);
    st = st.substring(st.lastIndexOf(".")+1, 3);
    //console.log("ICCWCupList, Img Url : ", item._links['wp:featuredmedia'][0].href);
    if(st == 'png' || st == 'jpg' || st == 'jpe'){
        st=1;
    }else{
        st=0;
    }
    let title = item.title.rendered, desc = item.excerpt.rendered, dt = item.date, time, month, ftitle;
    title = title.replace(/<\/?[^>]+>/gi, '');
    ftitle = title;
    desc = desc.replace(/<\/?[^>]+>/gi, '');
    title = title.substring(0, 60);
    desc = desc.substring(0, 80);
    year = dt.substring(0, 4);
    month = dt.substring(5, 7);
    day = dt.substring(8, 10);
    time = dt.substring(11, 19);

    return (
      <TouchableOpacity key={item.id} onPress={() => navigation.navigate("ShowDetail1",
        { title: ftitle, PageID: item.id })}>
        <View style={[styles.cardview2, {
          flexDirection: "row", marginTop: 10,
          width: DEVICEWIDTH * 0.95, padding: 10
        }]}>
        {
            st == 1 ? (
                <Image source={{uri: item._links['wp:featuredmedia'][0].href}} 
                style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
                        borderRadius: 8}} resizeMode="contain"/>
            ):(
                <Image source={require('../assets/SwepScreen2.png')} 
                style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
                    borderRadius: 8}} resizeMode="contain"/>
            )
        }
          <View style={{ flexDirection: "column", marginLeft: 10 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, width: DEVICEWIDTH * 0.7, paddingRight: 8 }}>
              {title}...</Text>
            {/* <Text style={{color: "white", fontSize: 8, width: DEVICEWIDTH * 0.7}}>{desc}...</Text> */}
            <View style={{ flexDirection: "row", marginTop: 8, paddingBottom: 5, alignItems: "center" }}>
              <AntDesign name="calendar" size={24} color="#A2A2A2" />
              <Text style={{ color: "#A2A2A2", fontSize: 12, marginLeft: 7 }}>
                {day} {MonthNm[month - 1]} {year}</Text>
              {/* <Image source={require('../assets/wall_clock.png')} style={{width: 20, height: 20, marginLeft: 10}}/> */}
              <MaterialCommunityIcons name="credit-card-edit-outline" size={24}
                color="#A2A2A2" style={{ marginLeft: 10 }}/>
              <Text style={{ color: "#A2A2A2", fontSize: 12, marginLeft: 7 }}>
                {time}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  //-------------------------------
  const CricketSchdule = (item) => {
    let st = item._links['wp:featuredmedia'][0].href;
    st = st.substring(st.lastIndexOf(".")+1);
    st = st.substring(st.lastIndexOf(".")+1, 3);
    //console.log("ICCWCupList, Img Url : ", item._links['wp:featuredmedia'][0].href);
    if(st == 'png' || st == 'jpg' || st == 'jpe'){
        st=1;
    }else{
        st=0;
    }
    let title = item.title.rendered, desc = item.excerpt.rendered, dt = item.date, time, month, ftitle;
    title = title.replace(/<\/?[^>]+>/gi, '');
    ftitle = title;
    desc = desc.replace(/<\/?[^>]+>/gi, '');
    title = title.substring(0, 60);
    desc = desc.substring(0, 80);
    year = dt.substring(0, 4);
    month = dt.substring(5, 7);
    day = dt.substring(8, 10);
    time = dt.substring(11, 19);

    return (
      <TouchableOpacity key={item.id} onPress={() => navigation.navigate("ShowDetail1",
        { title: ftitle, PageID: item.id })}>
        <View style={[styles.cardview2, {
          flexDirection: "row", marginTop: 10,
          width: DEVICEWIDTH * 0.95, padding: 10
        }]}>
        {
            st == 1 ? (
                <Image source={{uri: item._links['wp:featuredmedia'][0].href}} 
                style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
                        borderRadius: 8}} resizeMode="contain"/>
            ):(
                <Image source={require('../assets/SwepScreen2.png')} 
                style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
                    borderRadius: 8}} resizeMode="contain"/>
            )
        }
          <View style={{ flexDirection: "column", marginLeft: 10 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, width: DEVICEWIDTH * 0.7, paddingRight: 8 }}>
              {title}...</Text>
            <View style={{ flexDirection: "row", marginTop: 8, paddingBottom: 5, alignItems: "center" }}>
              <AntDesign name="calendar" size={24} color="#A2A2A2" />
              <Text style={{ color: "#A2A2A2", fontSize: 12, marginLeft: 7 }}>
                {day} {MonthNm[month - 1]} {year}</Text>
              <MaterialCommunityIcons name="credit-card-edit-outline" size={24}
                color="#A2A2A2" style={{ marginLeft: 10 }}/>
              <Text style={{ color: "#A2A2A2", fontSize: 12, marginLeft: 7 }}>
                {time}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  //-------------------------------
  const DummyShow = (item) => {

    return (
        <View style={[styles.cardview2, {flexDirection: "row", marginTop: 10,
          width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.148, padding: 10}]}>
          <Image source={require('../assets/SwepScreen2.png')}
            style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
              borderRadius: 8, marginTop: 0}} resizeMode="contain" />
          <View style={{ flexDirection: "column", marginLeft: DEVICEWIDTH * 0.3, marginTop: "8%"}}>
            <ActivityIndicator/>
          </View>
        </View>
    );
  }
  //-------------------------------
  return (
    <View style={styles.container0}>
      {
        isLoading ? (
          <ActivityIndicator/>
        ) : (
          <View style={styles.container}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors= {["green", "red", "blue"]}
                />
              }>

                <View style={{flexDirection: "row", width: "95%", alignItems: "center",
                          marginTop: 15, marginBottom: 10,}}>
                  <Text style={{alignItems: "flex-start", color: "#FFFFFF", fontSize: 17, width: "70%"
                  }}>FEATURED ARTICLES</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("MoreMenuList",
                      {title: "Featured Articles",
                      PageID: config.BaseUrlv2+'posts?filter[posts_per_page]=1'})}
                      style={{width: DEVICEWIDTH * 0.4, height: DEVICEWIDTH * 0.08,
                        justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: DEVICEWIDTH * 0.3, height: DEVICEWIDTH * 0.08,
                        justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{alignItems: "flex-end", color: "#5EB9FE", fontSize: 17
                      }}>View All</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              <Carousel
                layout={"default"}
                data={DATAFeaturedArt}
                autoplay={true} loop={true} enableSnap={true} hasParallaxImages={false}
                activeSlideAlignment={'center'}
                renderItem={FeatArtRenderItem}
                sliderWidth={DEVICEWIDTH * 0.95}
                itemWidth={DEVICEWIDTH * 0.8}
                extraData={RefreshFArt}
              />

                <View style={{flexDirection: "row", width: "95%", alignItems: "center",
                          marginTop: 15, marginBottom: 10,}}>
                  <Text style={{alignItems: "flex-start", color: "#FFFFFF",
                            fontSize: 17, width: "70%"}}>CRICKET COVERAGE</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("MoreMenuList",
                      {title: "Cricket Coverage",
                      PageID: config.BaseUrlv2+'posts?categories=2'})}
                      style={{width: DEVICEWIDTH * 0.4, height: DEVICEWIDTH * 0.08,
                        justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: DEVICEWIDTH * 0.3, height: DEVICEWIDTH * 0.08,
                        justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{alignItems: "flex-end", color: "#5EB9FE", fontSize: 17
                      }}>View All</Text>
                    </View>
                  </TouchableOpacity>
              </View>

              <Carousel
                layout={"default"}
                data={DATACricketCov}
                enableSnap={true} hasParallaxImages={false}
                activeSlideAlignment={'center'}
                activeSlideOffset={0}
                firstItem={1}
                renderItem={CricketCovRenderItem}
                sliderWidth={DEVICEWIDTH * 0.95}
                itemWidth={DEVICEWIDTH * 0.5}
                itemHeight={DEVICEHEIGHT * 0.1}
                extraData={RefreshFArt}
              />

              {/* <View style={{ marginTop: 10, flexDirection: "row" }}>
                <Entypo name="trophy" size={27} color="#5EB9FE" />
                <Text style={{
                  marginLeft: 10, justifyContent: "center",
                  alignItems: "flex-start", color: "#FFFFFF", fontSize: 17
                }}>
                  CURRENT SERIES</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                {
                  isLoadingCR ? (
                    <></>
                  ) : (

                    <View style={{ marginBottom: 15, flexDirection: "column" }}>
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("MoreMenuList",
                            {
                              title: CurrentSeriesTop5[0].submenu[0].name,
                              PageID: CurrentSeriesTop5[0].submenu[0].href
                            })}>
                          <Text style={[styles.cardview2, { padding: 5, color: "#FFFFFF" }]}>
                            {CurrentSeriesTop5[0].submenu[0].name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("MoreMenuList",
                            {
                              title: CurrentSeriesTop5[1].submenu[0].name,
                              PageID: CurrentSeriesTop5[1].submenu[0].href
                            })}>
                          <Text style={[styles.cardview2, {
                            padding: 5, marginLeft: 10,
                            color: "#FFFFFF"
                          }]}>
                            {CurrentSeriesTop5[1].submenu[0].name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={{alignItems: "center"}}
                        onPress={() => navigation.navigate("MoreMenuList",
                          {
                            title: CurrentSeriesTop5[2].submenu[0].name,
                            PageID: CurrentSeriesTop5[2].submenu[0].href
                          })}>
                        <Text style={[styles.cardview2, { padding: 5, marginTop: 10, color: "#FFFFFF" }]}>
                          {CurrentSeriesTop5[2].submenu[0].name}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{alignItems: "center"}}
                        onPress={() => navigation.navigate("MoreMenuList",
                          {
                            title: CurrentSeriesTop5[3].submenu[2].name,
                            PageID: CurrentSeriesTop5[3].submenu[2].href
                          })}>
                        <Text style={[styles.cardview2, { padding: 5, marginTop: 10, color: "#FFFFFF" }]}>
                          {CurrentSeriesTop5[3].submenu[2].name}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{alignItems: "center"}}
                        onPress={() => navigation.navigate("MoreMenuList",
                          {
                            title: CurrentSeriesTop5[4].submenu[0].name,
                            PageID: CurrentSeriesTop5[4].submenu[0].href
                          })}>
                        <Text style={[styles.cardview2, { padding: 5, marginTop: 10, color: "#FFFFFF" }]}>
                          {CurrentSeriesTop5[4].submenu[0].name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )
                }
              </View> */}

              {/* <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <View style={[styles.cardview2, {
                  padding: 10, flexDirection: "column",
                  justifyContent: "center", alignItems: "center",
                  width: DEVICEWIDTH * 0.46, height: DEVICEHEIGHT * 0.2
                }]}>
                  <Image source={require('../assets/medalBN.png')}
                    style={{ width: 95, height: 95 }} />
                  <Text style={{ color: "white", fontSize: 20, marginTop: 0 }}>RANKING</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("TopTeams",
                  { title: "Top Teams" })}>
                  <View style={[styles.cardview2, {
                    padding: 10, flexDirection: "column",
                    justifyContent: "center", alignItems: "center", marginLeft: 10,
                    width: DEVICEWIDTH * 0.46, height: DEVICEHEIGHT * 0.2
                  }]}>
                    <Image source={require('../assets/teamBN.png')} style={{ width: 95, height: 95 }} />
                    <Text style={{ color: "white", fontSize: 20, marginTop: 0 }}>TOP TEAMS</Text>
                  </View>
                </TouchableOpacity>
              </View> */}

              <View style={[styles.cardview2, {
                marginBottom: 0, marginTop: 15, flexDirection: "column",
                width: DEVICEWIDTH * 0.95,
              }]}>
                <View style={{ flexDirection: "row", marginLeft: 15, width: DEVICEWIDTH * 0.98,
                    height: DEVICEHEIGHT * 0.08, alignItems: "center", justifyContent: "center" }}>
                  <Entypo name="trophy" size={27} color="#5EB9FE" />
                  <Text style={{marginLeft: 10, color: "#FFFFFF", fontSize: 17, width: "55%"
                  }}>CRICKET TEAMS</Text>
                {
                  isCTeamShow ? (
                    <TouchableOpacity onPress={() => navigation.navigate("MoreMenuList",
                        {title: "Cricket Teams",
                        PageID: config.BaseUrlv2+'posts?categories=3'})}
                        style={{width: DEVICEWIDTH * 0.4, height: DEVICEWIDTH * 0.08,
                          justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{width: DEVICEWIDTH * 0.3, height: DEVICEWIDTH * 0.08,
                          justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{
                          color: "#5EB9FE", fontSize: 17}}>View All</Text>
                      </View>
                    </TouchableOpacity>
                  ):(<></>)
                }
                </View>
                {
                  isCTeamShow ? (
                    <View style={{alignItems: "center", marginTop: -5 }}>
                    <Carousel
                    ref={isCarousel}
                    layout={"default"}
                    onSnapToItem={(page) => {
                      setPage(page)
                    }}
                    data={DataCricketTeam}
                    autoplay={true} loop={true} enableSnap={true} hasParallaxImages={false}
                    activeSlideAlignment={'center'}
                    renderItem={CricketTeams}
                    sliderWidth={DEVICEWIDTH * 0.95}
                    itemWidth={DEVICEWIDTH * 0.9}
                  />
                  <Pagination
                    activeDotIndex={page}
                    carouselRef={isCarousel}
                    tappableDots={true}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    dotsLength={5}      //DataCricketTeam.length
                    dotStyle={{
                      width: 20,
                      height: 10,
                      borderRadius: 18,
                      backgroundColor: "#0074FF",
                    }}
                    containerStyle={{ paddingVertical: 10 }}
                    inactiveDotStyle={{
                      backgroundColor: "#A2A2A2",
                    }}
                  />
                  </View>
                  ):(
                    <View style={{ alignItems: 'center', }}>
                      <Image source={require('../assets/SwepScreen2.png')}
                        style={styles.CTeamscard} resizeMode="contain" />
                      <View style={{marginTop: 43, marginBottom: 43}}>
                        <ActivityIndicator/>
                      </View>
                    </View>
                  )
                }
              </View>

              <Text style={{
                marginTop: 10, justifyContent: "center", alignItems: "flex-start",
                color: "#FFFFFF", fontSize: 17
              }}>Top 5 / Top 10</Text>
              <View style={{
                flexDirection: "column", justifyContent: "center",
                alignItems: "center",
              }}>
                {
                  isTop5Show ? (
                    DATATop5.map((item, index) => {
                      if (index < 3)
                        return Top5Top10(item)
                    })
                    ):(
                      <FlatList
                        data={DummyData}
                        renderItem={(item, index)=> DummyShow(item, index)}
                      />
                    )
                }
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("HomeMoreDetail",
                { title: "Top 5 / Top 10" })}
                style={{
                  justifyContent: "center", alignItems: "center",
                  backgroundColor: "#5EB9FE", borderRadius: 10,
                  width: DEVICEWIDTH * 0.95, height: DEVICEWIDTH * 0.08,
                  marginTop: 10
                }}>
                <Text style={{ color: "white", fontSize: 12 }}>VIEW MORE</Text>
              </TouchableOpacity>

              <Text style={{
                marginTop: 20, justifyContent: "center", alignItems: "flex-start",
                color: "#FFFFFF", fontSize: 17,
              }}>
                CRICKET NEWS</Text>
              <View style={{
                flexDirection: "column", justifyContent: "center",
                alignItems: "center",
              }}>
                { isCTeamShow ? (
                  DataCricketNews.map((item, index) => {
                    if (index < 3)
                      return CricketNews(item)
                  })
                  ):(
                    <FlatList
                      data={DummyData}
                      renderItem={(item, index)=> DummyShow(item, index)}
                    />
                  )
                }
              </View>

              <TouchableOpacity onPress={() => navigation.navigate("HomeMoreDetail",
                { title: "Cricket News" })}
                style={{
                  justifyContent: "center", alignItems: "center",
                  backgroundColor: "#5EB9FE", borderRadius: 10,
                  width: DEVICEWIDTH * 0.95, height: DEVICEWIDTH * 0.08,
                  marginTop: 10
                }}>
                <Text style={{ color: "white", fontSize: 12 }}>MORE NEWS</Text>
              </TouchableOpacity>

              <Text style={{
                marginTop: 20, justifyContent: "center", alignItems: "flex-start",
                color: "#FFFFFF", fontSize: 17,
              }}>
                CRICKET SCHDULE</Text>
              <View style={{
                flexDirection: "column", justifyContent: "center",
                alignItems: "center",
              }}>
                { isCSchdShow ? (
                  DataCricketSchdule.map((item, index) => {
                    if (index < 3)
                      return CricketSchdule(item)
                  })
                  ):(
                    <FlatList
                      data={DummyData}
                      renderItem={(item, index)=> DummyShow(item, index)}
                    />
                  )
                }
              </View>

              <TouchableOpacity onPress={() => navigation.navigate("HomeMoreDetail",
                { title: "Cricket Schdule" })}
                style={{
                  justifyContent: "center", alignItems: "center",
                  backgroundColor: "#5EB9FE", borderRadius: 10,
                  width: DEVICEWIDTH * 0.95, height: DEVICEWIDTH * 0.08,
                  marginTop: 10
                }}>
                <Text style={{ color: "white", fontSize: 12 }}>{"VIEW MORE"}</Text>
              </TouchableOpacity>

              <Image source={require('../assets/banner.jpg')}
                style={{
                  width: DEVICEWIDTH * 0.95, height: 95, borderRadius: 10,
                  marginTop: 20,
                }} />
              <View style={{ marginTop: 10 }}></View>
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Twitter")}
              style={styles.touchableOpacityStyle}>
              <AntDesign name="twitter" size={40} color="#5EB9FE" style={styles.floatingB} />
            </TouchableOpacity>
          </View>
        )
      }
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container0: {
    flex: 0,
    width: "100%",
    height: "100%",
  },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  FeatArtcardContainer: {
    alignContent: 'center',
    width: DEVICEWIDTH * 0.8,
    borderRadius: 8,
    backgroundColor: "#444444",
  },
  FeatArtcard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: DEVICEWIDTH * 0.74,
    height: DEVICEWIDTH * 0.42,
    marginTop: 10,
  },
  FeatArtLabel: {
    borderTopLeftRadius: 8,
    color: "#FFFFFF",
    fontSize: 17,
    paddingTop: 1,
    paddingLeft: 5,
  },
  FeatArtLabelText: {
    fontSize: 12,
    color: '#C8C8C8',
    fontWeight: '600',
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 2,
    marginBottom: 5,
  },

  CricketCovCardContainer: {
    alignContent: 'center',
    width: DEVICEWIDTH * 0.5,
    borderRadius: 8,
    backgroundColor: "#444444",
  },
  CricketCovCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: DEVICEWIDTH * 0.46,
    height: DEVICEWIDTH * 0.3,
    marginTop: 10,
  },
  CricketCovLabel: {
    borderTopLeftRadius: 8,
    color: "#FFFFFF",
    fontSize: 17,
    paddingTop: 10,
    paddingLeft: 10,
  },
  CricketCovLabelText: {
    fontSize: 12,
    color: '#C8C8C8',
    fontWeight: '600',
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 2,
    marginBottom: 10,
  },
  CTeamscardContainer: {
    alignContent: 'center',
    width: DEVICEWIDTH * 0.9,
    borderRadius: 8,
  },
  CTeamscard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: DEVICEWIDTH * 0.87,
    height: DEVICEWIDTH * 0.42,
    marginTop: 10,
  },

  cardview: {
    backgroundColor: '#444444',
    borderRadius: 10,
    elevation: 10,
  },
  cardview2: {
    backgroundColor: '#444444',
    borderRadius: 10,
    elevation: 10,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    elevation: 15,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
  },
  floatingB: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 15,
  },
  blurredBackground: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});