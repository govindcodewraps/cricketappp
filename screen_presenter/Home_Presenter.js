import React, { Component } from 'react';

import config from '../AppConfig';
import { Alert } from 'react-native';
import axios from 'axios';

class HomePage {

    //-----------------------------    
    async Get_FeaturedArticles (api) {
        let res=[];
        var homeHeader = new Headers();
        homeHeader.append("accept", "application/json");
        homeHeader.append("Content-Type", "application/x-www-form-urlencoded");
        homeHeader.append("Cookie", "PHPSESSID=vlr3nr52586op1m8ie625ror6b");
        try{
          let res = await axios.get(config.BaseUrlv2+api,
                    {headers: homeHeader});
          // for(l=0; l<res.data.length; l++){
          //   console.log("Home_Presenter.js, GETData",res.data[l]._links['wp:featuredmedia'][0].href, ", l : ",l);

          //   let resUrl = await axios.get(res.data[l]._links['wp:featuredmedia'][0].href,{headers: homeHeader});
          //     console.log("Home_Presenter.js, Get_FeaturedArticles, sub data ", resUrl.data.media_details.sizes.medium.source_url, ", l : ", l);

          //     ImgUrl = resUrl.data.media_details.sizes.medium.source_url;
          //     res.data[l]._links['wp:featuredmedia'][0].href = ImgUrl;
          //     //console.log("HomeScreen.js, GETData, ImgUrl : ",res[l]._links['wp:featuredmedia'][0].href);

          //   if(l>=res.data.length-1){
          //     console.log("Home_Presenter.js, Get_FeaturedArticles, res ",res);
          //     console.log("Home_Presenter.js, Get_FeaturedArticles, res Length : ",res.data.length);
               return res.data;
          //   }

          // }

        }catch (err) {
          // Handle Error Here
          console.error(err);
      }


      // axios.get(config.BaseUrlv2+'posts?categories=2&per_page=5&page=1',{headers: homeHeader}).then(async (res)=>{
      //         console.log("Home_Presenter.js, Get_FeaturedArticles, res ", res.data);
      //         let ss=[];
      //         ss.push(res.data);
      //         console.log("Home_Presenter.js, Get_FeaturedArticles, res length : ", res.data.length);

      //       let l = 0, ImgUrl='';
      //       for(l=0; l<res.data.length; l++){
      //         console.log("Home_Presenter.js, GETData",res.data[l]._links['wp:featuredmedia'][0].href, ", l : ",l);
      //         axios.get(res.data[l]._links['wp:featuredmedia'][0].href).then((resUrl)=>{

      //           console.log("Home_Presenter.js, Get_FeaturedArticles, sub data ", resUrl.data.media_details.sizes.medium.source_url, ", l : ", l);

      //           ImgUrl = resUrl.data.media_details.sizes.medium.source_url;
      //           res.data[l]._links['wp:featuredmedia'][0].href = ImgUrl;
      //           //console.log("HomeScreen.js, GETData, ImgUrl : ",res[l]._links['wp:featuredmedia'][0].href);
      //         }).catch((error)=>console.error("Home_Presenter.js, Get_FeaturedArticles, message-2 : ", error))

      //         if(l>=res.data.length-1){
      //           console.log("Home_Presenter.js, Get_FeaturedArticles, res ",res);
      //           console.log("Home_Presenter.js, Get_FeaturedArticles, res Length : ",res.data.length);
      //           return res.data;
      //         }

      //       }
      //   }).catch((error)=>console.error("Home_Presenter.js, Get_FeaturedArticles, message-1 : ", error))



        // try {
        //     res = await fetch(config.BaseUrlv2+'posts?categories=2&per_page=5&page=1', {
        //       method: 'GET',
        //       headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //       },
        //     });
        //     res = await res.json();
        //     // console.log("HomeScreen.js, GETData",res[0].date);
        //     // console.log("HomeScreen.js, GETData",res.length);
        //     let l = 0, ImgUrl='';
        //     for(l=0; l<res.length; l++){
        //       //console.log("HomeScreen.js, GETData",res[l]._links['wp:featuredmedia'][0].href);
        //       try {
        //         let resUrl = await fetch(res[l]._links['wp:featuredmedia'][0].href, {
        //           method: 'GET',
        //           headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json',
        //           },
        //         });
        //         resUrl = await resUrl.json();
        //         //console.log("HomeScreen.js, GETData, resUrl, media_details : ", resUrl.media_details.sizes.medium.source_url);
        //         ImgUrl = resUrl.media_details.sizes.medium.source_url;
        //       } catch (e) {
        //         console.error(e);
        //       }
        //       res[l]._links['wp:featuredmedia'][0].href = ImgUrl;
        //       //console.log("HomeScreen.js, GETData, ImgUrl : ",res[l]._links['wp:featuredmedia'][0].href);
        //       if(l>=res.length-1){
        //         console.log("Home_Presenter.js, GETData",res[0].date);
        //         //Set_DATAFeaturedArt(res);
        //         return res;
        //       }
        //     }
        //   } catch (e) {
        //    //return res=[{"Error": "0", "Message": "Server is not responding, try after some time."}];
        //     console.error(e);
        //   }
    };
    //-----------------------------
    async Get_CricketCovrage (api) {
        let res=[];
        try {
            res = await fetch(config.BaseUrlv2+api, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });
            res = await res.json();
            // console.log("HomeScreen.js, GETData",res[0].date);
            // console.log("HomeScreen.js, GETData",res.length);
            let l = 0, ImgUrl='';
            for(l=0; l<res.length; l++){
              //console.log("HomeScreen.js, GETData",res[l]._links['wp:featuredmedia'][0].href);
              try {
                let resUrl = await fetch(res[l]._links['wp:featuredmedia'][0].href, {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                });
                resUrl = await resUrl.json();
                //console.log("HomeScreen.js, GETData, resUrl, media_details : ", resUrl.media_details.sizes.medium.source_url);
                ImgUrl = resUrl.media_details.sizes.medium.source_url;
              } catch (e) {
                console.error(e);
              }
              res[l]._links['wp:featuredmedia'][0].href = ImgUrl;
              //console.log("HomeScreen.js, GETData, ImgUrl : ",res[l]._links['wp:featuredmedia'][0].href);
              if(l>=res.length-1){
                return res;
              }
            }
          } catch (e) {
            console.error(e);
          }
    }
    //-----------------------------
    async Get_MoreView (ParsUrl) {
      let resTop5;
      try {
          resTop5 = await fetch(config.BaseUrlv2+ParsUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          resTop5 = await resTop5.json();
          // let l = 0, ImgUrl='', recno = resTop5.length;
          // for(l=0; l<resTop5.length; l++){
          //   try {
          //     let resUrl = await fetch(resTop5[l]._links['wp:featuredmedia'][0].href, {
          //       method: 'GET',
          //       headers: {
          //         Accept: 'application/json',
          //         'Content-Type': 'application/json',
          //       },
          //     });
          //     resUrl = await resUrl.json();
          //     ImgUrl = resUrl.media_details.sizes.medium.source_url;
          //   } catch (e) {
          //     console.error(e);
          //   }
          //   resTop5[l]._links['wp:featuredmedia'][0].href = ImgUrl;
          //   if(l>=resTop5.length-1){
          //     return resTop5;
          //   }
          // }
        } catch (e) {
          console.error(e);
        }
    }
    // //-----------------------------
    // async Get_Top5Top10 () {
    //   let resTop5=[];
    //   try {
    //       resTop5 = await fetch(BaseUrl+'posts?categories=1405', {
    //         method: 'GET',
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       resTop5 = await resTop5.json();
    //       let l = 0, ImgUrl='', recno = resTop5.length;
    //       for(l=0; l<resTop5.length; l++){
    //         try {
    //           let resUrl = await fetch(resTop5[l]._links['wp:featuredmedia'][0].href, {
    //             method: 'GET',
    //             headers: {
    //               Accept: 'application/json',
    //               'Content-Type': 'application/json',
    //             },
    //           });
    //           resUrl = await resUrl.json();
    //           ImgUrl = resUrl.media_details.sizes.medium.source_url;
    //         } catch (e) {
    //           console.error(e);
    //         }
    //         resTop5[l]._links['wp:featuredmedia'][0].href = ImgUrl;
    //         if(l>=resTop5.length-1){
    //           return resTop5;
    //         }
    //       }
    //     } catch (e) {
    //       console.error(e);
    //     }
    // }
    // //-----------------------------
    // async Get_CricketNews () {
    //   let resCNews=[];
    //   try {
    //       resCNews = await fetch(BaseUrl+'posts?categories=3', {
    //         method: 'GET',
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       resCNews = await resCNews.json();
    //       // console.log("HomeScreen.js, GETData",res[0].date);
    //       // console.log("HomeScreen.js, GETData",res.length);
    //       let l = 0, ImgUrl='', recnoCNews = resCNews.length;
    //       for(l=0; l<resCNews.length; l++){
    //         try {
    //           let resUrl = await fetch(resCNews[l]._links['wp:featuredmedia'][0].href, {
    //             method: 'GET',
    //             headers: {
    //               Accept: 'application/json',
    //               'Content-Type': 'application/json',
    //             },
    //           });
    //           resUrl = await resUrl.json();
    //           ImgUrl = resUrl.media_details.sizes.medium.source_url;
    //         } catch (e) {
    //           console.error(e);
    //         }
    //         resCNews[l]._links['wp:featuredmedia'][0].href = ImgUrl;
    //         if(l>=resCNews.length-1){
    //           return resCNews;
    //         }
    //       }
    //     } catch (e) {
    //       console.error(e);
    //     }
    // }
    // //-----------------------------
    // async Get_CricketSchdule (api) {
    //   let resCSchdule=[];
    //   try {
    //     resCSchdule = await fetch(BaseUrl+'posts?categories=1', {
    //         method: 'GET',
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       resCSchdule = await resCSchdule.json();
    //       // console.log("HomeScreen.js, GETData",res[0].date);
    //       // console.log("HomeScreen.js, GETData",res.length);
    //       let l = 0, ImgUrl='', recnoCNews = resCSchdule.length;
    //           console.log("Home_Presenter.js, count : ", resCSchdule.length);
    //       for(l=0; l<resCSchdule.length; l++){
    //         //console.log("HomeScreen.js, GETData",res[l]._links['wp:featuredmedia'][0].href);
    //         try {
    //           let resUrl = await fetch(resCSchdule[l]._links['wp:featuredmedia'][0].href, {
    //             method: 'GET',
    //             headers: {
    //               Accept: 'application/json',
    //               'Content-Type': 'application/json',
    //             },
    //           });
    //           resUrl = await resUrl.json();
    //           //console.log("HomeScreen.js, GETData, resUrl, media_details : ", resUrl.media_details.sizes.medium.source_url);
    //           ImgUrl = resUrl.media_details.sizes.medium.source_url;
    //         } catch (e) {
    //           console.error(e);
    //         }
    //         resCSchdule[l]._links['wp:featuredmedia'][0].href = ImgUrl;
    //         //console.log("HomeScreen.js, GETData, ImgUrl : ",res[l]._links['wp:featuredmedia'][0].href);
    //         if(l>=resCSchdule.length-1){
    //           return resCSchdule;
    //         }
    //       }
    //     } catch (e) {
    //       console.error(e);
    //     }
    // }
    // //-----------------------------
    // async Get_CricketTeam (api) {
    //   console.log("Home_Presenter.js, Get_CricketSchdule, api : ",api);
    //   let resCTeam=[];
    //   try {
    //     resCTeam = await fetch(BaseUrl+'posts?categories=3', {
    //         method: 'GET',
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       resCTeam = await resCTeam.json();
    //       let l = 0, ImgUrl='';
    //       for(l=0; l<resCTeam.length; l++){
    //         try {
    //           let resUrl = await fetch(resCTeam[l]._links['wp:featuredmedia'][0].href, {
    //             method: 'GET',
    //             headers: {
    //               Accept: 'application/json',
    //               'Content-Type': 'application/json',
    //             },
    //           });
    //           resUrl = await resUrl.json();
    //           ImgUrl = resUrl.media_details.sizes.medium.source_url;
    //         } catch (e) {
    //           console.error(e);
    //         }
    //         resCTeam[l]._links['wp:featuredmedia'][0].href = ImgUrl;
    //         if(l>=resCTeam.length-1){
    //           return resCTeam;
    //         }
    //       }
    //     } catch (e) {
    //       console.error(e);
    //     }
    // }

}

  const HP = new HomePage();

  export default HP;