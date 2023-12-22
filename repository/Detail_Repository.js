import React, { Component } from 'react';
import axios from 'axios';


import config from '../AppConfig';

var homeHeader = new Headers();
        homeHeader.append("accept", "application/json");
        homeHeader.append("Content-Type", "application/x-www-form-urlencoded");
        homeHeader.append("Cookie", "PHPSESSID=vlr3nr52586op1m8ie625ror6b");
class DetailRepository {

    //-----------------------------
    async Get_Detail (urll) {
      let resCNews=[];
      try {
          resCNews = await fetch(config.BaseUrlv2+'posts/'+urll, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          resCNews = await resCNews.json();
          let ImgUrl='', authorN;
            try {
              let resUrl = await fetch(resCNews._links['wp:featuredmedia'][0].href, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              });
              resUrl = await resUrl.json();

              var results = resUrl["media_details"];
              results = results['sizes'];
              
                resCNews._links['wp:featuredmedia'][0].href = resUrl.media_details.sizes.full.source_url;
            } catch (e) {
              console.error(e);
            }
            try {
              authorN = await fetch(resCNews._links.author[0].href, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              });
              authorN = await authorN.json();
              resCNews._links.author[0].href = authorN.name;
              console.log("Detail_Repository.js, GETta Author : ",resCNews._links.author[0]);
            } catch (e) {
              console.error(e);
            }
            return resCNews;
        } catch (e) {
          console.error(e);
        }
    }
    //-----------------------------
    async Get_SeriesDetail (urll) {
      let resCNews=[], resUrl, l, authorN;
      try {
          resCNews = await axios.get(urll,
            {headers: homeHeader});
          
          return resCNews.data;
        } catch (e) {
          console.error(e);
        }
    }
    //-----------------------------
    async Get_SeriesDetail2 (urll) {
      let resCNews2=[], resUrl2, l, authorN2;
      console.log("******************************************************************");
      try {
          resCNews2 = await fetch(urll, {
            method: 'GET',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json',},
          });
          resCNews2 = await resCNews2.json();
          console.log("2-Detail_Repository.js, data : ", resCNews2+">>>>>>>>>>>>30");
          console.log("2-Detail_Repository.js, url : ", urll);
          for(l=0; l<resCNews2.length; l++){
            try {
              authorN2 = await fetch(resCNews2[l]._links.author[0].href, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              });
              authorN2 = await authorN2.json();
              resCNews2[l]._links.author[0].href = authorN2.name;
            } catch (e) {
              console.error(e);
            }

            try {
                resUrl2 = await fetch(resCNews2[l]._links['wp:featuredmedia'][0].href, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              });
              resUrl2 = await resUrl2.json();
              resCNews2[l]._links['wp:featuredmedia'][0].href = resUrl2.media_details.sizes.full.source_url;
              console.log("2-Detail_Repository.js, resCNews2[l]._links['wp:featuredmedia'][0].href : ", resCNews2[l]._links['wp:featuredmedia'][0].href);
            } catch (e) {
              console.error(e);
            }
            if(l>=resCNews2.length-1){
              console.log("2-Detail_Repository.js, 2 : ", resCNews2.length+">>>>>>>>>>>> 2");
              return resCNews2;
            }
          }

        } catch (e) {
          console.error(e);
        }
    }
    //-----------------------------
    async Get_MoreInfo(urll) {
      let resMInfo=[];
      try {
        resMInfo = await fetch(config.BaseUrlv2+"pages?slug="+urll, {
            method: 'GET',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json',},
          });
          resMInfo = await resMInfo.json();
          return resMInfo;
        } catch (e) {
          console.error(e);
        }
    }
    //-----------------------------
    async Get_TopTeamD(urll) {
      let resCNews=[], resUrl, l, authorN;
      try {
          resCNews = await fetch(urll, {
            method: 'GET',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json',},
          });
          resCNews = await resCNews.json();
          
          for(l=0; l<resCNews.length; l++){
            try {
              authorN = await fetch(resCNews[l]._links.author[0].href, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              });
              authorN = await authorN.json();
              resCNews[l]._links.author[0].href = authorN.name;
            } catch (e) {
              console.error(e);
            }

            try {
                resUrl = await fetch(resCNews[l]._links['wp:featuredmedia'][0].href, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              });
              resUrl = await resUrl.json();
              resCNews[l]._links['wp:featuredmedia'][0].href = resUrl.media_details.sizes.full.source_url;
            } catch (e) {
              console.error(e);
            }
            if(l>=resCNews.length-1){
              return resCNews;
            }
          }

        } catch (e) {
          console.error(e);
        }
   }
    //-----------------------------
    async Get_MoreMLDetail (urll) {
      let resCNews=[], resUrl, l, authorN;
      try {
          resCNews = await fetch(urll, {
            method: 'GET',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json',},
          });
          resCNews = await resCNews.json();
          
            try {
              authorN = await fetch(resCNews._links.author[0].href, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              });
              authorN = await authorN.json();
              resCNews._links.author[0].href = authorN.name;
            } catch (e) {
              console.error(e);
            }

            try {
                resUrl = await fetch(resCNews._links['wp:featuredmedia'][0].href, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              });
              resUrl = await resUrl.json();
              resCNews._links['wp:featuredmedia'][0].href = resUrl.media_details.sizes.full.source_url;
            } catch (e) {
              console.error(e);
            }
              return resCNews;

        } catch (e) {
          console.error(e);
        }
    }
   //-------------------
}

  const DR = new DetailRepository();

  export default DR;