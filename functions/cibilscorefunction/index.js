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

  logger.info(`Client fetched successfully ${mysql}`);

  // create the connection
  const connection = await mysql.createConnection({host:'sql12.freesqldatabase.com', user: 'sql12529671', database: 'sql12529671', password : 'nP3DxbcQJX'});

  logger.info(`Received connection ${connection}`);

  // query database
  connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT score FROM cibilScore", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
  });
});
  /*const rows = await connection.execute(`SELECT score FROM cibilScore`);
  console.log('query data '+rows);

  if(rows.length > 0){
    return rows;
  }
  else{
    return 'error';
  }*/
  return result;
}
