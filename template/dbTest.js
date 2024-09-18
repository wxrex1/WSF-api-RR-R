const { Client } = require('pg');

// Database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString: connectionString,
});

client
  .connect()
  .then(() => {
    console.log('Connected to the database');
    return client.query('SELECT NOW()');
  })
  .then((result) => {
    console.log('Current timestamp from database:', result.rows[0]);
    client.end();
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
    client.end();
  });
