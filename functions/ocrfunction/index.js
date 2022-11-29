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
import fetch, { FormData } from 'node-fetch';

const require = createRequire(import.meta.url);


export default async function (event, context, logger) {
  try {
    logger.info(`Invoking Ocrfunction with payload`);

    // getting neccessary modules for JWT 
    const jwt = require('jsonwebtoken');

    const username = event.data.username;
    const privateKey = event.data.privateKey;

    logger.info(`Invoking Ocrfunction with payload`);

    //Generating payload
    let payload = {
      "sub": username,
      "aud": "https://api.einstein.ai/v2/oauth2/token",
      "exp": (Math.floor(Date.now() / 1000) + 600),
    };

    const key = privateKey;

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



    let aadhaarCardFrontObj = await imageProcessing(event.data.aadhaarCardFrontUrl, responseJSON.access_token, 'aadhaarFront');
    let aadhaarCardBackObj = await imageProcessing(event.data.aadhaarCardBackUrl, responseJSON.access_token, 'aadhaarBack');
    let panCardObj = await imageProcessing(event.data.panCardUrl, responseJSON.access_token, 'panCard');
    return {...aadhaarCardFrontObj, ...aadhaarCardBackObj, ...panCardObj};
  }
  catch (e) {
    console.log('Error ' + e);
    return null;
  }



}


const imageProcessing = async (downloadableUrl, access_token, type) => {
  //Fetching text values from images
  const form = new FormData();
  // form.append('sampleLocation', 'https://www.publicdomainpictures.net/pictures/240000/velka/emergency-evacuation-route-signpost.jpg');
  form.append('sampleLocation', downloadableUrl);
  form.append('task', 'contact');
  form.append('modelId', 'OCRModel');

  let imageResponse = await fetch('https://api.einstein.ai/v2/vision/ocr', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
    body: form
  });
  let imageJSON = await imageResponse.json();
  console.log(JSON.stringify(imageJSON.probabilities) + "Hello");
  if(type === 'aadhaarFront'){
    return aadhaarCardFront(imageJSON);
  }
  else if(type === 'aadhaarBack'){
    return aadhaarCardBack(imageJSON);
  }
  else if(type === 'panCard'){
    return panCardBack(imageJSON);
  }
}

const panCardBack =  (imageJSON) => {
  const panCardRegex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
      const nameRegex = /^[A-Z \W]+$/;
      let panNumber = '';
      let nameArr = [];
      let nameVal = '';
      for (let i of imageJSON.probabilities) {
        if(panCardRegex.test(i.label)){
          panNumber = i.label;
        }
        if(nameRegex.test(i.label) && !((i.label.toLowerCase()).includes('income')) && !((i.label.toLowerCase()).includes('govt'))){
          nameArr.push(i);
        }
      }

      if(nameArr.length>0){
        nameArr.sort((a,b) => a.boundingBox.minY - b.boundingBox.minY);
        nameVal = nameArr[0].label;
      }
      return {panNum : panNumber, panName : nameVal};
}

const aadhaarCardBack =  (imageJSON) => {
  let addressArray = [];
  let address = '';

  for (let i of imageJSON.probabilities) {
    if(i.attributes.tag === 'ADDRESS'){
      addressArray.push(i);
    }
    
  }
  addressArray.sort((a,b) => a.boundingBox.minY - b.boundingBox.minY || a.boundingBox.minX - b.boundingBox.minX);

  for(let i of addressArray){
    address += i.label;
  }
  return {address : address};
}

const aadhaarCardFront =  (imageJSON) => {
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
    aadhaarVal.sort((a, b) => a.probability - b.probability || a.boundingBox.minX - b.boundingBox.minX);
    for (let i = aadhaarVal.length - 1; i >= 0; i--) {
      aadhaarEntireNum += aadhaarVal[i].label;

      if (aadhaarEntireNum.length >= 12) {
        break;
      }
    }
  }

  return { aadhaarName: nameVal, aadhaarNum: aadhaarEntireNum };
}
