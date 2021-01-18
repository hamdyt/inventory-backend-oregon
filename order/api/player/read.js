module.exports.handler = async (_event, _context) => {
  try {
    // connect mysql
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    // get data
    const [rows] = await connection.execute('SELECT * FROM player');

    await connection.end();

    // response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.APP_DOMAIN,
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(rows)
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.APP_DOMAIN,
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: e.message })
    };
  }
};
