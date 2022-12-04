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


  
  const {Client} = require('pg');
  const client = new Client({
    connectionString: databaseUri,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log(client + 'client 123');
  await client.connect();
  console.log(client + 'client 123');
  let res = await client.query("SELECT aadhaar_card_no, pan_card_no, cibil_score FROM kyc_validator");
  console.log(JSON.stringify(res) + 'res 123');

  console.log(' Username V1 ' + username);
  console.log(' host V1 ' + host);
  console.log(' password V1 ' + password);
  console.log(' database V1 ' + database);
  console.log(' port V$alesforce1231 ' + port);

}
