import React, { Component } from 'react';
import axios from 'axios';

import config from '../AppConfig';

class WorldCupRepository {

    //-----------------------------
    async Get_ICCWCUP2 (urll) {
      let resCNews=[];



      var homeHeader = new Headers();
      homeHeader.append("accept", "application/json");
      homeHeader.append("Content-Type", "application/x-www-form-urlencoded");
      homeHeader.append("Cookie", "PHPSESSID=vlr3nr52586op1m8ie625ror6b");
      try{
        let res = await axios.get(config.BaseUrlv2+urll, {headers: homeHeader});
        for(l=0; l<res.data.length; l++){
          console.log("WorldCup_Repository.js, GETData",res.data[l]._links['wp:featuredmedia'][0].href, ", l : ",l);

          let resUrl = await axios.get(res.data[l]._links['wp:featuredmedia'][0].href,{headers: homeHeader});
            console.log("WorldCup_Repository.js, Get_FeaturedArticles, sub data ", resUrl.data.media_details.sizes.medium.source_url, ", l : ", l);

            ImgUrl = resUrl.data.media_details.sizes.medium.source_url;
            res.data[l]._links['wp:featuredmedia'][0].href = ImgUrl;
            //console.log("HomeScreen.js, GETData, ImgUrl : ",res[l]._links['wp:featuredmedia'][0].href);

          if(l>=res.data.length-1){
            console.log("WorldCup_Repository.js, Get_FeaturedArticles, res ",res);
            console.log("WorldCup_Repository.js, Get_FeaturedArticles, res Length : ",res.data.length);
            return res.data;
          }

        }

      }catch (err) {
        // Handle Error Here
        console.error(err);
    }
  }
    //-----------------------------
    async Get_ICCWCUP1 (urll) {
      let resCNews=[];



      var homeHeader = new Headers();
      homeHeader.append("accept", "application/json");
      homeHeader.append("Content-Type", "application/x-www-form-urlencoded");
      homeHeader.append("Cookie", "PHPSESSID=vlr3nr52586op1m8ie625ror6b");
      try{
        let res = await axios.get(config.BaseUrlv2+urll, {headers: homeHeader});
            return res.data;
      }catch (err) {
        // Handle Error Here
        console.error(err);
    }






      

      // try {
      //     resCNews = await fetch(config.BaseUrlv2+urll, {
      //       method: 'GET',
      //       headers: {
      //         Accept: 'application/json',
      //         'Content-Type': 'application/json',
      //       },
      //     });
      //     resCNews = await resCNews.json();
      //     //console.log("HomeScreen.js, GETData",res[0].date);
      //      console.log("WorldCup_Repository.js, GETData",resCNews.length);
      //     let l = 0, ImgUrl='';
      //     for(l=0; l<resCNews.length; l++){
      //       console.log("WorldCup_Repository.js, ICCWCUP",resCNews[l]._links['wp:featuredmedia'][0].href);
      //       try {
      //         let resUrl = await fetch(resCNews[l]._links['wp:featuredmedia'][0].href, {
      //           method: 'GET',
      //           headers: {
      //             Accept: 'application/json',
      //             'Content-Type': 'application/json',
      //           },
      //         });
      //         resUrl = await resUrl.json();
      //         ImgUrl = resUrl.media_details.sizes.full.source_url;
      //       } catch (e) {
      //         console.error(e);
      //       }
      //       resCNews[l]._links['wp:featuredmedia'][0].href = ImgUrl;
      //       //console.log("HomeScreen.js, GETData, ImgUrl : ",res[l]._links['wp:featuredmedia'][0].href);
      //       if(l>=resCNews.length-1){
      //         return resCNews;
      //       }
      //     }
      //   } catch (e) {
      //     console.error(e);
      //   }
    }
    //-----------------------------
    // async Get_T20WCUP () {
    //   let resCSchdule=[];
    //   try {
    //     resCSchdule = await fetch(BaseUrl+'posts?categories=93', {
    //         method: 'GET',
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       resCSchdule = await resCSchdule.json();
    //       // console.log("HomeScreen.js, GETData",res[0].date);
    //       // console.log("HomeScreen.js, GETData",res.length);
    //       let l = 0, ImgUrl='';
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
    //           ImgUrl = resUrl.media_details.sizes.full.source_url;
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
    // async Get_WTestCh () {
    //   let resCTeam=[];
    //   try {
    //     resCTeam = await fetch(BaseUrl+'posts?categories=5182', {
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
    //           ImgUrl = resUrl.media_details.sizes.full.source_url;
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

  const WCR = new WorldCupRepository();

  export default WCR;