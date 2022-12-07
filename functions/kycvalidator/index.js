/**
 * Describe Kycvalidator here.
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

 const require = createRequire(import.meta.url);

export default async function (event, context, logger) {
  const databaseUri = event.data.creds.databaseUri;
  const aadhaarCardNo = event.data.aadhaarNo;
  const panCardNo = event.data.panCardNo;

  const aadhaarName = event.data.aadhaarName;
  const firstName = event.data.firstName;
  const lastName = event.data.lastName;

  let isAddharVerfied = false;
  let isPanVerfied = false;
  let cibilScore = 0;


  
  const {Client} = require('pg');
  const client = new Client({
    connectionString: databaseUri,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();
  
  let res = await client.query(`SELECT aadhaar_card_no, pan_card_no, cibil_score FROM kyc_validator where aadhaar_card_no='${aadhaarCardNo}' AND pan_card_no='${panCardNo}'`);
  
  if(res.rowCount > 0){
    isAddharVerfied = true;
    isPanVerfied = true;
    cibilScore = res.rows[0].cibil_score;
  }

  const stringSimilarity = require("string-similarity");

  let matchingProbability = stringSimilarity.compareTwoStrings(aadhaarName, (firstName + ' ' + lastName));
  await client.end(); 
  return {isAddharVerfied : isAddharVerfied, isPanVerfied : isPanVerfied, matchingProbability : matchingProbability, cibilScore : cibilScore};

}
