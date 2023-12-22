import React, {useRef} from "react";
import { View, Text, Dimensions, TouchableOpacity, Image, StyleSheet, FlatList,
            RefreshControl, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons';

import BaseUrl from "../AppConfig";
import PredRepository from "../repository/Predictions_Repository";
import WCR from "../repository/WorldCup_Repository";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;
let PageNo = 1;

export default function Prediction ({route}){

    const navigation = useNavigation();
    const [MatchPreActive, Set_MatchPreActive] = React.useState(true);
    const [Dream11Active, Set_Dream11Active] = React.useState(false);

    const [DataDetail, Set_DataDetail] = React.useState([]);
    const [PerPageData, Set_PerPageData] = React.useState(9);

    const [BotActivityInd, set_BotActivityInd] = React.useState(false);
    const [isShowBottomM, set_ShowBottomM] = React.useState(false);

    const [ShowNextBottom, set_ShowNextBottom] = React.useState(true);
    const [ShowPrevBottom, set_ShowPrevBottom] = React.useState(false);

    const [isLoading, set_isLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [FlatListRF, setFlatListRF] = React.useState(true);

    let listRef =  useRef();

    async function FetchData(refresh){
        if(isLoading){
        let data, mm=0, ss=[];
            data = await WCR.Get_ICCWCUP1("posts?categories=4211"+"&per_page=10&page="+PageNo);
            Set_DataDetail(data);
            setTimeout(()=> {
                set_isLoading(false);
                setRefreshing(false);

                if(data.length == 0){
                    if(PageNo > 1){
                        if(action==1 || action==2){
                            set_PageNo(PageNo-1);
                        }
                        set_ShowNextBottom(false);
                    }
                }else{
                    Set_PerPageData(data.length - 1);
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
                console.log("Predictions.js, ResetData PageNo : ", PageNo,
                        "ShowPrevBotton : ", ShowPrevBottom);
                setTimeout(async ()=> {
                    //setFlatListRF(!FlatListRF);
                    set_ShowBottomM(false);
                }, 30);

            }, 30);
        
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
                    console.log("Predictions.js, FetchData ICCWCUP : ",
                            data[l]._links["wp:featuredmedia"][0].href, ", l : ", l);
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
    }

    React.useEffect(() => {
        FetchData(0);
    }, []);
    //-----------------------------------
    const onRefresh = (freshfor) => {
        ResetData(0);
    }
    //------------------------------------------------
    function MatchPredMenuActive(){
        Set_MatchPreActive(true);
        Set_Dream11Active(false);
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
                setFlatListRF(!FlatListRF);
                set_BotActivityInd(false);
            },3000);
        },2000);
}
    function Dream11MecnuActive(){
        Set_MatchPreActive(false);
        Set_Dream11Active(true);
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
                setFlatListRF(!FlatListRF);
                set_BotActivityInd(false);
            },3000);
        },2000);
    }
    //-----------------------------------
    const ResetData = async (action) => {
        if(isShowBottomM){
        let data, mm=0, ss=[];
        if(MatchPreActive)
            data = 
            await WCR.Get_ICCWCUP1("posts?categories=4211"+"&per_page=10&page="+PageNo);
            //await PredRepository.Get_Prediction("posts?categories=4211"+"&per_page=10&page="+PageNo);
        if(Dream11Active)
            data = 
            await WCR.Get_ICCWCUP1("posts?categories=32"+"&per_page=10&page="+PageNo);

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
                Set_PerPageData(data.length - 1);
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
            console.log("Predictions.js, ResetData PageNo : ", PageNo,
                    "ShowPrevBotton : ", ShowPrevBottom);
            setTimeout(async ()=> {
                setFlatListRF(!FlatListRF);
                set_ShowBottomM(false);
            }, 30);

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
                        console.log("Predictions.js, ICCWCUP data : ",data[l]._links["wp:featuredmedia"][0].href, ", l : ", l);
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
    const MatchPredictionList = ({item, index}) => {
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
            month = dt.substring(6, 7);
            day = dt.substring(9, 10);
            time = dt.substring(11, 19);

        return (
            <View>
            <TouchableOpacity key={item.id} onPress={()=>navigation.navigate("ShowDetail1", 
                    {title: ftitle, PageID: item.id})}>    
                <View style={{backgroundColor: "#444444", borderWidth: 2, borderRadius: 10,
                            width: DEVICEWIDTH * 0.95, padding: 10, marginTop: 10,
                            flexDirection: "column", alignItems: "center",
                            justifyContent: "center"}}>
                    {
                        st == 1 ? (
                            <Image source={{uri: item._links['wp:featuredmedia'][0].href}} 
                                style={{width: DEVICEWIDTH * 0.9, height: DEVICEWIDTH * 0.5,
                                borderRadius: 10}} resizeMode="contain"/>
                            ):(
                            <Image source={require('../assets/SwepScreen2.png')} 
                            style={{width: DEVICEWIDTH * 0.9, height: DEVICEWIDTH * 0.5,
                                borderRadius: 10}} resizeMode="contain"/>
                        )
                    }
                    <Text style={{color: "#FFFFFF", fontSize: 14, width: DEVICEWIDTH * 0.88,
                    paddingRight: 8}}>{title}...</Text>
                    <Text style={styles.descrp}>{desc}...</Text>
                </View>
            </TouchableOpacity>
                <View style={{width: DEVICEWIDTH * 0.95, alignItems: "center", marginTop: 15}}>
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
    // const Dream11List = ({item, index}) => {
    //     let title = item.title.rendered, desc = item.excerpt.rendered, dt = item.date,
    //         time, month, ftitle;
    //         title=title.replace(/<\/?[^>]+>/gi, '');
    //         ftitle = title;
    //         desc=desc.replace(/<\/?[^>]+>/gi, '');
    //         title= title.substring(0, 55);
    //         desc= desc.substring(0, 80);
    //         year = dt.substring(0, 4);
    //         month = dt.substring(6, 7);
    //         day = dt.substring(9, 10);
    //         time = dt.substring(14, 16);

    //     return (
    //         <View>
    //         <TouchableOpacity key={item.id} onPress={()=>navigation.navigate("ShowDetail", 
    //                 {title: ftitle, PageID: item.id})}>    
    //             <View style={{backgroundColor: "#444444", borderWidth: 2, borderRadius: 10,
    //                         width: DEVICEWIDTH * 0.95, padding: 10, marginTop: 10,
    //                         flexDirection: "column"}}>
    //                 <Image source={{uri: item._links['wp:featuredmedia'][0].href}} 
    //                     style={{width: DEVICEWIDTH * 0.9, height: DEVICEWIDTH * 0.5,
    //                         borderRadius: 10}} resizeMode="contain"/>
    //                 <Text style={{color: "#FFFFFF", fontSize: 14, width: DEVICEWIDTH * 0.88, paddingRight: 8}}>
    //                 {title}...</Text>
    //                 <Text style={styles.descrp}>{desc}...</Text>
    //             </View>
    //         </TouchableOpacity>
    //         <View style={{width: DEVICEWIDTH * 0.95, alignItems: "center", marginTop: 15}}>
    //             {
    //                 index == PerPageData ?
    //                 (
    //                     <View style={{flexDirection: "row",}}>
    //                     {
    //                         PageNo > 1 && ShowPrevBottom ?(
    //                             <TouchableOpacity onPress={()=> PrevPageData("a")}
    //                                 style={{width: DEVICEWIDTH * 0.2, alignItems: "center",
    //                                 justifyContent: "center", backgroundColor: "#444444",
    //                                 borderRadius: 20, height: DEVICEWIDTH * 0.1}}>
    //                                 <Text style={{color: "#FFFFFF", fontSize: 20,}}>
    //                                     Prev.</Text>
    //                             </TouchableOpacity>        
    //                         ):(
    //                             <View style={{width: DEVICEWIDTH * 0.2}}/>
    //                         )
    //                     }
    //                     <View style={{width: DEVICEWIDTH * 0.5,}}>
    //                     {
    //                         BotActivityInd ? (
    //                             <View style={{}}>
    //                                 <ActivityIndicator/>
    //                             </View>
    //                         ):(
    //                             <></>
    //                         )
    //                     }
    //                     </View>
    //                     { ShowNextBottom ? (
    //                         <TouchableOpacity onPress={()=>NextPageData("a")}
    //                             style={{width: DEVICEWIDTH * 0.2, alignItems: "center",
    //                             justifyContent: "center", backgroundColor: "#444444",
    //                             borderRadius: 20, height: DEVICEWIDTH * 0.1}}>
    //                             <Text style={{color: "#FFFFFF", fontSize: 20,}}>
    //                                 Next</Text>
    //                         </TouchableOpacity>
    //                     ):(
    //                         <View style={{width: DEVICEWIDTH * 0.2}}/>
    //                     )
    //                     }
    //                     <View style={{marginTop: 10}}/>
    //                     </View>
    //                     ):(
    //                         <></>
    //                     )
    //                 }
    //             </View>
    //         </View>
    //     );
    // }

    //-------------------------------
    return (
        <View>
        { isLoading ? (
            <ActivityIndicator/>
        ):(
        <View style={{width: DEVICEWIDTH, height: DEVICEHEIGHT * 0.83}}>
            <View style={{backgroundColor: "#444444", width: DEVICEWIDTH, height: DEVICEWIDTH * 0.13,
                        justifyContent: "center"}}>
                <View style={{height: "70%",flexDirection: "row", marginLeft: 10,}}>
                    <View  style={{width: DEVICEWIDTH * 0.4, alignItems: "center",
                            justifyContent: "center"}}>
                        <TouchableOpacity onPress={()=> MatchPredMenuActive()} 
                                style={{width: DEVICEWIDTH * 0.35, alignItems: "center",
                                justifyContent: "center"}}>
                            <View style={{width: MatchPreActive ? DEVICEWIDTH * 0.32 : DEVICEWIDTH * 0.30,
                                    backgroundColor: MatchPreActive ? "#7B94EC" : "#444444",
                                    borderRadius: 7, alignItems: "center"}}>
                                <Text style={{color: MatchPreActive ? "#000000" : "#FFFFFF",
                                    fontSize: MatchPreActive ? 12 : 10, padding: 3, }}>
                                    Match Predictions</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View  style={{width: DEVICEWIDTH * 0.4, alignItems: "center",
                            justifyContent: "center"}}>
                        <TouchableOpacity onPress={()=>Dream11MecnuActive()}
                                style={{width: DEVICEWIDTH * 0.35, alignItems: "center",
                                justifyContent: "center"}}>
                            <View style={{width: Dream11Active ? DEVICEWIDTH * 0.32 : DEVICEWIDTH * 0.30,
                                    backgroundColor: Dream11Active ? "#7B94EC" : "#444444",
                                    borderRadius: 7, alignItems: "center"}}>
                            <Text style={{color: Dream11Active ? "#000000" : "#FFFFFF",
                                fontSize: Dream11Active ? 12 : 10, padding: 3,}}>
                                    Dream 11</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.container}>
                <View style={{alignItems: "center"}}>
                <FlatList
                        ref={listRef} extraData={FlatListRF}
                        data={DataDetail}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item, index)=>MatchPredictionList(item, index)}
                        refreshControl={
                            <RefreshControl refreshing={refreshing}
                            onRefresh={onRefresh(1)}
                            colors= {["red", "green", "blue"]} />
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
    descrp: {
        fontSize: 12,
        color: '#C8C8C8',
        fontWeight: '600',
        paddingTop: 2,
        marginTop: 5,
        marginBottom: 5,
        width: DEVICEWIDTH * 0.9,
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