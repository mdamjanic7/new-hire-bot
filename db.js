var pg = require('pg');

var constants = require('./constants.js');

pg.defaults.ssl = true;

var config = {
  user: constants.POSTGRES_USER,
  database: constants.POSTGRES_DATABASE,
  password: constants.POSTGRES_PASSWORD,
  host: constants.POSTGRES_HOST,
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

module.exports.query = (text, values, func) => {
  console.log('query:', text, values)
  return pool.query(text, values, func)
}

module.exports.initialize = () => {
  pool.query('CREATE TABLE IF NOT EXISTS teams (team_id TEXT PRIMARY KEY, team_name TEXT NOT NULL, access_token TEXT, scope TEXT, user_id TEXT, bot_user_id TEXT, bot_access_token TEXT);');
  // pool.query('CREATE TABLE IF NOT EXISTS channels (team_id TEXT REFERENCES teams, channel_id TEXT, PRIMARY KEY(team_id, channel_id));');
  pool.query('CREATE TABLE IF NOT EXISTS users (team_id TEXT REFERENCES teams, channel_id TEXT, user_id TEXT, PRIMARY KEY(team_id, channel_id, user_id));');
}

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack);
})
