const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(
      `
      SELECT *
      FROM users
      WHERE users.email = $1;
      `,
      [email]
    )
    .then((result) => {
      console.log(result);
      return result.rows[0] || null;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(
      `
      SELECT *
      FROM users
      WHERE users.id = $1;
      `,
      [id]
    )
    .then((result) => {
      console.log(result);
      return result.rows[0] || null;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });

};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1,$2,$3)
      `,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      console.log(result);
      return result.rows[0] || null;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });

};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(
      `
      SELECT reservations.*,properties.*, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;
     `,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  const conditions = [];

  // City filter
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    conditions.push(`city LIKE $${queryParams.length}`);
  }

  // Owner ID filter
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    conditions.push(`owner_id = $${queryParams.length}`);
  }

  // Minimum price filter (in cents)
  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night) * 100);
    conditions.push(`cost_per_night >= $${queryParams.length}`);
  }

  // Maximum price filter (in cents)
  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night) * 100);
    conditions.push(`cost_per_night <= $${queryParams.length}`);
  }

  // Add WHERE clause
  if (conditions.length > 0) {
    queryString += `WHERE ${conditions.join(' AND ')}\n`;
  }

  // Grouping
  queryString += `GROUP BY properties.id\n`;

  // Minimum rating filter using COALESCE
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `HAVING COALESCE(AVG(property_reviews.rating), 0) >= $${queryParams.length}\n`;
  }

  // Ordering and limit
  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
                  LIMIT $${queryParams.length};`;

  // Debugging output
  console.log('QUERY STRING:', queryString);
  console.log('QUERY PARAMS:', queryParams);

  // Execute query
  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.error('Query Error:', err.message);
      throw err;
    });
};



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
