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
  const username = event.data.creds.user;
  const host = event.data.creds.host;
  const password = event.data.creds.password;
  const database = event.data.creds.database;
  const port = event.data.creds.port;

  
  const {Client} = require('pg');
  const client = new Client({
    connectionString: 'postgres://mfpibdyonqmjlh:256381ccec702257f70e5d73cfe279a1a82bf8a0d4c68647ab5ba9cd51914511@ec2-54-173-77-184.compute-1.amazonaws.com:5432/d2ip5p67bmcspn',
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log(client + 'client 123');
  await client.connect();
  console.log(client + 'client 123');
  let res = await client.query("SELECT aadhaar_card_no, pan_card_no, cibil_score FROM kyc_validator");
  console.log(res + 'res 123');

  console.log(' Username V1 ' + username);
  console.log(' host V1 ' + host);
  console.log(' password V1 ' + password);
  console.log(' database V1 ' + database);
  console.log(' port V$alesforce1231 ' + port);

}
