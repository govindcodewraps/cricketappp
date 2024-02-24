import React from "react";
import { useNavigation } from '@react-navigation/native'
import { View, Text, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator,
        StyleSheet, UIManager, LayoutAnimation} from "react-native";
import { Entypo, AntDesign } from '@expo/vector-icons';

import SMR from "../repository/SMenu_Repository";
import config from "../AppConfig";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default function Series({route}){
    const navigation = useNavigation();

    const [isLoading, set_isLoading] = React.useState(true);
    const [isShowMenu, set_ShowMenu] = React.useState(true);

    const [refreshing, setRefreshing] = React.useState(false);
    const [multiSelect, setMultiSelect] = React.useState(false);

    const [SeriesMenu, Set_Menu] = React.useState([]);

    const FetchData = async ()=>{ 
        let menu;
        menu = await SMR.Get_SeriesFirstM("menu/primary");
        Set_Menu(menu);
        console.log("Series.js, menu : ", menu, ", menu rows : ", menu.length);
        if( menu.length > 0){
            setTimeout(async ()=> {
            setRefreshing(false);
            set_isLoading(false);
            let j=0;
            for(j=0; j<menu.length; j++){
              console.log("Series.js, menu[j].post_parent : ", menu[j].post_parent);
              if(menu[j].post_parent > 0){
                try {
                  let resMenuF2 = await fetch(config.BaseUrlv2+'categories?parent='+menu[j].post_parent, {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  resMenuF2 = await resMenuF2.json();
                    for(i = 0; i < resMenuF2.length; i++){
                      menu[j].submenu.push({"id": resMenuF2[i].id, "name": resMenuF2[i].name,
                              "href": resMenuF2[i]._links["wp:post_type"][0].href});
                      console.log("Series.js, sub menu : ", menu[j]);
                    }                    
                } catch (e) {
                  console.error("SMenu_Repository.js, Error-1 : ", e.message);
                }
                
              }
              if(j>=menu.length-1)
                Set_Menu(menu);
                console.log("Series.js, SeriesMenu : ", SeriesMenu, ", menu : ", menu);
            }
        }, 30);
      }else{
        set_ShowMenu(false);
        set_isLoading(false);
      }
    }
    React.useEffect(() => {
        setRefreshing(true);
        FetchData();
        setTimeout(()=> {
            setRefreshing(false);
        }, 100);
    }, []);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        //FetchData(); 
        setTimeout(()=> {
            setRefreshing(false);
        }, 100);
    }, []);

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    
    const ExpandableComponent = ({ item, onClickFunction }) => {
        //Custom Component for the Expandable List
        const [layoutHeight, setLayoutHeight] = React.useState(0);
        const navigation = useNavigation();
    
        React.useEffect(() => {
          if (item.isExpanded) {
            setLayoutHeight(null);
          } else {
            setLayoutHeight(0);
          }
          
        }, [item.isExpanded]);
    
        return (
          <View>
            {/*Header of the Expandable List Item*/}
            <View style={{alignItems: "center", marginTop: 10}}>
            <View style={{borderColor: "#C0BBBB", borderRadius: 12, borderWidth: 1,
                          width: DEVICEWIDTH * 0.95, justifyContent: "center",
                          height: DEVICEHEIGHT * 0.075}}>
                  {
                    item.post_parent == 0 ? (
                        <TouchableOpacity key={item.id} onPress={() => {
                            navigation.navigate("MoreMenuList", {title: item.Title, PageID: item.href})
                        }}
                            style={styles.header}>
                            <View style={{flexDirection: 'row', marginLeft: 5,}}>
                            <Text style={[styles.headerText, {width: "87%", padding: 5,
                                        color: "#FFFFFF",}]}>
                                {item.Title}</Text>
                            </View>
                        </TouchableOpacity>
                    ):(
                        <TouchableOpacity  key={item.id} activeOpacity={0.8}
                        onPress={() => {onClickFunction()}} style={styles.header}>
                        <View style={{flexDirection: 'row', marginLeft: 5, alignItems: "center",}}>
                            <Text style={[styles.headerText, {width: "87%", padding: 5,
                                    color: item.isExpanded ? "#5EB9FE":"#FFFFFF",}]}>
                                {item.Title}
                            </Text>
                                <Entypo name="chevron-right" size={28} color="#FFFFFF"
                            style={{transform: [{rotate: item.isExpanded ? '90deg' : '0deg'}]}}/>
                                </View>
                        </TouchableOpacity>
                      )
                  }
            </View>
            </View>
            {/* <View style={{width: "auto", height: 1, backgroundColor: "#C0BBBB"}}/> */}
            
            <View style={{height: layoutHeight, overflow: 'hidden', marginTop: 2}}>
              {/*Content under the header of the Expandable List Item*/}
              {item.submenu.map((item, key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.content}
                  onPress={() => navigation.navigate("MoreMenuList",
                  {title: item.name, PageID: item.href})}>
                    <Text style={styles.text}>
                        {item.name}
                    </Text>
                    <View style={styles.separator} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
    };
        
    const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...SeriesMenu];
    if (multiSelect) {
        // If multiple select is enabled
        array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
        // If single select is enabled
        array.map((value, placeindex) =>
        placeindex === index
            ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
            : (array[placeindex]['isExpanded'] = false)
        );
    }
    Set_Menu(array);
    };
//------------------------------------
    return (
        <View>
        {
            isLoading ? (
                <ActivityIndicator/>
            ):(
              isShowMenu ? (
            <View style={{height: "100%",flexDirection: "row", marginLeft: 0,}}>
                <ScrollView>
                    {SeriesMenu.map((item, key) => (
                        <ExpandableComponent
                        key={item.Title}
                        onClickFunction={() => {
                            updateLayout(key);
                        }}
                        item={item}
                        />
                    ))
                    }
                </ScrollView>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={()=> navigation.navigate("Twitter")}
                  style={styles.touchableOpacityStyle}>
                    <AntDesign name="twitter" size={40} color="#5EB9FE" style={styles.floatingB}/>
                </TouchableOpacity>
           </View>
              ):(
                <View>
                    <Text style={{color: "#FFFFFF", width: "95%", height: "70%", flexDirection: "row",
                        alignItems: "center"}}>Sorry, there is no data...</Text>
                </View>
              )
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
      borderRadius: 15,
      width: DEVICEWIDTH * 0.93,
      height: DEVICEHEIGHT * 0.07,
      justifyContent: "center",
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
      marginLeft: 20,
      marginBottom: 17,
    },
    content: {
      marginLeft: 15,
      width: DEVICEWIDTH * 0.90,
      height: DEVICEHEIGHT * 0.07,
      backgroundColor: '#606070',
      justifyContent: "center",
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