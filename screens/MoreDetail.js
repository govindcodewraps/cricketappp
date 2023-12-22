import React from "react";
import { useNavigation } from '@react-navigation/native'
import { View, Text, Dimensions, ActivityIndicator, Image, FlatList, StyleSheet, RefreshControl, 
         } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import RenderHtml from 'react-native-render-html';
import { removeElement, isTag } from 'domutils';

import DR from "../repository/Detail_Repository";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

var DomParser = require('react-native-html-parser').DOMParser;

export default function MoreDetail({route}){

    const navigation = useNavigation();

    const [isLoading, set_isLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [RFColor, set_RFColor] = React.useState("green");
    const [DataDetail, Set_DataDetail] = React.useState([]);

    const FetchData=async ()=>{
        console.log("MoreInfo.js, url : ", route.params.page);
        let about;
        if(route.params.action == "1"){
            about = await DR.Get_TopTeamD(route.params.page);
            Set_DataDetail(about);
            console.log("MoreInfo.js, Data : ", about);
        }
        if(route.params.action == "2"){
            about = await DR.Get_MoreInfo(route.params.page);
            Set_DataDetail(about);
        }
        
            setTimeout(()=> {
                setRefreshing(false);
                set_isLoading(false);
            }, 50);
    }
    React.useEffect(() => {
        FetchData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        FetchData();
        
    }, []);
    //-------------------------------
    const DisplayDetail = ({item}) => {

        const source = {
            html: ` `+item.content.rendered+``
        };
        function onElement(element) {
            // Remove the first two children of an ol tag.
            if (element.tagName === 'ol') {
              let i = 0;
              for (const child of element.children) {
                // Children might be text node or comments.
                // We don't want to count these.
                if (isTag(child) && i < 2) {
                  removeElement(child);
                  i++;
                }
              }
            }
          }
        const domVisitors = {
            onElement: onElement
          };

            return (
                <View style={{flexDirection: "column", marginTop: 10, marginBottom: 30,
                        width: DEVICEWIDTH * 0.95, padding: 10, alignItems: "center"}}>
                    <Image source={{uri: item._links["wp:featuredmedia"][0].href}} 
                        style={{width: DEVICEWIDTH * 0.92, height: DEVICEWIDTH * 0.5, borderRadius: 8}} />
                        <Text style={{color: "#000000", fontSize: 13, alignItems: "flex-start", width: DEVICEWIDTH - 50,
                        marginTop: 10}}>
                            Author Name : {item._links.author[0].href}
                        </Text>
                        <Text style={{color: "#000000", fontSize: 13, alignItems: "flex-start", width: DEVICEWIDTH - 50}}>
                            Modify on : {item.modified}
                        </Text>
                    <View style={{marginLeft: 10}}>
                        <RenderHtml
                            contentWidth={DEVICEWIDTH * 0.8}
                            source={source}
                            domVisitors={domVisitors}
                        />
                    </View>
                </View>
            );
    }
    //---------------------Main
    return (
        <View style={styles.container}>
          <StatusBar style='auto' />
            {/* Top app bar */}
            <View style={{flexDirection: 'row', height: DEVICEHEIGHT * 0.08, width: DEVICEWIDTH,
                        backgroundColor: "#2574EB", alignItems: 'center',
                        marginTop: DEVICEHEIGHT * 0.042}}>
            <View style={{justifyContent:'center', alignItems: 'center', flexDirection: "row"}}>
                <AntDesign name="arrowleft" size={35} color="#FFFFFF" onPress={()=> navigation.goBack()} />
                <Text style={{color: "#FFFFFF", marginStart: 10, fontSize: 20,
                fontWeight: 'bold'}}>{route.params.title}</Text>
            </View>
            </View>
            {/* Body */}
            <View style={{height: DEVICEHEIGHT * 0.921, width: DEVICEWIDTH, backgroundColor: "#FFFFFF",
                        alignItems: "center"}}>
                {
                    isLoading ? (
                        <ActivityIndicator/>
                    ):(
                        <FlatList
                            data={DataDetail} showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            enableEmptySections={true}
                            renderItem={DisplayDetail}
                            refreshControl={
                                <RefreshControl 
                                    refreshing={refreshing}
                                    onRefresh={FetchData()} />
                            }
                        />
                    )
                }

            </View>
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
        backgroundColor: 'grey',
        borderRadius: 10,
        elevation: 10,
    },

});