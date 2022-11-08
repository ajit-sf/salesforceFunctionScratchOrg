/**
 * Describe Cibilscorefunction here.
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
  // get the client
  const mysql = require('mysql2/promise');

  var score;

  logger.info(`Client fetched successfully ${mysql}`);

  // create the connection
  const connection = await mysql.createConnection({host:'sql6.freesqldatabase.com', user: 'sql6526424', database: 'sql6526424', password : 'lVzTKiTViU'});

  logger.info(`Received connection ${connection}`);
  
  const [rows, fields] = await connection.execute(`SELECT * FROM ` + '`cibilScore`');
  //`SELECT * FROM cibilScore`
  console.log('query data '+rows);

  logger.info(`Received connection ${rows}`);

  if(rows.length > 0){
    return rows[0].score;
  }
  else{
    return 'Failed';
  }
}
