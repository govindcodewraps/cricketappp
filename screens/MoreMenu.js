import React from "react";
import { useNavigation } from '@react-navigation/native'
import { View, Text, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator,
    StyleSheet, UIManager, LayoutAnimation, FlatList, Image} from "react-native";
import { Entypo, AntDesign } from '@expo/vector-icons';

import SMR from "../repository/SMenu_Repository";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;
let PageNo = 1;
const TopMenu = [{id: 0, Title: "IPL", Active: 1},
{id: 1, Title: "IPL TEAMS", Active: 0},
{id: 2, Title: "ASIA CUP", Active: 0},
{id: 3, Title: "TOP TEAMS", Active: 0},
{id: 4, Title: "OTHER", Active: 0},
{id: 5, Title: "Info.", Active: 0}];

export default function MoreMenus ({route}){
    const navigation = useNavigation();

    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, set_isLoading] = React.useState(true);
    const [isShowMenu, set_ShowMenu] = React.useState(true);

    const [TMFlatListRF, setTMFlatListRF] = React.useState(true);
    const [ActivMenuIndex, Set_ActivMenuIndex] = React.useState(0);
    const [FlatListRF, setFlatListRF] = React.useState(true);

    const [IPLActiv, Set_IPLActiv] = React.useState(true);
    const [IPLTeamActiv, Set_IPLTeamActiv] = React.useState(false);
    const [AsiaCupActiv, Set_AsiaCupActiv] = React.useState(false);
    const [TopTeamsActiv, Set_TopTeamsActiv] = React.useState(false);
    const [OtherActive, Set_OtherActive] = React.useState(false);
    const [InfoActive, Set_InfoActiv] = React.useState(false);

    const [multiSelect, setMultiSelect] = React.useState(false);

    const [DataIPL, Set_DataIPL] = React.useState([]);
    const [DataIPLTeam, Set_DataIPLTeam] = React.useState([]);
    const [DataAsiaCup, Set_DataAsiaCup] = React.useState([]);
    const [DataTopTeams, Set_DataTopTeams] = React.useState([]);
    const [DataOther, Set_DataOther] = React.useState([]);
    const [DataInfo, Set_DataInfo] = React.useState([
            {"id": 0, "name": "About Us", "Micon": require('../assets/information.png'),
                    "page": "about"},
            {"id": 1, "name": "Contact Us", "Micon": require('../assets/customer_service.png'),
                    "page": "contact"},
            {"id": 2, "name": "Write For Us", "Micon": require('../assets/writing.png'),
                    "page": "write-for-icc-cricket-schedule"},
            {"id": 3, "name": "Partner With Us", "Micon": require('../assets/deal.png'),
                    "page": "work-partner-icccricketschedule-com"},
            ]);

    const FetchData=async (refresh)=>{
        TopMenu[0].Active=1;
        TopMenu[1].Active=0;
        TopMenu[2].Active=0;
        TopMenu[3].Active=0;
        TopMenu[4].Active=0;
        TopMenu[5].Active=0;
        let PrimaryMenuData, ICC, T20WC, Asiacup, topteams, Other, IPLSubMenu, j = 0;
            PrimaryMenuData = await SMR.Get_PrimaryMenus();
            console.log("MoreMenu.js, PrimaryMenuData : ", PrimaryMenuData);
            if(PrimaryMenuData.length > 0){
                ICC = await SMR.Get_MoreMenuMain("IPL", PrimaryMenuData);
                Set_DataIPL(ICC);
                setTimeout(()=> {
                    set_isLoading(false);
                    setRefreshing(false);
                }, 30);
                if(ICC)
                    console.log("MoreMenu.js,------------------- 88888888888888888888888888888888888888 ,,,,,,,,,,,,,,,,,,");
                console.log("MoreMenu.js, ------------------------------------ICC Main Menus : ", ICC);
                //---------------------Fetch IPL submenus
                let DataIPLlength = 0;
                for(j=0; j<ICC.length; j++){
                    if(ICC[j].Title == "IPL News"){}else{
                        IPLSubMenu = await SMR.Get_MoreMenuSub(ICC[j].post_parent);
                        if(DataIPL.length>0){
                            DataIPLlength = 1;
                            DataIPL[j].submenu.push(IPLSubMenu);
                        }else{
                            DataIPLlength = 0;
                            ICC[j].submenu = IPLSubMenu;
                        }
                    if(j>=ICC.length-1 && DataIPLlength == 0){
                        Set_DataIPL(ICC);
                        console.log("MoreMenu.js, ICC Menus & Submenu : ", ICC);
                    }
                    }
                }
                //-------------------------------------
                T20WC = await SMR.Get_MoreMenuMain("IPL Teams", PrimaryMenuData)
                Set_DataIPLTeam(T20WC);
                Asiacup = await SMR.Get_MoreMenuMain("ASIA CUP", PrimaryMenuData)
                console.log("MoreMenu.js,------------------- 3333333333333333333333333333333333333 ,,,,,,,,,,,,,,,,,,");
                if(Asiacup){
                    Set_DataAsiaCup(Asiacup);
                    console.log("MoreMenu.js,------------------- AsiaCup Menus & Submenu : ", Asiacup);
                    DataIPLlength = 0;
                    for(j=0; j<Asiacup.length; j++){
                            IPLSubMenu = await SMR.Get_MoreMenuSub(Asiacup[j].post_parent);
                            if(DataAsiaCup.length>0){
                                DataIPLlength = 1;
                                DataAsiaCup[j].submenu.push(IPLSubMenu);
                            }else{
                                DataIPLlength = 0;
                                Asiacup[j].submenu = IPLSubMenu;
                            }
                        if(j>=Asiacup.length-1 && DataIPLlength == 0){
                            Set_DataAsiaCup(Asiacup);
                            console.log("MoreMenu.js,------------------- AsiaCup Menus & Submenu : ", Asiacup);
                        }
                    }
                }else{

                }
                console.log("MoreMenu.js,------------------- 444444444444444444444444444444444444 ,,,,,,,,,,,,,,,,,,");
                //---------------------Fetch ASIA CUP submenus
            topteams = await SMR.Get_TopTeams();
            if(topteams)
                Set_DataTopTeams(topteams);

            Other = await SMR.Get_MoreMenuOther("More..", PrimaryMenuData)
            if(Other)
                Set_DataOther(Other);
        }else{
            set_ShowMenu(false);
            set_isLoading(false);
        }
    }
    React.useEffect(() => {
        FetchData(0);
    }, []);
    //------------------------------------------
    function MenuIPLActive(){
        Set_IPLActiv(true);
        Set_IPLTeamActiv(false);
        Set_AsiaCupActiv(false);
        Set_TopTeamsActiv(false);
        Set_OtherActive(false);
        Set_InfoActiv(false);
    }
    function MenuIPLTeamActive(){
        Set_IPLActiv(false);
        Set_IPLTeamActiv(true);
        Set_AsiaCupActiv(false);
        Set_TopTeamsActiv(false);
        Set_OtherActive(false);
        Set_InfoActiv(false);
    }
    function MenuAsiaCupActive(){
        Set_IPLActiv(false);
        Set_IPLTeamActiv(false);
        Set_AsiaCupActiv(true);
        Set_TopTeamsActiv(false);
        Set_OtherActive(false);
        Set_InfoActiv(false);
    }
    function MenuTopTeamsActive(){
        Set_IPLActiv(false);
        Set_IPLTeamActiv(false);
        Set_AsiaCupActiv(false);
        Set_TopTeamsActiv(true);
        Set_OtherActive(false);
        Set_InfoActiv(false);
    }
    function MenuOtherActive(){
        Set_IPLActiv(false);
        Set_IPLTeamActiv(false);
        Set_AsiaCupActiv(false);
        Set_TopTeamsActiv(false);
        Set_OtherActive(true);
        Set_InfoActiv(false);
    }
    function MenuInfoActive(){
        Set_IPLActiv(false);
        Set_IPLTeamActiv(false);
        Set_AsiaCupActiv(false);
        Set_TopTeamsctiv(false);
        Set_OtherActive(false);
        Set_InfoActiv(true);
        set_isLoading(false);
        setRefreshing(false)
    }
    //-----------------------------------
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    //-----------------------------------------
    const ExpandableComponent = ({ item, onClickFunction, Index }) => {
        //Custom Component for the Expandable List
        const [layoutHeight, setLayoutHeight] = React.useState(0);
        const navigation = useNavigation();
        //console.log("MoreMenu.js, post_parent : ", item.post_parent);
    
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
            <View style={{borderColor: "#C0BBBB", borderRadius: 13, borderWidth: 2,
                          width: DEVICEWIDTH * 0.95, backgroundColor: "#000000"}}>
                  {
                    item.post_parent == 0 ? (
                        <TouchableOpacity key={item.id} onPress={() => {
                            console.log("MoreMenu.js, ExpandableComponent, Line : ", 193);
                            navigation.navigate("MoreMenuList", {title: item.Title, PageID: item.href})
                        }} style={styles.header}>
                            <View style={{flexDirection: 'row', marginLeft: 5, alignItems: "center",}}>
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
            {
                
                item.submenu.map((item, key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.content}
                  onPress={() => {
                    console.log("MoreMenu.js, ExpandableComponent, Line : ", 228);
                    navigation.navigate("MoreMenuList",
                                {title: item.name, PageID: item.href})}}>
                    <Text style={styles.text}>
                        {item.name}
                    </Text>
                    <View style={styles.separator} />
                </TouchableOpacity>
                ))
            }
            </View>

          </View>
        );
    };
        
    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...DataIPL];
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
        Set_DataIPL(array);
    };

    const IPLTeamsupdateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...DataIPLTeam];
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
        Set_DataIPLTeam(array);
    };
        
    const AsiaCupdateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...DataAsiaCup];
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
        Set_DataAsiaCup(array);
    };

    // const OtherupdateLayout = (index) => {
    //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //     const array = [...DataOther];
    //     if (multiSelect) {
    //         // If multiple select is enabled
    //         array[index]['isExpanded'] = !array[index]['isExpanded'];
    //     } else {
    //         // If single select is enabled
    //         array.map((value, placeindex) =>
    //         placeindex === index
    //             ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
    //             : (array[placeindex]['isExpanded'] = false)
    //         );
    //     }
    //     Set_DataOther(array);
    // };
    //-----------------------------------
    const ShowTopTeams = (item, index) => {
        return (
            <View style={{alignItems: "center", marginTop: 10}}>
                <View style={[styles.header, {borderColor: "#C0BBBB", borderRadius: 12, borderWidth: 2,
                        width: DEVICEWIDTH * 0.95}]}>
                    <TouchableOpacity key={item.id} onPress={()=>
                        navigation.navigate("MoreMenuList",
                        {title: item.name, PageID: item._links["wp:post_type"][0].href})
                        // navigation.navigate("MoreInfo", {title: item.name, 
                        //     page: item._links["wp:post_type"][0].href, action: "1"})
                    }>    
                        <View style={{flexDirection: "row", padding: 4}}>
                            <Text style={[styles.headerText, {width: "82%",
                                        color: item.isExpanded ? "#5EB9FE":"#FFFFFF",}]}>
                                {item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: index == DataTopTeams.length-1 ? 20 : 0}}/>
            </View>
        );
    }
    //-----------------------------------
    const MoreMenuOther = ({item}) => {
        if(item.post_parent == "v1"){
            return (
                <View style={{alignItems: "center", marginTop: 10}}>
                    <View style={[styles.header, {borderColor: "#C0BBBB", borderRadius: 12, borderWidth: 2,
                            width: DEVICEWIDTH * 0.95}]}>
                        <TouchableOpacity key={item.id} onPress={()=>{
                            console.log("MoreMenu.js, Other, Titel : ", item.Title, ", Url : ", item.href);
                            navigation.navigate("MoreMenuList_V1",
                            {title: item.Title, PageID: item.href})
                        }} style={{width: "100%", height: "100%"}}>
                            <View style={{flexDirection: "row", padding: 4, width: "100%",
                                    height: "100%"}}>
                                <Text style={[styles.headerText, {width: "100%", marginLeft: 10,
                                            color: item.isExpanded ? "#5EB9FE":"#FFFFFF",}]}>
                                    {item.Title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }else{
            return (
                <View style={{alignItems: "center", marginTop: 10}}>
                    <View style={[styles.header, {borderColor: "#C0BBBB", borderRadius: 12, borderWidth: 2,
                            width: DEVICEWIDTH * 0.95}]}>
                        <TouchableOpacity key={item.id} onPress={()=>{
                            console.log("MoreMenu.js, Other, Titel : ", item.Title, ", Url : ", item.href);
                            navigation.navigate("MoreMenuList",
                            {title: item.Title, PageID: item.href})
                        }} style={{width: "100%", height: "100%"}}>
                            <View style={{flexDirection: "row", padding: 4, width: "100%",
                                height: "100%"}}>
                                <Text style={[styles.headerText, {width: "100%", marginLeft: 10,
                                            color: item.isExpanded ? "#5EB9FE":"#FFFFFF",}]}>
                                    {item.Title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
    //-----------------------------------
    const MenuInfo = ({item}) => {
        return (
            <View style={{alignItems: "center", marginTop: 10}}>
                <View style={[styles.header, {borderColor: "#C0BBBB", borderRadius: 12, borderWidth: 2,
                        width: DEVICEWIDTH * 0.95}]}>
                    <TouchableOpacity key={item.id} onPress={()=>
                        navigation.navigate("MoreInfo", {title: item.name, page: item.page, action: "2"})
                        } style={{width: "100%", height: "100%"}}>
                        <View style={{flexDirection: "row", padding: 4, width: "100%",
                            height: "100%"}}>
                            <Image source={item.Micon} style={{width: 24, height: 24}}/>
                            <Text style={[styles.headerText, {width: "82%", marginLeft: 10,
                                        color: item.isExpanded ? "#5EB9FE":"#FFFFFF",}]}>
                                {item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
              </View>
        );
    }
    //-----------------------------------
    const WhoActive = (idd) => {
        Set_ActivMenuIndex(idd);
        let z=0;
        for(z=0; z<6; z++){
            if(TopMenu[z].id == idd){
                TopMenu[z].Active = 1;
                console.log("MoreMenu.js, WhoActive TopMenu[z].Active : ", TopMenu[z].Active, "id : ", z);
            }else{
                TopMenu[z].Active = 0;
            }
        }
        setTMFlatListRF(!TMFlatListRF);
        setFlatListRF(!FlatListRF);
    }
    //-----------------------------------
    const ShowTopMenu = ({item, index}) => {
        console.log("MoreMenu.js, ShowTopMenu item.Active : ", item.id, item.Active);
        return(
            <TouchableOpacity onPress={()=> WhoActive(item.id)} 
                style={{width: DEVICEWIDTH * 0.22, alignItems: "center",
                        height: DEVICEHEIGHT * 0.18, paddingTop: 8}}>
                <View style={{backgroundColor: item.Active == 1 ? "#7B94EC" : "#444444",
                        borderRadius: 15, height: "27%", justifyContent: "center",
                        width: "90%", alignItems: "center"}}>
                    <Text style={{color: item.Active == 1 ? "#000000" : "#FFFFFF",
                        fontSize: item.Active == 1 ? 12 : 10, padding: 3, }}>
                        {item.Title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    //--------------------------
    return (
        <View style={{width: DEVICEWIDTH, height: DEVICEHEIGHT * 0.83}}>
        {
        isLoading ? (
            <ActivityIndicator/>
        ):(
            isShowMenu ? (
    
            <View style={{width: DEVICEWIDTH, height: DEVICEHEIGHT * 0.83}}>
            <View style={{backgroundColor: "#444444", width: DEVICEWIDTH, height: DEVICEWIDTH * 0.13,
                        justifyContent: "center"}}>
                <View style={{height: "100%", flexDirection: "row", alignItems: "center"}}>
                    <FlatList
                        data={TopMenu} horizontal extraData={TMFlatListRF}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item, index)=> ShowTopMenu(item, index)}
                        showsHorizontalScrollIndicator={false}
                    />

                        {/* <TouchableOpacity onPress={()=> MenuIPLActive()} 
                                style={{width: DEVICEWIDTH * 0.19, alignItems: "center",}}>
                            <View style={{width: IPLActiv ? DEVICEWIDTH * 0.12 : DEVICEWIDTH * 0.10,
                                    backgroundColor: IPLActiv ? "#7B94EC" : "#444444",
                                    borderRadius: 7, alignItems: "center"}}>
                                <Text style={{color: IPLActiv ? "#000000" : "#FFFFFF",
                                    fontSize: IPLActiv ? 12 : 10, padding: 3, }}>
                                        IPL</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> MenuIPLTeamActive()}
                                style={{width: DEVICEWIDTH * 0.19, alignItems: "center"}}>
                            <View style={{width: IPLTeamActiv ? DEVICEWIDTH * 0.19 : DEVICEWIDTH * 0.17,
                                    backgroundColor: IPLTeamActiv ? "#7B94EC" : "#444444",
                                    borderRadius: 7, alignItems: "center"}}>
                                <Text style={{color: IPLTeamActiv ? "#000000" : "#FFFFFF",
                                    fontSize: IPLTeamActiv ? 12 : 10, padding: 3, }}>
                                        IPL TEAMS</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> MenuAsiaCupActive()}
                                style={{width: DEVICEWIDTH * 0.19, alignItems: "center"}}>
                            <View style={{width: AsiaCupActiv ? DEVICEWIDTH * 0.19 : DEVICEWIDTH * 0.17,
                                    backgroundColor: AsiaCupActiv ? "#7B94EC" : "#444444",
                                    borderRadius: 7, alignItems: "center"}}>
                                <Text style={{color: AsiaCupActiv ? "#000000" : "#FFFFFF",
                                    fontSize: AsiaCupActiv ? 12 : 10, padding: 3, }}>
                                        ASIA CUP</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> MenuOtherActive()}
                                style={{width: DEVICEWIDTH * 0.19, alignItems: "center"}}>
                            <View style={{width: OtherActive ? DEVICEWIDTH * 0.15 : DEVICEWIDTH * 0.12,
                                    backgroundColor: OtherActive ? "#7B94EC" : "#444444",
                                    borderRadius: 7, alignItems: "center"}}>
                                <Text style={{color: OtherActive ? "#000000" : "#FFFFFF",
                                    fontSize: OtherActive ? 12 : 10, padding: 3, }}>
                                        OTHER</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> MenuInfoActive()}
                                style={{width: DEVICEWIDTH * 0.19, alignItems: "center"}}>
                            <View style={{width: InfoActive ? DEVICEWIDTH * 0.13 : DEVICEWIDTH * 0.11,
                                    backgroundColor: InfoActive ? "#7B94EC" : "#444444",
                                    borderRadius: 7, alignItems: "center"}}>
                                <Text style={{color: InfoActive ? "#000000" : "#FFFFFF",
                                    fontSize: InfoActive ? 12 : 10, padding: 3, }}>
                                        Info.</Text>
                            </View>
                        </TouchableOpacity> */}
                </View>
            </View>

            <View style={styles.container}>
                <View style={{alignItems: "center"}}>
                {
                    TopMenu[0].Active == 1 ? (
                        <View style={{height: "100%",flexDirection: "row", marginLeft: 0,}}>
                        {
                        DataIPL.length > 0 ? (
                            <ScrollView>
                                {DataIPL.map((item, key, index) => (
                                    <ExpandableComponent
                                    key={item.Title}
                                    onClickFunction={() => {
                                        updateLayout(key);
                                    }}
                                    item={item}
                                    Index = {index}
                                    />
                                ))
                                }
                            </ScrollView>
                        ):(
                            <View style={{alignContent: "center", justifyContent: "center"}}>
                                <Text style={{color: "#FFFFFF"}}>Data not available</Text>
                            </View>
                            )
                        }
                        </View>
                    ):(
                        TopMenu[1].Active == 1 ? (
                            <View style={{height: "100%",flexDirection: "row", marginLeft: 0,}}>
                            {
                            DataIPLTeam.length >0 ? (
                                <ScrollView>
                                    {DataIPLTeam.map((item, key, index) => (
                                        <ExpandableComponent
                                        key={item.Title}
                                        onClickFunction={() => {
                                            IPLTeamsupdateLayout(key);
                                        }}
                                        item={item}
                                        Index = {index}
                                        />
                                    ))
                                    }
                                </ScrollView>
                                ):(
                                    <View style={{alignContent: "center", justifyContent: "center"}}>
                                        <Text style={{color: "#FFFFFF"}}>Data not available</Text>
                                    </View>
                                )
                            }
                            </View>
                        ):(
                            TopMenu[2].Active == 1 ? (
                                <View style={{height: "100%",flexDirection: "row", marginLeft: 0,}}>
                                {
                                DataAsiaCup.length > 0 ? (
                                    <ScrollView>
                                        {DataAsiaCup.map((item, key, index) => (
                                            <ExpandableComponent
                                            key={item.Title}
                                            onClickFunction={() => {
                                                AsiaCupdateLayout(key);
                                            }}
                                            item={item}
                                            Index = {index}
                                            />
                                        ))
                                        }
                                    </ScrollView>
                                ):(
                                <View style={{alignContent: "center", justifyContent: "center"}}>
                                    <Text style={{color: "#FFFFFF"}}>Data not available</Text>
                                </View>
                                )
                                }
                                </View>
                            ):(
                                TopMenu[3].Active == 1 && DataTopTeams.length > 0 ? (
                                    <View>
                                        <FlatList
                                            data={DataTopTeams}
                                            keyExtractor={(item, index) => index.toString()}
                                            enableEmptySections={true}
                                            renderItem={({item, index}) => ShowTopTeams(item, index)}
                                        />
                                    </View>
    
                                ):(
                                TopMenu[4].Active == 1 && DataOther.length > 0 ? (
                                <View>
                                <FlatList
                                    data={DataOther}
                                    keyExtractor={(item, index) => index.toString()}
                                    enableEmptySections={true}
                                    renderItem={MoreMenuOther}
                                />
                                </View>
                            ):(
                                TopMenu[5].Active == 1 && DataInfo.length > 0 ? (
                                    <View>
                                        <FlatList
                                            data={DataInfo}
                                            keyExtractor={(item, index) => index.toString()}
                                            enableEmptySections={true}
                                            renderItem={MenuInfo}
                                        />
                                    </View>
                                ):(
                                    <View>
                                    </View>
                                )
                                )
                                )
                            )
                        )
                    )
                }
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={()=> navigation.navigate("Twitter")}
                    style={styles.touchableOpacityStyle}>
                    <AntDesign name="twitter" size={40} color="#5EB9FE" style={styles.floatingB}/>
                </TouchableOpacity>
                </View>
            </View>




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