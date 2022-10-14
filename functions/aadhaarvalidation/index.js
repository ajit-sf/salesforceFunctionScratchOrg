/**
 * Describe Aadhaarvalidation here.
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
  //logger.info(`Invoking Aadhaarvalidation with payload ${JSON.stringify(event.data || {})}`);

  // get the client
  const mysql = require('mysql2/promise');

  logger.info(`Client fetched successfully ${mysql}`);

  // fetch payload
  const aadhaarNo = event.data.aadhaar;

  // create the connection
  const connection = await mysql.createConnection({host:'sql6.freesqldatabase.com', user: 'sql6526424', database: 'sql6526424', password : 'lVzTKiTViU'});

  logger.info(`Received connection ${connection}`);

  // query database
  const [rows, fields] = await connection.execute(`SELECT * FROM 'Address Proofs' WHERE aadhaar = "${aadhaarNo}"`);

  if(rows.length > 0){
    return {state : 'success'};
  }
  else{
    return {state : 'error'};
  }

}
