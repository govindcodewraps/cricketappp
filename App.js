import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer,} from "@react-navigation/native";

import Prediction from './screens/Predictions';
import WorldCup from './screens/WorldCup';
import Series from './screens/Series';
import RouteScreen from './screens/RouteScreen';
import HomeScreen from './screens/HomeScreen';
import MoreMnu from './screens/MoreMenu';
import HomeMoreDetails from './screens/home_pages/HomeMoreDetail';
import ShowDetails from './screens/ShowDetail';
import SeriesM_Details from './screens/SeriesM_Detail';
import MoreInfo from './screens/MoreInfo';
import TopTeams from './screens/TopTeams';
import TwitterWebView from './screens/TwitterWebPage';
import MoreM_List from './screens/MoreM_List';
import MoreMLDetail from './screens/MoreMenuLDetail';
import MoreM_List_v1 from './screens/MoreM_List_v1';
import MoreImg_Post from './screens/MoreImg_Post';
import ShowDetail1 from './screens/ShowDetail1';


const Stack = createNativeStackNavigator();

export default function App(){
  function StackNavigator(){
    return(
      <Stack.Navigator>
        <Stack.Screen name='HomePage' initialParams={{screen_no: "0", title: 'ICC '}} component={RouteScreen}
                      options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='HomeScreen' initialParams={{screen_no: "1", title: 'First Page'}} 
                      component={HomeScreen} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='SeriesStack' initialParams={{screen_no: "2", title: 'Second Page'}} 
                      component={Series} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='WorldCup' initialParams={{screen_no: "3", title: 'First Page'}} 
                      component={WorldCup} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='Predictions' initialParams={{screen_no: "4", title: 'Second Page'}} 
                      component={Prediction} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='MoreMenu' initialParams={{screen_no: "5", title: 'Second Page'}} 
                      component={MoreMnu} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='MoreMenus' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={MoreMnu} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='MoreMenuList' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={MoreM_List} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='MoreMenuList_V1' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={MoreM_List_v1} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='MoreMenuLDetail' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={MoreMLDetail} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='MoreImgPosts' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={MoreImg_Post} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#84CFC2"}}}/>
        <Stack.Screen name='HomeMoreDetail' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={HomeMoreDetails} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#5EB9FE"}}}/>
        <Stack.Screen name='ShowDetail' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={ShowDetails} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#5EB9FE"}}}/>
        <Stack.Screen name='ShowDetail1' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={ShowDetail1} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#5EB9FE"}}}/>
        <Stack.Screen name='SeriesMDetails' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={SeriesM_Details} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#5EB9FE"}}}/>
        <Stack.Screen name='MoreInfo' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={MoreInfo} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#5EB9FE"}}}/>
        <Stack.Screen name='TopTeams' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={TopTeams} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#5EB9FE"}}}/>
        <Stack.Screen name='Twitter' initialParams={{screen_no: "6", title: 'Second Page'}} 
                      component={TwitterWebView} options={{headerShown: false,
                      headerStyle: {backgroundColor: "#5EB9FE"}}}/>
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
        <StackNavigator/>
    </NavigationContainer>
  );
}