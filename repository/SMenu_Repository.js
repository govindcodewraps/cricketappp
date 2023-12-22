import React, { Component } from 'react';

import config from '../AppConfig';

class SeriesMRepository {

  //-----------------------------
    async Get_SeriesFirstM(api) {
      let resMenuF=[], resMenuF2=[], ss=[], n, m, i;

      try {
        resMenuF = await fetch(config.BaseUrl1+api, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log("SMenu_Repository.js, Prime menu : ", resMenuF, ", length : ", resMenuF.length);
        resMenuF = await resMenuF.json();
        console.log("SMenu_Repository.js, Prime menu : ", resMenuF, ", length : ", resMenuF.length);
        if(resMenuF.length > 0){
          let subM=[], subM2=[];
          for(n = 0; n < resMenuF.length; n++){
            if(resMenuF[n].post_title == "Series"){
              subM.push(resMenuF[n].submenu);
              for(m = 0; m < subM[0].length; m++){
                console.log("SMenu_Repository.js, subM[0][m].post_parent : ", subM[0][m].post_parent);
                if(subM[0][m].post_parent == 0 && subM[0][m].title == "Cricket T20 Events.."){
                  ss.push({"ID": subM[0][m].ID, "Title": subM[0][m].title, 
                    "href": "https://www.icccricketschedule.com/wp-json/wp/v2/posts?categories=1037",
                    "post_parent": subM[0][m].post_parent, "isExpanded": false, "submenu": []});
                }else{
                ss.push({"ID": subM[0][m].ID, "Title": subM[0][m].title, "href": "",
                        "post_parent": subM[0][m].post_parent, "isExpanded": false, "submenu": []});
                // try {
                //   resMenuF2 = await fetch(config.BaseUrlv2+'categories?parent='+subM[0][m].post_parent, {
                //     method: 'GET',
                //     headers: {
                //       Accept: 'application/json',
                //       'Content-Type': 'application/json',
                //     },
                //   });
                //   resMenuF2 = await resMenuF2.json();
                //     for(i = 0; i < resMenuF2.length; i++){
                //       ss[m].submenu.push({"id": resMenuF2[i].id, "name": resMenuF2[i].name,
                //               "href": resMenuF2[i]._links["wp:post_type"][0].href});
                //     }                    
                // } catch (e) {
                //   console.error("SMenu_Repository.js, Error-1 : ", e.message);
                // }
                }
            }
              return ss;
              n=resMenuF.length+1;
            }
          }
        }else{
          return resMenuF;
        }
      } catch (e) {
        console.error(e);
      }
    }
  //-----------------------------
  async Get_SeriesFirstM2(api) {    //api = subM[0][m].post_parent carry backword
    let ss =[];
    try {
      resMenuF2 = await fetch(config.BaseUrlv2+'categories?parent='+api, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      resMenuF2 = await resMenuF2.json();
        for(i = 0; i < resMenuF2.length; i++){
          ss.push({"id": resMenuF2[i].id, "name": resMenuF2[i].name,
                  "href": resMenuF2[i]._links["wp:post_type"][0].href});
          if(i>=resMenuF2.length-1)
            return ss;
        }                    
    } catch (e) {
      console.error("SMenu_Repository.js, Error-1 : ", e.message);
    }


  }
  //-----------------------------
  async Get_PrimaryMenus(fetchMenu) {
    let resMenuF=[], resMenuF2=[], ss=[], n, m, i;

    try {
      resMenuF = await fetch('https://icccricketschedule.com/wp-json/menu/primary', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      resMenuF = await resMenuF.json();
      return resMenuF;
    } catch (e) {
      console.error(e);
    }
  }
  //-----------------------------
  async Get_MoreMenuMain(fetchMenu, PrimaryMenuData) {
    let resMenuF=PrimaryMenuData, resMenuF2=[], ss=[], n, m, i;

      let subM=[];
      for(n = 0; n < resMenuF.length; n++){
        if(resMenuF[n].title == fetchMenu){
          
          subM.push(resMenuF[n]);
          for(m = 0; m < subM[0].submenu.length; m++){
            if(subM[0].submenu[m].post_parent == 0 && subM[0].submenu[m].title == "IPL News"){//submenu of IPL
              try {
                resMenuF2 = await 
                  fetch("https://www.icccricketschedule.com/wp-json/wp/v2/tags?slug=ipl-news", {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                });
                resMenuF2 = await resMenuF2.json();
                  for(i = 0; i < resMenuF2.length; i++){
                    ss.push({"ID": subM[0].submenu[m].ID, "Title": subM[0].submenu[m].title,
                    "href": resMenuF2[i]._links["wp:post_type"][0].href,
                    "post_parent": subM[0].submenu[m].post_parent, "isExpanded": false, "submenu": []});
                  }                    
              } catch (e) {
                console.error("SMenu_Repository.js, Error-2 : ", e.message);
              }
            }else{
              if(resMenuF[n].title == "IPL Teams"){   //main menu
                try {
                  resMenuF2 = await fetch(config.BaseUrlv2+'categories?parent='+subM[0].submenu[m].post_parent, {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  resMenuF2 = await resMenuF2.json();
                  console.log("SMenu_Repository.js, IPL Teams resMenuF2 : ", resMenuF2);
                    for(i = 0; i < resMenuF2.length; i++){
                      if(resMenuF2[i].name == subM[0].submenu[m].title){
                        console.log("SMenu_Repository.js, IPL Teams resMenuF2 href : ", resMenuF2);
                        ss.push({"ID": subM[0].submenu[m].ID, "Title": subM[0].submenu[m].title,
                        "href": resMenuF2[i]._links["wp:post_type"][0].href,
                        "post_parent": 0, "isExpanded": false, "submenu": []});
                      }
                    }                    
                } catch (e) {
                  console.error("SMenu_Repository.js, Error-3 : ", e.message);
                }
              }else{
                ss.push({"ID": subM[0].submenu[m].ID, "Title": subM[0].submenu[m].title, "href": "",
                "post_parent": subM[0].submenu[m].post_parent, "isExpanded": false, "submenu": []});
              }
            }
          }   //for loop

          return ss;
          n=resMenuF.length+1;
        }
      }
  }
  //-----------------------------
  async Get_MoreMenuSub(MainMenuPostParent) {
    let resMenuF, resMenuF2=[], ss=[], n, m, i;
      let subM=[], subM2=[];
                  try {
                    resMenuF2 = await fetch(config.BaseUrlv2+'categories?parent='+MainMenuPostParent, {
                      method: 'GET',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    });
                    resMenuF2 = await resMenuF2.json();
                      for(i = 0; i < resMenuF2.length; i++){
                        ss.push({"name": resMenuF2[i].name,
                                "href": resMenuF2[i]._links["wp:post_type"][0].href});
                          if(i>=resMenuF2.length-1){
                            console.log("Get_MoreMenuSub, sub menu ss : ", ss);
                            return ss;
                          }
                        }                    
                  } catch (e) {
                    console.error("SMenu_Repository.js, Error-4 :", e.message);
                  }
  }
  //-----------------------------
  async Get_MoreMenu(fetchMenu, PrimaryMenuData) {
    let resMenuF=PrimaryMenuData, resMenuF2=[], ss=[], n, m, i;

      let subM=[], subM2=[];
        for(n = 0; n < resMenuF.length; n++){
          if(resMenuF[n].title == fetchMenu){
            
            subM.push(resMenuF[n]);
            for(m = 0; m < subM[0].submenu.length; m++){
              if(subM[0].submenu[m].post_parent == 0 && subM[0].submenu[m].title == "IPL News"){//submenu of IPL
                try {
                  resMenuF2 = await 
                    fetch("https://www.icccricketschedule.com/wp-json/wp/v2/tags?slug=ipl-news", {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  resMenuF2 = await resMenuF2.json();
                    for(i = 0; i < resMenuF2.length; i++){
                      ss.push({"ID": subM[0].submenu[m].ID, "Title": subM[0].submenu[m].title,
                      "href": resMenuF2[i]._links["wp:post_type"][0].href,
                      "post_parent": subM[0].submenu[m].post_parent, "isExpanded": false, "submenu": []});
                    }                    
                } catch (e) {
                  console.error("SMenu_Repository.js, Error-2 : ", e.message);
                }
              }else{
                if(resMenuF[n].title == "IPL Teams"){   //main menu
                  try {
                    resMenuF2 = await fetch(config.BaseUrlv2+'categories?parent='+subM[0].submenu[m].post_parent, {
                      method: 'GET',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    });
                    resMenuF2 = await resMenuF2.json();
                    console.log("SMenu_Repository.js, IPL Teams resMenuF2 : ", resMenuF2);
                      for(i = 0; i < resMenuF2.length; i++){
                        if(resMenuF2[i].name == subM[0].submenu[m].title){
                          console.log("SMenu_Repository.js, IPL Teams resMenuF2 href : ", resMenuF2);
                          ss.push({"ID": subM[0].submenu[m].ID, "Title": subM[0].submenu[m].title,
                          "href": resMenuF2[i]._links["wp:post_type"][0].href,
                          "post_parent": 0, "isExpanded": false, "submenu": []});
                        }
                      }                    
                  } catch (e) {
                    console.error("SMenu_Repository.js, Error-3 : ", e.message);
                  }
                }else{
                  ss.push({"ID": subM[0].submenu[m].ID, "Title": subM[0].submenu[m].title, "href": "",
                  "post_parent": subM[0].submenu[m].post_parent, "isExpanded": false, "submenu": []});
                  try {
                    resMenuF2 = await fetch(config.BaseUrlv2+'categories?parent='+subM[0][m].post_parent, {
                      method: 'GET',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    });
                    resMenuF2 = await resMenuF2.json();
                      for(i = 0; i < resMenuF2.length; i++){
                        ss[m].submenu.push({"name": resMenuF2[i].name,
                                "href": resMenuF2[i]._links["wp:post_type"][0].href});
                      }                    
                  } catch (e) {
                    console.error("SMenu_Repository.js, Error-4 :", e.message);
                  }
                }
              }
            }   //for loop

            return ss;
            n=resMenuF.length+1;
          }
        }
  }
  //-----------------------------
  async Get_MoreMenuOther(fetchMenu, PrimaryMenuData) {
    let resMenuF=PrimaryMenuData, resMenuF2=[], ss=[], n, m, i;

    // try {
    //   resMenuF = await fetch('https://icccricketschedule.com/wp-json/menu/primary', {
    //     method: 'GET',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   resMenuF = await resMenuF.json();
      console.log("SMenu_Repository.js, More Menu Data : ", resMenuF)
      let subM=[], subM2=[];
        for(n = 0; n < resMenuF.length; n++){
          if(resMenuF[n].title == fetchMenu){
            subM.push(resMenuF[n].submenu);

            for(m = 0; m < subM[0].length; m++){
              if(m == 0){
                try {
                  resMenuF2 = 
                  await fetch("https://www.icccricketschedule.com/wp-json/wp/v2/tags?slug=world-cup", {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  resMenuF2 = await resMenuF2.json();
                  ss.push({"ID": subM[0][m].ID, "Title": subM[0][m].title, 
                    "post_parent": subM[0][m].post_parent, "isExpanded": false,
                    "href": resMenuF2[0]._links["wp:post_type"][0].href});
                  } catch (e) {
                  console.error("SMenu_Repository.js, Error-5 : ", e.message);
                }
              }
              if(m == 1){
                try {
                  resMenuF2 = await
                  fetch("https://icccricketschedule.com/wp-json/wp/v2/categories?slug=cricketer-profile", {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  resMenuF2 = await resMenuF2.json();
                  ss.push({"ID": subM[0][m].ID, "Title": subM[0][m].title, 
                    "post_parent": subM[0][m].post_parent, "isExpanded": false,
                    "href": resMenuF2[0]._links["wp:post_type"][0].href});
                  } catch (e) {
                  console.error("SMenu_Repository.js, Error-6 : ", e.message);
                  }
              }
              if(m == 2){
                try {
                  resMenuF2 = 
                  await fetch("https://www.icccricketschedule.com/wp-json/wp/v2/tags?slug=world-cup", {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  resMenuF2 = await resMenuF2.json();
                  console.log("SMenu_Repository.js,------------Web Stories---------- subM[0][m].title : ", subM[0][m].title);
                  ss.push({"ID": subM[0][m].ID, "Title": subM[0][m].title, 
                    "post_parent": "v1", "isExpanded": false,
                    "href": "https://www.icccricketschedule.com/wp-json/web-stories/v1/web-story"});
                  } catch (e) {
                  console.error("SMenu_Repository.js, Error-6 : ", e.message);
                }
              }
              if(m == 3){
                try {
                  resMenuF2 = 
                  await fetch("https://www.icccricketschedule.com/wp-json/wp/v2/tags?slug=world-cup", {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  resMenuF2 = await resMenuF2.json();
                  ss.push({"ID": subM[0][m].ID, "Title": subM[0][m].title, 
                    "post_parent": subM[0][m].post_parent, "isExpanded": false,
                    "href": resMenuF2[0]._links["wp:post_type"][0].href});
                  } catch (e) {
                  console.error("SMenu_Repository.js, Error-7 : ", e.message);
                }
              }
              if(m == 4){
                try {
                  resMenuF2 = 
                  await fetch("https://icccricketschedule.com/wp-json/wp/v2/categories?slug=sports", {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  resMenuF2 = await resMenuF2.json();
                  ss.push({"ID": subM[0][m].ID, "Title": subM[0][m].title, 
                    "post_parent": subM[0][m].post_parent, "isExpanded": false,
                    "href": resMenuF2[0]._links["wp:post_type"][0].href});
                  } catch (e) {
                  console.error("SMenu_Repository.js, Error-8 : ", e.message);
                }
              }

            }

            return ss;
            n=resMenuF.length+1;
          }
        }
    // } catch (e) {
    //   console.error("SMenu_Repository.js, Error-9 : ", e.message);
    // }

  }
    //-----------------------------
    async Get_MoreMenu_V1 (urll) {
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
              console.error("SMenu_Repository.js, Error-10 : ", e.message);
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
              console.log("1-Detail_Repository.js, resCNews[l]._links['wp:featuredmedia'][0].href : ",
               resCNews[l]._links['wp:featuredmedia'][0].href);
            } catch (e) {
              console.error("SMenu_Repository.js, Error-11 : ", e.message);
            }
            if(l>=resCNews.length-1){
              return resCNews;
            }
          }

        } catch (e) {
          console.error("SMenu_Repository.js, Error-12 : ", e.message);
        }
    }
  //-----------------------------
  async Get_TopTeams() {
    let resMenuF=[], resMenuF2=[], ss=[], n, m, i;

    try {
      resMenuF = await fetch('https://www.icccricketschedule.com/wp-json/wp/v2/categories?parent=4209', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      resMenuF = await resMenuF.json();
      return resMenuF;
    } catch (e) {
      console.error("SMenu_Repository.js, Error-13 : ", e.message);
    }
  }
//---------------------------
}

  const SMR = new SeriesMRepository();

  export default SMR;