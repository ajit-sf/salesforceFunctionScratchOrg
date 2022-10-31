/**
 * Describe Ocrfunction here.
 *
 * The exported method is the entry point for your code when the function is invoked.
 *
 * Following parameters are pre-configured and provided to your function on execution:
 * @param event: represents the data associated with the occurrence of an event, and
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import fetch, { FormData } from 'node-fetch';

const require = createRequire(import.meta.url);


export default async function (event, context, logger) {
  try {
    logger.info(`Invoking Ocrfunction with payload`);

    // getting neccessary modules for JWT 
    const dotenv = require('dotenv');
    const jwt = require('jsonwebtoken');
    const fs = require('fs');

    const downloadableUrl = event.data.downloadableUrl;
    const type = event.data.type;

    logger.info(`Invoking Ocrfunction with payload`);

    //Generating payload
    let payload = {
      "sub": 'ajiteshpratap.singh@salesforce.com',
      "aud": "https://api.einstein.ai/v2/oauth2/token",
      "exp": (Math.floor(Date.now() / 1000) + 600),
    };

    const key = readFileSync('einstein_platform_check.pem');

    // Signing token
    const token = jwt.sign(payload, key, { algorithm: 'RS256' });

    //Getting access token to hit the API
    let response = await fetch('https://api.einstein.ai/v2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`
    });
    let responseJSON = await response.json();
    console.log('Response ' + JSON.stringify(responseJSON));


    //Fetching text values from images
    const form = new FormData();
    // form.append('sampleLocation', 'https://www.publicdomainpictures.net/pictures/240000/velka/emergency-evacuation-route-signpost.jpg');
    form.append('sampleLocation', downloadableUrl);
    form.append('task', 'contact');
    form.append('modelId', 'OCRModel');

    let imageResponse = await fetch('https://api.einstein.ai/v2/vision/ocr', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${responseJSON.access_token}`
      },
      body: form
    });
    let imageJSON = await imageResponse.json();
    console.log('imageJSON ' + JSON.stringify(imageJSON));

    if (type === 'aadhaarFront') {
      // Name check regex for capturing names
      const nameReg = /^[A-Z](?:[a-z]|\b[,.'-]\b)+(?: [A-Z](?:[a-z]|\b[,.'-]\b)+)*$/;
      const aadhaarNumberRegFour = /^[0-9]{4}$/;
      const aadhaarNumberRegFull = /^\d{4}\s\d{4}\s\d{4}$/;


      let nameVal;
      let aadhaarVal = [];
      let aadhaarEntireNum = '';

      for (let i of imageJSON.probabilities) {
        if (nameReg.test(i.label)) {
          nameVal = i.label;
        }
        if (aadhaarNumberRegFour.test(i.label)) {
          aadhaarVal.push(i);
        }

        if (aadhaarNumberRegFull.test(i.label)) {
          aadhaarEntireNum = i.label;
        }
      }

      if (!aadhaarEntireNum) {
        aadhaarVal.sort((a, b) => a.probability - b.probability || a.minX - b.minX);
        for (let i = aadhaarVal.length - 1; i >= 0; i--) {
          aadhaarEntireNum += aadhaarVal[i].label;

          if (aadhaarEntireNum.length() >= 12) {
            break;
          }
        }
      }

      return { nameVal: nameVal, aadhaarNum: aadhaarEntireNum };
    }
    else if(type === 'aadhaarBack'){

      let addressArray = [];
      let address = '';

      for (let i of imageJSON.probabilities) {
        if(i.attributes.tag === 'ADDRESS'){
          addressArray.push(i);
        }
        
      }
      addressArray.sort((a,b) => a.minY - b.minY || a.minX - b.minX);

      for(let i of addressArray){
        address += i.label;
      }
      return {address : address};
    }



  }
  catch (e) {
    console.log('Error ' + e);
    return null;
  }



}
