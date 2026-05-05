require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

module.exports = {
  dev: {
    driver: 'pg',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: false
  }
};
