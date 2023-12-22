import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableOpacity,
    SafeAreaView, Image} from 'react-native';
import { WebView } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default class MoreImg_Post extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
          <View style={{flexDirection: 'row', height: DEVICEHEIGHT * 0.12, width: DEVICEWIDTH,
                      backgroundColor: "#2574EB", alignItems: 'center',
                      marginTop: DEVICEHEIGHT * 0.042}}>
          <View style={{justifyContent:'center', alignItems: 'center', flexDirection: "row"}}>
              <AntDesign name="arrowleft" size={35} color="#FFFFFF" 
                      onPress={()=> this.props.navigation.goBack()} />
              <Text style={{color: "#FFFFFF", marginStart: 10, fontSize: 14,
              width: DEVICEWIDTH * 0.87, fontWeight: 'bold'}}>
                  {this.props.route.params.title}</Text>
          </View>
          </View>
        <WebView 
          source={{ uri: this.props.route.params.PageID }} 
        />
      </SafeAreaView>
    );
  }
}