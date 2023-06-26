const { PORT = 3000, CONNECT_STRING = 'mongodb://127.0.0.1:27017/mestodb', JWT_SECRET = '4PgzIvqPt4i08qhHTg8MZCWruulpojs6' } = process.env;
const regex = /^(https?:\/\/)+[^\s]*/;

module.exports = {
  PORT,
  CONNECT_STRING,
  JWT_SECRET,
  regex,
};
