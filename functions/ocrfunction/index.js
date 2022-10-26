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

const require = createRequire(import.meta.url);


export default async function (event, context, logger) {
  logger.info(`Invoking Ocrfunction with payload`);

  // getting neccessary modules for JWT 
  const dotenv = require('dotenv');
  const jwt = require('jsonwebtoken');
  const fs = require('fs'); 


  logger.info(`Invoking Ocrfunction with payload`);

  //Generating payload
  let payload = {
    "sub": 'ajiteshpratap.singh@salesforce.com',
    "aud": "https://api.einstein.ai/v2/oauth2/token",
    "exp": (Math.floor( Date.now() / 1000) + 600), 
  };

  const key = readFileSync('einstein_platform_check.pem');
  
  // Signing token
  const token = jwt.sign(payload, key, { algorithm: 'RS256' });

  console.log('token ' + token);

  let response = await fetch('https://api.einstein.ai/v2/oauth2/token', {
    method : 'POST',
    headers : {
      'Content-type' : 'application/x-www-form-urlencoded'
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`
  });
  let responseJSON = await response.json();
  console.log('Response ' + JSON.stringify(responseJSON));

  return null;
}
