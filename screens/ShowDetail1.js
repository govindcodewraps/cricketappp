import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet,
    SafeAreaView, Image, Share} from 'react-native';
import { WebView } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';

import DR from "../repository/Detail_Repository";
import config from "../AppConfig";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default class ShowDetail1 extends Component {
    constructor() {
        super()
      this.state = {
            DataDetail : [], //define a state
            source: "",
            title: "",
            isLoading: true,
            ShareUrl: ""
        }
    }

    async componentDidMount(){
      let Top5, fontsz = 33, ImgW = DEVICEWIDTH * 2.3, ImgH = DEVICEWIDTH * 1.5;
      if(DEVICEWIDTH <= 360){
        fontsz = 38;
        ImgW = DEVICEWIDTH * 2.62;
        ImgH = DEVICEWIDTH * 1.7;
      }
        console.log("ShowDetail.js, route.params.PageID : ", this.props.route.params.PageID);
            Top5 = await DR.Get_Detail(this.props.route.params.PageID);
            this.setState({DataDetail: Top5});
            console.log("ShowDetail.js, data : ", Top5.link);
            this.setState({ShareUrl: Top5.link});
    
            this.setState({source: `<!DOCTYPE html>
                <html>
                <head>
                <style>
                table, th, td {
                border: 1px solid #000000;
                border-collapse: collapse;
                background-color: #FFFFFF;
                }
                img {
                  width: `+ImgW+`px;
                  height: `+ImgH+`px;
                }
                div.a {
                    padding: 10px;
                }
                div.b {
                  font-size: 32px;
                }
                div.c {
                  font-size: `+fontsz+`px;
                }
              </style>
                </head>
                <body>
                  <div class="a">
                    <div class="Img">
                    <img src=`+ Top5._links["wp:featuredmedia"][0].href + `
                      style="object-fit: contain;" />
                    </div>
                    <p>\n</p>
                    <div class="c">
                      Author Name : `+Top5._links.author[0].href+`
                    </div>
                    <p>\n</p>
                    <div class="c">
                      Modify on : `+Top5.modified+`
                    </div>
                    <div class="c">
                    `+Top5.content.rendered+`<p>\n</p>
                    </div>
                  </div>
                </body>
                </html>`
            });

            console.log("ShowDetail1.js, source : ", this.state.source);

            //this.setState({title: Top5.title.rendered});
    
            setTimeout(()=> {
                this.setState({isLoading: false});
            }, 50);
    
    }

  //-------------------------------
  render() {
    const ShareLink = ()=> {
        Share.share({
          message: this.state.ShareUrl.toString(),
        })
          //after successful share return result
          .then((result) => console.log(result))
          //If any thing goes wrong it comes here
          .catch((errorMsg) => console.log(errorMsg));
      }

    return (
      <SafeAreaView style={{ flex: 1 }}>
              <View style={{flexDirection: 'row', height: DEVICEHEIGHT * 0.09, width: DEVICEWIDTH,
                            backgroundColor: "#2574EB", alignItems: 'center', marginTop: 35}}>
                <View style={{justifyContent:'center', alignItems: 'center', flexDirection: "row",
                                marginStart: 10}}>
                  <TouchableOpacity onPress={()=> this.props.navigation.goBack()}
                    style={{width: DEVICEWIDTH * 0.135, height: DEVICEHEIGHT * 0.09,
                    justifyContent: 'center'}}>
                    <AntDesign name="arrowleft" size={35} color="#FFFFFF"/>
                  </TouchableOpacity>
                  <Text style={{color: "#FFFFFF", marginStart: 0, fontSize: 15,
                      width: DEVICEWIDTH * 0.86, fontWeight: 'bold', padding: 5}}>
                      {this.props.route.params.title}</Text>
                </View>
              </View>
              {
                    this.isLoading ? (
                        <ActivityIndicator/>
                    ):(
                        <View style={{width: DEVICEWIDTH, height: DEVICEHEIGHT}}>
                        <WebView
                        source={{ html: this.state.source }} 
                        />
              <View style={styles.touchableOpacityStyle}>
                <AntDesign name="sharealt" size={40} color="#2574EB" style={styles.floatingB}
                  onPress={()=> ShareLink()}/>
              </View>
                        <View style={{marginTop: 80}}/>
                        </View>
                    )
                }
      </SafeAreaView>
    );
  }
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
