import React, {useRef} from "react";
import { useNavigation } from '@react-navigation/native'
import { View, Text, Dimensions, ActivityIndicator, Image, StyleSheet, ScrollView,
        Share,
        TouchableOpacity} from "react-native";
import { AntDesign, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import RenderHtml from 'react-native-render-html';
import { removeElement, isTag } from 'domutils';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

import DR from "../repository/Detail_Repository";
import config from "../AppConfig";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

var DomParser = require('react-native-html-parser').DOMParser;

export default function ShowDetails({route}){

    const navigation = useNavigation();

    let zoomableViewRef = useRef();

    const [isLoading, set_isLoading] = React.useState(true);
    const [DataDetail, Set_DataDetail] = React.useState([]);
    const [ShareUrl, Set_ShareUrl] = React.useState("");

    const FetchData=async ()=>{
      console.log("ShowDetail.js, route.params.PageID : ", config.BaseUrlv2+""+route.params.PageID);
      let Top5;
        Top5 = await DR.Get_Detail(route.params.PageID);
        Set_DataDetail(Top5);
        console.log("ShowDetail.js, data : ", Top5.link);
        Set_ShareUrl(Top5.link);
        setTimeout(()=> {
            set_isLoading(false);
        }, 50);
    }
    React.useEffect(() => {
        FetchData();
    }, []);

    //-------------------------------
    const DisplayList = () => {
        let title = DataDetail.title.rendered, 
        desc = DataDetail.content.rendered;   //+""+DataDetail.excerpt.rendered;
        title=title.replace(/<\/?[^>]+>/gi, '');
      const source = {
        html: `<!DOCTYPE html>
        <html>
        <head>
        <style>
        table, th, td {
          border: 1px solid #000000;
          border-collapse: collapse;
          background-color: #000000;
        }
        </style>
        </head>
        <body>
        `+desc+`<p>\n</p>
        </body>
        </html>`
      };
        function onElement(element) {
            // Remove the first two children of an ol tag.
            if (element.tagName === 'ol') {
              let i = 0;
              for (const child of element.children) {
                // Children might be text node or comments.
                // We don't want to count these.
                if(isTag(child) && i < 2) {
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
                  width: DEVICEWIDTH * 0.95, padding: 20, alignItems: "center"}}>               
            <ReactNativeZoomableView
            maxZoom={3.5}
            minZoom={1}
            ref={zoomableViewRef}
            bindToBorders={true}
            style={{backgroundColor: '#FFFFFF',}}>
              <View style={{ backgroundColor: "#000000", width: DEVICEWIDTH * 0.95,
                        height: DEVICEWIDTH * 0.527, borderRadius: 8, alignItems: "center"}}>
              <Image source={{uri: DataDetail._links["wp:featuredmedia"][0].href}} 
                  style={{width: DEVICEWIDTH * 0.92, height: DEVICEWIDTH * 0.5, borderRadius: 8,
                    marginTop: 5}}
                  resizeMode="contain" />
            </View>

                <Text style={{color: "#000000", fontSize: 13, alignItems: "flex-start",
                  width: DEVICEWIDTH - 50, marginTop: 10}}>
                    Author Name : {DataDetail._links.author[0].href}
                </Text>
                <Text style={{color: "#000000", fontSize: 13, alignItems: "flex-start",
                  width: DEVICEWIDTH - 50}}>Modify on : {DataDetail.modified}</Text>
              <View style={{marginLeft: 10}}>
                  <RenderHtml
                      contentWidth={DEVICEWIDTH * 0.8}
                      source={source}
                      domVisitors={domVisitors}
                      zoomEnabled={true}
                  />
              </View>
              </ReactNativeZoomableView>
              <View style={{marginTop: 40}}></View>
          </View>
      );
    }
    //-------------------------------
    const ShareLink = () => {
      Share.share({
        message: ShareUrl.toString(),
      })
        //after successful share return result
        .then((result) => console.log(result))
        //If any thing goes wrong it comes here
        .catch((errorMsg) => console.log(errorMsg));
    }
    //---------------------Main
    return (
      <View style={styles.container}>
        <StatusBar style='auto' />
          {/* Top app bar */}
          <View style={{flexDirection: 'row', height: DEVICEHEIGHT * 0.12, width: DEVICEWIDTH,
                      backgroundColor: "#2574EB", alignItems: 'center',
                      marginTop: DEVICEHEIGHT * 0.042}}>
          <View style={{justifyContent:'center', alignItems: 'center', flexDirection: "row"}}>
            <TouchableOpacity onPress={()=> navigation.goBack()}
              style={{width: DEVICEWIDTH * 0.22, height: DEVICEHEIGHT * 0.11}}>
              <AntDesign name="arrowleft" size={35} color="#FFFFFF"/>
            </TouchableOpacity>
              <Text style={{color: "#FFFFFF", marginStart: 0, fontSize: 14,
              width: DEVICEWIDTH * 0.87, fontWeight: 'bold'}}>
                  {route.params.title}</Text>
          </View>
          </View>
          {/* Body */}
          <View style={{height: DEVICEHEIGHT * 0.921, width: DEVICEWIDTH, backgroundColor: "#FFFFFF",
                      alignItems: "center"}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                  {
                      isLoading ? (
                          <ActivityIndicator/>
                      ):(
                        <View>
                          <DisplayList/>
                        </View>
            
                      )
                  }
              </ScrollView>
              <View style={styles.touchableOpacityStyle}>
                <AntDesign name="sharealt" size={40} color="#2574EB"  style={styles.floatingB}
                  onPress={()=> ShareLink()}/>
                <Feather name="zoom-in" size={40} color="#2574EB"  style={styles.floatingB}
                  onPress={()=> zoomableViewRef.current?.zoomBy(0.5)}/>
                <Feather name="zoom-out" size={40} color="#2574EB" style={styles.floatingB}
                    onPress={()=> zoomableViewRef.current?.zoomBy(-0.5)}/>
              </View>
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
    touchableOpacityStyle: {
      position: 'absolute',
      elevation: 15,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 10,
      bottom: 80,
    },
    floatingB: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 40,
      elevation: 15,
    },
  
});





    
{/* <h1>Table with Collapsed Borders</h1>
    
<table>
  <tr>
    <th>Month</th>
    <th>Savings</th>
  </tr>
  <tr>
    <td>January</td>
    <td>$100</td>
  </tr>
  <tr>
    <td>February</td>
    <td>$80</td>
  </tr>
</table> */}
