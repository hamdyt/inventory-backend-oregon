module.exports.handler = async (event, _context) => {
  try {
    // get param from body
    const {
      player_id,
      product_id,
      number,
      size,
      quantity,
      discount
    } = JSON.parse(event.body);

    // connect mysql
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    // insert order
    await connection.execute(
      'INSERT INTO `order`(`number`, player_id) VALUES (?, ?)',
      [number, player_id]
    );

    const [orders] = await connection.execute(
      'SELECT LAST_INSERT_ID() AS order_id;'
    );

    const { order_id } = orders[0];

    // order detail
    await connection.execute(
      'INSERT INTO order_detail(size, discount, quantity, order_id, product_id) VALUES (?, ?, ?, ?, ?)',
      [size, discount, quantity, order_id, product_id]
    );

    const [details] = await connection.execute(
      'SELECT LAST_INSERT_ID() AS detail_id;'
    );

    const { detail_id } = details[0];

    await connection.end();

    // response
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': process.env.APP_DOMAIN,
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        id: order_id,
        player_id,
        product_id,
        number,
        size,
        quantity,
        discount,
        detail_id
      })
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
