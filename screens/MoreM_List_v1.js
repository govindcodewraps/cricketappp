import React, {useRef} from "react";
import { View, Text, Dimensions, TouchableOpacity, Image, StyleSheet, FlatList,
            RefreshControl, ActivityIndicator, Animated} from "react-native";
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons';

import SMR from "../repository/SMenu_Repository";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

let PageNo = 1;

export default function MoreM_List_v1 ({route}){

    const navigation = useNavigation();

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

    async function FetchData(){
        let data, data2;
        PageNo = 1;
            data = await SMR.Get_MoreMenu_V1(route.params.PageID+"?per_page=10&page="+PageNo);
            Set_DataDetail(data);
            console.log("MoreM_List_V1.js, Data-1, Count : ", data[0].link);
            console.log("MoreM_List_V1.js, Data-1, Count : ", data.length);
            data2 = data[0].story_data.pages;
            console.log("MoreM_List_V1.js, Data-1, Pages, Count : ", data2.length);
            data2 = data[0].story_data.pages[0].elements;
            console.log("MoreM_List_V1.js, Data-1, Pages-> elements Count : ", data2.length);
            setTimeout(async ()=> {
                setRefreshing(false);
                set_isLoading(false);
            }, 30);
        }

    React.useEffect(() => {
        FetchData();
    }, []);
    //-----------------------------------
    const RefreshData = () => {
        ResetData(0);
    }
    //-----------------------------------
    const ResetData = async (action) => {
        let data;
        
        // if(PageNo == 1){
        //     data = await SMR.Get_MoreMenu_V1(route.params.PageID+"?per_page=10");
        // }else{
            data = await SMR.Get_MoreMenu_V1(route.params.PageID+"?per_page=10&page="+PageNo);
        //}

        setTimeout(async ()=> {
            setFlatListRF(!FlatListRF);

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
    //-----------------------------------
    const ShowList = ({item, index}) => {
        console.log("index : ", index);
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
            time = dt.substring(14, 16);

        return (
            <View>
                <TouchableOpacity key={item.id} onPress={()=>navigation.navigate("MoreImgPosts", 
                        {title: ftitle, PageID: item.link})}>    
                    <View style={{backgroundColor: "#444444", borderWidth: 2, borderRadius: 10,
                                width: DEVICEWIDTH * 0.95, padding: 10, marginTop: 10,
                                flexDirection: "column", alignItems: "center",
                                justifyContent: "center"}}>
                        <Image source={{uri: item._links['wp:featuredmedia'][0].href}}
                            style={{width: DEVICEWIDTH * 0.9, height: DEVICEWIDTH * 0.5, borderRadius: 10}}
                            resizeMode="contain"/>
                        <Text style={{color: "#FFFFFF", fontSize: 14, width: DEVICEWIDTH * 0.88,
                                paddingRight: 8, paddingTop: 5}}>
                        {title}...</Text>
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
                        <View style={{marginTop: 10}}/>
                        </View>
                        ):(
                            <></>
                        )
                    }
                </View>
            </View>
        );
    }
    //-------------------------------
    return (
        <View style={styles.container}>
            {/* Top app bar */}
            <View style={{flexDirection: 'row', height: DEVICEHEIGHT * 0.08, width: DEVICEWIDTH,
                        backgroundColor: "#2574EB", alignItems: 'center',
                        marginTop: DEVICEHEIGHT * 0.042}}>
            <View style={{justifyContent:'center', alignItems: 'center', flexDirection: "row"}}>
                <TouchableOpacity onPress={()=> navigation.goBack()}
                    style={{width: DEVICEWIDTH * 0.135, height: DEVICEHEIGHT * 0.08,
                    justifyContent: 'center'}}>
                    <AntDesign name="arrowleft" size={35} color="#FFFFFF"/>
                </TouchableOpacity>
                <Text style={{color: "#FFFFFF", marginStart: 10, fontSize: 20,
                fontWeight: 'bold'}}>{route.params.title}</Text>
            </View>
            </View>
            {/* Body */}
            <View style={{height: DEVICEHEIGHT * 0.921, width: DEVICEWIDTH, backgroundColor: "#000000",
                        alignItems: "center"}}>
                {
                    isLoading ? (
                        <ActivityIndicator/>
                    ):(
                        <View style={{marginBottom:30, height: DEVICEHEIGHT * 0.9}}>
                        <FlatList
                            data={DataDetail} showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            enableEmptySections={true} extraData={FlatListRF}
                            renderItem={(item, index)=>ShowList(item, index)}
                            ref={listRef}
                            refreshControl={
                                <RefreshControl refreshing={refreshing}
                                    onRefresh={()=>RefreshData()}
                                    colors={["red", "green", "blue"]} />
                            }
                        />
                        </View>
                )
                }

            </View>
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