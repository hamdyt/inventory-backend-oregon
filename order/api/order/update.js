module.exports.handler = async (event, _context) => {
  try {
    // get param from body
    const {
      id,
      detail_id,
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

    // update order
    await connection.execute(
      `
        UPDATE \`order\`
        SET
          player_id = ?,
          number = ?
        WHERE id = ?
      `,
      [player_id, number, id]
    );

    // update order detail
    await connection.execute(
      `
        UPDATE order_detail
        SET
          product_id = ?,
          size = ?,
          quantity = ?,
          discount = ?
        WHERE id = ?
      `,
      [product_id, size, quantity, discount, detail_id]
    );

    await connection.end();

    // response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.APP_DOMAIN,
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        id,
        detail_id,
        player: player_id,
        product: product_id,
        number,
        size,
        quantity,
        discount
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
