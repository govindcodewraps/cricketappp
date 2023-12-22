import React, { Component } from 'react';

import config from '../AppConfig';

class PredictionRepository {

    //-----------------------------
    async Get_Prediction (urll) {
      let resCNews=[], resUrl, l, authorN;
      try {
          resCNews = await fetch(config.BaseUrlv2+urll, {
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
              console.log("Predictions_Repository.js, resCNews[l]._links['wp:featuredmedia'][0].href : ",
               resCNews[l]._links['wp:featuredmedia'][0].href);
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
}

  const PredRepository = new PredictionRepository();

  export default PredRepository;