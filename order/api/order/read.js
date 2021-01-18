module.exports.handler = async (event, _context) => {
  try {
    const { number } = event.queryStringParameters;

    // connect mysql
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    const query =
      `
      SELECT 
        o.id,
        o.ordered_at,
        o.number,
        o.player_id,
        pl.first_name,
        pl.last_name,
        pl.email,
        od.id AS detail_id,
        od.size,
        od.discount ,
        od.quantity,
        od.product_id,
        pd.name,
        pd.description,
        pd.status,
        pd.supplier,
        pd.quantity as product_quantity
      FROM \`order\` o
      INNER JOIN player pl
      ON pl.id = o.player_id 
      INNER JOIN order_detail od
      ON o.id = od.order_id 
      INNER JOIN product pd
      ON pd.id = od.product_id 
    ` + (number ? `AND o.number = '${number}'` : '');

    // get data
    const [rows] = await connection.execute(query);

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
