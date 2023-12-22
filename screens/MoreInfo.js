import React from "react";
import { useNavigation } from '@react-navigation/native'
import { View, Text, Dimensions, ActivityIndicator, Image, SafeAreaView, StyleSheet, ScrollView, 
            RefreshControl, } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import RenderHtml from 'react-native-render-html';
import { removeElement, isTag } from 'domutils';

import DR from "../repository/Detail_Repository";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

var DomParser = require('react-native-html-parser').DOMParser;

export default function MoreInfo({route}){

    const navigation = useNavigation();

    const [isLoading, set_isLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [DataDetail, Set_DataDetail] = React.useState([]);

    const FetchData=async ()=>{
        console.log("MoreInfo.js, url : ", route.params.page);
        let about;
        if(route.params.action == "1"){
            about = await DR.Get_TopTeamD(route.params.page);
            Set_DataDetail(about);
        }
        if(route.params.action == "2"){
            about = await DR.Get_MoreInfo(route.params.page);
            Set_DataDetail(about);
        }
        
            setTimeout(()=> {
                setRefreshing(false);
                set_isLoading(false);
            }, 100);
    }
    React.useEffect(() => {
        // setRefreshing(true);
        FetchData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        FetchData();
        
    }, []);
    //-------------------------------fds
    const DisplayList = () => {
        let desc1 = DataDetail[0].content.rendered, desc2 = DataDetail[0].excerpt.rendered;

const source = {
    html: ` `+desc1+`\n`+desc2+``
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
                    <ScrollView
                    showsVerticalScrollIndicator={false} 
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    >
                        {
                            isLoading ? (
                                <ActivityIndicator/>
                            ):(
                                <DisplayList/>
                            )
                        }



                    </ScrollView>            
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