/**
 * Describe Kycvalidatorv1 here.
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

 import { Client } from "pg";

 const ClientH = Client;

export default async function (event, context, logger) {
  const username = event.data.creds.user;
  const host = event.data.creds.host;
  const password = event.data.creds.password;
  const database = event.data.creds.database;
  const port = event.data.creds.port;

  // const client = new ClientH('postgres://mfpibdyonqmjlh:256381ccec702257f70e5d73cfe279a1a82bf8a0d4c68647ab5ba9cd51914511@ec2-54-173-77-184.compute-1.amazonaws.com:5432/d2ip5p67bmcspn');
  const client = new ClientH({
    connectionString: 'postgres://mfpibdyonqmjlh:256381ccec702257f70e5d73cfe279a1a82bf8a0d4c68647ab5ba9cd51914511@ec2-54-173-77-184.compute-1.amazonaws.com:5432/d2ip5p67bmcspn',
  ssl: {
    rejectUnauthorized: false
  });
  await client.connect();
  let res = await client.query("SELECT aadhaar_card_no, pan_card_no, cibil_score FROM kyc_validator");
  console.log(res);

}