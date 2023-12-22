import React, {useRef} from "react";
import { useNavigation } from '@react-navigation/native'
import { View, Text, Dimensions, TouchableOpacity, Image, StyleSheet, FlatList, 
            RefreshControl, ActivityIndicator} from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import BaseUrl from "../AppConfig";
import WCR from "../repository/WorldCup_Repository";
import config from "../AppConfig";

const DEVICEWIDTH = Dimensions.get('window').width; 
const DEVICEHEIGHT = Dimensions.get('window').height;
let PageNo = 1;

const TopMenu = [{id: 0, Title: "ICC World Cup 2023", Active: 1},
{id: 1, Title: "Points Table", Active: 0},
{id: 2, Title: "Match Winner & Player of the Match", Active: 0},
{id: 3, Title: "T20 World Cup", Active: 0},
{id: 4, Title: "World Test Championship", Active: 0}];

export default function WorldCup ({route}){
    const navigation = useNavigation();
    let listRef =  useRef();

    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, set_isLoading] = React.useState(true);
    const [FlatListRF, setFlatListRF] = React.useState(true);
    const [TMFlatListRF, setTMFlatListRF] = React.useState(true);

    const MonthNm = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [ActivMenuIndex, Set_ActivMenuIndex] = React.useState(0);
    const [ICCWCupActiv, Set_ICCWCupActiv] = React.useState(true);
    const [PointTableActiv, Set_PointTableActiv] = React.useState(false);
    const [MatchWinerActiv, Set_MatchWinerActiv] = React.useState(false);
    const [T20WCupActiv, Set_T20WCupActiv] = React.useState(false);
    const [WTestChamActive, Set_WTestChamActive] = React.useState(false);
    
    const [DataDetail, Set_DataDetail] = React.useState([]);
    const [PerPageData, Set_PerPageData] = React.useState(9);

    const [BotActivityInd, set_BotActivityInd] = React.useState(false);
    const [isShowBottomM, set_ShowBottomM] = React.useState(false);

    const [ShowNextBottom, set_ShowNextBottom] = React.useState(true);
    const [ShowPrevBottom, set_ShowPrevBottom] = React.useState(false);

    const FetchData=async (refresh)=>{
            let data, mm=0,ss=[];
            for(z=0; z<5; z++){
                if(TopMenu[z].id == 0){
                    TopMenu[z].Active = 1;
                }else{
                    TopMenu[z].Active = 0;
                }
            }
            PageNo = 1;
            if(refresh ==0 || refresh == 1){
                data = await WCR.Get_ICCWCUP1("posts?categories=5970&per_page=10&page="+PageNo);
            Set_DataDetail(data);
            setTimeout(()=> {
                set_isLoading(false);
                setRefreshing(false)
            }, 10);

            setTimeout(async ()=> {
                console.log("WorldCup_Repository.js, ICCWCUP : ",data[0]._links["wp:featuredmedia"]);

                let l = 0, ImgUrl='';
                for(l=0; l<data.length; l++){
                    try {
                        ImgUrl = data[l]._links["wp:featuredmedia"][0].href;
                    let resUrl = await fetch(ImgUrl, {
                        method: 'GET',
                        headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        },
                    });
                    resUrl = await resUrl.json();
                    ImgUrl = resUrl.media_details.sizes.full.source_url;
                    } catch (e) {
                    console.error(e);
                    }
                    data[l]._links["wp:featuredmedia"][0].href = ImgUrl;
                    console.log("WorldCup.js, ICCWCUP : ",data[l]._links["wp:featuredmedia"][0].href, ", l : ", l);
                    if(l == 3 && data.length>7){
                        for(mm = 0; mm<data.length-2; mm++){
                            ss.push(data[mm]);
                            if(mm>=data.length-3){
                            console.log("---------------------------, data.length : ", data.length);
                            Set_DataDetail(ss);
                            }
                        }
                        setTimeout(()=> setFlatListRF(!FlatListRF), 30);
                    }else{
                        if(data.length >7){
                            mm = 0;
                            for(mm=0; mm<data.length; mm++){
                                data[mm].comment_status = "";
                                data[mm].content.rendered = "";
                                data[mm].link = "";
                            }
                        }
                        if(l >=data.length-1){
                            console.log("HomeMoreDetail.js, FetchData Img Url : ",data[0]._links["wp:featuredmedia"][0].href,);
                            Set_DataDetail(data);
                            setTimeout(()=> setFlatListRF(!FlatListRF), 30);
                        }
                    }
                }
            }, 300);

        }
    }
    React.useEffect(() => {
        if(isLoading){
            FetchData(0);
        }
    }, []);
    const onRefresh = (freshfor) => {
        ResetData(0);
    }
    //-------------------------
    // function ICC_World_Cup(){
    //     Set_ICCWCupActiv(true);
    //     Set_PointTableActiv(false);
    //     Set_MatchWinerActiv(false);
    //     Set_T20WCupActiv(false);
    //     Set_WTestChamActive(false);
    //     PageNo = 1;
    //     set_ShowBottomM(true);
    //     set_BotActivityInd(true);
    //     ResetData(0);
    //     setTimeout(()=> {
    //         listRef?.current?.scrollToIndex({
    //             animated: true,
    //             index: 0,
    //         });
    //         setTimeout(()=> {
    //             setFlatListRF(!FlatListRF);
    //             set_BotActivityInd(false);
    //         },3000);
    //     },2000);
    // }
    // function PointTable(){
    //     Set_ICCWCupActiv(false);
    //     Set_PointTableActiv(true);
    //     Set_MatchWinerActiv(false);
    //     Set_T20WCupActiv(false);
    //     Set_WTestChamActive(false);
    //     PageNo = 1;
    //     set_ShowBottomM(true);
    //     set_BotActivityInd(true);
    //     ResetData(0);
    //     setTimeout(()=> {
    //         listRef?.current?.scrollToIndex({
    //             animated: true,
    //             index: 0,
    //         });
    //         setTimeout(()=> {
    //             setFlatListRF(!FlatListRF);
    //             set_BotActivityInd(false);
    //         },3000);
    //     },2000);
    // }
    // function PointTable(){
    //     Set_ICCWCupActiv(false);
    //     Set_PointTableActiv(false);
    //     Set_MatchWinerActiv(true);
    //     Set_T20WCupActiv(false);
    //     Set_WTestChamActive(false);
    //     PageNo = 1;
    //     set_ShowBottomM(true);
    //     set_BotActivityInd(true);
    //     ResetData(0);
    //     setTimeout(()=> {
    //         listRef?.current?.scrollToIndex({
    //             animated: true,
    //             index: 0,
    //         });
    //         setTimeout(()=> {
    //             setFlatListRF(!FlatListRF);
    //             set_BotActivityInd(false);
    //         },3000);
    //     },2000);
    // }
    // function T20WorldCup(){
    //     Set_ICCWCupActiv(false);
    //     Set_PointTableActiv(false);
    //     Set_MatchWinerActiv(false);
    //     Set_T20WCupActiv(true);
    //     Set_WTestChamActive(false);
    //     PageNo = 1;
    //     set_ShowBottomM(true);
    //     set_BotActivityInd(true);
    //     ResetData(0);
    //     setTimeout(()=> {
    //         listRef?.current?.scrollToIndex({
    //             animated: true,
    //             index: 0,
    //         });
    //         setTimeout(()=> {
    //             setFlatListRF(!FlatListRF);
    //             set_BotActivityInd(false);
    //         },3000);
    //     },2000);
    // }
    // function WTChampionship(){
    //     Set_ICCWCupActiv(false);
    //     Set_PointTableActiv(false);
    //     Set_MatchWinerActiv(false);
    //     Set_T20WCupActiv(false);
    //     Set_WTestChamActive(true);
    //     PageNo = 1;
    //     set_ShowBottomM(true);
    //     set_BotActivityInd(true);
    //     ResetData(0);
    //     setTimeout(()=> {
    //         listRef?.current?.scrollToIndex({
    //             animated: true,
    //             index: 0,
    //         });
    //         setTimeout(()=> {
    //             setFlatListRF(!FlatListRF);
    //             set_BotActivityInd(false);
    //         },3000);
    //     },2000);
    // }
    //-----------------------------------
    const ResetData = async (action) => {
        if(isShowBottomM){
            let data, mm=0, ss=[];
            if(ActivMenuIndex == 0)
                data = await WCR.Get_ICCWCUP1("posts?categories=5970"+"&per_page=10&page="+PageNo);
            if(ActivMenuIndex == 1){
                data = await WCR.Get_ICCWCUP1("posts?slug=icc-cricket-world-cup-2023-points-table"+
                                            "&per_page=10&page="+PageNo);
            }
            if(ActivMenuIndex == 2)
                data = await WCR.Get_ICCWCUP1("posts?slug=icc-cricket-world-cup-2023-match-winner"+
                            "-and-player-of-the-match"+"&per_page=10&page="+PageNo);
            if(ActivMenuIndex == 3)
                data = await WCR.Get_ICCWCUP1("posts?categories=93"+"&per_page=10&page="+PageNo);
            if(ActivMenuIndex == 4)
                data = await WCR.Get_ICCWCUP1("posts?categories=5182"+"&per_page=10&page="+PageNo);

            setTimeout(async ()=> {
                if(data.length == 0){
                    if(PageNo > 1){
                        if(action==1 || action==2){
                            set_PageNo(PageNo-1);
                        }
                        set_ShowNextBottom(false);
                    }
                }else{
                    Set_DataDetail(data);
                    //Set_PerPageData(data.length - 1);
                    if(data.length<10 && PageNo > 1){
                        set_ShowNextBottom(false);
                    }else{
                        set_ShowNextBottom(true);
                    }

                }
                if(PageNo > 1){
                    set_ShowPrevBottom(true);
                }else{
                    set_ShowPrevBottom(false);
                }
                setTimeout(async ()=> {
                    setFlatListRF(!FlatListRF);
                    set_ShowBottomM(false);
                }, 5);

                if(data.length > 0){
                    setTimeout(async ()=> {
                        console.log("WorldCup_Repository.js, _links : ",data[0]._links);
        
                        let l = 0, ImgUrl='';
                        for(l=0; l<data.length; l++){
                            try {
                                ImgUrl = data[l]._links["wp:featuredmedia"][0].href;
                                let resUrl = await fetch(ImgUrl, {
                                method: 'GET',
                                headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                },
                            });
                            resUrl = await resUrl.json();
                            ImgUrl = resUrl.media_details.sizes.full.source_url;
                            } catch (e) {
                            console.error(e);
                            }
                            data[l]._links["wp:featuredmedia"][0].href = ImgUrl;
                            console.log("WorldCup_Repository.js, ICCWCUP data : ",data[l]._links["wp:featuredmedia"][0].href, ", l : ", l);
                            if(l == 3 && data.length>7){
                                for(mm = 0; mm<data.length-2; mm++){
                                    ss.push(data[mm]);
                                    if(mm>=data.length-3){
                                    console.log("---------------------------, data.length : ", data.length);
                                    Set_DataDetail(ss);
                                    }
                                }
                                setTimeout(()=> setFlatListRF(!FlatListRF), 30);
                            }else{
                                if(data.length >7){
                                    mm = 0;
                                    for(mm=0; mm<data.length; mm++){
                                        data[mm].comment_status = "";
                                        data[mm].content.rendered = "";
                                        data[mm].link = "";
                                    }
                                }
                                if(l >=data.length-1){
                                    console.log("HomeMoreDetail.js, FetchData Img Url : ",data[0]._links["wp:featuredmedia"][0].href,);
                                    Set_DataDetail(data);
                                    setTimeout(()=> setFlatListRF(!FlatListRF), 30);
                                }
                            }
                               }
                    }, 500);
                }
    
            }, 30);

        }
    }
    //-----------------------------------
    const PrevPageData = async (inf) => {
        if(!isShowBottomM){
            set_ShowBottomM(true);
            set_BotActivityInd(true);
            if(PageNo > 1)
                PageNo = PageNo-1
            ResetData(2);
            setTimeout(()=> {
    console.log("---------------------scrollToIndex----------------------");
                listRef?.current?.scrollToIndex({
                    animated: true,
                    index: 0,
                });
                setTimeout(()=> {
                    setFlatListRF(!FlatListRF);
                    set_BotActivityInd(false);
                },3000);
            },2000);
            }
    }
    //-----------------------------------
    const NextPageData = async (inf) => {
        if(!isShowBottomM){
            set_ShowBottomM(true);
            set_BotActivityInd(true);
            PageNo = PageNo+1
            ResetData(2);
            setTimeout(()=> {
    console.log("---------------------scrollToIndex----------------------PageNo : ", PageNo);
                listRef?.current?.scrollToIndex({
                    animated: true,
                    index: 0,
                });
                setTimeout(()=> {
                    setFlatListRF(!FlatListRF);
                    set_BotActivityInd(false);
                },3000);
            },2000);
        }
    }
    //-----------------------------------
    const ICCWCupList = ({item, index}) => {
        let st = item._links['wp:featuredmedia'][0].href;
        st = st.substring(st.lastIndexOf(".")+1);
        st = st.substring(st.lastIndexOf(".")+1, 3);
        console.log("ICCWCupList, Img Url : ", item._links['wp:featuredmedia'][0].href);
        if(st == 'png' || st == 'jpg' || st == 'jpe'){
            st=1;
        }else{
            st=0;
        }
        let title = item.title.rendered, desc = item.excerpt.rendered, dt = item.date,
            time, month, ftitle;
            title=title.replace(/<\/?[^>]+>/gi, '');
            ftitle = title;
            desc=desc.replace(/<\/?[^>]+>/gi, '');
            title= title.substring(0, 55);
            desc= desc.substring(0, 80);
            year = dt.substring(0, 4);
            month = dt.substring(5, 7);
            day = dt.substring(8, 10);
            time = dt.substring(11, 19);

        return (
            <View>
                <TouchableOpacity key={item.id} onPress={()=>navigation.navigate("ShowDetail1", 
                        {title: ftitle, PageID: item.id})}>    
                    <View style={{backgroundColor: "#444444", borderWidth: 2, borderRadius: 10,
                                width: DEVICEWIDTH * 0.95, padding: 10, marginTop: index == 0 ? 10 : 0,
                                flexDirection: "row"}}>
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
                    <View style={{flexDirection: "column", marginLeft: 10}}>
                    <Text style={{color: "#FFFFFF", fontSize: 14, width: DEVICEWIDTH * 0.7,
                            paddingRight: 8}}>
                    {title}...</Text>
                    <View style={{flexDirection: "row", marginTop: 8, paddingBottom: 8,
                            alignItems: "center"}}>
                    <AntDesign name="calendar" size={24} color="#A2A2A2"/>
                    <Text style={{color: "#A2A2A2", fontSize: 12, marginLeft: 7}}>
                        {day} {MonthNm[month-1]} {year}</Text>
                    <MaterialCommunityIcons name="credit-card-edit-outline" size={24}
                        color="#A2A2A2" style={{ marginLeft: 10 }}/>
                    <Text style={{color: "#A2A2A2", fontSize: 12, marginLeft: 7}}>
                        {time}</Text>
                    </View>
                </View>
                </View>
                </TouchableOpacity>
                <View style={{width: DEVICEWIDTH * 0.95, alignItems: "center",
                        marginTop: index == PerPageData ? 15 : 5}}>
                {
                    index == PerPageData ?
                    (
                        <View style={{flexDirection: "row",}}>
                        {
                            PageNo > 1 && ShowPrevBottom ?(
                                <TouchableOpacity onPress={()=> PrevPageData("a")}
                                    style={{width: DEVICEWIDTH * 0.2, alignItems: "center",
                                    justifyContent: "center", backgroundColor: "#444444",
                                    borderRadius: 20, height: DEVICEWIDTH * 0.1}}>
                                    <Text style={{color: "#FFFFFF", fontSize: 20,}}>
                                        Prev.</Text>
                                </TouchableOpacity>        
                            ):(
                                <View style={{width: DEVICEWIDTH * 0.2}}/>
                            )
                        }
                        <View style={{width: DEVICEWIDTH * 0.5,}}>
                        {
                            BotActivityInd ? (
                                <View style={{}}>
                                    <ActivityIndicator/>
                                </View>
                            ):(
                                <></>
                            )
                        }
                        </View>
                        { 
                            ShowNextBottom ? (
                                <TouchableOpacity onPress={()=>NextPageData("a")}
                                    style={{width: DEVICEWIDTH * 0.2, alignItems: "center",
                                    justifyContent: "center", backgroundColor: "#444444",
                                    borderRadius: 20, height: DEVICEWIDTH * 0.1}}>
                                    <Text style={{color: "#FFFFFF", fontSize: 20,}}>
                                        Next</Text>
                                </TouchableOpacity>
                            ):(
                                <View style={{width: DEVICEWIDTH * 0.2}}/>
                            )
                        }
                        <View style={{marginTop: 60}}/>
                        </View>
                        ):(
                            <></>
                        )
                    }
                </View>
            </View>
        );
    }
    //-----------------------------------
    const WhoActive = (idd) => {
        Set_ActivMenuIndex(idd);
        console.log("WorldCup.js, WhoActive idd : ", idd);
        let z=0;
        for(z=0; z<5; z++){
            if(TopMenu[z].id == idd){
                TopMenu[z].Active = 1;
                console.log("WorldCup.js, WhoActive TopMenu[z].Active : ", TopMenu[z].Active, "id : ", z);
            }else{
                TopMenu[z].Active = 0;
            }
        }
        PageNo = 1;
        set_ShowBottomM(true);
        set_BotActivityInd(true);
        ResetData(0);
        setTimeout(()=> {
            listRef?.current?.scrollToIndex({
                animated: true,
                index: 0,
            });
            setTimeout(()=> {
                setTMFlatListRF(!TMFlatListRF);
                setFlatListRF(!FlatListRF);
                set_BotActivityInd(false);
            },3000);
        },2000);
    }
    //-----------------------------------
    const ShowTopMenu = ({item, index}) => {
        console.log("WorldCup.js, ShowTopMenu item.Active : ", item.id, item.Active);
        return(
            <View style={{width: DEVICEWIDTH * 0.35, alignItems: "center",
                justifyContent: "center"}}>
            <TouchableOpacity onPress={()=> WhoActive(item.id)} >
                <View style={{
                        backgroundColor: item.Active == 1 ? "#7B94EC" : "#444444",
                        borderRadius: 7, alignItems: "center"}}>
                    <Text style={{color: item.Active == 1 ? "#000000" : "#FFFFFF",
                        fontSize: item.Active == 1 ? 12 : 10, padding: 3, }}>
                        {item.Title}</Text>
                </View>
            </TouchableOpacity>
            </View>
        );
    }
    //--------------------------
    return (
        <View>
            { isLoading ? (
                <ActivityIndicator/>
            ):(
            <View style={{width: DEVICEWIDTH, height: DEVICEHEIGHT * 0.83}}>
            <View style={{backgroundColor: "#444444", width: DEVICEWIDTH, height: DEVICEWIDTH * 0.13,
                        justifyContent: "center"}}>
                <View style={{height: "70%", flexDirection: "row", justifyContent: "center",
                            marginLeft: 10}}>
                    <FlatList showsHorizontalScrollIndicator={false}
                        data={TopMenu} horizontal extraData={TMFlatListRF}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item, index)=> ShowTopMenu(item, index)}
                    />
                    <View style={{marginLeft: 10}}/>
                    {/* <TouchableOpacity onPress={()=> ICC_World_Cup()} 
                            style={{width: DEVICEWIDTH * 0.28, alignItems: "center",
                            justifyContent: "center"}}>
                        <View style={{width: ICCWCupActiv ? DEVICEWIDTH * 0.32 : DEVICEWIDTH * 0.30,
                                backgroundColor: ICCWCupActiv ? "#7B94EC" : "#444444",
                                borderRadius: 7, alignItems: "center"}}>
                            <Text style={{color: ICCWCupActiv ? "#000000" : "#FFFFFF",
                                fontSize: ICCWCupActiv ? 12 : 10, padding: 3, }}>
                                ICC World Cup 2023</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> T20WorldCup()}
                            style={{width: DEVICEWIDTH * 0.3, alignItems: "center",
                            justifyContent: "center"}}>
                        <View style={{width: T20WCupActiv ? DEVICEWIDTH * 0.25 : DEVICEWIDTH * 0.24,
                                backgroundColor: T20WCupActiv ? "#7B94EC" : "#444444",
                                borderRadius: 7, alignItems: "center"}}>
                            <Text style={{color: T20WCupActiv ? "#000000" : "#FFFFFF",
                                fontSize: T20WCupActiv ? 12 : 10, padding: 3, }}>
                                T20 World Cup</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> WTChampionship()} 
                            style={{width: DEVICEWIDTH * 0.32, alignItems: "center",
                            justifyContent: "center"}}>
                        <View style={{width: WTestChamActive ? DEVICEWIDTH * 0.40 : DEVICEWIDTH * 0.34,
                                backgroundColor: WTestChamActive ? "#7B94EC" : "#444444",
                                borderRadius: 7, alignItems: "center"}}>
                            <Text style={{color: WTestChamActive ? "#000000" : "#FFFFFF",
                                fontSize: WTestChamActive ? 12 : 10, padding: 3, }}>
                                World Test Championship</Text>
                        </View>
                    </TouchableOpacity> */}

                </View>
            </View>
            <View style={styles.container}>

                <View style={{alignItems: "center"}}>
                    <FlatList
                        ref={listRef} extraData={FlatListRF}
                        data={DataDetail}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item, index)=> ICCWCupList(item, index)}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh(1)}
                                colors= {["red", "green", "blue"]}
                            />
                        }
                    />
                {
                    BotActivityInd ? (
                        <View style={styles.refreshIndicator}>
                            <View style={{shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.6, shadowRadius: 40, backgroundColor : "#FFFFFF",
                                    width: 30, height: 30, borderRadius: 20, alignItems: "center",
                                    justifyContent: "center"}}>
                                <ActivityIndicator/>
                            </View>
                        </View>
                    ):(
                        <></>
                    )
                }
                </View>
            </View>
                {/* <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={()=> navigation.navigate("Twitter")}
                  style={styles.touchableOpacityStyle}>
                    <AntDesign name="twitter" size={40} color="#5EB9FE" style={styles.floatingB}/>
                </TouchableOpacity> */}
            </View>
            )
        }
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardview: {
        backgroundColor: 'grey',
        borderRadius: 10,
        elevation: 10,
    },
    cardview2: {
        backgroundColor: 'grey',
        borderRadius: 10,
        elevation: 10,
    },
    refreshIndicator: {
        position: 'absolute',
        elevation: 15,
        left: "47%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
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
});