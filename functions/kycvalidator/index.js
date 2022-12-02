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

 import {Client} from 'pg';

export default async function (event, context, logger) {
  const username = event.data.creds.user;
  const host = event.data.creds.host;
  const password = event.data.creds.password;
  const database = event.data.creds.database;
  const port = event.data.creds.port;
  
  const client = new Client({
    user: username,
    host: host,
    database: database,
    password: password,
    port: port
    });
    await client.connect();

    console.log(client + 'client info');

}
