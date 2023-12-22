import React from "react";
import { useNavigation } from '@react-navigation/native'
import { View, Text, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator,
    StyleSheet, UIManager, LayoutAnimation, FlatList, Image} from "react-native";
import { AntDesign } from '@expo/vector-icons';

import SMR from "../repository/SMenu_Repository";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default function TopTeams ({route}){
    const navigation = useNavigation();

    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, set_isLoading] = React.useState(true);
    const [DataInfo, Set_DataInfo] = React.useState([]);

    const FetchData=async (refresh)=>{
        let ICC, T20WC, Asiacup, Other;
            Other = await SMR.Get_TopTeams();
            Set_DataInfo(Other);
        setTimeout(()=> {
            set_isLoading(false);
            setRefreshing(false)}, 100);
    }
    React.useEffect(() => {
        FetchData(0);
    }, []);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        FetchData();
    }, []);
  
    //-----------------------------------
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    //-----------------------------------
    const MenuInfo = ({item}) => {
        return (
            <View style={{alignItems: "center", marginTop: 10}}>
                <View style={[styles.header, {borderColor: "#C0BBBB", borderRadius: 12, borderWidth: 2,
                        width: DEVICEWIDTH * 0.95}]}>
                    <TouchableOpacity key={item.id} onPress={()=>
                        navigation.navigate("MoreInfo", {title: item.name, 
                            page: item._links["wp:post_type"][0].href, action: "1"})
                    }>    
                        <View style={{flexDirection: "row", padding: 4}}>
                            <Text style={[styles.headerText, {width: "82%",
                                        color: item.isExpanded ? "#5EB9FE":"#FFFFFF",}]}>
                                {item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
              </View>
        );
    }
    //--------------------------
    return (
        <View style={{width: DEVICEWIDTH, height: DEVICEHEIGHT, backgroundColor: "#000000",
                    marginTop: DEVICEHEIGHT * 0.042}}>
                {/* Top app bar */}
                <View style={{flexDirection: 'row', height: DEVICEHEIGHT * 0.08, width: DEVICEWIDTH,
                            backgroundColor: "#2574EB", alignItems: 'center',}}>
                <View style={{justifyContent:'center', alignItems: 'center', flexDirection: "row"}}>
                    <AntDesign name="arrowleft" size={35} color="#FFFFFF" 
                            onPress={()=> navigation.goBack()} />
                    <Text style={{color: "#FFFFFF", marginStart: 10, fontSize: 20,
                    width: DEVICEWIDTH * 0.87, fontWeight: 'bold'}}>
                        {route.params.title}</Text>
                </View>
                </View>
            
            {/* Top menu end */}
        {
            isLoading ? (
                <ActivityIndicator/>
            ):(
                <View style={styles.container}>
                <View style={{alignItems: "center"}}>
                    <FlatList
                        data={DataInfo}
                        keyExtractor={(item, index) => index.toString()}
                        enableEmptySections={true}
                        renderItem={MenuInfo}
                    />
                </View>
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
      header: {
        backgroundColor: '#000000',
        padding: 7,
        borderRadius: 13,
      },
      headerText: {
        fontSize: 16,
        fontWeight: '500',
      },
      separator: {
        height: 0.5,
        backgroundColor: '#808080',
      },
      text: {
        fontSize: 16,
        color: '#FFFFFF',
        padding: 8,
        marginLeft: 20,
      },
      content: {
        marginLeft: 15,
        width: DEVICEWIDTH * 0.90,
        backgroundColor: '#606070',
      },
  });