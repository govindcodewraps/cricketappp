import React, {useRef} from "react";
import { useNavigation } from '@react-navigation/native'
import {View, Text, Dimensions, TouchableOpacity, Image, SafeAreaView, StyleSheet, FlatList,
    RefreshControl, ActivityIndicator} from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import HP from "../../screen_presenter/Home_Presenter";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

let PageNo = 1;

export default function HomeMoreDetails({ route }) {

    const navigation = useNavigation();

    const [PerPageData, Set_PerPageData] = React.useState(9);

    const [BotActivityInd, set_BotActivityInd] = React.useState(false);
    const [isShowBottomM, set_ShowBottomM] = React.useState(false);

    const [ShowNextBottom, set_ShowNextBottom] = React.useState(true);
    const [ShowPrevBottom, set_ShowPrevBottom] = React.useState(false);

    const [isLoading, set_isLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [FlatListRF, setFlatListRF] = React.useState(true);

    const [DataDetail, Set_DataDetail] = React.useState([]);
    const MonthNm = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let listRef =  useRef();
    //--------------------------------------------------
    const FetchData = async (refresh) => {
        let data, ss = [], l=0;
        PageNo = 1;
        if (route.params.title == "Top 5 / Top 10") {
            data = await HP.Get_FeaturedArticles('posts?categories=1405&per_page=10&page='+PageNo);
        }
        if (route.params.title == "Cricket News") {
            data = await HP.Get_FeaturedArticles('posts?categories=3&per_page=10&page='+PageNo);
        }
        if (route.params.title == "Cricket Schdule") {
            data = await HP.Get_FeaturedArticles('posts?categories=1&per_page=10&page='+PageNo);
        }
        Set_DataDetail(data);
        setTimeout(()=> {
            set_isLoading(false);
            //setRefreshing(false);
        }, 30);

        setTimeout(async ()=> {
            console.log("HomeMoreDetail.js, ICCWCUP : ",data[0]._links["wp:featuredmedia"]);

            l = 0, ImgUrl='', mm=0;
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
                console.log("---------------------------, data.length : ", data.length);
                if(l == 3 && data.length>7){
                    for(mm = 0; mm<data.length-2; mm++){
                        ss.push(data[mm]);
                        if(mm>=data.length-3){
                        console.log("---------------------------, data.length : ", data.length);
                        Set_DataDetail(ss);
                        }
                    }
                    //Set_DataDetail(data);
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
    React.useEffect(() => {
        FetchData();
    }, []);

    const onRefresh = () => {
        console.log(".js,  :  RefreshData");
        ResetData(0);
    }
    //-----------------------------------
    const ResetData = async (action) => {
        let data;

        console.log("HomeMoreDetail.js, ResetData, PageNo : ",PageNo);
            if (route.params.title == "Top 5 / Top 10") {
                data = await HP.Get_FeaturedArticles('posts?categories=1405&per_page=10&page='+PageNo);
            }
            if (route.params.title == "Cricket News") {
                data = await HP.Get_FeaturedArticles('posts?categories=3&per_page=10&page='+PageNo);
            }
            if (route.params.title == "Cricket Schdule") {
                data = await HP.Get_FeaturedArticles('posts?categories=1&per_page=10&page='+PageNo);
            }

            setTimeout(async ()=> {
                //setFlatListRF(!FlatListRF);

                listRef?.current?.scrollToIndex({
                    animated: true,
                    index: 0,
                });

                set_ShowBottomM(false);
                set_BotActivityInd(false);
                if(PageNo > 1){
                    set_ShowPrevBottom(true);
                }else{
                    set_ShowPrevBottom(false);
                }
                //------------------------
                console.log("HomeMoreDetail.js, data[0] : ",data[0]._links["wp:featuredmedia"]);
    
                let l = 0, ImgUrl='', mm=0, ss=[];
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
                    console.log("HomeMoreDetail.js, ICCWCUP : ",data[l]._links["wp:featuredmedia"][0].href, ", l : ", l);
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
                //------------------------
            }, 30);
    
        if(data.length == 0){
            set_BotActivityInd(false);
            if(PageNo > 1){
                if(action==1){
                    set_PageNo(PageNo-1);
                }
                if(action==2){
                    set_PageNo(PageNo-1);
                }
                set_ShowNextBottom(false);
            }
        }else{
            console.log("MoreM_List.js, else, data : ", data);
            Set_DataDetail(data);
            Set_PerPageData(data.length - 1);
            if(data.length<10 && PageNo > 1){
                set_ShowNextBottom(false);
            }else{
                set_ShowNextBottom(true);
            }
        }
    }
    //-----------------------------------
    const PrevPageData = async (inf) => {
        if(!isShowBottomM){
            set_ShowBottomM(true);
            console.log("MoreM_List.js, NextPageData, inf : ", inf);
            set_BotActivityInd(true);
            if(PageNo > 1)
                PageNo = PageNo-1
            ResetData(2);
        }
    }
    //-----------------------------------
    const NextPageData = async (inf) => {
        if(!isShowBottomM){
            set_ShowBottomM(true);
            console.log("MoreM_List.js, NextPageData, inf : ", inf);
            set_BotActivityInd(true);
            PageNo = PageNo+1
            console.log("MoreM_List.js, NextPageData, PageNo : ",PageNo);
            ResetData(2);
        }
    }
    //-------------------------
    const DisplayList = ({ item, index }) => {
        let title = item.title.rendered, desc = item.excerpt.rendered, dt = item.date,
            time, month, ftitle, st = item._links['wp:featuredmedia'][0].href;
        st = st.substring(st.lastIndexOf(".")+1);
        st = st.substring(st.lastIndexOf(".")+1, 3);

        title = title.replace(/<\/?[^>]+>/gi, '');
        ftitle = title;
        desc = desc.replace(/<\/?[^>]+>/gi, '');
        title = title.substring(0, 65);
        desc = desc.substring(0, 80);
        year = dt.substring(0, 4);
        month = dt.substring(5, 7);
        day = dt.substring(8, 10);
        time = dt.substring(11, 19);
        console.log("Index : ", index);
        return (
            <View>
            <TouchableOpacity key={item.id} onPress={() => navigation.navigate("ShowDetail1",
                { title: ftitle, PageID: item.id })}>
                <View style={[styles.cardview2, {flexDirection: "row", marginTop: index == 0 ? 10 : 0,
                    width: DEVICEWIDTH * 0.95, padding: 10}]}>
                    {
                        st == 'png' || st == 'jpg' || st == 'jpe' ? (
                            <Image source={{ uri: item._links['wp:featuredmedia'][0].href }}
                                style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
                                borderRadius: 8}} resizeMode="contain"/>
                        ):(
                            <Image source={require('../../assets/SwepScreen2.png')} 
                                style={{width: DEVICEWIDTH * 0.2, height: DEVICEWIDTH * 0.2,
                                borderRadius: 8}} resizeMode="contain"/>
                        )
                    }
                    <View style={{ flexDirection: "column", marginLeft: 10 }}>
                        <Text style={{ color: "#FFFFFF", fontSize: 14, width: DEVICEWIDTH * 0.7,
                        paddingRight: 8 }}>{title}...</Text>
                        <View style={{ flexDirection: "row", marginTop: 8, paddingBottom: 5,
                            alignItems: "center" }}>
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
            <View style={{width: DEVICEWIDTH * 0.95, alignItems: "center",
                    marginTop: index == PerPageData ? 15 : 8, justifyContent: "center"}}>
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
                    { ShowNextBottom ? (
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
                        <View style={{marginTop: 50}}></View>
                    </View>
                    ):(
                        <></>
                    )
                }
                </View>
            </View>
        );
    }
    //---------------------Main
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView>
                {/* Top app bar */}
                <View style={{
                    flexDirection: 'row', height: DEVICEHEIGHT * 0.08, width: DEVICEWIDTH,
                    backgroundColor: "#2574EB", alignItems: 'center', marginTop: 34
                }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                        <AntDesign name="arrowleft" size={35} color="#FFFFFF" onPress={() => navigation.goBack()} />
                        <Text style={{
                            color: "#FFFFFF", marginStart: 10, fontSize: 20,
                            fontWeight: 'bold'
                        }}>{route.params.title}</Text>
                    </View>
                </View>
                {/* Body */}
                <View style={{
                    height: DEVICEHEIGHT * 0.921, width: DEVICEWIDTH, backgroundColor: "#000000",
                    alignItems: "center"}}>
                    {
                        isLoading ? (
                            <ActivityIndicator/>
                        ):(
                            <FlatList
                                data={DataDetail} ref={listRef}
                                keyExtractor={(item, index) => index.toString()}
                                enableEmptySections={true} extraData={FlatListRF}
                                renderItem={(item, index)=> DisplayList(item, index)}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={()=>onRefresh()}
                                        colors= {["red", "green", "blue"]}
                                    />
                                }
                            />
                        )
                    }


                </View>

            </SafeAreaView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: DEVICEHEIGHT,
        width: DEVICEWIDTH,
        flexDirection: 'column',
    },
    cardview2: {
        backgroundColor: '#444444',
        borderRadius: 10,
        elevation: 10,
    },

});